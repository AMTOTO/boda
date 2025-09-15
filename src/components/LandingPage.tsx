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
  Wallet
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage, languages } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const dashboardPreviews = [
    {
      title: '👩‍👧‍👦',
      subtitle: language === 'sw' ? 'Walezi' : 'Caregivers',
      icon: User,
      color: 'blue',
      path: '/community',
      emoji: '🏠',
      description: language === 'sw' ? 'Huduma za afya, usafiri, zawadi' : 'Health services, transport, rewards',
      bgGradient: 'from-blue-400 to-blue-600'
    },
    {
      title: '🏍️',
      subtitle: language === 'sw' ? 'ParaBodas' : 'ParaBodas',
      icon: Bike,
      color: 'orange',
      path: '/rider',
      emoji: '🚴‍♂️',
      description: language === 'sw' ? 'Safari, dharura, miradi ya vijana' : 'Rides, emergencies, youth programs',
      bgGradient: 'from-orange-400 to-orange-600'
    },
    {
      title: '❤️',
      subtitle: t('users.chvs'),
      icon: Heart,
      color: 'green',
      path: '/chv',
      emoji: '👩‍⚕️',
      description: language === 'sw' ? 'Kaya, idhini, tahadhari za afya' : 'Households, approvals, health alerts',
      bgGradient: 'from-green-400 to-green-600'
    },
    {
      title: '🩺',
      subtitle: t('users.health_workers'),
      icon: Stethoscope,
      color: 'purple',
      path: '/health-worker',
      emoji: '👨‍⚕️',
      description: language === 'sw' ? 'Wagonjwa, chanjo, skani QR' : 'Patients, vaccines, QR scanner',
      bgGradient: 'from-purple-400 to-purple-600'
    },
    {
      title: '⚙️',
      subtitle: t('users.admins'),
      icon: Shield,
      color: 'gray',
      path: '/admin',
      emoji: '👨‍💼',
      description: language === 'sw' ? 'Usimamizi wa mfumo' : 'System management',
      bgGradient: 'from-gray-400 to-gray-600'
    }
  ];

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
            <span className="text-4xl">🇰🇪</span>
            <span className="text-white font-bold text-lg hidden sm:inline">
              {language === 'sw' ? 'Chagua Lugha Yako' : 'Choose Your Language'}
            </span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl hover:bg-white/30 transition-all shadow-lg"
            >
              <Globe className="w-6 h-6 text-white" />
              <span className="text-white font-bold text-2xl">
                {languages.find(l => l.code === language)?.flag}
              </span>
              <span className="text-white font-bold hidden sm:inline text-lg">
                {languages.find(l => l.code === language)?.nativeName}
              </span>
            </button>

            {showLanguageDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-3 bg-white rounded-3xl shadow-2xl border-4 border-gray-200 overflow-hidden z-50 min-w-[350px] max-h-80 overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <h3 className="font-bold text-xl flex items-center space-x-3">
                    <Globe className="w-6 h-6" />
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
                    className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-5">
                      <span className="text-4xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="text-gray-900 font-bold text-xl">{lang.name}</div>
                        <div className="text-gray-600 text-lg">{lang.nativeName}</div>
                      </div>
                    </div>
                    {language === lang.code && (
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-3xl overflow-hidden shadow-xl border-4 border-yellow-400">
                <img 
                  src="/PARABODA LOGO.png" 
                  alt="ParaBoda Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900">ParaBoda</h1>
                <p className="text-lg lg:text-xl text-green-600 font-bold">
                  {language === 'sw' ? 'Afya Pamoja' : 'Health Together'}
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
                <span>{t('action.login')}</span>
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
                  <span>{t('action.login')}</span>
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
                src="/PARABODA LOGO.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
              {language === 'sw' ? 'Afya + Usafiri' : 'Health + Transport'}
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-600 font-bold mb-12 max-w-4xl mx-auto">
              {language === 'sw' ? 'Mfumo wa afya wa dijiti kwa jamii za Kenya' : 'Digital health ecosystem for Kenyan communities'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-6 rounded-3xl hover:from-green-600 hover:to-blue-600 transition-all font-black text-2xl shadow-2xl transform hover:scale-105 flex items-center space-x-4"
              >
                <span className="text-3xl">🚀</span>
                <span>{language === 'sw' ? 'ANZA SASA' : 'GET STARTED'}</span>
              </Link>
              <Link
                to="/auth"
                className="border-4 border-gray-700 text-gray-700 px-12 py-6 rounded-3xl hover:bg-gray-700 hover:text-white transition-all font-black text-2xl flex items-center space-x-4"
              >
                <span className="text-3xl">🔑</span>
                <span>{t('action.login')}</span>
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
              {language === 'sw' ? 'Chagua Jukumu Lako' : 'Choose Your Role'}
            </h2>
            <div className="inline-flex items-center space-x-4 bg-green-100 text-green-800 px-8 py-4 rounded-full text-xl font-bold">
              <span className="text-3xl">👁️</span>
              <span>{language === 'sw' ? 'Hakuna Haja ya Kuingia' : 'No Login Required'}</span>
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
                      <span>{language === 'sw' ? 'FUNGUA' : 'OPEN'}</span>
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
              {language === 'sw' ? 'Huduma Zetu' : 'Our Services'}
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
                {language === 'sw' ? 'Dharura' : 'Emergency'}
              </h3>
              <p className="text-gray-700 text-lg">
                {language === 'sw' ? 'Msaada wa haraka wa kiafya' : 'Rapid health assistance'}
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
                {language === 'sw' ? 'Usafiri' : 'Transport'}
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
                {language === 'sw' ? 'AI Msaidizi' : 'AI Assistant'}
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
              {language === 'sw' ? 'M-SUPU Pochi' : 'M-SUPU Wallet'}
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 font-bold mb-12">
              {language === 'sw' ? 'Fedha za jamii, mikopo, na akiba' : 'Community funds, loans, and savings'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-emerald-200">
                <Wallet className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'sw' ? 'Akiba za Jamii' : 'Community Savings'}
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
                  {language === 'sw' ? 'Zawadi' : 'Rewards'}
                </h3>
                <p className="text-gray-600">
                  {language === 'sw' ? 'Pata zawadi kwa ushiriki' : 'Earn rewards for participation'}
                </p>
              </div>
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
                : 'Join thousands of Kenyans using ParaBoda for health services'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="bg-white text-green-600 px-12 py-6 rounded-3xl hover:bg-gray-50 transition-colors font-black text-2xl shadow-2xl flex items-center justify-center space-x-4 transform hover:scale-105 animate-pulse-african"
              >
                <span className="text-4xl">✨</span>
                <span>{language === 'sw' ? 'ANZA SASA' : 'START NOW'}</span>
              </Link>
              <Link
                to="/auth"
                className="border-4 border-white text-white px-12 py-6 rounded-3xl hover:bg-white/10 transition-colors font-black text-2xl flex items-center justify-center space-x-4"
              >
                <span className="text-4xl">🔑</span>
                <span>{t('action.login')}</span>
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
                src="/PARABODA LOGO.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-3xl font-black">ParaBoda</span>
          </div>
          <div className="text-6xl mb-6 emoji-xl">❤️🏥🚴‍♂️</div>
          <p className="text-2xl font-bold text-yellow-400 mb-8">
            {language === 'sw' ? 'Afya Pamoja - Afya Pamoja' : 'Afya Pamoja - Health Together'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-lg">
            <div>
              <h3 className="font-bold mb-4">{language === 'sw' ? 'Huduma' : 'Services'}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{language === 'sw' ? 'Usafiri wa Dharura' : 'Emergency Transport'}</li>
                <li>{language === 'sw' ? 'Huduma za Afya' : 'Health Services'}</li>
                <li>{language === 'sw' ? 'AI Msaidizi' : 'AI Assistant'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{language === 'sw' ? 'Majukumu' : 'Roles'}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{language === 'sw' ? 'Walezi' : 'Caregivers'}</li>
                <li>{language === 'sw' ? 'Wasafiri' : 'Riders'}</li>
                <li>CHVs</li>
                <li>{language === 'sw' ? 'Wafanyakazi wa Afya' : 'Health Workers'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{language === 'sw' ? 'Wasiliana' : 'Contact'}</h3>
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