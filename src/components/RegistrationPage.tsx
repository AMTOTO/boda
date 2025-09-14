import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './common/LanguageSelector';
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
  CheckCircle
} from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [registrationMethod, setRegistrationMethod] = useState<'phone' | 'email'>('phone');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    pin: '',
    confirmPin: '',
    confirmPassword: '',
    role: 'community' as UserRole,
    location: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'community' as UserRole,
      name: language === 'sw' ? 'Mwanajamii' : 'Community Member',
      nameKiswahili: 'Mwanajamii',
      description: language === 'sw' ? 'Pata huduma za afya, fuatilia miadi, changia fedha za jamii' : 'Access health services, track appointments, contribute to community fund',
      icon: User,
      color: 'emerald'
    },
    {
      id: 'rider' as UserRole,
      name: language === 'sw' ? 'Msafiri wa Paraboda' : 'Paraboda Operator',
      nameKiswahili: 'Msafiri wa Paraboda',
      description: language === 'sw' ? 'Safirisha wagonjwa, ripoti dharura, ongoza miradi ya vijana' : 'Transport patients, report emergencies, facilitate youth programs',
      icon: Bike,
      color: 'blue'
    },
    {
      id: 'chv' as UserRole,
      name: language === 'sw' ? 'Mjumbe wa Afya ya Jamii' : 'Community Health Volunteer',
      nameKiswahili: 'Mjumbe wa Afya ya Jamii',
      description: language === 'sw' ? 'Simamia afya ya jamii, idhinisha usafiri, fuatilia vipimo vya afya' : 'Manage community health, approve transports, track health metrics',
      icon: Heart,
      color: 'purple'
    },
    {
      id: 'health_worker' as UserRole,
      name: language === 'sw' ? 'Mfanyakazi wa Afya' : 'Health Worker',
      nameKiswahili: 'Mfanyakazi wa Afya',
      description: language === 'sw' ? 'Toa huduma za kimatibabu, simamia hifadhi ya chanjo, fuatilia wagonjwa' : 'Provide medical services, manage vaccine inventory, track patients',
      icon: Stethoscope,
      color: 'indigo'
    }
  ];

  const counties = [
    'Kiambu', 'Nakuru', 'Kisumu', 'Meru', 'Machakos', 'Nyeri', 'Murang\'a',
    'Kirinyaga', 'Nyandarua', 'Laikipia', 'Samburu', 'Trans Nzoia', 'Uasin Gishu',
    'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Kericho', 'Bomet', 'Kakamega',
    'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisii', 'Nyamira', 'Homa Bay',
    'Migori', 'Narok', 'Kajiado', 'Makueni', 'Kitui', 'Embu', 'Tharaka-Nithi',
    'Isiolo', 'Marsabit', 'Mandera', 'Wajir', 'Garissa', 'Tana River', 'Lamu',
    'Taita-Taveta', 'Kwale', 'Kilifi', 'Mombasa', 'Turkana', 'West Pokot'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError(language === 'sw' ? 'Tafadhali ingiza jina lako kamili' : 'Please enter your full name');
      return false;
    }
    if (!formData.role) {
      setError(language === 'sw' ? 'Tafadhali chagua jukumu lako' : 'Please select your role');
      return false;
    }
    if (!formData.location) {
      setError(language === 'sw' ? 'Tafadhali chagua mahali pako' : 'Please select your location');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (registrationMethod === 'phone') {
      if (!formData.phone.trim()) {
        setError(language === 'sw' ? 'Tafadhali ingiza nambari yako ya simu' : 'Please enter your phone number');
        return false;
      }
      if (!/^(\+254|0)[17]\d{8}$/.test(formData.phone)) {
        setError(language === 'sw' ? 'Tafadhali ingiza nambari sahihi ya simu ya Kenya' : 'Please enter a valid Kenyan phone number');
        return false;
      }
      if (!formData.pin) {
        setError(language === 'sw' ? 'Tafadhali ingiza PIN ya nambari 4' : 'Please enter a 4-digit PIN');
        return false;
      }
      if (formData.pin.length !== 4 || !/^\d{4}$/.test(formData.pin)) {
        setError(language === 'sw' ? 'PIN lazima iwe na nambari 4 tu' : 'PIN must be exactly 4 digits');
        return false;
      }
      if (formData.pin !== formData.confirmPin) {
        setError(language === 'sw' ? 'PIN hazilingani' : 'PINs do not match');
        return false;
      }
    } else {
      if (!formData.email.trim()) {
        setError(language === 'sw' ? 'Tafadhali ingiza anwani yako ya barua pepe' : 'Please enter your email address');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError(language === 'sw' ? 'Tafadhali ingiza anwani sahihi ya barua pepe' : 'Please enter a valid email address');
        return false;
      }
      if (!formData.password) {
        setError(language === 'sw' ? 'Tafadhali ingiza nenosiri' : 'Please enter a password');
        return false;
      }
      if (formData.password.length < 6) {
        setError(language === 'sw' ? 'Nenosiri lazima liwe na angalau herufi 6' : 'Password must be at least 6 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(language === 'sw' ? 'Nenosiri hazilingani' : 'Passwords do not match');
        return false;
      }
    }
    if (!formData.agreeToTerms) {
      setError(language === 'sw' ? 'Tafadhali kubali masharti na hali' : 'Please agree to the terms and conditions');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setError('');

    try {
      const credentials = registrationMethod === 'phone' 
        ? { phone: formData.phone, pin: formData.pin }
        : { email: formData.email, password: formData.password };

      await register({
        name: formData.name,
        role: formData.role,
        location: formData.location,
        ...credentials
      });

      // Navigate to appropriate dashboard
      const roleRoutes: Record<UserRole, string> = {
        community: '/community',
        rider: '/rider',
        chv: '/chv',
        health_worker: '/health-worker',
        admin: '/admin'
      };
      
      navigate(roleRoutes[formData.role]);
    } catch (err: any) {
      setError(err.message || (language === 'sw' ? 'Usajili umeshindwa. Tafadhali jaribu tena.' : 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xl border-4 border-emerald-400">
              <img 
                src="/Rider mother and child.jpg" 
                alt="ParaBoda Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ParaBoda</h1>
              <p className="text-emerald-600 font-medium">
                {language === 'sw' ? 'Afya Pamoja' : 'Health Together'}
              </p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <LanguageSelector />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'sw' ? 'Jiunge na Jamii Yetu ya Afya' : 'Join Our Health Community'}
          </h2>
          <p className="text-gray-600">
            {language === 'sw' ? 'Jiunge nasi - Tengeneza akaunti yako kuanza' : 'Jiunge nasi - Create your account to get started'}
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
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'sw' ? 'Taarifa za Msingi' : 'Basic Information'}
              </h3>
              
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Jina Kamili' : 'Full Name'} / Jina Kamili
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={language === 'sw' ? 'Ingiza jina lako kamili' : 'Enter your full name'}
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    {language === 'sw' ? 'Chagua Jukumu Lako' : 'Select Your Role'} / Chagua Jukumu Lako
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
                            <p className="text-xs text-emerald-600">{role.nameKiswahili}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{role.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Kaunti' : 'County'} / Kaunti
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">
                        {language === 'sw' ? 'Chagua kaunti yako' : 'Select your county'}
                      </option>
                      {counties.map((county) => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
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
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all font-semibold"
                >
                  {language === 'sw' ? 'Hatua Ijayo' : 'Next Step'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Authentication Setup */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'sw' ? 'Mpangilio wa Uthibitisho' : 'Authentication Setup'}
              </h3>
              
              {/* Registration Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {language === 'sw' ? 'Chagua Njia ya Usajili' : 'Choose Registration Method'} / Chagua Njia ya Usajili
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
                      {language === 'sw' ? 'Simu + PIN' : 'Phone + PIN'}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">Simu + PIN</p>
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
                      {language === 'sw' ? 'Barua pepe + Nenosiri' : 'Email + Password'}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">Barua pepe + Nenosiri</p>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {registrationMethod === 'phone' ? (
                  <>
                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'} / Nambari ya Simu
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="+254712345678 or 0712345678"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'sw' ? 'Ingiza nambari yako ya simu ya Kenya' : 'Enter your Kenyan mobile number'}
                      </p>
                    </div>

                    {/* PIN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'sw' ? 'Tengeneza PIN ya Nambari 4' : 'Create 4-Digit PIN'} / Tengeneza PIN ya Nambari 4
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPin ? "text" : "password"}
                          value={formData.pin}
                          onChange={(e) => handleInputChange('pin', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder={language === 'sw' ? 'Ingiza PIN ya nambari 4' : 'Enter 4-digit PIN'}
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
                        {language === 'sw' ? 'Thibitisha PIN' : 'Confirm PIN'} / Thibitisha PIN
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPin ? "text" : "password"}
                          value={formData.confirmPin}
                          onChange={(e) => handleInputChange('confirmPin', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder={language === 'sw' ? 'Thibitisha PIN yako' : 'Confirm your PIN'}
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
                        {language === 'sw' ? 'Anwani ya Barua Pepe' : 'Email Address'} / Anwani ya Barua Pepe
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder={language === 'sw' ? 'Ingiza anwani yako ya barua pepe' : 'Enter your email address'}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'sw' ? 'Nenosiri' : 'Password'} / Nenosiri
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder={language === 'sw' ? 'Tengeneza nenosiri kali' : 'Create a strong password'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'sw' ? 'Nenosiri lazima liwe na angalau herufi 6' : 'Password must be at least 6 characters long'}
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'sw' ? 'Thibitisha Nenosiri' : 'Confirm Password'} / Thibitisha Nenosiri
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder={language === 'sw' ? 'Thibitisha nenosiri lako' : 'Confirm your password'}
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
                      {language === 'sw' ? 'Masharti na Hali' : 'Terms and Conditions'}
                    </a>{' '}
                    {language === 'sw' ? 'na' : 'and'}{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      {language === 'sw' ? 'Sera ya Faragha' : 'Privacy Policy'}
                    </a>
                    <br />
                    <span className="text-xs text-gray-500">
                      Nakubali masharti na sera ya faragha
                    </span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'sw' ? 'Rudi' : 'Back'}</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading 
                    ? (language === 'sw' ? 'Inaunda Akaunti...' : 'Creating Account...') 
                    : (language === 'sw' ? 'Unda Akaunti' : 'Create Account')
                  }
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