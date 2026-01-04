using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        /// <summary>
        /// Tạo QR code cho thanh toán chuyển khoản ngân hàng
        /// </summary>
        [HttpPost("create-bank-transfer-qr")]
        public async Task<IActionResult> CreateBankTransferQR([FromQuery] int orderId)
        {
            try
            {
                var response = await _paymentService.CreateBankTransferQRAsync(orderId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Xác nhận thanh toán chuyển khoản đã hoàn thành (Admin/Staff)
        /// </summary>
        [HttpPost("confirm-bank-transfer")]
        public async Task<IActionResult> ConfirmBankTransfer([FromBody] ConfirmPaymentDto dto)
        {
            try
            {
                var response = await _paymentService.ConfirmBankTransferAsync(dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Kiểm tra trạng thái thanh toán
        /// </summary>
        [HttpGet("check-payment-status/{orderId}")]
        public async Task<IActionResult> CheckPaymentStatus(int orderId)
        {
            var status = await _paymentService.GetPaymentStatusAsync(orderId);

            if (status == null)
                return NotFound(new { message = "Không tìm thấy thông tin thanh toán" });

            return Ok(status);
        }
    }
}
