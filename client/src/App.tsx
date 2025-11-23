import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ConsultingPage from './pages/ConsultingPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/san-pham" element={<ProductsPage />} />
              <Route path="/san-pham/:id" element={<ProductDetailPage />} />
              <Route path="/gioi-thieu" element={<AboutPage />} />
              <Route path="/tu-van" element={<ConsultingPage />} />
              <Route path="/chinh-sach" element={<HomePage />} />
              <Route path="/tin-tuc" element={<NewsPage />} />
              <Route path="/tin-tuc/:id" element={<NewsDetailPage />} />
              <Route path="/lien-he" element={<ContactPage />} />
              <Route path="/ho-so" element={<ProfilePage />} />
              <Route path="/gio-hang" element={<CartPage />} />
              <Route path="/don-hang/:orderId" element={<OrderSuccessPage />} />
              <Route path="/don-hang/failed" element={<PaymentFailedPage />} />
              <Route path="/lich-su-don-hang" element={<OrderHistoryPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </CartProvider>
  );
}

export default App;
