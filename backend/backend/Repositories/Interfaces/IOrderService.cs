using backend.Models.DTOs;
using backend.Models.Enums;

namespace backend.Repositories.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAll();
        Task<OrderDto?> GetById(int id);
        Task<OrderDto> Create(CreateOrderDto createOrderDto);
        Task<OrderDto?> Update(int id, UpdateOrderDto updateOrderDto);
        Task<bool> Delete(int id);
        Task<OrderDto?> UpdateStatus(int id, OrderStatus status);
        Task<bool> CanEditOrder(int id);
    }
}
