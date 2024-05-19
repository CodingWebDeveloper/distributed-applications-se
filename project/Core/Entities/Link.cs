using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class Link : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Path { get; set; }

        [Required]
        public int EventId { get; set; }

        public Event Event { get; set; }
    }
}
