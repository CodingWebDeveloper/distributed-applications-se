using Core.Dtos;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IEventService
    {
        Task<EventDto> CreateAsync(CreateEventDto dto);
        
        Task<EditEventDto> EditAsync(EditEventDto dto);

        Task DeleteAsync(int id);

        Task<int> EnrollUserAsync(EnrollUserDto dto);

        Task RejectUserAsync(EnrollUserDto dto);

        Task<bool> CheckIsUserEnrolledAsync(EnrollUserDto dto);

        Task<bool> CheckIfEventExistsAsync(int id);

        Task<EventDto> GetEventByIdAsync(int id);

        Task<IReadOnlyList< EditEventDto>> GetAllEventsAsync();
        
        Task<EditEventDto> GetEventToEditByIdAsync(int id);

        Task<Pagination<EventDto>> GetEventsAsync(EventSpecParams eventParams, string userId);

        Task<IReadOnlyList<EventDto>> GetMyEventsAsync(string userId);

        Task<IReadOnlyList<EventDto>> GetMyFavoritesAsync(string userId);

        Task<IReadOnlyList<EventDto>> GetNewestEventsAsync();
    }
}
