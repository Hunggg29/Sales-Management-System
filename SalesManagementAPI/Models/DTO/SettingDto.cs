namespace SalesManagementAPI.Models.DTO
{
  public class StoreInfoDto
  {
    public string StoreName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string TaxCode { get; set; } = string.Empty;
  }

  public class UserSettingsDto
  {
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? CurrentPassword { get; set; }
    public string? NewPassword { get; set; }
  }

  public class NotificationSettingsDto
  {
    public bool EmailNotifications { get; set; }
    public bool OrderNotifications { get; set; }
    public bool LowStockAlerts { get; set; }
    public bool CustomerMessages { get; set; }
  }

  public class PaymentSettingsDto
  {
    public string BankName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountName { get; set; } = string.Empty;
    public bool QrEnabled { get; set; }
  }
}
