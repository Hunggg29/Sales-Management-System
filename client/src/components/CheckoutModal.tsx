import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPayment, MdAccountBalance } from 'react-icons/md';
import { toast } from 'react-toastify';
import { createOrder } from '../services/api';
import { Modal, Button, Alert } from '../components/shared';
import type { User, Cart } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  user: User;
}

const CheckoutModal = ({ isOpen, onClose, cart, user }: CheckoutModalProps) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cart.cartItems?.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  ) || 0;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      console.log('Creating order with data:', {
        paymentMethod,
        shippingAddress: null,
        note: null,
      });
      
      const order = await createOrder(user.userID, {
        paymentMethod,
        shippingAddress: null,
        note: null,
      });

      // Nếu chọn Bank Transfer, redirect đến VNPay
      if (paymentMethod === 'BankTransfer') {
        // Gọi API tạo payment URL
        const response = await fetch(
          `https://localhost:7078/api/Payment/create-vnpay-url?orderId=${order.orderID}`,
          { method: 'POST' }
        );
        const data = await response.json();
        
        if (data.paymentUrl) {
          // Redirect đến VNPay
          window.location.href = data.paymentUrl;
          return;
        }
      }

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thanh toán"
      closeOnBackdropClick={!isProcessing}
    >
      <div className="space-y-5">
        <Alert variant="info" title="Thông tin đơn hàng">
          Tổng số sản phẩm: <strong>{cart.cartItems?.length || 0}</strong>
          <br />
          Tổng tiền: <strong className="text-lg">{totalAmount.toLocaleString('vi-VN')}₫</strong>
        </Alert>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Phương thức thanh toán
          </label>
          <div className="space-y-3">
            {/* COD */}
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-red-600"
              />
              <div className="ml-3 flex items-center">
                <MdPayment className="w-6 h-6 text-red-600 mr-2" />
                <div>
                  <p className="font-semibold">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </div>
            </label>

            {/* Bank Transfer - VNPay */}
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="BankTransfer"
                checked={paymentMethod === 'BankTransfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-red-600"
              />
              <div className="ml-3 flex items-center">
                <MdAccountBalance className="w-6 h-6 text-blue-600 mr-2" />
                <div>
                  <p className="font-semibold">Chuyển khoản ngân hàng (VNPay)</p>
                  <p className="text-sm text-gray-600">Thanh toán qua cổng VNPay - Hỗ trợ ATM, Visa, Mastercard, QR Code</p>
                </div>
              </div>
            </label>
          </div>
        </div>

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
  );
};

export default CheckoutModal;
