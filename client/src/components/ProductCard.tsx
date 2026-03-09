import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart } from '../services/api';
import { useCart } from '../contexts/CartContext';
import type { Product, User } from '../types';

interface ProductCardProps {
  product: Product;
  variants: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number; transition: { duration: number } };
  };
}

const ProductCard = ({ product, variants }: ProductCardProps) => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const handleCardClick = () => {
    navigate(`/san-pham/${product.productID}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }

    try {
      const user: User = JSON.parse(userStr);
      await addToCart(user.userID, {
        productID: product.productID,
        quantity: 1
      });
      await refreshCart();
      toast.success(`Đã thêm "${product.productName}" vào giỏ hàng!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng';
      toast.error(errorMessage);
    }
  };

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 10px 30px rgba(255,51,102,0.15)' }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="bg-[#F4F4F4] border border-[#EAEAEA] rounded-lg overflow-hidden cursor-pointer group"
    >
      {/* Product Image with Cart Button Overlay */}
      <div className="relative h-48 bg-white p-4 flex items-center justify-center overflow-hidden">
        <motion.img
          src={product.imageURL || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'}
          alt={product.productName}
          className="max-w-full max-h-full object-contain"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-5 text-center">
        <h3 className="text-[#333333] font-bold text-lg mb-2 line-clamp-2 hover:text-red-600 transition-colors duration-300">
          {product.productName}
        </h3>
        <p className="text-[#FF3366] font-bold text-lg">
          {product.unitPrice > 0 
            ? `${product.unitPrice.toLocaleString('vi-VN')} đ/${product.unit || 'sp'}`
            : 'Mời liên hệ'
          }
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
