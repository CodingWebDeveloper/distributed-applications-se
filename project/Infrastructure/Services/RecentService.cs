using AutoMapper;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class RecentService : IRecentService
    {
        private readonly ApplicationContext dbContext;
        private readonly IMapper mapper;

        public RecentService(ApplicationContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<int> CreateOrUpdateRecentAsync(CreateRecentDto dto)
        {
            var recentExists = await this.dbContext.Recents
                .AnyAsync(r => r.UserId == dto.UserId && r.EventId == dto.EventId);

            if (recentExists)
            {
                var recent = await this.dbContext.Recents
                    .FirstOrDefaultAsync(r => r.UserId == dto.UserId && r.EventId == dto.EventId);

                recent.CreatedOn = DateTime.UtcNow;
                this.dbContext.Recents.Update(recent);

                var result = await this.dbContext.SaveChangesAsync();

                return result;
            }
            else
            {
                var recent = this.mapper.Map<CreateRecentDto, Recent>(dto);

                var result = await this.dbContext.Recents.AddAsync(recent);
                await this.dbContext.SaveChangesAsync();

                return result.Entity.Id;
            }
        }
    }
}
