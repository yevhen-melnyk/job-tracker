using System;

namespace webapi.Models
{
    public class StepAction
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public ActionState State { get; set; }
        public TimeSpan TimeConsume { get; set; }

        public int StepId { get; set; }
        public Step Step { get; set; }

        public int ProgressId { get; set; }
        public Progress Progress { get; set; }
    }
}