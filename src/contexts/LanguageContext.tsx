import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'sw' | 'fr' | 'rw' | 'rn' | 'am' | 'ln' | 'om' | 'so' | 'lg';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateText: (text: string, targetLang?: Language) => Promise<string>;
  languages: Array<{
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
  }>;
}

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'sw' as Language, name: 'Kiswahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'rw' as Language, name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼' },
  { code: 'rn' as Language, name: 'Kirundi', nativeName: 'Ikirundi', flag: '🇧🇮' },
  { code: 'am' as Language, name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ln' as Language, name: 'Lingala', nativeName: 'Lingála', flag: '🇨🇩' },
  { code: 'om' as Language, name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹' },
  { code: 'so' as Language, name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴' },
  { code: 'lg' as Language, name: 'Luganda', nativeName: 'Luganda', flag: '🇺🇬' }
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
    'nav.wallet': 'M-Supu',
    'nav.reports': 'Reports',
    'nav.myths': 'Myth Busters',
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.users': 'Users',
    'nav.settings': 'Settings',
    
    // Actions
    'action.add': 'Add',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.submit': 'Submit',
    'action.approve': 'Approve',
    'action.reject': 'Reject',
    'action.view': 'View',
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.export': 'Export',
    'action.import': 'Import',
    'action.refresh': 'Refresh',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.previous': 'Previous',
    'action.register': 'Register',
    'action.login': 'Login',
    'action.logout': 'Logout',
    
    // Status
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.completed': 'Completed',
    'status.in_progress': 'In Progress',
    'status.cancelled': 'Cancelled',
    'status.resolved': 'Resolved',
    'status.investigating': 'Investigating',
    'status.new': 'New',
    'status.online': 'Online',
    'status.offline': 'Offline',
    
    // Forms
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone Number',
    'form.location': 'Location',
    'form.address': 'Address',
    'form.date': 'Date',
    'form.time': 'Time',
    'form.description': 'Description',
    'form.notes': 'Notes',
    'form.required': 'Required',
    'form.optional': 'Optional',
    'form.role': 'Role',
    
    // Dashboard Titles
    'dashboard.community': 'Community Dashboard',
    'dashboard.rider': 'Rider Dashboard',
    'dashboard.chv': 'CHV Dashboard',
    'dashboard.health_worker': 'Health Worker Dashboard',
    'dashboard.admin': 'Admin Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.users': 'Users',
    'dashboard.analytics': 'Analytics',
    'dashboard.bsense': 'B-Sense AI',
    'dashboard.settings': 'Settings',
    'dashboard.rides': 'Rides',
    'dashboard.map': 'Map',
    'dashboard.emergency': 'Emergency',
    'dashboard.myths': 'Myths',
    'dashboard.rewards': 'Rewards',
    
    // Welcome Messages
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Health Together',
    'welcome.choose_language': 'Choose Your Language',
    'welcome.choose_role': 'Choose Your Role',
    'welcome.get_started': 'Get Started',
    
    // Users
    'users.community': 'Community',
    'users.riders': 'Riders',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Health Workers',
    'users.admins': 'Admins',
    'users.total': 'Total Users',
    'users.active': 'Active Users',
    'users.manage': 'Manage Users',
    'users.add_user': 'Add User',
    'users.edit_user': 'Edit User',
    'users.user_details': 'User Details',
    'users.last_login': 'Last Login',
    
    // Health & Medical
    'health.vaccination': 'Vaccination',
    'health.anc': 'ANC Visit',
    'health.pnc': 'PNC Visit',
    'health.emergency': 'Emergency',
    'health.checkup': 'Checkup',
    'health.appointment': 'Appointment',
    'health.patient': 'Patient',
    'health.clinic': 'Clinic',
    'health.hospital': 'Hospital',
    'health.medicine': 'Medicine',
    'health.treatment': 'Treatment',
    
    // Transport
    'transport.ride': 'Ride',
    'transport.pickup': 'Pickup',
    'transport.destination': 'Destination',
    'transport.rider': 'Rider',
    'transport.passenger': 'Passenger',
    'transport.fare': 'Fare',
    'transport.distance': 'Distance',
    'transport.duration': 'Duration',
    'transport.eta': 'ETA',
    'transport.available': 'Available Rides',
    
    // Rewards & Points
    'rewards.points': 'Points',
    'rewards.level': 'Level',
    'rewards.redeem': 'Redeem',
    'rewards.donate': 'Donate',
    'rewards.balance': 'Balance',
    'rewards.earned': 'Earned',
    'rewards.spent': 'Spent',
    
    // Time & Dates
    'time.today': 'Today',
    'time.yesterday': 'Yesterday',
    'time.tomorrow': 'Tomorrow',
    'time.this_week': 'This Week',
    'time.last_week': 'Last Week',
    'time.this_month': 'This Month',
    'time.last_month': 'Last Month',
    'time.morning': 'Morning',
    'time.afternoon': 'Afternoon',
    'time.evening': 'Evening',
    'time.night': 'Night',
    
    // Messages
    'message.welcome': 'Welcome',
    'message.success': 'Success',
    'message.error': 'Error',
    'message.loading': 'Loading',
    
    // Quick Actions
    'quick.report_emergency': 'Report Emergency',
    'quick.report_myth': 'Report Myth',
    'quick.view_map': 'View Map',
    'quick.get_rewards': 'Get Rewards',
    
    // Titles
    'title.admin_dashboard': 'Admin Dashboard',
    'title.rider_dashboard': 'Rider Dashboard',
    'title.community_dashboard': 'Community Dashboard',
    'title.chv_dashboard': 'CHV Dashboard',
    'title.health_worker_dashboard': 'Health Worker Dashboard'
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
    'nav.wallet': 'M-Supu',
    'nav.reports': 'Ripoti',
    'nav.myths': 'Kupambana na Uwongo',
    'nav.dashboard': 'Dashibodi',
    'nav.analytics': 'Uchanganuzi',
    'nav.users': 'Watumiaji',
    'nav.settings': 'Mipangilio',
    
    // Actions
    'action.add': 'Ongeza',
    'action.edit': 'Hariri',
    'action.delete': 'Futa',
    'action.save': 'Hifadhi',
    'action.cancel': 'Ghairi',
    'action.submit': 'Wasilisha',
    'action.approve': 'Idhinisha',
    'action.reject': 'Kataa',
    'action.view': 'Ona',
    'action.search': 'Tafuta',
    'action.filter': 'Chuja',
    'action.export': 'Hamisha',
    'action.import': 'Leta',
    'action.refresh': 'Onyesha Upya',
    'action.back': 'Rudi',
    'action.next': 'Ijayo',
    'action.previous': 'Iliyopita',
    'action.register': 'Jiunge',
    'action.login': 'Ingia',
    'action.logout': 'Toka',
    
    // Status
    'status.active': 'Hai',
    'status.inactive': 'Haifanyi Kazi',
    'status.pending': 'Inasubiri',
    'status.approved': 'Imeidhinishwa',
    'status.rejected': 'Imekataliwa',
    'status.completed': 'Imekamilika',
    'status.in_progress': 'Inaendelea',
    'status.cancelled': 'Imeghairiwa',
    'status.resolved': 'Imetatuliwa',
    'status.investigating': 'Inachunguzwa',
    'status.new': 'Mpya',
    'status.online': 'Mtandaoni',
    'status.offline': 'Nje ya Mtandao',
    
    // Forms
    'form.name': 'Jina',
    'form.email': 'Barua Pepe',
    'form.phone': 'Nambari ya Simu',
    'form.location': 'Mahali',
    'form.address': 'Anwani',
    'form.date': 'Tarehe',
    'form.time': 'Muda',
    'form.description': 'Maelezo',
    'form.notes': 'Maelezo ya Ziada',
    'form.required': 'Inahitajika',
    'form.optional': 'Si Lazima',
    'form.role': 'Jukumu',
    
    // Dashboard Titles
    'dashboard.community': 'Dashibodi ya Jamii',
    'dashboard.rider': 'Dashibodi ya Msafiri',
    'dashboard.chv': 'Dashibodi ya CHV',
    'dashboard.health_worker': 'Dashibodi ya Mfanyakazi wa Afya',
    'dashboard.admin': 'Dashibodi ya Msimamizi',
    'dashboard.overview': 'Muhtasari',
    'dashboard.users': 'Watumiaji',
    'dashboard.analytics': 'Uchanganuzi',
    'dashboard.bsense': 'B-Sense AI',
    'dashboard.settings': 'Mipangilio',
    'dashboard.rides': 'Safari',
    'dashboard.map': 'Ramani',
    'dashboard.emergency': 'Dharura',
    'dashboard.myths': 'Uwongo',
    'dashboard.rewards': 'Zawadi',
    
    // Welcome Messages
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Afya Pamoja',
    'welcome.choose_language': 'Chagua Lugha Yako',
    'welcome.choose_role': 'Chagua Jukumu Lako',
    'welcome.get_started': 'Anza',
    
    // Users
    'users.community': 'Jamii',
    'users.riders': 'Wasafiri',
    'users.chvs': 'CHV',
    'users.health_workers': 'Wafanyakazi wa Afya',
    'users.admins': 'Wasimamizi',
    'users.total': 'Watumiaji Wote',
    'users.active': 'Watumiaji Hai',
    'users.manage': 'Simamia Watumiaji',
    'users.add_user': 'Ongeza Mtumiaji',
    'users.edit_user': 'Hariri Mtumiaji',
    'users.user_details': 'Taarifa za Mtumiaji',
    'users.last_login': 'Kuingia Mwisho',
    
    // Health & Medical
    'health.vaccination': 'Chanjo',
    'health.anc': 'Ziara ya ANC',
    'health.pnc': 'Ziara ya PNC',
    'health.emergency': 'Dharura',
    'health.checkup': 'Uchunguzi',
    'health.appointment': 'Miadi',
    'health.patient': 'Mgonjwa',
    'health.clinic': 'Kliniki',
    'health.hospital': 'Hospitali',
    'health.medicine': 'Dawa',
    'health.treatment': 'Matibabu',
    
    // Transport
    'transport.ride': 'Safari',
    'transport.pickup': 'Kuchukua',
    'transport.destination': 'Marudio',
    'transport.rider': 'Msafiri',
    'transport.passenger': 'Abiria',
    'transport.fare': 'Nauli',
    'transport.distance': 'Umbali',
    'transport.duration': 'Muda',
    'transport.eta': 'Muda wa Kuwasili',
    'transport.available': 'Safari Zinazopatikana',
    
    // Rewards & Points
    'rewards.points': 'Pointi',
    'rewards.level': 'Kiwango',
    'rewards.redeem': 'Chukua',
    'rewards.donate': 'Changia',
    'rewards.balance': 'Salio',
    'rewards.earned': 'Zilizopatikana',
    'rewards.spent': 'Zilizotumika',
    
    // Time & Dates
    'time.today': 'Leo',
    'time.yesterday': 'Jana',
    'time.tomorrow': 'Kesho',
    'time.this_week': 'Wiki Hii',
    'time.last_week': 'Wiki Iliyopita',
    'time.this_month': 'Mwezi Huu',
    'time.last_month': 'Mwezi Uliopita',
    'time.morning': 'Asubuhi',
    'time.afternoon': 'Mchana',
    'time.evening': 'Jioni',
    'time.night': 'Usiku',
    
    // Messages
    'message.welcome': 'Karibu',
    'message.success': 'Mafanikio',
    'message.error': 'Hitilafu',
    'message.loading': 'Inapakia',
    
    // Quick Actions
    'quick.report_emergency': 'Ripoti Dharura',
    'quick.report_myth': 'Ripoti Uwongo',
    'quick.view_map': 'Ona Ramani',
    'quick.get_rewards': 'Chukua Zawadi',
    
    // Titles
    'title.admin_dashboard': 'Dashibodi ya Msimamizi',
    'title.rider_dashboard': 'Dashibodi ya Msafiri',
    'title.community_dashboard': 'Dashibodi ya Jamii',
    'title.chv_dashboard': 'Dashibodi ya CHV',
    'title.health_worker_dashboard': 'Dashibodi ya Mfanyakazi wa Afya'
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

  useEffect(() => {
    // Try to get language from localStorage
    try {
      const savedLanguage = localStorage.getItem('paraboda_language') as Language;
      if (savedLanguage && languages.find(l => l.code === savedLanguage)) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('paraboda_language', lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key: string): string => {
    try {
      const translation = translations[language]?.[key as keyof typeof translations[typeof language]];
      return translation || translations.en[key as keyof typeof translations.en] || key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  const translateText = async (text: string, targetLang?: Language): Promise<string> => {
    const target = targetLang || language;
    if (target === 'en') return text;
    
    // Simple mock translation for common phrases
    const mockTranslations: Record<string, string> = {
      'Hello': 'Hujambo',
      'Welcome': 'Karibu',
      'Health': 'Afya',
      'Transport': 'Usafiri',
      'Emergency': 'Dharura',
      'Community': 'Jamii'
    };
    
    return mockTranslations[text] || text;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t, 
      translateText,
      languages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};