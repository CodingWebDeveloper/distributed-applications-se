using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class Category : BaseEntity
    {
        public Category()
        {
            this.Events = new HashSet<Event>();
        }

        [Required]
        public string Name { get; set; }

        public ICollection<Event> Events { get; set; }
    }
}
