import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdSearch, MdVisibility, MdCheckCircle, MdCheck, MdClose } from 'react-icons/md';
import SalesStaffLayout from '../../components/SalesStaffLayout';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Pagination } from '../../components/shared';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import type { Order } from '../../types';

const SalesStaffOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    orderId: number | null;
    newStatus: string | null;
  }>({
    isOpen: false,
    orderId: null,
    newStatus: null,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-600 text-white',
    'CANCELLED': 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    'PENDING': 'Chờ duyệt',
    'APPROVED': 'Đã duyệt',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy',
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderID.toString().includes(searchTerm) ||
      order.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    setConfirmDialog({
      isOpen: true,
      orderId,
      newStatus,
    });
  };

  const confirmStatusUpdate = async () => {
    if (!confirmDialog.orderId || !confirmDialog.newStatus) return;

    try {
      await updateOrderStatus(confirmDialog.orderId, confirmDialog.newStatus);
      toast.success('Cập nhật trạng thái thành công');
      await fetchOrders();
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  // Staff chỉ được cập nhật một số trạng thái nhất định
  const getAvailableStatuses = (currentStatus: string) => {
    const statusFlow: Record<string, string[]> = {
      'PENDING': ['APPROVED', 'CANCELLED'],
      'APPROVED': ['COMPLETED', 'CANCELLED'],
    };
    return statusFlow[currentStatus] || [];
  };

  return (
    <SalesStaffLayout title="Quản lý Đơn hàng">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-3">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Lọc theo trạng thái:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[200px]"
            >
              <option value="all">Tất cả ({orders.length})</option>
              <option value="PENDING">Chờ duyệt ({orders.filter(o => o.status === 'PENDING').length})</option>
              <option value="APPROVED">Đã duyệt ({orders.filter(o => o.status === 'APPROVED').length})</option>
              <option value="COMPLETED">Hoàn thành ({orders.filter(o => o.status === 'COMPLETED').length})</option>
              <option value="CANCELLED">Đã hủy ({orders.filter(o => o.status === 'CANCELLED').length})</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Mã đơn</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày đặt</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tổng tiền</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.orderID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order.orderID}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.customer?.fullName || 'Khách vãng lai'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-red-600">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
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
                        
                        {/* PENDING -> APPROVED / CANCELLED */}
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order.orderID, 'APPROVED')}
                              className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                              title="Duyệt đơn"
                            >
                              <MdCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.orderID, 'CANCELLED')}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <MdClose className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        
                        {/* APPROVED -> COMPLETED */}
                        {order.status === 'APPROVED' && (
                          <button
                            onClick={() => handleStatusUpdate(order.orderID, 'COMPLETED')}
                            className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                            title="Hoàn thành đơn hàng"
                          >
                            <MdCheck className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
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
                <h4 className="font-semibold text-gray-700 mb-3">Thông tin đơn hàng</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Người đặt:</p>
                    <p className="font-medium">{selectedOrder.customer?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Số điện thoại:</p>
                    <p className="font-medium">{selectedOrder.customer?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Trạng thái đơn:</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[selectedOrder.status]}`}>
                      {statusLabels[selectedOrder.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Phương thức TT:</p>
                    <p className="font-medium">{selectedOrder.payment?.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Trạng thái TT:</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedOrder.payment?.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                      selectedOrder.payment?.paymentStatus === 'UNPAID' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedOrder.payment?.paymentStatus === 'PAID' ? 'Đã thanh toán' :
                       selectedOrder.payment?.paymentStatus === 'UNPAID' ? 'Chưa thanh toán' : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Tổng tiền:</p>
                    <p className="font-bold text-red-600">{formatCurrency(selectedOrder.totalAmount)}</p>
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
                          <span>SL đặt: <span className="font-bold text-blue-600">{item.quantity}</span></span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span>Còn lại: <span className={`font-bold ${
                            item.stockQuantity < item.quantity ? 'text-red-600' : 
                            item.stockQuantity < item.quantity * 2 ? 'text-orange-600' : 
                            'text-green-600'
                          }`}>
                            {item.stockQuantity}
                          </span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          {formatCurrency(item.totalPrice)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.unitPrice)}/cái
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              {selectedOrder.status === 'PENDING' ? (
                <>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.orderID, 'CANCELLED');
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                  >
                    Từ chối đơn
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.orderID, 'APPROVED');
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Duyệt đơn hàng
                  </button>
                </>
              ) : selectedOrder.status === 'APPROVED' ? (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedOrder.orderID, 'COMPLETED');
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Hoàn thành đơn hàng
                </button>
              ) : (
                <div className="text-gray-500 italic">Đơn hàng {statusLabels[selectedOrder.status]?.toLowerCase()}</div>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Xác nhận cập nhật trạng thái"
        message={`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng #${confirmDialog.orderId} thành "${confirmDialog.newStatus ? statusLabels[confirmDialog.newStatus] : ''}"?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={confirmStatusUpdate}
        onCancel={() => setConfirmDialog({ isOpen: false, orderId: null, newStatus: null })}
        type="info"
      />
    </SalesStaffLayout>
  );
};

export default SalesStaffOrdersPage;
