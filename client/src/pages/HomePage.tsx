import { useState, useEffect } from 'react';
import HeroSlider from '../components/HeroSlider';
import CategorySidebar from '../components/CategorySidebar';
import ProductsGrid from '../components/ProductsGrid';
import NewsSection from '../components/NewsSection';
import { getAllCategories, getCategoriesWithProducts } from '../services/api';
import type { Category, Product } from '../types';
import { newsArticles } from '../data/newsData';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string>('');
  const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(null);

  const slides = [
    {
      title: 'Màng cuốn giá tốt nhất thị trường Việt Nam',
      subtitle: 'Băng dính Việt Nam',
      image: '/assets/images/banner-text.png',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        setCategoriesError('');
      } catch (err) {
        setCategoriesError('Không thể tải danh mục');
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }

      // Fetch products
      try {
        const categoriesWithProducts = await getCategoriesWithProducts();
        const products: Product[] = [];
        categoriesWithProducts.forEach((category) => {
          if (category.products && Array.isArray(category.products)) {
            products.push(...category.products);
          }
        });
        setAllProducts(products);
        setProductsError('');
      } catch (err) {
        setProductsError('Không thể tải sản phẩm');
        console.error('Error fetching products:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const filteredProducts = selectedCategoryID === null
    ? allProducts
    : allProducts.filter((p) => Number(p.categoryID) === Number(selectedCategoryID));

  const selectedCategoryName = selectedCategoryID === null
    ? 'SẢN PHẨM'
    : categories.find((c) => c.categoryID === selectedCategoryID)?.categoryName || 'DANH MỤC';

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider
        currentSlide={currentSlide}
        slides={slides}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
      />

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <CategorySidebar
            categories={categories}
            selectedCategoryID={selectedCategoryID}
            onSelectCategory={setSelectedCategoryID}
            loading={categoriesLoading}
            error={categoriesError}
          />

          {/* Products Section */}
          <div className="flex-grow">
            <ProductsGrid
              products={filteredProducts}
              selectedCategoryID={selectedCategoryID}
              selectedCategoryName={selectedCategoryName}
              onClearFilter={() => setSelectedCategoryID(null)}
              loading={productsLoading}
              error={productsError}
            />
          </div>
        </div>
      </div>

      {/* News Section */}
      <NewsSection articles={newsArticles} />
    </>
  );
};

export default HomePage;
