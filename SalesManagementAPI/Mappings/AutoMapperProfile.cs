using AutoMapper;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;

namespace SalesManagementAPI.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<RegisterRequestDto, User>().ReverseMap();
            CreateMap<Customer, CreateCustomerDto>().ReverseMap();
            CreateMap<Customer, UpdateCustomerDto>().ReverseMap();

            // Cart mappings
            CreateMap<Cart, CartDto>()
                .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.CartItems != null ? src.CartItems.Sum(ci => ci.SubTotal) : 0))
                .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.CartItems != null ? src.CartItems.Sum(ci => ci.Quantity) : 0));

            // CartItem mappings
            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductName : ""))
                .ForMember(dest => dest.ProductImage, opt => opt.MapFrom(src => src.Product != null ? src.Product.ImageURL : null))
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.Product != null ? src.Product.StockQuantity : 0));
        }
    }
}
