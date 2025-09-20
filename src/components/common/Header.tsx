import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { QRCodeDisplay } from './QRCodeDisplay';
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
  Mail
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
  const [showQRCode, setShowQRCode] = useState(false);
  
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

  // Generate QR code data
  const qrCodeData = JSON.stringify({
    type: 'paraboda_user',
    userId: user?.id,
    name: user?.name,
    role: user?.role,
    timestamp: Date.now()
  });

  // Get header background based on user role
  const getHeaderBgClass = () => {
    switch (user?.role) {
      case 'community':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'rider':
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
      case 'chv':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'health_worker':
        return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'admin':
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
      default:
        return 'bg-gradient-to-r from-teal-500 to-emerald-600';
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${getHeaderBgClass()} shadow-xl sticky top-0 z-50 relative`}
      >
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18 relative z-10">
            {/* Left Side - Navigation Controls */}
            <div className="flex items-center space-x-3">
              {/* Navigation Arrows */}
              <motion.button
                onClick={navigateToPrevious}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg"
                title={language === 'sw' ? 'Dashibodi ya awali' : 'Previous dashboard'}
                aria-label={language === 'sw' ? 'Dashibodi ya awali' : 'Previous dashboard'}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                onClick={navigateToNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg"
                title={language === 'sw' ? 'Dashibodi ijayo' : 'Next dashboard'}
                aria-label={language === 'sw' ? 'Dashibodi ijayo' : 'Next dashboard'}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>

              {/* Home Button */}
              <motion.button
                onClick={handleHomeClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg"
                title={language === 'sw' ? 'Nyumbani' : 'Home'}
                aria-label={language === 'sw' ? 'Nyumbani' : 'Home'}
              >
                <Home className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Center - ParaBoda Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white/30">
                <img 
                  src="/PARABODA LOGO.png" 
                  alt="ParaBoda Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-bold text-white">ParaBoda</h1>
                <p className="text-xs text-white/80 font-medium">
                  {language === 'sw' ? 'Afya Pamoja' : 'Health Together'}
                </p>
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="hidden lg:block">
                <LanguageSelector />
              </div>
              
              {/* Currency Selector */}
              <div className="hidden lg:block">
                <CurrencySelector />
              </div>
              
              {/* Profile Button */}
              <motion.button
                onClick={() => setShowProfileModal(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg"
                title={language === 'sw' ? 'Profaili' : 'Profile'}
                aria-label={language === 'sw' ? 'Profaili' : 'Profile'}
              >
                <User className="w-5 h-5 lg:w-6 lg:h-6" />
              </motion.button>
            </div>
          </div>
        </div>
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
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className={`${getHeaderBgClass()} p-6 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{user?.name || 'User'}</h3>
                        <p className="text-white/80 capitalize">
                          {user?.role?.replace('_', ' ') || 'Community Member'}
                        </p>
                        {user?.level && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-300" />
                            <span className="text-sm text-white/90">{user.level}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {user?.points && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/90">
                          {language === 'sw' ? 'Pointi' : 'Points'}
                        </span>
                        <span className="text-xl font-bold text-white">
                          {user.points.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                {user?.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user.phone}</span>
                  </div>
                )}
                
                {user?.email && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                )}
                
                {user?.location && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user.location}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-3">
                <button
                  onClick={() => setShowQRCode(true)}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">
                    {language === 'sw' ? 'Onyesha QR Code' : 'Show QR Code'}
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    // Navigate to settings if available
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-semibold">
                    {language === 'sw' ? 'Mipangilio' : 'Settings'}
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    logout();
                    setShowProfileModal(false);
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-semibold">
                    {language === 'sw' ? 'Toka' : 'Logout'}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {language === 'sw' ? 'QR Code Yako' : 'Your QR Code'}
                </h3>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <QRCodeDisplay
                value={qrCodeData}
                title={language === 'sw' ? 'Utambulisho wa Haraka' : 'Quick Identification'}
                description={language === 'sw' ? 'Onyesha hii katika vituo vya afya' : 'Show this at health facilities'}
                size={200}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};