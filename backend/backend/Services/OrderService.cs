using AutoMapper;
using backend.Models.DTOs;
using backend.Models.Entities;
using backend.Models.Enums;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepository, IProductRepository productRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<OrderDto>> GetAll()
        {
            var orders = await _orderRepository.GetAll();
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<OrderDto?> GetById(int id)
        {
            var order = await _orderRepository.GetByIdWithDetails(id);
            return order != null ? _mapper.Map<OrderDto>(order) : null;
        }
        public async Task<OrderDto> Create(CreateOrderDto createOrderDto)
        {
            // Generar OrderNumber
            var orderNumber = await _orderRepository.GenerateOrderNumber();

            var order = new Order
            {
                orderNumber = orderNumber,
                orderDate = DateTime.UtcNow,
                status = OrderStatus.Pending
            };

            foreach (var detailDto in createOrderDto.orderDetails)
            {
                var product = await _productRepository.GetById(detailDto.productId);
                if (product != null && product.isActive)
                {
                    var orderDetail = new OrderDetail
                    {
                        productId = detailDto.productId,
                        quantity = detailDto.quantity,
                        unitPrice = product.unitPrice
                    };
                    order.orderDetails.Add(orderDetail);
                }
            }

            var createdOrder = await _orderRepository.Create(order);
            return _mapper.Map<OrderDto>(createdOrder);
        }

        public async Task<OrderDto?> Update(int id, UpdateOrderDto updateOrderDto)
        {
            var existingOrder = await _orderRepository.GetByIdWithDetails(id);
            if (existingOrder == null)
                return null;

            // Validar que la orden no esté completada
            if (existingOrder.status == OrderStatus.Completed)
                return null;

            existingOrder.status = updateOrderDto.status;
            existingOrder.orderDetails.Clear();

            // Agregar nuevos detalles
            foreach (var detailDto in updateOrderDto.orderDetails)
            {
                var product = await _productRepository.GetById(detailDto.productId);
                if (product != null && product.isActive)
                {
                    var orderDetail = new OrderDetail
                    {
                        productId = detailDto.productId,
                        quantity = detailDto.quantity,
                        unitPrice = product.unitPrice
                    };
                    existingOrder.orderDetails.Add(orderDetail);
                }
            }
            var updatedOrder = await _orderRepository.Update(existingOrder);
            return _mapper.Map<OrderDto>(updatedOrder);
        }

        public async Task<bool> Delete(int id)
        {
            var order = await _orderRepository.GetById(id);
            if (order == null || order.status == OrderStatus.Completed)
                return false;

            return await _orderRepository.Delete(id);
        }

        public async Task<OrderDto?> UpdateStatus(int id, OrderStatus status)
        {
            var existingOrder = await _orderRepository.GetById(id);
            if (existingOrder == null)
                return null;

            existingOrder.status = status;
            var updatedOrder = await _orderRepository.Update(existingOrder);
            return _mapper.Map<OrderDto>(updatedOrder);
        }

        public async Task<bool> CanEditOrder(int id)
        {
            var order = await _orderRepository.GetById(id);
            return order != null && order.status != OrderStatus.Completed;
        }
    }
}
