using SalesManagementAPI.Models.DTO;

namespace SalesManagementAPI.Services.Interfaces
{
    public interface IPaymentService
    {
        /// <summary>
        /// Tạo QR code cho thanh toán chuyển khoản ngân hàng
        /// </summary>
        Task<VietQRPaymentResponseDto> CreateBankTransferQRAsync(int orderId);

        /// <summary>
        /// Xác nhận thanh toán chuyển khoản đã hoàn thành (Admin/Staff)
        /// </summary>
        Task<ConfirmPaymentResponseDto> ConfirmBankTransferAsync(ConfirmPaymentDto dto);

        /// <summary>
        /// Kiểm tra trạng thái thanh toán
        /// </summary>
        Task<PaymentStatusDto?> GetPaymentStatusAsync(int orderId);
    }
}
