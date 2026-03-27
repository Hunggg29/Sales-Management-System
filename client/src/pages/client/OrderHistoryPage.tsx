import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBag, MdRemoveRedEye, MdReceiptLong, MdAccessTime, MdCheckCircle } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getOrdersByUserIdPaged } from '../../services/api';
import { OrderStatusBadge } from '../../components/shared';
import type { Order, User } from '../../types';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const normalizeOrderStatus = (status?: string) => {
    const value = (status || '').toUpperCase();

    if (value === 'PENDING' || value === 'PENDING_APPROVAL') return 'CREATED';
    if (value === 'CONFIRMED') return 'APPROVED';

    return value;
  };

  const translatePaymentStatus = (status?: string) => {
    if (!status) return 'Chưa cập nhật';

    switch (status.toUpperCase()) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'UNPAID':
        return 'Chưa thanh toán';
      case 'FAILED':
        return 'Thanh toán thất bại';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  const paymentStatusClass = (status?: string) => {
    switch ((status || '').toUpperCase()) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'UNPAID':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'FAILED':
        return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'REFUNDED':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()),
    [orders]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      CREATED: 0,
      APPROVED: 0,
      SHIPPING: 0,
      DELIVERED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    for (const order of orders) {
      const status = normalizeOrderStatus(order.status);
      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    }

    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'ALL') return sortedOrders;
    return sortedOrders.filter((order) => normalizeOrderStatus(order.status) === selectedStatus);
  }, [sortedOrders, selectedStatus]);

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status?.toUpperCase() === 'COMPLETED').length,
    [orders]
  );

  const pendingOrders = useMemo(
    () => orders.filter((o) => ['CREATED', 'APPROVED', 'SHIPPING', 'DELIVERED'].includes(normalizeOrderStatus(o.status))).length,
    [orders]
  );

  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [orders]
  );

  const statusFilters = [
    { value: 'ALL', label: 'Tất cả', count: totalCount || orders.length },
    { value: 'CREATED', label: 'Đơn mới tạo', count: statusCounts.CREATED },
    { value: 'APPROVED', label: 'Đã xác nhận', count: statusCounts.APPROVED },
    { value: 'SHIPPING', label: 'Đang giao', count: statusCounts.SHIPPING },
    { value: 'DELIVERED', label: 'Đã giao', count: statusCounts.DELIVERED },
    { value: 'COMPLETED', label: 'Hoàn thành', count: statusCounts.COMPLETED },
    { value: 'CANCELLED', label: 'Đã hủy', count: statusCounts.CANCELLED },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setIsLoading(false);
        return;
      }

      try {
        const user: User = JSON.parse(userStr);
        const response = await getOrdersByUserIdPaged(user.userID, 1, 10);
        setOrders(response.items);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } catch (err) {
        toast.error('Không thể tải danh sách đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLoadMore = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    if (isLoadingMore || currentPage >= totalPages) return;

    try {
      setIsLoadingMore(true);
      const user: User = JSON.parse(userStr);
      const nextPage = currentPage + 1;
      const response = await getOrdersByUserIdPaged(user.userID, nextPage, 10);

      setOrders((prev) => [...prev, ...response.items]);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      toast.error('Không thể tải thêm đơn hàng');
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <MdShoppingBag className="w-8 h-8 text-red-600" />
            Lịch sử đơn hàng
          </h1>
          <p className="text-gray-600 mt-2">Quản lý và theo dõi đơn hàng của bạn</p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-red-50 border border-red-100 p-4">
              <p className="text-sm text-red-700">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-red-700">{totalCount || orders.length}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-sm text-emerald-700">Đơn hoàn thành</p>
              <p className="text-2xl font-bold text-emerald-700">{completedOrders}</p>
            </div>
            <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
              <p className="text-sm text-sky-700">Đơn đang xử lý</p>
              <p className="text-2xl font-bold text-sky-700">{pendingOrders}</p>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Tổng chi tiêu: <span className="font-semibold text-gray-800">{totalSpent.toLocaleString('vi-VN')}đ</span>
          </div>
          {totalCount > 0 && (
            <div className="mt-1 text-xs text-gray-500">
              Đã tải {orders.length}/{totalCount} đơn hàng
            </div>
          )}
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
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => {
                  const isActive = selectedStatus === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setSelectedStatus(filter.value)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600'}`}>
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-gray-600">
                Không có đơn hàng cho trạng thái đã chọn.
              </div>
            ) : filteredOrders.map((order) => (
              <div key={order.orderID} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b bg-white">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-800 font-semibold">
                        <MdReceiptLong className="w-5 h-5 text-red-600" />
                        Đơn #{order.orderID}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                        <MdAccessTime className="w-4 h-4" />
                        {new Date(order.orderDate).toLocaleString('vi-VN')}
                      </div>
                      <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${paymentStatusClass(order.payment?.paymentStatus)}`}>
                        {translatePaymentStatus(order.payment?.paymentStatus)}
                      </div>
                    </div>

                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="space-y-3">
                    {order.orderDetails?.slice(0, 3).map((item) => (
                      <div key={item.productID} className="flex items-start justify-between gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50/60">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {item.quantity} x {item.unitPrice.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                        <p className="font-semibold text-red-600 whitespace-nowrap">
                          {item.totalPrice.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    ))}

                    {order.orderDetails && order.orderDetails.length > 3 && (
                      <p className="text-sm text-gray-500 pl-1">
                        + {order.orderDetails.length - 3} sản phẩm khác
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 py-4 border-t bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Tổng thanh toán</p>
                    <p className="text-2xl font-bold text-red-600">{order.totalAmount.toLocaleString('vi-VN')}đ</p>
                  </div>

                  <Link
                    to={`/don-hang/${order.orderID}`}
                    className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <MdRemoveRedEye className="w-5 h-5" />
                    Chi tiết đơn hàng
                  </Link>
                </div>
              </div>
            ))}

            {selectedStatus === 'ALL' && currentPage < totalPages && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60"
                >
                  {isLoadingMore ? 'Đang tải...' : 'Xem thêm đơn hàng'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
