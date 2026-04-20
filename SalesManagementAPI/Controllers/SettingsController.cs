using Microsoft.AspNetCore.Mvc;
using SalesManagementAPI.Models.DTO;
using SalesManagementAPI.Services.Interfaces;

namespace SalesManagementAPI.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SettingsController : ControllerBase
  {
    private readonly ISettingsService _settingsService;

    public SettingsController(ISettingsService settingsService)
    {
      _settingsService = settingsService;
    }

    // GET: api/Settings/store-info
    [HttpGet("store-info")]
    public async Task<ActionResult<StoreInfoDto>> GetStoreInfo()
    {
      var storeInfo = await _settingsService.GetStoreInfoAsync();
      return Ok(storeInfo);
    }

    // PUT: api/Settings/store-info
    [HttpPut("store-info")]
    public async Task<IActionResult> UpdateStoreInfo(StoreInfoDto dto)
    {
      await _settingsService.UpdateStoreInfoAsync(dto);
      return Ok(new { message = "Đã lưu thông tin cửa hàng" });
    }

    // GET: api/Settings/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<UserSettingsDto>> GetUserSettings(int userId)
    {
      var userSettings = await _settingsService.GetUserSettingsAsync(userId);
      if (userSettings == null)
      {
        return NotFound(new { message = "Không tìm thấy người dùng" });
      }

      return Ok(userSettings);
    }

    // PUT: api/Settings/user/{userId}
    [HttpPut("user/{userId}")]
    public async Task<IActionResult> UpdateUserSettings(int userId, UserSettingsDto dto)
    {
      var existing = await _settingsService.GetUserSettingsAsync(userId);
      if (existing == null)
      {
        return NotFound(new { message = "Không tìm thấy người dùng" });
      }

      var result = await _settingsService.UpdateUserSettingsAsync(userId, dto);
      if (!result.Success)
      {
        return BadRequest(new { message = result.Message });
      }

      return Ok(new { message = "Đã cập nhật thông tin người dùng" });
    }

    // GET: api/Settings/notifications
    [HttpGet("notifications")]
    public async Task<ActionResult<NotificationSettingsDto>> GetNotificationSettings()
    {
      var notificationSettings = await _settingsService.GetNotificationSettingsAsync();

      return Ok(notificationSettings);
    }

    // PUT: api/Settings/notifications
    [HttpPut("notifications")]
    public async Task<IActionResult> UpdateNotificationSettings(NotificationSettingsDto dto)
    {
      await _settingsService.UpdateNotificationSettingsAsync(dto);
      return Ok(new { message = "Đã lưu cài đặt thông báo" });
    }

    // GET: api/Settings/payment
    [HttpGet("payment")]
    public async Task<ActionResult<PaymentSettingsDto>> GetPaymentSettings()
    {
      var paymentSettings = await _settingsService.GetPaymentSettingsAsync();

      return Ok(paymentSettings);
    }

    // PUT: api/Settings/payment
    [HttpPut("payment")]
    public async Task<IActionResult> UpdatePaymentSettings(PaymentSettingsDto dto)
    {
      await _settingsService.UpdatePaymentSettingsAsync(dto);
      return Ok(new { message = "Đã lưu cài đặt thanh toán" });
    }
  }
}
