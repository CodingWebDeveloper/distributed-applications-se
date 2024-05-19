namespace Core.Interfaces
{
    public interface IUserService
    {
        Task<bool> CheckIfUserExistsAsync(string id);
    }
}
