using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace SalesManagementAPI.Services.Implementations
{
    public class SettingsService : ISettingsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SettingsService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<StoreInfoDto> GetStoreInfoAsync()
        {
            var settings = await _context.Settings
                .Where(s => s.Category == "StoreInfo")
                .ToListAsync();

            return new StoreInfoDto
            {
                StoreName = settings.FirstOrDefault(s => s.Key == "StoreName")?.Value ?? "CÔNG TY TNHH KAROTA VIỆT NAM",
                Email = settings.FirstOrDefault(s => s.Key == "Email")?.Value ?? "thanglongtape@gmail.com",
                Phone = settings.FirstOrDefault(s => s.Key == "Phone")?.Value ?? "0243.681.6262",
                Address = settings.FirstOrDefault(s => s.Key == "Address")?.Value ?? "Xã Thanh Trì - Hà Nội",
                TaxCode = settings.FirstOrDefault(s => s.Key == "TaxCode")?.Value ?? "0123456789"
            };
        }

        public async Task UpdateStoreInfoAsync(StoreInfoDto dto)
        {
            var settingsToUpdate = new List<(string Key, string Value)>
            {
                ("StoreName", dto.StoreName),
                ("Email", dto.Email),
                ("Phone", dto.Phone),
                ("Address", dto.Address),
                ("TaxCode", dto.TaxCode)
            };

            await UpsertSettingsByCategoryAsync("StoreInfo", settingsToUpdate);
        }

        public async Task<UserSettingsDto?> GetUserSettingsAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user == null ? null : _mapper.Map<UserSettingsDto>(user);
        }

        public async Task<(bool Success, string Message)> UpdateUserSettingsAsync(int userId, UserSettingsDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return (false, "Không tìm thấy người dùng");
            }

            user.UserName = dto.FullName;
            user.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.NewPassword))
            {
                if (string.IsNullOrEmpty(dto.CurrentPassword) || !BC.Verify(dto.CurrentPassword, user.PasswordHash))
                {
                    return (false, "Mật khẩu hiện tại không đúng");
                }

                user.PasswordHash = BC.HashPassword(dto.NewPassword);
            }

            await _context.SaveChangesAsync();
            return (true, "Đã cập nhật thông tin người dùng");
        }

        public async Task<NotificationSettingsDto> GetNotificationSettingsAsync()
        {
            var settings = await _context.Settings
                .Where(s => s.Category == "Notification")
                .ToListAsync();

            return new NotificationSettingsDto
            {
                EmailNotifications = settings.FirstOrDefault(s => s.Key == "EmailNotifications")?.Value == "true",
                OrderNotifications = settings.FirstOrDefault(s => s.Key == "OrderNotifications")?.Value == "true",
                LowStockAlerts = settings.FirstOrDefault(s => s.Key == "LowStockAlerts")?.Value == "true",
                CustomerMessages = settings.FirstOrDefault(s => s.Key == "CustomerMessages")?.Value == "true"
            };
        }

        public async Task UpdateNotificationSettingsAsync(NotificationSettingsDto dto)
        {
            var settingsToUpdate = new List<(string Key, string Value)>
            {
                ("EmailNotifications", dto.EmailNotifications.ToString().ToLower()),
                ("OrderNotifications", dto.OrderNotifications.ToString().ToLower()),
                ("LowStockAlerts", dto.LowStockAlerts.ToString().ToLower()),
                ("CustomerMessages", dto.CustomerMessages.ToString().ToLower())
            };

            await UpsertSettingsByCategoryAsync("Notification", settingsToUpdate);
        }

        public async Task<PaymentSettingsDto> GetPaymentSettingsAsync()
        {
            var settings = await _context.Settings
                .Where(s => s.Category == "Payment")
                .ToListAsync();

            return new PaymentSettingsDto
            {
                BankName = settings.FirstOrDefault(s => s.Key == "BankName")?.Value ?? "Ngân hàng TMCP Á Châu",
                AccountNumber = settings.FirstOrDefault(s => s.Key == "AccountNumber")?.Value ?? "0947.900.666",
                AccountName = settings.FirstOrDefault(s => s.Key == "AccountName")?.Value ?? "CÔNG TY TNHH KAROTA VIỆT NAM",
                QrEnabled = settings.FirstOrDefault(s => s.Key == "QrEnabled")?.Value == "true"
            };
        }

        public async Task UpdatePaymentSettingsAsync(PaymentSettingsDto dto)
        {
            var settingsToUpdate = new List<(string Key, string Value)>
            {
                ("BankName", dto.BankName),
                ("AccountNumber", dto.AccountNumber),
                ("AccountName", dto.AccountName),
                ("QrEnabled", dto.QrEnabled.ToString().ToLower())
            };

            await UpsertSettingsByCategoryAsync("Payment", settingsToUpdate);
        }

        private async Task UpsertSettingsByCategoryAsync(string category, IEnumerable<(string Key, string Value)> keyValues)
        {
            foreach (var item in keyValues)
            {
            var key = item.Key;
            var value = item.Value;

                var setting = await _context.Settings
                    .FirstOrDefaultAsync(s => s.Category == category && s.Key == key);

                if (setting != null)
                {
                    setting.Value = value;
                    setting.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    _context.Settings.Add(new Setting
                    {
                        Key = key,
                        Value = value,
                        Category = category,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
