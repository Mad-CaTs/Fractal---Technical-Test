namespace backend.Models.DTOs
{
    public class OrderDetailDto
    {
        public int id { get; set; }
        public int productId { get; set; }
        public string productName { get; set; } = string.Empty;
        public int quantity { get; set; }
        public decimal unitPrice { get; set; }
        public decimal totalPrice { get; set; }
    }

    public class CreateOrderDetailDto
    {
        public int productId { get; set; }
        public int quantity { get; set; }
    }

    public class UpdateOrderDetailDto
    {
        public int id { get; set; }
        public int productId { get; set; }
        public int quantity { get; set; }
    }
}
