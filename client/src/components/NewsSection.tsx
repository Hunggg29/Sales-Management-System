import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NewsArticle } from '../types';

interface NewsSectionProps {
  articles: NewsArticle[];
}

const NewsSection = ({ articles }: NewsSectionProps) => {
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
          {articles.map((article) => (
            <motion.div
              key={article.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden cursor-pointer group"
            >
              <Link to={`/tin-tuc/${article.id}`}>
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
                  <div className="text-[#0099CC] text-lg font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
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
  );
};

export default NewsSection;
