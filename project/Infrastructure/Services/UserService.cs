using Core.Interfaces;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationIdentityDbContext identityDbContext;

        public UserService(ApplicationIdentityDbContext identityDbContext)
        {
            this.identityDbContext = identityDbContext;
        }

        public async Task<bool> CheckIfUserExistsAsync(string id)
        {
            var userExists = await this.identityDbContext.Users
                .AnyAsync(u => u.Id == id);

            return userExists;
        }
    }
}
