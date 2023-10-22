namespace webapi.Models
{
    public class Progress
    {
        public int Id { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public TimeSpan Remaining { get; set; }
        public double Percent { get; set; }
        public TimeSpan Duration { get; set; }

        public StepAction Action { get; set; }
    }
}