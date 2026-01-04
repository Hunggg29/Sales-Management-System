namespace SalesManagementAPI.Models
{
  public class Setting
  {
    public int SettingID { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // StoreInfo, Notification, Payment
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
  }
}
