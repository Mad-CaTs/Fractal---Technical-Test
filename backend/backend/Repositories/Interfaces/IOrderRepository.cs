using backend.Models.Entities;

namespace backend.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAll();
        Task<Order?> GetById(int id);
        Task<Order?> GetByIdWithDetails(int id);
        Task<Order> Create(Order order);
        Task<Order> Update(Order order);
        Task<bool> Delete(int id);
        Task<bool> Exists(int id);
        Task<string> GenerateOrderNumber();
    }
}
