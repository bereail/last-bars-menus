namespace WebApplication1.Models.Dtos
{
    public class SectionGetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<CategoryDto> Categories { get; set; }
    }
}
