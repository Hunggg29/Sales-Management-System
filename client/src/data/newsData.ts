import type { NewsArticle } from '../types';
import bangDinhVaiImg from '../assets/images/bang-dinh-vai.jpg';
import bangDinhInChuImg from '../assets/images/bang-dinh-in-chu.jpg';
import cauTaoSanPhamImg from '../assets/images/cau-tao-san-pham.jpg';
import mangPEImg from '../assets/images/mang-PE.jpg';
import xopHoiImg from '../assets/images/xop-hoi.jpg';
import soSanhOppKraftImg from '../assets/images/so-sanh-bang-dinh-OPP-va-bang-dinh-KRAFT.jpg';

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: 'Giới thiệu sản phẩm Băng dính vải chất lượng cao',
    date: '02/01/2023',
    views: 58,
    image: bangDinhVaiImg,
    category: 'Sản phẩm',
    author: 'Admin',
    excerpt: 'Băng dính vải là một trong những sản phẩm chất lượng cao được ưa chuộng nhất hiện nay trong lĩnh vực đóng gói và bảo quản hàng hóa.',
    content: `
      <h2>Giới thiệu về Băng dính vải</h2>
      <p>Băng dính vải là một trong những sản phẩm chất lượng cao được ưa chuộng nhất hiện nay trong lĩnh vực đóng gói và bảo quản hàng hóa. Với khả năng bám dính mạnh mẽ và độ bền vượt trội, băng dính vải đã trở thành lựa chọn hàng đầu của nhiều doanh nghiệp.</p>

      <h3>Đặc điểm nổi bật</h3>
      <ul>
        <li><strong>Độ bám dính cao:</strong> Băng dính vải có khả năng bám dính cực tốt trên nhiều bề mặt khác nhau như giấy, gỗ, kim loại, nhựa...</li>
        <li><strong>Độ bền vượt trội:</strong> Chất liệu vải dày dặn giúp băng dính có khả năng chịu lực tốt, không bị rách hay đứt khi kéo căng.</li>
        <li><strong>Chống thấm nước:</strong> Lớp keo đặc biệt giúp băng dính vải có khả năng chống thấm nước hiệu quả.</li>
        <li><strong>Dễ dàng sử dụng:</strong> Có thể xé bằng tay mà không cần dụng cụ hỗ trợ.</li>
      </ul>

      <h3>Ứng dụng</h3>
      <p>Băng dính vải được sử dụng rộng rãi trong nhiều lĩnh vực:</p>
      <ul>
        <li>Đóng gói hàng hóa nặng, cần độ bền cao</li>
        <li>Sửa chữa, gia cố các bề mặt bị hư hỏng</li>
        <li>Ghép nối các vật liệu trong công nghiệp</li>
        <li>Ứng dụng trong sân khấu, sự kiện</li>
      </ul>

      <h3>Cam kết chất lượng</h3>
      <p>Chúng tôi cam kết cung cấp băng dính vải chất lượng cao nhất với giá cả hợp lý. Sản phẩm được nhập khẩu từ các nhà máy uy tín, đảm bảo đáp ứng mọi nhu cầu của khách hàng.</p>

      <p><strong>Liên hệ ngay:</strong> 0947.900.666 để được tư vấn chi tiết và nhận báo giá tốt nhất!</p>
    `,
  },
  {
    id: 2,
    title: 'Quy trình đặt mua băng dính in chữ',
    date: '02/01/2023',
    views: 49,
    image: bangDinhInChuImg,
    category: 'Hướng dẫn',
    author: 'Admin',
    excerpt: 'Băng dính in chữ là giải pháp quảng bá thương hiệu hiệu quả và tiết kiệm chi phí. Tìm hiểu quy trình đặt mua đơn giản và nhanh chóng.',
    content: `
      <h2>Quy trình đặt mua Băng dính in chữ</h2>
      <p>Băng dính in chữ không chỉ là công cụ đóng gói mà còn là phương tiện quảng bá thương hiệu hiệu quả. Dưới đây là quy trình đặt mua băng dính in chữ tại công ty chúng tôi.</p>

      <h3>Bước 1: Liên hệ tư vấn</h3>
      <p>Quý khách vui lòng liên hệ với chúng tôi qua:</p>
      <ul>
        <li>Hotline: <strong>0947.900.666</strong></li>
        <li>Email: <strong>thanglongtape@gmail.com</strong></li>
        <li>Trực tiếp tại showroom: Xã Thanh Trì, Hà Nội</li>
      </ul>
      <p>Đội ngũ tư vấn của chúng tôi sẽ hỗ trợ bạn lựa chọn loại băng dính phù hợp với nhu cầu.</p>

      <h3>Bước 2: Gửi thông tin thiết kế</h3>
      <p>Khách hàng cung cấp cho chúng tôi:</p>
      <ul>
        <li>Logo hoặc nội dung cần in (file thiết kế)</li>
        <li>Kích thước băng dính mong muốn</li>
        <li>Số lượng cần đặt</li>
        <li>Màu sắc băng dính và chữ in</li>
      </ul>
      <p><em>Lưu ý: File thiết kế nên ở định dạng AI, PSD, PDF hoặc hình ảnh có độ phân giải cao.</em></p>

      <h3>Bước 3: Xác nhận thiết kế và báo giá</h3>
      <p>Sau khi nhận thông tin, chúng tôi sẽ:</p>
      <ul>
        <li>Tạo mẫu thiết kế để khách hàng xem trước</li>
        <li>Cung cấp báo giá chi tiết dựa trên số lượng và yêu cầu</li>
        <li>Tư vấn về thời gian sản xuất và giao hàng</li>
      </ul>

      <h3>Bước 4: Thanh toán và sản xuất</h3>
      <p>Khi khách hàng đồng ý với thiết kế và giá cả:</p>
      <ul>
        <li>Ký hợp đồng (nếu là đơn hàng lớn)</li>
        <li>Thanh toán theo thỏa thuận (đặt cọc hoặc thanh toán toàn bộ)</li>
        <li>Chúng tôi bắt đầu tiến hành in ấn và sản xuất</li>
      </ul>

      <h3>Bước 5: Kiểm tra và giao hàng</h3>
      <p>Sau khi hoàn thành sản xuất:</p>
      <ul>
        <li>Kiểm tra chất lượng sản phẩm</li>
        <li>Đóng gói cẩn thận</li>
        <li>Giao hàng đến địa chỉ của khách hàng</li>
        <li>Hỗ trợ đổi trả nếu có vấn đề về chất lượng</li>
      </ul>

      <h3>Thời gian sản xuất</h3>
      <p>Thời gian sản xuất băng dính in chữ thông thường từ <strong>5-7 ngày làm việc</strong> tùy thuộc vào số lượng và độ phức tạp của thiết kế.</p>

      <h3>Ưu đãi đặc biệt</h3>
      <p>🎁 Giảm giá đến 15% cho đơn hàng số lượng lớn<br/>
      🎁 Miễn phí thiết kế cho khách hàng đặt từ 100 cuộn trở lên<br/>
      🎁 Giao hàng miễn phí trong nội thành Hà Nội</p>

      <p><strong>Liên hệ ngay hôm nay để được tư vấn chi tiết!</strong></p>
    `,
  },
  {
    id: 3,
    title: 'Cấu tạo sản phẩm băng dính/băng keo',
    date: '02/01/2023',
    views: 55,
    image: cauTaoSanPhamImg,
    category: 'Kiến thức',
    author: 'Admin',
    excerpt: 'Tìm hiểu về cấu tạo của băng dính để lựa chọn sản phẩm phù hợp với nhu cầu sử dụng của bạn.',
    content: `
      <h2>Cấu tạo của Băng dính/Băng keo</h2>
      <p>Băng dính là một trong những vật dụng phổ biến nhất trong đời sống và sản xuất. Tuy nhiên, không phải ai cũng hiểu rõ về cấu tạo của nó. Hãy cùng tìm hiểu chi tiết qua bài viết này.</p>

      <h3>Thành phần chính</h3>
      <p>Băng dính thường bao gồm 3 thành phần cơ bản:</p>

      <h4>1. Lớp nền (Backing Material)</h4>
      <p>Lớp nền là phần thân của băng dính, có thể được làm từ nhiều vật liệu khác nhau:</p>
      <ul>
        <li><strong>Nhựa BOPP:</strong> Phổ biến nhất, trong suốt, bóng, độ bền tốt</li>
        <li><strong>Giấy:</strong> Dễ xé, thân thiện môi trường, thích hợp cho in ấn</li>
        <li><strong>Vải:</strong> Độ bền cao, chịu lực tốt, có thể xé bằng tay</li>
        <li><strong>Nhựa PVC:</strong> Chống thấm nước, độ đàn hồi cao</li>
        <li><strong>Xốp PE:</strong> Có khả năng cách âm, cách nhiệt</li>
      </ul>

      <h4>2. Lớp keo (Adhesive Layer)</h4>
      <p>Đây là thành phần quan trọng nhất quyết định khả năng dính của băng keo:</p>
      <ul>
        <li><strong>Keo acrylic:</strong> Độ dính tốt, bền màu, chống tia UV</li>
        <li><strong>Keo cao su:</strong> Dính nhanh, dễ tách ra, giá thành rẻ</li>
        <li><strong>Keo silicon:</strong> Chịu nhiệt cao, không để lại vết keo</li>
        <li><strong>Keo hotmelt:</strong> Dính nhanh, thích hợp cho băng dính đóng thùng</li>
      </ul>

      <h4>3. Lớp phủ chống dính (Release Coating)</h4>
      <p>Lớp này được phủ lên mặt sau của băng dính để:</p>
      <ul>
        <li>Giúp băng dính dễ dàng tách ra khi cuộn</li>
        <li>Bảo vệ lớp keo không bị khô</li>
        <li>Đảm bảo băng dính không tự dính vào nhau</li>
      </ul>

      <h3>Quy trình sản xuất</h3>
      <p>Băng dính được sản xuất qua các bước sau:</p>
      <ol>
        <li><strong>Chuẩn bị nguyên liệu:</strong> Lớp nền và keo dính</li>
        <li><strong>Phủ keo:</strong> Trải đều lớp keo lên lớp nền bằng máy phủ</li>
        <li><strong>Sấy khô:</strong> Đưa qua lò sấy để keo đạt độ dính tối ưu</li>
        <li><strong>Phủ lớp chống dính:</strong> Phủ lên mặt sau của băng dính</li>
        <li><strong>Cắt cuộn:</strong> Cắt thành các cuộn có kích thước tiêu chuẩn</li>
        <li><strong>Kiểm tra chất lượng:</strong> Kiểm tra độ dính, độ bền, ngoại quan</li>
        <li><strong>Đóng gói:</strong> Đưa vào bao bì và nhãn mác</li>
      </ol>

      <h3>Phân loại theo công dụng</h3>
      <p>Dựa trên cấu tạo, băng dính được chia thành nhiều loại:</p>
      <ul>
        <li><strong>Băng dính đóng thùng:</strong> BOPP + keo acrylic/hotmelt</li>
        <li><strong>Băng dính hai mặt:</strong> Lớp nền xốp + 2 lớp keo</li>
        <li><strong>Băng dính vải:</strong> Lớp nền vải + keo cao su</li>
        <li><strong>Băng dính điện:</strong> Lớp nền PVC + keo chống cháy</li>
        <li><strong>Băng dính giấy:</strong> Lớp nền giấy kraft + keo acrylic</li>
      </ul>

      <h3>Tiêu chuẩn chất lượng</h3>
      <p>Băng dính chất lượng cần đáp ứng các tiêu chí:</p>
      <ul>
        <li>Lực dính đạt tiêu chuẩn (đo bằng N/cm)</li>
        <li>Độ bền kéo đứt (đo bằng N/cm)</li>
        <li>Khả năng chịu nhiệt (-10°C đến 60°C)</li>
        <li>Độ dày đồng đều</li>
        <li>Không chứa chất độc hại</li>
      </ul>

      <h3>Bảo quản đúng cách</h3>
      <p>Để băng dính giữ được chất lượng tốt nhất:</p>
      <ul>
        <li>Bảo quản ở nơi khô ráo, tránh ánh nắng trực tiếp</li>
        <li>Nhiệt độ lý tưởng: 15-25°C</li>
        <li>Độ ẩm: 40-60%</li>
        <li>Để cuộn băng dính ở vị trí đứng</li>
        <li>Sử dụng trong vòng 12 tháng kể từ ngày sản xuất</li>
      </ul>

      <p><strong>Liên hệ với chúng tôi để được tư vấn chi tiết về từng loại băng dính phù hợp với nhu cầu của bạn!</strong></p>
    `,
  },
  {
    id: 4,
    title: 'Màng PE - Giải pháp bao bì hiện đại',
    date: '02/01/2023',
    views: 62,
    image: mangPEImg,
    category: 'Sản phẩm',
    author: 'Admin',
    excerpt: 'Màng PE là giải pháp bao bì hiện đại, an toàn và tiết kiệm chi phí. Khám phá ưu điểm và ứng dụng của màng PE trong ngành công nghiệp.',
    content: `
      <h2>Màng PE - Giải pháp bao bì hiện đại</h2>
      <p>Màng PE (Polyethylene) đang ngày càng trở thành lựa chọn hàng đầu trong ngành bao bì nhờ tính năng vượt trội và giá thành hợp lý. Hãy cùng tìm hiểu chi tiết về sản phẩm này.</p>

      <h3>Màng PE là gì?</h3>
      <p>Màng PE là loại màng nhựa được sản xuất từ nhựa polyethylene - một loại polymer tổng hợp có nguồn gốc từ dầu mỏ. Với tính chất đặc biệt, màng PE được ứng dụng rộng rãi trong nhiều lĩnh vực khác nhau.</p>

      <h3>Phân loại màng PE</h3>
      
      <h4>1. Màng PE theo mật độ</h4>
      <ul>
        <li><strong>LDPE (Low Density PE):</strong> Màng PE mật độ thấp
          <ul>
            <li>Mềm, dẻo, trong suốt</li>
            <li>Dễ gia công, giá thành thấp</li>
            <li>Dùng cho túi nilon, túi đựng thực phẩm</li>
          </ul>
        </li>
        <li><strong>LLDPE (Linear Low Density PE):</strong> Màng PE mật độ thấp tuyến tính
          <ul>
            <li>Độ bền kéo cao hơn LDPE</li>
            <li>Chống thủng tốt</li>
            <li>Dùng cho màng quấn pallet, túi rác công nghiệp</li>
          </ul>
        </li>
        <li><strong>HDPE (High Density PE):</strong> Màng PE mật độ cao
          <ul>
            <li>Cứng, bền, độ bóng cao</li>
            <li>Chịu nhiệt tốt</li>
            <li>Dùng cho túi siêu thị, bao bì công nghiệp</li>
          </ul>
        </li>
      </ul>

      <h4>2. Màng PE theo công dụng</h4>
      <ul>
        <li><strong>Màng PE cuộn:</strong> Dạng cuộn lớn, dùng trong sản xuất công nghiệp</li>
        <li><strong>Màng PE túi:</strong> Đã được cắt sẵn thành túi, tiện sử dụng</li>
        <li><strong>Màng PE co:</strong> Co lại khi nung nóng, dùng bọc sản phẩm</li>
        <li><strong>Màng PE thổi:</strong> Sản xuất bằng phương pháp thổi, độ bền cao</li>
        <li><strong>Màng PE đùn:</strong> Sản xuất bằng phương pháp đùn, bề mặt phẳng</li>
      </ul>

      <h3>Ưu điểm của màng PE</h3>
      <ul>
        <li>✅ <strong>An toàn:</strong> Không độc hại, đạt tiêu chuẩn FDA cho thực phẩm</li>
        <li>✅ <strong>Chống thấm nước:</strong> Bảo vệ hàng hóa khỏi độ ẩm</li>
        <li>✅ <strong>Chống bụi:</strong> Giữ sản phẩm luôn sạch sẽ</li>
        <li>✅ <strong>Độ bền cao:</strong> Chịu lực kéo tốt, khó rách</li>
        <li>✅ <strong>Trong suốt:</strong> Dễ dàng quan sát sản phẩm bên trong</li>
        <li>✅ <strong>Giá thành thấp:</strong> Tiết kiệm chi phí bao bì</li>
        <li>✅ <strong>Dễ gia công:</strong> Có thể in ấn, cắt theo yêu cầu</li>
        <li>✅ <strong>Tái chế được:</strong> Thân thiện với môi trường</li>
      </ul>

      <h3>Ứng dụng của màng PE</h3>
      
      <h4>Trong ngành thực phẩm</h4>
      <ul>
        <li>Bao bì đựng thực phẩm khô</li>
        <li>Túi đựng rau củ quả tươi</li>
        <li>Màng bọc thực phẩm</li>
        <li>Túi đựng đá</li>
      </ul>

      <h4>Trong công nghiệp</h4>
      <ul>
        <li>Màng quấn pallet bảo vệ hàng hóa</li>
        <li>Bao bì đóng gói sản phẩm</li>
        <li>Màng phủ nông nghiệp</li>
        <li>Túi rác công nghiệp</li>
      </ul>

      <h4>Trong đời sống</h4>
      <ul>
        <li>Túi nilon đi chợ</li>
        <li>Túi đựng quần áo</li>
        <li>Túi rác sinh hoạt</li>
        <li>Bao bì đựng đồ dùng</li>
      </ul>

      <h3>Quy cách sản phẩm</h3>
      <table border="1" cellpadding="10" style="width:100%; border-collapse: collapse;">
        <tr>
          <th>Loại</th>
          <th>Độ dày</th>
          <th>Kích thước</th>
          <th>Màu sắc</th>
        </tr>
        <tr>
          <td>Màng PE cuộn</td>
          <td>20-200 micron</td>
          <td>Theo yêu cầu</td>
          <td>Trong, trắng sữa, màu</td>
        </tr>
        <tr>
          <td>Màng PE túi</td>
          <td>30-100 micron</td>
          <td>20x30 đến 100x150 cm</td>
          <td>Trong, màu</td>
        </tr>
        <tr>
          <td>Màng PE co</td>
          <td>15-50 micron</td>
          <td>Theo yêu cầu</td>
          <td>Trong</td>
        </tr>
      </table>

      <h3>Tiêu chuẩn chất lượng</h3>
      <p>Màng PE của chúng tôi đáp ứng các tiêu chuẩn:</p>
      <ul>
        <li>✓ Tiêu chuẩn Việt Nam: TCVN</li>
        <li>✓ Tiêu chuẩn FDA (Mỹ) cho sản phẩm tiếp xúc thực phẩm</li>
        <li>✓ Tiêu chuẩn ISO về quản lý chất lượng</li>
        <li>✓ Không chứa chất độc hại, an toàn cho sức khỏe</li>
      </ul>

      <h3>Dịch vụ của chúng tôi</h3>
      <ul>
        <li>🎯 Tư vấn chọn loại màng PE phù hợp</li>
        <li>🎯 Sản xuất theo yêu cầu (kích thước, độ dày, màu sắc)</li>
        <li>🎯 In ấn logo, thông tin sản phẩm lên màng PE</li>
        <li>🎯 Giao hàng toàn quốc</li>
        <li>🎯 Giá cả cạnh tranh, chiết khấu cao cho số lượng lớn</li>
      </ul>

      <h3>Bảng giá tham khảo</h3>
      <p><em>(Giá có thể thay đổi tùy theo số lượng và yêu cầu cụ thể)</em></p>
      <ul>
        <li>Màng PE cuộn 50cm x 100m: <strong>150,000 - 300,000 VNĐ/cuộn</strong></li>
        <li>Túi PE 30x40cm: <strong>80,000 - 150,000 VNĐ/kg</strong></li>
        <li>Màng PE co: <strong>200,000 - 400,000 VNĐ/kg</strong></li>
      </ul>

      <h3>Cam kết của chúng tôi</h3>
      <p>✔️ Sản phẩm chính hãng, nguồn gốc rõ ràng<br/>
      ✔️ Chất lượng đồng đều, ổn định<br/>
      ✔️ Giao hàng đúng hẹn<br/>
      ✔️ Hỗ trợ đổi trả nếu có lỗi từ nhà sản xuất<br/>
      ✔️ Tư vấn miễn phí 24/7</p>

      <p><strong>Liên hệ ngay: 0947.900.666 hoặc email: thanglongtape@gmail.com để nhận báo giá chi tiết và tư vấn chuyên nghiệp!</strong></p>
    `,
  },
  {
    id: 5,
    title: 'Xốp hơi - Giải pháp bảo vệ hàng hóa tối ưu',
    date: '15/03/2023',
    views: 73,
    image: xopHoiImg,
    category: 'Sản phẩm',
    author: 'Admin',
    excerpt: 'Xốp hơi là vật liệu bảo vệ hàng hóa hiệu quả, được ưa chuộng trong vận chuyển và đóng gói. Tìm hiểu ưu điểm và cách sử dụng xốp hơi đúng cách.',
    content: `
      <h2>Xốp hơi - Giải pháp bảo vệ hàng hóa tối ưu</h2>
      <p>Xốp hơi (còn gọi là màng xốp hơi, bong bóng khí) là vật liệu đóng gói được sử dụng rộng rãi để bảo vệ sản phẩm trong quá trình vận chuyển và bảo quản. Với cấu tạo đặc biệt, xốp hơi mang lại hiệu quả bảo vệ vượt trội.</p>

      <h3>Cấu tạo xốp hơi</h3>
      <p>Xốp hơi được làm từ nhựa polyethylene (PE) với cấu trúc đặc biệt:</p>
      <ul>
        <li><strong>Lớp màng ngoài:</strong> Làm từ nhựa PE có độ dày 25-150 micron</li>
        <li><strong>Bóng khí:</strong> Các túi khí được phân bố đều đặn</li>
        <li><strong>Kích thước bóng:</strong> Thường có đường kính 6mm, 10mm, 25mm, 30mm</li>
      </ul>

      <h3>Phân loại xốp hơi</h3>
      
      <h4>1. Theo kích thước bóng khí</h4>
      <ul>
        <li><strong>Xốp hơi bóng nhỏ (6-10mm):</strong>
          <ul>
            <li>Dùng cho đồ điện tử, đồ trang sức</li>
            <li>Bảo vệ vật phẩm nhỏ, tinh tế</li>
            <li>Ít chiếm diện tích</li>
          </ul>
        </li>
        <li><strong>Xốp hơi bóng lớn (25-30mm):</strong>
          <ul>
            <li>Dùng cho đồ nội thất, đồ gia dụng lớn</li>
            <li>Chống sốc tốt hơn</li>
            <li>Tiết kiệm chi phí cho hàng hóa lớn</li>
          </ul>
        </li>
      </ul>

      <h4>2. Theo màu sắc</h4>
      <ul>
        <li><strong>Xốp hơi trong suốt:</strong> Phổ biến nhất, dễ kiểm tra hàng hóa</li>
        <li><strong>Xốp hơi màu:</strong> Hồng, xanh, đỏ - phân biệt loại hàng</li>
        <li><strong>Xốp hơi chống tĩnh điện:</strong> Màu hồng - dùng cho linh kiện điện tử</li>
      </ul>

      <h3>Ưu điểm vượt trội</h3>
      <ul>
        <li>✅ <strong>Chống sốc hiệu quả:</strong> Lớp khí đệm bảo vệ hàng hóa khỏi va đập</li>
        <li>✅ <strong>Chống ẩm:</strong> Không thấm nước, bảo vệ khỏi độ ẩm</li>
        <li>✅ <strong>Nhẹ:</strong> Không làm tăng trọng lượng hàng hóa</li>
        <li>✅ <strong>Linh hoạt:</strong> Dễ dàng cắt, gấp theo hình dạng sản phẩm</li>
        <li>✅ <strong>Tái sử dụng:</strong> Có thể dùng nhiều lần nếu còn nguyên vẹn</li>
        <li>✅ <strong>Giá thành hợp lý:</strong> Tiết kiệm chi phí đóng gói</li>
      </ul>

      <h3>Ứng dụng trong thực tế</h3>
      
      <h4>Vận chuyển hàng hóa</h4>
      <ul>
        <li>Đóng gói điện thoại, máy tính bảng</li>
        <li>Bảo vệ đồ điện tử, linh kiện máy tính</li>
        <li>Gói đồ gốm sứ, thủy tinh</li>
        <li>Bọc đồ nội thất khi chuyển nhà</li>
      </ul>

      <h4>Bảo quản sản phẩm</h4>
      <ul>
        <li>Lưu kho đồ điện tử</li>
        <li>Bảo quản đồ trang trí dễ vỡ</li>
        <li>Gói quà tặng cao cấp</li>
      </ul>

      <h3>Hướng dẫn sử dụng</h3>
      
      <h4>Bước 1: Chuẩn bị</h4>
      <p>Đo kích thước sản phẩm cần đóng gói và cắt xốp hơi phù hợp (dư khoảng 5-10cm mỗi bên).</p>

      <h4>Bước 2: Bọc sản phẩm</h4>
      <ul>
        <li>Đặt sản phẩm vào giữa tấm xốp hơi</li>
        <li>Bọc chồng ít nhất 2-3 lớp cho hàng dễ vỡ</li>
        <li>Mặt bóng khí hướng vào trong (tiếp xúc với sản phẩm)</li>
      </ul>

      <h4>Bước 3: Cố định</h4>
      <p>Dùng băng dính trong hoặc băng keo giấy để cố định xốp hơi.</p>

      <h4>Bước 4: Đóng thùng</h4>
      <p>Đặt sản phẩm đã bọc vào thùng carton, lót thêm xốp hơi ở các góc trống.</p>

      <h3>Lưu ý khi sử dụng</h3>
      <ul>
        <li>⚠️ Không để xốp hơi tiếp xúc trực tiếp với nguồn nhiệt</li>
        <li>⚠️ Tránh để xốp hơi dưới ánh nắng mặt trời lâu ngày</li>
        <li>⚠️ Với đồ điện tử, nên dùng xốp hơi chống tĩnh điện</li>
        <li>⚠️ Kiểm tra xốp hơi trước khi sử dụng, đảm bảo không bị thủng</li>
      </ul>

      <h3>Quy cách sản phẩm</h3>
      <table border="1" cellpadding="10" style="width:100%; border-collapse: collapse;">
        <tr>
          <th>Loại</th>
          <th>Kích thước bóng</th>
          <th>Kích thước cuộn</th>
          <th>Ứng dụng</th>
        </tr>
        <tr>
          <td>Xốp hơi bóng nhỏ</td>
          <td>6-10mm</td>
          <td>1.2m x 100m</td>
          <td>Điện tử, trang sức</td>
        </tr>
        <tr>
          <td>Xốp hơi bóng trung</td>
          <td>15-20mm</td>
          <td>1.2m x 100m</td>
          <td>Đồ dùng văn phòng</td>
        </tr>
        <tr>
          <td>Xốp hơi bóng lớn</td>
          <td>25-30mm</td>
          <td>1.2m x 100m</td>
          <td>Nội thất, đồ gia dụng</td>
        </tr>
      </table>

      <h3>Bảng giá tham khảo</h3>
      <ul>
        <li>Xốp hơi bóng nhỏ 1.2m x 100m: <strong>450,000 - 650,000 VNĐ/cuộn</strong></li>
        <li>Xốp hơi bóng lớn 1.2m x 100m: <strong>350,000 - 550,000 VNĐ/cuộn</strong></li>
        <li>Xốp hơi chống tĩnh điện: <strong>600,000 - 800,000 VNĐ/cuộn</strong></li>
      </ul>

      <h3>Cam kết của chúng tôi</h3>
      <p>✔️ Sản phẩm chất lượng cao, bóng khí đều đặn<br/>
      ✔️ Độ dày màng đạt chuẩn, không bị thủng dễ dàng<br/>
      ✔️ Giá cả cạnh tranh, chiết khấu cao cho số lượng lớn<br/>
      ✔️ Giao hàng nhanh chóng toàn quốc<br/>
      ✔️ Hỗ trợ tư vấn miễn phí 24/7</p>

      <p><strong>Liên hệ hotline: 0947.900.666 để được tư vấn và báo giá chi tiết!</strong></p>
    `,
  },
  {
    id: 6,
    title: 'So sánh băng dính OPP và băng dính giấy kraft',
    date: '20/04/2023',
    views: 65,
    image: soSanhOppKraftImg,
    category: 'Kiến thức',
    author: 'Admin',
    excerpt: 'Băng dính OPP và băng dính giấy kraft là hai loại băng dính phổ biến nhất. Cùng tìm hiểu sự khác biệt và ứng dụng của từng loại để lựa chọn phù hợp.',
    content: `
      <h2>So sánh băng dính OPP và băng dính giấy kraft</h2>
      <p>Băng dính OPP và băng dính giấy kraft là hai loại băng dính được sử dụng rộng rãi nhất hiện nay. Mỗi loại có những ưu điểm riêng, phù hợp với từng mục đích sử dụng khác nhau.</p>

      <h3>Băng dính OPP là gì?</h3>
      <p>Băng dính OPP (Oriented Polypropylene) là loại băng dính có lớp nền làm từ nhựa polypropylene được định hướng hai chiều, tạo độ bền và độ trong suốt cao.</p>

      <h4>Đặc điểm nổi bật của băng dính OPP</h4>
      <ul>
        <li><strong>Độ trong suốt cao:</strong> Dễ dàng quan sát nội dung bên trong</li>
        <li><strong>Độ bền tốt:</strong> Chịu được lực kéo và va đập</li>
        <li><strong>Chống thấm nước:</strong> Không bị ảnh hưởng bởi độ ẩm</li>
        <li><strong>Tiếng ồn khi xé:</strong> Phát ra tiếng kêu lớn</li>
        <li><strong>Giá thành:</strong> Trung bình đến cao</li>
      </ul>

      <h4>Ứng dụng của băng dính OPP</h4>
      <ul>
        <li>Đóng thùng carton hàng hóa</li>
        <li>Niêm phong bao bì</li>
        <li>Dán nhãn, tem</li>
        <li>Bao bì sản phẩm thương mại</li>
      </ul>

      <h3>Băng dính giấy kraft là gì?</h3>
      <p>Băng dính giấy kraft có lớp nền làm từ giấy kraft tự nhiên, thân thiện môi trường và có khả năng phân hủy sinh học.</p>

      <h4>Đặc điểm nổi bật của băng dính giấy kraft</h4>
      <ul>
        <li><strong>Thân thiện môi trường:</strong> Có thể phân hủy hoàn toàn</li>
        <li><strong>Dễ viết, in ấn:</strong> Bề mặt giấy dễ dàng viết chú thích</li>
        <li><strong>Dễ xé bằng tay:</strong> Không cần dụng cụ hỗ trợ</li>
        <li><strong>Màu sắc:</strong> Thường có màu nâu tự nhiên hoặc trắng</li>
        <li><strong>Giá thành:</strong> Thấp đến trung bình</li>
      </ul>

      <h4>Ứng dụng của băng dính giấy kraft</h4>
      <ul>
        <li>Đóng gói hàng hóa thân thiện môi trường</li>
        <li>Dán nhãn, ghi chú trên bao bì</li>
        <li>Nghệ thuật, thủ công</li>
        <li>Bao bì quà tặng, đồ handmade</li>
      </ul>

      <h3>Bảng so sánh chi tiết</h3>
      <table border="1" cellpadding="10" style="width:100%; border-collapse: collapse;">
        <tr>
          <th>Tiêu chí</th>
          <th>Băng dính OPP</th>
          <th>Băng dính giấy kraft</th>
        </tr>
        <tr>
          <td>Chất liệu</td>
          <td>Nhựa polypropylene</td>
          <td>Giấy kraft tự nhiên</td>
        </tr>
        <tr>
          <td>Độ bền</td>
          <td>Cao, chịu lực tốt</td>
          <td>Trung bình</td>
        </tr>
        <tr>
          <td>Chống nước</td>
          <td>Rất tốt</td>
          <td>Kém, dễ bị ướt</td>
        </tr>
        <tr>
          <td>Độ trong suốt</td>
          <td>Trong suốt hoặc màu</td>
          <td>Mờ đục, màu nâu/trắng</td>
        </tr>
        <tr>
          <td>Dễ xé</td>
          <td>Cần dụng cụ</td>
          <td>Xé bằng tay dễ dàng</td>
        </tr>
        <tr>
          <td>Viết chú thích</td>
          <td>Khó viết</td>
          <td>Dễ viết, in ấn</td>
        </tr>
        <tr>
          <td>Môi trường</td>
          <td>Khó phân hủy</td>
          <td>Phân hủy sinh học</td>
        </tr>
        <tr>
          <td>Giá thành</td>
          <td>Trung bình - Cao</td>
          <td>Thấp - Trung bình</td>
        </tr>
        <tr>
          <td>Tiếng ồn</td>
          <td>Lớn khi xé</td>
          <td>Nhỏ, êm</td>
        </tr>
      </table>

      <h3>Nên chọn loại nào?</h3>
      
      <h4>Chọn băng dính OPP khi:</h4>
      <ul>
        <li>✅ Cần độ bền cao cho hàng hóa nặng</li>
        <li>✅ Vận chuyển đường dài hoặc xuất khẩu</li>
        <li>✅ Môi trường ẩm ướt, mưa</li>
        <li>✅ Cần quan sát nội dung bên trong</li>
        <li>✅ Niêm phong chống giả</li>
      </ul>

      <h4>Chọn băng dính giấy kraft khi:</h4>
      <ul>
        <li>✅ Ưu tiên thân thiện môi trường</li>
        <li>✅ Cần viết, ghi chú trên băng dính</li>
        <li>✅ Đóng gói sản phẩm organic, handmade</li>
        <li>✅ Tạo phong cách tự nhiên, vintage</li>
        <li>✅ Tiết kiệm chi phí</li>
      </ul>

      <h3>Xu hướng sử dụng hiện nay</h3>
      <p>Theo khảo sát thị trường, có sự chuyển dịch rõ rệt trong việc sử dụng băng dính:</p>
      <ul>
        <li>📈 <strong>Băng dính OPP:</strong> Vẫn chiếm ưu thế trong công nghiệp và logistics (65%)</li>
        <li>📈 <strong>Băng dính giấy kraft:</strong> Tăng trưởng mạnh trong lĩnh vực bán lẻ, thương mại điện tử (tăng 45% năm 2023)</li>
        <li>📈 <strong>Xu hướng xanh:</strong> Ngày càng nhiều doanh nghiệp chuyển sang băng dính giấy kraft để thể hiện trách nhiệm với môi trường</li>
      </ul>

      <h3>Lời khuyên từ chuyên gia</h3>
      <blockquote style="border-left: 4px solid #dc2626; padding-left: 1rem; font-style: italic;">
        "Không có loại băng dính nào là tốt nhất cho mọi trường hợp. Hãy cân nhắc giữa độ bền, thân thiện môi trường và chi phí để lựa chọn phù hợp với nhu cầu cụ thể của bạn. Trong nhiều trường hợp, kết hợp cả hai loại sẽ mang lại hiệu quả tối ưu."
      </blockquote>

      <h3>Giải pháp kết hợp</h3>
      <p>Nhiều doanh nghiệp hiện nay áp dụng giải pháp kết hợp:</p>
      <ul>
        <li><strong>Lớp trong:</strong> Băng dính giấy kraft (ghi chú, thân thiện môi trường)</li>
        <li><strong>Lớp ngoài:</strong> Băng dính OPP (bảo vệ, chống nước)</li>
        <li><strong>Kết quả:</strong> Vừa đảm bảo độ bền vừa thể hiện trách nhiệm môi trường</li>
      </ul>

      <h3>Bảng giá tham khảo</h3>
      <ul>
        <li>Băng dính OPP 48mm x 100Y: <strong>15,000 - 25,000 VNĐ/cuộn</strong></li>
        <li>Băng dính giấy kraft 48mm x 50m: <strong>12,000 - 18,000 VNĐ/cuộn</strong></li>
        <li>Băng dính giấy kraft in logo: <strong>Liên hệ báo giá</strong></li>
      </ul>

      <h3>Cam kết chất lượng</h3>
      <p>Chúng tôi cung cấp cả hai loại băng dính với chất lượng đảm bảo:</p>
      <ul>
        <li>✔️ Băng dính OPP: Độ dính đạt chuẩn, không bong tróc</li>
        <li>✔️ Băng dính giấy kraft: 100% giấy kraft tự nhiên, keo acrylic an toàn</li>
        <li>✔️ Hỗ trợ tư vấn chọn loại phù hợp</li>
        <li>✔️ Giao hàng nhanh chóng, giá cả cạnh tranh</li>
      </ul>

      <p><strong>Liên hệ ngay: 0947.900.666 hoặc email: thanglongtape@gmail.com để được tư vấn chi tiết và nhận mẫu thử miễn phí!</strong></p>
    `,
  },
];

export const getNewsById = (id: number): NewsArticle | undefined => {
  return newsArticles.find((article) => article.id === id);
};

export const getRelatedNews = (currentId: number, limit: number = 3): NewsArticle[] => {
  return newsArticles.filter((article) => article.id !== currentId).slice(0, limit);
};
