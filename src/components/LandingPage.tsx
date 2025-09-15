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
  Mail
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage, languages } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const dashboardPreviews = [
    {
      title: '👨‍👩‍👧‍👦',
      subtitle: language === 'sw' ? 'Walezi' : 'Caregivers',
      icon: User,
      color: 'emerald',
      path: '/community',
      emoji: '🏠',
      description: language === 'sw' ? 'Huduma za afya, usafiri, zawadi' : 'Health services, transport, rewards'
    },
    {
      title: '🏍️',
      subtitle: language === 'sw' ? 'ParaBodas' : 'ParaBodas',
      icon: Bike,
      color: 'orange',
      path: '/rider',
      emoji: '🚴‍♂️',
      description: language === 'sw' ? 'Safari, dharura, miradi ya vijana' : 'Rides, emergencies, youth programs'
    },
    {
      title: '❤️',
      subtitle: t('users.chvs'),
      icon: Heart,
      color: 'purple',
      path: '/chv',
      emoji: '👩‍⚕️',
      description: language === 'sw' ? 'Kaya, idhini, tahadhari za afya' : 'Households, approvals, health alerts'
    },
    {
      title: '🩺',
      subtitle: t('users.health_workers'),
      icon: Stethoscope,
      color: 'blue',
      path: '/health-worker',
      emoji: '👨‍⚕️',
      description: language === 'sw' ? 'Wagonjwa, chanjo, skani QR' : 'Patients, vaccines, QR scanner'
    },
    {
      title: '⚙️',
      subtitle: t('users.admins'),
      icon: Shield,
      color: 'gray',
      path: '/admin',
      emoji: '👨‍💼',
      description: language === 'sw' ? 'Usimamizi wa mfumo' : 'System management'
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
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-2xl overflow-hidden shadow-xl border-2 border-yellow-400">
                <img 
                  src="/Rider mother and child.jpg" 
                  alt="ParaBoda Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-black text-gray-900">ParaBoda</h1>
                <p className="text-xs lg:text-sm text-green-600 font-bold">
                  {language === 'sw' ? 'Afya Pamoja' : 'Health Together'}
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-8xl mb-6 emoji-2xl animate-bounce-gentle">🏥🏍️❤️</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              {language === 'sw' ? 'Afya + Usafiri' : 'Health + Transport'}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-bold mb-8">
              {language === 'sw' ? 'Mfumo wa afya wa dijiti kwa jamii' : 'Digital health system for communities'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Previews Section */}
      <section className="py-12 glass-effect relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4 emoji-xl animate-dance-african">👀</div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">
              {language === 'sw' ? 'Chagua Jukumu Lako' : 'Choose Your Role'}
            </h2>
            <div className="inline-flex items-center space-x-3 bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-bold">
              <span className="text-2xl">👁️</span>
              <span>{language === 'sw' ? 'Hakuna Haja ya Kuingia' : 'No Login Needed'}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {dashboardPreviews.map((dashboard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="icon-heavy-card animate-glow-african"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 emoji-xl animate-bounce-gentle">
                    {dashboard.emoji}
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br from-${dashboard.color}-400 to-${dashboard.color}-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl`}>
                    <dashboard.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    {dashboard.subtitle}
                  </h3>
                  <p className="text-base text-gray-600 mb-4 font-bold leading-relaxed">
                    {dashboard.description}
                  </p>
                  
                  <Link
                    to={dashboard.path}
                    className={`w-full bg-gradient-to-r from-${dashboard.color}-500 to-${dashboard.color}-600 text-white py-3 rounded-2xl hover:from-${dashboard.color}-600 hover:to-${dashboard.color}-700 transition-all font-black text-lg flex items-center justify-center space-x-3 shadow-xl group-hover:scale-105`}
                  >
                    <span className="text-xl">👆</span>
                    <span>{language === 'sw' ? 'FUNGUA' : 'OPEN'}</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Features Section */}
      <section className="py-12 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-4">
              {language === 'sw' ? 'Huduma Zetu' : 'Our Services'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center glass-effect p-6 rounded-3xl shadow-2xl">
              <div className="text-6xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'sw' ? 'Dharura' : 'Emergency'}
              </h3>
              <p className="text-gray-700">
                {language === 'sw' ? 'Msaada wa haraka wa kiafya' : 'Rapid health assistance'}
              </p>
            </div>
            
            <div className="text-center glass-effect p-6 rounded-3xl shadow-2xl">
              <div className="text-6xl mb-4">🏍️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'sw' ? 'Usafiri' : 'Transport'}
              </h3>
              <p className="text-gray-700">
                {language === 'sw' ? 'Usafiri wa afya wa haraka' : 'Fast health transport'}
              </p>
            </div>
            
            <div className="text-center glass-effect p-6 rounded-3xl shadow-2xl">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'sw' ? 'AI Msaidizi' : 'AI Assistant'}
              </h3>
              <p className="text-gray-700">
                {language === 'sw' ? 'Msaada wa akili bandia' : 'Intelligent health guidance'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-green-500 to-blue-500 relative">
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-6 emoji-2xl animate-bounce-gentle">🚀</div>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-6">
              {language === 'sw' ? 'Jiunge Leo!' : 'Join Today!'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-green-600 px-10 py-5 rounded-3xl hover:bg-gray-50 transition-colors font-black text-xl shadow-2xl flex items-center justify-center space-x-4 transform hover:scale-105 animate-pulse-african"
              >
                <span className="text-3xl">✨</span>
                <span>{language === 'sw' ? 'ANZA SASA' : 'START NOW'}</span>
              </Link>
              <Link
                to="/auth"
                className="border-4 border-white text-white px-10 py-5 rounded-3xl hover:bg-white/10 transition-colors font-black text-xl flex items-center justify-center space-x-4"
              >
                <span className="text-3xl">🔑</span>
                <span>{t('action.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 relative">
        <div className="absolute inset-0 pattern-kente opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-yellow-400">
              <img 
                src="/Rider mother and child.jpg" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-black">ParaBoda</span>
          </div>
          <div className="text-5xl mb-4 emoji-xl">❤️🏥🚴‍♂️</div>
          <p className="text-xl font-bold text-yellow-400">
            {language === 'sw' ? 'Afya Pamoja - Afya Pamoja' : 'Afya Pamoja - Health Together'}
          </p>
        </div>
      </footer>
    </div>
  );
};