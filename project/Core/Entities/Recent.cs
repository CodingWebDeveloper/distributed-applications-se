using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class Recent : BaseEntity
    {
        [Required]
        public DateTime CreatedOn { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public int EventId { get; set; }

        public Event Event { get; set; }
    }
}
