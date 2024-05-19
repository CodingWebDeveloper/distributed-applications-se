using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Core.Dtos
{
    public class CreateEventDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int Duration { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        public string PresenterName { get; set; }

        [Required]
        public string PresenterRole { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int LevelId { get; set; }

        [Required]
        public IFormFile Image { get; set; }

        [Required]
        public IFormFile PresenterImage { get; set; }
    }
}
