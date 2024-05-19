using Core.Dtos;

namespace Core.Interfaces
{
    public interface ILevelService
    {
        Task<IReadOnlyList<LevelDto>> GetAllLevelsAsync();
    }
}
