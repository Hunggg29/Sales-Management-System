import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gioi-thieu" element={<HomePage />} />
            <Route path="/san-pham" element={<HomePage />} />
            <Route path="/chinh-sach" element={<HomePage />} />
            <Route path="/tin-tuc" element={<HomePage />} />
            <Route path="/thu-vien" element={<HomePage />} />
            <Route path="/lien-he" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
