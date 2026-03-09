import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface ProductsGridProps {
  products: Product[];
  selectedCategoryID: number | null;
  selectedCategoryName: string;
  onClearFilter: () => void;
  loading: boolean;
  error: string;
  searchQuery?: string;
}

const ProductsGrid = ({
  products,
  selectedCategoryID,
  selectedCategoryName,
  onClearFilter,
  loading,
  error,
  searchQuery = '',
}: ProductsGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryID, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="mb-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b-2 border-[#EAEAEA] mb-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[#333333] font-semibold text-3xl uppercase inline-block border-l-4 border-[#FF3300] pl-3 pb-2">
            {selectedCategoryName}
          </h2>
          {selectedCategoryID !== null && (
            <button
              onClick={onClearFilter}
              className="text-sm text-gray-500 hover:text-red-600 underline transition-colors cursor-pointer"
            >
              Xem tất cả
            </button>
          )}
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Đang tải sản phẩm...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <>
          <motion.div
            key={`${selectedCategoryID}-${currentPage}-${searchQuery}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard
                  key={product.productID}
                  product={product}
                  variants={itemVariants}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategoryID === null 
                    ? 'Chưa có sản phẩm nào' 
                    : 'Không có sản phẩm trong danh mục này'}
                </p>
                {selectedCategoryID !== null && (
                  <button
                    onClick={onClearFilter}
                    className="mt-4 text-red-600 hover:text-red-700 underline font-semibold"
                  >
                    Xem tất cả sản phẩm
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Pagination Controls */}
          {products.length > itemsPerPage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-8"
            >
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Trước</span>
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                  
                  // Show ellipsis
                  const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span key={pageNum} className="px-2 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-red-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductsGrid;
