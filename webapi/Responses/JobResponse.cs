using Microsoft.AspNetCore.Http;
using webapi.Models;

namespace webapi.Responses;

public class JobResponse
{
    public int Id { get; set; }
    public string Title { get; set; }
    public JobState State { get; set; }
    public List<StepResponse> Steps { get; set; }
}
