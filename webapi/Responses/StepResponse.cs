using webapi.Models;

namespace webapi.Responses;
public class StepResponse
{
    public int Id { get; set; }
    public int Index { get; set; }
    public StepState State { get; set; }
    public List<ActionResponse> Actions { get; set; }
}