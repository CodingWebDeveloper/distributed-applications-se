
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System.Net;

namespace Infrastructure.Identity
{
    public class ApplicationIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (userManager.Users.Any())
            {
                return;
            }

            var user = new ApplicationUser
            {
                DisplayName = "Bob",
                Email = "bob@test.com",
                UserName = "bob@test.com",
            };

            var admin = new ApplicationUser
            {
                DisplayName = "Admin",
                Email = "admin@test.com",
                UserName = "admin@test.com",
            };

            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.CreateAsync(admin, "Pa$$w0rd");

            var userRole = new IdentityRole(Constants.USER_ROLE);
            var adminRole = new IdentityRole(Constants.ADMINISTRATOR_ROLE);

            await roleManager.CreateAsync(userRole);
            await roleManager.CreateAsync(adminRole);

            await userManager.AddToRoleAsync(user, Constants.USER_ROLE);
            await userManager.AddToRoleAsync(admin, Constants.USER_ROLE);
            await userManager.AddToRoleAsync(admin, Constants.ADMINISTRATOR_ROLE);
        }
    }
}
