import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MdLock } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Alert, Button, Input } from '../../components/shared';
import { resetPassword } from '../../services/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isTokenValid = email.length > 0 && token.length > 0;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setIsLoading(true);
      const result = await resetPassword(email, token, newPassword);
      setSuccess(result.message);
      toast.success(result.message);
      setNewPassword('');
      setConfirmPassword('');
      window.setTimeout(() => {
        navigate('/?auth=signin');
      }, 1200);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể đặt lại mật khẩu';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3 text-center">Đặt lại mật khẩu</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>

        {!isTokenValid && (
          <Alert variant="error">
            Liên kết không hợp lệ. Vui lòng yêu cầu quên mật khẩu lại từ màn hình đăng nhập.
          </Alert>
        )}

        {isTokenValid && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="error">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Input
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              icon={<MdLock className="w-4 h-4 sm:w-5 sm:h-5" />}
            />

            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={<MdLock className="w-4 h-4 sm:w-5 sm:h-5" />}
            />

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Cập nhật mật khẩu
            </Button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
