import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const menuItems = [
    'Trang chủ',
    'Giới thiệu',
    'Sản phẩm',
    'Chính sách bán hàng',
    'Tin tức',
    'Thư viện',
    'Liên hệ',
  ];

  const socialIcons = [
    { icon: Facebook, color: '#3b5998', label: 'Facebook' },
    { icon: Youtube, color: '#ff0000', label: 'Youtube' },
    { icon: Instagram, color: '#e1306c', label: 'Instagram' },
    { icon: Twitter, color: '#1da1f2', label: 'Twitter' },
    { icon: Linkedin, color: '#0077b5', label: 'Linkedin' },
    { icon: Mail, color: '#ea4335', label: 'Email' },
  ];

  return (
    <footer className="bg-[#ECF4F9] border-t border-[#9EC6E0]">
      <div className="w-full px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-[#333333] font-bold text-base uppercase mb-5">
              Thông tin liên hệ
            </h3>
            <div className="space-y-2">
              <p className="text-[#333333] font-bold text-xl leading-tight">
                CÔNG TY TNHH GIẢI PHÁP VÀ CÔNG NGHỆ BẮC VIỆT
              </p>
              <div className="text-[#333333] text-sm space-y-1">
                <p>- Địa chỉ: Tòa nhà C9 ngõ 7/18 Đặng Vũ Hỷ, Thượng Thanh, Long Biên, Hà Nội.</p>
                <p>- E-mail: <a href="mailto:info@thietkephanmem.com" className="text-primary hover:underline">info@thietkephanmem.com</a></p>
                <p>- Website: <a href="http://www.thietkephanmem.com" className="text-primary hover:underline">www.thietkephanmem.com</a></p>
                <p>- Thiết kế Web: <a href="tel:0913030328" className="text-primary hover:underline">0913.03.03.28</a> (Mr. Tùng)</p>
                <p>- Kỹ thuật, Web: <a href="tel:0975754770" className="text-primary hover:underline">0975.754.770</a> (Mr. Phúc)</p>
                <p>- SEO và quản trị Web: <a href="tel:0985299707" className="text-primary hover:underline">0985.299.707</a> (Ms. Thu)</p>
                <p>- Tư vấn đồ họa, mẫu: <a href="tel:0972191423" className="text-primary hover:underline">0972.191.423</a> (Ms. Tuyến)</p>
                <p>- Tư vấn mẫu, kế toán: <a href="tel:0902195866" className="text-primary hover:underline">0902.195.866</a> (Ms. Chi)</p>
              </div>
            </div>
          </motion.div>

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h3 className="text-[#333333] font-bold text-base uppercase mb-5">
              Danh mục
            </h3>
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to="#"
                    className="text-primary text-sm font-medium hover:underline transition-all"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-[#333333] font-bold text-base uppercase mb-5">
              Chúng tôi trên mạng xã hội
            </h3>
            
            {/* Facebook Widget */}
            <div className="mb-6 bg-white border border-[#EBEDF0] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="/assets/images/facebook-logo.png" 
                  alt="Facebook Logo"
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Ccircle fill="%233b5998" cx="24" cy="24" r="24"/%3E%3C/svg%3E';
                  }}
                />
                <div>
                  <p className="text-[#333333] font-medium text-sm">Chuyên thiết kế website ở…</p>
                  <button className="mt-1 px-3 py-1 bg-[#3b5998] text-white text-xs rounded hover:bg-[#2d4373] transition-colors">
                    Theo dõi Trang
                  </button>
                </div>
              </div>
              <p className="text-[#333333] text-xs">1,6K người theo dõi</p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 flex-wrap">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white border border-[#8C8C8C] rounded-full hover:border-primary transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" style={{ color: social.color }} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#9EC6E0] pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#525354]">
            <p>
              © 2023 Copyright by thietkephanmem.com. All rights reserved. --- 
              <a href="#" className="text-primary hover:underline ml-1">
                ---
              </a>
            </p>
            <div className="text-right">
              <p>Online: 2 _ Tổng: 4,544</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-[#3EB104] text-white p-3 rounded-full shadow-lg hover:bg-[#30a80c] transition-colors"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-[#3EB104] text-white p-3 rounded-full shadow-lg hover:bg-[#30a80c] transition-colors"
          aria-label="Phone"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </motion.button>
      </div>

      {/* Registration Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-4 bottom-4 z-40 bg-[#D50D20] text-white px-4 py-2 rounded border border-[#46B8DA] shadow-lg hover:bg-[#b50b1a] transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-medium">Đăng ký báo giá</span>
      </motion.button>
    </footer>
  );
};

export default Footer;
