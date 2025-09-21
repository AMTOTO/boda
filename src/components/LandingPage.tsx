import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bike, 
  Heart, 
  Shield, 
  Users, 
  Smartphone, 
  MapPin,
  Award,
  MessageSquare,
  UserPlus,
  Eye,
  Stethoscope,
  User,
  Menu,
  X,
  Globe,
  QrCode,
  Zap,
  ArrowRight,
  Star,
  CheckCircle,
  Home,
  Phone,
  Mail,
  Wallet,
  AlertTriangle,
  Bell,
  Megaphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './common/LanguageSelector';

export const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);
  const [currentAlert, setCurrentAlert] = useState(0);

  // Public health alerts/announcements - shortened for mobile
  const publicAlerts = [
    {
      id: 1,
      type: 'vaccination',
      title: language === 'sw' ? 'Chanjo za HPV' : 'HPV Vaccination',
      message: language === 'sw' ? 'Wasichana 9-14' : 'Girls 9-14',
      fullMessage: language === 'sw' ? 'Wasichana 9-14 - kituo cha afya' : 'Girls 9-14 - health center',
      priority: 'high',
      emoji: '💉'
    },
    {
      id: 2,
      type: 'outbreak',
      title: language === 'sw' ? 'Tahadhari' : 'Alert',
      message: language === 'sw' ? 'Tumia maji safi' : 'Use clean water',
      fullMessage: language === 'sw' ? 'Tahadhari ya Kipindupindu - Tumia maji safi' : 'Cholera Alert - Use clean water',
      priority: 'critical',
      emoji: '🚨'
    },
    {
      id: 3,
      type: 'weather',
      title: language === 'sw' ? 'Mvua' : 'Rain',
      message: language === 'sw' ? 'Tumia chandarua' : 'Use nets',
      fullMessage: language === 'sw' ? 'Msimu wa Mvua - Tumia chandarua' : 'Rainy Season - Use mosquito nets',
      priority: 'medium',
      emoji: '🌧️'
    }
  ];

  const dashboardPreviews = [
    {
      title: '👩‍👧‍👦',
      subtitle: t('role.caregiver'),
      icon: User,
      color: 'blue',
      path: '/community',
      emoji: '🏠',
      description: t('role.caregiver_desc'),
      bgGradient: 'from-blue-400 to-blue-600',
      features: [
        language === 'sw' ? 'Huduma za afya' : 'Health services',
        language === 'sw' ? 'Usafiri wa dharura' : 'Emergency transport',
        language === 'sw' ? 'Pochi ya M-SUPU' : 'M-SUPU wallet'
      ]
    },
    {
      title: '🏍️',
      subtitle: t('role.rider'),
      icon: Bike,
      color: 'orange',
      path: '/rider',
      emoji: '🚴‍♂️',
      description: t('role.rider_desc'),
      bgGradient: 'from-orange-400 to-orange-600',
      features: [
        language === 'sw' ? 'Maombi ya usafiri' : 'Transport requests',
        language === 'sw' ? 'Mapato' : 'Earnings',
        language === 'sw' ? 'Ufuatiliaji wa GPS' : 'GPS tracking'
      ]
    },
    {
      title: '❤️',
      subtitle: t('role.chv'),
      icon: Heart,
      color: 'green',
      path: '/chv',
      emoji: '👩‍⚕️',
      description: t('role.chv_desc'),
      bgGradient: 'from-green-400 to-green-600',
      features: [
        language === 'sw' ? 'Usimamizi wa kaya' : 'Household management',
        language === 'sw' ? 'Ripoti za afya' : 'Health reports',
        language === 'sw' ? 'Ratibu usafiri' : 'Transport coordination'
      ]
    },
    {
      title: '🩺',
      subtitle: t('role.health_worker'),
      icon: Stethoscope,
      color: 'purple',
      path: '/health-worker',
      emoji: '👨‍⚕️',
      description: t('role.health_worker_desc'),
      bgGradient: 'from-purple-400 to-purple-600',
      features: [
        language === 'sw' ? 'Usimamizi wa wagonjwa' : 'Patient management',
        language === 'sw' ? 'Hifadhi ya chanjo' : 'Vaccine inventory',
        language === 'sw' ? 'Rekodi za afya' : 'Health records'
      ]
    },
    {
      title: '⚙️',
      subtitle: t('role.admin'),
      icon: Shield,
      color: 'gray',
      path: '/admin',
      emoji: '👨‍💼',
      description: t('role.admin_desc'),
      bgGradient: 'from-gray-400 to-gray-600',
      features: [
        language === 'sw' ? 'Usimamizi wa mfumo' : 'System management',
        language === 'sw' ? 'Takwimu' : 'Analytics',
        language === 'sw' ? 'Usimamizi wa watumiaji' : 'User management'
      ]
    }
  ];

  // Auto-scroll alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % publicAlerts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [publicAlerts.length]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* African Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="kenyan-stripe absolute top-0 left-0 right-0"></div>
        <div className="kenyan-stripe absolute bottom-0 left-0 right-0"></div>
        <div className="pattern-kente absolute inset-0"></div>
      </div>

      {/* Top Language Selector Bar - Responsive */}
      <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 p-2 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-2xl">🌍</span>
            <span className="text-white font-bold text-xs sm:text-sm md:text-base">
              {t('landing.choose_language')}
            </span>
          </div>
          
          <LanguageSelector 
            position="inline"
            size="sm"
            showLabel={false}
          />
        </div>
      </div>

      {/* Emergency Banner - Mobile Optimized */}
      {showEmergencyBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white p-2 sm:p-3 relative z-40 shadow-lg"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold truncate">
                    🚨 {language === 'sw' ? 'DHARURA' : 'EMERGENCY'}
                  </h3>
                  <p className="text-red-100 text-xs hidden sm:block">
                    {language === 'sw' ? 'Ufikiaji wa haraka' : 'Quick access'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <Link
                  to="/auth?emergency=true"
                  className="bg-white text-red-600 px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center space-x-1 text-xs sm:text-sm"
                >
                  <span className="text-sm sm:text-base">🚨</span>
                  <span>{language === 'sw' ? 'SOS' : 'SOS'}</span>
                </Link>
                <button
                  onClick={() => setShowEmergencyBanner(false)}
                  className="text-white/80 hover:text-white p-1"
                  aria-label="Close emergency banner"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Public Health Alerts Carousel - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-3 relative z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Megaphone className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-bold text-xs sm:text-sm hidden sm:block">
                {language === 'sw' ? 'Matangazo' : 'Alerts'}
              </span>
            </div>
            
            {/* Alert Content - Responsive */}
            <div className="flex-1 overflow-hidden min-w-0">
              <motion.div
                key={currentAlert}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center space-x-1 sm:space-x-2"
              >
                <span className="text-sm sm:text-lg flex-shrink-0">{publicAlerts[currentAlert].emoji}</span>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs sm:text-sm block">
                    {publicAlerts[currentAlert].title}
                  </span>
                  <span className="opacity-90 text-xs sm:text-sm block sm:hidden">
                    {publicAlerts[currentAlert].message}
                  </span>
                  <span className="opacity-90 text-sm hidden sm:block">
                    {publicAlerts[currentAlert].fullMessage}
                  </span>
                </div>
              </motion.div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex space-x-1 flex-shrink-0">
              {publicAlerts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAlert(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                    index === currentAlert ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`View alert ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header - Improved Structure */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border-b-2 border-yellow-400 sticky top-0 z-40 relative"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden shadow-lg border-2 border-yellow-400 flex-shrink-0">
                <img 
                  src="/PARABODA LOGO.png" 
                  alt="ParaBoda Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xs">PB</div>';
                    }
                  }}
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                  {t('landing.title')}
                </h1>
                <p className="text-xs sm:text-sm text-green-600 font-medium hidden sm:block">
                  {t('landing.subtitle')}
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link 
                to="/auth"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-bold transition-colors px-3 lg:px-4 py-2 rounded-xl hover:bg-yellow-100 text-sm lg:text-base"
              >
                <span className="text-lg">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
              <Link 
                to="/register"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all font-bold text-sm lg:text-base shadow-lg transform hover:scale-105 flex items-center space-x-2"
              >
                <span className="text-lg">✨</span>
                <span>{language === 'sw' ? 'Jiunge' : 'Join'}</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-yellow-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-yellow-300 py-3"
              >
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/auth"
                    className="flex items-center justify-center space-x-2 text-gray-700 hover:text-gray-900 font-bold transition-colors px-4 py-3 rounded-xl hover:bg-yellow-100 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">🔑</span>
                    <span>{t('landing.login')}</span>
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all font-bold text-base shadow-lg flex items-center justify-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">✨</span>
                    <span>{language === 'sw' ? 'Jiunge' : 'Join'}</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section - Mobile Optimized */}
      <section className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden shadow-xl border-3 sm:border-4 border-yellow-400">
              <img 
                src="/PARABODA LOGO.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg">PB</div>';
                  }
                }}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight px-2">
              {t('landing.title')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 font-bold mb-6 sm:mb-8 lg:mb-10 max-w-4xl mx-auto px-3">
              {t('landing.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-3">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all font-bold text-base sm:text-lg shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span className="text-xl sm:text-2xl">🚀</span>
                <span>{t('landing.get_started')}</span>
              </Link>
              <Link
                to="/auth"
                className="w-full sm:w-auto border-2 border-gray-700 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-gray-700 hover:text-white transition-all font-bold text-base sm:text-lg flex items-center justify-center space-x-2"
              >
                <span className="text-xl sm:text-2xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Previews Section - Mobile Optimized */}
      <section className="py-6 sm:py-8 lg:py-12 glass-effect relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <div className="text-3xl sm:text-4xl lg:text-6xl mb-3 sm:mb-4 animate-bounce">👀</div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-3 sm:mb-4 lg:mb-6 px-2">
              {t('landing.choose_role')}
            </h2>
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 sm:px-4 py-2 sm:py-3 rounded-full text-xs sm:text-sm lg:text-base font-bold">
              <span className="text-sm sm:text-lg">👁️</span>
              <span>{t('landing.no_login_required')}</span>
            </div>
          </motion.div>

          {/* Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {dashboardPreviews.map((dashboard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full">
                  <div className={`bg-gradient-to-r ${dashboard.bgGradient} p-3 sm:p-4 text-white`}>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">
                        {dashboard.emoji}
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-2 mx-auto shadow-lg">
                        <dashboard.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4 flex flex-col h-full">
                    <h3 className="text-sm sm:text-base lg:text-lg font-black text-gray-900 mb-2 sm:mb-3 text-center">
                      {dashboard.subtitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 font-medium leading-relaxed text-center flex-grow">
                      {dashboard.description}
                    </p>
                    
                    {/* Features List - Compact for mobile */}
                    <div className="mb-3 sm:mb-4">
                      <ul className="space-y-1 text-xs text-gray-600">
                        {dashboard.features.slice(0, 2).map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </li>
                        ))}
                        {dashboard.features.length > 2 && (
                          <li className="text-gray-500">+{dashboard.features.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                    
                    <Link
                      to={dashboard.path}
                      className={`w-full bg-gradient-to-r ${dashboard.bgGradient} text-white py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-bold text-xs sm:text-sm lg:text-base flex items-center justify-center space-x-1 sm:space-x-2 group-hover:scale-105 mt-auto`}
                    >
                      <span className="text-sm sm:text-lg">👆</span>
                      <span>{t('action.open')}</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-3 sm:mb-4">
              {language === 'sw' ? 'Huduma Zetu' : 'Our Services'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl"
            >
              <div className="text-3xl sm:text-4xl lg:text-6xl mb-3 sm:mb-4">🚨</div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {t('emergency.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {t('emergency.request_help')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl"
            >
              <div className="text-3xl sm:text-4xl lg:text-6xl mb-3 sm:mb-4">🏍️</div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {t('service.transport')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {language === 'sw' ? 'Usafiri wa afya wa haraka' : 'Fast health transport'}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl"
            >
              <div className="text-3xl sm:text-4xl lg:text-6xl mb-3 sm:mb-4">🧠</div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {t('service.ai_assistant')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {language === 'sw' ? 'Msaada wa akili bandia' : 'AI health guidance'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* M-SUPU Wallet Feature - Mobile Optimized */}
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-emerald-50 to-teal-50 relative">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6">💰</div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-3 sm:mb-4 lg:mb-6">
              {t('wallet.title')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-bold mb-6 sm:mb-8 lg:mb-10 max-w-4xl mx-auto px-2">
              {language === 'sw' 
                ? 'Fedha za jamii, mikopo, na akiba' 
                : 'Community funds, loans, and savings'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-2 border-emerald-200">
                <Wallet className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2">
                  {t('wallet.savings')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {language === 'sw' ? 'Okoa pamoja na jamii' : 'Save together as a community'}
                </p>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-2 border-blue-200">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2">
                  {language === 'sw' ? 'Mikopo ya Afya' : 'Health Loans'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {language === 'sw' ? 'Mikopo ya matibabu na usafiri' : 'Medical and transport loans'}
                </p>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-2 border-purple-200">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2">
                  {t('wallet.rewards')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {language === 'sw' ? 'Pata zawadi kwa ushiriki' : 'Earn rewards for participation'}
                </p>
              </div>
            </div>

            {/* Quick Access to Wallet */}
            <div>
              <Link
                to="/wallet"
                className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-bold text-sm sm:text-base lg:text-lg shadow-lg transform hover:scale-105"
              >
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{language === 'sw' ? 'Fungua Pochi' : 'Open Wallet'}</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section - Mobile Optimized */}
      <section className="py-6 sm:py-8 lg:py-12 bg-white relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-3 sm:mb-4">
              {language === 'sw' ? 'Athari Yetu' : 'Our Impact'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center bg-blue-50 p-3 sm:p-4 rounded-xl border-2 border-blue-200">
              <div className="text-lg sm:text-2xl lg:text-3xl font-black text-blue-600 mb-1 sm:mb-2">1,247</div>
              <div className="text-xs sm:text-sm font-bold text-blue-800">
                {language === 'sw' ? 'Watumiaji' : 'Users'}
              </div>
            </div>
            <div className="text-center bg-green-50 p-3 sm:p-4 rounded-xl border-2 border-green-200">
              <div className="text-lg sm:text-2xl lg:text-3xl font-black text-green-600 mb-1 sm:mb-2">2,456</div>
              <div className="text-xs sm:text-sm font-bold text-green-800">
                {language === 'sw' ? 'Safari' : 'Trips'}
              </div>
            </div>
            <div className="text-center bg-purple-50 p-3 sm:p-4 rounded-xl border-2 border-purple-200">
              <div className="text-lg sm:text-2xl lg:text-3xl font-black text-purple-600 mb-1 sm:mb-2">156</div>
              <div className="text-xs sm:text-sm font-bold text-purple-800">
                {language === 'sw' ? 'CHVs' : 'CHVs'}
              </div>
            </div>
            <div className="text-center bg-orange-50 p-3 sm:p-4 rounded-xl border-2 border-orange-200">
              <div className="text-lg sm:text-2xl lg:text-3xl font-black text-orange-600 mb-1 sm:mb-2">47</div>
              <div className="text-xs sm:text-sm font-bold text-orange-800">
                {language === 'sw' ? 'Kaunti' : 'Counties'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-r from-green-500 to-blue-500 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center px-3 sm:px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6 animate-bounce">🚀</div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white mb-3 sm:mb-4 lg:mb-6">
              {language === 'sw' ? 'Jiunge Leo!' : 'Join Today!'}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 lg:mb-10 font-bold px-2">
              {language === 'sw' 
                ? 'Jiunge na maelfu ya wakenya' 
                : 'Join thousands of East Africans'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors font-bold text-base sm:text-lg shadow-xl flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <span className="text-xl sm:text-2xl">✨</span>
                <span>{t('landing.get_started')}</span>
              </Link>
              <Link
                to="/auth"
                className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-colors font-bold text-base sm:text-lg flex items-center justify-center space-x-2"
              >
                <span className="text-xl sm:text-2xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 relative">
        <div className="absolute inset-0 pattern-kente opacity-5"></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-yellow-400">
              <img 
                src="/PARABODA LOGO.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-yellow-400 flex items-center justify-center text-white font-bold">PB</div>';
                  }
                }}
              />
            </div>
            <span className="text-lg sm:text-xl font-black">{t('landing.title')}</span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">❤️🏥🚴‍♂️</div>
          <p className="text-base sm:text-lg lg:text-xl font-bold text-yellow-400 mb-4 sm:mb-6">
            {t('landing.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm lg:text-base">
            <div>
              <h3 className="font-bold mb-2 sm:mb-3">{language === 'sw' ? 'Huduma' : 'Services'}</h3>
              <ul className="space-y-1 text-gray-300">
                <li>{t('emergency.transport')}</li>
                <li>{t('service.health')}</li>
                <li>{t('service.ai_assistant')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 sm:mb-3">{language === 'sw' ? 'Majukumu' : 'Roles'}</h3>
              <ul className="space-y-1 text-gray-300">
                <li>{t('role.caregiver')}</li>
                <li>{t('role.rider')}</li>
                <li>CHVs</li>
                <li>{t('role.health_worker')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 sm:mb-3">{language === 'sw' ? 'Mawasiliano' : 'Contact'}</h3>
              <ul className="space-y-1 text-gray-300">
                <li className="flex items-center justify-center space-x-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">+254 XXX XXX XXX</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">info@paraboda.co.ke</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};