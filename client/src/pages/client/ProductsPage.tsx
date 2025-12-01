import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import CategorySidebar from '../../components/CategorySidebar';
import ProductsGrid from '../../components/ProductsGrid';
import { getAllProducts, getAllCategories } from '../../services/api';
import type { Product, Category } from '../../types';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all products
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(''); // Debounced search
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get search query from URL on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
      setDebouncedSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setAllProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debounce search query - wait 400ms after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim()); // Trim whitespace
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter and sort products (client-side with debounced search)
  const filteredProducts = allProducts
    .filter((product) => {
      // Filter by category
      if (selectedCategoryID !== null && product.categoryID !== selectedCategoryID) {
        return false;
      }
      // Filter by debounced search query (trimmed)
      if (debouncedSearchQuery && !product.productName.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.unitPrice - b.unitPrice;
        case 'price-desc':
          return b.unitPrice - a.unitPrice;
        case 'name':
          return a.productName.localeCompare(b.productName);
        default:
          return 0;
      }
    });

  const selectedCategoryName = selectedCategoryID === null
    ? 'TẤT CẢ SẢN PHẨM'
    : categories.find(cat => cat.categoryID === selectedCategoryID)?.categoryName || 'SẢN PHẨM';

  const handleCategorySelect = (categoryID: number | null) => {
    setSelectedCategoryID(categoryID);
  };

  const handleClearFilter = () => {
    setSelectedCategoryID(null);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">SẢN PHẨM</h1>
          <p className="text-red-100">
            Khám phá các sản phẩm chất lượng cao từ Thăng Long Tape
          </p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-auto flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="name">Tên A-Z</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(selectedCategoryID !== null || searchQuery || sortBy !== 'default') && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Bộ lọc:</span>
              {selectedCategoryID !== null && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  {selectedCategoryName}
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  "{searchQuery}"
                </span>
              )}
              {sortBy !== 'default' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {sortBy === 'name' && 'A-Z'}
                  {sortBy === 'price-asc' && 'Giá tăng dần'}
                  {sortBy === 'price-desc' && 'Giá giảm dần'}
                </span>
              )}
              <button
                onClick={handleClearFilter}
                className="text-sm text-red-600 hover:text-red-700 underline ml-2"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <p className="text-gray-600">
            Hiển thị <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
          </p>
        </motion.div>

        {/* Main Content: Sidebar + Products */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-80 flex-shrink-0">
            <CategorySidebar
              categories={categories}
              selectedCategoryID={selectedCategoryID}
              onSelectCategory={handleCategorySelect}
              loading={loading}
              error={error}
            />
          </aside>

          {/* Sidebar - Mobile (Collapsible) */}
          {showMobileFilters && (
            <div className="md:hidden mb-6">
              <CategorySidebar
                categories={categories}
                selectedCategoryID={selectedCategoryID}
                onSelectCategory={(categoryID) => {
                  handleCategorySelect(categoryID);
                  setShowMobileFilters(false);
                }}
                loading={loading}
                error={error}
              />
            </div>
          )}

          {/* Products Grid */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <ProductsGrid
              products={filteredProducts}
              selectedCategoryID={selectedCategoryID}
              selectedCategoryName={selectedCategoryName}
              onClearFilter={handleClearFilter}
              loading={loading}
              error={error}
              searchQuery={debouncedSearchQuery}
            />
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
