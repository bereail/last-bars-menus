namespace WebApplication1.Models.Dtos
{
    public class SectionMenuDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ProductMenuDetailsDto> Products { get; set; }
    }
}
