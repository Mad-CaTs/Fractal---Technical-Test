namespace backend.Models.DTOs
{
    public class ProductDto
    {
        public int id { get; set; }
        public string name { get; set; } = string.Empty;
        public decimal unitPrice { get; set; }
        public bool isActive { get; set; }
    }

    public class CreateProductDto
    {
        public string name { get; set; } = string.Empty;
        public decimal unitPrice { get; set; }
    }

    public class UpdateProductDto
    {
        public string name { get; set; } = string.Empty;
        public decimal unitPrice { get; set; }
        public bool isActive { get; set; }
    }
}
