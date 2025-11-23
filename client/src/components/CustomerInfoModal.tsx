import { useState } from 'react';
import { MdPerson, MdPhone, MdLocationOn, MdBusiness } from 'react-icons/md';
import { toast } from 'react-toastify';
import { createCustomer } from '../services/api';
import { Modal, Input, Button, Alert } from './shared';

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
      
      toast.success(`Đăng ký thành công! Chào mừng ${customer.fullName}`);
      
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hoàn tất đăng ký"
      closeOnBackdropClick={false}
      showCloseButton={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <Alert variant="info" title="Bước cuối cùng!">
          Vui lòng cung cấp thông tin của bạn để hoàn tất đăng ký.{' '}
          <span className="font-semibold">Bạn cần hoàn thành bước này để sử dụng hệ thống.</span>
        </Alert>

        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        <Input
          label="Họ và tên"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder="Nhập họ và tên đầy đủ"
          icon={<MdPerson className="w-4 h-4 sm:w-5 sm:h-5" />}
        />

        <Input
          label="Số điện thoại"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nhập số điện thoại"
          icon={<MdPhone className="w-4 h-4 sm:w-5 sm:h-5" />}
        />

        <Input
          label="Địa chỉ"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Nhập địa chỉ"
          icon={<MdLocationOn className="w-4 h-4 sm:w-5 sm:h-5" />}
        />

        <Input
          label="Tên công ty"
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Nhập tên công ty (nếu có)"
          icon={<MdBusiness className="w-4 h-4 sm:w-5 sm:h-5" />}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          loadingText="Đang xử lý..."
          className="mt-4 sm:mt-6"
        >
          Hoàn tất đăng ký
        </Button>
      </form>
    </Modal>
  );
};

export default CustomerInfoModal;
