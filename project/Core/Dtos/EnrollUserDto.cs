using System.ComponentModel.DataAnnotations;

namespace Core.Dtos
{
    public class EnrollUserDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public int EventId { get; set; }
    }
}
