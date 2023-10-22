namespace webapi.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public JobState State { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Started { get; set; }
        public DateTime? Finished { get; set; }
        public ICollection<Step>? Steps { get; set; }
    }
}