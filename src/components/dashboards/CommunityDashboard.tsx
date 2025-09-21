import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { EmergencyReportModal } from '../common/EmergencyReportModal';
import { UnifiedWalletInterface } from '../wallet/UnifiedWalletInterface';
import { healthRecordsService, ANCRecord, VaccinationRecord } from '../../services/healthRecordsService';
import { transportService, TransportRequest } from '../../services/transportService';
import { 
  Car, 
  Heart, 
  Baby, 
  AlertTriangle, 
  Brain,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Activity,
  Stethoscope,
  Shield,
  Phone,
  Navigation,
  Target,
  Zap,
  Eye,
  Plus,
  Bell,
  User,
  Users,
  Home,
  Wallet,
  Award,
  BarChart3,
  FileText,
  Settings,
  Loader
} from 'lucide-react';

// Import BSenseAI component properly
import { BSenseAI } from '../common/BSenseAI';

interface CaregiverHealthSummary {
  totalRecords: number;
  overdueVaccinations: number;
  upcomingANC: number;
  completedANC: number;
  emergencyRecords: number;
  lastConsultation?: Date;
}

export const CommunityDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification } = useData();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [emergencyType, setEmergencyType] = useState<'medical' | 'accident' | 'outbreak' | 'weather'>('medical');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  
  // Health data states
  const [ancRecords, setAncRecords] = useState<ANCRecord[]>([]);
  const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>([]);
  const [healthSummary, setHealthSummary] = useState<CaregiverHealthSummary>({
    totalRecords: 0,
    overdueVaccinations: 0,
    upcomingANC: 0,
    completedANC: 0,
    emergencyRecords: 0
  });
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>([]);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);


  // Load health data
  useEffect(() => {
    if (!user) return;

    const loadHealthData = async () => {
      setIsLoadingHealth(true);
      
      try {
        // Load ANC records
        const ancData = healthRecordsService.getANCRecords(user.id);
        setAncRecords(ancData);

        // Load vaccination records (for children)
        const vaccinationData = healthRecordsService.getVaccinationRecords('child_001'); // Mock child ID
        setVaccinationRecords(vaccinationData);

        // Load health summary
        const summary = healthRecordsService.getHealthSummary(user.id);
        setHealthSummary(summary);

        // Load transport requests
        const transportData = transportService.getCaregiverRequests(user.id);
        setTransportRequests(transportData);

      } catch (error) {
        console.error('Error loading health data:', error);
        addNotification({
          title: t('status.error'),
          message: language === 'sw' ? 'Imeshindwa kupakia data ya afya' : 'Failed to load health data',
          type: 'error',
          read: false
        });
      } finally {
        setIsLoadingHealth(false);
      }
    };

    loadHealthData();
  }, [user, t, language, addNotification]);

  const handleTransportRequest = (serviceType: string, urgency: 'normal' | 'semi_urgent' | 'emergency' = 'normal') => {
    setSelectedServiceType(serviceType);
    setActiveModal('transportRequest');
  };

  const handleEmergencyTransport = () => {
    setActiveModal('emergencyTransport');
  };

  const handleServiceRequest = async (requestData: any) => {
    try {
      // Create transport request
      const transportRequest = await transportService.createTransportRequest({
        caregiverId: user!.id,
        patientName: requestData.patientName || user!.name,
        serviceType: requestData.serviceId || 'routine',
        urgency: requestData.urgency || 'normal',
        pickup: {
          address: user!.location || 'Current location',
          gpsCoords: user!.gpsLocation
        },
        destination: {
          address: requestData.destination || 'Nearest health facility',
          facilityType: 'hospital',
          gpsCoords: undefined
        },
        estimatedDistance: requestData.distanceKm || 5,
        estimatedCost: requestData.estimatedCost || 500,
        estimatedTime: 30,
        paymentMethod: 'wallet',
        notes: requestData.additionalNotes
      });

      addNotification({
        title: language === 'sw' ? 'Ombi la Usafiri Limewasilishwa' : 'Transport Request Submitted',
        message: language === 'sw' 
          ? 'Ombi lako limewasilishwa kwa CHV na wasafiri'
          : 'Your request has been submitted to CHV and riders',
        type: 'success',
        read: false
      });

      setActiveModal(null);
      
      // Refresh transport requests
      const updatedRequests = transportService.getCaregiverRequests(user!.id);
      setTransportRequests(updatedRequests);

    } catch (error) {
      console.error('Error submitting transport request:', error);
      addNotification({
        title: t('status.error'),
        message: language === 'sw' ? 'Imeshindwa kuwasilisha ombi' : 'Failed to submit request',
        type: 'error',
        read: false
      });
    }
  };

  const handleEmergencySubmit = (reportData: any) => {
    addNotification({
      title: language === 'sw' ? 'Ripoti ya Dharura Imewasilishwa' : 'Emergency Report Submitted',
      message: language === 'sw' ? 'Ripoti yako imewasilishwa kwa CHV na msimamizi' : 'Your report has been submitted to CHV and admin',
      type: 'warning',
      read: false
    });
    setActiveModal(null);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'semi_urgent': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVaccineStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'missed': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen dashboard-bg-community">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya Walezi' : 'Caregiver Dashboard'}
        subtitle={language === 'sw' ? 'Huduma za afya za familia' : 'Family health services'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-blue-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-6xl">👨‍👩‍👧‍👦</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  {language === 'sw' ? '👨‍👩‍👧‍👦 Dashibodi ya Walezi' : '👨‍👩‍👧‍👦 Caregiver Dashboard'}
                </h1>
                <p className="text-lg text-blue-600 font-bold">
                  {language === 'sw' ? 'Huduma za Afya za Familia' : 'Family Health Services'}
                </p>
              </div>
            </div>
            <div className="bg-blue-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-blue-800 font-semibold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </p>
              <p className="text-xs text-blue-700">
                {user?.location} • {language === 'sw' ? 'Familia ID' : 'Family ID'}: {user?.id?.slice(-6)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Transport Button - Always Visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-50 md:relative md:bottom-auto md:right-auto md:mb-8"
        >
          <button
            onClick={handleEmergencyTransport}
            className="w-20 h-20 md:w-full md:h-auto md:p-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full md:rounded-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 animate-pulse flex items-center justify-center md:justify-start space-x-0 md:space-x-4"
            aria-label={language === 'sw' ? 'Dharura' : 'Emergency'}
          >
            <div className="text-3xl md:text-5xl">🚨</div>
            <div className="hidden md:block">
              <div className="text-2xl font-black">
                {language === 'sw' ? 'DHARURA' : 'EMERGENCY'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Omba usafiri wa haraka' : 'Request urgent transport'}
              </div>
            </div>
          </button>
        </motion.div>

        {/* Quick Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Request Transport */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => handleTransportRequest('routine')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🚕</div>
            <Car className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'OMBA USAFIRI' : 'REQUEST TRANSPORT'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Kwenda hospitali' : 'To health facility'}
              </div>
            </div>
          </motion.button>

          {/* ANC Visits */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setActiveModal('ancVisits')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3 relative"
          >
            <div className="text-5xl">🤱</div>
            <Heart className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'ZIARA ZA ANC' : 'ANC VISITS'}
              </div>
              <div className="text-sm opacity-90">
                {ancRecords.length > 0 
                  ? `${ancRecords.filter(a => a.status === 'completed').length}/${ancRecords[0]?.totalVisits || 4} ${language === 'sw' ? 'zimekamilika' : 'completed'}`
                  : (language === 'sw' ? 'Hakuna rekodi' : 'No records')
                }
              </div>
            </div>
            {healthSummary.upcomingANC > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center text-xs font-bold">
                {healthSummary.upcomingANC}
              </div>
            )}
          </motion.button>

          {/* Child Vaccinations */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveModal('vaccinations')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3 relative"
          >
            <div className="text-5xl">💉</div>
            <Baby className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'CHANJO' : 'VACCINATIONS'}
              </div>
              <div className="text-sm opacity-90">
                {vaccinationRecords.length > 0 
                  ? `${vaccinationRecords.filter(v => v.status === 'completed').length} ${language === 'sw' ? 'zimepewa' : 'given'}`
                  : (language === 'sw' ? 'Hakuna rekodi' : 'No records')
                }
              </div>
            </div>
            {healthSummary.overdueVaccinations > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-red-900 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                {healthSummary.overdueVaccinations}
              </div>
            )}
          </motion.button>

          {/* Health Consultation */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setActiveModal('bsenseAI')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🧠</div>
            <Brain className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'USHAURI WA AFYA' : 'HEALTH CONSULT'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'AI msaidizi' : 'AI assistant'}
              </div>
            </div>
          </motion.button>
        </div>

        {/* Health Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <span>{language === 'sw' ? 'Hali ya Afya ya Familia' : 'Family Health Status'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ANC Progress */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-pink-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{language === 'sw' ? 'Ziara za ANC' : 'ANC Visits'}</h3>
                  <p className="text-sm text-gray-600">
                    {ancRecords.length > 0 
                      ? `${ancRecords.filter(a => a.status === 'completed').length}/${ancRecords[0]?.totalVisits || 4}`
                      : (language === 'sw' ? 'Hakuna mimba' : 'No pregnancy')
                    }
                  </p>
                </div>
              </div>
              {ancRecords.length > 0 && (
                <div className="w-full bg-pink-200 rounded-full h-3">
                  <div 
                    className="bg-pink-600 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(ancRecords.filter(a => a.status === 'completed').length / (ancRecords[0]?.totalVisits || 4)) * 100}%` 
                    }}
                  ></div>
                </div>
              )}
            </div>

            {/* Vaccination Status */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Baby className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{language === 'sw' ? 'Chanjo za Mtoto' : 'Child Vaccines'}</h3>
                  <p className="text-sm text-gray-600">
                    {vaccinationRecords.filter(v => v.status === 'completed').length} {language === 'sw' ? 'zimepewa' : 'given'}
                  </p>
                </div>
              </div>
              {healthSummary.overdueVaccinations > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-red-800 text-sm font-bold">
                    {healthSummary.overdueVaccinations} {language === 'sw' ? 'zimechelewa' : 'overdue'}
                  </p>
                </div>
              )}
            </div>

            {/* Transport History */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{language === 'sw' ? 'Safari' : 'Transport'}</h3>
                  <p className="text-sm text-gray-600">
                    {transportRequests.filter(r => r.status === 'completed').length} {language === 'sw' ? 'zimekamilika' : 'completed'}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {language === 'sw' ? 'Gharama ya jumla' : 'Total spent'}: {formatAmount(
                  transportRequests
                    .filter(r => r.status === 'completed')
                    .reduce((sum, r) => sum + r.estimatedCost, 0)
                )}
              </div>
            </div>

            {/* Emergency Records */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{language === 'sw' ? 'Dharura' : 'Emergencies'}</h3>
                  <p className="text-sm text-gray-600">
                    {healthSummary.emergencyRecords} {language === 'sw' ? 'kesi' : 'cases'}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {language === 'sw' ? 'Mwisho' : 'Last'}: {healthSummary.lastConsultation?.toLocaleDateString() || 'N/A'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* M-SUPU Wallet Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Wallet className="w-8 h-8 text-emerald-600" />
            <span>{t('wallet.title')}</span>
          </h2>

          <UnifiedWalletInterface embedded={true} />
        </motion.div>

        {/* Recent Transport Requests */}
        {transportRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Navigation className="w-8 h-8 text-orange-500" />
              <span>{language === 'sw' ? 'Maombi ya Usafiri' : 'Transport Requests'}</span>
            </h2>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
              <div className="space-y-4">
                {transportRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.patientName}</h4>
                        <p className="text-sm text-gray-600">
                          {request.pickup.address} → {request.destination.address}
                        </p>
                        <p className="text-xs text-gray-500">
                          {request.requestedAt.toLocaleDateString()} {request.requestedAt.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency === 'emergency' ? (language === 'sw' ? 'DHARURA' : 'EMERGENCY') :
                           request.urgency === 'semi_urgent' ? (language === 'sw' ? 'HARAKA' : 'URGENT') :
                           (language === 'sw' ? 'KAWAIDA' : 'NORMAL')}
                        </span>
                        <div className="text-sm font-semibold text-gray-900 mt-1">
                          {formatAmount(request.estimatedCost)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status === 'pending' ? (language === 'sw' ? 'Inasubiri' : 'Pending') :
                         request.status === 'accepted' ? (language === 'sw' ? 'Imekubaliwa' : 'Accepted') :
                         request.status === 'in_progress' ? (language === 'sw' ? 'Inaendelea' : 'In Progress') :
                         request.status === 'completed' ? (language === 'sw' ? 'Imekamilika' : 'Completed') :
                         (language === 'sw' ? 'Imeghairiwa' : 'Cancelled')}
                      </span>
                      {request.riderName && (
                        <div className="text-sm text-gray-600">
                          {language === 'sw' ? 'Msafiri' : 'Rider'}: {request.riderName}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ANC Visits Modal */}
      {activeModal === 'ancVisits' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <Heart className="w-8 h-8 text-pink-600" />
                  <span>{language === 'sw' ? 'Ziara za ANC' : 'ANC Visits'}</span>
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {ancRecords.length > 0 ? (
                <div className="space-y-4">
                  {/* Progress Overview */}
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-pink-900">
                        {language === 'sw' ? 'Maendeleo ya ANC' : 'ANC Progress'}
                      </h3>
                      <span className="text-pink-600 font-bold">
                        {ancRecords.filter(a => a.status === 'completed').length}/{ancRecords[0]?.totalVisits || 4}
                      </span>
                    </div>
                    <div className="w-full bg-pink-200 rounded-full h-3">
                      <div 
                        className="bg-pink-600 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(ancRecords.filter(a => a.status === 'completed').length / (ancRecords[0]?.totalVisits || 4)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* ANC Records */}
                  <div className="space-y-3">
                    {ancRecords.map((record) => (
                      <div key={record.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {language === 'sw' ? 'Ziara ya' : 'Visit'} {record.visitNumber}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {record.date.toLocaleDateString()} • {record.gestationalAge} {language === 'sw' ? 'wiki' : 'weeks'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === 'completed' ? 'bg-green-100 text-green-800' :
                            record.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status === 'completed' ? (language === 'sw' ? 'Imekamilika' : 'Completed') :
                             record.status === 'scheduled' ? (language === 'sw' ? 'Imepangwa' : 'Scheduled') :
                             (language === 'sw' ? 'Imechelewa' : 'Overdue')}
                          </span>
                        </div>
                        
                        {record.status === 'completed' && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {record.weight && (
                              <div>
                                <span className="text-gray-600">{language === 'sw' ? 'Uzito' : 'Weight'}:</span>
                                <span className="ml-2 font-semibold">{record.weight} kg</span>
                              </div>
                            )}
                            {record.bloodPressure && (
                              <div>
                                <span className="text-gray-600">{language === 'sw' ? 'Shinikizo' : 'BP'}:</span>
                                <span className="ml-2 font-semibold">{record.bloodPressure}</span>
                              </div>
                            )}
                            {record.hemoglobin && (
                              <div>
                                <span className="text-gray-600">{language === 'sw' ? 'Hemoglobini' : 'Hemoglobin'}:</span>
                                <span className="ml-2 font-semibold">{record.hemoglobin} g/dL</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {record.nextVisitDate && (
                          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-800 font-medium">
                                {language === 'sw' ? 'Ziara ijayo' : 'Next visit'}: {record.nextVisitDate.toLocaleDateString()}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                handleTransportRequest('anc', 'semi_urgent');
                                setActiveModal(null);
                              }}
                              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              {language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-500 mb-2">
                    {language === 'sw' ? 'Hakuna Rekodi za ANC' : 'No ANC Records'}
                  </h3>
                  <p className="text-gray-400">
                    {language === 'sw' ? 'Rekodi za ANC zitaonyeshwa hapa' : 'ANC visit records will appear here'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Vaccinations Modal */}
      {activeModal === 'vaccinations' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <Baby className="w-8 h-8 text-green-600" />
                  <span>{language === 'sw' ? 'Chanjo za Mtoto' : 'Child Vaccinations'}</span>
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {vaccinationRecords.length > 0 ? (
                <div className="space-y-4">
                  {/* Overdue Alerts */}
                  {healthSummary.overdueVaccinations > 0 && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <h3 className="font-bold text-red-900">
                          {language === 'sw' ? 'Chanjo Zilizochelewa' : 'Overdue Vaccinations'}
                        </h3>
                      </div>
                      <p className="text-red-800 mb-3">
                        {healthSummary.overdueVaccinations} {language === 'sw' ? 'chanjo zimechelewa' : 'vaccines are overdue'}
                      </p>
                      <button
                        onClick={() => {
                          handleTransportRequest('vaccination', 'semi_urgent');
                          setActiveModal(null);
                        }}
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-bold"
                      >
                        {language === 'sw' ? 'Omba Usafiri wa Chanjo' : 'Request Vaccination Transport'}
                      </button>
                    </div>
                  )}

                  {/* Vaccination Schedule */}
                  <div className="space-y-3">
                    {vaccinationRecords.map((vaccine) => (
                      <div key={vaccine.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {vaccine.vaccine} - {language === 'sw' ? 'Kipimo' : 'Dose'} {vaccine.dose}/{vaccine.totalDoses}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {language === 'sw' ? 'Umri wa mtoto' : 'Child age'}: {vaccine.childAge} {language === 'sw' ? 'wiki' : 'weeks'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {vaccine.date.toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVaccineStatusColor(vaccine.status)}`}>
                            {vaccine.status === 'completed' ? (language === 'sw' ? 'Imepewa' : 'Given') :
                             vaccine.status === 'scheduled' ? (language === 'sw' ? 'Imepangwa' : 'Scheduled') :
                             vaccine.status === 'overdue' ? (language === 'sw' ? 'Imechelewa' : 'Overdue') :
                             (language === 'sw' ? 'Imekoswa' : 'Missed')}
                          </span>
                        </div>
                        
                        {vaccine.status === 'overdue' && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-800 text-sm mb-2">
                              {language === 'sw' ? 'Chanjo hii imechelewa. Inahitaji kupewa haraka.' : 'This vaccine is overdue. Needs immediate attention.'}
                            </p>
                            <button
                              onClick={() => {
                                handleTransportRequest('vaccination', 'emergency');
                                setActiveModal(null);
                              }}
                              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              {language === 'sw' ? 'Omba Usafiri wa Dharura' : 'Request Emergency Transport'}
                            </button>
                          </div>
                        )}
                        
                        {vaccine.nextDoseDate && vaccine.status === 'completed' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-800 font-medium">
                                {language === 'sw' ? 'Kipimo kijayo' : 'Next dose'}: {vaccine.nextDoseDate.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Baby className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-500 mb-2">
                    {language === 'sw' ? 'Hakuna Rekodi za Chanjo' : 'No Vaccination Records'}
                  </h3>
                  <p className="text-gray-400">
                    {language === 'sw' ? 'Rekodi za chanjo zitaonyeshwa hapa' : 'Vaccination records will appear here'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* All Modals */}
      <ServiceRequestModal
        isOpen={activeModal === 'transportRequest'}
        onClose={() => setActiveModal(null)}
        onRequest={handleServiceRequest}
        serviceType={selectedServiceType}
      />

      <ServiceRequestModal
        isOpen={activeModal === 'emergencyTransport'}
        onClose={() => setActiveModal(null)}
        onRequest={handleServiceRequest}
        serviceType="emergency"
      />

      <BSenseAI
        isOpen={activeModal === 'bsenseAI'}
        onClose={() => setActiveModal(null)}
        userRole="community"
      />

      <EmergencyReportModal
        isOpen={activeModal === 'emergencyReport'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleEmergencySubmit}
        emergencyType={emergencyType}
      />
    </div>
  );
};