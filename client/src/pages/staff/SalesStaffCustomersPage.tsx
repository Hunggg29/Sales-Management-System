import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdSearch, MdVisibility, MdAdd, MdEdit, MdDelete, MdSave, MdPerson, MdBusiness } from 'react-icons/md';
import SalesStaffLayout from '../../components/SalesStaffLayout';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Pagination } from '../../components/shared';
import { getAllCustomers, createCustomer, updateCustomerByUserId, deleteCustomer, getOrdersByUserId } from '../../services/api';
import type { Customer, Order } from '../../types';

interface CustomerFormData {
  userID: string;
  fullName: string;
  phone: string;
  address: string;
  companyName: string;
}

const SalesStaffCustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Edit/Create Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    userID: '',
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

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    userId: number | null;
    fullName: string;
  }>({ isOpen: false, userId: null, fullName: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error('Không thể tải danh sách khách hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        userID: customer.userID.toString(),
        fullName: customer.fullName,
        phone: customer.phone || '',
        address: customer.address || '',
        companyName: customer.companyName || '',
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        userID: '',
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
          userID: parseInt(formData.userID),
          fullName: formData.fullName,
          phone: formData.phone || null,
          address: formData.address || null,
          companyName: formData.companyName || null,
        });
        toast.success('Cập nhật khách hàng thành công');
      } else {
        await createCustomer({
          userID: parseInt(formData.userID),
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

  const handleDelete = (userId: number, fullName: string) => {
    setDeleteDialog({ isOpen: true, userId, fullName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.userId) return;

    try {
      await deleteCustomer(deleteDialog.userId);
      toast.success('Xóa khách hàng thành công');
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa khách hàng');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <SalesStaffLayout title="Quản lý Khách hàng">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, SĐT, công ty..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <button
            onClick={() => handleOpenEditModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {/* Search Bar (hidden because moved to action bar) */}
        <div className="p-4 border-b border-gray-100 hidden">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, SĐT, công ty..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Họ tên</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Số điện thoại</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Công ty</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Địa chỉ</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 w-40">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'Không tìm thấy khách hàng nào phù hợp với tìm kiếm' : 'Chưa có khách hàng nào'}
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <tr key={customer.customerID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{customer.customerID}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {customer.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.companyName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {customer.address || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(customer)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <MdVisibility className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(customer)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <MdEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.userID, customer.fullName)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredCustomers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCustomers.length}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>

      {/* Edit/Create Modal */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseEditModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã khách hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingCustomer}
                  value={formData.userID}
                  onChange={(e) => setFormData({ ...formData, userID: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập mã khách hàng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Công ty
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên công ty (nếu có)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <MdSave className="w-5 h-5" />
                  <span>{editingCustomer ? 'Cập nhật' : 'Thêm mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal with Order History */}
      {isDetailsModalOpen && viewingCustomer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseDetailsModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Chi tiết khách hàng</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Mã KH</label>
                  <p className="text-gray-900 font-semibold">#{viewingCustomer.customerID}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Họ tên</label>
                  <p className="text-gray-900 font-semibold">{viewingCustomer.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                  <p className="text-gray-900">{viewingCustomer.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Công ty</label>
                  <p className="text-gray-900">{viewingCustomer.companyName || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                  <p className="text-gray-900">{viewingCustomer.address || 'N/A'}</p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử đơn hàng</h4>
                {isLoadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Khách hàng chưa có đơn hàng nào</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã ĐH</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ngày đặt</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tổng tiền</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {customerOrders.map((order) => (
                          <tr key={order.orderID} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">#{order.orderID}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {order.totalAmount.toLocaleString('vi-VN')}đ
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                order.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCloseDetailsModal}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Xác nhận xóa khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${deleteDialog.fullName}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, userId: null, fullName: '' })}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
      </div>
    </SalesStaffLayout>
  );
};

export default SalesStaffCustomersPage;
