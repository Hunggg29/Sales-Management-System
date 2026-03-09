import { useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdCategory,
  MdInventory,
  MdAttachMoney,
  MdBarChart,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
  MdNotifications,
  MdNotificationsActive,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { createOrderNotificationConnection, startConnection, stopConnection } from '../services/signalRService';
import type { User } from '../types';
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

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Kiểm tra quyền truy cập
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role !== 'Admin' && parsedUser.role !== 'Staff') {
        navigate('/');
        return;
      }
      setCurrentUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/');
    }
  }, [navigate]);

  // Setup SignalR for notifications
  useEffect(() => {
    if (!currentUser) return;

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      // Auto request permission after 2 seconds
      if (Notification.permission === 'default') {
        const timer = setTimeout(async () => {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission);
          if (permission === 'granted') {
            toast.success('Đã bật thông báo đơn hàng mới');
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
    }

    // Create notification sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCaY7vLTgjMGHm7A7+OZRSQGY63k8KeJZg==');

    // Setup SignalR connection
    const connection = createOrderNotificationConnection();
    connectionRef.current = connection;

    connection.on('ReceiveOrderNotification', (data: any) => {
      console.log('📦 New Order Notification:', data);
      
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

      // Show browser notification
      if (notificationPermission === 'granted') {
        const notification = new Notification('🎉 Đơn hàng mới!', {
          body: `${data.customerName} - ${data.totalAmount?.toLocaleString('vi-VN')}₫`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `order-${data.orderId}`,
          requireInteraction: true,
        });

        notification.onclick = () => {
          window.focus();
          navigate('/admin/orders');
          notification.close();
        };
      }
    });

    // Start connection
    startConnection(connection);

    // Cleanup
    return () => {
      if (connectionRef.current) {
        stopConnection(connectionRef.current);
      }
    };
  }, [currentUser, navigate, notificationPermission]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (connectionRef.current) {
      stopConnection(connectionRef.current);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    
    // Navigate to orders page
    navigate('/admin/orders');
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { icon: MdDashboard, label: 'Dashboard', path: '/admin/dashboard', color: 'text-blue-600' },
    { icon: MdShoppingCart, label: 'Đơn hàng', path: '/admin/orders', color: 'text-green-600' },
    { icon: MdPeople, label: 'Khách hàng', path: '/admin/customers', color: 'text-purple-600' },
    { icon: MdInventory, label: 'Sản phẩm', path: '/admin/products', color: 'text-orange-600' },
    { icon: MdCategory, label: 'Danh mục', path: '/admin/categories', color: 'text-pink-600' },
    { icon: MdAttachMoney, label: 'Thanh toán', path: '/admin/payments', color: 'text-emerald-600' },
    { icon: MdBarChart, label: 'Báo cáo', path: '/admin/reports', color: 'text-indigo-600' },
    { icon: MdSettings, label: 'Cài đặt', path: '/admin/settings', color: 'text-gray-600' },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-xs text-gray-500">Sales Management</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-semibold'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-red-600' : item.color
                  } group-hover:text-red-600`}
                />
                <span className={isActive ? 'font-semibold' : 'font-medium'}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile in Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {currentUser.userName}
              </p>
              <p className="text-xs text-gray-500">{currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <MdLogout className="w-4 h-4" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto ml-0 lg:ml-64">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <MdMenu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <div className="relative" ref={notificationDropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {unreadCount > 0 ? (
                  <MdNotificationsActive className="w-6 h-6 text-red-600 animate-pulse" />
                ) : (
                  <MdNotifications className="w-6 h-6 text-gray-600" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">
                      Thông báo {unreadCount > 0 && `(${unreadCount})`}
                    </h3>
                    <div className="flex gap-2">
                      {notifications.length > 0 && (
                        <>
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Đánh dấu đã đọc
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={clearAllNotifications}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Xóa tất cả
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <MdNotifications className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Chưa có thông báo nào</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${!notification.read ? 'bg-red-100' : 'bg-gray-100'}`}>
                              <MdShoppingCart className={`w-5 h-5 ${!notification.read ? 'text-red-600' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold mb-1 ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mb-1">
                                Khách hàng: {notification.customerName}
                              </p>
                              <p className="text-xs font-medium text-red-600">
                                {notification.totalAmount.toLocaleString('vi-VN')}₫
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.timestamp).toLocaleString('vi-VN')}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Online</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
