using SalesManagementAPI.Models.DTO;

namespace SalesManagementAPI.Services.Interfaces
{
    public interface IVietQRService
    {
        /// <summary>
        /// Tạo URL QR code cho thanh toán chuyển khoản
        /// </summary>
        VietQRPaymentResponseDto CreatePaymentQRCode(VietQRPaymentRequestDto request);
    }
}
