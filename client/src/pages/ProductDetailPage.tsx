import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Package, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProductById, addToCart } from '../services/api';
import { useCart } from '../contexts/CartContext';
import type { Product, User } from '../types';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID sản phẩm không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProductById(Number(id));
        setProduct(data);
        setError('');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin sản phẩm';
        setError(errorMessage);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }

    if (!product) return;

    try {
      setIsAddingToCart(true);
      const user: User = JSON.parse(userStr);
      await addToCart(user.userID, {
        productID: product.productID,
        quantity: quantity
      });
      await refreshCart();
      toast.success(`Đã thêm ${quantity} ${product.productName} vào giỏ hàng!`);
      setQuantity(1); // Reset quantity after adding
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng';
      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 py-12">
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 py-12">
        <div className="text-center py-20">
          <p className="text-red-500 text-lg mb-4">{error || 'Không tìm thấy sản phẩm'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-700 underline font-semibold"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Quay lại</span>
      </motion.button>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#EAEAEA] rounded-lg p-8 flex items-center justify-center"
        >
          <img
            src={
              product.imageURL ||
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E'
            }
            alt={product.productName}
            className="max-w-full max-h-[500px] object-contain"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          {/* Product Name */}
          <h1 className="text-4xl font-bold text-[#333333] mb-4">{product.productName}</h1>

          {/* Category ID (will be updated later with category name) */}
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Tag className="w-5 h-5" />
            <span className="text-lg">Mã danh mục: <strong>#{product.categoryID}</strong></span>
          </div>

          {/* Price */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <p className="text-[#FF3366] font-bold text-4xl">
              {product.unitPrice > 0
                ? `${product.unitPrice.toLocaleString('vi-VN')} đ/${product.unit || 'sp'}`
                : 'Mời liên hệ'}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-gray-600" />
            <span className="text-lg">
              Trạng thái:{' '}
              <strong className={product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stockQuantity > 0 ? `Còn hàng` : 'Hết hàng'}
              </strong>
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#333333] mb-3">Mô tả sản phẩm</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-[#333333] mb-2">Số lượng</label>
            <div className="flex items-center gap-4">
              <button
                onClick={decreaseQuantity}
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) setQuantity(val);
                }}
                className="w-20 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg"
                min="1"
              />
              <button
                onClick={increaseQuantity}
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0 || isAddingToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-lg font-bold text-lg transition-all ${
                product.stockQuantity > 0 && !isAddingToCart
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAddingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Đang thêm...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  <span>{product.stockQuantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-gray-700 text-base mb-2">
              💬 <strong>Cần tư vấn?</strong> Liên hệ hotline:{' '}
              <a href="tel:0947.900.666" className="text-red-600 font-bold hover:underline">
                0947.900.666
              </a>
            </p>
            <p className="text-gray-600 text-sm">
              Chúng tôi sẵn sàng hỗ trợ bạn từ 8:00 - 22:00 hàng ngày
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
