using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Data;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Services.Interfaces;
using SalesManagementAPI.Models.VnPay;

namespace SalesManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public PaymentController(
            IVnPayService vnPayService,
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _vnPayService = vnPayService;
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Tạo URL thanh toán VNPay cho đơn hàng
        /// </summary>
        [HttpPost("create-vnpay-url")]
        public async Task<IActionResult> CreateVNPayUrl([FromQuery] int orderId)
        {
            try
            {
                // 1. Lấy thông tin order từ database
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });

                // 2. Tạo model cho VNPay
                var model = new PaymentInformationModel
                {
                    OrderId = orderId, // QUAN TRỌNG: truyen OrderId
                    OrderType = "other",
                    Amount = (double)order.TotalAmount,
                    OrderDescription = $"Thanh toan don hang #{orderId}",
                    Name = $"DH{orderId}"
                };

                // 3. Tạo payment URL
                var paymentUrl = _vnPayService.CreatePaymentUrl(model, HttpContext);
                
                return Ok(new { paymentUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating VNPay URL: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Callback từ VNPay sau khi thanh toán
        /// </summary>
        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VNPayReturn()
        {
            try
            {
                // 1. Xử lý response từ VNPay
                var response = _vnPayService.PaymentExecute(Request.Query);

                // 2. Kiểm tra chữ ký
                if (!response.Success)
                {
                    Console.WriteLine("VNPay signature validation failed");
                    var frontendUrl = _configuration["PaymentCallBack:FrontendUrl"] ?? "http://localhost:5173";
                    return Redirect($"{frontendUrl}/don-hang/failed?message=Invalid+signature");
                }

                // 3. Lấy orderId từ response
                var orderId = int.Parse(response.OrderId);
                
                // 4. Cập nhật payment và order status
                var payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.OrderID == orderId);

                if (payment != null)
                {
                    if (response.VnPayResponseCode == "00") // Thanh toán thành công
                    {
                        payment.PaymentStatus = "Completed";
                        payment.PaymentDate = DateTime.Now;
                        payment.TransactionCode = response.TransactionId;

                        var order = await _context.Orders.FindAsync(orderId);
                        if (order != null)
                        {
                            order.Status = "Processing";
                        }

                        Console.WriteLine($"Payment completed for Order #{orderId}");
                    }
                    else // Thanh toán thất bại
                    {
                        payment.PaymentStatus = "Failed";
                        Console.WriteLine($"Payment failed for Order #{orderId}, Code: {response.VnPayResponseCode}");
                    }

                    await _context.SaveChangesAsync();
                }

                // 5. Redirect về frontend
                var frontendBaseUrl = _configuration["PaymentCallBack:FrontendUrl"] ?? "http://localhost:5173";
                
                if (response.VnPayResponseCode == "00")
                    return Redirect($"{frontendBaseUrl}/don-hang/{orderId}");
                else
                    return Redirect($"{frontendBaseUrl}/don-hang/failed?message=Payment+failed&code={response.VnPayResponseCode}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in VNPay callback: {ex.Message}");
                var frontendUrl = _configuration["PaymentCallBack:FrontendUrl"] ?? "http://localhost:5173";
                return Redirect($"{frontendUrl}/don-hang/failed?message={ex.Message}");
            }
        }
    }
}
