import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './common/LanguageSelector';
import { QRCodeDisplay } from './common/QRCodeDisplay';
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
  QrCode
} from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [registrationMethod, setRegistrationMethod] = useState<'phone' | 'email'>('phone');
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    country: 'Kenya',
    county: '',
    subCounty: '',
    village: '',
    phone: '',
    email: '',
    password: '',
    pin: '',
    confirmPin: '',
    confirmPassword: '',
    role: 'community' as UserRole,
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [generatedQRCode, setGeneratedQRCode] = useState('');
  
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'community' as UserRole,
      name: language === 'sw' ? 'Mzazi/Mlezi' : language === 'fr' ? 'Soignant' : language === 'rw' ? 'Umubyeyi' : 'Caregiver',
      description: language === 'sw' ? 'Pata huduma za afya, usafiri, zawadi' : language === 'fr' ? 'Services de santé, transport, récompenses' : 'Health services, transport, rewards',
      icon: User,
      color: 'emerald'
    },
    {
      id: 'rider' as UserRole,
      name: language === 'sw' ? 'Msafiri wa Paraboda' : language === 'fr' ? 'Conducteur ParaBoda' : language === 'rw' ? 'Umushoferi wa ParaBoda' : 'ParaBoda Rider',
      description: language === 'sw' ? 'Safirisha wagonjwa, ripoti dharura' : language === 'fr' ? 'Transporter les patients, signaler les urgences' : 'Transport patients, report emergencies',
      icon: Bike,
      color: 'blue'
    },
    {
      id: 'chv' as UserRole,
      name: language === 'sw' ? 'Mjumbe wa Afya ya Jamii' : language === 'fr' ? 'Agent de Santé Communautaire' : language === 'rw' ? 'Umukozi w\'ubuzima bw\'abaturage' : 'Community Health Volunteer',
      description: language === 'sw' ? 'Simamia afya ya jamii, idhinisha usafiri' : language === 'fr' ? 'Gérer la santé communautaire, approuver le transport' : 'Manage community health, approve transport',
      icon: Heart,
      color: 'purple'
    },
    {
      id: 'health_worker' as UserRole,
      name: language === 'sw' ? 'Mfanyakazi wa Afya' : language === 'fr' ? 'Agent de Santé' : language === 'rw' ? 'Umukozi w\'ubuzima' : 'Health Worker',
      description: language === 'sw' ? 'Toa huduma za kimatibabu, simamia chanjo' : language === 'fr' ? 'Fournir des services médicaux, gérer les vaccins' : 'Provide medical services, manage vaccines',
      icon: Stethoscope,
      color: 'indigo'
    }
  ];

  const eastAfricanCountries = [
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KSh' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS' },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF' },
    { code: 'BI', name: 'Burundi', flag: '🇧🇮', currency: 'BIF' },
    { code: 'SS', name: 'South Sudan', flag: '🇸🇸', currency: 'SSP' },
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', currency: 'ETB' },
    { code: 'SO', name: 'Somalia', flag: '🇸🇴', currency: 'SOS' },
    { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', currency: 'DJF' }
  ];

  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
    'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
    'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
    'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta',
    'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError(language === 'sw' ? 'Tafadhali ingiza jina lako kamili' : 'Please enter your full name');
      return false;
    }
    if (!formData.dateOfBirth) {
      setError(language === 'sw' ? 'Tafadhali chagua tarehe ya kuzaliwa' : 'Please select your date of birth');
      return false;
    }
    if (!formData.role) {
      setError(language === 'sw' ? 'Tafadhali chagua jukumu lako' : 'Please select your role');
      return false;
    }
    if (!formData.country) {
      setError(language === 'sw' ? 'Tafadhali chagua nchi yako' : 'Please select your country');
      return false;
    }
    if (!formData.county) {
      setError(language === 'sw' ? 'Tafadhali chagua kaunti/mkoa wako' : 'Please select your county/region');
      return false;
    }
    if (!formData.village.trim()) {
      setError(language === 'sw' ? 'Tafadhali ingiza kijiji chako' : 'Please enter your village');
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

  const generateQRCode = (userData: any) => {
    const qrData = {
      type: 'paraboda_user',
      userId: `user_${Date.now()}`,
      name: userData.fullName,
      role: userData.role,
      country: userData.country,
      location: `${userData.village}, ${userData.subCounty}, ${userData.county}`,
      phone: userData.phone,
      email: userData.email,
      dateOfBirth: userData.dateOfBirth,
      registrationDate: new Date().toISOString(),
      qrVersion: '1.0'
    };
    return JSON.stringify(qrData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setError('');

    try {
      // Get current location
      const location = await getCurrentLocation();
      
      const credentials = registrationMethod === 'phone' 
        ? { phone: formData.phone, pin: formData.pin }
        : { email: formData.email, password: formData.password };

      const registrationData = {
        name: formData.fullName,
        role: formData.role,
        location: `${formData.village}, ${formData.subCounty}, ${formData.county}, ${formData.country}`,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        county: formData.county,
        subCounty: formData.subCounty,
        village: formData.village,
        gpsLocation: location,
        ...credentials
      };

      await register(registrationData);

      // Generate QR code
      const qrCodeData = generateQRCode(formData);
      setGeneratedQRCode(qrCodeData);
      setRegistrationComplete(true);

    } catch (err: any) {
      setError(err.message || (language === 'sw' ? 'Usajili umeshindwa. Tafadhali jaribu tena.' : 'Registration failed. Please try again.'));
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
            {language === 'sw' ? 'Usajili Umekamilika!' : language === 'fr' ? 'Inscription Terminée!' : 'Registration Complete!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {language === 'sw' 
              ? 'Akaunti yako imeundwa kikamilifu. Pakua QR code yako kwa kuingia haraka.'
              : language === 'fr'
              ? 'Votre compte a été créé avec succès. Téléchargez votre code QR pour une connexion rapide.'
              : 'Your account has been created successfully. Download your QR code for quick login.'
            }
          </p>

          <div className="mb-6">
            <QRCodeDisplay
              value={generatedQRCode}
              title={language === 'sw' ? 'QR Code Yako ya Kuingia' : language === 'fr' ? 'Votre Code QR de Connexion' : 'Your Login QR Code'}
              description={language === 'sw' ? 'Tumia hii kuingia haraka' : language === 'fr' ? 'Utilisez ceci pour une connexion rapide' : 'Use this for quick login'}
              size={200}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleContinueToDashboard}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-4 rounded-2xl hover:from-emerald-700 hover:to-blue-700 transition-all font-bold text-lg"
            >
              {language === 'sw' ? 'Nenda Dashibodi' : language === 'fr' ? 'Aller au Tableau de Bord' : 'Go to Dashboard'}
            </button>
            
            <p className="text-sm text-gray-500">
              {language === 'sw' 
                ? 'Hifadhi QR code yako kwa usalama. Utaitumia kuingia mara nyingine.'
                : language === 'fr'
                ? 'Gardez votre code QR en sécurité. Vous l\'utiliserez pour vous connecter à nouveau.'
                : 'Keep your QR code safe. You\'ll use it to login again.'
              }
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
                {language === 'sw' ? 'Afya Pamoja' : language === 'fr' ? 'Santé Ensemble' : 'Health Together'}
              </p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <LanguageSelector />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'sw' ? 'Jiunge na Mfumo wa Afya wa ParaBoda' : language === 'fr' ? 'Rejoignez le Système de Santé ParaBoda' : 'Join the ParaBoda Health System'}
          </h2>
          <p className="text-gray-600">
            {language === 'sw' ? 'Unda akaunti yako kuanza kupata huduma' : language === 'fr' ? 'Créez votre compte pour commencer à accéder aux services' : 'Create your account to start accessing services'}
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
                {language === 'sw' ? 'Taarifa za Kibinafsi' : language === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
              </h3>
              
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Jina Kamili' : language === 'fr' ? 'Nom Complet' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={language === 'sw' ? 'Ingiza jina lako kamili' : language === 'fr' ? 'Entrez votre nom complet' : 'Enter your full name'}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Tarehe ya Kuzaliwa' : language === 'fr' ? 'Date de Naissance' : 'Date of Birth'} *
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

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Nchi' : language === 'fr' ? 'Pays' : 'Country'} *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {eastAfricanCountries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* County/Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Kaunti/Mkoa' : language === 'fr' ? 'Comté/Région' : 'County/Region'} *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.county}
                      onChange={(e) => handleInputChange('county', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">
                        {language === 'sw' ? 'Chagua kaunti/mkoa' : language === 'fr' ? 'Sélectionnez le comté/région' : 'Select county/region'}
                      </option>
                      {formData.country === 'Kenya' ? (
                        kenyanCounties.map((county) => (
                          <option key={county} value={county}>{county}</option>
                        ))
                      ) : (
                        <option value="Other">{language === 'sw' ? 'Nyingine' : language === 'fr' ? 'Autre' : 'Other'}</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Sub-County */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Kaunti Ndogo/Wilaya' : language === 'fr' ? 'Sous-Comté/District' : 'Sub-County/District'} *
                  </label>
                  <input
                    type="text"
                    value={formData.subCounty}
                    onChange={(e) => handleInputChange('subCounty', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={language === 'sw' ? 'Ingiza kaunti ndogo/wilaya' : language === 'fr' ? 'Entrez le sous-comté/district' : 'Enter sub-county/district'}
                  />
                </div>

                {/* Village */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Kijiji/Mtaa' : language === 'fr' ? 'Village/Quartier' : 'Village/Neighborhood'} *
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={language === 'sw' ? 'Ingiza kijiji/mtaa wako' : language === 'fr' ? 'Entrez votre village/quartier' : 'Enter your village/neighborhood'}
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    {language === 'sw' ? 'Chagua Jukumu Lako' : language === 'fr' ? 'Sélectionnez Votre Rôle' : 'Select Your Role'} *
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
                  <span>{language === 'sw' ? 'Rudi Kuingia' : language === 'fr' ? 'Retour à la Connexion' : 'Back to Login'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all font-semibold"
                >
                  {language === 'sw' ? 'Hatua Ijayo' : language === 'fr' ? 'Étape Suivante' : 'Next Step'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Authentication Setup */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'sw' ? 'Mpangilio wa Uthibitisho' : language === 'fr' ? 'Configuration d\'Authentification' : 'Authentication Setup'}
              </h3>
              
              {/* Registration Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {language === 'sw' ? 'Chagua Njia ya Usajili' : language === 'fr' ? 'Choisissez la Méthode d\'Inscription' : 'Choose Registration Method'}
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
                      {language === 'sw' ? 'Simu + PIN' : language === 'fr' ? 'Téléphone + PIN' : 'Phone + PIN'}
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
                      {language === 'sw' ? 'Barua pepe + Nenosiri' : language === 'fr' ? 'Email + Mot de Passe' : 'Email + Password'}
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
                        {language === 'sw' ? 'Nambari ya Simu' : language === 'fr' ? 'Numéro de Téléphone' : 'Phone Number'} *
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
                        {language === 'sw' ? 'Tengeneza PIN ya Nambari 4' : language === 'fr' ? 'Créer un PIN à 4 Chiffres' : 'Create 4-Digit PIN'} *
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
                        {language === 'sw' ? 'Thibitisha PIN' : language === 'fr' ? 'Confirmer le PIN' : 'Confirm PIN'} *
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
                        {language === 'sw' ? 'Anwani ya Barua Pepe' : language === 'fr' ? 'Adresse Email' : 'Email Address'} *
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
                        {language === 'sw' ? 'Nenosiri' : language === 'fr' ? 'Mot de Passe' : 'Password'} *
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
                        {language === 'sw' ? 'Thibitisha Nenosiri' : language === 'fr' ? 'Confirmer le Mot de Passe' : 'Confirm Password'} *
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
                    {language === 'sw' ? 'Nakubali' : language === 'fr' ? 'J\'accepte' : 'I agree to the'}{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      {language === 'sw' ? 'Masharti na Hali' : language === 'fr' ? 'Termes et Conditions' : 'Terms and Conditions'}
                    </a>{' '}
                    {language === 'sw' ? 'na' : language === 'fr' ? 'et' : 'and'}{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      {language === 'sw' ? 'Sera ya Faragha' : language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
                    </a>
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
                  <span>{language === 'sw' ? 'Rudi' : language === 'fr' ? 'Retour' : 'Back'}</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading 
                    ? (language === 'sw' ? 'Inaunda Akaunti...' : language === 'fr' ? 'Création du Compte...' : 'Creating Account...') 
                    : (language === 'sw' ? 'Unda Akaunti' : language === 'fr' ? 'Créer un Compte' : 'Create Account')
                  }
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {language === 'sw' ? 'Tayari una akaunti? ' : language === 'fr' ? 'Vous avez déjà un compte? ' : 'Already have an account? '}
            <Link to="/auth" className="text-emerald-600 hover:text-emerald-700 font-medium">
              {language === 'sw' ? 'Ingia hapa' : language === 'fr' ? 'Connectez-vous ici' : 'Login here'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};