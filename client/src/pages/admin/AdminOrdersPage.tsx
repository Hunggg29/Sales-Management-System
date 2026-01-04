import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdVisibility, MdCheck, MdClose, MdLocalShipping, MdCheckCircle } from 'react-icons/md';
import AdminLayout from '../../components/AdminLayout';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Pagination } from '../../components/shared';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import type { Order } from '../../types';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    orderId: number | null;
    status: string | null;
    type: 'warning' | 'danger' | 'info' | 'success';
  }>({ isOpen: false, message: '', orderId: null, status: null, type: 'warning' });

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Listen for new order events from AdminLayout
    const handleNewOrder = () => {
      console.log('📦 Orders page: Refreshing due to new order');
      fetchOrders();
    };
    
    window.addEventListener('newOrder', handleNewOrder as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('newOrder', handleNewOrder as EventListener);
    };
  }, []);

  const handleUpdateStatus = async (orderId: number, status: string) => {
    const statusLabels: Record<string, string> = {
      'Pending': 'Chờ duyệt',
      'Confirmed': 'Đã duyệt',
      'Cancelled': 'Đã hủy',
      'Processing': 'Đang xử lý',
      'Completed': 'Hoàn thành',
    };

    // Xác định màu dialog dựa trên trạng thái mới
    let dialogType: 'warning' | 'danger' | 'info' | 'success' = 'warning';
    if (status === 'Cancelled') {
      dialogType = 'danger';
    } else if (status === 'Processing') {
      dialogType = 'info';
    } else if (status === 'Confirmed' || status === 'Completed') {
      dialogType = 'success';
    }

    setConfirmDialog({
      isOpen: true,
      message: `Bạn có chắc muốn chuyển trạng thái đơn hàng thành "${statusLabels[status]}"?`,
      orderId,
      status,
      type: dialogType
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmDialog.orderId || !confirmDialog.status) return;

    try {
      await updateOrderStatus(confirmDialog.orderId, confirmDialog.status);
      toast.success('Cập nhật trạng thái thành công');
      fetchOrders();
      if (selectedOrder?.orderID === confirmDialog.orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: confirmDialog.status! } : null);
      }
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  const statusColors: Record<string, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Confirmed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
  };

  const statusLabels: Record<string, string> = {
    'Pending': 'Chờ duyệt',
    'Confirmed': 'Đã duyệt',
    'Cancelled': 'Đã hủy',
    'Processing': 'Đang xử lý',
    'Completed': 'Hoàn thành',
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderID.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <AdminLayout title="Quản lý đơn hàng">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Search Bar and Filters */}
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng hoặc ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'Pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              Chờ duyệt ({orders.filter(o => o.status === 'Pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('Confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'Confirmed'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Đã duyệt ({orders.filter(o => o.status === 'Confirmed').length})
            </button>
            <button
              onClick={() => setStatusFilter('Processing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'Processing'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Đang xử lý ({orders.filter(o => o.status === 'Processing').length})
            </button>
            <button
              onClick={() => setStatusFilter('Completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'Completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Hoàn thành ({orders.filter(o => o.status === 'Completed').length})
            </button>
            <button
              onClick={() => setStatusFilter('Cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'Cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Đã hủy ({orders.filter(o => o.status === 'Cancelled').length})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày đặt</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tổng tiền</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy đơn hàng nào phù hợp
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.orderID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order.orderID}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.customer?.fullName || 'Khách vãng lai'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-red-600">
                        {order.totalAmount.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <MdVisibility className="w-5 h-5" />
                        </button>
                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.orderID, 'Confirmed')}
                              className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                              title="Duyệt đơn"
                            >
                              <MdCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.orderID, 'Cancelled')}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <MdClose className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {order.status === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(order.orderID, 'Processing')}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            title="Giao hàng"
                          >
                            <MdLocalShipping className="w-5 h-5" />
                          </button>
                        )}
                        {order.status === 'Processing' && (
                          <button
                            onClick={() => handleUpdateStatus(order.orderID, 'Completed')}
                            className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                            title="Hoàn thành"
                          >
                            <MdCheckCircle className="w-5 h-5" />
                          </button>
                        )}  </td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>
        )}
        
        {!isLoading && filteredOrders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredOrders.length}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Chi tiết đơn hàng #{selectedOrder.orderID}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <MdClose className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Thông tin thanh toán</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Người đặt:</p>
                    <p className="font-medium">{selectedOrder.customer?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Số điện thoại:</p>
                    <p className="font-medium">{selectedOrder.customer?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phương thức:</p>
                    <p className="font-medium">{selectedOrder.payment?.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Trạng thái TT:</p>
                    <p className="font-medium">{selectedOrder.payment?.paymentStatus}</p>
                  </div>
                </div>
              </div>

              {/* Order Items with Stock Info */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Sản phẩm</h4>
                <div className="space-y-3">
                  {selectedOrder.orderDetails?.map((item) => (
                    <div key={item.productID} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <div className="text-sm text-gray-500 mt-1">
                          <span>SL đặt: <span className="font-bold text-red-600">{item.quantity}</span></span>
                          {/* Note: The API currently returns Product details inside OrderDetail. 
                                         We need to verify if backend includes StockQuantity in the nested product object.
                                         Based on previous analysis of OrderService, it includes `od.Product`.
                                     */}
                          <span className="mx-2 text-gray-300">|</span>
                          <span>Tồn kho: <span className="font-bold text-green-600">
                            {(item as any).product?.stockQuantity ?? 'N/A'}
                          </span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          {item.totalPrice.toLocaleString('vi-VN')}₫
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.unitPrice.toLocaleString('vi-VN')}₫/cái
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              {selectedOrder.status === 'Pending' ? (
                <>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.orderID, 'Cancelled');
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                  >
                    Từ chối đơn
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.orderID, 'Confirmed');
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Duyệt đơn hàng
                  </button>
                </>
              ) : (
                <div className="text-gray-500 italic">Đơn hàng {statusLabels[selectedOrder.status]?.toLowerCase()}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Xác nhận thay đổi"
        message={confirmDialog.message}
        confirmText="Đồng ý"
        cancelText="Hủy"
        type={confirmDialog.type}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setConfirmDialog({ isOpen: false, message: '', orderId: null, status: null, type: 'warning' })}
      />
    </AdminLayout>
  );
};

export default AdminOrdersPage;
