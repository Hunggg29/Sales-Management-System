import { useState, useEffect } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdSave,
  MdPerson,
  MdPhone,
  MdLocationOn,
  MdBusiness,
  MdVisibility,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import type { Customer, Order } from '../../types';
import {
  getAllCustomers,
  createCustomer,
  updateCustomerByUserId,
  deleteCustomer,
  getOrdersByUserId,
} from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import { Modal, OrderStatusBadge } from '../../components/shared';

interface CustomerFormData {
  userID: number;
  fullName: string;
  phone: string;
  address: string;
  companyName: string;
}

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit/Create Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    userID: 0,
    fullName: '',
    phone: '',
    address: '',
    companyName: '',
  });

  // Details Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error('Không thể tải danh sách khách hàng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        userID: customer.userID,
        fullName: customer.fullName,
        phone: customer.phone || '',
        address: customer.address || '',
        companyName: customer.companyName || '',
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        userID: 0,
        fullName: '',
        phone: '',
        address: '',
        companyName: '',
      });
    }
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCustomer(null);
  };

  const handleViewDetails = async (customer: Customer) => {
    setViewingCustomer(customer);
    setIsDetailsModalOpen(true);
    setIsLoadingOrders(true);
    try {
      const orders = await getOrdersByUserId(customer.userID);
      setCustomerOrders(orders);
    } catch (error) {
      toast.error('Không thể tải lịch sử đơn hàng');
      console.error(error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setViewingCustomer(null);
    setCustomerOrders([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        await updateCustomerByUserId(editingCustomer.userID, {
          userID: formData.userID,
          fullName: formData.fullName,
          phone: formData.phone || null,
          address: formData.address || null,
          companyName: formData.companyName || null,
        });
        toast.success('Cập nhật khách hàng thành công');
      } else {
        await createCustomer({
          userID: formData.userID,
          fullName: formData.fullName,
          phone: formData.phone || null,
          address: formData.address || null,
          companyName: formData.companyName || null,
        });
        toast.success('Thêm khách hàng thành công');
      }
      handleCloseEditModal();
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (userId: number, fullName: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa khách hàng "${fullName}"?`)) {
      return;
    }

    try {
      await deleteCustomer(userId);
      toast.success('Xóa khách hàng thành công');
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa khách hàng');
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Quản lý Khách hàng" subtitle="Đang tải dữ liệu...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Quản lý Khách hàng"
      subtitle={`Tổng số: ${customers.length} khách hàng`}
    >
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>

          <button
            onClick={() => handleOpenEditModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <MdAdd className="w-5 h-5" />
            <span>Thêm khách hàng</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MdPerson className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cá nhân</p>
                <p className="text-2xl font-bold text-green-600">
                  {customers.filter(c => !c.companyName).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MdPerson className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Có công ty</p>
                <p className="text-2xl font-bold text-blue-600">
                  {customers.filter(c => c.companyName).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdBusiness className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Công ty
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <MdSearch className="w-12 h-12 mb-2 text-gray-400" />
                        <p className="text-lg font-medium">Không tìm thấy khách hàng</p>
                        <p className="text-sm">Thử thay đổi từ khóa tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.customerID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          #{customer.customerID}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {customer.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {customer.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              User ID: {customer.userID}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <MdPhone className="w-4 h-4 text-gray-400" />
                          {customer.phone || 'Chưa có'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900 max-w-xs">
                          <MdLocationOn className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{customer.address || 'Chưa có'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <MdBusiness className="w-4 h-4 text-gray-400" />
                          {customer.companyName || 'Cá nhân'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(customer)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MdVisibility className="w-4 h-4" />
                            <span className="hidden sm:inline">Chi tiết</span>
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(customer)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <MdEdit className="w-4 h-4" />
                            <span className="hidden sm:inline">Sửa</span>
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(customer.userID, customer.fullName)
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <MdDelete className="w-4 h-4" />
                            <span className="hidden sm:inline">Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* Results Info */}
        {filteredCustomers.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Hiển thị <span className="font-semibold text-gray-900">{filteredCustomers.length}</span> / {customers.length} khách hàng
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title={editingCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {!editingCustomer && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User ID <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.userID || ''}
                onChange={(e) =>
                  setFormData({ ...formData, userID: parseInt(e.target.value) || 0 })
                }
                placeholder="Nhập User ID"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                ID của tài khoản người dùng trong hệ thống
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Họ và tên <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Nhập họ và tên"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="0123456789"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên công ty
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder="Tên công ty (nếu có)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Nhập địa chỉ đầy đủ"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-sm"
            >
              <MdSave className="w-5 h-5" />
              {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button
              type="button"
              onClick={handleCloseEditModal}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Hủy
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        title="Chi tiết khách hàng"
      >
        {viewingCustomer && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                  {viewingCustomer.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{viewingCustomer.fullName}</h3>
                  <p className="text-sm text-gray-500">ID: #{viewingCustomer.customerID}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <MdPhone className="text-gray-400" />
                  <span>{viewingCustomer.phone || 'Chưa có SĐT'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MdBusiness className="text-gray-400" />
                  <span>{viewingCustomer.companyName || 'Cá nhân'}</span>
                </div>
                <div className="col-span-1 sm:col-span-2 flex items-start gap-2 text-gray-700">
                  <MdLocationOn className="text-gray-400 mt-0.5" />
                  <span>{viewingCustomer.address || 'Chưa có địa chỉ'}</span>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Lịch sử đơn hàng</h3>
              {isLoadingOrders ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="text-center py-4 text-gray-500 italic">
                  Khách hàng này chưa có đơn hàng nào
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-2 border-b">ID Đơn</th>
                        <th className="px-4 py-2 border-b">Ngày đặt</th>
                        <th className="px-4 py-2 border-b text-right">Tổng tiền</th>
                        <th className="px-4 py-2 border-b text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customerOrders.map(order => (
                        <tr key={order.orderID} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium">#{order.orderID}</td>
                          <td className="px-4 py-2 text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-4 py-2 text-red-600 font-semibold text-right">
                            {order.totalAmount.toLocaleString('vi-VN')}₫
                          </td>
                          <td className="px-4 py-2 text-center">
                            <OrderStatusBadge status={order.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleCloseDetailsModal}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminCustomersPage;
