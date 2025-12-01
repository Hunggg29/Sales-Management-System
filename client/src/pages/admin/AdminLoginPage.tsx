import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdminPanelSettings } from 'react-icons/md';
import AuthModal from '../../components/AuthModal';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const [authMode] = useState<'signin' | 'signup'>('signin');

  // Kiểm tra nếu đã đăng nhập với role Admin/Staff
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser.role === 'Admin' || parsedUser.role === 'Staff') {
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [navigate]);

  const handleClose = () => {
    setIsAuthModalOpen(false);
    navigate('/'); // Quay về trang chủ nếu đóng modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Admin header card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4 shadow-lg">
            <MdAdminPanelSettings className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Trang Quản Trị
          </h1>
          <p className="text-gray-600">
            Dành cho Admin & Staff
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              🔐 Chỉ người dùng có quyền Admin hoặc Staff mới có thể truy cập
            </p>
            <p className="text-xs text-gray-400">
              Vui lòng đăng nhập với tài khoản quản trị viên
            </p>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleClose}
          mode={authMode}
          onSwitchMode={() => {}}
          isAdminMode={true}
        />
      </div>
    </div>
  );
};

export default AdminLoginPage;
