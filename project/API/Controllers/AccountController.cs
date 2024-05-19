using API.Attributes;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Dtos;
using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : ApiController
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly ITokenService tokenService;
        private readonly IMapper mapper;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            ITokenService tokenService,
            IMapper mapper)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.roleManager = roleManager;
            this.tokenService = tokenService;
            this.mapper = mapper;
        }

        [HttpGet]
        [CustomAuthorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await this.userManager
                .FindByEmailFromClaimsPrincipalAsync(this.User);

            IList<string> userRoles = await this.userManager.GetRolesAsync(user);

            return this.Ok(new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Token = this.tokenService.CreateToken(user, userRoles),
                DisplayName = user.DisplayName,
                Roles = userRoles
            });
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync(
            [FromQuery] string email)
        {
            return this.Ok(await this.userManager
                .FindByEmailAsync(email) != null);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await this.userManager
                .FindByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return this.Unauthorized(new ApiResponse(StatusCodes.Status401Unauthorized));
            }

            var result = await this.signInManager
                .CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded)
            {
                return this.Unauthorized(new ApiResponse(StatusCodes.Status401Unauthorized));
            }

            IList<string> userRoles = await this.userManager.GetRolesAsync(user);

            return this.Ok(new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Token = this.tokenService.CreateToken(user, userRoles),
                DisplayName = user.DisplayName,
                Roles = userRoles
            });
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await this.userManager
                .FindByEmailAsync(registerDto.Email) != null)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse
                {
                    Errors = new[] { "Email address is already in use" }
                });
            }

            var user = new ApplicationUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
            };

            var result = await this.userManager
                .CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return this.BadRequest(new ApiResponse(StatusCodes.Status400BadRequest));
            }

            string mappedRole = string.IsNullOrWhiteSpace(registerDto.Role) ? Constants.USER_ROLE : registerDto.Role;

            if (mappedRole != Constants.USER_ROLE)
            {
                await this.userManager.AddToRoleAsync(user, Constants.USER_ROLE);
            }

            if (!await this.roleManager.RoleExistsAsync(mappedRole))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.ROLE_NOT_FOUND));
            }

            await this.userManager.AddToRoleAsync(user, mappedRole);

            IList<string> userRoles = await this.userManager.GetRolesAsync(user);

            return this.Ok(new UserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Token = this.tokenService.CreateToken(user, userRoles),
                Email = user.Email,
                Roles = userRoles
            });
        }
    }
}
