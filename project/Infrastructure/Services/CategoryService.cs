using AutoMapper;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationContext dbContext;
        private readonly IMapper mapper;

        public CategoryService(ApplicationContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<IReadOnlyList<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await this.dbContext.Categories
                .ToListAsync();

            var data = this.mapper.Map<IReadOnlyList<Category>, IReadOnlyList<CategoryDto>>(categories);

            return data;
        }
    }
}
