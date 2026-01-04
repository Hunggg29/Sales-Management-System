using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesManagementAPI.Data;
using SalesManagementAPI.Models;
using SalesManagementAPI.Models.DTO;
using System.Text.Json;

namespace SalesManagementAPI.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SettingsController : ControllerBase
  {
    private readonly ApplicationDbContext _context;

    public SettingsController(ApplicationDbContext context)
    {
      _context = context;
    }

    // GET: api/Settings/store-info
    [HttpGet("store-info")]
    public async Task<ActionResult<StoreInfoDto>> GetStoreInfo()
    {
      var settings = await _context.Settings
          .Where(s => s.Category == "StoreInfo")
          .ToListAsync();

      var storeInfo = new StoreInfoDto
      {
        StoreName = settings.FirstOrDefault(s => s.Key == "StoreName")?.Value ?? "CÔNG TY TNHH KAROTA VIỆT NAM",
        Email = settings.FirstOrDefault(s => s.Key == "Email")?.Value ?? "thanglongtape@gmail.com",
        Phone = settings.FirstOrDefault(s => s.Key == "Phone")?.Value ?? "0243.681.6262",
        Address = settings.FirstOrDefault(s => s.Key == "Address")?.Value ?? "Xã Thanh Trì - Hà Nội",
        TaxCode = settings.FirstOrDefault(s => s.Key == "TaxCode")?.Value ?? "0123456789"
      };

      return Ok(storeInfo);
    }

    // PUT: api/Settings/store-info
    [HttpPut("store-info")]
    public async Task<IActionResult> UpdateStoreInfo(StoreInfoDto dto)
    {
      var settingsToUpdate = new[]
      {
                new { Key = "StoreName", Value = dto.StoreName },
                new { Key = "Email", Value = dto.Email },
                new { Key = "Phone", Value = dto.Phone },
                new { Key = "Address", Value = dto.Address },
                new { Key = "TaxCode", Value = dto.TaxCode }
            };

      foreach (var item in settingsToUpdate)
      {
        var setting = await _context.Settings
            .FirstOrDefaultAsync(s => s.Category == "StoreInfo" && s.Key == item.Key);

        if (setting != null)
        {
          setting.Value = item.Value;
          setting.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
          _context.Settings.Add(new Setting
          {
            Key = item.Key,
            Value = item.Value,
            Category = "StoreInfo",
            UpdatedAt = DateTime.UtcNow
          });
        }
      }

      await _context.SaveChangesAsync();
      return Ok(new { message = "Đã lưu thông tin cửa hàng" });
    }

    // GET: api/Settings/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<UserSettingsDto>> GetUserSettings(int userId)
    {
      var user = await _context.Users.FindAsync(userId);
      if (user == null)
      {
        return NotFound(new { message = "Không tìm thấy người dùng" });
      }

      var userSettings = new UserSettingsDto
      {
        FullName = user.UserName,
        Email = user.Email
      };

      return Ok(userSettings);
    }

    // PUT: api/Settings/user/{userId}
    [HttpPut("user/{userId}")]
    public async Task<IActionResult> UpdateUserSettings(int userId, UserSettingsDto dto)
    {
      var user = await _context.Users.FindAsync(userId);
      if (user == null)
      {
        return NotFound(new { message = "Không tìm thấy người dùng" });
      }

      user.UserName = dto.FullName;
      user.Email = dto.Email;

      // Update password if provided
      if (!string.IsNullOrEmpty(dto.NewPassword) && !string.IsNullOrEmpty(dto.CurrentPassword))
      {
        // Verify current password
        if (user.PasswordHash != dto.CurrentPassword) // In production, use proper password hashing
        {
          return BadRequest(new { message = "Mật khẩu hiện tại không đúng" });
        }

        user.PasswordHash = dto.NewPassword; // In production, hash the password
      }

      await _context.SaveChangesAsync();
      return Ok(new { message = "Đã cập nhật thông tin người dùng" });
    }

    // GET: api/Settings/notifications
    [HttpGet("notifications")]
    public async Task<ActionResult<NotificationSettingsDto>> GetNotificationSettings()
    {
      var settings = await _context.Settings
          .Where(s => s.Category == "Notification")
          .ToListAsync();

      var notificationSettings = new NotificationSettingsDto
      {
        EmailNotifications = settings.FirstOrDefault(s => s.Key == "EmailNotifications")?.Value == "true",
        OrderNotifications = settings.FirstOrDefault(s => s.Key == "OrderNotifications")?.Value == "true",
        LowStockAlerts = settings.FirstOrDefault(s => s.Key == "LowStockAlerts")?.Value == "true",
        CustomerMessages = settings.FirstOrDefault(s => s.Key == "CustomerMessages")?.Value == "false"
      };

      return Ok(notificationSettings);
    }

    // PUT: api/Settings/notifications
    [HttpPut("notifications")]
    public async Task<IActionResult> UpdateNotificationSettings(NotificationSettingsDto dto)
    {
      var settingsToUpdate = new[]
      {
                new { Key = "EmailNotifications", Value = dto.EmailNotifications.ToString().ToLower() },
                new { Key = "OrderNotifications", Value = dto.OrderNotifications.ToString().ToLower() },
                new { Key = "LowStockAlerts", Value = dto.LowStockAlerts.ToString().ToLower() },
                new { Key = "CustomerMessages", Value = dto.CustomerMessages.ToString().ToLower() }
            };

      foreach (var item in settingsToUpdate)
      {
        var setting = await _context.Settings
            .FirstOrDefaultAsync(s => s.Category == "Notification" && s.Key == item.Key);

        if (setting != null)
        {
          setting.Value = item.Value;
          setting.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
          _context.Settings.Add(new Setting
          {
            Key = item.Key,
            Value = item.Value,
            Category = "Notification",
            UpdatedAt = DateTime.UtcNow
          });
        }
      }

      await _context.SaveChangesAsync();
      return Ok(new { message = "Đã lưu cài đặt thông báo" });
    }

    // GET: api/Settings/payment
    [HttpGet("payment")]
    public async Task<ActionResult<PaymentSettingsDto>> GetPaymentSettings()
    {
      var settings = await _context.Settings
          .Where(s => s.Category == "Payment")
          .ToListAsync();

      var paymentSettings = new PaymentSettingsDto
      {
        BankName = settings.FirstOrDefault(s => s.Key == "BankName")?.Value ?? "Ngân hàng TMCP Á Châu",
        AccountNumber = settings.FirstOrDefault(s => s.Key == "AccountNumber")?.Value ?? "0947.900.666",
        AccountName = settings.FirstOrDefault(s => s.Key == "AccountName")?.Value ?? "CÔNG TY TNHH KAROTA VIỆT NAM",
        QrEnabled = settings.FirstOrDefault(s => s.Key == "QrEnabled")?.Value == "true"
      };

      return Ok(paymentSettings);
    }

    // PUT: api/Settings/payment
    [HttpPut("payment")]
    public async Task<IActionResult> UpdatePaymentSettings(PaymentSettingsDto dto)
    {
      var settingsToUpdate = new[]
      {
                new { Key = "BankName", Value = dto.BankName },
                new { Key = "AccountNumber", Value = dto.AccountNumber },
                new { Key = "AccountName", Value = dto.AccountName },
                new { Key = "QrEnabled", Value = dto.QrEnabled.ToString().ToLower() }
            };

      foreach (var item in settingsToUpdate)
      {
        var setting = await _context.Settings
            .FirstOrDefaultAsync(s => s.Category == "Payment" && s.Key == item.Key);

        if (setting != null)
        {
          setting.Value = item.Value;
          setting.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
          _context.Settings.Add(new Setting
          {
            Key = item.Key,
            Value = item.Value,
            Category = "Payment",
            UpdatedAt = DateTime.UtcNow
          });
        }
      }

      await _context.SaveChangesAsync();
      return Ok(new { message = "Đã lưu cài đặt thanh toán" });
    }
  }
}
