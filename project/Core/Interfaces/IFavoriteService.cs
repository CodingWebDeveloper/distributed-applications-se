using Core.Dtos;

namespace Core.Interfaces
{
    public interface IFavoriteService
    {
        Task<bool> CheckIfFavoriteExistsAsync(CreateFavoriteDto dto);
        
        Task<int> CreateFavoriteAsync(CreateFavoriteDto dto);

        Task DeleteFavoriteAsync(CreateFavoriteDto dto);
    }
}
