using SalesManagementAPI.Libraries;
using SalesManagementAPI.Models.VnPay;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Services.Implementations
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;

        public VnPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]!);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var pay = new VnPayLibrary();
            var urlCallBack = _configuration["PaymentCallBack:ReturnUrl"];

            // Loại bỏ ký tự đặc biệt trong OrderInfo
            var orderInfo = model.OrderDescription
                .Replace("#", "")
                .Replace("&", "")
                .Replace("%", "");

            // Add các tham số theo thứ tự alphabet (SortedList tự động sort)
            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]!);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]!);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]!);
            pay.AddRequestData("vnp_Amount", ((int)model.Amount * 100).ToString()); 
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]!);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]!);
            pay.AddRequestData("vnp_OrderInfo", orderInfo); // Dùng orderInfo đã loại bỏ ký tự đặc biệt
            pay.AddRequestData("vnp_OrderType", model.OrderType);
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack!);
            pay.AddRequestData("vnp_TxnRef", model.OrderId.ToString()); // Dùng OrderId để map về

            var paymentUrl = pay.CreateRequestUrl(
                _configuration["Vnpay:BaseUrl"]!,
                _configuration["Vnpay:HashSecret"]!
            );

            Console.WriteLine($"=== VNPay Payment URL Created ===");
            Console.WriteLine($"OrderId: {model.OrderId}");
            Console.WriteLine($"Amount: {model.Amount}");
            Console.WriteLine($"OrderInfo: {orderInfo}");
            Console.WriteLine($"Full URL Length: {paymentUrl.Length}");

            return paymentUrl;
        }

        public PaymentResponseModel PaymentExecute(IQueryCollection collections)
        {
            var pay = new VnPayLibrary();
            var response = pay.GetFullResponseData(collections, _configuration["Vnpay:HashSecret"]!);

            Console.WriteLine($"=== VNPay Callback Received ===");
            Console.WriteLine($"Success: {response.Success}");
            Console.WriteLine($"OrderId: {response.OrderId}");
            Console.WriteLine($"ResponseCode: {response.VnPayResponseCode}");

            return response;
        }
    }
}
