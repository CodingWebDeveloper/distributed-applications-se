using AutoMapper;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class LevelService : ILevelService
    {
        private readonly ApplicationContext dbContext;
        private readonly IMapper mapper;

        public LevelService(ApplicationContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<IReadOnlyList<LevelDto>> GetAllLevelsAsync()
        {
            var levels = await this.dbContext.Levels
                .ToListAsync();

            var data = this.mapper.Map<IReadOnlyList<Level>, IReadOnlyList<LevelDto>>(levels);
            
            return data;
        }
    }
}
