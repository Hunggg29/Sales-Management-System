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
        }
    }
}
