import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdMail, MdLock, MdPerson } from 'react-icons/md';
import { useState } from 'react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup') {
      // Validate confirm password
      if (formData.password !== formData.confirmPassword) {
        alert('Mật khẩu không khớp!');
        return;
      }
      console.log('Sign Up:', { 
        email: formData.email, 
        username: formData.username, 
        password: formData.password 
      });
      alert('Đăng ký thành công!');
    } else {
      console.log('Sign In:', { 
        email: formData.email, 
        password: formData.password 
      });
      alert('Đăng nhập thành công!');
    }
    
    // Reset form
    setFormData({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    });
    onClose();
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
                className="w-full bg-red-600 text-white font-bold py-3 sm:py-4 rounded-lg shadow-md hover:bg-red-700 transition-all mt-4 sm:mt-6 text-sm sm:text-base"
              >
                {mode === 'signin' ? 'Đăng nhập' : 'Đăng ký'}
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
  );
};

export default AuthModal;
