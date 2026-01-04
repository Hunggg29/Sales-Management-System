using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;
using System.Web;

namespace SalesManagementAPI.Services.Implementations
{
    public class VietQRService : IVietQRService
    {
        private readonly IConfiguration _configuration;

        public VietQRService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public VietQRPaymentResponseDto CreatePaymentQRCode(VietQRPaymentRequestDto request)
        {
            try
            {
                // Lấy thông tin từ config
                var bankId = _configuration["VietQR:BankId"];
                var accountNo = _configuration["VietQR:AccountNo"];
                var accountName = _configuration["VietQR:AccountName"];
                var template = _configuration["VietQR:Template"] ?? "compact2";

                // Validate config
                if (string.IsNullOrEmpty(bankId) || string.IsNullOrEmpty(accountNo) || string.IsNullOrEmpty(accountName))
                {
                    return new VietQRPaymentResponseDto
                    {
                        Success = false,
                        Message = "Thiếu thông tin cấu hình VietQR"
                    };
                }

                // Format description - loại bỏ ký tự đặc biệt
                var description = string.IsNullOrEmpty(request.Description)
                    ? $"Thanh toan don hang #{request.OrderId}"
                    : request.Description;

                description = description
                    .Replace("#", "")
                    .Replace("&", "")
                    .Replace("%", "")
                    .Replace("?", "")
                    .Replace("=", "");

                // Tạo URL theo cú pháp VietQR
                var qrUrl = $"https://img.vietqr.io/image/{bankId}-{accountNo}-{template}.png" +
                           $"?amount={request.Amount}" +
                           $"&addInfo={HttpUtility.UrlEncode(description)}" +
                           $"&accountName={HttpUtility.UrlEncode(accountName)}";

                Console.WriteLine($"=== VietQR Payment URL Created ===");
                Console.WriteLine($"OrderId: {request.OrderId}");
                Console.WriteLine($"Amount: {request.Amount}");
                Console.WriteLine($"Description: {description}");
                Console.WriteLine($"QR URL: {qrUrl}");
                Console.WriteLine("==================================");

                return new VietQRPaymentResponseDto
                {
                    Success = true,
                    QRCodeUrl = qrUrl,
                    BankName = GetBankName(bankId),
                    AccountNumber = accountNo,
                    AccountName = accountName,
                    Amount = request.Amount,
                    Description = description,
                    OrderId = request.OrderId,
                    Message = "Tạo mã QR thanh toán thành công"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating VietQR: {ex.Message}");
                return new VietQRPaymentResponseDto
                {
                    Success = false,
                    Message = $"Lỗi tạo mã QR: {ex.Message}"
                };
            }
        }

        private string GetBankName(string bankId)
        {
            // Map bank ID to bank name
            var bankNames = new Dictionary<string, string>
            {
                { "970415", "VietinBank" },
                { "970422", "MB Bank" },
                { "970436", "Vietcombank" },
                { "970418", "BIDV" },
                { "970405", "Agribank" },
                { "970407", "Techcombank" },
                { "970416", "ACB" },
                { "970432", "VPBank" },
                { "970423", "TPBank" },
                { "970403", "Sacombank" },
                { "970406", "DongA Bank" },
                { "970426", "MSB" },
                { "970414", "OceanBank" },
                { "970429", "SCB" },
                { "970441", "VIB" },
                { "970448", "OCB" },
                { "970454", "VietCapitalBank" },
                { "970431", "Eximbank" },
                { "970438", "BacA Bank" },
                { "970409", "BaoVietBank" },
                { "970410", "StandardChartered" },
                { "970412", "PVcomBank" },
                { "970419", "NCB" },
                { "970424", "ShinhanBank" },
                { "970425", "ABBank" },
                { "970427", "VietABank" },
                { "970428", "NamA Bank" },
                { "970430", "PGBank" },
                { "970433", "VietBank" },
                { "970437", "HDBank" },
                { "970440", "SeABank" },
                { "970443", "SHB" },
                { "970449", "LienVietPostBank" },
                { "970458", "UnitedOverseas" },
                { "970463", "KienLongBank" },
                { "970457", "Woori" },
            };

            return bankNames.TryGetValue(bankId, out var bankName) ? bankName : "Ngân hàng";
        }
    }
}
