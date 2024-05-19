using API.Attributes;
using Core.Dtos;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [CustomAuthorize]
    public class LevelsController : ApiController
    {
        private readonly ILevelService levelService;

        public LevelsController(ILevelService levelService)
        {
            this.levelService = levelService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<LevelDto>>> List()
        {
            var response = await this.levelService
                .GetAllLevelsAsync();

            return this.Ok(response);
        }
    }
}
