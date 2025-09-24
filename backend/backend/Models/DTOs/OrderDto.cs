using backend.Models.Enums;

namespace backend.Models.DTOs
{
    public class OrderDto
    {
        public int id { get; set; }
        public string orderNumber { get; set; } = string.Empty;
        public DateTime orderDate { get; set; }
        public OrderStatus status { get; set; }
        public int totalProducts { get; set; }
        public decimal finalPrice { get; set; }
        public List<OrderDetailDto> orderDetails { get; set; } = new List<OrderDetailDto>();
    }

    public class CreateOrderDto
    {
        public string orderNumber { get; set; } = string.Empty;
        public List<CreateOrderDetailDto> orderDetails { get; set; } = new List<CreateOrderDetailDto>();
    }

    public class UpdateOrderDto
    {
        public string orderNumber { get; set; } = string.Empty;
        public OrderStatus status { get; set; }
        public List<UpdateOrderDetailDto> orderDetails { get; set; } = new List<UpdateOrderDetailDto>();
    }
}
