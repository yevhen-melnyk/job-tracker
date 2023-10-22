using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using webapi.Hubs;
using webapi.Models;
using webapi.Contexts;
using Microsoft.Extensions.Options;
using webapi.SignalR;
using Microsoft.Extensions.DependencyInjection;


public class JobWorkerService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ConcurrentDictionary<int, Progress> _relevantProgressDictionary;
    private readonly SemaphoreSlim _semaphore;
    private readonly ConcurrencySettings _settings;
    private readonly JobsBroadcastService _progressBroadcastService;
    private readonly ILogger<JobWorkerService> _logger;

    public JobWorkerService(IServiceProvider serviceProvider, IOptions<ConcurrencySettings> settings,
     JobsBroadcastService progressBroadcastService,
     ILogger<JobWorkerService> logger
     )
    {
        _logger?.LogInformation("Initializing JobWorkerService...");

        _serviceProvider = serviceProvider;
        _relevantProgressDictionary = new ConcurrentDictionary<int, Progress>();
        _settings = settings.Value;
        _progressBroadcastService = progressBroadcastService;
        _logger = logger;

        var config = serviceProvider.GetRequiredService<IConfiguration>();
        _semaphore = new SemaphoreSlim(settings.Value.MaxConcurrentJobs);

        _logger?.LogInformation("JobWorkerService initialized.");
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        _logger?.LogInformation("Executing JobWorkerService...");
        try
        {
            var jobTask = RunJobTask(cancellationToken);
            var periodicDBUpdateTask = RunProgressDBUpdateTask(cancellationToken);
            var periodicSignalRUpdateTask = RunProgressSignalRUpdateTask(cancellationToken);

            await Task.WhenAny(jobTask, periodicDBUpdateTask, periodicSignalRUpdateTask);
        }
        catch (Exception ex)
        {
            _logger?.LogError($"An error occurred: {ex.Message}", ex);
        }
        _logger?.LogInformation("JobWorkerService execution finished.");
    }

    private async Task RunJobTask(CancellationToken cancellationToken)
    {
        _logger?.LogInformation("Running JobTask...");

        while (!cancellationToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                try
                {
                    var runningJobTasks = new List<Task>();
                    var runningJobsIds = new List<int>();
                    var dbContext = scope.ServiceProvider.GetRequiredService<JobDBContext>();
                    var jobsToProcess = await dbContext.Jobs
                                                      .Where(j => j.State == JobStates.InProgress
                                                          && !runningJobsIds.Contains(j.Id))
                                                      .Take(_semaphore.CurrentCount)
                                                      .ToListAsync();

                    var allJobs = await dbContext.Jobs.ToListAsync();

                    foreach (var job in jobsToProcess)
                    {
                        var jobTask = ProcessJobAsync(job, cancellationToken);
                        _ = jobTask.ContinueWith(t => runningJobTasks.Remove(t));
                        runningJobTasks.Add(jobTask);
                        runningJobsIds.Add(job.Id);
                    }

                }
                catch (Exception ex)
                {
                    _logger?.LogError($"An error occurred: {ex.Message}", ex);
                }

                await Task.Delay(TimeSpan.FromMilliseconds(_settings.JobPollingInterval), cancellationToken);
            }
        }

        _logger?.LogInformation("JobTask finished.");
    }

    private async Task RunProgressDBUpdateTask(CancellationToken cancellationToken)
    {
        _logger?.LogInformation("Running ProgressUpdateTask...");

        using (var scope = _serviceProvider.CreateScope())
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                await _progressBroadcastService.BroadcastProgress(_relevantProgressDictionary);

                if (_relevantProgressDictionary.Count != 0)
                {
                    await UpdateDatabaseProgress();
                }

                await Task.Delay(TimeSpan.FromMilliseconds(_settings.JobDBUpdateInterval), cancellationToken);
            }
        }

        _logger?.LogInformation("ProgressUpdateTask finished.");
    }



    private async Task RunProgressSignalRUpdateTask(CancellationToken cancellationToken)
    {
        _logger?.LogInformation("Running ProgressSignalRUpdateTask...");

        using (var scope = _serviceProvider.CreateScope())
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                await _progressBroadcastService.BroadcastProgress(_relevantProgressDictionary);

                await Task.Delay(TimeSpan.FromMilliseconds(_settings.SignalRPushInterval), cancellationToken);
            }
        }

        _logger?.LogInformation("ProgressUpdateTask finished.");
    }

    private async Task ProcessJobAsync(Job job, CancellationToken stoppingToken)
    {
        _logger?.LogInformation($"Processing job {job.Id}...");

        await _semaphore.WaitAsync(stoppingToken);

        try
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                await ExecuteJob(job);
                await UpdateDatabaseProgress();
            }
        }
        finally
        {
            await _progressBroadcastService.BroadcastJobCompletion(job);
            _semaphore.Release();
        }

        _logger?.LogInformation($"Job {job.Id} processed.");
    }

    private async Task ExecuteJob(Job job)
    {
        _logger?.LogInformation($"Executing job {job.Id}...");
        using (var scope = _serviceProvider.CreateScope())
        {
            try
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<JobDBContext>();

                job.Started = DateTime.Now;
                dbContext.Jobs.Update(job);
                await dbContext.SaveChangesAsync();


                var stepsToExecute = dbContext.Steps
                    .Where(s => s.JobId == job.Id && s.State == StepState.Pending || s.State == StepState.InProgress)
                    .OrderBy(s => s.Index).ToList();
                foreach (var step in stepsToExecute)
                {
                    var stepStatus = await ExecuteStep(step);
                    var completedStates = (new List<StepState>() { StepState.Success, StepState.CompletedWithErrors, StepState.Failed });

                    if (stepStatus == StepState.Failed)
                    {
                        job.State = JobStates.Failed;
                        _ = _progressBroadcastService.BroadcastJobCompletion(job);
                        await dbContext.SaveChangesAsync();
                        return;
                    }
                }
                job.State = JobStates.Success;
                job.Finished = DateTime.Now;
                dbContext.Jobs.Update(job);
                await dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger?.LogError($"An error occurred: {ex.Message}", ex);
            }
        }

        _logger?.LogInformation($"Job {job.Id} executed.");
    }

    private async Task<StepState> ExecuteStep(Step step)
    {
        _logger?.LogInformation($"Executing step {step.Id}...");
        using (var scope = _serviceProvider.CreateScope())
        {
            try
            {
                var jobDBContext = scope.ServiceProvider.GetRequiredService<JobDBContext>();
                var actions = jobDBContext.Actions.Include("Step").Include("Progress")
                    .Where(a => a.StepId == step.Id && a.State == ActionState.InProgress).ToList();
                var actionTasks = actions.Select(action => ExecuteAction(action)).ToList();

                await Task.WhenAll(actionTasks);

                if (actionTasks.All(a => a.Result == ActionState.Success))
                {
                    step.State = StepState.Success;
                }
                else if (actionTasks.All(a => a.Result == ActionState.Failed))
                {
                    step.State = StepState.Failed;
                }
                else
                {
                    step.State = StepState.CompletedWithErrors;
                }

                await _progressBroadcastService.BroadcastStepCompletion(step);
                await jobDBContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                _logger?.LogError($"An error occurred: {ex.Message}", ex);
            }
        }
        _logger?.LogInformation($"Step {step.Id} executed. State: {step.State}");
        return step.State;
    }

    private async Task<ActionState> ExecuteAction(StepAction action)
    {
        _logger?.LogInformation($"Executing action {action.Id}...");
        using (var scope = _serviceProvider.CreateScope())
        {
            try
            {
                var jobDBContext = scope.ServiceProvider.GetRequiredService<JobDBContext>();
                var progress = action.Progress;
                progress.Remaining = action.TimeConsume;
                progress.Start = DateTime.Now;

                _relevantProgressDictionary.TryAdd(action.Id, progress);

                while (progress.Remaining > TimeSpan.Zero)
                {
                    await Task.Delay(_settings.ActionProgressUpdateInterval);
                    progress.Remaining -= TimeSpan.FromMilliseconds(_settings.ActionProgressUpdateInterval);
                    progress.Percent = (int)(((action.TimeConsume - progress.Remaining) / action.TimeConsume) * 100);
                    progress.Duration = action.TimeConsume - progress.Remaining;
                }
                progress.End = DateTime.Now;
                action.State = ActionState.Success;
                await _progressBroadcastService.BroadcastActionCompletion(action);

            }
            catch (Exception ex)
            {
                _logger?.LogError($"An error occurred: {ex.Message}", ex);
                action.State = ActionState.Failed;
            }
        }
        _logger?.LogInformation($"Action {action.Id} executed. State: {action.State}");
        return action.State;
    }

    private async Task UpdateDatabaseProgress()
    {
        _logger?.LogInformation("Updating database progress...");

        using (var scope = _serviceProvider.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<JobDBContext>();
            foreach (var entry in _relevantProgressDictionary)
            {
                var actionId = entry.Key;
                var progress = entry.Value;

                var action = await dbContext.Actions.FindAsync(actionId);
                if (action != null)
                {
                    action.Progress = progress;
                }
            }
            await dbContext.SaveChangesAsync();

            foreach (var key in _relevantProgressDictionary.Keys)
            {
                var progress = _relevantProgressDictionary[key];
                if (progress.Remaining <= TimeSpan.Zero)
                {
                    _relevantProgressDictionary.TryRemove(key, out _);
                }
            }
        }

        _logger?.LogInformation("Database progress updated.");
    }


}
