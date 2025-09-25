using backend.Models.DTOs;
using backend.Models.Enums;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var orders = await _orderService.GetAll();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _orderService.GetById(id);

            if (order == null)
            {
                return NotFound($"Orden con ID {id} no encontrado");
            }

            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto createOrderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar que la orden tenga productos
            if (createOrderDto.orderDetails == null || !createOrderDto.orderDetails.Any())
            {
                return BadRequest("La orden debe tener al menos un producto");
            }

            var order = await _orderService.Create(createOrderDto);
            return CreatedAtAction(nameof(GetOrder), new { id = order.id }, order);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderDto>> UpdateOrder(int id, UpdateOrderDto updateOrderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si la orden se puede editar
            var canEdit = await _orderService.CanEditOrder(id);
            if (!canEdit)
            {
                return BadRequest("No se puede modificar una orden completada o que no existe");
            }

            var order = await _orderService.Update(id, updateOrderDto);

            if (order == null)
            {
                return NotFound($"Orden con ID {id} no encontrada");
            }

            return Ok(order);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var result = await _orderService.Delete(id);

            if (!result)
            {
                return NotFound($"Orden con ID {id} no encontrada o no se puede eliminar");
            }

            return NoContent();
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<OrderDto>> UpdateOrderStatus(int id, [FromBody] OrderStatus status)
        {
            var order = await _orderService.UpdateStatus(id, status);

            if (order == null)
            {
                return NotFound($"Orden con ID {id} no encontrada");
            }

            return Ok(order);
        }

        [HttpGet("{id}/can-edit")]
        public async Task<ActionResult<bool>> CanEditOrder(int id)
        {
            var canEdit = await _orderService.CanEditOrder(id);
            return Ok(new { canEdit });
        }
    }
}
