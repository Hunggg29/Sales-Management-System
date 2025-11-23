import { motion } from 'framer-motion';
import type { Category } from '../types';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryID: number | null;
  onSelectCategory: (categoryID: number | null) => void;
  loading: boolean;
  error: string;
}

const CategorySidebar = ({
  categories,
  selectedCategoryID,
  onSelectCategory,
  loading,
  error,
}: CategorySidebarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden"
    >
      <div className="bg-[#CC0000] px-4 py-3">
        <h2 className="text-white font-bold text-lg uppercase tracking-wide">
          DANH MỤC SẢN PHẨM
        </h2>
      </div>

        {/* Loading state */}
        {loading && (
          <div className="px-5 py-8 text-center text-gray-500">
            Đang tải danh mục...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="px-5 py-8 text-center text-red-500">
            {error}
          </div>
        )}

        {/* Categories list */}
        {!loading && !error && (
          <ul className="divide-y divide-[#EAEAEA]">
            {/* "All Products" option */}
            <motion.li
              whileHover={{ backgroundColor: '#f8f8f8', x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => onSelectCategory(null)}
                className={`block w-full text-left px-5 py-4 font-bold text-base transition-colors ${
                  selectedCategoryID === null
                    ? 'bg-red-50 text-red-600 border-l-4 border-red-600'
                    : 'text-[#333333] hover:text-red-600'
                }`}
              >
                Tất cả sản phẩm
              </button>
            </motion.li>

            {/* Individual categories */}
            {categories.map((category) => (
              <motion.li
                key={category.categoryID}
                whileHover={{ backgroundColor: '#f8f8f8', x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => onSelectCategory(category.categoryID)}
                  className={`block w-full text-left px-5 py-4 font-bold text-base transition-colors ${
                    selectedCategoryID === category.categoryID
                      ? 'bg-red-50 text-red-600 border-l-4 border-red-600'
                      : 'text-[#333333] hover:text-red-600'
                  }`}
                >
                  {category.categoryName}
                </button>
              </motion.li>
            ))}
          </ul>
        )}
    </motion.div>
  );
};

export default CategorySidebar;
