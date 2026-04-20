import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSlider from '../../components/HeroSlider';
import CategorySidebar from '../../components/CategorySidebar';
import ProductsGrid from '../../components/ProductsGrid';
import ProductCard from '../../components/ProductCard';
import NewsSection from '../../components/NewsSection';
import { getAllCategories, getCategoriesWithProducts, getTopProducts } from '../../services/api';
import type { Category, Product, TopProduct } from '../../types';
import { newsArticles } from '../../data/newsData';
import banner1 from '../../assets/images/banner-1.jpg';
import banner2 from '../../assets/images/banner-2.jpg';
import bannerText from '../../assets/images/banner-text.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string>('');
  const [featuredProducts, setFeaturedProducts] = useState<TopProduct[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string>('');
  const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(null);

  const slides = [
    {
      title: 'Màng cuốn giá tốt nhất thị trường Việt Nam',
      subtitle: 'Băng dính Việt Nam',
      image: banner1,
    },
    {
      title: 'Giải pháp đóng gói bền chắc cho doanh nghiệp',
      subtitle: 'Đa dạng kích thước và chất liệu',
      image: banner2,
    },
    {
      title: 'Màng cuốn giá tốt nhất thị trường Việt Nam',
      subtitle: 'Băng dính Việt Nam',
      image: bannerText,
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

      // Fetch featured products
      try {
        const topProductsData = await getTopProducts(5);
        setFeaturedProducts(topProductsData);
        setFeaturedError('');
      } catch (err) {
        setFeaturedError('Không thể tải sản phẩm nổi bật');
        console.error('Error fetching featured products:', err);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const filteredProducts = selectedCategoryID === null
    ? allProducts
    : allProducts.filter((p) => Number(p.categoryID) === Number(selectedCategoryID));

  const selectedCategoryName = selectedCategoryID === null
    ? 'SẢN PHẨM'
    : categories.find((c) => c.categoryID === selectedCategoryID)?.categoryName || 'DANH MỤC';

  const productPriceMap = useMemo(() => {
    const map = new Map<number, Product>();
    allProducts.forEach((product) => {
      map.set(product.productID, product);
    });
    return map;
  }, [allProducts]);

  const featuredProductsToShow = useMemo(() => {
    return featuredProducts
      .map((item) => productPriceMap.get(item.productID))
      .filter((item): item is Product => Boolean(item))
      .slice(0, 5);
  }, [featuredProducts, productPriceMap]);

  const featuredItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
      },
    },
  };

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider
        currentSlide={currentSlide}
        slides={slides}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
        onGoToSlide={goToSlide}
      />

      {/* Featured Products */}
      <section className="max-w-[1600px] mx-auto px-4 py-10">
        <div className="border-b-2 border-[#EAEAEA] mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#333333] font-semibold text-3xl uppercase inline-block border-l-4 border-[#FF3300] pl-3 pb-2">
              SẢN PHẨM NỔI BẬT
            </h2>
            <button
              type="button"
              onClick={() => navigate('/san-pham')}
              className="text-sm text-gray-500 hover:text-red-600 underline transition-colors cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-[310px] rounded-lg bg-[#F2F2F2] animate-pulse" />
            ))}
          </div>
        ) : featuredError ? (
          <div className="rounded-lg border border-[#F1D0D0] bg-[#FFF7F7] px-4 py-3 text-[#A94442] text-sm">
            {featuredError}
          </div>
        ) : featuredProductsToShow.length === 0 ? (
          <div className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-6 text-center text-[#666666]">
            Chưa có dữ liệu sản phẩm nổi bật
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {featuredProductsToShow.map((product) => (
              <ProductCard
                key={product.productID}
                product={product}
                variants={featuredItemVariants}
              />
            ))}
          </div>
        )}
      </section>

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
      <NewsSection articles={newsArticles.slice(0, 4)} />
    </>
  );
};

export default HomePage;
