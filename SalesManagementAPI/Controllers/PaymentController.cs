using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;
using System.Text.RegularExpressions;

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

        /// <summary>
        /// Webhook tự động từ SePay — xác nhận thanh toán khi ngân hàng ghi nhận giao dịch
        /// POST /api/Payment/sepay-webhook
        /// </summary>
        [HttpPost("sepay-webhook")]
        public async Task<IActionResult> SepayWebhook([FromBody] SepayWebhookDto dto)
        {
            try
            {
                var transferContent =
                    dto.Content
                    ?? dto.Description
                    ?? dto.TransferContent
                    ?? dto.TransactionContent
                    ?? string.Empty;

                var transferCode = dto.TransferCode ?? dto.Code;

                // Hỗ trợ nhiều định dạng nội dung: DH42, DH-42, DON42, ORDER42, ...
                var match = Regex.Match(
                    transferContent,
                    @"(?:DH|DON|ORDER)\s*[-#:]?\s*(\d+)",
                    RegexOptions.IgnoreCase);

                if (!match.Success)
                {
                    Console.WriteLine($"[SePay Webhook] Không tìm thấy mã đơn trong nội dung: '{transferContent}'");
                    return Ok(new
                    {
                        success = true,
                        message = "Giao dịch không liên quan hoặc thiếu mã đơn hàng trong nội dung chuyển khoản"
                    });
                }

                var orderId = int.Parse(match.Groups[1].Value);

                var confirmDto = new ConfirmPaymentDto
                {
                    OrderId = orderId,
                    TransactionCode = transferCode,
                    StaffId = 0 // 0 = hệ thống tự động
                };

                await _paymentService.ConfirmBankTransferAsync(confirmDto);

                Console.WriteLine($"[SePay Webhook] Đã tự động xác nhận thanh toán cho đơn #{orderId}, mã GD: {transferCode}");

                return Ok(new { success = true, message = $"Xác nhận thanh toán đơn #{orderId} thành công" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SePay Webhook] Lỗi: {ex.Message}");
                // Trả về 200 để SePay không retry liên tục
                return Ok(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy hóa đơn theo OrderId
        /// </summary>
        [HttpGet("invoice/{orderId}")]
        public async Task<IActionResult> GetInvoiceByOrderId(int orderId)
        {
            try
            {
                var invoice = await _paymentService.GetInvoiceByOrderIdAsync(orderId);

                if (invoice == null)
                    return NotFound(new { message = "Không tìm thấy hóa đơn" });

                return Ok(invoice);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
