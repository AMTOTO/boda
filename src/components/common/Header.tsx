import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LanguageSelector } from './LanguageSelector';
import { QRCodeDisplay } from './QRCodeDisplay';
import { ProfileModal } from './ProfileModal';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bike, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  Mic,
  MicOff,
  Home,
  Menu,
  X,
  QrCode,
  Heart,
  Shield,
  Stethoscope,
  Users,
  Activity,
  MapPin,
  Clock,
  Star,
  Award,
  DollarSign,
  AlertTriangle,
  FileText,
  Zap,
  Calendar,
  Phone,
  Mail,
  Navigation,
  Compass,
  Battery,
  Signal,
  Wifi,
  Volume2,
  Brain,
  MessageSquare,
  ChevronDown,
  Globe,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useVoiceCommand } from '../../contexts/VoiceCommandContext';
import { BSenseAI } from './BSenseAI';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isListening, startListening, stopListening, isSupported } = useVoiceCommand();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showParabodaAI, setShowParabodaAI] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const dashboardMenuRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const roleColors = {
    community: 'from-emerald-500 via-green-500 to-teal-500',
    rider: 'from-orange-500 via-red-500 to-pink-500',
    chv: 'from-purple-500 via-violet-500 to-indigo-500',
    health_worker: 'from-blue-500 via-indigo-500 to-purple-500',
    admin: 'from-gray-600 via-slate-600 to-zinc-600'
  };

  const gradientClass = roleColors[user?.role || 'community'];

  // Check if this is a preview user
  const isPreviewMode = user?.id?.includes('preview');

  // Navigation history management with proper initialization
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Initialize navigation history
  useEffect(() => {
    const currentPath = location.pathname;
    if (navigationHistory.length === 0) {
      setNavigationHistory([currentPath]);
      setCurrentHistoryIndex(0);
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (dashboardMenuRef.current && !dashboardMenuRef.current.contains(event.target as Node)) {
        setShowDashboardMenu(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Track navigation history properly
  useEffect(() => {
    const currentPath = location.pathname;
    
    setNavigationHistory(prev => {
      // Don't add if it's the same as current path
      if (prev[currentHistoryIndex] === currentPath) {
        return prev;
      }

      const newHistory = [...prev];
      
      // If we're not at the end of history, remove everything after current position
      if (currentHistoryIndex < newHistory.length - 1) {
        newHistory.splice(currentHistoryIndex + 1);
      }
      
      // Add new path
      newHistory.push(currentPath);
      
      // Keep only last 20 entries
      if (newHistory.length > 20) {
        newHistory.shift();
        setCurrentHistoryIndex(newHistory.length - 1);
      } else {
        setCurrentHistoryIndex(newHistory.length - 1);
      }
      
      return newHistory;
    });
  }, [location.pathname]);

  const canGoBack = currentHistoryIndex > 0;
  const canGoForward = currentHistoryIndex < navigationHistory.length - 1;

  const handleGoBack = () => {
    if (canGoBack) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      navigate(navigationHistory[newIndex]);
    } else {
      // Fallback to browser history
      try {
        window.history.back();
      } catch (error) {
        console.warn('Browser back navigation failed:', error);
      }
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      navigate(navigationHistory[newIndex]);
    } else {
      // Fallback to browser history
      try {
        window.history.forward();
      } catch (error) {
        console.warn('Browser forward navigation failed:', error);
      }
    }
  };

  const handleHomeClick = () => {
    if (isPreviewMode) {
      navigate('/');
    } else {
      // Navigate to appropriate dashboard based on user role
      const roleRoutes: Record<string, string> = {
        community: '/community',
        rider: '/rider',
        chv: '/chv',
        health_worker: '/health-worker',
        admin: '/admin'
      };
      navigate(roleRoutes[user?.role || 'community']);
    }
  };

  // Dashboard navigation options - organized by role
  const dashboardOptions = [
    {
      id: 'community',
      name: t('users.community'),
      icon: Users,
      path: '/community',
      color: 'emerald',
      description: language === 'sw' ? 'Huduma za afya na jamii' : 'Health and community services'
    },
    {
      id: 'rider',
      name: t('users.riders'),
      icon: Bike,
      path: '/rider',
      color: 'orange',
      description: language === 'sw' ? 'Usafiri na dharura' : 'Transport and emergency'
    },
    {
      id: 'chv',
      name: t('users.chvs'),
      icon: Heart,
      path: '/chv',
      color: 'purple',
      description: language === 'sw' ? 'Usimamizi wa afya ya jamii' : 'Community health management'
    },
    {
      id: 'health_worker',
      name: t('users.health_workers'),
      icon: Stethoscope,
      path: '/health-worker',
      color: 'blue',
      description: language === 'sw' ? 'Huduma za kimatibabu' : 'Medical services'
    },
    {
      id: 'admin',
      name: t('users.admins'),
      icon: Shield,
      path: '/admin',
      color: 'gray',
      description: language === 'sw' ? 'Usimamizi wa mfumo' : 'System management'
    }
  ];

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: language === 'sw' ? 'Ombi la Usafiri' : 'Transport Request',
      message: language === 'sw' ? 'Ombi jipya la usafiri wa dharura' : 'New emergency transport request',
      time: '2 min ago',
      type: 'urgent',
      icon: AlertTriangle
    },
    {
      id: '2',
      title: language === 'sw' ? 'Chanjo Inahitajika' : 'Vaccination Due',
      message: language === 'sw' ? 'Mtoto anahitaji chanjo ya polio' : 'Child needs polio vaccination',
      time: '15 min ago',
      type: 'reminder',
      icon: Calendar
    },
    {
      id: '3',
      title: language === 'sw' ? 'Pointi Zimeongezwa' : 'Points Earned',
      message: language === 'sw' ? 'Umepata pointi 25 kwa kusaidia jamii' : 'You earned 25 points for helping community',
      time: '1 hour ago',
      type: 'success',
      icon: Award
    }
  ];

  // Generate QR code data
  const qrCodeData = JSON.stringify({
    type: 'paraboda_user',
    userId: user?.id,
    name: user?.name,
    role: user?.role,
    timestamp: Date.now()
  });

  // Quick actions based on user role
  const getQuickActions = () => {
    switch (user?.role) {
      case 'community':
        return [
          { icon: Heart, label: language === 'sw' ? 'Afya' : 'Health', path: '/community/health' },
          { icon: Bike, label: language === 'sw' ? 'Usafiri' : 'Transport', path: '/community/transport' },
          { icon: Award, label: language === 'sw' ? 'Zawadi' : 'Rewards', path: '/community/rewards' },
          { icon: Brain, label: language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI', action: () => setShowParabodaAI(true) }
        ];
      case 'rider':
        return [
          { icon: MapPin, label: language === 'sw' ? 'Ramani' : 'Map', path: '/rider/map' },
          { icon: AlertTriangle, label: language === 'sw' ? 'Dharura' : 'Emergency', path: '/rider/emergency' },
          { icon: Star, label: language === 'sw' ? 'Ukadiriaji' : 'Rating', path: '/rider/rating' },
          { icon: Brain, label: language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI', action: () => setShowParabodaAI(true) }
        ];
      case 'chv':
        return [
          { icon: Home, label: language === 'sw' ? 'Kaya' : 'Households', path: '/chv/households' },
          { icon: Bike, label: language === 'sw' ? 'Usafiri' : 'Transport', path: '/chv/transport' },
          { icon: AlertTriangle, label: language === 'sw' ? 'Tahadhari' : 'Alerts', path: '/chv/alerts' },
          { icon: Brain, label: language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI', action: () => setShowParabodaAI(true) }
        ];
      case 'health_worker':
        return [
          { icon: Users, label: language === 'sw' ? 'Wagonjwa' : 'Patients', path: '/health-worker/patients' },
          { icon: Shield, label: language === 'sw' ? 'Chanjo' : 'Vaccines', path: '/health-worker/vaccines' },
          { icon: QrCode, label: language === 'sw' ? 'Skani' : 'Scanner', path: '/health-worker/scanner' },
          { icon: Brain, label: language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI', action: () => setShowParabodaAI(true) }
        ];
      case 'admin':
        return [
          { icon: Users, label: language === 'sw' ? 'Watumiaji' : 'Users', path: '/admin/users' },
          { icon: Activity, label: language === 'sw' ? 'Takwimu' : 'Analytics', path: '/admin/analytics' },
          { icon: Settings, label: language === 'sw' ? 'Mipangilio' : 'Settings', path: '/admin/settings' },
          { icon: Brain, label: language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI', action: () => setShowParabodaAI(true) }
        ];
      default:
        return [];
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${gradientClass} shadow-2xl sticky top-0 z-50 relative`}
    >
      {/* African Pattern Overlay */}
      <div className="absolute inset-0 pattern-kente opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Left Side - Logo + Navigation */}
          <div className="flex items-center space-x-3 min-w-0">
            {/* Navigation Controls */}
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={handleGoBack}
                disabled={!canGoBack}
                whileHover={{ scale: canGoBack ? 1.05 : 1 }}
                whileTap={{ scale: canGoBack ? 0.95 : 1 }}
                className={`p-2 sm:p-3 rounded-xl transition-all shadow-lg ${
                  canGoBack 
                    ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white cursor-pointer' 
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
                title={language === 'sw' ? 'Rudi nyuma' : 'Go back'}
                aria-label={language === 'sw' ? 'Rudi nyuma' : 'Go back'}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              <motion.button
                onClick={handleGoForward}
                disabled={!canGoForward}
                whileHover={{ scale: canGoForward ? 1.05 : 1 }}
                whileTap={{ scale: canGoForward ? 0.95 : 1 }}
                className={`p-2 sm:p-3 rounded-xl transition-all shadow-lg ${
                  canGoForward 
                    ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white cursor-pointer' 
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
                title={language === 'sw' ? 'Enda mbele' : 'Go forward'}
                aria-label={language === 'sw' ? 'Enda mbele' : 'Go forward'}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              {/* Home Button */}
              <motion.button
                onClick={handleHomeClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 sm:p-3 rounded-xl transition-all shadow-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white cursor-pointer"
                title={language === 'sw' ? 'Nyumbani' : 'Home'}
                aria-label={language === 'sw' ? 'Nyumbani' : 'Home'}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-white truncate">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm lg:text-base text-white/90 truncate font-bold">{subtitle}</p>}
              {isPreviewMode && (
                <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                  <span className="text-sm sm:text-lg">👁️</span>
                  <span className="text-xs sm:text-sm text-white/80 font-black">
                    {language === 'sw' ? 'Hali ya Onyesho' : 'Preview Mode'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Center - Action Icons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all shadow-lg"
              title={isDarkMode ? (language === 'sw' ? 'Hali ya Mwanga' : 'Light Mode') : (language === 'sw' ? 'Hali ya Giza' : 'Dark Mode')}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
            </motion.button>

            {/* Quick Actions Dropdown */}
            <div className="relative" ref={dashboardMenuRef}>
              <button
                onClick={() => setShowDashboardMenu(!showDashboardMenu)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all shadow-lg flex items-center space-x-2"
                title={language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}
                aria-label={language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}
                aria-expanded={showDashboardMenu}
                aria-haspopup="true"
              >
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-sm">
                  {language === 'sw' ? 'Vitendo' : 'Actions'}
                </span>
              </button>

              <AnimatePresence>
                {showDashboardMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl border-4 border-gray-200 overflow-hidden z-50 min-w-[280px]"
                  >
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <h3 className="font-bold text-lg flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</span>
                      </h3>
                    </div>
                    <div className="p-2">
                      {getQuickActions().map((action, index) => (
                        action.action ? (
                          <button
                            key={index}
                            onClick={() => {
                              action.action && action.action();
                              setShowDashboardMenu(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg w-full text-left"
                          >
                            <action.icon className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-900 font-bold">{action.label}</span>
                          </button>
                        ) : (
                          <Link
                            key={index}
                            to={action.path}
                            onClick={() => setShowDashboardMenu(false)}
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg"
                          >
                            <action.icon className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-900 font-bold">{action.label}</span>
                          </Link>
                        )
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* QR Code Button */}
            <button
              onClick={() => setShowQRCode(true)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all shadow-lg"
              title={language === 'sw' ? 'Onyesha QR Code' : 'Show QR Code'}
              aria-label={language === 'sw' ? 'Onyesha QR Code' : 'Show QR Code'}
            >
              <QrCode className="w-5 h-5 text-white" />
            </button>

            {/* ParaBoda-AI Button */}
            <button
              onClick={() => setShowParabodaAI(true)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all shadow-lg"
              title={language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}
              aria-label={language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}
            >
              <Brain className="w-5 h-5 text-white" />
            </button>

            {/* Voice Command Button */}
            {isSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-xl transition-all shadow-lg ${
                  isListening 
                    ? 'bg-red-500/80 text-white animate-pulse' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title={isListening 
                  ? (language === 'sw' ? 'Acha kusikiliza' : 'Stop listening') 
                  : (language === 'sw' ? 'Anza amri ya sauti' : 'Start voice command')
                }
                aria-label={isListening 
                  ? (language === 'sw' ? 'Acha kusikiliza' : 'Stop listening') 
                  : (language === 'sw' ? 'Anza amri ya sauti' : 'Start voice command')
                }
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all relative shadow-lg"
                aria-label={language === 'sw' ? 'Arifa' : 'Notifications'}
                aria-expanded={showNotifications}
                aria-haspopup="true"
              >
                <Bell className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-black">{notifications.length}</span>
                </div>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl border-4 border-gray-200 overflow-hidden z-50 w-80"
                  >
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <h3 className="font-bold text-lg flex items-center space-x-2">
                        <Bell className="w-5 h-5" />
                        <span>{language === 'sw' ? 'Arifa' : 'Notifications'}</span>
                      </h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              notification.type === 'urgent' ? 'bg-red-100' :
                              notification.type === 'reminder' ? 'bg-yellow-100' :
                              'bg-green-100'
                            }`}>
                              <notification.icon className={`w-4 h-4 ${
                                notification.type === 'urgent' ? 'text-red-600' :
                                notification.type === 'reminder' ? 'text-yellow-600' :
                                'text-green-600'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                              <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                              <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 text-center">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        {language === 'sw' ? 'Ona Zote' : 'View All'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side - User Profile */}
          <div className="flex items-center">
            {/* User Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl hover:bg-white/30 transition-all"
                title={language === 'sw' ? 'Wasifu Wangu' : 'My Profile'}
              >
                <User className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 rounded-xl text-white hover:bg-white/20 transition-all"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t-4 border-white/20 py-6"
            >
              <div className="flex flex-col space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-4 px-4 py-3">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">{user?.name}</p>
                    <p className="text-sm text-white/80 capitalize font-bold">{user?.role?.replace('_', ' ')}</p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      handleGoBack();
                      setIsMenuOpen(false);
                    }}
                    disabled={!canGoBack}
                    className={`flex items-center justify-center space-x-3 p-4 rounded-2xl transition-all ${
                      canGoBack 
                        ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white' 
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                    aria-label={language === 'sw' ? 'Rudi' : 'Back'}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-lg font-bold">
                      {language === 'sw' ? 'Rudi' : 'Back'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      handleGoForward();
                      setIsMenuOpen(false);
                    }}
                    disabled={!canGoForward}
                    className={`flex items-center justify-center space-x-3 p-4 rounded-2xl transition-all ${
                      canGoForward 
                        ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white' 
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                    aria-label={language === 'sw' ? 'Mbele' : 'Forward'}
                  >
                    <span className="text-lg font-bold">
                      {language === 'sw' ? 'Mbele' : 'Forward'}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Home Button */}
                <button
                  onClick={() => {
                    handleHomeClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-3 p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all mx-4"
                >
                  <Home className="w-6 h-6 text-white" />
                  <span className="text-lg font-bold text-white">
                    {language === 'sw' ? 'Nyumbani' : 'Home'}
                  </span>
                </button>

                {/* Language Selector */}
                <div className="flex justify-center">
                  <LanguageSelector />
                </div>

                {/* ParaBoda-AI Button */}
                <button
                  onClick={() => {
                    setShowParabodaAI(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-3 mx-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all"
                >
                  <Brain className="w-6 h-6 text-white" />
                  <span className="text-lg font-bold text-white">
                    {language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}
                  </span>
                </button>

                {/* Quick Actions */}
                <div className="px-4">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">
                    {language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {getQuickActions().map((action, index) => (
                      action.action ? (
                        <button
                          key={index}
                          onClick={() => {
                            action.action && action.action();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all"
                        >
                          <action.icon className="w-5 h-5 text-white" />
                          <span className="text-white font-bold text-sm">{action.label}</span>
                        </button>
                      ) : (
                        <Link
                          key={index}
                          to={action.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-3 p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all"
                        >
                          <action.icon className="w-5 h-5 text-white" />
                          <span className="text-white font-bold text-sm">{action.label}</span>
                        </Link>
                      )
                    ))}
                  </div>
                </div>

                {/* Dashboard Navigation */}
                <div className="px-4">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">
                    {language === 'sw' ? 'Chagua Dashibodi' : 'Switch Dashboard'}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {dashboardOptions.map((option) => (
                      <Link
                        key={option.id}
                        to={option.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <option.icon className="w-6 h-6 text-white" />
                          <div>
                            <span className="text-white font-bold text-sm">{option.name}</span>
                            <p className="text-white/80 text-xs">{option.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* QR Code Button */}
                <button
                  onClick={() => {
                    setShowQRCode(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-3 mx-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all"
                >
                  <QrCode className="w-6 h-6 text-white" />
                  <span className="text-lg font-bold text-white">
                    {language === 'sw' ? 'QR Code' : 'QR Code'}
                  </span>
                </button>

                {/* Mobile Actions */}
                <div className="grid grid-cols-2 gap-4 px-4">
                  {/* Voice Command Button */}
                  {isSupported && (
                    <button
                      onClick={() => {
                        isListening ? stopListening() : startListening();
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center justify-center space-x-3 p-4 rounded-2xl transition-all ${
                        isListening 
                          ? 'bg-red-500/80 text-white animate-pulse' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      <span className="text-lg font-bold">
                        {isListening 
                          ? (language === 'sw' ? 'Acha' : 'Stop') 
                          : (language === 'sw' ? 'Sauti' : 'Voice')
                        }
                      </span>
                    </button>
                  )}

                  {/* Notifications */}
                  <button 
                    className="flex items-center justify-center space-x-3 p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all relative"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bell className="w-6 h-6 text-white" />
                    <span className="text-lg font-bold text-white">
                      {language === 'sw' ? 'Arifa' : 'Alerts'}
                    </span>
                    <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full"></div>
                  </button>

                  {/* Settings */}
                  <button 
                    className="flex items-center justify-center space-x-3 p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-6 h-6 text-white" />
                    <span className="text-lg font-bold text-white">
                      {language === 'sw' ? 'Mipangilio' : 'Settings'}
                    </span>
                  </button>
                </div>

                {/* Logout */}
                {!isPreviewMode && (
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-3 mx-4 p-4 bg-red-500/80 text-white rounded-2xl hover:bg-red-600/80 transition-all"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="text-lg font-bold">
                      {language === 'sw' ? 'Toka' : 'Logout'}
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'sw' ? 'QR Code Yako' : 'Your QR Code'}
                </h3>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  aria-label="Close"
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

      {/* ParaBoda-AI Modal */}
      <BSenseAI
        isOpen={showParabodaAI}
        onClose={() => setShowParabodaAI(false)}
        userRole={user?.role || 'community'}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </motion.header>
  );
};