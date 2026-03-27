import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './contexts/CartContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Client Pages
import {
  HomePage,
  ProductsPage,
  ProductDetailPage,
  AboutPage,
  ConsultingPage,
  NewsPage,
  NewsDetailPage,
  ContactPage,
  ProfilePage,
  CartPage,
  OrderSuccessPage,
  OrderHistoryPage,
  PaymentFailedPage,
} from './pages/client';
import InvoicePage from './pages/client/InvoicePage';

// Admin Pages
import {
  AdminDashboard,
  AdminProductsPage,
  AdminCustomersPage,
  AdminCategoriesPage,
  AdminOrdersPage,
  AdminReportsPage,
  AdminPaymentsPage,
  AdminSettingsPage,
  AdminEmployeesPage,
} from './pages/admin';

// Sales Staff Pages
import {
  SalesStaffDashboard,
  SalesStaffCustomersPage,
  SalesStaffOrdersPage,
  SalesStaffPaymentsPage,
} from './pages/staff';

function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <Router>
        <Routes>
          {/* Admin Routes - Không có Header/Footer */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/employees" element={<AdminEmployeesPage />} />

          {/* Sales Staff Routes - Không có Header/Footer */}
          <Route path="/staff/dashboard" element={<SalesStaffDashboard />} />
          <Route path="/staff/customers" element={<SalesStaffCustomersPage />} />
          <Route path="/staff/orders" element={<SalesStaffOrdersPage />} />
          <Route path="/staff/payments" element={<SalesStaffPaymentsPage />} />

          {/* Customer Routes - Có Header/Footer */}
          <Route path="/*" element={
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
                  <Route path="/hoa-don/:orderId" element={<InvoicePage />} />
                  <Route path="/don-hang/failed" element={<PaymentFailedPage />} />
                  <Route path="/lich-su-don-hang" element={<OrderHistoryPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
          toastStyle={{
            backgroundColor: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px'
          }}
        />
      </Router>
    </CartProvider>
    </SettingsProvider>
  );
}

export default App;
