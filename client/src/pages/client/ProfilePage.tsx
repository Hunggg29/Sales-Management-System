import { motion } from 'framer-motion';
import { MdPerson, MdPhone, MdLocationOn, MdBusiness, MdEmail, MdSave, MdEdit } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerByUserId, updateCustomerByUserId } from '../../services/api';
import type { Customer, User } from '../../types';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    companyName: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchCustomerData(userData.userID);
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate('/');
    }
  }, [navigate]);

  const fetchCustomerData = async (userId: number) => {
    try {
      setIsLoading(true);
      setError('');
      const customerData = await getCustomerByUserId(userId);
      setCustomer(customerData);
      setFormData({
        fullName: customerData.fullName || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        companyName: customerData.companyName || '',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin khách hàng';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateCustomerByUserId(user.userID, {
        userID: user.userID,
        fullName: formData.fullName,
        phone: formData.phone || null,
        address: formData.address || null,
        companyName: formData.companyName || null,
      });

      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
      
      // Refresh customer data
      await fetchCustomerData(user.userID);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi cập nhật thông tin';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Hồ Sơ Của Tôi</h1>
            <p className="text-xl opacity-90">Quản lý thông tin cá nhân của bạn</p>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="max-w-[800px] mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <MdPerson className="w-12 h-12 text-red-600" />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{customer?.fullName || 'Chưa cập nhật'}</h2>
                  <p className="text-red-100 flex items-center gap-2">
                    <MdEmail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
              </div>
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <MdEdit className="w-5 h-5" />
                  Chỉnh sửa
                </motion.button>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {success && (
              <div className="mx-6 mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Họ và tên <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập họ và tên đầy đủ"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Địa chỉ
                </label>
                <div className="relative">
                  <MdLocationOn className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Tên công ty
                </label>
                <div className="relative">
                  <MdBusiness className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập tên công ty (nếu có)"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-red-600 text-white font-bold py-4 rounded-lg shadow-md hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <MdSave className="w-5 h-5" />
                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      // Reset form to original data
                      if (customer) {
                        setFormData({
                          fullName: customer.fullName || '',
                          phone: customer.phone || '',
                          address: customer.address || '',
                          companyName: customer.companyName || '',
                        });
                      }
                    }}
                    className="flex-1 bg-gray-500 text-white font-bold py-4 rounded-lg shadow-md hover:bg-gray-600 transition-all"
                  >
                    Hủy
                  </motion.button>
                </div>
              )}
            </form>

            {/* Account Info */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin tài khoản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tên đăng nhập</p>
                  <p className="font-semibold text-gray-800">{user?.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-800">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vai trò</p>
                  <p className="font-semibold text-gray-800">{user?.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ngày tạo tài khoản</p>
                  <p className="font-semibold text-gray-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
