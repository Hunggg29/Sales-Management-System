import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdSearch, MdCheckCircle, MdCancel, MdPending, MdVisibility } from 'react-icons/md';
import AdminLayout from '../../components/AdminLayout';
import { Pagination } from '../../components/shared';
import { getAllOrders } from '../../services/api';
import type { Order } from '../../types';

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

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      // Get all orders which contain payment information
      const orders = await getAllOrders();
      
      // Extract payment data from orders
      const paymentData: Payment[] = orders
        .filter(order => order.payment)
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
    'Completed': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800',
    'Refunded': 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    'Pending': 'Chờ xử lý',
    'Completed': 'Đã thanh toán',
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
    const matchesSearch = payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderID.toString().includes(searchTerm) ||
      payment.transactionCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search or filter changes
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

  return (
    <AdminLayout title="Quản lý Thanh toán">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Search Bar and Filters */}
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo khách hàng, mã đơn, mã giao dịch..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
              Tất cả ({payments.length})
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'Pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              Chờ xử lý ({payments.filter(p => p.paymentStatus === 'Pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('Completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'Completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Đã thanh toán ({payments.filter(p => p.paymentStatus === 'Completed').length})
            </button>
            <button
              onClick={() => setStatusFilter('Failed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'Failed'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Thất bại ({payments.filter(p => p.paymentStatus === 'Failed').length})
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Đơn hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phương thức</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Số tiền</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày thanh toán</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Mã GD</th>
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
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{payment.paymentID}
                      </td>
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
    </AdminLayout>
  );
};

export default AdminPaymentsPage;
