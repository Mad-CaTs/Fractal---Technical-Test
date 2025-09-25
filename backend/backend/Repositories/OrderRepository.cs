using backend.Data;
using backend.Models.Entities;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDBContext _context;

        public OrderRepository(AppDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _context.orders
                .Include(o => o.orderDetails)
                .ThenInclude(od => od.product)
                .ToListAsync();
        }

        public async Task<Order?> GetById(int id)
        {
            return await _context.orders.FindAsync(id);
        }

        public async Task<Order?> GetByIdWithDetails(int id)
        {
            return await _context.orders
                .Include(o => o.orderDetails)
                .ThenInclude(od => od.product)
                .FirstOrDefaultAsync(o => o.id == id);
        }

        public async Task<Order> Create(Order order)
        {
            order.createdAt = DateTime.UtcNow;

            _context.orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<Order> Update(Order order)
        {
            order.updatedAt = DateTime.UtcNow;

            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<bool> Delete(int id)
        {
            var order = await _context.orders.FindAsync(id);
            if (order == null)
                return false;

            _context.orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Exists(int id)
        {
            return await _context.orders.AnyAsync(o => o.id == id);
        }
        public async Task<string> GenerateOrderNumber()
        {
            var lastOrder = await _context.orders
                .OrderByDescending(o => o.id)
                .FirstOrDefaultAsync();

            var nextNumber = lastOrder != null ? lastOrder.id + 1 : 1;
            return $"ORD-{nextNumber:D3}";
        }
    }
}