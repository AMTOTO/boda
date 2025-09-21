import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Megaphone
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
      title: language === 'sw' ? 'Chanjo za HPV - Januari 2025' : 'HPV Vaccination Campaign - January 2025',
      message: language === 'sw' ? 'Chanjo za HPV kwa wasichana wa umri 9-14. Kituo cha afya cha karibu.' : 'HPV vaccines for girls aged 9-14. Visit your nearest health center.',
      priority: 'high',
      emoji: '💉'
    },
    {
      id: 2,
      type: 'outbreak',
      title: language === 'sw' ? 'Tahadhari ya Kipindupindu' : 'Cholera Alert',
      message: language === 'sw' ? 'Ongeza usafi. Tumia maji safi. Ripoti kesi za kuhara kwa CHV.' : 'Increase hygiene. Use clean water. Report diarrhea cases to CHV.',
      priority: 'critical',
      emoji: '🚨'
    },
    {
      id: 3,
      type: 'weather',
      title: language === 'sw' ? 'Msimu wa Mvua' : 'Rainy Season',
      message: language === 'sw' ? 'Tumia chandarua. Ondoa maji yaliyosimama. Zuia malaria.' : 'Use mosquito nets. Remove stagnant water. Prevent malaria.',
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
      bgGradient: 'from-blue-400 to-blue-600'
    },
    {
      title: '🏍️',
      subtitle: t('role.rider'),
      icon: Bike,
      color: 'orange',
      path: '/rider',
      emoji: '🚴‍♂️',
      description: t('role.rider_desc'),
      bgGradient: 'from-orange-400 to-orange-600'
    },
    {
      title: '❤️',
      subtitle: t('role.chv'),
      icon: Heart,
      color: 'green',
      path: '/chv',
      emoji: '👩‍⚕️',
      description: t('role.chv_desc'),
      bgGradient: 'from-green-400 to-green-600'
    },
    {
      title: '🩺',
      subtitle: t('role.health_worker'),
      icon: Stethoscope,
      color: 'purple',
      path: '/health-worker',
      emoji: '👨‍⚕️',
      description: t('role.health_worker_desc'),
      bgGradient: 'from-purple-400 to-purple-600'
    },
    {
      title: '⚙️',
      subtitle: t('role.admin'),
      icon: Shield,
      color: 'gray',
      path: '/admin',
      emoji: '👨‍💼',
      description: t('role.admin_desc'),
      bgGradient: 'from-gray-400 to-gray-600'
    }
  ];

  // Auto-scroll alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % publicAlerts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [publicAlerts.length]);

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
        <div className="pattern-mudcloth absolute inset-0"></div>
        <div className="pattern-tribal absolute inset-0"></div>
        <div className="pattern-african-geometric absolute inset-0"></div>
        <div className="pattern-baobab absolute inset-0"></div>
      </div>

      {/* Top Language Selector Bar */}
      <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 p-3 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">🌍</span>
            <span className="text-white font-bold text-lg hidden sm:inline">
              {t('landing.choose_language')}
            </span>
          </div>
          
          <LanguageSelector 
            position="inline"
            size="md"
            showLabel={true}
          />
        </div>
      </div>

      {/* Emergency Banner */}
      {showEmergencyBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 relative z-40 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {t('landing.emergency_banner')}
                </h3>
                <p className="text-red-100">
                  {language === 'sw' 
                    ? 'Ufikiaji wa haraka bila kuingia - bofya hapa kwa msaada wa dharura'
                    : 'Quick access without login - click here for emergency assistance'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/auth?emergency=true"
                className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <span className="text-2xl">🚨</span>
                <span>{language === 'sw' ? 'DHARURA' : 'EMERGENCY'}</span>
              </Link>
              <button
                onClick={() => setShowEmergencyBanner(false)}
                className="text-white/80 hover:text-white p-2"
                aria-label="Close emergency banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Public Health Alerts Carousel */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 relative z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-6 h-6" />
              <span className="font-bold">
                {language === 'sw' ? 'Matangazo ya Afya' : 'Health Announcements'}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <motion.div
                key={currentAlert}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center space-x-3"
              >
                <span className="text-2xl">{publicAlerts[currentAlert].emoji}</span>
                <div>
                  <span className="font-bold">{publicAlerts[currentAlert].title}</span>
                  <span className="ml-2 opacity-90">{publicAlerts[currentAlert].message}</span>
                </div>
              </motion.div>
            </div>
            <div className="flex space-x-1">
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

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border-b-4 border-yellow-400 sticky top-0 z-40 relative"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-3xl overflow-hidden shadow-xl border-4 border-yellow-400">
                <img 
                  src="https://i.imgur.com/mIUhG65.png" 
                  alt="ParaBoda Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
                  {t('landing.title')}
                </h1>
                <p className="text-lg lg:text-xl text-green-600 font-bold">
                  {t('landing.subtitle')}
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link 
                to="/auth"
                className="flex items-center space-x-3 lg:space-x-4 text-gray-700 hover:text-gray-900 font-bold transition-colors px-6 lg:px-8 py-4 lg:py-5 rounded-3xl hover:bg-yellow-100 text-xl lg:text-2xl"
              >
                <span className="text-2xl lg:text-3xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
              <Link 
                to="/register"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 lg:px-10 py-4 lg:py-5 rounded-3xl hover:from-green-600 hover:to-blue-600 transition-all font-black text-xl lg:text-2xl shadow-2xl transform hover:scale-105 flex items-center space-x-3 lg:space-x-4"
              >
                <span className="text-2xl lg:text-3xl">✨</span>
                <span>{t('action.register')}</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-4 lg:p-5 rounded-3xl text-gray-600 hover:text-gray-900 hover:bg-yellow-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-8 h-8 lg:w-10 lg:h-10" /> : <Menu className="w-8 h-8 lg:w-10 lg:h-10" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t-4 border-yellow-300 py-8"
            >
              <div className="flex flex-col space-y-6">
                <Link 
                  to="/auth"
                  className="flex items-center justify-center space-x-5 text-gray-700 hover:text-gray-900 font-bold transition-colors px-8 py-5 rounded-3xl hover:bg-yellow-100 text-2xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-4xl">🔑</span>
                  <span>{t('landing.login')}</span>
                </Link>
                <Link 
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-10 py-5 rounded-3xl hover:from-green-600 hover:to-blue-600 transition-all font-black text-2xl shadow-2xl flex items-center justify-center space-x-5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-4xl">✨</span>
                  <span>{t('action.register')}</span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl border-8 border-yellow-400">
              <img 
                src="https://i.imgur.com/mIUhG65.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
              {t('landing.title')} + {t('service.transport')}
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-600 font-bold mb-12 max-w-4xl mx-auto">
              {t('landing.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-6 rounded-3xl hover:from-green-600 hover:to-blue-600 transition-all font-black text-2xl shadow-2xl transform hover:scale-105 flex items-center space-x-4"
              >
                <span className="text-3xl">🚀</span>
                <span>{t('landing.get_started')}</span>
              </Link>
              <Link
                to="/auth"
                className="border-4 border-gray-700 text-gray-700 px-12 py-6 rounded-3xl hover:bg-gray-700 hover:text-white transition-all font-black text-2xl flex items-center space-x-4"
              >
                <span className="text-3xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Previews Section */}
      <section className="py-16 glass-effect relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="text-8xl mb-6 emoji-xl animate-dance-african">👀</div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8">
              {t('landing.choose_role')}
            </h2>
            <div className="inline-flex items-center space-x-4 bg-green-100 text-green-800 px-8 py-4 rounded-full text-xl font-bold">
              <span className="text-3xl">👁️</span>
              <span>{t('landing.no_login_required')}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {dashboardPreviews.map((dashboard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <div className={`bg-gradient-to-r ${dashboard.bgGradient} p-6 text-white`}>
                    <div className="text-center">
                      <div className="text-6xl mb-4 emoji-xl animate-bounce-gentle">
                        {dashboard.emoji}
                      </div>
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl">
                        <dashboard.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 text-center">
                      {dashboard.subtitle}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 font-bold leading-relaxed text-center">
                      {dashboard.description}
                    </p>
                    
                    <Link
                      to={dashboard.path}
                      className={`w-full bg-gradient-to-r ${dashboard.bgGradient} text-white py-4 rounded-2xl hover:shadow-xl transition-all font-black text-xl flex items-center justify-center space-x-3 group-hover:scale-105`}
                    >
                      <span className="text-2xl">👆</span>
                      <span>{t('action.open')}</span>
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-6">
              {t('nav.services', { defaultValue: 'Our Services' })}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center glass-effect p-8 rounded-3xl shadow-2xl"
            >
              <div className="text-8xl mb-6">🚨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('emergency.title')}
              </h3>
              <p className="text-gray-700 text-lg">
                {t('emergency.request_help')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center glass-effect p-8 rounded-3xl shadow-2xl"
            >
              <div className="text-8xl mb-6">🏍️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('service.transport')}
              </h3>
              <p className="text-gray-700 text-lg">
                {language === 'sw' ? 'Usafiri wa afya wa haraka' : 'Fast health transport'}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center glass-effect p-8 rounded-3xl shadow-2xl"
            >
              <div className="text-8xl mb-6">🧠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('service.ai_assistant')}
              </h3>
              <p className="text-gray-700 text-lg">
                {language === 'sw' ? 'Msaada wa akili bandia' : 'Intelligent health guidance'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* M-SUPU Wallet Feature */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50 relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-8xl mb-8 emoji-2xl animate-shimmer-gold">💰</div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8">
              {t('wallet.title')}
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 font-bold mb-12">
              {language === 'sw' 
                ? 'Fedha za jamii, mikopo, na akiba' 
                : 'Community funds, loans, and savings'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-emerald-200">
                <Wallet className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('wallet.savings')}
                </h3>
                <p className="text-gray-600">
                  {language === 'sw' ? 'Okoa pamoja na jamii' : 'Save together as a community'}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-200">
                <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'sw' ? 'Mikopo ya Afya' : 'Health Loans'}
                </h3>
                <p className="text-gray-600">
                  {language === 'sw' ? 'Mikopo ya matibabu na usafiri' : 'Medical and transport loans'}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-purple-200">
                <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('wallet.rewards')}
                </h3>
                <p className="text-gray-600">
                  {language === 'sw' ? 'Pata zawadi kwa ushiriki' : 'Earn rewards for participation'}
                </p>
              </div>
            </div>

            {/* Quick Access to Wallet */}
            <div className="mt-12">
              <Link
                to="/wallet"
                className="inline-flex items-center space-x-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all font-bold text-xl shadow-xl transform hover:scale-105"
              >
                <Wallet className="w-6 h-6" />
                <span>{language === 'sw' ? 'Fungua Pochi' : 'Open Wallet'}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-blue-500 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-8xl mb-8 emoji-2xl animate-bounce-gentle">🚀</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-8">
              {language === 'sw' ? 'Jiunge Leo!' : 'Join Today!'}
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 font-bold">
              {language === 'sw' 
                ? 'Jiunge na maelfu ya wakenya wanaotumia ParaBoda kwa huduma za afya' 
                : 'Join thousands of East Africans using ParaBoda for health services'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="bg-white text-green-600 px-12 py-6 rounded-3xl hover:bg-gray-50 transition-colors font-black text-2xl shadow-2xl flex items-center justify-center space-x-4 transform hover:scale-105 animate-pulse-african"
              >
                <span className="text-4xl">✨</span>
                <span>{t('landing.get_started')}</span>
              </Link>
              <Link
                to="/auth"
                className="border-4 border-white text-white px-12 py-6 rounded-3xl hover:bg-white/10 transition-colors font-black text-2xl flex items-center justify-center space-x-4"
              >
                <span className="text-4xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative">
        <div className="absolute inset-0 pattern-kente opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="w-16 h-16 rounded-3xl overflow-hidden border-4 border-yellow-400">
              <img 
                src="https://i.imgur.com/mIUhG65.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-3xl font-black">{t('landing.title')}</span>
          </div>
          <div className="text-6xl mb-6 emoji-xl">❤️🏥🚴‍♂️</div>
          <p className="text-2xl font-bold text-yellow-400 mb-8">
            {t('landing.subtitle')} - {t('landing.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-lg">
            <div>
              <h3 className="font-bold mb-4">{t('nav.services', { defaultValue: 'Services' })}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{t('emergency.transport')}</li>
                <li>{t('service.health')}</li>
                <li>{t('service.ai_assistant')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t('nav.roles', { defaultValue: 'Roles' })}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{t('role.caregiver')}</li>
                <li>{t('role.rider')}</li>
                <li>CHVs</li>
                <li>{t('role.health_worker')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t('nav.contact', { defaultValue: 'Contact' })}</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>+254 XXX XXX XXX</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>info@paraboda.co.ke</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};