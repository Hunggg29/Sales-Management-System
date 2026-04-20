using SalesManagementAPI.Models.DTO;

namespace SalesManagementAPI.Services.Interfaces
{
    public interface ISettingsService
    {
        Task<StoreInfoDto> GetStoreInfoAsync();
        Task UpdateStoreInfoAsync(StoreInfoDto dto);

        Task<UserSettingsDto?> GetUserSettingsAsync(int userId);
        Task<(bool Success, string Message)> UpdateUserSettingsAsync(int userId, UserSettingsDto dto);

        Task<NotificationSettingsDto> GetNotificationSettingsAsync();
        Task UpdateNotificationSettingsAsync(NotificationSettingsDto dto);

        Task<PaymentSettingsDto> GetPaymentSettingsAsync();
        Task UpdatePaymentSettingsAsync(PaymentSettingsDto dto);
    }
}
