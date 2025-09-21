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

  // Public health alerts/announcements
  const publicAlerts = [
    {
      id: 1,
      type: 'vaccination',
      title: language === 'sw' ? 'Chanjo za HPV' : 'HPV Vaccination',
      message: language === 'sw' ? 'Wasichana 9-14 - kituo cha afya' : 'Girls 9-14 - health center',
      priority: 'high',
      emoji: '💉'
    },
    {
      id: 2,
      type: 'outbreak',
      title: language === 'sw' ? 'Tahadhari ya Kipindupindu' : 'Cholera Alert',
      message: language === 'sw' ? 'Tumia maji safi' : 'Use clean water',
      priority: 'critical',
      emoji: '🚨'
    },
    {
      id: 3,
      type: 'weather',
      title: language === 'sw' ? 'Msimu wa Mvua' : 'Rainy Season',
      message: language === 'sw' ? 'Tumia chandarua' : 'Use mosquito nets',
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

      {/* Top Language Selector Bar */}
      <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 p-2 sm:p-3 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-2xl sm:text-4xl">🌍</span>
            <span className="text-white font-bold text-sm sm:text-lg">
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

      {/* Emergency Banner - Responsive */}
      {showEmergencyBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 sm:p-4 relative z-40 shadow-lg"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-xl font-bold truncate">
                    {t('landing.emergency_banner')}
                  </h3>
                  <p className="text-red-100 text-xs sm:text-base hidden sm:block">
                    {language === 'sw' 
                      ? 'Ufikiaji wa haraka bila kuingia'
                      : 'Quick access without login'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <Link
                  to="/auth?emergency=true"
                  className="bg-white text-red-600 px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                >
                  <span className="text-lg sm:text-2xl">🚨</span>
                  <span className="hidden sm:inline">{language === 'sw' ? 'DHARURA' : 'EMERGENCY'}</span>
                  <span className="sm:hidden">{language === 'sw' ? 'SOS' : 'SOS'}</span>
                </Link>
                <button
                  onClick={() => setShowEmergencyBanner(false)}
                  className="text-white/80 hover:text-white p-1 sm:p-2"
                  aria-label="Close emergency banner"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Public Health Alerts Carousel - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-4 relative z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <Megaphone className="w-4 h-4 sm:w-6 sm:h-6" />
              <span className="font-bold text-xs sm:text-base">
                {language === 'sw' ? 'Matangazo' : 'Alerts'}
              </span>
            </div>
            
            {/* Alert Content */}
            <div className="flex-1 overflow-hidden min-w-0">
              <motion.div
                key={currentAlert}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center space-x-2 sm:space-x-3"
              >
                <span className="text-lg sm:text-2xl flex-shrink-0">{publicAlerts[currentAlert].emoji}</span>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-sm sm:text-base block sm:inline">{publicAlerts[currentAlert].title}</span>
                  <span className="ml-0 sm:ml-2 opacity-90 text-xs sm:text-base block sm:inline">{publicAlerts[currentAlert].message}</span>
                </div>
              </motion.div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex space-x-1 flex-shrink-0">
              {publicAlerts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAlert(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentAlert ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`View alert ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header - Responsive */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border-b-4 border-yellow-400 sticky top-0 z-40 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-yellow-400">
                <img 
                  src="/PARABODA LOGO.png" 
                  alt="ParaBoda Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm">PB</div>';
                    }
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">
                  {t('landing.title')}
                </h1>
                <p className="text-sm sm:text-lg lg:text-xl text-green-600 font-bold">
                  {t('landing.subtitle')}
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link 
                to="/auth"
                className="flex items-center space-x-2 lg:space-x-3 text-gray-700 hover:text-gray-900 font-bold transition-colors px-4 lg:px-6 py-2 lg:py-3 rounded-2xl hover:bg-yellow-100 text-lg lg:text-xl"
              >
                <span className="text-xl lg:text-2xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
              <Link 
                to="/register"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all font-black text-lg lg:text-xl shadow-xl transform hover:scale-105 flex items-center space-x-2 lg:space-x-3"
              >
                <span className="text-xl lg:text-2xl">✨</span>
                <span>{language === 'sw' ? 'Jiunge' : 'Join'}</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-yellow-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                className="md:hidden border-t-2 border-yellow-300 py-4"
              >
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/auth"
                    className="flex items-center justify-center space-x-3 text-gray-700 hover:text-gray-900 font-bold transition-colors px-6 py-4 rounded-2xl hover:bg-yellow-100 text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-2xl">🔑</span>
                    <span>{t('landing.login')}</span>
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all font-black text-lg shadow-xl flex items-center justify-center space-x-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-2xl">✨</span>
                    <span>{language === 'sw' ? 'Jiunge' : 'Join'}</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section - Responsive */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto mb-6 sm:mb-8 rounded-full overflow-hidden shadow-2xl border-4 sm:border-8 border-yellow-400">
              <img 
                src="/PARABODA LOGO.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-yellow-400 flex items-center justify-center text-white font-bold text-2xl">PB</div>';
                  }
                }}
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-4 sm:mb-6 lg:mb-8 leading-tight">
              {t('landing.title')}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-600 font-bold mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto px-4">
              {t('landing.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl hover:from-green-600 hover:to-blue-600 transition-all font-black text-lg sm:text-xl lg:text-2xl shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-3 sm:space-x-4"
              >
                <span className="text-2xl sm:text-3xl">🚀</span>
                <span>{t('landing.get_started')}</span>
              </Link>
              <Link
                to="/auth"
                className="w-full sm:w-auto border-2 sm:border-4 border-gray-700 text-gray-700 px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl hover:bg-gray-700 hover:text-white transition-all font-black text-lg sm:text-xl lg:text-2xl flex items-center justify-center space-x-3 sm:space-x-4"
              >
                <span className="text-2xl sm:text-3xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Previews Section - Responsive Grid */}
      <section className="py-8 sm:py-12 lg:py-16 glass-effect relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 animate-bounce">👀</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-4 sm:mb-6 lg:mb-8 px-4">
              {t('landing.choose_role')}
            </h2>
            <div className="inline-flex items-center space-x-2 sm:space-x-4 bg-green-100 text-green-800 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full text-sm sm:text-lg lg:text-xl font-bold">
              <span className="text-lg sm:text-2xl lg:text-3xl">👁️</span>
              <span>{t('landing.no_login_required')}</span>
            </div>
          </motion.div>

          {/* Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {dashboardPreviews.map((dashboard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border-2 sm:border-4 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full">
                  <div className={`bg-gradient-to-r ${dashboard.bgGradient} p-4 sm:p-6 text-white`}>
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl lg:text-6xl mb-2 sm:mb-4">
                        {dashboard.emoji}
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 mx-auto shadow-xl">
                        <dashboard.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 flex flex-col h-full">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 mb-2 sm:mb-4 text-center">
                      {dashboard.subtitle}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 font-bold leading-relaxed text-center flex-grow">
                      {dashboard.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="mb-4 sm:mb-6">
                      <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                        {dashboard.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link
                      to={dashboard.path}
                      className={`w-full bg-gradient-to-r ${dashboard.bgGradient} text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all font-black text-sm sm:text-lg lg:text-xl flex items-center justify-center space-x-2 sm:space-x-3 group-hover:scale-105 mt-auto`}
                    >
                      <span className="text-lg sm:text-xl lg:text-2xl">👆</span>
                      <span>{t('action.open')}</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Responsive */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 sm:mb-6">
              {language === 'sw' ? 'Huduma Zetu' : 'Our Services'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center glass-effect p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl"
            >
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6">🚨</div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                {t('emergency.title')}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                {t('emergency.request_help')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center glass-effect p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl"
            >
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6">🏍️</div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                {t('service.transport')}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                {language === 'sw' ? 'Usafiri wa afya wa haraka' : 'Fast health transport'}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center glass-effect p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl"
            >
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6">🧠</div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                {t('service.ai_assistant')}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                {language === 'sw' ? 'Msaada wa akili bandia' : 'AI health guidance'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* M-SUPU Wallet Feature - Responsive */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-emerald-50 to-teal-50 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl sm:text-6xl lg:text-8xl mb-6 sm:mb-8">💰</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-4 sm:mb-6 lg:mb-8">
              {t('wallet.title')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-bold mb-8 sm:mb-10 lg:mb-12 px-4">
              {language === 'sw' 
                ? 'Fedha za jamii, mikopo, na akiba' 
                : 'Community funds, loans, and savings'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border-2 sm:border-4 border-emerald-200">
                <Wallet className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {t('wallet.savings')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {language === 'sw' ? 'Okoa pamoja na jamii' : 'Save together as a community'}
                </p>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border-2 sm:border-4 border-blue-200">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {language === 'sw' ? 'Mikopo ya Afya' : 'Health Loans'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {language === 'sw' ? 'Mikopo ya matibabu na usafiri' : 'Medical and transport loans'}
                </p>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border-2 sm:border-4 border-purple-200">
                <Award className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {t('wallet.rewards')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {language === 'sw' ? 'Pata zawadi kwa ushiriki' : 'Earn rewards for participation'}
                </p>
              </div>
            </div>

            {/* Quick Access to Wallet */}
            <div>
              <Link
                to="/wallet"
                className="inline-flex items-center space-x-3 sm:space-x-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all font-bold text-lg sm:text-xl shadow-xl transform hover:scale-105"
              >
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{language === 'sw' ? 'Fungua Pochi' : 'Open Wallet'}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section - Responsive */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4 sm:mb-6">
              {language === 'sw' ? 'Athari Yetu' : 'Our Impact'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center bg-blue-50 p-4 sm:p-6 rounded-2xl border-2 border-blue-200">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 mb-2">1,247</div>
              <div className="text-sm sm:text-base font-bold text-blue-800">
                {language === 'sw' ? 'Watumiaji' : 'Users'}
              </div>
            </div>
            <div className="text-center bg-green-50 p-4 sm:p-6 rounded-2xl border-2 border-green-200">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-600 mb-2">2,456</div>
              <div className="text-sm sm:text-base font-bold text-green-800">
                {language === 'sw' ? 'Safari' : 'Trips'}
              </div>
            </div>
            <div className="text-center bg-purple-50 p-4 sm:p-6 rounded-2xl border-2 border-purple-200">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-600 mb-2">156</div>
              <div className="text-sm sm:text-base font-bold text-purple-800">
                {language === 'sw' ? 'CHVs' : 'CHVs'}
              </div>
            </div>
            <div className="text-center bg-orange-50 p-4 sm:p-6 rounded-2xl border-2 border-orange-200">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-600 mb-2">47</div>
              <div className="text-sm sm:text-base font-bold text-orange-800">
                {language === 'sw' ? 'Kaunti' : 'Counties'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-green-500 to-blue-500 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl sm:text-6xl lg:text-8xl mb-6 sm:mb-8 animate-bounce">🚀</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-4 sm:mb-6 lg:mb-8">
              {language === 'sw' ? 'Jiunge Leo!' : 'Join Today!'}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 lg:mb-12 font-bold px-4">
              {language === 'sw' 
                ? 'Jiunge na maelfu ya wakenya' 
                : 'Join thousands of East Africans'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-white text-green-600 px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl hover:bg-gray-50 transition-colors font-black text-lg sm:text-xl lg:text-2xl shadow-2xl flex items-center justify-center space-x-3 sm:space-x-4 transform hover:scale-105"
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl">✨</span>
                <span>{t('landing.get_started')}</span>
              </Link>
              <Link
                to="/auth"
                className="w-full sm:w-auto border-2 sm:border-4 border-white text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-colors font-black text-lg sm:text-xl lg:text-2xl flex items-center justify-center space-x-3 sm:space-x-4"
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 relative">
        <div className="absolute inset-0 pattern-kente opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-yellow-400">
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
            <span className="text-2xl sm:text-3xl font-black">{t('landing.title')}</span>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6">❤️🏥🚴‍♂️</div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 mb-6 sm:mb-8">
            {t('landing.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-sm sm:text-base lg:text-lg">
            <div>
              <h3 className="font-bold mb-3 sm:mb-4">{language === 'sw' ? 'Huduma' : 'Services'}</h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-300">
                <li>{t('emergency.transport')}</li>
                <li>{t('service.health')}</li>
                <li>{t('service.ai_assistant')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 sm:mb-4">{language === 'sw' ? 'Majukumu' : 'Roles'}</h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-300">
                <li>{t('role.caregiver')}</li>
                <li>{t('role.rider')}</li>
                <li>CHVs</li>
                <li>{t('role.health_worker')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 sm:mb-4">{language === 'sw' ? 'Mawasiliano' : 'Contact'}</h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-300">
                <li className="flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>+254 XXX XXX XXX</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">info@paraboda.co.ke</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};