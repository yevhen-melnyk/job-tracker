using Microsoft.AspNetCore.SignalR;
using webapi.Models;

namespace webapi.Hubs;
public class ProgressHub : Hub
{
    // well, we could also send requests to stop jobs via signalr later
}
