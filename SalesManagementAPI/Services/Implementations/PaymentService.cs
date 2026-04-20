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
                    payment.PaymentStatus = PaymentStatus.UNPAID;
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

                // Check if invoice already exists
                var existingInvoice = await _context.Invoices
                    .Include(i => i.Order)
                        .ThenInclude(o => o!.Customer)
                    .Include(i => i.Order)
                        .ThenInclude(o => o!.OrderDetails)
                    .FirstOrDefaultAsync(i => i.OrderID == dto.OrderId);

                if (payment.PaymentStatus == PaymentStatus.PAID && existingInvoice != null)
                {
                    if (payment.Order?.Status == OrderStatus.DELIVERED)
                    {
                        payment.Order.Status = OrderStatus.COMPLETED;
                        await _context.SaveChangesAsync();
                    }

                    // Already confirmed, return existing invoice info
                    return new ConfirmPaymentResponseDto
                    {
                        Message = "Thanh toán đã được xác nhận trước đó",
                        Payment = new PaymentInfoDto
                        {
                            PaymentId = payment.PaymentID,
                            OrderId = payment.OrderID,
                            Status = payment.PaymentStatus.ToString(),
                            Amount = payment.Amount
                        },
                        Invoice = new InvoiceInfoDto
                        {
                            InvoiceId = existingInvoice.InvoiceID,
                            InvoiceNumber = existingInvoice.InvoiceNumber,
                            TotalAmount = existingInvoice.TotalAmount,
                            Tax = existingInvoice.Tax
                        }
                    };
                }

                // 2. Cập nhật Payment status nếu chưa PAID
                bool needUpdatePayment = payment.PaymentStatus != PaymentStatus.PAID;
                if (needUpdatePayment)
                {
                    payment.PaymentStatus = PaymentStatus.PAID;
                    payment.PaymentDate = DateTime.Now;
                    payment.TransactionCode = dto.TransactionCode ?? $"BANK{payment.OrderID}";
                }

                var order = payment.Order;

                // Nếu đơn đã giao thành công và vừa xác nhận thanh toán => tự động hoàn thành
                if (order != null && order.Status == OrderStatus.DELIVERED && payment.PaymentStatus == PaymentStatus.PAID)
                {
                    order.Status = OrderStatus.COMPLETED;
                }

                // 3. Tạo Invoice (Hóa đơn) nếu chưa có
                var resolvedEmployeeId = await ResolveValidatedEmployeeIdAsync(dto.StaffId);

                Invoice invoice;
                if (existingInvoice != null)
                {
                    invoice = existingInvoice;
                    if (invoice.StaffID == null && resolvedEmployeeId.HasValue)
                    {
                        invoice.StaffID = resolvedEmployeeId;
                    }
                    Console.WriteLine($"Using existing invoice #{invoice.InvoiceNumber} for Order #{payment.OrderID}");
                }
                else
                {
                    invoice = new Invoice
                    {
                        OrderID = payment.OrderID,
                        StaffID = resolvedEmployeeId,
                        InvoiceNumber = GenerateInvoiceNumber(payment.OrderID),
                        IssueDate = DateTime.Now,
                        TotalAmount = payment.Amount,
                        Tax = payment.Amount * 0.1m, // VAT 10%
                        CustomerName = order?.Customer?.FullName ?? "Khách hàng",
                        CustomerAddress = order?.Customer?.Address ?? "N/A"
                    };

                    _context.Invoices.Add(invoice);
                    Console.WriteLine($"Creating new invoice #{invoice.InvoiceNumber} for Order #{payment.OrderID}");
                }

                if (needUpdatePayment || existingInvoice == null)
                {
                    await _context.SaveChangesAsync();
                    Console.WriteLine($"Payment confirmed for Order #{payment.OrderID}. Invoice #{invoice.InvoiceNumber}");
                }

                return new ConfirmPaymentResponseDto
                {
                    Message = "Xác nhận thanh toán thành công",
                    Payment = new PaymentInfoDto
                    {
                        PaymentId = payment.PaymentID,
                        OrderId = payment.OrderID,
                        Status = payment.PaymentStatus.ToString(),
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
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw new Exception($"Lỗi khi xác nhận thanh toán: {ex.InnerException?.Message ?? ex.Message}");
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
                PaymentMethod = payment.PaymentMethod.ToString(),
                PaymentStatus = payment.PaymentStatus.ToString(),
                Amount = payment.Amount,
                TransactionCode = payment.TransactionCode,
                PaymentDate = payment.PaymentDate,
                OrderStatus = payment.Order?.Status.ToString()
            };
        }

        public async Task<Invoice?> GetInvoiceByOrderIdAsync(int orderId)
        {
            return await _context.Invoices
                .Include(i => i.Order)
                    .ThenInclude(o => o!.Customer)
                .Include(i => i.Order)
                    .ThenInclude(o => o!.OrderDetails)
                .FirstOrDefaultAsync(i => i.OrderID == orderId);
        }

        private string GenerateInvoiceNumber(int orderId)
        {
            var date = DateTime.Now;
            return $"INV{date:yyyyMMdd}{orderId:D6}";
        }

        private async Task<int?> ResolveValidatedEmployeeIdAsync(int staffId)
        {
            if (staffId <= 0)
            {
                return null;
            }

            var employeeExists = await _context.Employees
                .Where(e => e.EmployeeID == staffId)
                .AnyAsync();

            if (!employeeExists)
            {
                throw new Exception("Nhân viên xác nhận không hợp lệ");
            }

            return staffId;
        }
    }
}
