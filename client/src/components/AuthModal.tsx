import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdMail, MdLock, MdPerson } from 'react-icons/md';
import { useState } from 'react';
import { login, register } from '../services/api';
import CustomerInfoModal from './CustomerInfoModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSwitchMode: () => void;
}

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Customer info modal states
  const [showCustomerInfoModal, setShowCustomerInfoModal] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);
    
    try {
      if (mode === 'signup') {
        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu không khớp!');
          setIsLoading(false);
          return;
        }
        
        // Call register API
        const response = await register(
          formData.username,
          formData.email,
          formData.password
        );
        
        // Extract userId from response (assuming it's in the message or add it to backend response)
        // For now, we'll need to login to get the userId or modify backend to return it
        // Let's try to login automatically to get userId
        const loginResponse = await login(formData.email, formData.password);
        
        // Save token temporarily
        localStorage.setItem('authToken', loginResponse.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
        
        // Reset form
        setFormData({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        });
        
        // Show customer info modal
        setRegisteredUserId(loginResponse.user.userID);
        setShowCustomerInfoModal(true);
        onClose();
        
      } else {
        // Call login API
        const response = await login(formData.email, formData.password);
        
        // Save token to localStorage (for future authenticated requests)
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        alert(`Đăng nhập thành công! Chào mừng ${response.user.userName}`);
        
        // Reset form and close
        setFormData({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        });
        onClose();
        
        // Optionally: trigger a page refresh or update app state
        window.location.reload();
      }
    } catch (err) {
      // Display error message
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi';
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

  const handleCustomerInfoClose = () => {
    setShowCustomerInfoModal(false);
    setRegisteredUserId(null);
    // Optionally reload page to show logged in state
    window.location.reload();
  };

  return (
    <>
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
                {mode === 'signin' ? 'Đăng nhập' : 'Đăng ký'}
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
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Email
                </label>
                <div className="relative">
                  <MdMail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Nhập địa chỉ email"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Username Field (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <MdPerson className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Nhập tên đăng nhập"
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Confirm Password Field (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <MdLock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Nhập lại mật khẩu"
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm sm:text-base text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white font-bold py-3 sm:py-4 rounded-lg shadow-md hover:bg-red-700 transition-all mt-4 sm:mt-6 text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang xử lý...' : (mode === 'signin' ? 'Đăng nhập' : 'Đăng ký')}
              </motion.button>

              {/* Switch Mode */}
              <div className="text-center pt-3 sm:pt-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  {mode === 'signin' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                  <button
                    type="button"
                    onClick={onSwitchMode}
                    className="text-red-600 font-semibold hover:text-red-700 hover:underline"
                  >
                    {mode === 'signin' ? 'Đăng ký ngay' : 'Đăng nhập'}
                  </button>
                </p>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Customer Info Modal */}
    {registeredUserId && (
      <CustomerInfoModal
        isOpen={showCustomerInfoModal}
        onClose={handleCustomerInfoClose}
        userId={registeredUserId}
      />
    )}
    </>
  );
};

export default AuthModal;
