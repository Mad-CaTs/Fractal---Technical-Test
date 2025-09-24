using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        public AppDBContext()
        {
        }

        // Entidades
        public DbSet<Product> products { get; set; }
        public DbSet<Order> orders { get; set; }
        public DbSet<OrderDetail> orderDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuracion de Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasIndex(p => p.name).IsUnique();
                entity.Property(p => p.name).IsRequired().HasMaxLength(100);
                entity.Property(p => p.unitPrice).HasPrecision(18, 2);
            });

            // Configuración de Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasIndex(o => o.orderNumber).IsUnique();
                entity.Property(o => o.orderNumber).IsRequired().HasMaxLength(50);
                entity.Property(o => o.status).HasConversion<int>();
            });

            // Configuracion de OrderDetail
            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.HasOne(od => od.order)
                      .WithMany(o => o.orderDetails)
                      .HasForeignKey(od => od.orderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(od => od.product)
                      .WithMany(p => p.orderDetails)
                      .HasForeignKey(od => od.productId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(od => od.unitPrice).HasPrecision(18, 2);              
            });
        }
    }
}
