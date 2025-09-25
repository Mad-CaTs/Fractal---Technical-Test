using AutoMapper;
using backend.Models.Entities;

namespace backend.Models.DTOs
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapeos de Product
            CreateMap<Product, ProductDto>();

            CreateMap<CreateProductDto, Product>()
                .ForMember(dest => dest.id, opt => opt.Ignore())
                .ForMember(dest => dest.isActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.createdAt, opt => opt.Ignore())
                .ForMember(dest => dest.updatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.orderDetails, opt => opt.Ignore());

            CreateMap<UpdateProductDto, Product>()
                .ForMember(dest => dest.id, opt => opt.Ignore())
                .ForMember(dest => dest.createdAt, opt => opt.Ignore())
                .ForMember(dest => dest.updatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.orderDetails, opt => opt.Ignore());

            // Mapeos de Order
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.totalProducts, opt => opt.MapFrom(src => src.totalProducts))
                .ForMember(dest => dest.finalPrice, opt => opt.MapFrom(src => src.finalPrice));

            CreateMap<CreateOrderDto, Order>()
                .ForMember(dest => dest.id, opt => opt.Ignore())
                .ForMember(dest => dest.orderNumber, opt => opt.Ignore()) 
                .ForMember(dest => dest.orderDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.status, opt => opt.MapFrom(src => Models.Enums.OrderStatus.Pending))
                .ForMember(dest => dest.createdAt, opt => opt.Ignore())
                .ForMember(dest => dest.updatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.orderDetails, opt => opt.Ignore()); 

            CreateMap<UpdateOrderDto, Order>()
                .ForMember(dest => dest.id, opt => opt.Ignore())
                .ForMember(dest => dest.orderDate, opt => opt.Ignore())
                .ForMember(dest => dest.createdAt, opt => opt.Ignore())
                .ForMember(dest => dest.updatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.orderDetails, opt => opt.Ignore());

            // Mapeos de OrderDetail
            CreateMap<OrderDetail, OrderDetailDto>()
                .ForMember(dest => dest.productName, opt => opt.MapFrom(src => src.product.name))
                .ForMember(dest => dest.totalPrice, opt => opt.MapFrom(src => src.totalPrice));

            CreateMap<CreateOrderDetailDto, OrderDetail>()
                .ForMember(dest => dest.id, opt => opt.Ignore())
                .ForMember(dest => dest.orderId, opt => opt.Ignore())
                .ForMember(dest => dest.unitPrice, opt => opt.Ignore()) 
                .ForMember(dest => dest.createdAt, opt => opt.Ignore())
                .ForMember(dest => dest.order, opt => opt.Ignore())
                .ForMember(dest => dest.product, opt => opt.Ignore());

            CreateMap<UpdateOrderDetailDto, OrderDetail>()
                .ForMember(dest => dest.orderId, opt => opt.Ignore())
                .ForMember(dest => dest.unitPrice, opt => opt.Ignore())
                .ForMember(dest => dest.createdAt, opt => opt.Ignore())
                .ForMember(dest => dest.order, opt => opt.Ignore())
                .ForMember(dest => dest.product, opt => opt.Ignore());
        }
    }
}

