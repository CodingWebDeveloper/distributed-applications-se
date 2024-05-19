using System.ComponentModel.DataAnnotations;

namespace Core.Dtos
{
    public class CreateRecentDto
    {
        [Required]
        public DateTime CreatedOn { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public int EventId { get; set; }
    }
}
