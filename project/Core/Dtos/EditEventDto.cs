using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Dtos
{
    public class EditEventDto
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int LevelId { get; set; }

        [Required]
        public string PresenterName { get; set; }

        [Required]
        public string PresenterRole { get; set; }

        [Required]
        public int Duration { get; set; }

        [Required]
        public string Location { get; set; }

        public string ImageUrl { get; set; }

        public IFormFile Image { get; set; }

        public string PresenterImageUrl { get; set; }

        public IFormFile PresenterImage { get; set; }
    }
}
