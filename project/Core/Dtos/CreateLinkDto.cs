using System.ComponentModel.DataAnnotations;

namespace Core.Dtos
{
    public class CreateLinkDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Path { get; set; }

        [Required]
        public int EventId { get; set; }
    }
}
