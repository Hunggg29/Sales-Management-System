import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  CheckCircle,
  Users,
  Headphones,
  Shield,
  TrendingUp,
  Award
} from 'lucide-react';

const ConsultingPage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const services = [
    {
      title: 'Tư vấn băng dính',
      description: 'Tư vấn lựa chọn loại băng dính phù hợp với nhu cầu sử dụng',
      icon: <Award className="w-8 h-8" />,
    },
    {
      title: 'Tư vấn màng PE',
      description: 'Hỗ trợ chọn màng PE theo kích thước, độ dày và mục đích sử dụng',
      icon: <Shield className="w-8 h-8" />,
    },
    {
      title: 'Tư vấn xốp hơi',
      description: 'Tư vấn sử dụng xốp hơi bảo vệ hàng hóa trong vận chuyển',
      icon: <TrendingUp className="w-8 h-8" />,
    },
    {
      title: 'Giải pháp bao bì',
      description: 'Tư vấn giải pháp bao bì tổng thể cho doanh nghiệp',
      icon: <Users className="w-8 h-8" />,
    },
  ];

  const consultingProcess = [
    {
      step: '01',
      title: 'Tiếp nhận yêu cầu',
      description: 'Gửi thông tin tư vấn qua form hoặc hotline',
    },
    {
      step: '02',
      title: 'Phân tích nhu cầu',
      description: 'Chuyên viên phân tích và đánh giá yêu cầu',
    },
    {
      step: '03',
      title: 'Tư vấn giải pháp',
      description: 'Đề xuất sản phẩm và giải pháp phù hợp',
    },
    {
      step: '04',
      title: 'Báo giá chi tiết',
      description: 'Cung cấp báo giá và hỗ trợ đặt hàng',
    },
  ];

  const faqs = [
    {
      question: 'Làm thế nào để chọn băng dính phù hợp?',
      answer: 'Tùy vào mục đích sử dụng, bề mặt dán và điều kiện môi trường. Chúng tôi sẽ tư vấn chi tiết về độ dính, độ bền và giá thành phù hợp.',
    },
    {
      question: 'Màng PE có những loại nào?',
      answer: 'Có nhiều loại: màng PE cuộn, màng PE túi, màng PE thổi, màng PE co giãn. Mỗi loại có ứng dụng riêng trong bao bì và vận chuyển.',
    },
    {
      question: 'Có tư vấn miễn phí không?',
      answer: 'Hoàn toàn miễn phí! Chúng tôi cung cấp dịch vụ tư vấn chuyên nghiệp không mất phí cho mọi khách hàng.',
    },
    {
      question: 'Thời gian phản hồi tư vấn?',
      answer: 'Chúng tôi cam kết phản hồi trong vòng 30 phút đến 2 giờ làm việc sau khi nhận được yêu cầu tư vấn.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-[1600px] mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Tư Vấn Chuyên Nghiệp</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Đội ngũ chuyên viên giàu kinh nghiệm sẵn sàng hỗ trợ bạn 24/7
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="bg-red-600 text-white py-6">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a
              href="tel:0947.900.666"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 hover:scale-105 transition-transform"
            >
              <Phone className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">Hotline</p>
                <p className="text-xl font-bold">0947.900.666</p>
              </div>
            </motion.a>

            <motion.a
              href="mailto:thanglongtape@gmail.com"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-center gap-3 hover:scale-105 transition-transform"
            >
              <Mail className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">Email</p>
                <p className="text-xl font-bold">thanglongtape@gmail.com</p>
              </div>
            </motion.a>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">Giờ làm việc</p>
                <p className="text-xl font-bold">8:00 - 22:00</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Consulting Process */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-4">Quy Trình Tư Vấn</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              4 bước đơn giản để nhận được tư vấn chuyên nghiệp
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {consultingProcess.map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-6xl font-bold text-blue-100 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-[#333333] mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < consultingProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-1 bg-blue-300"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-4">Liên Hệ Tư Vấn</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Hãy liên hệ với chúng tôi qua các kênh sau để được tư vấn trực tiếp
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <motion.a
              href="tel:0947.900.666"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Hotline</h3>
                <p className="text-2xl font-bold mb-2">0947.900.666</p>
                <p className="text-sm opacity-90">Hỗ trợ 24/7</p>
              </div>
            </motion.a>

            <motion.a
              href="tel:0243.681.6262"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Điện thoại</h3>
                <p className="text-2xl font-bold mb-2">0243.681.6262</p>
                <p className="text-sm opacity-90">Giờ hành chính</p>
              </div>
            </motion.a>

            <motion.a
              href="mailto:thanglongtape@gmail.com"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-lg font-bold mb-2">thanglongtape@gmail.com</p>
                <p className="text-sm opacity-90">Phản hồi trong 2h</p>
              </div>
            </motion.a>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Địa chỉ</h3>
                <p className="text-lg font-bold mb-2">Xã Thanh Trì</p>
                <p className="text-sm opacity-90">Hà Nội, Việt Nam</p>
              </div>
            </motion.div>
          </div>

          {/* Why Choose Us */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-blue-50 p-12 rounded-lg"
          >
            <h3 className="text-3xl font-bold text-[#333333] mb-8 text-center">Cam Kết Của Chúng Tôi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Headphones className="w-8 h-8" />, text: 'Tư vấn chuyên nghiệp 24/7', color: 'bg-red-600' },
                { icon: <Users className="w-8 h-8" />, text: 'Đội ngũ giàu kinh nghiệm', color: 'bg-blue-600' },
                { icon: <CheckCircle className="w-8 h-8" />, text: 'Miễn phí 100% dịch vụ tư vấn', color: 'bg-green-600' },
                { icon: <MessageCircle className="w-8 h-8" />, text: 'Phản hồi nhanh chóng', color: 'bg-purple-600' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 ${item.color} text-white rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <p className="text-gray-700 font-semibold">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-4">Câu Hỏi Thường Gặp</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Một số câu hỏi phổ biến từ khách hàng
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-[#333333] mb-3 flex items-start gap-3">
                  <span className="text-blue-600">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-8">
                  <span className="text-blue-600 font-bold">A:</span> {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConsultingPage;
