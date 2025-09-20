import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'sw' | 'lg' | 'fr' | 'rw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translateText: (text: string, targetLang?: Language) => Promise<string>;
  languages: Array<{
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
    country: string;
  }>;
  isOfflineMode: boolean;
  cacheTranslations: () => Promise<void>;
}

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English (Kenya)', flag: '🇬🇧', country: 'Kenya' },
  { code: 'sw' as Language, name: 'Kiswahili', nativeName: 'Kiswahili', flag: '🇰🇪', country: 'Kenya/Rwanda/Congo' },
  { code: 'lg' as Language, name: 'Luganda', nativeName: 'Luganda', flag: '🇺🇬', country: 'Uganda' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français (Congo)', flag: '🇨🇩', country: 'Congo' },
  { code: 'rw' as Language, name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', country: 'Rwanda' },
];

const translations = {
  en: {
    // Navigation & Common
    'nav.overview': 'Overview',
    'nav.households': 'Households',
    'nav.transport': 'Transport',
    'nav.alerts': 'Alerts',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Rewards',
    'nav.health': 'Health',
    'nav.wallet': 'M-Supu Wallet',
    'nav.reports': 'Reports',
    'nav.myths': 'Myth Busters',
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.users': 'Users',
    'nav.settings': 'Settings',
    
    // Landing Page
    'landing.title': 'ParaBoda',
    'landing.subtitle': 'Health Together',
    'landing.description': 'Digital health ecosystem for East African communities',
    'landing.choose_language': 'Choose Your Language',
    'landing.choose_role': 'Choose Your Role',
    'landing.get_started': 'GET STARTED',
    'landing.login': 'LOGIN',
    'landing.emergency_banner': '🚨 Emergency Transport Request',
    'landing.no_login_required': 'No Login Required',
    
    // Registration & Login
    'auth.welcome_back': 'Welcome Back',
    'auth.register_title': 'Join the ParaBoda Health System',
    'auth.login_methods': 'Choose your login method',
    'auth.qr_login': 'QR Code Login',
    'auth.quick_login': 'Quick Login',
    'auth.form_login': 'Form Login',
    'auth.scan_qr': 'SCAN QR CODE',
    'auth.open_camera': 'OPEN CAMERA',
    'auth.demo_credentials': 'Demo Credentials',
    'auth.no_qr': "Don't have a QR Code?",
    'auth.use_demo': 'Use "Demo" button for testing',
    
    // Registration Form
    'register.personal_info': 'Personal Information',
    'register.auth_setup': 'Authentication Setup',
    'register.full_name': 'Full Name',
    'register.date_of_birth': 'Date of Birth',
    'register.country': 'Country',
    'register.administrative_unit': 'County/Province',
    'register.sub_unit': 'Sub-County/District',
    'register.village': 'Village/Neighborhood',
    'register.select_role': 'Select Your Role',
    'register.registration_method': 'Choose Registration Method',
    'register.phone_pin': 'Phone + PIN',
    'register.email_password': 'Email + Password',
    'register.create_pin': 'Create 4-Digit PIN',
    'register.confirm_pin': 'Confirm PIN',
    'register.terms_conditions': 'Terms and Conditions',
    'register.privacy_policy': 'Privacy Policy',
    'register.next_step': 'Next Step',
    'register.create_account': 'Create Account',
    'register.registration_complete': 'Registration Complete!',
    'register.qr_generated': 'Your account has been created successfully. Download your QR code for quick login.',
    'register.go_dashboard': 'Go to Dashboard',
    'register.save_qr': 'Keep your QR code safe. You\'ll use it to login again.',
    
    // Roles
    'role.caregiver': 'Parent/Caregiver',
    'role.caregiver_desc': 'Health services, transport, rewards',
    'role.rider': 'ParaBoda Rider',
    'role.rider_desc': 'Transport patients, report emergencies',
    'role.chv': 'Community Health Volunteer',
    'role.chv_desc': 'Manage community health, approve transport',
    'role.health_worker': 'Health Worker',
    'role.health_worker_desc': 'Provide medical services, manage vaccines',
    'role.admin': 'Administrator',
    'role.admin_desc': 'System management',
    
    // Countries & Administrative Units
    'country.kenya': 'Kenya',
    'country.uganda': 'Uganda',
    'country.rwanda': 'Rwanda',
    'country.drc': 'Eastern DRC',
    'admin.select_unit': 'Select administrative unit',
    'admin.enter_village': 'Enter your village',
    
    // Wallet & Financial
    'wallet.title': 'M-Supu Wallet',
    'wallet.balance': 'Balance',
    'wallet.savings': 'Savings',
    'wallet.credit_score': 'Credit Score',
    'wallet.loan_limit': 'Loan Limit',
    'wallet.active_loans': 'Active Loans',
    'wallet.add_savings': 'Add Savings',
    'wallet.apply_loan': 'Apply for Loan',
    'wallet.loan_payment': 'Loan Payment',
    'wallet.credit_report': 'Credit Report',
    'wallet.credit_coach': 'Credit Coach',
    'wallet.contribute': 'Contribute',
    'wallet.rewards': 'Rewards',
    'wallet.sha_contribution': 'SHA Contribution',
    'wallet.sha_loan': 'SHA Loan',
    'wallet.trust_level': 'Trust Level',
    'wallet.loan_readiness': 'Loan Readiness',
    'wallet.eligibility_status': 'Eligibility Status',
    
    // Emergency & Health
    'emergency.title': 'EMERGENCY',
    'emergency.request_help': 'Request urgent help',
    'emergency.transport': 'Emergency Transport',
    'emergency.medical': 'Medical Emergency',
    'emergency.accident': 'Road Accident',
    'emergency.outbreak': 'Disease Outbreak',
    'emergency.weather': 'Weather Alert',
    
    // Services
    'service.health': 'Health Services',
    'service.transport': 'Transport Services',
    'service.ai_assistant': 'AI Assistant',
    'service.qr_scanner': 'QR Scanner',
    'service.community_fund': 'Community Fund',
    
    // Status Messages
    'status.success': 'Success',
    'status.error': 'Error',
    'status.loading': 'Loading',
    'status.processing': 'Processing',
    'status.submitted': 'Submitted',
    'status.approved': 'Approved',
    'status.pending': 'Pending',
    'status.rejected': 'Rejected',
    
    // Common Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.submit': 'Submit',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.view': 'View',
    'action.download': 'Download',
    'action.upload': 'Upload',
    'action.share': 'Share',
    'action.close': 'Close',
    'action.open': 'Open',
    'action.refresh': 'Refresh',
    'action.search': 'Search',
    'action.filter': 'Filter',
    
    // Validation Messages
    'validation.required': 'This field is required',
    'validation.invalid_email': 'Please enter a valid email address',
    'validation.invalid_phone': 'Please enter a valid phone number',
    'validation.password_min': 'Password must be at least 6 characters',
    'validation.passwords_match': 'Passwords do not match',
    'validation.pin_required': 'Please enter a 4-digit PIN',
    'validation.pin_match': 'PINs do not match',
    'validation.terms_required': 'Please agree to the terms and conditions',
  },
  sw: {
    // Navigation & Common
    'nav.overview': 'Muhtasari',
    'nav.households': 'Kaya',
    'nav.transport': 'Usafiri',
    'nav.alerts': 'Tahadhari',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Zawadi',
    'nav.health': 'Afya',
    'nav.wallet': 'Pochi ya M-Supu',
    'nav.reports': 'Ripoti',
    'nav.myths': 'Kupambana na Uwongo',
    'nav.dashboard': 'Dashibodi',
    'nav.analytics': 'Uchanganuzi',
    'nav.users': 'Watumiaji',
    'nav.settings': 'Mipangilio',
    
    // Landing Page
    'landing.title': 'ParaBoda',
    'landing.subtitle': 'Afya Pamoja',
    'landing.description': 'Mfumo wa afya wa dijiti kwa jamii za Afrika Mashariki',
    'landing.choose_language': 'Chagua Lugha Yako',
    'landing.choose_role': 'Chagua Jukumu Lako',
    'landing.get_started': 'ANZA SASA',
    'landing.login': 'INGIA',
    'landing.emergency_banner': '🚨 Ombi la Usafiri wa Dharura',
    'landing.no_login_required': 'Hakuna Haja ya Kuingia',
    
    // Registration & Login
    'auth.welcome_back': 'Karibu Tena',
    'auth.register_title': 'Jiunge na Mfumo wa Afya wa ParaBoda',
    'auth.login_methods': 'Chagua njia ya kuingia',
    'auth.qr_login': 'Kuingia kwa QR Code',
    'auth.quick_login': 'Kuingia kwa Haraka',
    'auth.form_login': 'Kuingia kwa Fomu',
    'auth.scan_qr': 'SKANI QR CODE',
    'auth.open_camera': 'FUNGUA KAMERA',
    'auth.demo_credentials': 'Taarifa za Onyesho',
    'auth.no_qr': 'Hakuna QR Code?',
    'auth.use_demo': 'Tumia kitufe cha "Onyesho" kwa majaribio',
    
    // Registration Form
    'register.personal_info': 'Taarifa za Kibinafsi',
    'register.auth_setup': 'Mpangilio wa Uthibitisho',
    'register.full_name': 'Jina Kamili',
    'register.date_of_birth': 'Tarehe ya Kuzaliwa',
    'register.country': 'Nchi',
    'register.administrative_unit': 'Kaunti/Mkoa',
    'register.sub_unit': 'Kaunti Ndogo/Wilaya',
    'register.village': 'Kijiji/Mtaa',
    'register.select_role': 'Chagua Jukumu Lako',
    'register.registration_method': 'Chagua Njia ya Usajili',
    'register.phone_pin': 'Simu + PIN',
    'register.email_password': 'Barua pepe + Nenosiri',
    'register.create_pin': 'Tengeneza PIN ya Nambari 4',
    'register.confirm_pin': 'Thibitisha PIN',
    'register.terms_conditions': 'Masharti na Hali',
    'register.privacy_policy': 'Sera ya Faragha',
    'register.next_step': 'Hatua Ijayo',
    'register.create_account': 'Unda Akaunti',
    'register.registration_complete': 'Usajili Umekamilika!',
    'register.qr_generated': 'Akaunti yako imeundwa kikamilifu. Pakua QR code yako kwa kuingia haraka.',
    'register.go_dashboard': 'Nenda Dashibodi',
    'register.save_qr': 'Hifadhi QR code yako kwa usalama. Utaitumia kuingia mara nyingine.',
    
    // Roles
    'role.caregiver': 'Mzazi/Mlezi',
    'role.caregiver_desc': 'Huduma za afya, usafiri, zawadi',
    'role.rider': 'Msafiri wa ParaBoda',
    'role.rider_desc': 'Safirisha wagonjwa, ripoti dharura',
    'role.chv': 'Mjumbe wa Afya ya Jamii',
    'role.chv_desc': 'Simamia afya ya jamii, idhinisha usafiri',
    'role.health_worker': 'Mfanyakazi wa Afya',
    'role.health_worker_desc': 'Toa huduma za kimatibabu, simamia chanjo',
    'role.admin': 'Msimamizi',
    'role.admin_desc': 'Usimamizi wa mfumo',
    
    // Countries & Administrative Units
    'country.kenya': 'Kenya',
    'country.uganda': 'Uganda',
    'country.rwanda': 'Rwanda',
    'country.drc': 'Mashariki mwa DRC',
    'admin.select_unit': 'Chagua kaunti/mkoa',
    'admin.enter_village': 'Ingiza kijiji chako',
    
    // Wallet & Financial
    'wallet.title': 'Pochi ya M-Supu',
    'wallet.balance': 'Salio',
    'wallet.savings': 'Akiba',
    'wallet.credit_score': 'Alama za Mkopo',
    'wallet.loan_limit': 'Kiwango cha Mkopo',
    'wallet.active_loans': 'Mikopo Hai',
    'wallet.add_savings': 'Ongeza Akiba',
    'wallet.apply_loan': 'Omba Mkopo',
    'wallet.loan_payment': 'Malipo ya Mkopo',
    'wallet.credit_report': 'Ripoti ya Mkopo',
    'wallet.credit_coach': 'Mkocha wa Mkopo',
    'wallet.contribute': 'Changia',
    'wallet.rewards': 'Zawadi',
    'wallet.sha_contribution': 'Mchango wa SHA',
    'wallet.sha_loan': 'Mkopo wa SHA',
    'wallet.trust_level': 'Kiwango cha Uaminifu',
    'wallet.loan_readiness': 'Utayari wa Mkopo',
    'wallet.eligibility_status': 'Hali ya Ustahili',
    
    // Emergency & Health
    'emergency.title': 'DHARURA',
    'emergency.request_help': 'Omba msaada wa haraka',
    'emergency.transport': 'Usafiri wa Dharura',
    'emergency.medical': 'Dharura ya Matibabu',
    'emergency.accident': 'Ajali ya Barabarani',
    'emergency.outbreak': 'Mlipuko wa Ugonjwa',
    'emergency.weather': 'Tahadhari ya Hali ya Hewa',
    
    // Services
    'service.health': 'Huduma za Afya',
    'service.transport': 'Huduma za Usafiri',
    'service.ai_assistant': 'Msaidizi wa AI',
    'service.qr_scanner': 'Skana ya QR',
    'service.community_fund': 'Fedha za Jamii',
    
    // Status Messages
    'status.success': 'Mafanikio',
    'status.error': 'Hitilafu',
    'status.loading': 'Inapakia',
    'status.processing': 'Inachakata',
    'status.submitted': 'Imewasilishwa',
    'status.approved': 'Imeidhinishwa',
    'status.pending': 'Inasubiri',
    'status.rejected': 'Imekataliwa',
    
    // Common Actions
    'action.save': 'Hifadhi',
    'action.cancel': 'Ghairi',
    'action.submit': 'Wasilisha',
    'action.edit': 'Hariri',
    'action.delete': 'Futa',
    'action.view': 'Ona',
    'action.download': 'Pakua',
    'action.upload': 'Pakia',
    'action.share': 'Shiriki',
    'action.close': 'Funga',
    'action.open': 'Fungua',
    'action.refresh': 'Onyesha Upya',
    'action.search': 'Tafuta',
    'action.filter': 'Chuja',
    
    // Validation Messages
    'validation.required': 'Sehemu hii inahitajika',
    'validation.invalid_email': 'Tafadhali ingiza anwani sahihi ya barua pepe',
    'validation.invalid_phone': 'Tafadhali ingiza nambari sahihi ya simu',
    'validation.password_min': 'Nenosiri lazima liwe na angalau herufi 6',
    'validation.passwords_match': 'Nenosiri hazilingani',
    'validation.pin_required': 'Tafadhali ingiza PIN ya nambari 4',
    'validation.pin_match': 'PIN hazilingani',
    'validation.terms_required': 'Tafadhali kubali masharti na hali',
  },
  lg: {
    // Basic Luganda translations
    'landing.title': 'ParaBoda',
    'landing.subtitle': 'Obulamu Awamu',
    'landing.description': 'Enkola y\'obulamu ey\'etekinologiya eri bitundu by\'ebuvanjuba bw\'Afrika',
    'landing.choose_language': 'Londa Olulimi Lwo',
    'landing.choose_role': 'Londa Omulimu Gwo',
    'landing.get_started': 'TANDIKA KATI',
    'landing.login': 'YINGIRA',
    'role.caregiver': 'Omuzadde/Omukuumi',
    'role.caregiver_desc': 'Obujjanjabi, entambula, ebirabo',
    'wallet.title': 'Ssente za M-Supu',
    'wallet.balance': 'Ssente',
    'emergency.title': 'OBWETAAVU',
    'emergency.request_help': 'Saba obuyambi bw\'amangu',
  },
  fr: {
    // Basic French translations
    'landing.title': 'ParaBoda',
    'landing.subtitle': 'Santé Ensemble',
    'landing.description': 'Écosystème de santé numérique pour les communautés d\'Afrique de l\'Est',
    'landing.choose_language': 'Choisissez Votre Langue',
    'landing.choose_role': 'Choisissez Votre Rôle',
    'landing.get_started': 'COMMENCER',
    'landing.login': 'CONNEXION',
    'role.caregiver': 'Parent/Soignant',
    'role.caregiver_desc': 'Services de santé, transport, récompenses',
    'wallet.title': 'Portefeuille M-Supu',
    'wallet.balance': 'Solde',
    'emergency.title': 'URGENCE',
    'emergency.request_help': 'Demander une aide urgente',
  },
  rw: {
    // Basic Kinyarwanda translations
    'landing.title': 'ParaBoda',
    'landing.subtitle': 'Ubuzima Hamwe',
    'landing.description': 'Sisitemu y\'ubuzima ya digitale ku miryango y\'Iburasirazuba bw\'Afurika',
    'landing.choose_language': 'Hitamo Ururimi Rwawe',
    'landing.choose_role': 'Hitamo Uruhare Rwawe',
    'landing.get_started': 'TANGIRA UBUNYANGAMUGAYO',
    'landing.login': 'KWINJIRA',
    'role.caregiver': 'Umubyeyi/Umurera',
    'role.caregiver_desc': 'Serivisi z\'ubuzima, ubwikorezi, ibihembo',
    'wallet.title': 'Igikwama M-Supu',
    'wallet.balance': 'Amafaranga',
    'emergency.title': 'BYIHUTIRWA',
    'emergency.request_help': 'Saba ubufasha bwihuse',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);
  const [cachedTranslations, setCachedTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Initialize language from localStorage or user profile
    const initializeLanguage = async () => {
      try {
        // First check localStorage
        const savedLanguage = localStorage.getItem('paraboda_language') as Language;
        if (savedLanguage && languages.find(l => l.code === savedLanguage)) {
          setLanguage(savedLanguage);
          return;
        }

        // Then check user profile
        const userData = localStorage.getItem('paraboda_user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.preferredLanguage && languages.find(l => l.code === user.preferredLanguage)) {
            setLanguage(user.preferredLanguage);
            return;
          }
        }

        // Finally, detect from browser/location
        const browserLang = navigator.language.split('-')[0] as Language;
        if (languages.find(l => l.code === browserLang)) {
          setLanguage(browserLang);
        }
      } catch (error) {
        console.error('Error initializing language:', error);
      }
    };

    initializeLanguage();

    // Listen for online/offline status
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    
    try {
      // Save to localStorage
      localStorage.setItem('paraboda_language', lang);
      
      // Update user profile if exists
      const userData = localStorage.getItem('paraboda_user');
      if (userData) {
        const user = JSON.parse(userData);
        user.preferredLanguage = lang;
        localStorage.setItem('paraboda_user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    try {
      let translation = translations[language]?.[key as keyof typeof translations[typeof language]] || 
                      translations.en[key as keyof typeof translations.en] || 
                      key;

      // Handle parameter substitution
      if (params && typeof translation === 'string') {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
        });
      }

      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  const translateText = async (text: string, targetLang?: Language): Promise<string> => {
    const target = targetLang || language;
    if (target === 'en' || !text || text.trim() === '') return text;
    
    // Check cache first
    const cacheKey = `${text}_${target}`;
    if (cachedTranslations[cacheKey]) {
      return cachedTranslations[cacheKey];
    }

    // Use enhanced mock translation
    const translated = getMockTranslation(text, target);
    
    // Cache the translation
    setCachedTranslations(prev => ({
      ...prev,
      [cacheKey]: translated
    }));
    
    return translated;
  };

  const cacheTranslations = async (): Promise<void> => {
    try {
      // Pre-cache common translations for offline use
      const commonPhrases = [
        'Hello', 'Welcome', 'Health', 'Transport', 'Emergency', 'Community',
        'I need help', 'I have fever', 'Call a doctor', 'Where is hospital?',
        'Thank you', 'Please help', 'Medicine', 'Pain', 'Fever', 'Cough'
      ];

      const cachePromises = languages.map(async (lang) => {
        if (lang.code === 'en') return;
        
        const langTranslations: Record<string, string> = {};
        for (const phrase of commonPhrases) {
          langTranslations[`${phrase}_${lang.code}`] = await translateText(phrase, lang.code);
        }
        return langTranslations;
      });

      const results = await Promise.all(cachePromises);
      const mergedCache = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      
      setCachedTranslations(prev => ({ ...prev, ...mergedCache }));
      localStorage.setItem('paraboda_translation_cache', JSON.stringify(mergedCache));
    } catch (error) {
      console.error('Error caching translations:', error);
    }
  };

  // Load cached translations on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('paraboda_translation_cache');
      if (cached) {
        setCachedTranslations(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Error loading cached translations:', error);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t, 
      translateText,
      languages,
      isOfflineMode,
      cacheTranslations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Enhanced mock translation function
function getMockTranslation(text: string, targetLanguage: Language): string {
  const mockTranslations: Record<Language, Record<string, string>> = {
    sw: {
      // Health & Medical
      'I have fever and headache': 'Nina homa na maumivu ya kichwa',
      'I need emergency transport': 'Ninahitaji usafiri wa dharura',
      'My child needs vaccination': 'Mtoto wangu anahitaji chanjo',
      'Please help me': 'Tafadhali nisaidie',
      'Where is the hospital?': 'Hospitali iko wapi?',
      'I am sick': 'Mimi ni mgonjwa',
      'Call a doctor': 'Mwite daktari',
      'I need medicine': 'Ninahitaji dawa',
      'My stomach hurts': 'Tumbo langu linaumwa',
      'I cannot breathe well': 'Siwezi kupumua vizuri',
      'I am pregnant': 'Mimi ni mjamzito',
      'My baby is sick': 'Mtoto wangu ni mgonjwa',
      
      // Transport & Navigation
      'Take me to hospital': 'Nipelekie hospitali',
      'How much does it cost?': 'Bei ni kiasi gani?',
      'I need transport': 'Ninahitaji usafiri',
      'Emergency transport': 'Usafiri wa dharura',
      'Pick me up': 'Nijie uchukue',
      'I am at home': 'Niko nyumbani',
      'Come quickly': 'Njoo haraka',
      
      // Common Phrases
      'Hello': 'Hujambo',
      'Welcome': 'Karibu',
      'Thank you': 'Asante',
      'Please': 'Tafadhali',
      'Sorry': 'Pole',
      'Excuse me': 'Samahani',
      'Good morning': 'Habari za asubuhi',
      'Good afternoon': 'Habari za mchana',
      'Good evening': 'Habari za jioni',
      'How are you?': 'Habari yako?',
      'I am fine': 'Nzuri',
      'Yes': 'Ndiyo',
      'No': 'Hapana',
      'Maybe': 'Labda',
      'I understand': 'Naelewa',
      'I do not understand': 'Sielewi',
      'Help me': 'Nisaidie',
      'Wait': 'Ngoja',
      'Hurry': 'Haraka',
      
      // Family & People
      'Mother': 'Mama',
      'Father': 'Baba',
      'Child': 'Mtoto',
      'Baby': 'Mtoto mchanga',
      'Family': 'Familia',
      'Husband': 'Mume',
      'Wife': 'Mke',
      'Son': 'Mwana',
      'Daughter': 'Binti',
      
      // Health Terms
      'Health': 'Afya',
      'Medicine': 'Dawa',
      'Pain': 'Maumivu',
      'Fever': 'Homa',
      'Cough': 'Kikohozi',
      'Headache': 'Maumivu ya kichwa',
      'Stomach ache': 'Maumivu ya tumbo',
      'Diarrhea': 'Kuhara',
      'Vomiting': 'Kutapika',
      'Pregnant': 'Mjamzito',
      'Vaccination': 'Chanjo',
      'Malaria': 'Malaria',
      'Hospital': 'Hospitali',
      'Clinic': 'Kliniki',
      'Doctor': 'Daktari',
      'Nurse': 'Muuguzi',
      
      // Financial Terms
      'Money': 'Pesa',
      'Cost': 'Gharama',
      'Price': 'Bei',
      'Pay': 'Lipa',
      'Loan': 'Mkopo',
      'Savings': 'Akiba',
      'Wallet': 'Pochi',
      'Balance': 'Salio',
      
      // Location & Transport
      'Home': 'Nyumbani',
      'Village': 'Kijiji',
      'Town': 'Mji',
      'Road': 'Barabara',
      'Transport': 'Usafiri',
      'Motorcycle': 'Pikipiki',
      'Car': 'Gari',
      'Bus': 'Basi',
      'Walk': 'Tembea',
      'Distance': 'Umbali',
      'Near': 'Karibu',
      'Far': 'Mbali',
      
      // Time
      'Today': 'Leo',
      'Tomorrow': 'Kesho',
      'Yesterday': 'Jana',
      'Now': 'Sasa',
      'Later': 'Baadaye',
      'Morning': 'Asubuhi',
      'Afternoon': 'Mchana',
      'Evening': 'Jioni',
      'Night': 'Usiku',
      
      // Emergency & Urgency
      'Emergency': 'Dharura',
      'Urgent': 'Haraka',
      'Help': 'Msaada',
      'Danger': 'Hatari',
      'Safe': 'Salama',
      'Problem': 'Tatizo',
      'Solution': 'Suluhisho',
    },
    lg: {
      'Hello': 'Oli otya',
      'Welcome': 'Tusanyuse',
      'Health': 'Obulamu',
      'Transport': 'Entambula',
      'Emergency': 'Obwetaavu',
      'Community': 'Ekitundu',
      'Thank you': 'Webale',
      'Please': 'Nsaba',
      'Help': 'Obuyambi',
      'Money': 'Ssente',
      'Hospital': 'Eddwaliro',
      'Medicine': 'Eddagala',
      'Pain': 'Obulumi',
      'Fever': 'Omusujja',
      'Mother': 'Maama',
      'Child': 'Omwana',
      'Home': 'Eka',
    },
    fr: {
      'Hello': 'Bonjour',
      'Welcome': 'Bienvenue',
      'Health': 'Santé',
      'Transport': 'Transport',
      'Emergency': 'Urgence',
      'Community': 'Communauté',
      'Thank you': 'Merci',
      'Please': 'S\'il vous plaît',
      'Help': 'Aide',
      'Money': 'Argent',
      'Hospital': 'Hôpital',
      'Medicine': 'Médicament',
      'Pain': 'Douleur',
      'Fever': 'Fièvre',
      'Mother': 'Mère',
      'Child': 'Enfant',
      'Home': 'Maison',
    },
    rw: {
      'Hello': 'Muraho',
      'Welcome': 'Murakaza neza',
      'Health': 'Ubuzima',
      'Transport': 'Ubwikorezi',
      'Emergency': 'Byihutirwa',
      'Community': 'Umuryango',
      'Thank you': 'Murakoze',
      'Please': 'Nyamuneka',
      'Help': 'Ubufasha',
      'Money': 'Amafaranga',
      'Hospital': 'Ibitaro',
      'Medicine': 'Imiti',
      'Pain': 'Ububabare',
      'Fever': 'Umuriro',
      'Mother': 'Nyina',
      'Child': 'Umwana',
      'Home': 'Mu rugo',
    },
    en: {} // English is the base language
  };

  const langTranslations = mockTranslations[targetLanguage];
  return langTranslations?.[text] || text;
}