import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
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
  ChevronDown,
  ChevronDown,
  Wallet,
  Sun,
  Moon
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const { t, language, setLanguage, languages } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const dashboardPreviews = [
    {
      title: 'Caregiver',
      subtitle: language === 'sw' ? 'Mwanajamii' : 'Community Member',
      icon: User,
      color: 'emerald',
      path: '/community',
      emoji: '🏠',
      description: language === 'sw' ? 'Huduma za afya, usafiri, na zawadi' : 'Health services, transport, and rewards'
    },
    {
      title: 'CHV',
      subtitle: language === 'sw' ? 'Mjumbe wa Afya ya Jamii' : 'Community Health Volunteer',
      icon: Heart,
      color: 'green',
      path: '/chv',
      emoji: '❤️',
      description: language === 'sw' ? 'Usimamizi wa afya ya jamii' : 'Community health management'
    },
    {
      title: 'Health Worker',
      subtitle: language === 'sw' ? 'Mfanyakazi wa Afya' : 'Health Professional',
      icon: Stethoscope,
      color: 'teal',
      path: '/health-worker',
      emoji: '🩺',
      description: language === 'sw' ? 'Huduma za kimatibabu' : 'Medical services'
    },
    {
      title: 'Rider',
      subtitle: language === 'sw' ? 'Msafiri wa ParaBoda' : 'ParaBoda Operator',
      icon: Bike,
      color: 'orange',
      path: '/rider',
      emoji: '🚴‍♂️',
      description: language === 'sw' ? 'Usafiri, dharura, na miradi ya vijana' : 'Transport, emergency, and youth programs'
    },
    {
      title: 'M-SUPU',
      subtitle: language === 'sw' ? 'Pochi ya Jamii' : 'Community Wallet',
      icon: Wallet,
      color: 'purple',
      path: '/msupu',
      emoji: '💳',
      description: language === 'sw' ? 'Mikopo, akiba, na michango' : 'Loans, savings, and contributions'
    },
    {
      title: 'Admin',
      subtitle: language === 'sw' ? 'Msimamizi wa Mfumo' : 'System Administrator',
      icon: Shield,
      color: 'gray',
      path: '/admin',
      emoji: '👨‍💼',
      description: language === 'sw' ? 'Usimamizi wa mfumo' : 'System management'
    }
  ];

  const loginMethods = [
    {
      title: language === 'sw' ? 'Kuingia kwa Haraka' : 'Quick Login',
      description: language === 'sw' ? 'Bofya jukumu lako kuingia moja kwa moja' : 'Click your role to login instantly',
      icon: Zap,
      color: 'emerald',
      emoji: '⚡'
    },
    {
      title: language === 'sw' ? 'Kuingia kwa QR Code' : 'QR Code Login',
      description: language === 'sw' ? 'Skani QR code yako ya kuingia' : 'Scan your login QR code',
      icon: QrCode,
      color: 'blue',
      emoji: '📱'
    },
    {
      title: language === 'sw' ? 'Kuingia kwa Fomu' : 'Form Login',
      description: language === 'sw' ? 'Tumia barua pepe na nenosiri' : 'Use email and password',
      icon: User,
      color: 'purple',
      emoji: '📝'
    }
  ];

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 relative overflow-hidden">
      {/* African Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="kenyan-stripe absolute top-0 left-0 right-0"></div>
        <div className="kenyan-stripe absolute bottom-0 left-0 right-0"></div>
        <div className="pattern-kente absolute inset-0"></div>
        <div className="pattern-mudcloth absolute inset-0"></div>
        <div className="pattern-tribal absolute inset-0"></div>
        <div className="pattern-african-geometric absolute inset-0"></div>
        <div className="pattern-baobab absolute inset-0"></div>
      </div>

      {/* Top Language Selector Bar */}
      <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 p-2 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🇰🇪</span>
            <span className="text-white font-bold text-sm hidden sm:inline">
              {language === 'sw' ? 'Chagua Lugha Yako' : 'Choose Your Language'}
            </span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all"
            >
              <Globe className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-lg">
                {languages.find(l => l.code === language)?.flag}
              </span>
              <span className="text-white font-bold hidden sm:inline">
                {languages.find(l => l.code === language)?.nativeName}
              </span>
            </button>

            {showLanguageDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border-4 border-gray-200 overflow-hidden z-50 min-w-[320px] max-h-80 overflow-y-auto"
              >
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <h3 className="font-bold text-lg flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Choose Language / Chagua Lugha</span>
                  </h3>
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="text-gray-900 font-bold text-lg">{lang.name}</div>
                        <div className="text-gray-600 text-sm">{lang.nativeName}</div>
                      </div>
                    </div>
                    {language === lang.code && (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border-b-4 border-yellow-400 sticky top-0 z-40 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Reduced size motorcycle photo logo */}
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-2xl overflow-hidden shadow-xl border-2 border-yellow-400">
                <img 
                  src="/Rider mother and child.jpg" 
                  alt="ParaBoda Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <div className="relative">
                <button
                  onClick={() => setShowDashboardDropdown(!showDashboardDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-bold transition-colors px-4 lg:px-6 py-3 lg:py-4 rounded-2xl hover:bg-yellow-100 text-lg lg:text-xl"
                >
                  <span className="text-xl lg:text-2xl">🏥</span>
                  <span>{language === 'sw' ? 'Dashibodi' : 'Dashboards'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showDashboardDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[300px]"
                  >
                    {dashboardPreviews.map((dashboard) => (
                      <Link
                        key={dashboard.path}
                        to={dashboard.path}
                        onClick={() => setShowDashboardDropdown(false)}
                        className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-2xl">{dashboard.emoji}</span>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{dashboard.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{dashboard.subtitle}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-3 lg:p-4 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-yellow-100 transition-colors"
              >
                {isDarkMode ? <Sun className="w-6 h-6 lg:w-8 lg:h-8" /> : <Moon className="w-6 h-6 lg:w-8 lg:h-8" />}
              </button>

              <Link 
                to="/auth"
                className="flex items-center space-x-2 lg:space-x-3 text-gray-700 hover:text-gray-900 font-bold transition-colors px-4 lg:px-6 py-3 lg:py-4 rounded-2xl hover:bg-yellow-100 text-lg lg:text-xl"
              >
                <span className="text-xl lg:text-2xl">🔑</span>
                <span>{t('action.login')}</span>
              </Link>
              <Link 
                to="/register"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all font-black text-lg lg:text-xl shadow-2xl transform hover:scale-105 flex items-center space-x-2 lg:space-x-3"
              >
                <span className="text-xl lg:text-2xl">✨</span>
                <span>{t('action.register')}</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 lg:p-4 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-yellow-100 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6 lg:w-8 lg:h-8" /> : <Menu className="w-6 h-6 lg:w-8 lg:h-8" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t-4 border-yellow-300 py-6"
            >
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/auth"
                  className="flex items-center justify-center space-x-4 text-gray-700 hover:text-gray-900 font-bold transition-colors px-6 py-4 rounded-2xl hover:bg-yellow-100 text-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-3xl">🔑</span>
                  <span>{t('action.login')}</span>
                </Link>
                <Link 
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all font-black text-xl shadow-2xl flex items-center justify-center space-x-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-3xl">✨</span>
                  <span>{t('action.register')}</span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-8 lg:py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-4xl lg:text-6xl mb-4 lg:mb-6 emoji-2xl animate-bounce-gentle">🏥🏍️❤️</div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-gray-900 mb-4 lg:mb-6 leading-tight heading-1">
              {language === 'sw' ? 'Afya + Usafiri' : 'Health + Transport'}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
              <Link
                to="/register"
                className="btn-african animate-pulse-african"
              >
                <span className="text-2xl lg:text-3xl">🚀</span>
                <span>{language === 'sw' ? 'ANZA' : 'START'}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Easy Login Methods Section */}
      <section className="py-8 lg:py-12 glass-effect relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 lg:mb-12"
          >
            <div className="text-3xl lg:text-5xl mb-3 lg:mb-4 emoji-xl animate-dance-african">🔑</div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-900 mb-4 lg:mb-6 heading-2">
              {language === 'sw' ? 'Njia Rahisi za Kuingia' : 'Easy Login Methods'}
            </h2>
            <p className="text-base lg:text-lg text-gray-600 font-bold max-w-3xl mx-auto body-large">
              {language === 'sw' 
                ? 'Chagua njia yoyote ya kuingia - haraka, rahisi, na salama'
                : 'Choose any login method - fast, easy, and secure'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
            {loginMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="icon-heavy-card animate-glow-african"
              >
                <div className="text-center">
                  <div className="text-4xl lg:text-6xl mb-3 lg:mb-4 emoji-xl">
                    {method.emoji}
                  </div>
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-${method.color}-400 to-${method.color}-600 rounded-2xl flex items-center justify-center mb-3 lg:mb-4 mx-auto shadow-xl`}>
                    <method.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-black text-gray-900 mb-2 lg:mb-3">
                    {method.title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4 font-bold leading-relaxed">
                    {method.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/auth"
              className="icon-heavy-button animate-shimmer-gold"
            >
              <span className="text-2xl lg:text-3xl">🚀</span>
              <span>{language === 'sw' ? 'ANZA KUINGIA' : 'START LOGIN'}</span>
              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Previews Section */}
      <section className="py-8 lg:py-12 glass-effect relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 lg:mb-12"
          >
            <div className="text-3xl lg:text-5xl mb-3 lg:mb-4 emoji-xl animate-dance-african">👀</div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-900 mb-4 lg:mb-6 heading-2">
              {t('welcome.choose_role')}
            </h2>
            <div className="inline-flex items-center space-x-3 lg:space-x-4 bg-green-100 text-green-800 px-4 lg:px-6 py-2 lg:py-3 rounded-full text-base lg:text-lg font-bold">
              <span className="text-lg lg:text-xl">👁️</span>
              <span>{language === 'sw' ? 'Hakuna Haja ya Kuingia' : 'No Login Needed'}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-8">
            {dashboardPreviews.map((dashboard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all group"
              >
                <div className="text-center">
                  <div className="text-5xl lg:text-6xl mb-4 lg:mb-6 emoji-xl animate-bounce-gentle">
                    {dashboard.emoji}
                  </div>
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-${dashboard.color}-400 to-${dashboard.color}-600 rounded-2xl flex items-center justify-center mb-3 lg:mb-4 mx-auto shadow-xl`}>
                    <dashboard.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-2 lg:mb-3">
                    {dashboard.title}
                  </h3>
                  <h4 className="text-sm lg:text-base font-bold text-gray-600 dark:text-gray-400 mb-3 lg:mb-4">
                    {dashboard.subtitle}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 font-bold leading-relaxed">
                    {dashboard.description}
                  </p>
                  
                  <Link
                    to={dashboard.path}
                    className={`w-full bg-gradient-to-r from-${dashboard.color}-500 to-${dashboard.color}-600 text-white py-3 lg:py-4 rounded-2xl hover:from-${dashboard.color}-600 hover:to-${dashboard.color}-700 transition-all font-black text-base lg:text-lg flex items-center justify-center space-x-2 lg:space-x-3 shadow-xl group-hover:scale-105`}
                  >
                    <span className="text-lg lg:text-xl">👆</span>
                    <span>{language === 'sw' ? 'INGIA' : 'ENTER'}</span>
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 lg:py-12 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center glass-effect p-4 lg:p-6 rounded-3xl shadow-2xl"
            >
              <div className="text-3xl lg:text-5xl mb-2 lg:mb-3 emoji-xl">👥</div>
              <div className="text-xl lg:text-3xl font-black text-purple-600 mb-1">15K+</div>
              <div className="text-sm lg:text-base font-bold text-gray-700">
                {language === 'sw' ? 'Watu' : 'People'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center glass-effect p-4 lg:p-6 rounded-3xl shadow-2xl"
            >
              <div className="text-3xl lg:text-5xl mb-2 lg:mb-3 emoji-xl">🏍️</div>
              <div className="text-xl lg:text-3xl font-black text-orange-600 mb-1">2.5K+</div>
              <div className="text-sm lg:text-base font-bold text-gray-700">
                {language === 'sw' ? 'Wasafiri' : 'Riders'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center glass-effect p-4 lg:p-6 rounded-3xl shadow-2xl"
            >
              <div className="text-3xl lg:text-5xl mb-2 lg:mb-3 emoji-xl">👩‍⚕️</div>
              <div className="text-xl lg:text-3xl font-black text-blue-600 mb-1">500+</div>
              <div className="text-sm lg:text-base font-bold text-gray-700">
                {language === 'sw' ? 'Madaktari' : 'Doctors'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center glass-effect p-4 lg:p-6 rounded-3xl shadow-2xl"
            >
              <div className="text-3xl lg:text-5xl mb-2 lg:mb-3 emoji-xl">✅</div>
              <div className="text-xl lg:text-3xl font-black text-green-600 mb-1">95%</div>
              <div className="text-sm lg:text-base font-bold text-gray-700">
                {language === 'sw' ? 'Mafanikio' : 'Success'}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 lg:py-12 glass-effect relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-3xl lg:text-5xl mb-4 lg:mb-6 emoji-xl animate-bounce-gentle">📞</div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-4 lg:mb-6 heading-2">
              {language === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="icon-heavy-card">
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">
                  {language === 'sw' ? 'Simu' : 'Phone'}
                </h3>
                <p className="text-green-600 font-bold">+254 700 123 456</p>
              </div>
              <div className="icon-heavy-card">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">
                  {language === 'sw' ? 'Barua Pepe' : 'Email'}
                </h3>
                <p className="text-blue-600 font-bold">info@paraboda.co.ke</p>
              </div>
              <div className="icon-heavy-card">
                <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">
                  {language === 'sw' ? 'Mahali' : 'Location'}
                </h3>
                <p className="text-purple-600 font-bold">Nairobi, Kenya</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 lg:py-12 bg-gradient-to-r from-green-500 to-blue-500 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl lg:text-6xl mb-4 lg:mb-6 emoji-2xl animate-bounce-gentle">🚀</div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-white mb-4 lg:mb-6 heading-2">
              {language === 'sw' ? 'Jiunge Leo!' : 'Join Today!'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-green-600 px-6 lg:px-10 py-3 lg:py-5 rounded-3xl hover:bg-gray-50 transition-colors font-black text-lg lg:text-xl shadow-2xl flex items-center justify-center space-x-3 lg:space-x-4 transform hover:scale-105 animate-pulse-african"
              >
                <span className="text-2xl lg:text-3xl">✨</span>
                <span>{language === 'sw' ? 'ANZA SASA' : 'START NOW'}</span>
              </Link>
              <Link
                to="/auth"
                className="border-4 border-white text-white px-6 lg:px-10 py-3 lg:py-5 rounded-3xl hover:bg-white/10 transition-colors font-black text-lg lg:text-xl flex items-center justify-center space-x-3 lg:space-x-4"
              >
                <span className="text-2xl lg:text-3xl">🔑</span>
                <span>{t('action.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 lg:py-8 relative">
        <div className="absolute inset-0 pattern-kente opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 lg:space-x-4 mb-4 lg:mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-2xl overflow-hidden border-2 border-yellow-400">
              <img 
                src="/Rider mother and child.jpg" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl lg:text-2xl font-black">ParaBoda</span>
          </div>
          <div className="text-3xl lg:text-5xl mb-3 lg:mb-4 emoji-xl">❤️🏥🚴‍♂️</div>
          <p className="text-lg lg:text-xl font-bold text-yellow-400">
            {language === 'sw' ? 'Afya Pamoja - Afya Pamoja' : 'Afya Pamoja - Health Together'}
          </p>
        </div>
      </footer>
    </div>
  );
};