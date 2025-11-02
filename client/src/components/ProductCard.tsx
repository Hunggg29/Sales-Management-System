import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  variants: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number; transition: { duration: number } };
  };
}

const ProductCard = ({ product, variants }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/san-pham/${product.productID}`);
  };

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -8, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      onClick={handleCardClick}
      className="bg-[#F4F4F4] border border-[#EAEAEA] rounded-lg overflow-hidden cursor-pointer group"
    >
      {/* Product Image with Cart Button Overlay */}
      <div className="relative aspect-square bg-white p-4 flex items-center justify-center overflow-hidden">
        <motion.img
          src={product.imageURL || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'}
          alt={product.productName}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
        
        {/* Add to Cart Button - Shows on Image Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when clicking the button
            alert(`Đã thêm "${product.productName}" vào giỏ hàng!`);
          }}
          className="absolute inset-0 m-auto w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 hover:scale-110 shadow-lg"
          title="Thêm vào giỏ hàng"
        >
          <svg 
            className="w-6 h-6 hover:cursor-pointer" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </button>
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
