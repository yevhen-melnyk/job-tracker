using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Contexts
{
    public class JobDBContext : DbContext
    {
        public JobDBContext()
        {
        }
        public JobDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<Step> Steps { get; set; }
        public DbSet<StepAction> Actions { get; set; }
        public DbSet<Progress> Progresses { get; set; }

    }
}