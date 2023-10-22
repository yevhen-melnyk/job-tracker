using Microsoft.AspNetCore.Mvc;
using webapi.Contexts;
using webapi.Models;
using webapi.Requests;
using webapi.Responses;
using AutoMapper;
using webapi.SignalR;
using Microsoft.EntityFrameworkCore;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly JobDBContext _context;
        private readonly IMapper _mapper;
        private readonly JobsBroadcastService _jobsBroadcastService;
        private readonly ILogger _logger;

        public JobsController(JobDBContext context,
                IMapper mapper,
                JobsBroadcastService jobsBroadcastService,
                ILogger<JobsController> logger
            )
        {
            _context = context;
            _mapper = mapper;
            _jobsBroadcastService = jobsBroadcastService;
        }

        [HttpPost]
        public ActionResult<Job> AddJob(JobCreateRequest jobInput)
        {
            var job = _mapper.Map<Job>(jobInput);

            _context.Jobs.Add(job);

            // map all actions to have progresses
            // todo: move to mapper profile
            foreach (var step in job.Steps)
            {
                foreach (var action in step.Actions)
                {
                    action.Progress = new Progress();
                }
            }


            _context.SaveChanges();

            var jobResponse = _mapper.Map<JobResponse>(job);

            // not too fancy to do it here though.
            Task.Run(async () => await _jobsBroadcastService.BroadcastJobAdded(job));

            return CreatedAtAction(nameof(AddJob), new { id = jobResponse.Id }, jobResponse);

        }

        [HttpGet]
        public ActionResult<IEnumerable<JobResponse>> GetJobs()
        {
            // select jobs with steps with actions
            var jobs = _context.Jobs
                .Include(j => j.Steps)
                .ThenInclude(s => s.Actions)
                .ThenInclude(a => a.Progress)
                .ToList();

            var jobResponses = _mapper.Map<IEnumerable<JobResponse>>(jobs);

            return Ok(jobResponses);
        }
    }
}
