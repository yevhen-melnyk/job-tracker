namespace webapi.Responses;

public class ProgressResponse
{
    public DateTime? Start { get; set; }
    public DateTime? End { get; set; }
    public TimeSpan Remaining { get; set; }
    public double Percent { get; set; }
    public TimeSpan Duration { get; set; }

    public int ActionId { get; set; }
}