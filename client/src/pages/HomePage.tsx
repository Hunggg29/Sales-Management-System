import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Eye, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    {
      title: 'Màng cuốn giá tốt nhất thị trường Việt Nam',
      subtitle: 'Băng dính Việt Nam',
      image: '/assets/images/banner-text.png',
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Băng dính chống tĩnh điện\n10mm',
      price: 'Mời liên hệ',
      image: '/assets/images/product-1.png',
    },
    {
      id: 2,
      name: 'Băng dính dán lưỡi dao',
      price: 'Mời liên hệ',
      image: '/assets/images/product-2.png',
    },
    {
      id: 3,
      name: 'Băng keo OPP đóng gói\nmàu xanh lá',
      price: 'Mời liên hệ',
      image: '/assets/images/product-3.png',
    },
    {
      id: 4,
      name: 'Băng dính chống trơn trượt',
      price: 'Mời liên hệ',
      image: '/assets/images/product-4.png',
    },
    {
      id: 5,
      name: 'Băng dính 2 mặt',
      price: 'Mời liên hệ',
      image: '/assets/images/product-5.png',
    },
    {
      id: 6,
      name: 'Thùng carton 3 lớp',
      price: 'Mời liên hệ',
      image: '/assets/images/product-6.png',
    },
  ];

  const categories = [
    { name: 'Băng dính Kapton (chịu nhiệt)', color: '#F3E6F8AB' },
    { name: 'Băng dính đóng gói OPP', color: '#009966' },
    { name: 'Băng dính dán nền', color: '#FF66CC' },
    { name: 'Băng dính 2 mặt', color: '#0099CC' },
    { name: 'Băng dính chống tĩnh điện', color: '#0099CC' },
    { name: 'Băng dính nhôm', color: '#0099CC' },
    { name: 'Túi PE, PP, HDPE', color: '#0099CC' },
    { name: 'Hạt chống ẩm', color: '#0099CC' },
  ];

  const news = [
    {
      id: 1,
      title: 'Giới thiệu sản phẩm Băng dính vải chất lượng cao',
      date: '02/01/2023',
      views: 58,
      image: '/assets/images/news-1.png',
    },
    {
      id: 2,
      title: 'Quy trình đặt mua băng dính in chữ',
      date: '02/01/2023',
      views: 49,
      image: '/assets/images/news-2.png',
    },
    {
      id: 3,
      title: 'Cấu tạo sản phẩm băng dính/băng keo',
      date: '02/01/2023',
      views: 55,
      image: '/assets/images/news-3.png',
    },
    {
      id: 4,
      title: 'Màng PE và những điều cần biết về PE Stresch Film',
      date: '02/01/2023',
      views: 51,
      image: '/assets/images/news-1.png',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

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
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <section className="relative h-[542px] bg-white overflow-hidden">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.img
              src={bannerSlides[currentSlide].image}
              alt={bannerSlides[currentSlide].title}
              className="mx-auto max-w-4xl w-full h-auto"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7 }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl font-bold text-[#333333] mt-8"
            >
              {bannerSlides[currentSlide].title}
            </motion.h1>
          </div>
        </motion.div>

        {/* Slider Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#EAEAEA] hover:bg-primary text-[#CCCCCC] hover:text-white p-2 rounded-full transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#EAEAEA] hover:bg-primary text-[#CCCCCC] hover:text-white p-2 rounded-full transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-[340px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden"
            >
              <div className="bg-[#CC0000] px-4 py-3">
                <h2 className="text-white font-bold text-lg uppercase tracking-wide">DANH MỤC SẢN PHẨM</h2>
              </div>
              <ul className="divide-y divide-[#EAEAEA]">
                {categories.map((category, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ backgroundColor: '#f8f8f8', x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a
                      href="#"
                      className="block px-5 py-4 text-[#333333] font-bold text-base hover:text-primary transition-colors"
                    >
                      {category.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Best Selling Products */}
            <section className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border-b-2 border-[#EAEAEA] mb-6"
              >
                <h2 className="text-[#333333] font-semibold text-3xl uppercase inline-block border-l-4 border-[#FF3300] pl-3 pb-2">
                  SẢN PHẨM
                </h2>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    className="bg-[#F4F4F4] border border-[#EAEAEA] rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <div className="aspect-square bg-white p-4 flex items-center justify-center overflow-hidden">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-[#333333] font-bold text-lg mb-2 whitespace-pre-line">
                        {product.name}
                      </h3>
                      <p className="text-[#FF3366] font-bold text-lg">{product.price}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </main>
        </div>
      </div>

      {/* Featured News - Full Width */}
      <section className="bg-white py-12">
        <div className="max-w-[1600px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-b-2 border-[#EAEAEA] mb-8"
          >
            <h2 className="text-[#333333] font-semibold text-3xl uppercase inline-block border-l-4 border-[#0099CC] pl-3 pb-2">
              Tin nổi bật
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
                {news.map((article) => (
                  <motion.div
                    key={article.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <div className="aspect-video bg-[#FCFCFC] border border-[#EAEAEA] overflow-hidden">
                      <motion.img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23fcfcfc" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3ENews Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-[#333333] font-bold text-lg leading-tight mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 text-base text-[#919191] mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views}
                        </span>
                      </div>
                      <a
                        href="#"
                        className="text-[#0099CC] text-lg font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Xem tiếp
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
