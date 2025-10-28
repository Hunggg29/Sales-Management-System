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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { title: 'TRANG CHỦ', path: '/', hasDropdown: false },
    { title: 'GIỚI THIỆU', path: '/gioi-thieu', hasDropdown: true },
    { title: 'SẢN PHẨM', path: '/san-pham', hasDropdown: true },
    { title: 'CHÍNH SÁCH BÁN HÀNG', path: '/chinh-sach', hasDropdown: true },
    { title: 'TIN TỨC', path: '/tin-tuc', hasDropdown: true },
    { title: 'THƯ VIỆN', path: '/thu-vien', hasDropdown: true },
    { title: 'LIÊN HỆ', path: '/lien-he', hasDropdown: false },
  ];

  return (
    <header className="w-full">
      {/* Top Bar with Logo and Auth - Hidden when scrolled */}
      <motion.div
        initial={{ height: 'auto' }}
        animate={{ 
          height: isScrolled ? 0 : 'auto',
          opacity: isScrolled ? 0 : 1 
        }}
        transition={{ duration: 0.3 }}
        className="bg-white border-b border-gray-300 w-full overflow-hidden"
      >
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left Side */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-70"
              >
                <Link to="/" className="block">
                  <img 
                    src={logo}
                    alt="Logo" 
                    className="h-35 w-full object-contain"
                  />
                </Link>
              </motion.div>
              
              {/* Logo 2 - Slogan */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:block"
              >
                <img 
                  src={logo2}
                  alt="Slogan" 
                  className="h-32 object-contain"
                />
              </motion.div>
            </div>

            {/* Right Side - Cart, Wishlist, Sign In/Up */}
            <div className="flex items-center gap-4">
              {/* Cart Icon with Badge */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center"
              >
                <div className="relative">
                  <MdShoppingCart className="w-8 h-8 text-gray-700" />
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    0
                  </span>
                </div>
              </motion.button>

              {/* Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold text-base hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <MdLogin className="w-5 h-5" />
                Đăng nhập
              </motion.button>

              {/* Sign Up Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold text-base hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <MdPersonAdd className="w-5 h-5" />
                Đăng ký
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? (
                  <MdClose className="w-6 h-6 text-gray-700" />
                ) : (
                  <MdMenu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Bar - Sticky when scrolled */}
      <nav className={`bg-red-600 w-full transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : ''}`}>
        <div className="w-full px-6">
          <div className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative group"
                >
                  <Link
                    to={item.path}
                    className="flex items-center gap-1 px-6 py-4 text-white font-bold text-base uppercase hover:bg-red-700 transition-colors whitespace-nowrap"
                  >
                    {item.title}
                    {item.hasDropdown && (
                      <MdKeyboardArrowDown className="w-5 h-5" />
                    )}
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
                </motion.div>
              ))}
            </div>

            {/* Search Box */}
            <div className="hidden lg:flex ml-auto">
              {isScrolled ? (
                // Compact search icon when scrolled
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-3 rounded-sm hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    // Toggle search or open search modal
                  }}
                >
                  <MdSearch className="w-6 h-6 text-orange-500" />
                </motion.button>
              ) : (
                // Full search box when not scrolled
                <div className="flex items-center bg-white rounded-sm overflow-hidden">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Từ khóa..."
                    className="px-4 py-3 w-80 outline-none text-base text-gray-500"
                  />
                  <button className="bg-orange-500 px-5 py-3 hover:bg-orange-600 transition-colors">
                    <MdSearch className="w-6 h-6 text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-red-700 rounded-lg transition-colors text-white"
            >
              {isMenuOpen ? (
                <MdClose className="w-6 h-6" />
              ) : (
                <MdMenu className="w-6 h-6" />
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
                  className="block px-4 py-2 text-white font-bold text-sm uppercase hover:bg-red-800 transition-colors rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              {/* Mobile Search */}
              <div className="px-4 pt-2 pb-4">
                <div className="flex items-center bg-white rounded-md overflow-hidden">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Từ khóa..."
                    className="px-4 py-2 flex-1 outline-none text-sm text-gray-500"
                  />
                  <button className="bg-red-500 p-3 hover:bg-red-600">
                    <MdSearch className="w-5 h-5 text-white" />
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 rounded hover:bg-gray-100 transition-colors font-semibold text-sm"
                >
                  <MdLogin className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 rounded hover:bg-gray-100 transition-colors font-semibold text-sm"
                >
                  <MdPersonAdd className="w-4 h-4" />
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
      />
    </header>
  );
};

export default Header;
