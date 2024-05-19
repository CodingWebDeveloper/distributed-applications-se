using API.Attributes;
using API.Errors;
using Core.Dtos;
using Core.Interfaces;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [CustomAuthorize]
    public class FavoritesController : ApiController
    {
        private readonly IUserService userService;
        private readonly IEventService eventService;
        private readonly IFavoriteService favoriteService;

        public FavoritesController(
            IUserService userService,
            IEventService eventService,
            IFavoriteService favoriteService)
        {
            this.userService = userService;
            this.eventService = eventService;
            this.favoriteService = favoriteService;
        }

        [HttpPost]
        public async Task<IActionResult> AddToFavorites([FromBody] CreateFavoriteDto dto)
        {
            if (!await this.userService.CheckIfUserExistsAsync(dto.UserId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.USER_NOT_FOUND));
            }

            if (!await this.eventService.CheckIfEventExistsAsync(dto.EventId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_FOUND));
            }

            if (await this.favoriteService.CheckIfFavoriteExistsAsync(dto))
            {
                return this.Conflict(new ApiResponse(StatusCodes.Status409Conflict, Constants.FAVORITE_ALREADY_EXISTS));
            }

            var response = await this.favoriteService
                .CreateFavoriteAsync(dto);

            return this.Ok(response);
        }

        [HttpDelete("{userId}/{eventId}")]
        public async Task<IActionResult> RemoveFromFavorites([FromRoute] string userId, [FromRoute] int eventId)
        {
            var dto = new CreateFavoriteDto
            {
                UserId = userId,
                EventId = eventId,
            };

            if (!await this.userService.CheckIfUserExistsAsync(dto.UserId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.USER_NOT_FOUND));
            }

            if (!await this.eventService.CheckIfEventExistsAsync(dto.EventId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_FOUND));
            }

            if (!await this.favoriteService.CheckIfFavoriteExistsAsync(dto))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.FAVORITE_NOT_FOUND));
            }

            await this.favoriteService
                .DeleteFavoriteAsync(dto);

            return this.NoContent();
        }
    }
}
