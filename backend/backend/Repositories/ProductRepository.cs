using backend.Data;
using backend.Models.Entities;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDBContext _context;

        public ProductRepository(AppDBContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _context.products.ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetActive()
        {
            return await _context.products
                .Where(p => p.isActive)
                .ToListAsync();
        }

        public async Task<Product?> GetById(int id)
        {
            return await _context.products.FindAsync(id);
        }
        public async Task<Product> Create(Product product)
        {
            product.createdAt = DateTime.UtcNow;

            _context.products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> Update(Product product)
        {
            product.updatedAt = DateTime.UtcNow;

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return product;
        }
        public async Task<bool> Delete(int id)
        {
            var product = await _context.products.FindAsync(id);
            if (product == null)
                return false;

            product.isActive = false;
            product.updatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Exists(int id)
        {
            return await _context.products.AnyAsync(p => p.id == id);
        } 
    }
}
