using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models.Dtos
{
    public class ProductPutDto
    {
        [Required]
        public string Name { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0.")]
        public decimal Price { get; set; }

        public string Description { get; set; }
    }
}
