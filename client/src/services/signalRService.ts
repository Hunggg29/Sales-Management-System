import * as signalR from '@microsoft/signalr';

export const createOrderNotificationConnection = () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7078/hubs/order-notifications', {
      withCredentials: true,
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  return connection;
};

export const startConnection = async (connection: signalR.HubConnection) => {
  try {
    await connection.start();
    console.log('✅ SignalR Connected - Order Notifications');
    return true;
  } catch (err) {
    console.error('❌ SignalR Connection Error:', err);
    return false;
  }
};

export const stopConnection = async (connection: signalR.HubConnection) => {
  try {
    await connection.stop();
    console.log('SignalR Disconnected');
  } catch (err) {
    console.error('Error stopping connection:', err);
  }
};
