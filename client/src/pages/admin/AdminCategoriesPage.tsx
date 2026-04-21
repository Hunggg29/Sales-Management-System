import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdClose,
  MdSave,
  MdCategory,
  MdInventory,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import type { Category } from '../../types';
import {
  getCategoriesWithProducts,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import ConfirmDialog from '../../components/ConfirmDialog';

interface CategoryFormData {
  categoryName: string;
  description: string;
}

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategoriesWithProducts();
      setCategories(data);
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        categoryName: category.categoryName,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        categoryName: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const normalizeCategoryName = (name: string) => name.trim().toLowerCase();

  const hasDuplicateName = (name: string, excludedId?: number) => {
    const normalizedInput = normalizeCategoryName(name);
    if (!normalizedInput) return false;

    return categories.some((category) => {
      if (excludedId && category.categoryID === excludedId) return false;
      return normalizeCategoryName(category.categoryName) === normalizedInput;
    });
  };

  const modalNameDuplicated = hasDuplicateName(formData.categoryName, editingCategory?.categoryID);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryName = formData.categoryName.trim();
    if (!categoryName) {
      toast.error('Tên danh mục không được để trống');
      return;
    }

    if (hasDuplicateName(categoryName, editingCategory?.categoryID)) {
      toast.error('Tên danh mục đã tồn tại');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryID, {
          categoryName,
          description: formData.description.trim() || undefined,
        });
        toast.success('Cập nhật danh mục thành công');
      } else {
        await createCategory({
          categoryName,
          description: formData.description.trim() || undefined,
        });
        toast.success('Thêm danh mục thành công');
      }
      handleCloseModal();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    categoryId: number | null;
    categoryName: string;
  }>({ isOpen: false, categoryId: null, categoryName: '' });

  const handleDelete = async (categoryId: number, categoryName: string) => {
    setDeleteDialog({ isOpen: true, categoryId, categoryName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.categoryId) return;

    try {
      await deleteCategory(deleteDialog.categoryId);
      toast.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa danh mục');
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat.products?.length || 0),
    0
  );

  if (loading) {
    return (
      <AdminLayout title="Quản lý Danh mục" subtitle="Đang tải dữ liệu...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Quản lý Danh mục"
      subtitle={`Tổng số: ${categories.length} danh mục`}
    >
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <MdAdd className="w-5 h-5" />
            <span>Thêm danh mục</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng danh mục</p>
                <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <MdCategory className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-blue-600">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdInventory className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Trung bình</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MdInventory className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center">
              <MdSearch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-500 mb-2">
                Không tìm thấy danh mục
              </p>
              <p className="text-sm text-gray-400">
                Thử thay đổi từ khóa tìm kiếm hoặc thêm danh mục mới
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Danh mục</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Mô tả</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Sản phẩm</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredCategories.map((category) => (
                    <motion.tr
                      key={category.categoryID}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50/70"
                    >
                      <td className="px-4 py-4 align-top text-sm font-medium text-gray-600">
                        #{category.categoryID}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                            <MdCategory className="w-5 h-5 text-pink-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{category.categoryName}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <p className="text-sm text-gray-600 max-w-[360px] line-clamp-2">
                          {category.description || 'Chưa có mô tả'}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-2 mb-2">
                          <MdInventory className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-700">
                            {category.products?.length || 0} sản phẩm
                          </span>
                        </div>
                        {category.products && category.products.length > 0 && (
                          <div className="space-y-1">
                            {category.products.slice(0, 2).map((product) => (
                              <p key={product.productID} className="text-xs text-gray-500 truncate max-w-[220px]">
                                • {product.productName}
                              </p>
                            ))}
                            {category.products.length > 2 && (
                              <p className="text-xs text-gray-400 italic">
                                + {category.products.length - 2} sản phẩm khác
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa nhanh"
                          >
                            <MdEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.categoryID, category.categoryName)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Info */}
        {filteredCategories.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Hiển thị <span className="font-semibold text-gray-900">{filteredCategories.length}</span> / {categories.length} danh mục
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MdClose className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên danh mục <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.categoryName}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryName: e.target.value })
                      }
                      placeholder="Nhập tên danh mục"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    {modalNameDuplicated && (
                      <p className="mt-2 text-sm font-medium text-red-600">Tên danh mục đã tồn tại</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Nhập mô tả chi tiết danh mục"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={modalNameDuplicated || !formData.categoryName.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-sm"
                    >
                      <MdSave className="w-5 h-5" />
                      {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Xác nhận xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleteDialog.categoryName}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => {
          handleConfirmDelete();
          setDeleteDialog({ isOpen: false, categoryId: null, categoryName: '' });
        }}
        onCancel={() =>
          setDeleteDialog({ isOpen: false, categoryId: null, categoryName: '' })
        }
        type="danger"
      />
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
