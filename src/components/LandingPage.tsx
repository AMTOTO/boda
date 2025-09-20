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
  Megaphone,
  Brain,
  Car,
  Baby,
  Activity,
  TrendingUp,
  DollarSign,
  PiggyBank
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
      bgGradient: 'from-blue-500 to-blue-600',
      features: [
        language === 'sw' ? 'Huduma za afya' : 'Health services',
        language === 'sw' ? 'Usafiri wa dharura' : 'Emergency transport',
        language === 'sw' ? 'Pochi ya M-SUPU' : 'M-SUPU wallet'
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
      bgGradient: 'from-green-500 to-green-600',
      features: [
        language === 'sw' ? 'Usimamizi wa kaya' : 'Household management',
        language === 'sw' ? 'Idhini ya usafiri' : 'Transport approval',
        language === 'sw' ? 'Tahadhari za afya' : 'Health alerts'
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
      bgGradient: 'from-purple-500 to-purple-600',
      features: [
        language === 'sw' ? 'Usimamizi wa wagonjwa' : 'Patient management',
        language === 'sw' ? 'Chanjo na dawa' : 'Vaccines & medicine',
        language === 'sw' ? 'Rekodi za afya' : 'Health records'
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
      bgGradient: 'from-orange-500 to-orange-600',
      features: [
        language === 'sw' ? 'Maombi ya usafiri' : 'Transport requests',
        language === 'sw' ? 'Ramani ya wakati halisi' : 'Real-time mapping',
        language === 'sw' ? 'Mapato na pointi' : 'Earnings & points'
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
      bgGradient: 'from-gray-500 to-gray-600',
      features: [
        language === 'sw' ? 'Usimamizi wa mfumo' : 'System management',
        language === 'sw' ? 'Uchanganuzi wa data' : 'Data analytics',
        language === 'sw' ? 'Usimamizi wa watumiaji' : 'User management'
      ]
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Modern geometric background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-pink-400 to-red-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-600 rounded-full blur-3xl"></div>
      </div>

      {/* Top Language Selector Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 relative z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30">
              <img 
                src="/PARABODA LOGO.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-black">ParaBoda</h1>
              <p className="text-sm opacity-90">{t('landing.choose_language')}</p>
            </div>
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
          className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 relative z-40 shadow-xl"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">
                  {t('landing.emergency_banner')}
                </h3>
                <p className="text-red-100 text-lg">
                  {language === 'sw' 
                    ? 'Ufikiaji wa haraka bila kuingia - bofya hapa kwa msaada wa dharura'
                    : 'Quick access without login - click here for emergency assistance'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/auth?emergency=true"
                className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black hover:bg-red-50 transition-all transform hover:scale-105 shadow-xl flex items-center space-x-3"
              >
                <span className="text-3xl">🚨</span>
                <span className="text-xl">{language === 'sw' ? 'DHARURA' : 'EMERGENCY'}</span>
              </Link>
              <button
                onClick={() => setShowEmergencyBanner(false)}
                className="text-white/80 hover:text-white p-3 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Close emergency banner"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Public Health Alerts Carousel */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative z-30 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Megaphone className="w-8 h-8" />
              <span className="font-black text-xl">
                {language === 'sw' ? 'Matangazo ya Afya' : 'Health Announcements'}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <motion.div
                key={currentAlert}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center space-x-4"
              >
                <span className="text-3xl">{publicAlerts[currentAlert].emoji}</span>
                <div>
                  <span className="font-bold text-lg">{publicAlerts[currentAlert].title}</span>
                  <span className="ml-3 opacity-90">{publicAlerts[currentAlert].message}</span>
                </div>
              </motion.div>
            </div>
            <div className="flex space-x-2">
              {publicAlerts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAlert(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentAlert ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`View alert ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-40 h-40 lg:w-48 lg:h-48 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm">
              <img 
                src="/PARABODA LOGO.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ParaBoda
              </span>
            </h1>
            <p className="text-3xl lg:text-4xl text-green-600 font-black mb-8">
              {t('landing.subtitle')}
            </p>
            <p className="text-xl lg:text-2xl text-gray-700 font-bold mb-12 max-w-4xl mx-auto leading-relaxed">
              {t('landing.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-6 rounded-3xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all font-black text-2xl shadow-2xl transform hover:scale-105 flex items-center space-x-4"
              >
                <span className="text-4xl">🚀</span>
                <span>{t('landing.get_started')}</span>
              </Link>
              <Link
                to="/auth"
                className="border-4 border-gray-700 text-gray-700 px-12 py-6 rounded-3xl hover:bg-gray-700 hover:text-white transition-all font-black text-2xl flex items-center space-x-4 shadow-xl"
              >
                <span className="text-4xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Previews Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="text-8xl mb-8 animate-bounce">👀</div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8">
              {t('landing.choose_role')}
            </h2>
            <div className="inline-flex items-center space-x-4 bg-green-100 text-green-800 px-8 py-4 rounded-full text-xl font-bold shadow-xl">
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
                className="group h-full"
              >
                <div className="flex flex-col bg-white rounded-3xl shadow-xl border-4 border-gray-100 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full overflow-hidden">
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${dashboard.bgGradient} p-6 text-white text-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="text-6xl mb-4">{dashboard.emoji}</div>
                      <h3 className="text-xl font-black mb-2">{dashboard.subtitle}</h3>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 text-center mb-6 flex-1">
                      {dashboard.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2 mb-6">
                      {dashboard.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    <Link
                      to={dashboard.path}
                      className={`bg-gradient-to-r ${dashboard.bgGradient} text-white font-bold py-4 px-6 rounded-2xl transition-all hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3 group-hover:from-${dashboard.color}-600 group-hover:to-${dashboard.color}-700`}
                    >
                      <span className="text-2xl">👉</span>
                      <span>{t('action.open')}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-8">
              {language === 'sw' ? 'Huduma Zetu' : 'Our Services'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center bg-white/20 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/30"
            >
              <div className="text-8xl mb-6">🚨</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('emergency.title')}
              </h3>
              <p className="text-white/90 text-lg">
                {t('emergency.request_help')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center bg-white/20 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/30"
            >
              <div className="text-8xl mb-6">🏍️</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('service.transport')}
              </h3>
              <p className="text-white/90 text-lg">
                {language === 'sw' ? 'Usafiri wa afya wa haraka' : 'Fast health transport'}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center bg-white/20 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/30"
            >
              <div className="text-8xl mb-6">🧠</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('service.ai_assistant')}
              </h3>
              <p className="text-white/90 text-lg">
                {language === 'sw' ? 'Msaada wa akili bandia' : 'Intelligent health guidance'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* M-SUPU Wallet Feature */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-emerald-100 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-8xl mb-8 animate-pulse">💰</div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8">
              {t('wallet.title')}
            </h2>
            <p className="text-2xl lg:text-3xl text-gray-700 font-bold mb-16">
              {language === 'sw' 
                ? 'Fedha za jamii, mikopo, na akiba' 
                : 'Community funds, loans, and savings'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-teal-200 hover:border-teal-400 transition-all transform hover:scale-105">
                <PiggyBank className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('wallet.savings')}
                </h3>
                <p className="text-gray-600">
                  {language === 'sw' ? 'Okoa pamoja na jamii' : 'Save together as a community'}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-200 hover:border-blue-400 transition-all transform hover:scale-105">
                <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'sw' ? 'Mikopo ya Afya' : 'Health Loans'}
                </h3>
                <p className="text-gray-600">
                  {language === 'sw' ? 'Mikopo ya matibabu na usafiri' : 'Medical and transport loans'}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-purple-200 hover:border-purple-400 transition-all transform hover:scale-105">
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/wallet"
                className="inline-flex items-center space-x-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-10 py-5 rounded-2xl hover:from-teal-700 hover:to-emerald-700 transition-all font-bold text-xl shadow-xl transform hover:scale-105"
              >
                <Wallet className="w-8 h-8" />
                <span>{language === 'sw' ? 'Fungua Pochi' : 'Open Wallet'}</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center space-x-4 border-4 border-teal-600 text-teal-600 px-10 py-5 rounded-2xl hover:bg-teal-600 hover:text-white transition-all font-bold text-xl shadow-xl"
              >
                <User className="w-8 h-8" />
                <span>{language === 'sw' ? 'Ingia Sasa' : 'Login Now'}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-8">
              {language === 'sw' ? 'Athari Yetu' : 'Our Impact'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-blue-400 mb-2">1,247</div>
              <p className="text-xl font-bold">{language === 'sw' ? 'Watumiaji Hai' : 'Active Users'}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-green-400 mb-2">2,450</div>
              <p className="text-xl font-bold">{language === 'sw' ? 'Safari Zilizokamilika' : 'Completed Rides'}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-purple-400 mb-2">156</div>
              <p className="text-xl font-bold">{language === 'sw' ? 'Mikopo Iliyotolewa' : 'Loans Issued'}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-orange-400 mb-2">89%</div>
              <p className="text-xl font-bold">{language === 'sw' ? 'Kiwango cha Kulipa' : 'Repayment Rate'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto text-center px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-8xl mb-8 animate-bounce">🚀</div>
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-8">
              {language === 'sw' ? 'Jiunge Leo!' : 'Join Today!'}
            </h2>
            <p className="text-2xl lg:text-3xl text-white/90 mb-12 font-bold">
              {language === 'sw' 
                ? 'Jiunge na maelfu ya wakenya wanaotumia ParaBoda kwa huduma za afya' 
                : 'Join thousands of Kenyans using ParaBoda for health services'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-12 py-6 rounded-3xl hover:bg-gray-50 transition-all font-black text-2xl shadow-2xl flex items-center justify-center space-x-4 transform hover:scale-105"
              >
                <span className="text-4xl">✨</span>
                <span>{t('landing.get_started')}</span>
              </Link>
              <Link
                to="/auth"
                className="border-4 border-white text-white px-12 py-6 rounded-3xl hover:bg-white/10 transition-all font-black text-2xl flex items-center justify-center space-x-4"
              >
                <span className="text-4xl">🔑</span>
                <span>{t('landing.login')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white/30">
              <img 
                src="/PARABODA LOGO.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-4xl font-black">{t('landing.title')}</span>
          </div>
          <div className="text-6xl mb-6">❤️🏥🚴‍♂️</div>
          <p className="text-2xl font-bold text-blue-400 mb-8">
            {t('landing.subtitle')} - {language === 'sw' ? 'Afya Pamoja' : 'Health Together'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-lg">
            <div>
              <h3 className="font-bold mb-4 text-xl">{language === 'sw' ? 'Huduma' : 'Services'}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{t('emergency.transport')}</li>
                <li>{t('service.health')}</li>
                <li>{t('service.ai_assistant')}</li>
                <li>{t('wallet.title')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-xl">{language === 'sw' ? 'Majukumu' : 'Roles'}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{t('role.caregiver')}</li>
                <li>{t('role.rider')}</li>
                <li>CHVs</li>
                <li>{t('role.health_worker')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-xl">{language === 'sw' ? 'Mawasiliano' : 'Contact'}</h3>
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
          
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400">
              © 2025 ParaBoda. {language === 'sw' ? 'Haki zote zimehifadhiwa.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};