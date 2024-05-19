using AutoMapper;
using Core.Dtos;
using Core.Entities;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            this.CreateMap<Event, EventDto>()
                .ForMember(dto => dto.Participants, opt => opt.MapFrom(e => e.EnrolledUsers.Count()))
                .ForMember(dto => dto.Category, opt => opt.MapFrom(e => e.Category.Name));

            this.CreateMap<Event, EditEventDto>()
                .ForMember(dto => dto.PresenterImageUrl, opt => opt.MapFrom(e => e.PresenterImage))
                .ForMember(dto => dto.PresenterImage, opt => opt.Ignore());

            this.CreateMap<CreateEventDto, Event>();

            this.CreateMap<Category, CategoryDto>();

            this.CreateMap<Level, LevelDto>();

            this.CreateMap<EnrollUserDto, UserEvent>();

            this.CreateMap<CreateFavoriteDto, Favorite>();

            this.CreateMap<CreateRecentDto, Recent>();

            this.CreateMap<Link, LinkDto>();

            this.CreateMap<CreateLinkDto, Link>();
        }
    }
}
