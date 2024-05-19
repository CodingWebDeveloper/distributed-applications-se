using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class Event : BaseEntity
    {
        public Event()
        {
            this.EnrolledUsers = new HashSet<UserEvent>();
            this.Favorites = new HashSet<Favorite>();
            this.Recents = new HashSet<Recent>();
            this.Links = new HashSet<Link>();
        }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        public int Duration { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        public string PresenterImage { get; set; }

        [Required]
        public string PresenterName { get; set; }

        [Required]
        public string PresenterRole { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public Category Category { get; set; }

        [Required]
        public int LevelId { get; set; }

        public Level Level { get; set; }

        public ICollection<UserEvent> EnrolledUsers { get; set; }

        public ICollection<Favorite> Favorites { get; set; }

        public ICollection<Recent> Recents { get; set; }

        public ICollection<Link> Links { get; set; }
    }
}
