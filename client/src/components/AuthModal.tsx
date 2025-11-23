import { useState } from 'react';
import { MdMail, MdLock, MdPerson } from 'react-icons/md';
import { toast } from 'react-toastify';
import { login, register } from '../services/api';
import CustomerInfoModal from './CustomerInfoModal';
import { useCart } from '../contexts/CartContext';
import { Modal, Input, Button, Alert } from './shared';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSwitchMode: () => void;
}

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) => {
  const { refreshCart } = useCart();
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
        await register(
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
        
        toast.success(`Đăng nhập thành công! Chào mừng ${response.user.userName}`);
        
        // Reset form and close
        setFormData({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        });
        onClose();
        
        // Refresh cart and reload page
        await refreshCart();
        window.location.reload();
      }
    } catch (err) {
      // Display error message
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi';
      toast.error(errorMessage);
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
    // Reload page to show logged in state
    window.location.reload();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={mode === 'signin' ? 'Đăng nhập' : 'Đăng ký'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <Alert variant="error">{error}</Alert>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Nhập địa chỉ email"
            icon={<MdMail className="w-4 h-4 sm:w-5 sm:h-5" />}
          />

          {mode === 'signup' && (
            <Input
              label="Tên đăng nhập"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập"
              icon={<MdPerson className="w-4 h-4 sm:w-5 sm:h-5" />}
            />
          )}

          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Nhập mật khẩu"
            icon={<MdLock className="w-4 h-4 sm:w-5 sm:h-5" />}
          />

          {mode === 'signup' && (
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
              icon={<MdLock className="w-4 h-4 sm:w-5 sm:h-5" />}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            loadingText="Đang xử lý..."
            className="mt-4 sm:mt-6"
          >
            {mode === 'signin' ? 'Đăng nhập' : 'Đăng ký'}
          </Button>

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
      </Modal>

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
