import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationService } from '../services/translationService';

export type Language = 'en' | 'sw' | 'ki' | 'luy' | 'luo' | 'kal' | 'kam' | 'mer' | 'mas' | 'som' | 'rw';

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
  { code: 'rw' as Language, name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼' },
  { code: 'ki' as Language, name: 'Kikuyu', nativeName: 'Gĩkũyũ', flag: '🇰🇪' },
  { code: 'luy' as Language, name: 'Luhya', nativeName: 'Luluhya', flag: '🇰🇪' },
  { code: 'luo' as Language, name: 'Luo', nativeName: 'Dholuo', flag: '🇰🇪' },
  { code: 'kal' as Language, name: 'Kalenjin', nativeName: 'Kalenjin', flag: '🇰🇪' },
  { code: 'kam' as Language, name: 'Kamba', nativeName: 'Kikamba', flag: '🇰🇪' },
  { code: 'mer' as Language, name: 'Meru', nativeName: 'Kimeru', flag: '🇰🇪' },
  { code: 'mas' as Language, name: 'Maasai', nativeName: 'Maa', flag: '🇰🇪' },
  { code: 'som' as Language, name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴' }
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
    'title.health_worker_dashboard': 'Health Worker Dashboard',
    
    // Analytics
    'analytics.overview': 'Analytics Overview',
    'analytics.system_performance': 'System Performance',
    'analytics.user_growth': 'User Growth',
    'analytics.ride_metrics': 'Ride Metrics',
    'analytics.health_trends': 'Health Trends',
    
    // Settings
    'settings.profile': 'Profile Settings',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.backup': 'Backup & Restore',
    'settings.language': 'Language',
    'settings.system': 'System Settings',
    
    // Notifications
    'notification.success': 'Success',
    'notification.error': 'Error',
    'notification.warning': 'Warning',
    'notification.info': 'Information',
    'notification.new_message': 'New Message',
    'notification.appointment_reminder': 'Appointment Reminder',
    'notification.ride_confirmed': 'Ride Confirmed',
    'notification.points_earned': 'Points Earned',
    
    // QR Code
    'qr.title': 'Your QR Code',
    'qr.description': 'Show this at health facilities for quick identification',
    'qr.download': 'Download QR Code',
    'qr.share': 'Share QR Code',
    
    // Language Selection
    'language.select': 'Select Language',
    'language.current': 'Current Language',
    'language.change': 'Change Language',
    'language.auto_detect': 'Auto Detect',
    
    // Error Messages
    'error.network': 'Network error. Please check your connection.',
    'error.invalid_input': 'Invalid input. Please check your data.',
    'error.permission_denied': 'Permission denied. Please contact administrator.',
    'error.not_found': 'Resource not found.',
    'error.server_error': 'Server error. Please try again later.',
    
    // Success Messages
    'success.saved': 'Data saved successfully.',
    'success.updated': 'Information updated successfully.',
    'success.deleted': 'Item deleted successfully.',
    'success.sent': 'Message sent successfully.',
    'success.uploaded': 'File uploaded successfully.'
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
    'title.health_worker_dashboard': 'Dashibodi ya Mfanyakazi wa Afya',
    
    // Analytics
    'analytics.overview': 'Muhtasari wa Uchanganuzi',
    'analytics.system_performance': 'Utendaji wa Mfumo',
    'analytics.user_growth': 'Ukuaji wa Watumiaji',
    'analytics.ride_metrics': 'Vipimo vya Safari',
    'analytics.health_trends': 'Mwelekeo wa Afya',
    
    // Settings
    'settings.profile': 'Mipangilio ya Wasifu',
    'settings.notifications': 'Arifa',
    'settings.security': 'Usalama',
    'settings.backup': 'Hifadhi na Rejesha',
    'settings.language': 'Lugha',
    'settings.system': 'Mipangilio ya Mfumo',
    
    // Notifications
    'notification.success': 'Mafanikio',
    'notification.error': 'Hitilafu',
    'notification.warning': 'Onyo',
    'notification.info': 'Taarifa',
    'notification.new_message': 'Ujumbe Mpya',
    'notification.appointment_reminder': 'Ukumbusho wa Miadi',
    'notification.ride_confirmed': 'Safari Imethibitishwa',
    'notification.points_earned': 'Pointi Zimepatikana',
    
    // QR Code
    'qr.title': 'QR Code Yako',
    'qr.description': 'Onyesha hii katika vituo vya afya kwa utambulisho wa haraka',
    'qr.download': 'Pakua QR Code',
    'qr.share': 'Shiriki QR Code',
    
    // Language Selection
    'language.select': 'Chagua Lugha',
    'language.current': 'Lugha ya Sasa',
    'language.change': 'Badilisha Lugha',
    'language.auto_detect': 'Tambua Kiotomatiki',
    
    // Error Messages
    'error.network': 'Hitilafu ya mtandao. Tafadhali angalia muunganisho wako.',
    'error.invalid_input': 'Ingizo lisilo sahihi. Tafadhali angalia data yako.',
    'error.permission_denied': 'Ruhusa imekataliwa. Tafadhali wasiliana na msimamizi.',
    'error.not_found': 'Rasilimali haijapatikana.',
    'error.server_error': 'Hitilafu ya seva. Tafadhali jaribu tena baadaye.',
    
    // Success Messages
    'success.saved': 'Data imehifadhiwa kwa mafanikio.',
    'success.updated': 'Taarifa imesasishwa kwa mafanikio.',
    'success.deleted': 'Kipengee kimefutwa kwa mafanikio.',
    'success.sent': 'Ujumbe umetumwa kwa mafanikio.',
    'success.uploaded': 'Faili imepakiwa kwa mafanikio.'
  },
  // Add basic translations for other languages
  rw: {
    'nav.overview': 'Incamake',
    'nav.households': 'Imiryango',
    'nav.transport': 'Ubwikorezi',
    'nav.alerts': 'Iburira',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Ibihembo',
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Ubuzima Hamwe',
    'action.login': 'Injira',
    'action.register': 'Iyandikishe',
    'users.community': 'Umuryango',
    'users.riders': 'Abatwara',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Abakozi bo Kubuzima',
    'users.admins': 'Abayobozi',
    'dashboard.community': 'Ikibaho cy\'Umuryango',
    'dashboard.rider': 'Ikibaho cy\'Umutwara',
    'dashboard.chv': 'Ikibaho cya CHV',
    'dashboard.health_worker': 'Ikibaho cy\'Umukozi wo Kubuzima',
    'dashboard.admin': 'Ikibaho cy\'Umuyobozi',
    'welcome.choose_role': 'Hitamo Uruhare Rwawe'
  },
  ki: {
    'nav.overview': 'Gĩthimi',
    'nav.households': 'Nyũmba',
    'nav.transport': 'Gũthiũra',
    'nav.alerts': 'Mataaro',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Iheo',
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Ũgima Hamwe',
    'action.login': 'Tonyia',
    'action.register': 'Ĩyandĩkithia',
    'users.community': 'Kĩrĩndĩ',
    'users.riders': 'Athiũri',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Aruti Wĩra wa Ũgima',
    'users.admins': 'Arangĩri',
    'dashboard.community': 'Gĩthimi kĩa Kĩrĩndĩ',
    'dashboard.rider': 'Gĩthimi kĩa Mũthiũri',
    'dashboard.chv': 'Gĩthimi kĩa CHV',
    'dashboard.health_worker': 'Gĩthimi kĩa Mũruti Wĩra wa Ũgima',
    'dashboard.admin': 'Gĩthimi kĩa Mũrangĩri',
    'welcome.choose_role': 'Thuura Wĩra Waku'
  },
  luy: {
    'nav.overview': 'Khulola',
    'nav.households': 'Amaka',
    'nav.transport': 'Okhusafirisha',
    'nav.alerts': 'Amalumuli',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Amaheo',
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Obulamu Hamwe',
    'action.login': 'Injila',
    'action.register': 'Iyandikhe',
    'users.community': 'Ekholo',
    'users.riders': 'Abasafirisha',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Abakholi bo Bulamu',
    'users.admins': 'Abalangishi',
    'dashboard.community': 'Ekholo Khulola',
    'dashboard.rider': 'Omusafirisha Khulola',
    'dashboard.chv': 'CHV Khulola',
    'dashboard.health_worker': 'Omukholi wo Bulamu Khulola',
    'dashboard.admin': 'Omulangishi Khulola',
    'welcome.choose_role': 'Chagula Omulimo Kwowo'
  },
  luo: {
    'nav.overview': 'Ngʼeyo',
    'nav.households': 'Udi',
    'nav.transport': 'Wuoth',
    'nav.alerts': 'Siem',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Mich',
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Ngima Kaachiel',
    'action.login': 'Donj',
    'action.register': 'Ndikri',
    'users.community': 'Oganda',
    'users.riders': 'Jowuoth',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Jotich Ngima',
    'users.admins': 'Jotelo',
    'dashboard.community': 'Oganda Ngʼeyo',
    'dashboard.rider': 'Jawuoth Ngʼeyo',
    'dashboard.chv': 'CHV Ngʼeyo',
    'dashboard.health_worker': 'Jatich Ngima Ngʼeyo',
    'dashboard.admin': 'Jatelo Ngʼeyo',
    'welcome.choose_role': 'Yier Tich Mari'
  },
  kal: {
    'nav.overview': 'Keny',
    'nav.households': 'Koik',
    'nav.transport': 'Kipsir',
    'nav.alerts': 'Kimuktaindet',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Kimuktaindet',
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Kipsigis Kamet',
    'action.login': 'Kiring',
    'action.register': 'Andik',
    'users.community': 'Kokwet',
    'users.riders': 'Chepsiriet',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Chepsoriet',
    'users.admins': 'Kiruogindet',
    'dashboard.community': 'Kokwet Keny',
    'dashboard.rider': 'Chepsiriet Keny',
    'dashboard.chv': 'CHV Keny',
    'dashboard.health_worker': 'Chepsoriet Keny',
    'dashboard.admin': 'Kiruogindet Keny',
    'welcome.choose_role': 'Walak Boisiongung'
  },
  kam: {
    'nav.overview': 'Kĩlonzo',
    'nav.households': 'Mĩsyi',
    'nav.transport': 'Kũthiũka',
    'nav.alerts': 'Matũma',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Syindu',
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Ũtũũ Paũmwe',
    'action.login': 'Tonyoka',
    'action.register': 'Andĩka',
    'users.community': 'Mbaĩ',
    'users.riders': 'Athiũki',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Aĩthi ma Ũtũũ',
    'users.admins': 'Aongoi',
    'dashboard.community': 'Mbaĩ Kĩlonzo',
    'dashboard.rider': 'Mũthiũki Kĩlonzo',
    'dashboard.chv': 'CHV Kĩlonzo',
    'dashboard.health_worker': 'Mũĩthi wa Ũtũũ Kĩlonzo',
    'dashboard.admin': 'Mũongoi Kĩlonzo',
    'welcome.choose_role': 'Sakua Wĩa Waku'
  },
  mer: {
    'nav.overview': 'Kĩrore',
    'nav.households': 'Nyũmba',
    'nav.transport': 'Gũthiũra',
    'nav.alerts': 'Mataaro',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Iheo',
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Ũgima Hamwe',
    'action.login': 'Tonyia',
    'action.register': 'Andĩka',
    'users.community': 'Kĩrĩndĩ',
    'users.riders': 'Athiũri',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Aruti Wĩra wa Ũgima',
    'users.admins': 'Arangĩri',
    'dashboard.community': 'Kĩrĩndĩ Kĩrore',
    'dashboard.rider': 'Mũthiũri Kĩrore',
    'dashboard.chv': 'CHV Kĩrore',
    'dashboard.health_worker': 'Mũruti Wĩra wa Ũgima Kĩrore',
    'dashboard.admin': 'Mũrangĩri Kĩrore',
    'welcome.choose_role': 'Thuura Wĩra Waku'
  },
  mas: {
    'nav.overview': 'Eidong',
    'nav.households': 'Inkishon',
    'nav.transport': 'Esidai',
    'nav.alerts': 'Ilkiama',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Inkishon',
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Ilkiama Nabo',
    'action.login': 'Eidong',
    'action.register': 'Aandik',
    'users.community': 'Oloshon',
    'users.riders': 'Ilosidai',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Ilkiama Aisiaayak',
    'users.admins': 'Ilaritak',
    'dashboard.community': 'Oloshon Eidong',
    'dashboard.rider': 'Olosidai Eidong',
    'dashboard.chv': 'CHV Eidong',
    'dashboard.health_worker': 'Olkiama Aisiaayak Eidong',
    'dashboard.admin': 'Olari Eidong',
    'welcome.choose_role': 'Tagelua Esiai Lino'
  },
  som: {
    'nav.overview': 'Dulmar',
    'nav.households': 'Qoysaska',
    'nav.transport': 'Gaadiidka',
    'nav.alerts': 'Digniin',
    'nav.bsense': 'B-Sense AI',
    'nav.rewards': 'Abaalmarinta',
    'welcome.title': 'ParaBoda',
    'welcome.subtitle': 'Caafimaad Wada',
    'action.login': 'Gal',
    'action.register': 'Diiwaangeli',
    'users.community': 'Bulshada',
    'users.riders': 'Darawallada',
    'users.chvs': 'CHVs',
    'users.health_workers': 'Shaqaalaha Caafimaadka',
    'users.admins': 'Maamulayaasha',
    'dashboard.community': 'Bulshada Dulmar',
    'dashboard.rider': 'Darawalka Dulmar',
    'dashboard.chv': 'CHV Dulmar',
    'dashboard.health_worker': 'Shaqaalaha Caafimaadka Dulmar',
    'dashboard.admin': 'Maamulaha Dulmar',
    'welcome.choose_role': 'Dooro Doorkaaga'
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
    
    try {
      return await translationService.translateText(text, target, 'en');
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
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