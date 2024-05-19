using AutoMapper;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly ApplicationContext dbContext;
        private readonly IMapper mapper;

        public FavoriteService(
            ApplicationContext dbContext,
            IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<bool> CheckIfFavoriteExistsAsync(CreateFavoriteDto dto)
        {
            var favoriteExists = await this.dbContext.Favorites
                .AnyAsync(f => f.UserId == dto.UserId && f.EventId == dto.EventId);

            return favoriteExists;
        }

        public async Task<int> CreateFavoriteAsync(CreateFavoriteDto dto)
        {
            var favorite = this.mapper.Map<CreateFavoriteDto, Favorite>(dto);

            var result = await this.dbContext.Favorites.AddAsync(favorite);
            await this.dbContext.SaveChangesAsync();

            return result.Entity.Id;
        }

        public async Task DeleteFavoriteAsync(CreateFavoriteDto dto)
        {
            var favorite = await this.dbContext.Favorites
                .FirstOrDefaultAsync(f => f.UserId == dto.UserId && f.EventId == dto.EventId);

            this.dbContext.Favorites.Remove(favorite);
            await this.dbContext.SaveChangesAsync();
        }
    }
}
