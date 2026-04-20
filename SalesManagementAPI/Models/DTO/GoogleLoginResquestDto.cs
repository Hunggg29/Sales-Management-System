using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesManagementAPI.Models.DTO
{
    public class GoogleLoginRequestDto
    {
        public string ProviderToken { get; set; } = string.Empty;

        public string? Name { get; set; }
    }
}