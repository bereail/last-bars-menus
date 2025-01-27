namespace WebApplication1.Models.Dtos
{
    public class MenuDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<SectionMenuDetailsDto> Sections { get; set; }

    }
}
