import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getNewsById, getRelatedNews } from '../../data/newsData';
import { useEffect } from 'react';

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = getNewsById(Number(id));
  const relatedNews = getRelatedNews(Number(id), 3);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h2>
          <Link to="/news" className="text-red-600 hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft className="w-5 h-5" />
            Quay lại trang tin tức
          </Link>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb & Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/news')}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại tin tức
          </button>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-white py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            {/* Category Badge */}
            {article.category && (
              <span className="inline-block bg-red-100 text-red-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                {article.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{article.date}</span>
              </div>
              {article.author && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Tác giả:</span>
                  <span>{article.author}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Featured Image */}
                <div className="aspect-video overflow-hidden bg-gray-100 p-3 sm:p-4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23f0f0f0" width="800" height="450"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20"%3ENews Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Article Body */}
                <div className="p-8 lg:p-12">
                  {article.excerpt && (
                    <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8 rounded-r-lg">
                      <p className="text-lg text-gray-700 italic leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  )}

                  <div
                    className="prose prose-lg max-w-none
                      prose-headings:text-gray-900 prose-headings:font-bold
                      prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
                      prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                      prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                      prose-ul:my-6 prose-ul:space-y-2
                      prose-li:text-gray-700
                      prose-strong:text-gray-900 prose-strong:font-bold
                      prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-lg prose-img:shadow-md
                      prose-table:border-collapse prose-table:w-full
                      prose-th:bg-red-600 prose-th:text-white prose-th:p-3 prose-th:text-left
                      prose-td:border prose-td:border-gray-300 prose-td:p-3
                    "
                    dangerouslySetInnerHTML={{ __html: article.content || '' }}
                  />
                </div>
              </div>

              {/* Contact CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-4">Cần tư vấn thêm?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Liên hệ với chúng tôi để được tư vấn chi tiết về sản phẩm và dịch vụ
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="tel:0947.900.666"
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    Gọi: 0947.900.666
                  </a>
                  <Link
                    to="/tu-van"
                    className="bg-red-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-900 transition-colors"
                  >
                    Trang tư vấn
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-red-600">
                    Tin liên quan
                  </h3>
                  <div className="space-y-6">
                    {relatedNews.map((news) => (
                      <Link
                        key={news.id}
                        to={`/news/${news.id}`}
                        className="group block"
                      >
                        <div className="flex gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 p-1">
                            <img
                              src={news.image}
                              alt={news.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
                              {news.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {news.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/news"
                    className="mt-6 flex items-center justify-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
                  >
                    Xem tất cả tin tức
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDetailPage;
