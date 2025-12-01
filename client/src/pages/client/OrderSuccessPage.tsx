import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdArrowBack, MdLocalShipping } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getOrderById } from '../../services/api';
import type { Order } from '../../types';

const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const data = await getOrderById(parseInt(orderId));
        setOrder(data);
      } catch (err) {
        toast.error('Không thể tải thông tin đơn hàng');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!order) return null;

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      COD: 'Thanh toán khi nhận hàng',
      BankTransfer: 'Chuyển khoản ngân hàng',
      CreditCard: 'Thẻ tín dụng/Ghi nợ',
    };
    return methods[method] || method;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <MdCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
          </p>
          <div className="inline-block bg-gray-100 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-600">Mã đơn hàng</p>
            <p className="text-2xl font-bold text-red-600">#{order.orderID}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MdLocalShipping className="w-6 h-6 mr-2 text-red-600" />
            Chi tiết đơn hàng
          </h2>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Ngày đặt hàng:</span>
              <span className="font-semibold">
                {new Date(order.orderDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-semibold">
                {order.payment && getPaymentMethodText(order.payment.paymentMethod)}
              </span>
            </div>
            {order.payment && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-mono text-sm">{order.payment.transactionCode}</span>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Sản phẩm đã đặt:</h3>
            <div className="space-y-3">
              {order.orderDetails?.map((item) => (
                <div key={item.productID} className="flex justify-between items-center py-3 border-b">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      {item.unitPrice.toLocaleString('vi-VN')}₫ x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-red-600">
                    {item.totalPrice.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
              <span className="text-2xl font-bold text-red-600">
                {order.totalAmount.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            <MdArrowBack className="w-5 h-5" />
            Về trang chủ
          </button>
          <button
            onClick={() => navigate('/lich-su-don-hang')}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Xem đơn hàng của tôi
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
