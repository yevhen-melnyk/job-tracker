using webapi.Models;

namespace webapi.Responses;
public class ActionResponse
{
    public int Id { get; set; }
    public string Title { get; set; }
    public ActionState State { get; set; }
    public TimeSpan TimeConsume { get; set; }
    public ProgressResponse Progress { get; set; }
}