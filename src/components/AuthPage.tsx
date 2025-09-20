import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoiceCommand } from '../contexts/VoiceCommandContext';
import { LanguageSelector } from './common/LanguageSelector';
import { QRScanner } from './common/QRScanner';
import { 
  User, 
  Bike, 
  Heart, 
  Shield, 
  Stethoscope,
  UserCheck,
  Mail,
  Lock,
  Mic,
  UserPlus,
  QrCode,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Zap
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('community');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'form' | 'qr' | 'quick'>('quick');
  const [qrLoginSuccess, setQrLoginSuccess] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  
  const { login, setPreviewUser } = useAuth();
  const { isListening, startListening, isSupported } = useVoiceCommand();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for emergency mode
  useEffect(() => {
    const emergency = searchParams.get('emergency');
    if (emergency === 'true') {
      setIsEmergencyMode(true);
      setLoginMethod('quick');
    }
  }, [searchParams]);

  const roles = [
    {
      id: 'community' as UserRole,
      name: t('role.caregiver'),
      emoji: '👤',
      description: t('role.caregiver_desc'),
      icon: User,
      color: 'emerald',
      testEmail: 'community@test.com'
    },
    {
      id: 'rider' as UserRole,
      name: t('role.rider'),
      emoji: '🏍️',
      description: t('role.rider_desc'),
      icon: Bike,
      color: 'blue',
      testEmail: 'rider@test.com'
    },
    {
      id: 'chv' as UserRole,
      name: t('role.chv'),
      emoji: '❤️',
      description: t('role.chv_desc'),
      icon: Heart,
      color: 'purple',
      testEmail: 'chv@test.com'
    },
    {
      id: 'health_worker' as UserRole,
      name: t('role.health_worker'),
      emoji: '🩺',
      description: t('role.health_worker_desc'),
      icon: Stethoscope,
      color: 'indigo',
      testEmail: 'health@test.com'
    },
    {
      id: 'admin' as UserRole,
      name: t('role.admin'),
      emoji: '⚙️',
      description: t('role.admin_desc'),
      icon: Shield,
      color: 'gray',
      testEmail: 'admin@test.com'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Navigate based on role
      const roleRoutes: Record<UserRole, string> = {
        community: '/community',
        rider: '/rider',
        chv: '/chv',
        health_worker: '/health-worker',
        admin: '/admin'
      };
      
      navigate(roleRoutes[selectedRole]);
    } catch (err) {
      setError(language === 'sw' ? 'Kuingia kumeshindwa. Tafadhali angalia taarifa zako.' : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    setPreviewUser(role);
    const roleRoutes: Record<UserRole, string> = {
      community: '/community',
      rider: '/rider',
      chv: '/chv',
      health_worker: '/health-worker',
      admin: '/admin'
    };
    
    // For emergency mode, go directly to emergency request
    if (isEmergencyMode && role === 'community') {
      navigate('/community?emergency=true');
    } else {
      navigate(roleRoutes[role]);
    }
  };

  const fillTestCredentials = (role: UserRole) => {
    const roleData = roles.find(r => r.id === role);
    if (roleData) {
      setEmail(roleData.testEmail);
      setPassword('password');
      setSelectedRole(role);
      setLoginMethod('form');
    }
  };

  const handleQRScan = (qrData: string) => {
    try {
      const data = JSON.parse(qrData);
      if (data.type === 'paraboda_user' && data.userId && data.role) {
        setQrLoginSuccess(true);
        setShowQRScanner(false);
        
        // Simulate login success
        setTimeout(() => {
          setPreviewUser(data.role);
          const roleRoutes: Record<UserRole, string> = {
            community: '/community',
            rider: '/rider',
            chv: '/chv',
            health_worker: '/health-worker',
            admin: '/admin'
          };
          
          if (isEmergencyMode && data.role === 'community') {
            navigate('/community?emergency=true');
          } else {
            navigate(roleRoutes[data.role]);
          }
        }, 1500);
      } else {
        setError(language === 'sw' ? 'QR code si sahihi' : 'Invalid QR code');
        setShowQRScanner(false);
      }
    } catch (err) {
      setError(language === 'sw' ? 'QR code haiwezi kusomwa' : 'Unable to read QR code');
      setShowQRScanner(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        {/* Emergency Mode Banner */}
        {isEmergencyMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-600 text-white p-4 rounded-2xl mb-6 text-center"
          >
            <div className="flex items-center justify-center space-x-3">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <div>
                <h3 className="font-bold text-lg">
                  {language === 'sw' ? 'Hali ya Dharura' : 'Emergency Mode'}
                </h3>
                <p className="text-sm">
                  {language === 'sw' 
                    ? 'Ufikiaji wa haraka wa huduma za dharura'
                    : 'Quick access to emergency services'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400">
              <img 
                src="/PARABODA LOGO.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-5xl font-black text-gray-900">{t('landing.title')}</h1>
              <p className="text-green-600 font-black text-2xl">
                {t('landing.subtitle')}
              </p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <LanguageSelector position="inline" />
          </div>
          
          <div className="text-6xl mb-4">🔑</div>
          <p className="text-gray-600 text-2xl font-bold">
            {t('auth.login_methods')}
          </p>
        </div>

        {/* Login Method Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-3xl shadow-2xl border-4 border-white/50">
            <div className="flex space-x-2">
              <button
                onClick={() => setLoginMethod('quick')}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-black transition-all text-lg shadow-xl ${
                  loginMethod === 'quick'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white transform scale-105'
                    : 'text-gray-700 hover:bg-white/70'
                }`}
              >
                <span className="text-3xl">⚡</span>
                <span>{t('auth.quick_login')}</span>
              </button>
              
              <button
                onClick={() => setLoginMethod('qr')}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-black transition-all text-lg shadow-xl ${
                  loginMethod === 'qr'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white transform scale-105'
                    : 'text-gray-700 hover:bg-white/70'
                }`}
              >
                <span className="text-3xl">📱</span>
                <span>{t('auth.qr_login')}</span>
              </button>
              
              <button
                onClick={() => setLoginMethod('form')}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-black transition-all text-lg shadow-xl ${
                  loginMethod === 'form'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white transform scale-105'
                    : 'text-gray-700 hover:bg-white/70'
                }`}
              >
                <span className="text-3xl">📝</span>
                <span>{t('auth.form_login')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* QR Login Success Message */}
        {qrLoginSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-4 border-green-200 rounded-3xl p-8 mb-8 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-green-800 mb-2">
              {language === 'sw' ? 'Kuingia Kumefanikiwa!' : 'Login Successful!'}
            </h3>
            <p className="text-green-700 font-bold">
              {language === 'sw' ? 'Inakuelekeza kwenye dashibodi yako...' : 'Redirecting to your dashboard...'}
            </p>
          </motion.div>
        )}

        {/* Quick Access Method */}
        {loginMethod === 'quick' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-3xl font-black text-gray-900 mb-2">
                {isEmergencyMode ? '🚨' : '⚡'} {isEmergencyMode ? (language === 'sw' ? 'Ufikiaji wa Dharura' : 'Emergency Access') : (language === 'sw' ? 'Ufikiaji wa Haraka' : 'Quick Access')}
              </h3>
              <p className="text-gray-600 font-bold text-lg">
                {isEmergencyMode 
                  ? (language === 'sw' ? 'Chagua jukumu lako kwa ufikiaji wa haraka wa dharura' : 'Select your role for quick emergency access')
                  : (language === 'sw' ? 'Chagua jukumu lako kuingia moja kwa moja' : 'Select your role to access directly')
                }
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  onClick={() => handleQuickLogin(role.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-3xl border-4 transition-all text-center shadow-2xl ${
                    isEmergencyMode && role.id === 'community'
                      ? 'border-red-500 bg-red-50 animate-pulse'
                      : `border-${role.color}-500 bg-${role.color}-50 hover:border-${role.color}-600 transform hover:scale-105`
                  }`}
                >
                  <div className="text-6xl mb-4">{role.emoji}</div>
                  <role.icon className={`w-8 h-8 mb-4 mx-auto text-${role.color}-600`} />
                  <h3 className="font-black text-gray-900 text-xl mb-2">{role.name}</h3>
                  <p className="text-gray-600 text-sm font-bold">{role.description}</p>
                  {isEmergencyMode && role.id === 'community' && (
                    <div className="mt-3 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                      {language === 'sw' ? 'DHARURA' : 'EMERGENCY'}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* QR Code Login */}
        {loginMethod === 'qr' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md mx-auto border-4 border-white/50"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📱</div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                {t('auth.qr_login')}
              </h2>
              <p className="text-gray-600 font-bold text-lg">
                {language === 'sw' ? 'Skani QR code yako ya kuingia' : 'Scan your login QR code'}
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={() => setShowQRScanner(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all font-black text-xl shadow-2xl flex items-center justify-center space-x-3 lg:space-x-4 transform hover:scale-105 animate-pulse-african"
              >
                <QrCode className="w-8 h-8" />
                <span>{t('auth.open_camera')}</span>
              </button>

              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  {language === 'sw' ? 'au' : 'or'}
                </p>
              </div>

              <button
                onClick={() => setLoginMethod('form')}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-2xl hover:border-gray-400 transition-all font-bold text-lg"
              >
                {language === 'sw' ? 'Tumia Fomu ya Kuingia' : 'Use Login Form'}
              </button>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border-4 border-blue-200 rounded-2xl">
              <div className="text-center">
                <div className="text-3xl mb-2">💡</div>
                <p className="text-blue-800 font-black mb-2">
                  {t('auth.no_qr')}
                </p>
                <p className="text-blue-700 font-bold text-sm">
                  {t('auth.use_demo')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Login */}
        {loginMethod === 'form' && (
          <>
            {/* Role Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  onClick={() => fillTestCredentials(role.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-3xl border-4 transition-all text-center shadow-2xl ${
                    selectedRole === role.id
                      ? `border-${role.color}-500 bg-${role.color}-50 transform scale-105`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-6xl mb-4">{role.emoji}</div>
                  <role.icon className={`w-8 h-8 mb-4 mx-auto ${
                    selectedRole === role.id ? `text-${role.color}-600` : 'text-gray-400'
                  }`} />
                  <h3 className="font-black text-gray-900 text-xl mb-2">{role.name}</h3>
                  <p className="text-gray-600 text-sm font-bold">{role.description}</p>
                </motion.button>
              ))}
            </div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md mx-auto border-4 border-white/50"
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-3xl font-black text-gray-900">
                  {t('auth.welcome_back')}
                </h2>
                <p className="text-gray-600 font-bold text-lg">
                  {language === 'sw' ? 'Karibu tena - Ingia kuendelea' : 'Welcome back - Login to continue'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-4 border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-6 text-center font-bold flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-black text-gray-700 mb-3">
                    📧 {t('form.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-4 border-gray-300 rounded-2xl focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-bold"
                      placeholder={language === 'sw' ? 'Ingiza barua pepe yako' : 'Enter your email'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-black text-gray-700 mb-3">
                    🔒 {t('form.password', { defaultValue: 'Password' })}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border-4 border-gray-300 rounded-2xl focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-bold"
                      placeholder={language === 'sw' ? 'Ingiza nenosiri lako' : 'Enter your password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                {isSupported && (
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={startListening}
                      className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-colors font-black text-lg shadow-xl ${
                        isListening 
                          ? 'bg-red-100 text-red-600 border-4 border-red-200 animate-pulse' 
                          : 'bg-emerald-100 text-emerald-600 border-4 border-emerald-200 hover:bg-emerald-200'
                      }`}
                    >
                      <Mic className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
                      <span>
                        {isListening 
                          ? (language === 'sw' ? '🎤 Inasikiliza...' : '🎤 Listening...') 
                          : (language === 'sw' ? '🎤 Kuingia kwa Sauti' : '🎤 Voice Login')
                        }
                      </span>
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-2xl transition-all font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl flex items-center justify-center space-x-3 ${
                    isEmergencyMode 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                      : 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700'
                  }`}
                >
                  <span className="text-2xl">{isEmergencyMode ? '🚨' : '🚀'}</span>
                  <span>
                    {isLoading 
                      ? (language === 'sw' ? 'Inaingia...' : 'Logging in...') 
                      : (isEmergencyMode 
                          ? (language === 'sw' ? 'INGIA DHARURA' : 'EMERGENCY LOGIN')
                          : (language === 'sw' ? 'INGIA' : 'LOGIN')
                        )
                    }
                  </span>
                </button>
              </form>

              <div className="mt-8 p-6 bg-yellow-50 border-4 border-yellow-200 rounded-2xl">
                <div className="text-center">
                  <div className="text-3xl mb-2">💡</div>
                  <p className="text-yellow-800 font-black mb-2">
                    {t('auth.demo_credentials')}:
                  </p>
                  <p className="text-yellow-700 font-bold text-sm">
                    {language === 'sw' 
                      ? '👆 Bofya jukumu lolote hapo juu kujaza kiotomatiki, au tumia nenosiri: password'
                      : '👆 Click any role above to auto-fill, or use password: password'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Back to Landing Page */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'sw' ? 'Rudi Nyumbani' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Registration Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600 font-bold text-lg">
            {language === 'sw' ? 'Huna akaunti? ' : 'Don\'t have an account? '}
            <Link 
              to="/register" 
              className="text-emerald-600 hover:text-emerald-700 font-black inline-flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>{language === 'sw' ? 'Jiunge hapa' : 'Register here'}</span>
            </Link>
          </p>
        </div>
      </motion.div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
        title={language === 'sw' ? 'Skani QR Code ya Kuingia' : 'Scan Login QR Code'}
      />
    </div>
  );
};