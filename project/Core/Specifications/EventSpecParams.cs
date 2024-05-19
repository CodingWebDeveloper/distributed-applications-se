namespace Core.Specifications
{
    public class EventSpecParams
    {
        private const int MaxPageSize = 50;

        public int PageIndex { get; set; } = 1;

        private int pageSize = 8;

        public int PageSize
        {
            get { return this.pageSize; }
            set { this.pageSize = value > MaxPageSize ? MaxPageSize : value; }
        }

        public string Sort { get; set; } = "titleAsc";

        private string search;

        public string Search
        {
            get { return this.search; }
            set { this.search = value.ToLower(); }
        }

        public string Filter { get; set; } = "all";

        public int Rating { get; set; } = 5;

        public List<int> CategoryIds { get; set; } = new List<int>();

        public List<int> LevelIds { get; set; } = new List<int>();
    }
}
