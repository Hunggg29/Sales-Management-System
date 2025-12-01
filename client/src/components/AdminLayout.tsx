import { useEffect, useState } from 'react';
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
} from 'react-icons/md';
import type { User } from '../types';

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

  // Kiểm tra quyền truy cập
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/admin/login');
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
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/admin/login');
  };

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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
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
      <main className="flex-1 overflow-auto">
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
