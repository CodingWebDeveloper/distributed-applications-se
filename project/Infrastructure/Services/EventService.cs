using AutoMapper;
using CloudinaryDotNet.Actions;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Ganss.Xss;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Services
{
    public class EventService : IEventService
    {
        private readonly IMapper mapper;
        private readonly ICloudinaryService cloudinaryService;
        private readonly ApplicationContext dbContext;

        public EventService(ApplicationContext dbContext, IMapper mapper, ICloudinaryService cloudinaryService)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.cloudinaryService = cloudinaryService;
        }

        public async Task<bool> CheckIfEventExistsAsync(int id)
        {
            var eventExists = await this.dbContext.Events
                .AnyAsync(e => e.Id == id);

            return eventExists;
        }

        public async Task<bool> CheckIsUserEnrolledAsync(EnrollUserDto dto)
        {
            var userEnrolled = await this.dbContext.UserEvents
                .AnyAsync(ue => ue.UserId == dto.UserId && ue.EventId == dto.EventId);

            return userEnrolled;
        }

        public async Task<EventDto> CreateAsync(CreateEventDto dto)
        {
            var dbEvent = this.mapper.Map<CreateEventDto, Event>(dto);
            dbEvent.ImageUrl = this.cloudinaryService.Upload(dto.Image);
            dbEvent.PresenterImage = this.cloudinaryService.Upload(dto.PresenterImage);
            var sanitizer = new HtmlSanitizer();
            dbEvent.Description = sanitizer.Sanitize(dto.Description);
            var entity = await this.dbContext.Events.AddAsync(dbEvent);
            await this.dbContext.SaveChangesAsync();

            return this.mapper.Map<Event, EventDto>(entity.Entity);
        }

        public async Task<int> EnrollUserAsync(EnrollUserDto dto)
        {
            var userEvent = this.mapper.Map<EnrollUserDto, UserEvent>(dto);

            var entity = await this.dbContext.AddAsync(userEvent);
            await this.dbContext.SaveChangesAsync();

            return entity.Entity.Id;
        }

        public async Task<EventDto> GetEventByIdAsync(int id)
        {
            var dbEvent = await this.dbContext.Events
                .Include(e => e.Links)
                .FirstOrDefaultAsync(e => e.Id == id);

            var result = this.mapper.Map<Event, EventDto>(dbEvent);

            return result;
        }
        
        public async Task<Pagination<EventDto>> GetEventsAsync(EventSpecParams eventParams, string userId)
        {
            var query = this.dbContext.Events
                .Include(e => e.EnrolledUsers)
                .Include(e => e.Favorites)
                .Include(e => e.Recents)
                .Include(e => e.Links)
                .Include(e => e.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(eventParams.Search))
            {
                query = query
                    .Where(e =>
                    e.Title.ToLower().Contains(eventParams.Search.ToLower()) ||
                    e.Description.ToLower().Contains(eventParams.Search.ToLower()));
            }

            if (eventParams.CategoryIds.Count() > 0)
            {
                query = query
                    .Where(e => eventParams.CategoryIds.Contains(e.CategoryId));
            }

            if (eventParams.LevelIds.Count() > 0)
            {
                query = query
                    .Where(e => eventParams.LevelIds.Contains(e.LevelId));
            }

            if (eventParams.Filter == "upcoming")
            {
                query = query
                    .Where(e => e.Date > DateTime.UtcNow);
            }
            else if (eventParams.Filter == "past")
            {
                query = query
                   .Where(e => e.Date <= DateTime.UtcNow);
            }
            else if (eventParams.Filter == "attending")
            {
                query = query
                    .Where(e => e.EnrolledUsers.Any(eu => eu.UserId == userId));
            }
            else if (eventParams.Filter == "favorites")
            {
                query = query
                    .Where(e => e.Favorites.Any(f => f.UserId == userId));
            }
            else if (eventParams.Filter == "recent")
            {
                query = query
                    .Where(e => e.Recents.Any(r => r.UserId == userId));
            }

            int totalCount = query.Count();

            IReadOnlyList<Event> events = await query
                .Skip((eventParams.PageIndex - 1) * eventParams.PageSize).Take(eventParams.PageSize)
                .ToListAsync();

            var data = this.mapper.Map<IReadOnlyList<Event>, IReadOnlyList<EventDto>>(events);

            return new Pagination<EventDto>(eventParams.PageIndex, eventParams.PageSize, totalCount, data);
        }

        public async Task<IReadOnlyList<EditEventDto>> GetAllEventsAsync()
        {
            var dbEvents = await this.dbContext.Events.ToListAsync();
            var events = this.mapper.Map<IReadOnlyList<Event>, IReadOnlyList<EditEventDto>>(dbEvents);

            return events;
        }

        public async Task<IReadOnlyList<EventDto>> GetMyEventsAsync(string userId)
        {
            IReadOnlyList<Event> events = await this.dbContext.Events
                .Include(e => e.EnrolledUsers)
                .Where(e => e.EnrolledUsers.Any(eu => eu.UserId == userId))
                .ToListAsync();

            var data = this.mapper.Map<IReadOnlyList<Event>, IReadOnlyList<EventDto>>(events);
            return data;
        }

        public async Task<IReadOnlyList<EventDto>> GetMyFavoritesAsync(string userId)
        {
            IReadOnlyList<Event> events = await this.dbContext.Events
                .Include(e => e.Favorites)
                .Where(e => e.Favorites.Any(f => f.UserId == userId))
                .ToListAsync();

            var data = this.mapper.Map<IReadOnlyList<Event>, IReadOnlyList<EventDto>>(events);
            return data;
        }

        public async Task RejectUserAsync(EnrollUserDto dto)
        {
            var userEvent = await this.dbContext.UserEvents
                .FirstOrDefaultAsync(ue => ue.UserId == dto.UserId && ue.EventId == dto.EventId);

            this.dbContext.UserEvents.Remove(userEvent);
            await this.dbContext.SaveChangesAsync();
        }

        public async Task<EditEventDto> EditAsync(EditEventDto dto)
        {
            var dbEvent = await this.dbContext.Events.FirstOrDefaultAsync(e => e.Id == dto.Id);
            var htmlSanitizer = new HtmlSanitizer();
            if (dbEvent != null)
            {
                dbEvent.Title = dto.Title;
                dbEvent.Description = htmlSanitizer.Sanitize(dto.Description);
                dbEvent.CategoryId = dto.CategoryId;
                dbEvent.LevelId = dto.LevelId;
                dbEvent.Date = dto.Date;
                dbEvent.Duration = dto.Duration;
                dbEvent.Location = dto.Location;
                dbEvent.PresenterName = dto.PresenterName;
                dbEvent.PresenterRole = dto.PresenterRole;

                if (dto.Image != null)
                {
                    dbEvent.ImageUrl = this.cloudinaryService.Upload(dto.Image);
                }

                if (dto.PresenterImage != null)
                {
                    dbEvent.PresenterImage = this.cloudinaryService.Upload(dto.PresenterImage);
                }

                await this.dbContext.SaveChangesAsync();
            }

             
            return this.mapper.Map<Event, EditEventDto>(dbEvent);
           
        }

        public async Task DeleteAsync(int id)
        {
            var dbEvent = await this.dbContext.Events.FirstOrDefaultAsync(e => e.Id == id);
            this.dbContext.Events.Remove(dbEvent);

            await this.dbContext.SaveChangesAsync();
        }

        public async Task<IReadOnlyList<EventDto>> GetNewestEventsAsync()
        {
            IReadOnlyList<Event> events = await this.dbContext.Events
                .OrderByDescending(e => e.Date)
                .Take(4)
                .ToListAsync();

            var data = this.mapper.Map<IReadOnlyList<Event>, IReadOnlyList<EventDto>>(events);

            return data;
        }

        public async Task<EditEventDto> GetEventToEditByIdAsync(int id)
        {
            var dbEvent = await this.dbContext.Events.FirstOrDefaultAsync(e => e.Id == id);
            var eventDto = this.mapper.Map<Event, EditEventDto>(dbEvent);

            return eventDto;
        }
    }
}
