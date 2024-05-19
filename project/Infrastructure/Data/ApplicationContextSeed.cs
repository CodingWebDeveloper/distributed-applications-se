using Core.Entities;
using System.Reflection;
using System.Text.Json;

namespace Infrastructure.Data
{
    public class ApplicationContextSeed
    {
        public static async Task SeedAsync(ApplicationContext context)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            if (!context.Levels.Any())
            {
                var levelsData = File.ReadAllText(path + @"/Data/SeedData/levels.json");
                var levels = JsonSerializer.Deserialize<List<Level>>(levelsData);
                context.Levels.AddRange(levels);
            }

            if (context.ChangeTracker.HasChanges())
            {
                await context.SaveChangesAsync();
            }

            if (!context.Categories.Any())
            {
                var categoriesData = File.ReadAllText(path + @"/Data/SeedData/categories.json");
                var categories = JsonSerializer.Deserialize<List<Category>>(categoriesData);
                context.Categories.AddRange(categories);
            }

            if (context.ChangeTracker.HasChanges())
            {
                await context.SaveChangesAsync();
            }

            if (!context.Events.Any())
            {
                var eventsData = File.ReadAllText(path + @"/Data/SeedData/events.json");
                var events = JsonSerializer.Deserialize<List<Event>>(eventsData);
                context.Events.AddRange(events);
            }

            if (context.ChangeTracker.HasChanges())
            {
                await context.SaveChangesAsync();
            }
        }
    }
}
