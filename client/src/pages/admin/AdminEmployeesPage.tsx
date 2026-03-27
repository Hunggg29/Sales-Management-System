import { useEffect, useMemo, useState } from 'react';
import { MdAdd, MdEdit, MdSearch, MdClose, MdSave, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import type { CreateEmployeeRequest, EmployeeAdmin, UpdateEmployeeRequest } from '../../types';
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  updateEmployeeStatus,
} from '../../services/api';

interface EmployeeFormState {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  employeeType: number;
  isActive: boolean;
}

const employeeTypeOptions = [
  { value: 0, label: 'Sales' },
  { value: 1, label: 'Delivery' },
  { value: 2, label: 'Accountant' },
];

const emptyForm: EmployeeFormState = {
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
  employeeType: 0,
  isActive: true,
};

const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState<EmployeeAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeAdmin | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormState>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      toast.error('Không thể tải danh sách nhân viên');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEmployee(null);
    setFormData(emptyForm);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: EmployeeAdmin) => {
    setEditingEmployee(employee);
    setFormData({
      userName: employee.userName,
      email: employee.email,
      password: '',
      confirmPassword: '',
      employeeType: employee.employeeType,
      isActive: employee.isActive,
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData(emptyForm);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName.trim() || !formData.email.trim()) {
      toast.error('Vui lòng nhập đầy đủ tên đăng nhập và email');
      return;
    }

    if (!editingEmployee && !formData.password.trim()) {
      toast.error('Vui lòng nhập mật khẩu cho nhân viên mới');
      return;
    }

    if (!editingEmployee && formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp');
      return;
    }

    try {
      setSaving(true);

      if (editingEmployee) {
        const payload: UpdateEmployeeRequest = {
          userName: formData.userName.trim(),
          email: formData.email.trim(),
          employeeType: formData.employeeType,
          isActive: formData.isActive,
        };

        await updateEmployee(editingEmployee.employeeID, payload);
        toast.success('Cập nhật nhân viên thành công');
      } else {
        const payload: CreateEmployeeRequest = {
          userName: formData.userName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          employeeType: formData.employeeType,
        };

        await createEmployee(payload);
        toast.success('Tạo nhân viên thành công');
      }

      closeModal();
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.message || 'Không thể lưu thông tin nhân viên');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (employee: EmployeeAdmin) => {
    const nextStatus = !employee.isActive;

    try {
      await updateEmployeeStatus(employee.employeeID, nextStatus);
      toast.success(nextStatus ? 'Đã kích hoạt nhân viên' : 'Đã vô hiệu hóa nhân viên');
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật trạng thái nhân viên');
    }
  };

  const filteredEmployees = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();
    if (!keyword) return employees;

    return employees.filter((e) =>
      e.userName.toLowerCase().includes(keyword) ||
      e.email.toLowerCase().includes(keyword) ||
      e.employeeTypeName.toLowerCase().includes(keyword)
    );
  }, [employees, searchTerm]);

  if (loading) {
    return (
      <AdminLayout title="Quản lý Nhân viên" subtitle="Đang tải dữ liệu...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Quản lý Nhân viên"
      subtitle={`Tổng số: ${employees.length} nhân viên`}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <MdAdd className="w-5 h-5" />
            <span>Thêm nhân viên</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Tổng nhân viên</p>
            <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
            <p className="text-2xl font-bold text-green-600">
              {employees.filter((e) => e.isActive).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Đã vô hiệu hóa</p>
            <p className="text-2xl font-bold text-red-600">
              {employees.filter((e) => !e.isActive).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nhân viên</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày tạo</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      Không có nhân viên phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.employeeID} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{employee.userName}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {employee.employeeTypeName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            employee.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {employee.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(employee.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(employee)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                            title="Chỉnh sửa"
                          >
                            <MdEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(employee)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              employee.isActive
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {employee.isActive ? 'Khóa' : 'Mở khóa'}
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingEmployee ? 'Cập nhật nhân viên' : 'Tạo nhân viên mới'}
              </h3>
              <button onClick={closeModal} className="p-1 rounded hover:bg-gray-100">
                <MdClose className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {!editingEmployee && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                        aria-label={showConfirmPassword ? 'Ẩn mật khẩu nhập lại' : 'Hiện mật khẩu nhập lại'}
                      >
                        {showConfirmPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại nhân viên</label>
                <select
                  value={formData.employeeType}
                  onChange={(e) => setFormData({ ...formData, employeeType: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {employeeTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {editingEmployee && (
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Tài khoản đang hoạt động</span>
                </label>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <MdSave className="w-4 h-4" />
                      <span>Lưu</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminEmployeesPage;
