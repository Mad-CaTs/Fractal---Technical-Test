using backend.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Entities
{
    public class Order
    {
        [Key]
        public int id { get; set; }

        [Required]
        [StringLength(50)]
        public string orderNumber { get; set; } = string.Empty;

        [Required]
        public DateTime orderDate { get; set; } = DateTime.UtcNow;

        [Required]
        public OrderStatus status { get; set; } = OrderStatus.Pending;

        [NotMapped]
        public int totalProducts => orderDetails?.Sum(od => od.quantity) ?? 0;

        [NotMapped]
        public decimal finalPrice => orderDetails?.Sum(od => od.totalPrice) ?? 0;

        public DateTime createdAt { get; set; } = DateTime.UtcNow;
        public DateTime updatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<OrderDetail> orderDetails { get; set; } = new List<OrderDetail>();

    }
}
