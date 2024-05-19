using AutoMapper;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class LinkService : ILinkService
    {
        private readonly ApplicationContext dbContext;
        private readonly IMapper mapper;

        public LinkService(
            ApplicationContext dbContext,
            IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<LinkDto> CreateLinkAsync(CreateLinkDto dto)
        {
            var link = this.mapper.Map<CreateLinkDto, Link>(dto);

            var result = await this.dbContext.Links.AddAsync(link);
            await this.dbContext.SaveChangesAsync();

            return this.mapper.Map<Link, LinkDto>(result.Entity);
        }

        public async Task<IReadOnlyList<LinkDto>> GetLinksByEventIdAsync(int eventId)
        {
            IReadOnlyList<Link> links = await this.dbContext.Links
                .Where(l => l.EventId == eventId)
                .ToListAsync();

            var data = this.mapper.Map<IReadOnlyList<Link>, IReadOnlyList<LinkDto>>(links);

            return data;
        }
    }
}
