namespace webapi.Requests
{
    public class JobCreateRequest
    {
        public string Title { get; set; }
        public List<StepCreateRequest> Steps { get; set; }
    }
}