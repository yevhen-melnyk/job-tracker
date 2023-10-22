using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using webapi.Hubs;
using webapi.Models;
using webapi.Responses;

namespace webapi.SignalR;
public class JobsBroadcastService
{
    private readonly IHubContext<ProgressHub> _hubContext;
    private readonly IMapper _mapper;
    private readonly ILogger<JobsBroadcastService> _logger;
    public JobsBroadcastService(
            IHubContext<ProgressHub> hubContext, IMapper mapper, ILogger<JobsBroadcastService> logger)
    {
        _mapper = mapper;
        _hubContext = hubContext;
        _logger = logger;
    }

    // broadcast action completion
    public async Task BroadcastActionCompletion(StepAction action)
    {
        await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveActionCompletion.ToString(), action.Id, action.State);
    }

    // broadcast step completion 
    public async Task BroadcastStepState(Step step)
    {
        var stateNumber = (int)step.State;
        await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveStepCompletion.ToString(), step.Id, step.State);
    }

    // broadcast job completion
    public async Task BroadcastJobCompletion(Job job)
    {
        await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveJobCompletion.ToString(), job.Id, job.State);
    }

    public async Task BroadcastProgress(IDictionary<int, Progress> progressDictionary)
    {
        if (progressDictionary.Count == 0)
        {
            return;
        }

        var progressList = progressDictionary.Select(x => x.Value).ToList().Select(
                _mapper.Map<ProgressResponse>
            );
        await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveAllProgress.ToString(), progressList);
    }

    public async Task BroadcastJobAdded(Job job)
    {
        try {
            JobResponse jobResponse = _mapper.Map<JobResponse>(job);
            await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveJobAdded.ToString(), jobResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting job added", ex);
        }
        }

}