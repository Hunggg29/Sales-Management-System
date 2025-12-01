import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBag, MdRemoveRedEye } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getOrdersByUserId } from '../../services/api';
import type { Order, User } from '../../types';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setIsLoading(false);
        return;
      }

      try {
        const user: User = JSON.parse(userStr);
        const data = await getOrdersByUserId(user.userID);
        setOrders(data);
      } catch (err) {
        toast.error('Không thể tải danh sách đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      Pending: 'Chờ xử lý',
      Processing: 'Đang xử lý',
      Completed: 'Hoàn thành',
      Cancelled: 'Đã hủy',
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <MdShoppingBag className="w-8 h-8 text-red-600" />
            Lịch sử đơn hàng
          </h1>
          <p className="text-gray-600 mt-2">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MdShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Chưa có đơn hàng nào
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
            </p>
            <Link
              to="/san-pham"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderID} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Mã đơn hàng</p>
                      <p className="font-bold text-lg">#{order.orderID}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-300"></div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày đặt</p>
                      <p className="font-semibold">
                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.orderDetails?.slice(0, 2).map((item) => (
                      <div key={item.productID} className="flex justify-between items-center">
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
                    {order.orderDetails && order.orderDetails.length > 2 && (
                      <p className="text-sm text-gray-500">
                        Và {order.orderDetails.length - 2} sản phẩm khác...
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="text-2xl font-bold text-red-600">
                      {order.totalAmount.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <Link
                    to={`/don-hang/${order.orderID}`}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <MdRemoveRedEye className="w-5 h-5" />
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
