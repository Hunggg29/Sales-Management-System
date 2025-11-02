import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdPerson, MdPhone, MdLocationOn, MdBusiness } from 'react-icons/md';
import { useState } from 'react';
import { createCustomer } from '../services/api';

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const CustomerInfoModal = ({ isOpen, onClose, userId }: CustomerInfoModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    companyName: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const customer = await createCustomer({
        userID: userId,
        fullName: formData.fullName,
        phone: formData.phone || null,
        address: formData.address || null,
        companyName: formData.companyName || null,
      });
      
      alert('Thông tin khách hàng đã được lưu thành công! Chào mừng ' + customer.fullName);
      
      // Reset form and close
      setFormData({
        fullName: '',
        phone: '',
        address: '',
        companyName: '',
      });
      onClose();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lưu thông tin';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-full max-w-md bg-white rounded-xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-red-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Thông tin khách hàng
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
              >
                <MdClose className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                <p className="font-semibold mb-1">Vui lòng bổ sung thông tin</p>
                <p>Để hoàn tất quá trình đăng ký, vui lòng cung cấp thông tin bổ sung của bạn.</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {/* Full Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Họ và tên <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ và tên đầy đủ"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Địa chỉ
                </label>
                <div className="relative">
                  <MdLocationOn className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Company Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Tên công ty
                </label>
                <div className="relative">
                  <MdBusiness className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Nhập tên công ty (nếu có)"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white font-bold py-3 sm:py-4 rounded-lg shadow-md hover:bg-red-700 transition-all mt-4 sm:mt-6 text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang lưu...' : 'Hoàn tất đăng ký'}
              </motion.button>

              {/* Skip Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full text-gray-600 hover:text-gray-800 font-semibold text-sm transition-colors"
              >
                Bỏ qua (có thể cập nhật sau)
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomerInfoModal;
