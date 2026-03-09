import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../services/api';
import { Modal, Button, Alert } from '../components/shared';
import { useCart } from '../contexts/CartContext';
import type { User, Cart } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  user: User;
}

const CheckoutModal = ({ isOpen, onClose, cart, user }: CheckoutModalProps) => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cart.cartItems?.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  ) || 0;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      console.log('Creating order with data:', {
        paymentMethod: 'COD',
        shippingAddress: null,
        note: null,
      });
      
      const order = await createOrder(user.userID, {
        paymentMethod: 'COD',
        shippingAddress: null,
        note: null,
      });

      // Refresh giỏ hàng và navigate
      await refreshCart();
      toast.success('Đặt hàng thành công!');
      onClose();
      navigate(`/don-hang/${order.orderID}`);
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Đặt hàng thất bại';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Xác nhận đặt hàng"
        closeOnBackdropClick={!isProcessing}
      >
        <div className="space-y-5">
          <Alert variant="info" title="Thông tin đơn hàng">
            Tổng số sản phẩm: <strong>{cart.cartItems?.length || 0}</strong>
            <br />
            Tổng tiền: <strong className="text-lg">{totalAmount.toLocaleString('vi-VN')}₫</strong>
          </Alert>

          <Alert variant="warning" title="Lưu ý">
            Đơn hàng sẽ được tạo và chờ xác nhận. Bạn sẽ thanh toán sau khi đơn hàng được giao thành công.
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              fullWidth
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleCheckout}
              fullWidth
              isLoading={isProcessing}
              loadingText="Đang xử lý..."
            >
              Đặt hàng
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CheckoutModal;
