import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  MdStore, 
  MdPerson, 
  MdLock, 
  MdNotifications, 
  MdSave,
  MdEmail,
  MdPhone,
  MdLocationOn
} from 'react-icons/md';
import AdminLayout from '../../components/AdminLayout';
import { useSettings } from '../../contexts/SettingsContext';
import {
  getStoreInfo,
  updateStoreInfo,
  getUserSettings,
  updateUserSettings,
  getNotificationSettings,
  updateNotificationSettings,
} from '../../services/api';

const AdminSettingsPage = () => {
  const { refreshSettings } = useSettings();
  // Store Information
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'CÔNG TY TNHH KAROTA VIỆT NAM',
    email: 'thanglongtape@gmail.com',
    phone: '0243.681.6262',
    address: 'Xã Thanh Trì - Hà Nội',
    taxCode: '0123456789',
  });

  // User Settings
  const [userSettings, setUserSettings] = useState({
    fullName: 'Admin',
    email: 'admin@salesmanagement.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerMessages: false,
  });

  const [activeTab, setActiveTab] = useState('store');
  const [isLoading, setIsLoading] = useState(false);

  // Load data when component mounts or tab changes
  useEffect(() => {
    loadSettingsData();
  }, [activeTab]);

  const loadSettingsData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'store') {
        const data = await getStoreInfo();
        setStoreInfo(data);
      } else if (activeTab === 'user') {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.userId) {
          const data = await getUserSettings(user.userId);
          setUserSettings({
            fullName: data.fullName,
            email: data.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
      } else if (activeTab === 'notifications') {
        const data = await getNotificationSettings();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Không thể tải cài đặt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateStoreInfo(storeInfo);
      await refreshSettings(); // Refresh settings in context for client pages
      toast.success('Đã lưu thông tin cửa hàng');
    } catch (error) {
      toast.error('Không thể lưu thông tin cửa hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userSettings.newPassword && userSettings.newPassword !== userSettings.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await updateUserSettings(user.userId, {
        fullName: userSettings.fullName,
        email: userSettings.email,
        currentPassword: userSettings.currentPassword || undefined,
        newPassword: userSettings.newPassword || undefined,
      });
      toast.success('Đã cập nhật thông tin người dùng');
      
      // Clear password fields
      setUserSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật thông tin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateNotificationSettings(notifications);
      toast.success('Đã lưu cài đặt thông báo');
    } catch (error) {
      toast.error('Không thể lưu cài đặt thông báo');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'store', label: 'Thông tin cửa hàng', icon: MdStore },
    { id: 'user', label: 'Tài khoản', icon: MdPerson },
    { id: 'notifications', label: 'Thông báo', icon: MdNotifications },
  ];

  return (
    <AdminLayout title="Cài đặt">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              {/* Store Information Tab */}
              {activeTab === 'store' && (
            <form onSubmit={handleStoreInfoSubmit} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên cửa hàng
                </label>
                <div className="relative">
                  <MdStore className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={storeInfo.storeName}
                    onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={storeInfo.email}
                    onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={storeInfo.phone}
                    onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <div className="relative">
                  <MdLocationOn className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={storeInfo.address}
                    onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  value={storeInfo.taxCode}
                  onChange={(e) => setStoreInfo({ ...storeInfo, taxCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdSave className="w-5 h-5" />
                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>
          )}

          {/* User Account Tab */}
          {activeTab === 'user' && (
            <form onSubmit={handleUserSettingsSubmit} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={userSettings.fullName}
                  onChange={(e) => setUserSettings({ ...userSettings, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <MdLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={userSettings.currentPassword}
                        onChange={(e) => setUserSettings({ ...userSettings, currentPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <MdLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={userSettings.newPassword}
                        onChange={(e) => setUserSettings({ ...userSettings, newPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <MdLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={userSettings.confirmPassword}
                        onChange={(e) => setUserSettings({ ...userSettings, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdSave className="w-5 h-5" />
                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationsSubmit} className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Thông báo qua Email</p>
                    <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Thông báo đơn hàng mới</p>
                    <p className="text-sm text-gray-600">Nhận thông báo khi có đơn hàng mới</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.orderNotifications}
                      onChange={(e) => setNotifications({ ...notifications, orderNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Cảnh báo hàng tồn kho thấp</p>
                    <p className="text-sm text-gray-600">Nhận cảnh báo khi sản phẩm sắp hết hàng</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.lowStockAlerts}
                      onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Tin nhắn từ khách hàng</p>
                    <p className="text-sm text-gray-600">Nhận thông báo khi có tin nhắn từ khách hàng</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.customerMessages}
                      onChange={(e) => setNotifications({ ...notifications, customerMessages: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdSave className="w-5 h-5" />
                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>
          )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
