import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { newsArticles } from '../../data/newsData';
import { Link } from 'react-router-dom';

const NewsPage = () => {

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
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
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
        <div className="max-w-[1600px] mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Tin tức</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Cập nhật tin tức mới nhất về sản phẩm, hướng dẫn sử dụng và kiến thức chuyên ngành
            </p>
          </motion.div>
        </div>
      </section>

      {/* News List */}
      <section className="py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {newsArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all group border border-gray-100"
                >
                  <Link to={`/tin-tuc/${article.id}`} className="flex flex-col sm:flex-row h-full">
                    {/* Image Section */}
                    <div className="sm:w-[300px] lg:w-[350px] flex-shrink-0 overflow-hidden bg-gray-100">
                      <motion.img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 min-h-[200px] sm:min-h-full"
                        onError={(e) => {
                          e.currentTarget.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23f0f0f0" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3ENews Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                      <div>
                        {/* Category Badge & Meta */}
                        <div className="flex items-center gap-4 mb-3">
                          {article.category && (
                            <span className="inline-block bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">
                              {article.category}
                            </span>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {article.date}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 group-hover:text-red-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        {article.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-base">
                            {article.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Read More Link */}
                      <div className="text-red-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-4">
                        Xem tiếp
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
