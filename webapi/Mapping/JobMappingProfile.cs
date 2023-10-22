using AutoMapper;
using webapi.Models;
using webapi.Requests;
using webapi.Responses;

public class JobMappingProfile : Profile
{
    public JobMappingProfile()
    {
        CreateMap<Job, JobResponse>();
        CreateMap<Step, StepResponse>();
        CreateMap<StepAction, ActionResponse>();
        CreateMap<Progress, ProgressResponse>()
            // get action id from parent
            .ForMember(dest => dest.ActionId, opt => opt.MapFrom(src => src.Action.Id)
            );

        CreateMap<JobCreateRequest, Job>();
        CreateMap<StepCreateRequest, Step>();
        CreateMap<ActionCreateRequest, StepAction>();

        CreateMap<Job, JobResponse>()
            .ForMember(dest => dest.Steps, opt => opt.MapFrom(src => src.Steps));

        CreateMap<Step, StepResponse>()
            .ForMember(dest => dest.Actions, opt => opt.MapFrom(src => src.Actions));

        CreateMap<ActionCreateRequest, StepAction>();
        //    .AfterMap((src, dest) =>
        //{
        //    if (dest.Progress == null)
        //    {
        //        dest.Progress = new Progress();
        //    }
        //});

    }
}