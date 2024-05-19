using API.Attributes;
using API.Errors;
using Core.Dtos;
using Core.Interfaces;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [CustomAuthorize]
    public class LinksController : ApiController
    {
        private readonly IEventService eventService;
        private readonly ILinkService linkService;

        public LinksController(IEventService eventService, ILinkService linkService)
        {
            this.eventService = eventService;
            this.linkService = linkService;
        }

        [HttpGet("{eventId}")]
        public async Task<IActionResult> GetLinksByEventId([FromRoute] int eventId)
        {
            if (!await this.eventService.CheckIfEventExistsAsync(eventId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_FOUND));
            }

            var response = await this.linkService
                .GetLinksByEventIdAsync(eventId);

            return this.Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLink([FromBody] CreateLinkDto dto)
        {
            if (!await this.eventService.CheckIfEventExistsAsync(dto.EventId))
            {
                return this.NotFound(new ApiResponse(StatusCodes.Status404NotFound, Constants.EVENT_NOT_FOUND));
            }

            var response = await this.linkService
                .CreateLinkAsync(dto);

            if (response == null)
            {
                return this.BadRequest(new ApiResponse(StatusCodes.Status400BadRequest, Constants.LINK_NOT_CREATED));
            }

            return this.Ok(response);
        }
    }
}
