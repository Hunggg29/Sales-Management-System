import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdShoppingCart, MdSearch, MdMenu, MdClose, MdLogin, MdPersonAdd, MdPerson, MdEdit, MdHistory, MdLogout, MdKeyboardArrowDown } from 'react-icons/md';
import AuthModal from './AuthModal';
import logo from '../assets/images/logo.jpg';
import logo2 from '../assets/images/logo2.png';
import type { User } from '../types';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setIsProfileDropdownOpen(false);
    navigate('/');
    window.location.reload();
  };

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
    { title: 'TRANG CHỦ', path: '/' },
    { title: 'GIỚI THIỆU', path: '/gioi-thieu' },
    { title: 'SẢN PHẨM', path: '/san-pham' },
    { title: 'TƯ VẤN', path: '/tu-van' },
    { title: 'TIN TỨC', path: '/tin-tuc' },
    { title: 'LIÊN HỆ', path: '/lien-he' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/san-pham?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

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

            {/* Right Side - Cart, Profile/Auth */}
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

              {currentUser ? (
                /* Profile Dropdown - Logged In */
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    onMouseEnter={() => setIsProfileDropdownOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold text-base hover:bg-red-700 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <MdPerson className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="max-w-[120px] truncate">{currentUser.userName}</span>
                    <MdKeyboardArrowDown className={`w-5 h-5 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onMouseLeave={() => setIsProfileDropdownOpen(false)}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white border-b">
                          <p className="font-bold text-lg">{currentUser.userName}</p>
                          <p className="text-sm opacity-90 truncate">{currentUser.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/ho-so"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <MdEdit className="w-5 h-5" />
                            <span className="font-medium">Chỉnh sửa hồ sơ</span>
                          </Link>

                          <Link
                            to="/lich-su-giao-dich"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <MdHistory className="w-5 h-5" />
                            <span className="font-medium">Lịch sử giao dịch</span>
                          </Link>

                          <div className="border-t border-gray-200 my-2"></div>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <MdLogout className="w-5 h-5" />
                            <span className="font-medium">Đăng xuất</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Auth Buttons - Not Logged In */
                <>
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
                </>
              )}

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
            {/* Desktop Navigation - Left Side */}
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-8 py-5 text-white font-bold text-lg uppercase hover:bg-red-700 transition-all duration-200 whitespace-nowrap relative group"
                >
                  <span className="relative z-10">{item.title}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop Right Side */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="px-4 py-2 w-64 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-red-400 transition-all"
              />
              <button 
                type="submit"
                className="bg-red-600 p-2 hover:bg-red-700 transition-all duration-200 group"
              >
                <MdSearch className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
            </form>

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
                <form onSubmit={handleSearch} className="flex items-center bg-white rounded-md overflow-hidden shadow-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="px-4 py-2 flex-1 outline-none text-sm text-gray-500 focus:ring-2 focus:ring-red-500 transition-all"
                  />
                  <button 
                    type="submit"
                    className="bg-red-500 p-3 hover:bg-red-600 hover:scale-105 transition-all duration-200 group"
                  >
                    <MdSearch className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </form>
              </div>
              {/* Mobile Auth/Profile */}
              {currentUser ? (
                <div className="px-4 pb-2 space-y-2">
                  {/* User Info */}
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MdPerson className="w-7 h-7 text-white" />
                    </div>
                    <p className="font-bold text-gray-800">{currentUser.userName}</p>
                    <p className="text-xs text-gray-600 truncate">{currentUser.email}</p>
                  </div>

                  {/* Profile Menu */}
                  <Link
                    to="/ho-so"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    <MdEdit className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Chỉnh sửa hồ sơ</span>
                  </Link>

                  <Link
                    to="/lich-su-giao-dich"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    <MdHistory className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Lịch sử giao dịch</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <MdLogout className="w-5 h-5" />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              ) : (
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
              )}
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
