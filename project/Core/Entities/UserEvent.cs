using Core.Entities.Identity;
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class UserEvent : BaseEntity
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public int EventId { get; set; }

        public Event Event { get; set; }
    }
}
