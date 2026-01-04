using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IVietQRService _vietQRService;

        public PaymentService(ApplicationDbContext context, IVietQRService vietQRService)
        {
            _context = context;
            _vietQRService = vietQRService;
        }

        public async Task<VietQRPaymentResponseDto> CreateBankTransferQRAsync(int orderId)
        {
            try
            {
                // 1. Lấy thông tin order từ database
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                    throw new Exception("Không tìm thấy đơn hàng");

                Console.WriteLine($"Order TotalAmount: {order.TotalAmount}");

                // 2. Tạo request cho VietQR
                var request = new VietQRPaymentRequestDto
                {
                    OrderId = orderId,
                    Amount = order.TotalAmount,
                    Description = $"DH{orderId}"
                };

                Console.WriteLine($"Request Amount: {request.Amount}");

                // 3. Tạo QR code
                var response = _vietQRService.CreatePaymentQRCode(request);

                Console.WriteLine($"Response Amount: {response.Amount}");
                Console.WriteLine($"QR URL: {response.QRCodeUrl}");

                if (!response.Success)
                    throw new Exception(response.Message);

                // 4. Cập nhật Payment record với QR code info
                var payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.OrderID == orderId);

                if (payment != null)
                {
                    payment.PaymentStatus = "AwaitingPayment"; // Đang chờ thanh toán
                    payment.PaymentDate = DateTime.Now;
                    await _context.SaveChangesAsync();

                    Console.WriteLine($"Updated Payment record for Order #{orderId}");
                }

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating bank transfer QR: {ex.Message}");
                throw;
            }
        }

        public async Task<ConfirmPaymentResponseDto> ConfirmBankTransferAsync(ConfirmPaymentDto dto)
        {
            try
            {
                // 1. Lấy Payment record
                var payment = await _context.Payments
                    .Include(p => p.Order)
                        .ThenInclude(o => o!.Customer)
                    .FirstOrDefaultAsync(p => p.OrderID == dto.OrderId);

                if (payment == null)
                    throw new Exception("Không tìm thấy thông tin thanh toán");

                if (payment.PaymentStatus == "Completed")
                    throw new Exception("Đơn hàng đã được thanh toán");

                // 2. Cập nhật Payment status
                payment.PaymentStatus = "Completed";
                payment.PaymentDate = DateTime.Now;
                payment.TransactionCode = dto.TransactionCode ?? $"BANK{payment.OrderID}";

                // 3. Cập nhật Order status
                var order = payment.Order;
                if (order != null)
                {
                    order.Status = "Processing"; // Đã thanh toán, đang xử lý
                }

                // 4. Tạo Invoice (Hóa đơn)
                var invoice = new Invoice
                {
                    OrderID = payment.OrderID,
                    StaffID = dto.StaffId,
                    InvoiceNumber = GenerateInvoiceNumber(payment.OrderID),
                    IssueDate = DateTime.Now,
                    TotalAmount = payment.Amount,
                    Tax = payment.Amount * 0.1m, // VAT 10%
                    CustomerName = order?.Customer?.FullName ?? "Khách hàng",
                    CustomerAddress = order?.Customer?.Address ?? "N/A"
                };

                _context.Invoices.Add(invoice);

                // 5. Log thanh toán
                var paymentLog = new PaymentLog
                {
                    PaymentID = payment.PaymentID,
                    LogDate = DateTime.Now,
                    LogMessage = $"Xác nhận thanh toán chuyển khoản. Mã giao dịch: {payment.TransactionCode}"
                };

                _context.PaymentLogs.Add(paymentLog);

                await _context.SaveChangesAsync();

                Console.WriteLine($"Payment confirmed for Order #{payment.OrderID}. Invoice #{invoice.InvoiceNumber} created.");

                return new ConfirmPaymentResponseDto
                {
                    Message = "Xác nhận thanh toán thành công",
                    Payment = new PaymentInfoDto
                    {
                        PaymentId = payment.PaymentID,
                        OrderId = payment.OrderID,
                        Status = payment.PaymentStatus,
                        Amount = payment.Amount
                    },
                    Invoice = new InvoiceInfoDto
                    {
                        InvoiceId = invoice.InvoiceID,
                        InvoiceNumber = invoice.InvoiceNumber,
                        TotalAmount = invoice.TotalAmount,
                        Tax = invoice.Tax
                    }
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error confirming bank transfer: {ex.Message}");
                throw;
            }
        }

        public async Task<PaymentStatusDto?> GetPaymentStatusAsync(int orderId)
        {
            var payment = await _context.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.OrderID == orderId);

            if (payment == null)
                return null;

            return new PaymentStatusDto
            {
                OrderId = payment.OrderID,
                PaymentMethod = payment.PaymentMethod,
                PaymentStatus = payment.PaymentStatus,
                Amount = payment.Amount,
                TransactionCode = payment.TransactionCode,
                PaymentDate = payment.PaymentDate,
                OrderStatus = payment.Order?.Status
            };
        }

        private string GenerateInvoiceNumber(int orderId)
        {
            var date = DateTime.Now;
            return $"INV{date:yyyyMMdd}{orderId:D6}";
        }
    }
}
