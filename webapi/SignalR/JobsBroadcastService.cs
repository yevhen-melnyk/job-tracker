using Microsoft.AspNetCore.SignalR;
using webapi.Hubs;
using webapi.Models;

namespace webapi.SignalR;
public class JobsBroadcastService
{
    private readonly IHubContext<ProgressHub> _hubContext;
    public JobsBroadcastService(
            IHubContext<ProgressHub> hubContext)
    {
        _hubContext = hubContext;
    }

    // broadcast action completion
    public async Task BroadcastActionCompletion(StepAction action)
    {
        await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveActionCompletion.ToString(), action.Id, action.State);
    }

    // broadcast step completion 
    public async Task BroadcastStepCompletion(Step step)
    {
        await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveStepCompletion.ToString(), step.Id, step.State);
    }

    // broadcast job completion
    public async Task BroadcastJobCompletion(Job job)
    {
        await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveJobCompletion.ToString(), job.Id, job.State);
    }

    public async Task BroadcastProgress(IDictionary<int, Progress> progressDictionary)
    {
        await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveAllProgress.ToString(), progressDictionary);
    }

    public async Task BroadcastJobAdded(Job job)
    {
        await _hubContext.Clients.All.SendAsync(MessageTypesEnum.ReceiveJobAdded.ToString(), job);
    }

}