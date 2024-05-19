using Core.Dtos;

namespace Core.Interfaces
{
    public interface ILinkService
    {
        Task<LinkDto> CreateLinkAsync(CreateLinkDto dto);

        Task<IReadOnlyList<LinkDto>> GetLinksByEventIdAsync(int eventId);
    }
}
