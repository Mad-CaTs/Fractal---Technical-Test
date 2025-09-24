using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Entities
{
    public class OrderDetail
    {
        [Key]
        public int id { get; set; }

        [Required]
        public int orderId { get; set; }

        [Required]
        public int productId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal unitPrice { get; set; }

        [NotMapped]
        [Column(TypeName = "decimal(18,2)")]
        public decimal totalPrice => quantity * unitPrice;

        public DateTime createdAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("orderId")]
        public virtual Order order { get; set; } = null!;

        [ForeignKey("productId")]
        public virtual Product product { get; set; } = null!;
    }
}
