namespace Core.Dtos
{
    public class EventDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public DateTime Date { get; set; }

        public int Participants { get; set; }

        public int Duration { get; set; }

        public string Location { get; set; }

        public string PresenterImage { get; set; }

        public string PresenterName { get; set; }

        public string PresenterRole { get; set; }

        public string Category { get; set; }

        public IReadOnlyList<LinkDto> Links { get; set; }
    }
}
