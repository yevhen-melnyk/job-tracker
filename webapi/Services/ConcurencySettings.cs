public class ConcurrencySettings
{
    public int MaxConcurrentJobs { get; set; }
    public int JobPollingInterval { get; set; }
    public int SignalRPushInterval { get; set; }
    public int JobDBUpdateInterval { get; set; }
    public int ActionProgressUpdateInterval { get; set; }
}