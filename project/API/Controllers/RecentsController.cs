using API.Attributes;
using API.Errors;
using Core.Dtos;
using Core.Interfaces;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [CustomAuthorize]
    public class RecentsController : ApiController
    {
        private readonly IUserService userService;
        private readonly IEventService eventService;
        private readonly IRecentService recentService;

        public RecentsController(
            IUserService userService,
            IEventService eventService,
            IRecentService recentService)
        {
            this.userService = userService;
            this.eventService = eventService;
            this.recentService = recentService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate([FromBody] CreateRecentDto dto)
        {
            dto.CreatedOn = DateTime.UtcNow;

            if (!await this.userService.CheckIfUserExistsAsync(dto.UserId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.USER_NOT_FOUND));
            }

            if (!await this.eventService.CheckIfEventExistsAsync(dto.EventId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_FOUND));
            }

            var response = await this.recentService
                .CreateOrUpdateRecentAsync(dto);

            return this.Ok(response);
        }
    }
}
