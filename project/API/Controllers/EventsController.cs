using API.Attributes;
using API.Errors;
using API.Extensions;
using Core.Dtos;
using Core.Entities.Identity;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [CustomAuthorize]
    public class EventsController : ApiController
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IUserService userService;
        private readonly IEventService eventService;

        public EventsController(
            UserManager<ApplicationUser> userManager,
            IUserService userService,
            IEventService eventService)
        {
            this.userManager = userManager;
            this.userService = userService;
            this.eventService = eventService;
        }

        [HttpGet("newest")]
        public async Task<ActionResult<IReadOnlyList<EventDto>>> GetNewestEvents()
        {
            var response = await this.eventService
                .GetNewestEventsAsync();

            return this.Ok(response);
        }

        [HttpGet("all")]
        public async Task<ActionResult<IReadOnlyList<EditEventDto>>> GetAllEvents()
        {
            var events = await this.eventService.GetAllEventsAsync();

            return this.Ok(events);
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<EventDto>>> GetEvents([FromQuery] EventSpecParams eventParams)
        {
            var user = await this.userManager
                .FindByEmailFromClaimsPrincipalAsync(this.User);

            var response = await this.eventService
                .GetEventsAsync(eventParams, user.Id);

            return this.Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EditEventDto>> GetEventToEditById([FromRoute] int id)
        {
            if (!await this.eventService.CheckIfEventExistsAsync(id))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_UPDATED));
            }

            var response = await this.eventService.GetEventToEditByIdAsync(id);

            return this.Ok(response);
        }
        
        [HttpGet("{id}/details")]
        public async Task<IActionResult> GetEventById([FromRoute] int id)
        {
            if (!await this.eventService.CheckIfEventExistsAsync(id))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_FOUND));
            }

            var response = await this.eventService
                .GetEventByIdAsync(id);

            return this.Ok(response);
        }

        [HttpGet("my-events")]
        public async Task<ActionResult<IReadOnlyList<EventDto>>> GetMyEvents()
        {
            var user = await this.userManager
                .FindByEmailFromClaimsPrincipalAsync(this.User);

            var response = await this.eventService
                .GetMyEventsAsync(user.Id);

            return this.Ok(response);
        }

        [HttpGet("my-favorites")]
        public async Task<ActionResult<IReadOnlyList<EventDto>>> GetMyFavorites()
        {
            var user = await this.userManager
                .FindByEmailFromClaimsPrincipalAsync(this.User);

            var response = await this.eventService
                .GetMyFavoritesAsync(user.Id);

            return this.Ok(response);
        }

        [CustomAuthorize(Constants.ADMINISTRATOR_ROLE)]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateEventDto eventDto)
        {
            var response = await this.eventService
                .CreateAsync(eventDto);

            if (response == null)
            {
                return this.BadRequest(new ApiResponse(StatusCodes.Status400BadRequest, Constants.EVENT_NOT_CREATED));
            }

            return this.Ok(response);
        }

        [CustomAuthorize(Constants.ADMINISTRATOR_ROLE)]
        [HttpPut]
        public async Task<IActionResult> Edit([FromForm] EditEventDto eventDto)
        {
            var response = await this.eventService.EditAsync(eventDto);

            if (response == null)
            {
                return this.BadRequest(new ApiResponse(StatusCodes.Status400BadRequest, Constants.EVENT_NOT_UPDATED));
            }

            return this.Ok(response);
        }

        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollUser([FromBody] EnrollUserDto enrollUserDto)
        {
            if (!await this.userService.CheckIfUserExistsAsync(enrollUserDto.UserId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.USER_NOT_FOUND));
            }

            if (!await this.eventService.CheckIfEventExistsAsync(enrollUserDto.EventId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_FOUND));
            }

            if (await this.eventService.CheckIsUserEnrolledAsync(enrollUserDto))
            {
                return this.Conflict(new ApiResponse(StatusCodes.Status409Conflict, Constants.USER_ENROLLED));
            }

            var response = await this.eventService
                .EnrollUserAsync(enrollUserDto);

            return this.Ok(response);
        }

        [HttpDelete("reject/{userId}/{eventId}")]
        public async Task<IActionResult> RejectUser([FromRoute] string userId, [FromRoute] int eventId)
        {
            EnrollUserDto enrollUserDto = new EnrollUserDto
            {
                UserId = userId,
                EventId = eventId,
            };

            if (!await this.userService.CheckIfUserExistsAsync(enrollUserDto.UserId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.USER_NOT_FOUND));
            }

            if (!await this.eventService.CheckIfEventExistsAsync(enrollUserDto.EventId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_FOUND));
            }

            if (!await this.eventService.CheckIsUserEnrolledAsync(enrollUserDto))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.USER_NOT_ENROLLED));
            }

            await this.eventService.RejectUserAsync(enrollUserDto);

            return this.NoContent();
        }

        [CustomAuthorize(Constants.ADMINISTRATOR_ROLE)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!await this.eventService.CheckIfEventExistsAsync(id))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_FOUND));
            }

            await this.eventService.DeleteAsync(id);

            return this.NoContent();
        }
    }
}
