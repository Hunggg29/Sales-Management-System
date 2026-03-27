import { useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdPeople, MdShoppingCart, MdPayment, MdLogout, MdPerson, MdNotifications, MdNotificationsActive } from 'react-icons/md';
import { toast } from 'react-toastify';
import { createOrderNotificationConnection, startConnection, stopConnection } from '../services/signalRService';
import type * as signalR from '@microsoft/signalr';

interface Notification {
  id: string;
  orderId: number;
  customerName: string;
  totalAmount: number;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface SalesStaffLayoutProps {
  children: ReactNode;
  title: string;
}

const SalesStaffLayout = ({ children, title }: SalesStaffLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Setup SignalR for notifications
  // Bước 1: Xin quyền thông báo trình duyệt (tách riêng khỏi SignalR)
  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      const timer = setTimeout(async () => {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          toast.success('Đã bật thông báo đơn hàng mới');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Bước 2: Khởi tạo SignalR (luôn chạy, không phụ thuộc vào quyền thông báo)
  useEffect(() => {
    // Create notification sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCaY7vLTgjMGHm7A7+OZRSQGY63k8KeJZg==');

    // Setup SignalR connection
    const connection = createOrderNotificationConnection();
    connectionRef.current = connection;

    connection.on('ReceiveOrderNotification', (data: any) => {
      console.log('📦 New Order Notification (Staff):', data);
      
      // Add to notifications list
      const newNotification: Notification = {
        id: `${data.orderId}-${Date.now()}`,
        orderId: data.orderId,
        customerName: data.customerName || 'Khách hàng',
        totalAmount: data.totalAmount || 0,
        message: data.message || `Đơn hàng mới #${data.orderId}`,
        timestamp: new Date(),
        read: false,
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Dispatch custom event for orders page to listen
      window.dispatchEvent(new CustomEvent('newOrder', { detail: data }));
      
      // Play sound
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.log('Cannot play sound:', err));
      }
      
      // Show toast notification
      toast.success(
        <div>
          <strong className="block">🎉 Đơn hàng mới!</strong>
          <span className="text-sm">{data.message}</span>
          <div className="text-sm mt-1 text-gray-600">
            Giá trị: {data.totalAmount?.toLocaleString('vi-VN')}₫
          </div>
        </div>,
        {
          autoClose: 8000,
          closeButton: true,
        }
      );

      // Show browser notification — dùng Notification.permission trực tiếp để tránh stale closure
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Đơn hàng mới!', {
          body: `${data.message}\nGiá trị: ${data.totalAmount?.toLocaleString('vi-VN')}₫`,
          icon: '/logo.png',
          badge: '/badge.png',
          tag: `order-${data.orderId}`,
        });
      }
    });

    startConnection(connection).then(ok => {
      if (ok) console.log('✅ SignalR connected (Staff)');
      else console.warn('⚠️ SignalR failed to connect (Staff)');
    });

    // Cleanup on unmount
    return () => {
      if (connectionRef.current) {
        stopConnection(connectionRef.current);
      }
    };
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/staff/dashboard', icon: MdDashboard, label: 'Tổng quan' },
    { path: '/staff/customers', icon: MdPeople, label: 'Khách hàng' },
    { path: '/staff/orders', icon: MdShoppingCart, label: 'Đơn hàng' },
    { path: '/staff/payments', icon: MdPayment, label: 'Thanh toán' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-xl z-50">
        {/* Logo */}
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MdPerson className="w-8 h-8" />
            <span>Sales Staff</span>
          </h1>
          <p className="text-blue-100 text-sm mt-1">Nhân viên kinh doanh</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-500">
          <div className="mb-3 px-2">
            <p className="text-sm text-blue-100">Đăng nhập với</p>
            <p className="font-semibold truncate">
              {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).userName : 'Staff User'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 rounded-lg transition-colors"
          >
            <MdLogout className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Thông báo"
                >
                  {unreadCount > 0 ? (
                    <MdNotificationsActive className="w-6 h-6 text-blue-600" />
                  ) : (
                    <MdNotifications className="w-6 h-6 text-gray-600" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                      <h3 className="font-semibold text-gray-800">
                        Thông báo ({unreadCount} chưa đọc)
                      </h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <MdNotifications className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>Chưa có thông báo nào</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              !notif.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() => {
                                  markAsRead(notif.id);
                                  navigate('/staff/orders');
                                  setShowNotifications(false);
                                }}
                              >
                                <p className="font-medium text-gray-900 text-sm mb-1">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Khách hàng: {notif.customerName}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Giá trị: {notif.totalAmount.toLocaleString('vi-VN')}₫
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notif.timestamp).toLocaleString('vi-VN')}
                                </p>
                              </div>
                              <button
                                onClick={() => clearNotification(notif.id)}
                                className="text-gray-400 hover:text-red-600 text-xs"
                                title="Xóa"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <button
                          onClick={() => {
                            navigate('/staff/orders');
                            setShowNotifications(false);
                          }}
                          className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Xem tất cả đơn hàng →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SalesStaffLayout;
