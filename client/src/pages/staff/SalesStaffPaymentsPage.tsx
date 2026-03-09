import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdSearch, MdCheckCircle, MdCancel, MdPending } from 'react-icons/md';
import SalesStaffLayout from '../../components/SalesStaffLayout';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Pagination } from '../../components/shared';
import { getAllOrders, confirmPayment } from '../../services/api';

interface Payment {
  paymentID: number;
  orderID: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
  transactionCode?: string;
  amount: number;
  customerName?: string;
}

const SalesStaffPaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    payment: Payment | null;
  }>({ isOpen: false, payment: null });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const orders = await getAllOrders();
      
      // Chỉ lấy đơn hàng đã được duyệt trở lên
      const confirmedStatuses = ['APPROVED', 'PROCESSING', 'SHIPPING', 'COMPLETED'];
      
      const paymentData: Payment[] = orders
        .filter(order => order.payment && confirmedStatuses.includes(order.status.toUpperCase()))
        .map(order => ({
          paymentID: order.payment!.paymentID,
          orderID: order.orderID,
          paymentMethod: order.payment!.paymentMethod,
          paymentStatus: order.payment!.paymentStatus,
          paymentDate: order.payment!.paymentDate,
          transactionCode: order.payment!.transactionCode,
          amount: order.totalAmount,
          customerName: order.customer?.fullName
        }));

      setPayments(paymentData);
    } catch (error) {
      toast.error('Không thể tải danh sách thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'UNPAID': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'PAID': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800',
    'Refunded': 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    'Pending': 'Chờ xử lý',
    'UNPAID': 'Chưa thanh toán',
    'Completed': 'Đã thanh toán',
    'PAID': 'Đã thanh toán',
    'Failed': 'Thất bại',
    'Refunded': 'Đã hoàn tiền',
  };

  const paymentMethodLabels: Record<string, string> = {
    'BankTransfer': 'Chuyển khoản',
    'Cash': 'Tiền mặt',
    'Card': 'Thẻ',
    'Momo': 'Ví MoMo',
    'ZaloPay': 'ZaloPay',
  };

  const filteredPayments = payments.filter(payment => {
    // Loại bỏ dấu # nếu có trong searchTerm để tìm kiếm mã đơn hàng dễ dàng hơn
    const cleanSearchTerm = searchTerm.replace(/^#/, '');
    const matchesSearch = payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderID.toString().includes(cleanSearchTerm) ||
      payment.transactionCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.paymentStatus.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

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
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOpenConfirmDialog = (payment: Payment) => {
    setConfirmDialog({ isOpen: true, payment });
  };

  const handleConfirmPayment = async () => {
    if (!confirmDialog.payment) return;

    const payment = confirmDialog.payment;
    setConfirmingOrderId(payment.orderID);

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const staffId = currentUser.userId || 1;
      const result = await confirmPayment(payment.orderID, staffId, payment.transactionCode);

      if (result.success) {
        toast.success('Xác nhận thanh toán thành công', { type: 'success' });
        await fetchPayments();
      } else {
        toast.error(result.message || 'Xác nhận thất bại');
      }
    } catch (error) {
      toast.error('Không thể xác nhận thanh toán');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  return (
    <SalesStaffLayout title="Quản lý Thanh toán">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo khách hàng, mã đơn, mã giao dịch..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tất cả ({payments.length})
            </button>
            <button
              onClick={() => setStatusFilter('UNPAID')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                statusFilter === 'UNPAID'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-white text-yellow-700 border border-yellow-200 hover:bg-yellow-50'
              }`}
            >
              Chưa thanh toán ({payments.filter(p => p.paymentStatus.toUpperCase() === 'UNPAID').length})
            </button>
            <button
              onClick={() => setStatusFilter('PAID')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                statusFilter === 'PAID'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
              }`}
            >
              Đã thanh toán ({payments.filter(p => p.paymentStatus.toUpperCase() === 'PAID').length})
            </button>
            <button
              onClick={() => setStatusFilter('Failed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                statusFilter === 'Failed'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
              }`}
            >
              Thất bại ({payments.filter(p => p.paymentStatus === 'Failed').length})
            </button>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Đơn hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phương thức</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Số tiền</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày thanh toán</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Mã GD</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy thanh toán nào phù hợp
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((payment) => (
                    <tr key={payment.paymentID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        #{payment.orderID}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.customerName || 'Khách vãng lai'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {paymentMethodLabels[payment.paymentMethod] || payment.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-red-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${statusColors[payment.paymentStatus] || 'bg-gray-100 text-gray-800'}`}>
                          {payment.paymentStatus === 'Completed' && <MdCheckCircle className="w-4 h-4" />}
                          {payment.paymentStatus === 'Pending' && <MdPending className="w-4 h-4" />}
                          {payment.paymentStatus === 'Failed' && <MdCancel className="w-4 h-4" />}
                          {statusLabels[payment.paymentStatus] || payment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="font-mono text-xs">
                          {payment.transactionCode || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {['Pending', 'UNPAID'].includes(payment.paymentStatus.toUpperCase()) && (
                            <button
                              onClick={() => handleOpenConfirmDialog(payment)}
                              disabled={confirmingOrderId === payment.orderID}
                              className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              title="Xác nhận thanh toán"
                            >
                              {confirmingOrderId === payment.orderID ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Đang xử lý...</span>
                                </>
                              ) : (
                                <>
                                  <MdCheckCircle className="w-4 h-4" />
                                  <span>Xác nhận</span>
                                </>
                              )}
                            </button>
                          )}
                          {['Completed', 'PAID'].includes(payment.paymentStatus.toUpperCase()) && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                              <MdCheckCircle className="w-4 h-4" />
                              <span>Đã xác nhận</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredPayments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPayments.length}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onCancel={() => setConfirmDialog({ isOpen: false, payment: null })}
        onConfirm={handleConfirmPayment}
        title="Xác nhận thanh toán"
        message={`Bạn có chắc muốn xác nhận thanh toán cho đơn hàng #${confirmDialog.payment?.orderID}?`}
        type="success"
      />
    </SalesStaffLayout>
  );
};

export default SalesStaffPaymentsPage;
