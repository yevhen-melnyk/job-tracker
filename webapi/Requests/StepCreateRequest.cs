namespace webapi.Requests
{

    public class StepCreateRequest
    {
        public int Index { get; set; }
        public List<ActionCreateRequest> Actions { get; set; }
    }
}