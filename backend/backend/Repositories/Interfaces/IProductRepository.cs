using backend.Models.Entities;

namespace backend.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAll();
        Task<IEnumerable<Product>> GetActive();
        Task<Product?> GetById(int id);
        Task<Product> Create(Product product);
        Task<Product> Update(Product product);
        Task<bool> Delete(int id);
        Task<bool> Exists(int id);
    }
}
