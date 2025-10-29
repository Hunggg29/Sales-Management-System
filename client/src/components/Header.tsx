import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingCart, MdSearch, MdKeyboardArrowDown, MdMenu, MdClose, MdLogin, MdPersonAdd } from 'react-icons/md';
import AuthModal from './AuthModal';
import logo from '../assets/images/logo.jpg';
import logo2 from '../assets/images/logo2.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Đo chiều cao của cả header (top bar + navigation bar) khi component mount
  useEffect(() => {
    const measureHeader = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.clientHeight);
      }
    };
    
    measureHeader();
    // Đo lại khi window resize
    window.addEventListener('resize', measureHeader);
    return () => window.removeEventListener('resize', measureHeader);
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          
          // Khi scroll xuống qua cạnh dưới của navigation bar (cả header)
          if (scrollPosition >= headerHeight) {
            setIsScrolled(true);
          }
          // Khi scroll lên tới cạnh trên của navigation bar (top bar) với buffer nhỏ
          else if (scrollPosition < 10) {
            setIsScrolled(false);
          }
          // Giữ nguyên trạng thái khi đang ở giữa
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerHeight]);

  const navigationItems = [
    { title: 'TRANG CHỦ', path: '/', hasDropdown: false },
    { title: 'GIỚI THIỆU', path: '/gioi-thieu', hasDropdown: true },
    { title: 'SẢN PHẨM', path: '/san-pham', hasDropdown: true },
    { title: 'TƯ VẤN', path: '/tu-van', hasDropdown: true },
    { title: 'TIN TỨC', path: '/tin-tuc', hasDropdown: true },
    { title: 'THƯ VIỆN', path: '/thu-vien', hasDropdown: true },
    { title: 'LIÊN HỆ', path: '/lien-he', hasDropdown: false },
  ];

  return (
    <>
      <header className={`w-full ${isScrolled ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}`}>
        {/* Top Bar with Logo and Auth - Hidden when scrolled */}
        <div
          className={`top-bar-section bg-white border-b border-gray-300 w-full transition-all duration-300 ease-in-out ${
            isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
          }`}
        >
          <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left Side */}
            <div className="flex items-center gap-4">
              <div className="w-70">
                <Link to="/" className="block">
                  <img 
                    src={logo}
                    alt="Logo" 
                    className="h-35 w-full object-contain"
                  />
                </Link>
              </div>
              
              {/* Logo 2 - Slogan */}
              <div className="hidden md:block">
                <img 
                  src={logo2}
                  alt="Slogan" 
                  className="h-36 object-contain"
                />
              </div>
            </div>

            {/* Right Side - Cart, Wishlist, Sign In/Up */}
            <div className="flex items-center gap-4">
              {/* Cart Icon with Badge */}
              <Link 
                to="/gio-hang"
                className="relative flex flex-col items-center hover:scale-110 transition-all duration-200 hover:drop-shadow-lg group cursor-pointer"
              >
                <div className="relative">
                  <MdShoppingCart className="w-8 h-8 text-gray-700 group-hover:text-red-600 transition-colors" />
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    0
                  </span>
                </div>
              </Link>

              {/* Sign In Button */}
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold text-base hover:bg-red-700 hover:scale-105 hover:shadow-xl transition-all duration-200 whitespace-nowrap hover:cursor-pointer"
              >
                <MdLogin className="w-5 h-5 transition-transform group-hover:rotate-12" />
                Đăng nhập
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold text-base hover:bg-red-700 hover:scale-105 hover:shadow-xl transition-all duration-200 whitespace-nowrap hover:cursor-pointer"
              >
                <MdPersonAdd className="w-5 h-5 transition-transform group-hover:rotate-12 " />
                Đăng ký
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
              >
                {isMenuOpen ? (
                  <MdClose className="w-6 h-6 text-gray-700 hover:text-red-600 transition-colors" />
                ) : (
                  <MdMenu className="w-6 h-6 text-gray-700 hover:text-red-600 transition-colors" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar  */}
      <nav className="bg-red-600 w-full transition-all duration-300 shadow-2xl">
        <div className="w-full px-6">
          <div className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0">
              {navigationItems.map((item) => (
                <div
                  key={item.path}
                  className="relative group"
                >
                  <Link
                    to={item.path}
                    className="flex items-center gap-1 px-6 py-4 text-white font-bold text-base uppercase hover:bg-red-700 transition-all duration-200 whitespace-nowrap relative group"
                  >
                    <span className="relative z-10">{item.title}</span>
                    {item.hasDropdown && (
                      <MdKeyboardArrowDown className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg min-w-[200px] rounded-b-md z-50">
                      <div className="py-2">
                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium">
                          Danh mục 1
                        </a>
                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium">
                          Danh mục 2
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Search Box */}
            <div className="hidden lg:flex ml-auto">
              {isScrolled ? (
                // Compact search icon when scrolled
                <button
                  className="bg-white p-3 rounded-sm hover:bg-gray-100 hover:scale-110 hover:shadow-lg transition-all duration-200"
                  onClick={() => {
                    // Toggle search or open search modal
                  }}
                >
                  <MdSearch className="w-6 h-6 text-orange-500 hover:rotate-90 transition-transform duration-300" />
                </button>
              ) : (
                // Full search box when not scrolled
                <div className="flex items-center bg-white rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Từ khóa..."
                    className="px-4 py-3 w-80 outline-none text-base text-gray-500 focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                  <button className="bg-orange-500 px-5 py-3 hover:bg-orange-600 hover:scale-105 transition-all duration-200 group">
                    <MdSearch className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-red-700 rounded-lg transition-all duration-200 text-white hover:scale-110 hover:rotate-90"
            >
              {isMenuOpen ? (
                <MdClose className="w-6 h-6 transition-transform duration-200" />
              ) : (
                <MdMenu className="w-6 h-6 transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isMenuOpen ? 'auto' : 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="py-4 space-y-2 bg-red-700">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-2 text-white font-bold text-sm uppercase hover:bg-red-800 hover:translate-x-2 transition-all duration-200 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              {/* Mobile Search */}
              <div className="px-4 pt-2 pb-4">
                <div className="flex items-center bg-white rounded-md overflow-hidden shadow-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Từ khóa..."
                    className="px-4 py-2 flex-1 outline-none text-sm text-gray-500 focus:ring-2 focus:ring-red-500 transition-all"
                  />
                  <button className="bg-red-500 p-3 hover:bg-red-600 hover:scale-105 transition-all duration-200 group">
                    <MdSearch className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>
              {/* Mobile Auth Buttons */}
              <div className="px-4 pb-2 flex gap-2">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 rounded hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200 font-semibold text-sm"
                >
                  <MdLogin className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 rounded hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200 font-semibold text-sm"
                >
                  <MdPersonAdd className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
      
    {/* Placeholder để giữ vị trí khi header fixed */}
    {isScrolled && <div style={{ height: `${headerHeight}px` }} />}

    {/* Auth Modal */}
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      mode={authMode}
      onSwitchMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
    />
    </>
  );
};

export default Header;
