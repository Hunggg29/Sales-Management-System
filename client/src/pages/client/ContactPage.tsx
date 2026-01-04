import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Send, User, MessageSquare } from 'lucide-react';
import { FaFacebookF, FaTelegramPlane } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const ContactPage = () => {
  const { storeInfo } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: storeInfo.address,
      link: 'https://maps.app.goo.gl/3eHsJtQoABStC4yj7',
    },
    {
      icon: Phone,
      title: 'Hotline',
      content: '0947.900.666',
      link: 'tel:0947.900.666',
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      content: storeInfo.phone,
      link: `tel:${storeInfo.phone}`,
    },
    {
      icon: Mail,
      title: 'Email',
      content: storeInfo.email,
      link: `mailto:${storeInfo.email}`,
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'karota.vietnam@gmail.com',
      link: 'mailto:karota.vietnam@gmail.com',
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 7: 8:00 - 17:30',
      link: null,
    },
  ];

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
            <h1 className="text-5xl font-bold mb-6">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-32 relative z-10">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <item.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-gray-600">{item.content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-red-600" />
                Gửi Tin Nhắn
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        placeholder="0123456789"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Vấn đề bạn muốn hỏi"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  Gửi tin nhắn
                </motion.button>
              </form>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-red-600 to-red-700">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <MapPin className="w-7 h-7" />
                    Vị Trí Của Chúng Tôi
                  </h2>
                </div>
                <div className="h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14905.168665346466!2d105.854194!3d20.940779!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135adc0f464b957%3A0xcb94a45c294be9e1!2zQ-G7lSDEkGnhu4NuIEEsIFThu6kgSGnhu4dwLCBUaGFuaCBUcsOsLCBIYW5vaSwgVmlldG5hbQ!5e0!3m2!1sen!2sus!4v1761849265234!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vị trí công ty"
                  ></iframe>
                </div>
                <div className="p-4">
                  <a
                    href="https://maps.app.goo.gl/3eHsJtQoABStC4yj7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Xem bản đồ lớn hơn →
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Kết Nối Với Chúng Tôi</h3>
                <div className="flex gap-4 justify-center">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#3b5998] text-white p-4 rounded-full hover:shadow-lg transition-all"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-7 h-7" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#0068FF] text-white p-4 rounded-full hover:shadow-lg transition-all"
                    aria-label="Zalo"
                  >
                    <SiZalo className="w-7 h-7" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#0088cc] text-white p-4 rounded-full hover:shadow-lg transition-all"
                    aria-label="Telegram"
                  >
                    <FaTelegramPlane className="w-7 h-7" />
                  </motion.a>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-6 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg">Công ty TNHH Karota Việt Nam</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Chuyên cung cấp các sản phẩm băng dính chất lượng cao, phục vụ nhu cầu đóng gói và bảo quản hàng hóa.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
