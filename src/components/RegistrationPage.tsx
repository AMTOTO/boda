import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { LanguageSelector } from './common/LanguageSelector';
import { GovernanceSelector } from './common/GovernanceSelector';
import { QRCodeDisplay } from './common/QRCodeDisplay';
import { governanceService, AdministrativeUnit } from '../services/governanceService';
import { 
  User, 
  Bike, 
  Heart, 
  Shield, 
  Stethoscope,
  UserCheck,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  Calendar,
  Globe,
  Download,
  QrCode,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [registrationMethod, setRegistrationMethod] = useState<'phone' | 'email'>('phone');
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    country: 'KE',
    administrativeUnits: [] as string[],
    administrativePath: [] as AdministrativeUnit[],
    village: '',
    phone: '',
    email: '',
    password: '',
    pin: '',
    confirmPin: '',
    confirmPassword: '',
    role: 'community' as UserRole,
    agreeToTerms: false,
    preferredLanguage: 'en' as string,
    preferredCurrency: 'KES' as string
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [generatedQRCode, setGeneratedQRCode] = useState('');
  
  const { register } = useAuth();
  const { language, t } = useLanguage();
  const { getCountryCurrency } = useCurrency();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'community' as UserRole,
      name: t('role.caregiver'),
      description: t('role.caregiver_desc'),
      icon: User,
      color: 'emerald'
    },
    {
      id: 'rider' as UserRole,
      name: t('role.rider'),
      description: t('role.rider_desc'),
      icon: Bike,
      color: 'blue'
    },
    {
      id: 'chv' as UserRole,
      name: t('role.chv'),
      description: t('role.chv_desc'),
      icon: Heart,
      color: 'purple'
    },
    {
      id: 'health_worker' as UserRole,
      name: t('role.health_worker'),
      description: t('role.health_worker_desc'),
      icon: Stethoscope,
      color: 'indigo'
    }
  ];

  const countries = governanceService.getCountries();

  const handleInputChange = (field: string, value: string | boolean | string[] | AdministrativeUnit[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');

    // Auto-set currency based on country selection
    if (field === 'country' && typeof value === 'string') {
      const countryCurrency = getCountryCurrency(value);
      setFormData(prev => ({ ...prev, preferredCurrency: countryCurrency }));
    }
  };

  const handleGovernanceChange = (units: string[], fullPath: AdministrativeUnit[]) => {
    setFormData(prev => ({
      ...prev,
      administrativeUnits: units,
      administrativePath: fullPath
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError(t('validation.required_name', { defaultValue: 'Please enter your full name' }));
      return false;
    }
    if (!formData.dateOfBirth) {
      setError(t('validation.required_dob', { defaultValue: 'Please select your date of birth' }));
      return false;
    }
    if (!formData.role) {
      setError(t('validation.required_role', { defaultValue: 'Please select your role' }));
      return false;
    }
    if (!formData.country) {
      setError(t('validation.required_country', { defaultValue: 'Please select your country' }));
      return false;
    }
    if (formData.administrativeUnits.length === 0) {
      setError(t('validation.required_admin_unit', { defaultValue: 'Please select your administrative unit' }));
      return false;
    }
    if (!formData.village.trim()) {
      setError(t('validation.required_village', { defaultValue: 'Please enter your village' }));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (registrationMethod === 'phone') {
      if (!formData.phone.trim()) {
        setError(t('validation.invalid_phone'));
        return false;
      }
      if (!formData.pin) {
        setError(t('validation.pin_required'));
        return false;
      }
      if (formData.pin.length !== 4 || !/^\d{4}$/.test(formData.pin)) {
        setError(t('validation.pin_format', { defaultValue: 'PIN must be exactly 4 digits' }));
        return false;
      }
      if (formData.pin !== formData.confirmPin) {
        setError(t('validation.pin_match'));
        return false;
      }
    } else {
      if (!formData.email.trim()) {
        setError(t('validation.invalid_email'));
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError(t('validation.invalid_email'));
        return false;
      }
      if (!formData.password) {
        setError(t('validation.password_required', { defaultValue: 'Please enter a password' }));
        return false;
      }
      if (formData.password.length < 6) {
        setError(t('validation.password_min'));
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t('validation.passwords_match'));
        return false;
      }
    }
    if (!formData.agreeToTerms) {
      setError(t('validation.terms_required'));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const generateQRCode = (userData: any) => {
    const qrData = {
      type: 'paraboda_user',
      userId: `user_${Date.now()}`,
      name: userData.fullName,
      role: userData.role,
      country: userData.country,
      location: governanceService.formatLocationString(userData.administrativeUnits, false),
      village: userData.village,
      phone: userData.phone,
      email: userData.email,
      dateOfBirth: userData.dateOfBirth,
      registrationDate: new Date().toISOString(),
      preferredLanguage: userData.preferredLanguage,
      preferredCurrency: userData.preferredCurrency,
      qrVersion: '2.0'
    };
    return JSON.stringify(qrData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      // Get current location
      const location = await getCurrentLocation();
      
      const credentials = registrationMethod === 'phone' 
        ? { phone: formData.phone, pin: formData.pin }
        : { email: formData.email, password: formData.password };

      const registrationData = {
        name: formData.fullName,
        role: formData.role,
        location: governanceService.formatLocationString(formData.administrativeUnits, true),
        village: formData.village,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        administrativeUnits: formData.administrativeUnits,
        administrativePath: formData.administrativePath,
        gpsLocation: location,
        preferredLanguage: language,
        preferredCurrency: getCountryCurrency(formData.country),
        ...credentials
      };

      await register(registrationData);

      // Generate QR code
      const qrCodeData = generateQRCode({
        ...formData,
        preferredLanguage: language,
        preferredCurrency: getCountryCurrency(formData.country)
      });
      setGeneratedQRCode(qrCodeData);
      setRegistrationComplete(true);

    } catch (err: any) {
      setError(err.message || t('status.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Location access denied, using default location');
          // Default to Nairobi coordinates
          resolve({ lat: -1.2921, lng: 36.8219 });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  const handleContinueToDashboard = () => {
    const roleRoutes: Record<UserRole, string> = {
      community: '/community',
      rider: '/rider',
      chv: '/chv',
      health_worker: '/health-worker',
      admin: '/admin'
    };
    
    navigate(roleRoutes[formData.role]);
  };

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('register.registration_complete')}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {t('register.qr_generated')}
          </p>

          <div className="mb-6 bg-gray-50 p-4 rounded-2xl">
            <div className="w-48 h-48 mx-auto bg-white p-4 rounded-xl border-2 border-gray-200">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-20 h-20 text-gray-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {language === 'sw' ? 'QR Code Yako ya Kuingia' : 'Your Login QR Code'}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleContinueToDashboard}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-4 rounded-2xl hover:from-emerald-700 hover:to-blue-700 transition-all font-bold text-lg"
            >
              {t('register.go_dashboard')}
            </button>
            
            <p className="text-sm text-gray-500">
              {t('register.save_qr')}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-2xl border-4 border-emerald-400">
              <img 
                src="https://i.imgur.com/mIUhG65.png" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{t('landing.title')}</h1>
              <p className="text-emerald-600 font-bold text-xl">
                {t('landing.subtitle')}
              </p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <LanguageSelector position="inline" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.register_title')}
          </h2>
          <p className="text-gray-600">
            {language === 'sw' 
              ? 'Unda akaunti yako kuanza kupata huduma'
              : 'Create your account to start accessing services'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t('register.personal_info')}
              </h3>
              
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.full_name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={language === 'sw' ? 'Ingiza jina lako kamili' : 'Enter your full name'}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.date_of_birth')} *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Country Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.country')} *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.country}
                      onChange={(e) => {
                        handleInputChange('country', e.target.value);
                        handleInputChange('administrativeUnits', []); // Reset administrative units
                        handleInputChange('administrativePath', []);
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Administrative Hierarchy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.administrative_unit')} *
                  </label>
                  <GovernanceSelector
                    selectedCountry={formData.country}
                    selectedUnits={formData.administrativeUnits}
                    onSelectionChange={handleGovernanceChange}
                    required={true}
                  />
                </div>

                {/* Village */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('register.village')} *
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={t('admin.enter_village')}
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    {t('register.select_role')} *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleInputChange('role', role.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.role === role.id
                            ? `border-${role.color}-500 bg-${role.color}-50`
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <role.icon className={`w-6 h-6 ${
                            formData.role === role.id ? `text-${role.color}-600` : 'text-gray-400'
                          }`} />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{role.name}</h4>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{role.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'sw' ? 'Rudi Kuingia' : 'Back to Login'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all font-semibold flex items-center space-x-2"
                >
                  <span>{t('register.next_step')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Authentication Setup */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t('register.auth_setup')}
              </h3>
              
              {/* Registration Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {t('register.registration_method')}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRegistrationMethod('phone')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      registrationMethod === 'phone'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Phone className={`w-6 h-6 mx-auto mb-2 ${
                      registrationMethod === 'phone' ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-gray-900">
                      {t('register.phone_pin')}
                    </h4>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRegistrationMethod('email')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      registrationMethod === 'email'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Mail className={`w-6 h-6 mx-auto mb-2 ${
                      registrationMethod === 'email' ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-gray-900">
                      {t('register.email_password')}
                    </h4>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {registrationMethod === 'phone' ? (
                  <>
                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('form.phone')} *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="+254712345678"
                        />
                      </div>
                    </div>

                    {/* PIN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.create_pin')} *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPin ? "text" : "password"}
                          value={formData.pin}
                          onChange={(e) => handleInputChange('pin', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="****"
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin(!showPin)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm PIN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('register.confirm_pin')} *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPin ? "text" : "password"}
                          value={formData.confirmPin}
                          onChange={(e) => handleInputChange('confirmPin', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="****"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('form.email')} *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('form.password', { defaultValue: 'Password' })} *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'sw' ? 'Thibitisha Nenosiri' : 'Confirm Password'} *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    {language === 'sw' ? 'Nakubali' : 'I agree to the'}{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      {t('register.terms_conditions')}
                    </a>{' '}
                    {language === 'sw' ? 'na' : 'and'}{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      {t('register.privacy_policy')}
                    </a>
                  </label>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('action.back')}</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{language === 'sw' ? 'Inaunda Akaunti...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <span>{t('register.create_account')}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {language === 'sw' ? 'Tayari una akaunti? ' : 'Already have an account? '}
            <Link to="/auth" className="text-emerald-600 hover:text-emerald-700 font-medium">
              {language === 'sw' ? 'Ingia hapa' : 'Login here'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};