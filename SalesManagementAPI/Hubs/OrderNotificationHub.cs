using Microsoft.AspNetCore.SignalR;

namespace SalesManagementAPI.Hubs
{
    public class OrderNotificationHub : Hub
    {
        public async Task SendOrderNotification(string message)
        {
            await Clients.All.SendAsync("ReceiveOrderNotification", message);
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
