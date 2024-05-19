using Core.Dtos;

namespace Core.Interfaces
{
    public interface IRecentService
    {
        Task<int> CreateOrUpdateRecentAsync(CreateRecentDto dto);
    }
}
