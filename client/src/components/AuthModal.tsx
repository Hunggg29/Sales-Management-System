import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { MdMail, MdLock, MdPerson } from 'react-icons/md';
import { toast } from 'react-toastify';
import { forgotPassword, login, loginWithGoogle, register } from '../services/api';
import CustomerInfoModal from './CustomerInfoModal';
import { useCart } from '../contexts/CartContext';
import { Modal, Input, Button, Alert } from './shared';
import type { LoginResponse } from '../types';

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
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');
  const canUseGoogleLogin = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  useEffect(() => {
    if (!isOpen) {
      setIsForgotMode(false);
      setForgotEmail('');
      setForgotSuccessMessage('');
      setError('');
      return;
    }

    if (mode !== 'signin') {
      setIsForgotMode(false);
      setForgotSuccessMessage('');
    }
  }, [isOpen, mode]);

  const handleLoginSuccess = async (response: LoginResponse) => {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    toast.success(`Đăng nhập thành công! Chào mừng ${response.user.userName}`);

    setFormData({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    });
    onClose();

    if (response.user.role === 'Admin') {
      window.location.href = '/admin/dashboard';
      return;
    }

    if (response.user.role === 'Staff') {
      window.location.href = '/staff/dashboard';
      return;
    }

    await refreshCart();
    window.location.reload();
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    setError('');

    if (!credentialResponse.credential) {
      const message = 'Không lấy được Google token';
      setError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginWithGoogle(credentialResponse.credential);
      await handleLoginSuccess(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đăng nhập Google thất bại';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
        
        // Auto login sau khi đăng ký
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
        // Gọi API login
        const response = await login(formData.email, formData.password);
        await handleLoginSuccess(response);
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

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = forgotEmail.trim();
    if (!email) {
      setError('Vui lòng nhập email để nhận liên kết đặt lại mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      const result = await forgotPassword(email);
      setForgotSuccessMessage(result.message);
      toast.info(result.message);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể gửi email đặt lại mật khẩu';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const openForgotPasswordForm = () => {
    setIsForgotMode(true);
    setForgotSuccessMessage('');
    setError('');
    setForgotEmail(formData.email);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isForgotMode ? 'Quên mật khẩu' : (mode === 'signin' ? 'Đăng nhập' : 'Đăng ký')}
      >
        {isForgotMode ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 sm:space-y-5">
            {error && <Alert variant="error">{error}</Alert>}
            {forgotSuccessMessage && <Alert variant="success">{forgotSuccessMessage}</Alert>}

            <Input
              label="Email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
              icon={<MdMail className="w-4 h-4 sm:w-5 sm:h-5" />}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              loadingText="Đang gửi..."
            >
              Tiếp tục
            </Button>

            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                setForgotSuccessMessage('');
                setError('');
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Quay lại đăng nhập
            </button>
          </form>
        ) : (
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

          {mode === 'signin' && (
            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={openForgotPasswordForm}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline"
                disabled={isLoading}
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

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

          {mode === 'signin' && (
            <>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-500">hoặc</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {canUseGoogleLogin ? (
                <div className="flex justify-center pt-1">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => {
                      const message = 'Đăng nhập Google thất bại';
                      setError(message);
                      toast.error(message);
                    }}
                    text="signin_with"
                    shape="rectangular"
                    size="large"
                  />
                </div>
              ) : (
                <p className="text-center text-xs text-amber-600 pt-1">
                  Thiếu cấu hình VITE_GOOGLE_CLIENT_ID nên chưa bật được đăng nhập Google.
                </p>
              )}
            </>
          )}

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
        )}
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
