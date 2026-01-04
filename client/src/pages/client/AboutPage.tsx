import { motion } from 'framer-motion';
import { Award, Users, Target, TrendingUp, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const AboutPage = () => {
  const { storeInfo } = useSettings();
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '10,000+', label: 'Khách hàng tin tưởng' },
    { icon: <Award className="w-8 h-8" />, value: '15+', label: 'Năm kinh nghiệm' },
    { icon: <Target className="w-8 h-8" />, value: '50,000+', label: 'Sản phẩm cung cấp' },
    { icon: <TrendingUp className="w-8 h-8" />, value: '99%', label: 'Khách hàng hài lòng' },
  ];

  const values = [
    {
      title: 'Chất lượng hàng đầu',
      description: 'Cam kết cung cấp sản phẩm chất lượng cao, đáp ứng tiêu chuẩn quốc tế',
      icon: <Award className="w-6 h-6" />,
    },
    {
      title: 'Giá cả cạnh tranh',
      description: 'Mức giá tốt nhất thị trường với chính sách chiết khấu hấp dẫn',
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: 'Dịch vụ tận tâm',
      description: 'Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng 24/7',
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: 'Giao hàng nhanh chóng',
      description: 'Cam kết giao hàng đúng hạn, bảo quản cẩn thận trong quá trình vận chuyển',
      icon: <Target className="w-6 h-6" />,
    },
  ];

  const milestones = [
    { year: '2008', title: 'Thành lập công ty', description: 'Khởi đầu với đội ngũ 5 người' },
    { year: '2012', title: 'Mở rộng quy mô', description: 'Mở 3 chi nhánh tại các tỉnh thành' },
    { year: '2018', title: 'Đạt chứng nhận ISO', description: 'Được công nhận tiêu chuẩn chất lượng quốc tế' },
    { year: '2025', title: 'Đối tác tin cậy', description: 'Hơn 10,000 khách hàng doanh nghiệp' },
  ];

  return (
    <div className="bg-white">
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
            <h1 className="text-5xl font-bold mb-6">Về Chúng Tôi</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Đơn vị cung cấp băng dính, màng PE và vật tư bao bì hàng đầu Việt Nam
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-[#333333] mb-6 border-l-4 border-red-600 pl-4">
                Giới Thiệu Công Ty
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  <strong className="text-red-600">Công ty chúng tôi</strong> là đơn vị chuyên cung cấp các sản phẩm 
                  băng dính, màng PE, xốp hơi và các loại vật tư bao bì công nghiệp với hơn 15 năm kinh nghiệm trong ngành.
                </p>
                <p>
                  Chúng tôi tự hào là đối tác tin cậy của hàng ngàn doanh nghiệp lớn nhỏ trên toàn quốc, 
                  cung cấp giải pháp bao bì toàn diện với chất lượng cao và giá thành cạnh tranh.
                </p>
                <p>
                  Với phương châm <strong>"Chất lượng - Uy tín - Giá tốt"</strong>, chúng tôi không ngừng 
                  cải tiến và phát triển để mang đến cho khách hàng những sản phẩm và dịch vụ tốt nhất.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden shadow-xl">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect fill='%23f0f0f0' width='800' height='450'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='24'%3ECompany Image%3C/text%3E%3C/svg%3E"
                  alt="Company"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-[#333333] mb-2">{stat.value}</h3>
                <p className="text-gray-600 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
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
            <h2 className="text-4xl font-bold text-[#333333] mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Những giá trị mà chúng tôi cam kết mang đến cho khách hàng
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-red-600 hover:shadow-lg transition-all group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
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
            <h2 className="text-4xl font-bold text-[#333333] mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Những lý do khiến khách hàng tin tưởng và lựa chọn dịch vụ của chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Sản phẩm chất lượng cao, nguồn gốc rõ ràng',
              'Giá cả cạnh tranh nhất thị trường',
              'Giao hàng nhanh chóng toàn quốc',
              'Tư vấn chuyên nghiệp, nhiệt tình',
              'Chính sách bảo hành, đổi trả linh hoạt',
              'Hỗ trợ khách hàng 24/7',
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all"
              >
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-lg">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="max-w-[1600px] mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Bán buôn bán lẻ: Băng dính, băng dính dán thùng, băng dính in logo, băng dính trong, băng dính đục, băng dính Simili, băng dính 2 mặt, băng dính điện, màng cuốn PE, băng dính dán nền, băng dính vải
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg">Địa chỉ</h3>
                <p className="text-white/90">{storeInfo.address}</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg">Hotline</h3>
                <a href="tel:0947.900.666" className="text-white/90 hover:text-white text-xl font-bold">
                  0947.900.666
                </a>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg">Email</h3>
                <a href={`mailto:${storeInfo.email}`} className="text-white/90 hover:text-white">
                  {storeInfo.email}
                </a>
                <a href="mailto:karota.vietnam@gmail.com" className="text-white/90 hover:text-white">
                  karota.vietnam@gmail.com 
                </a>
                
              </div>
            </div>

            <a
              href="/lien-he"
              className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
            >
              Liên hệ ngay
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
