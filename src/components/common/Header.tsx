import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
  X,
  Shield,
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Menu
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const profileModalRef = useRef<HTMLDivElement>(null);

  // Dashboard navigation sequence
  const dashboardSequence = [
    { path: '/admin', name: language === 'sw' ? 'Msimamizi' : 'Admin' },
    { path: '/health-worker', name: language === 'sw' ? 'Mfanyakazi wa Afya' : 'Health Worker' },
    { path: '/chv', name: language === 'sw' ? 'CHV' : 'CHV' },
    { path: '/rider', name: language === 'sw' ? 'ParaBoda' : 'ParaBoda' },
    { path: '/community', name: language === 'sw' ? 'Walezi' : 'Caregivers' }
  ];

  const getCurrentDashboardIndex = () => {
    const currentPath = location.pathname.split('/')[1];
    return dashboardSequence.findIndex(dashboard => {
      const dashPath = dashboard.path.substring(1);
      return dashPath === currentPath;
    });
  };

  const navigateToPrevious = () => {
    const currentIndex = getCurrentDashboardIndex();
    if (currentIndex === -1) return;
    
    const previousIndex = currentIndex === 0 ? dashboardSequence.length - 1 : currentIndex - 1;
    navigate(dashboardSequence[previousIndex].path);
  };

  const navigateToNext = () => {
    const currentIndex = getCurrentDashboardIndex();
    if (currentIndex === -1) {
      navigate(dashboardSequence[0].path);
      return;
    }
    
    const nextIndex = currentIndex === dashboardSequence.length - 1 ? 0 : currentIndex + 1;
    navigate(dashboardSequence[nextIndex].path);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Close profile modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileModalRef.current && !profileModalRef.current.contains(event.target as Node)) {
        setShowProfileModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get header background based on user role
  const getHeaderBgClass = () => {
    switch (user?.role) {
      case 'community':
        return 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700';
      case 'rider':
        return 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700';
      case 'chv':
        return 'bg-gradient-to-r from-green-500 via-green-600 to-green-700';
      case 'health_worker':
        return 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700';
      case 'admin':
        return 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800';
      default:
        return 'bg-gradient-to-r from-teal-500 via-emerald-600 to-cyan-700';
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${getHeaderBgClass()} shadow-xl sticky top-0 z-50 relative`}
      >
        {/* African Pattern Overlay */}
        <div className="absolute inset-0 pattern-kente opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Left Side - Navigation Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Navigation Arrows - Hidden on mobile */}
              <div className="hidden lg:flex items-center space-x-1">
                <motion.button
                  onClick={navigateToPrevious}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-md"
                  title={language === 'sw' ? 'Dashibodi ya awali' : 'Previous dashboard'}
                  aria-label={language === 'sw' ? 'Dashibodi ya awali' : 'Previous dashboard'}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>

                <motion.button
                  onClick={navigateToNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-md"
                  title={language === 'sw' ? 'Dashibodi ijayo' : 'Next dashboard'}
                  aria-label={language === 'sw' ? 'Dashibodi ijayo' : 'Next dashboard'}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>

              {/* Home Button */}
              <motion.button
                onClick={handleHomeClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-md"
                title={language === 'sw' ? 'Nyumbani' : 'Home'}
                aria-label={language === 'sw' ? 'Nyumbani' : 'Home'}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-md"
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Center - ParaBoda Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 justify-center min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-white/30 flex-shrink-0">
                <img 
                  src="/PARABODA LOGO.png" 
                  alt="ParaBoda Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full bg-white/30 flex items-center justify-center text-white font-bold text-xs">PB</div>';
                    }
                  }}
                />
              </div>
              <div className="min-w-0 text-center">
                <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">ParaBoda</h1>
                <p className="text-xs text-white/80 font-medium hidden sm:block">
                  {language === 'sw' ? 'Afya Pamoja' : 'Health Together'}
                </p>
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Language Selector - Hidden on small mobile */}
              <div className="hidden sm:block">
                <LanguageSelector size="sm" />
              </div>
              
              {/* Currency Selector - Hidden on mobile */}
              <div className="hidden lg:block">
                <CurrencySelector size="sm" />
              </div>
              
              {/* Profile Button */}
              <motion.button
                onClick={() => setShowProfileModal(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-md"
                title={language === 'sw' ? 'Profaili' : 'Profile'}
                aria-label={language === 'sw' ? 'Profaili' : 'Profile'}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-white/20 py-3"
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-center mb-2">
                    <LanguageSelector size="md" showLabel={true} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        navigateToPrevious();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center justify-center space-x-2 bg-white/20 text-white py-2 rounded-lg font-medium text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Awali' : 'Previous'}</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateToNext();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center justify-center space-x-2 bg-white/20 text-white py-2 rounded-lg font-medium text-sm"
                    >
                      <span>{language === 'sw' ? 'Ijayo' : 'Next'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title Section - Only show if title provided */}
        {title && (
          <div className="border-t border-white/20 bg-black/10">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
              <div className="text-center">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">{title}</h2>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-white/80 font-medium truncate">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.header>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              ref={profileModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              {/* Header */}
              <div className={`${getHeaderBgClass()} p-4 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 pattern-kente opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold truncate">{user?.name || 'User'}</h3>
                        <p className="text-white/80 capitalize text-sm truncate">
                          {user?.role?.replace('_', ' ') || 'Community Member'}
                        </p>
                        {user?.level && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-300" />
                            <span className="text-xs text-white/90">{user.level}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {user?.points && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/90 text-sm">
                          {language === 'sw' ? 'Pointi' : 'Points'}
                        </span>
                        <span className="text-lg font-bold text-white">
                          {user.points.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-4 space-y-3">
                {user?.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white text-sm truncate">{user.phone}</span>
                  </div>
                )}
                
                {user?.email && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white text-sm truncate">{user.email}</span>
                  </div>
                )}
                
                {user?.location && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white text-xs truncate">{user.location}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    // Navigate to settings if available
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="font-semibold text-sm">
                    {language === 'sw' ? 'Mipangilio' : 'Settings'}
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    logout();
                    setShowProfileModal(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-semibold text-sm">
                    {language === 'sw' ? 'Toka' : 'Logout'}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};