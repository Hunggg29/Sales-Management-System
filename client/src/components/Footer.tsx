import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { FaFacebookF, FaTelegramPlane } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { useSettings } from '../contexts/SettingsContext';

const Footer = () => {
  const { storeInfo } = useSettings();
  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Giới thiệu', path: '/gioi-thieu' },
    { name: 'Sản phẩm', path: '/san-pham' },
    { name: 'Tư vấn', path: '/tu-van' },
    { name: 'Tin tức', path: '/tin-tuc' },
    { name: 'Liên hệ', path: '/lien-he' },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#f8f8f8] to-white border-t-4 border-red-600">
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-red-600 font-bold text-2xl uppercase mb-6 border-b-2 border-red-600 pb-3 inline-block">
              Thông tin liên hệ
            </h3>
            <div className="space-y-4 mt-6">
              <div>
                <p className="text-[#333333] font-bold text-xl leading-tight mb-4">
                  {storeInfo.storeName}
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#555] text-lg font-medium">Địa chỉ:</p>
                  <p className="text-[#333] text-lg">{storeInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#555] text-lg font-medium">Email:</p>
                  <a href={`mailto:${storeInfo.email}`} className="text-red-600 text-lg hover:underline block">
                    {storeInfo.email}
                  </a>
                  <a href="mailto:karota.vietnam@gmail.com" className="text-red-600 text-lg hover:underline block">
                    karota.vietnam@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#555] text-lg font-medium">Điện thoại:</p>
                  <a href={`tel:${storeInfo.phone}`} className="text-[#333] text-lg hover:text-red-600 transition-colors block">
                    {storeInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-red-600 mt-1 flex-shrink-0 animate-pulse" />
                <div>
                  <p className="text-[#555] text-lg font-medium">Hotline:</p>
                  <a href="tel:0947.900.666" className="text-red-600 text-xl font-bold hover:text-red-700 transition-colors">
                    0947.900.666
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-[#555] text-lg font-medium mb-3">Kết nối với chúng tôi:</p>
                <div className="flex gap-3">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#3b5998] text-white p-3 rounded-full hover:opacity-80 transition-all shadow-md"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#0068FF] text-white p-3 rounded-full hover:opacity-80 transition-all shadow-md"
                    aria-label="Zalo"
                  >
                    <SiZalo className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#0088cc] text-white p-3 rounded-full hover:opacity-80 transition-all shadow-md"
                    aria-label="Telegram"
                  >
                    <FaTelegramPlane className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-red-600 font-bold text-2xl uppercase mb-6 border-b-2 border-red-600 pb-3 inline-block">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3 mt-6">
              {menuItems.map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={item.path}
                    className="text-[#333] text-lg font-medium hover:text-red-600 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-red-600 group-hover:translate-x-1 transition-transform">▸</span>
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-red-600 font-bold text-2xl uppercase mb-6 border-b-2 border-red-600 pb-3 inline-block">
              Bản đồ
            </h3>
            <div className="mt-6">
              <div className="rounded-lg overflow-hidden shadow-lg border-2 border-red-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14905.168665346466!2d105.854194!3d20.940779!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135adc0f464b957%3A0xcb94a45c294be9e1!2zQ-G7lSDEkGnhu4NuIEEsIFThu6kgSGnhu4dwLCBUaGFuaCBUcsOsLCBIYW5vaSwgVmlldG5hbQ!5e0!3m2!1sen!2sus!4v1761849265234!5m2!1sen!2sus"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vị trí công ty"
                  className="w-full"
                ></iframe>
              </div>
              <motion.a
                href="https://maps.app.goo.gl/3eHsJtQoABStC4yj7"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="mt-4 block text-center bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Xem bản đồ lớn hơn →
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

     

      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-red-600 text-white p-3 rounded-full shadow-xl hover:bg-red-700 transition-colors cursor-pointer"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>

      {/* Registration Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-4 bottom-4 z-40 bg-red-600 text-white px-5 py-3 rounded-lg shadow-xl hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">Đăng ký báo giá</span>
      </motion.button>
    </footer>
  );
};

export default Footer;
