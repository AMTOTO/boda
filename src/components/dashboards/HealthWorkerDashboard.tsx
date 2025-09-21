import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Modal } from '../common/Modal';
import { QRScanner } from '../common/QRScanner';
import { BSenseAI } from '../common/BSenseAI';
import { UnifiedWalletInterface } from '../wallet/UnifiedWalletInterface';
import { healthWorkerService, Patient, VaccineStock, SupplementStock, ServiceRequest } from '../../services/healthWorkerService';
import { 
  Users, 
  Stethoscope, 
  Package, 
  Car, 
  Wallet,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Brain,
  Activity,
  TrendingUp,
  BarChart3,
  FileText,
  Settings,
  Bell,
  MapPin,
  Phone,
  Mail,
  Baby,
  Heart,
  Shield,
  Syringe,
  Pill,
  Clock,
  Star,
  Award,
  Target,
  Zap,
  Navigation,
  X,
  Edit,
  Save,
  Download,
  Upload,
  RefreshCw,
  UserPlus,
  CalendarPlus,
  CheckSquare,
  AlertCircle,
  Info,
  Loader
} from 'lucide-react';

export const HealthWorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification } = useData();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedServiceRequest, setSelectedServiceRequest] = useState<ServiceRequest | null>(null);
  
  // Data states
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vaccineStock, setVaccineStock] = useState<VaccineStock[]>([]);
  const [supplementStock, setSupplementStock] = useState<SupplementStock[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'due' | 'overdue'>('all');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'low' | 'medium' | 'high' | 'emergency'>('all');
  
  // Health worker stats
  const [hwStats, setHwStats] = useState({
    totalPatients: 0,
    patientsToday: 0,
    vaccinationsGiven: 0,
    ancVisitsCompleted: 0,
    lowStockItems: 0,
    pendingRequests: 0,
    emergencyRequests: 0,
    shaContributions: 0
  });

  // Load health worker data
  useEffect(() => {
    if (!user) return;

    const loadHealthWorkerData = async () => {
      setIsLoading(true);
      
      try {
        // Load patients assigned to this health worker
        const facilityPatients = healthWorkerService.getFacilityPatients(user.location || '');
        setPatients(facilityPatients);

        // Load vaccine inventory
        const vaccines = healthWorkerService.getVaccineInventory();
        setVaccineStock(vaccines);

        // Load supplement inventory
        const supplements = healthWorkerService.getSupplementInventory();
        setSupplementStock(supplements);

        // Load service requests
        const requests = healthWorkerService.getServiceRequests(user.location || '');
        setServiceRequests(requests);

        // Calculate stats
        const stats = healthWorkerService.getHealthWorkerStats(user.id);
        setHwStats(stats);

      } catch (error) {
        console.error('Error loading health worker data:', error);
        addNotification({
          title: t('status.error'),
          message: language === 'sw' ? 'Imeshindwa kupakia data ya mfanyakazi wa afya' : 'Failed to load health worker data',
          type: 'error',
          read: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHealthWorkerData();
  }, [user, t, language, addNotification]);

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedPatient(null);
    setSelectedServiceRequest(null);
  };

  const handlePatientAdded = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
    setHwStats(prev => ({ ...prev, totalPatients: prev.totalPatients + 1 }));
    addNotification({
      title: language === 'sw' ? 'Mgonjwa Ameongezwa' : 'Patient Added',
      message: language === 'sw' 
        ? `${patient.name} ameongezwa kwenye orodha ya wagonjwa`
        : `${patient.name} added to patient list`,
      type: 'success',
      read: false
    });
    handleModalClose();
  };

  const handleServiceCompleted = (patientId: string, serviceType: string) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId 
        ? { ...p, lastServiceDate: new Date(), status: 'active' }
        : p
    ));
    
    setHwStats(prev => ({
      ...prev,
      vaccinationsGiven: serviceType === 'vaccination' ? prev.vaccinationsGiven + 1 : prev.vaccinationsGiven,
      ancVisitsCompleted: serviceType === 'anc' ? prev.ancVisitsCompleted + 1 : prev.ancVisitsCompleted
    }));

    addNotification({
      title: language === 'sw' ? 'Huduma Imekamilika' : 'Service Completed',
      message: language === 'sw' 
        ? `Huduma ya ${serviceType} imekamilika`
        : `${serviceType} service completed`,
      type: 'success',
      read: false
    });
  };

  const handleStockUpdate = (itemId: string, newStock: number, itemType: 'vaccine' | 'supplement') => {
    if (itemType === 'vaccine') {
      setVaccineStock(prev => prev.map(v => 
        v.id === itemId ? { ...v, currentStock: newStock } : v
      ));
    } else {
      setSupplementStock(prev => prev.map(s => 
        s.id === itemId ? { ...s, currentStock: newStock } : s
      ));
    }

    addNotification({
      title: language === 'sw' ? 'Hisa Imesasishwa' : 'Stock Updated',
      message: language === 'sw' 
        ? 'Hisa ya duka imesasishwa'
        : 'Inventory stock updated',
      type: 'success',
      read: false
    });
  };

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.householdId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.chvName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filterStatus) {
      case 'due':
        return patient.status === 'anc_due' || patient.status === 'vaccination_due';
      case 'overdue':
        return patient.status === 'overdue';
      case 'active':
        return patient.status === 'active';
      default:
        return true;
    }
  });

  // Filter service requests
  const filteredServiceRequests = serviceRequests.filter(request => {
    if (filterUrgency === 'all') return true;
    return request.urgency === filterUrgency;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-300';
      case 'anc_due': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'vaccination_due': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStockColor = (current: number, minimum: number) => {
    const percentage = (current / minimum) * 100;
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const tabs = [
    { id: 'overview', name: language === 'sw' ? 'Muhtasari' : 'Overview', icon: BarChart3, emoji: '📊' },
    { id: 'patients', name: language === 'sw' ? 'Wagonjwa' : 'Patients', icon: Users, emoji: '👥' },
    { id: 'vaccines', name: language === 'sw' ? 'Chanjo' : 'Vaccines', icon: Syringe, emoji: '💉' },
    { id: 'supplements', name: language === 'sw' ? 'Virutubisho' : 'Supplements', icon: Pill, emoji: '💊' },
    { id: 'requests', name: language === 'sw' ? 'Maombi' : 'Requests', icon: Car, emoji: '🚕' },
    { id: 'wallet', name: 'M-Supu', icon: Wallet, emoji: '💰' }
  ];

  return (
    <div className="min-h-screen dashboard-bg-health">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya Mfanyakazi wa Afya' : 'Health Worker Dashboard'}
        subtitle={language === 'sw' ? 'Usimamizi wa huduma za afya' : 'Healthcare service management'}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-purple-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-6xl">🩺</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  {language === 'sw' ? '🩺 Dashibodi ya Mfanyakazi wa Afya' : '🩺 Health Worker Dashboard'}
                </h1>
                <p className="text-lg text-purple-600 font-bold">
                  {language === 'sw' ? 'Usimamizi wa Huduma za Afya' : 'Healthcare Service Management'}
                </p>
              </div>
            </div>
            <div className="bg-purple-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-purple-800 font-semibold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </p>
              <p className="text-xs text-purple-700">
                {user?.location} • {language === 'sw' ? 'Kituo cha Afya' : 'Health Facility'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-blue-200 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-blue-600">{hwStats.totalPatients}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Wagonjwa' : 'Patients'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-green-200 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-green-600">{hwStats.patientsToday}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Leo' : 'Today'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-purple-200 text-center">
            <div className="text-3xl mb-2">💉</div>
            <div className="text-2xl font-bold text-purple-600">{hwStats.vaccinationsGiven}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Chanjo' : 'Vaccines'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-pink-200 text-center">
            <div className="text-3xl mb-2">🤱</div>
            <div className="text-2xl font-bold text-pink-600">{hwStats.ancVisitsCompleted}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'ANC' : 'ANC'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-red-200 text-center">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-red-600">{hwStats.lowStockItems}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Hisa Chini' : 'Low Stock'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-orange-200 text-center">
            <div className="text-3xl mb-2">🚕</div>
            <div className="text-2xl font-bold text-orange-600">{hwStats.pendingRequests}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Maombi' : 'Requests'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-indigo-200 text-center">
            <div className="text-3xl mb-2">🚨</div>
            <div className="text-2xl font-bold text-indigo-600">{hwStats.emergencyRequests}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Dharura' : 'Emergency'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-teal-200 text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <div className="text-2xl font-bold text-teal-600">{hwStats.shaContributions}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'SHA' : 'SHA'}
            </div>
          </div>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Zap className="w-8 h-8 text-purple-500" />
            <span>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Add Patient */}
            <motion.button
              onClick={() => setActiveModal('addPatient')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">👤</div>
              <UserPlus className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'ONGEZA MGONJWA' : 'ADD PATIENT'}
                </div>
              </div>
            </motion.button>

            {/* QR Scanner */}
            <motion.button
              onClick={() => setActiveModal('qrScanner')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">📱</div>
              <QrCode className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'SKANI QR' : 'SCAN QR'}
                </div>
              </div>
            </motion.button>

            {/* Schedule Visit */}
            <motion.button
              onClick={() => setActiveModal('scheduleVisit')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">📅</div>
              <CalendarPlus className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'PANGA ZIARA' : 'SCHEDULE VISIT'}
                </div>
              </div>
            </motion.button>

            {/* Update Stock */}
            <motion.button
              onClick={() => setActiveModal('updateStock')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">📦</div>
              <Package className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'SASISHA HISA' : 'UPDATE STOCK'}
                </div>
              </div>
            </motion.button>

            {/* Service Requests */}
            <motion.button
              onClick={() => setActiveTab('requests')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2 relative"
            >
              <div className="text-4xl">🚕</div>
              <Car className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'MAOMBI' : 'REQUESTS'}
                </div>
              </div>
              {hwStats.pendingRequests > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                  {hwStats.pendingRequests}
                </div>
              )}
            </motion.button>

            {/* ParaBoda AI */}
            <motion.button
              onClick={() => setActiveModal('bsenseAI')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">🧠</div>
              <Brain className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'AI MSAIDIZI' : 'AI ASSISTANT'}
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-2 border-4 border-gray-200">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  <span className="text-2xl">{tab.emoji}</span>
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Today's Schedule */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-blue-500" />
                    <span>{language === 'sw' ? 'Ratiba ya Leo' : 'Today\'s Schedule'}</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Heart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900">{language === 'sw' ? 'Ziara za ANC' : 'ANC Visits'}</h4>
                          <p className="text-sm text-blue-700">
                            {patients.filter(p => p.status === 'anc_due').length} {language === 'sw' ? 'zinazostahili' : 'due today'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-2xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <Syringe className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-green-900">{language === 'sw' ? 'Chanjo' : 'Vaccinations'}</h4>
                          <p className="text-sm text-green-700">
                            {patients.filter(p => p.status === 'vaccination_due').length} {language === 'sw' ? 'zinazostahili' : 'due today'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-2xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-red-900">{language === 'sw' ? 'Dharura' : 'Emergency'}</h4>
                          <p className="text-sm text-red-700">
                            {hwStats.emergencyRequests} {language === 'sw' ? 'maombi' : 'requests'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Alerts */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <Package className="w-8 h-8 text-orange-500" />
                    <span>{language === 'sw' ? 'Tahadhari za Hisa' : 'Stock Alerts'}</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Low Stock Vaccines */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-900">{language === 'sw' ? 'Chanjo za Hisa Chini' : 'Low Stock Vaccines'}</h4>
                      {vaccineStock.filter(v => v.currentStock <= v.minimumStock).slice(0, 3).map((vaccine) => (
                        <div key={vaccine.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                          <div>
                            <div className="font-medium text-gray-900">{vaccine.name}</div>
                            <div className="text-sm text-red-600">
                              {vaccine.currentStock} {language === 'sw' ? 'zimebaki' : 'remaining'}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setActiveModal('updateStock');
                              setActiveTab('vaccines');
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                          >
                            {language === 'sw' ? 'Sasisha' : 'Update'}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Low Stock Supplements */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-900">{language === 'sw' ? 'Virutubisho vya Hisa Chini' : 'Low Stock Supplements'}</h4>
                      {supplementStock.filter(s => s.currentStock <= s.minimumStock).slice(0, 3).map((supplement) => (
                        <div key={supplement.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                          <div>
                            <div className="font-medium text-gray-900">{supplement.name}</div>
                            <div className="text-sm text-yellow-600">
                              {supplement.currentStock} {language === 'sw' ? 'zimebaki' : 'remaining'}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setActiveModal('updateStock');
                              setActiveTab('supplements');
                            }}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors"
                          >
                            {language === 'sw' ? 'Sasisha' : 'Update'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder={language === 'sw' ? 'Tafuta mgonjwa, kaya, au CHV...' : 'Search patient, household, or CHV...'}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Filter className="w-5 h-5 text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">{language === 'sw' ? 'Wote' : 'All'}</option>
                        <option value="active">{language === 'sw' ? 'Hai' : 'Active'}</option>
                        <option value="due">{language === 'sw' ? 'Zinazostahili' : 'Due'}</option>
                        <option value="overdue">{language === 'sw' ? 'Zilizochelewa' : 'Overdue'}</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setActiveModal('addPatient')}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-bold flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>{language === 'sw' ? 'Ongeza' : 'Add'}</span>
                    </button>
                  </div>
                </div>

                {/* Patients List */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                      <Users className="w-8 h-8 text-blue-500" />
                      <span>{language === 'sw' ? 'Orodha ya Wagonjwa' : 'Patient List'}</span>
                    </h3>
                    <div className="text-sm text-gray-600">
                      {filteredPatients.length} {language === 'sw' ? 'wagonjwa' : 'patients'}
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                          <div className="h-6 bg-gray-200 rounded mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredPatients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPatients.map((patient) => (
                        <motion.div
                          key={patient.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all p-6 cursor-pointer"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setActiveModal('patientProfile');
                          }}
                        >
                          {/* Patient Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="text-3xl">
                                {patient.isPregnant ? '🤱' : patient.age && patient.age < 18 ? '👶' : '👤'}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">{patient.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {language === 'sw' ? 'Kaya' : 'Household'}: {patient.householdId}
                                </p>
                                {patient.chvName && (
                                  <p className="text-xs text-gray-500">CHV: {patient.chvName}</p>
                                )}
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(patient.status)}`}>
                              {patient.status === 'overdue' ? (language === 'sw' ? 'IMECHELEWA' : 'OVERDUE') :
                               patient.status === 'anc_due' ? (language === 'sw' ? 'ANC' : 'ANC DUE') :
                               patient.status === 'vaccination_due' ? (language === 'sw' ? 'CHANJO' : 'VACCINE DUE') :
                               (language === 'sw' ? 'SAWA' : 'ACTIVE')}
                            </span>
                          </div>

                          {/* Patient Info */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">
                                {language === 'sw' ? 'Umri' : 'Age'}: {patient.age || 'N/A'} {language === 'sw' ? 'miaka' : 'years'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">{patient.location}</span>
                            </div>
                            {patient.phone && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">{patient.phone}</span>
                              </div>
                            )}
                          </div>

                          {/* Services Status */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600">{patient.ancVisitsCompleted || 0}</div>
                              <div className="text-xs text-gray-600">{language === 'sw' ? 'ANC' : 'ANC'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">{patient.vaccinationsReceived || 0}</div>
                              <div className="text-xs text-gray-600">{language === 'sw' ? 'Chanjo' : 'Vaccines'}</div>
                            </div>
                          </div>

                          {/* Last Service */}
                          <div className="text-sm text-gray-600">
                            {language === 'sw' ? 'Huduma ya mwisho' : 'Last service'}: {
                              patient.lastServiceDate 
                                ? patient.lastServiceDate.toLocaleDateString()
                                : (language === 'sw' ? 'Hakuna' : 'None')
                            }
                          </div>

                          {/* Next Appointment */}
                          {patient.nextAppointment && (
                            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
                              <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-blue-800 font-medium">
                                  {language === 'sw' ? 'Miadi ijayo' : 'Next appointment'}: {patient.nextAppointment.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">👥</div>
                      <h3 className="text-xl font-bold text-gray-500 mb-2">
                        {language === 'sw' ? 'Hakuna Wagonjwa' : 'No Patients'}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {language === 'sw' ? 'Anza kwa kuongeza mgonjwa wa kwanza' : 'Start by adding your first patient'}
                      </p>
                      <button
                        onClick={() => setActiveModal('addPatient')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-bold"
                      >
                        {language === 'sw' ? 'Ongeza Mgonjwa' : 'Add Patient'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vaccines Tab */}
            {activeTab === 'vaccines' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                    <Syringe className="w-8 h-8 text-green-500" />
                    <span>{language === 'sw' ? 'Hisa ya Chanjo' : 'Vaccine Inventory'}</span>
                  </h3>
                  <button
                    onClick={() => setActiveModal('addVaccineStock')}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Ongeza Hisa' : 'Add Stock'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vaccineStock.map((vaccine) => {
                    const stockPercentage = (vaccine.currentStock / vaccine.minimumStock) * 100;
                    return (
                      <div key={vaccine.id} className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-gray-900">{vaccine.name}</h4>
                            <p className="text-sm text-gray-600">{vaccine.manufacturer}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{vaccine.currentStock}</div>
                            <div className="text-xs text-gray-600">{language === 'sw' ? 'vipimo' : 'doses'}</div>
                          </div>
                        </div>

                        {/* Stock Level Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{language === 'sw' ? 'Kiwango cha Hisa' : 'Stock Level'}</span>
                            <span className={`font-medium ${
                              stockPercentage <= 20 ? 'text-red-600' :
                              stockPercentage <= 50 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {Math.round(stockPercentage)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${getStockColor(vaccine.currentStock, vaccine.minimumStock)}`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Expiry Date */}
                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-gray-600">{language === 'sw' ? 'Muda wa kuisha' : 'Expiry'}:</span>
                          <span className={`font-medium ${
                            vaccine.expiryDate && vaccine.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {vaccine.expiryDate?.toLocaleDateString() || 'N/A'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              // Handle vaccine administration
                              handleStockUpdate(vaccine.id, vaccine.currentStock - 1, 'vaccine');
                            }}
                            disabled={vaccine.currentStock <= 0}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {language === 'sw' ? 'Toa' : 'Give'}
                          </button>
                          <button
                            onClick={() => setActiveModal('updateStock')}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            {language === 'sw' ? 'Sasisha' : 'Update'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Supplements Tab */}
            {activeTab === 'supplements' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                    <Pill className="w-8 h-8 text-orange-500" />
                    <span>{language === 'sw' ? 'Hisa ya Virutubisho' : 'Supplement Inventory'}</span>
                  </h3>
                  <button
                    onClick={() => setActiveModal('addSupplementStock')}
                    className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-bold flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Ongeza Hisa' : 'Add Stock'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {supplementStock.map((supplement) => {
                    const stockPercentage = (supplement.currentStock / supplement.minimumStock) * 100;
                    return (
                      <div key={supplement.id} className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">💊</div>
                          <h4 className="font-bold text-gray-900">{supplement.name}</h4>
                          <p className="text-sm text-gray-600">{supplement.dosage}</p>
                        </div>

                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-orange-600">{supplement.currentStock}</div>
                          <div className="text-sm text-gray-600">{language === 'sw' ? 'vipimo' : 'units'}</div>
                        </div>

                        {/* Stock Level Bar */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${getStockColor(supplement.currentStock, supplement.minimumStock)}`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-center text-xs text-gray-500 mt-1">
                            {Math.round(stockPercentage)}% {language === 'sw' ? 'ya kiwango cha chini' : 'of minimum'}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              handleStockUpdate(supplement.id, supplement.currentStock - 1, 'supplement');
                            }}
                            disabled={supplement.currentStock <= 0}
                            className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {language === 'sw' ? 'Toa' : 'Dispense'}
                          </button>
                          <button
                            onClick={() => setActiveModal('updateStock')}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            {language === 'sw' ? 'Sasisha' : 'Update'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Service Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                {/* Filter Controls */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                  <div className="flex items-center space-x-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select
                      value={filterUrgency}
                      onChange={(e) => setFilterUrgency(e.target.value as any)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">{language === 'sw' ? 'Haraka Zote' : 'All Urgency'}</option>
                      <option value="emergency">{language === 'sw' ? 'Dharura' : 'Emergency'}</option>
                      <option value="high">{language === 'sw' ? 'Juu' : 'High'}</option>
                      <option value="medium">{language === 'sw' ? 'Wastani' : 'Medium'}</option>
                      <option value="low">{language === 'sw' ? 'Chini' : 'Low'}</option>
                    </select>
                  </div>
                </div>

                {/* Service Requests List */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <Car className="w-8 h-8 text-yellow-500" />
                    <span>{language === 'sw' ? 'Maombi ya Huduma' : 'Service Requests'}</span>
                  </h3>

                  {filteredServiceRequests.length > 0 ? (
                    <div className="space-y-4">
                      {filteredServiceRequests.map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${getUrgencyColor(request.urgency)}`}
                          onClick={() => {
                            setSelectedServiceRequest(request);
                            setActiveModal('serviceRequestDetails');
                          }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="text-3xl">
                                {request.urgency === 'emergency' ? '🚨' :
                                 request.serviceType === 'anc' ? '🤱' :
                                 request.serviceType === 'vaccination' ? '💉' :
                                 request.serviceType === 'consultation' ? '🩺' : '👤'}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{request.patientName}</h4>
                                <p className="text-sm text-gray-600">
                                  {language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {request.requestedBy}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {request.requestedAt.toLocaleDateString()} {request.requestedAt.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(request.urgency)}`}>
                              {request.urgency === 'emergency' ? (language === 'sw' ? 'DHARURA' : 'EMERGENCY') :
                               request.urgency === 'high' ? (language === 'sw' ? 'JUU' : 'HIGH') :
                               request.urgency === 'medium' ? (language === 'sw' ? 'WASTANI' : 'MEDIUM') :
                               (language === 'sw' ? 'CHINI' : 'LOW')}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <Stethoscope className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">
                                {language === 'sw' ? 'Huduma' : 'Service'}: {
                                  request.serviceType === 'anc' ? (language === 'sw' ? 'Ziara za ANC' : 'ANC Visit') :
                                  request.serviceType === 'vaccination' ? (language === 'sw' ? 'Chanjo' : 'Vaccination') :
                                  request.serviceType === 'consultation' ? (language === 'sw' ? 'Uchunguzi' : 'Consultation') :
                                  request.serviceType
                                }
                              </span>
                            </div>
                            {request.symptoms && (
                              <div className="flex items-start space-x-2 text-sm">
                                <AlertTriangle className="w-4 h-4 text-gray-500 mt-0.5" />
                                <span className="text-gray-600">{request.symptoms}</span>
                              </div>
                            )}
                            {request.transportStatus && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Car className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">
                                  {language === 'sw' ? 'Usafiri' : 'Transport'}: {request.transportStatus}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle accept request
                                addNotification({
                                  title: language === 'sw' ? 'Ombi Limekubaliwa' : 'Request Accepted',
                                  message: language === 'sw' ? 'Ombi la huduma limekubaliwa' : 'Service request accepted',
                                  type: 'success',
                                  read: false
                                });
                              }}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              {language === 'sw' ? 'Kubali' : 'Accept'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedServiceRequest(request);
                                setActiveModal('scheduleService');
                              }}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              {language === 'sw' ? 'Panga' : 'Schedule'}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🚕</div>
                      <h3 className="text-xl font-bold text-gray-500 mb-2">
                        {language === 'sw' ? 'Hakuna Maombi' : 'No Service Requests'}
                      </h3>
                      <p className="text-gray-400">
                        {language === 'sw' ? 'Maombi ya huduma yataonyeshwa hapa' : 'Service requests will appear here'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* M-Supu Wallet Tab */}
            {activeTab === 'wallet' && (
              <div>
                <UnifiedWalletInterface embedded={true} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <QRScanner
        isOpen={activeModal === 'qrScanner'}
        onClose={handleModalClose}
        onScan={(data) => {
          try {
            const qrData = JSON.parse(data);
            if (qrData.type === 'paraboda_user') {
              addNotification({
                title: language === 'sw' ? 'QR Code Imesomwa' : 'QR Code Scanned',
                message: language === 'sw' 
                  ? `Taarifa za ${qrData.name} zimepatikana`
                  : `${qrData.name}'s information retrieved`,
                type: 'success',
                read: false
              });
              handleModalClose();
            }
          } catch (error) {
            addNotification({
              title: language === 'sw' ? 'Hitilafu ya QR' : 'QR Error',
              message: language === 'sw' ? 'QR code si sahihi' : 'Invalid QR code',
              type: 'error',
              read: false
            });
          }
        }}
        title={language === 'sw' ? 'Skani QR Code ya Mgonjwa' : 'Scan Patient QR Code'}
      />

      <BSenseAI
        isOpen={activeModal === 'bsenseAI'}
        onClose={handleModalClose}
        userRole="health_worker"
      />

      {/* Add Patient Modal */}
      {activeModal === 'addPatient' && (
        <Modal
          isOpen={true}
          onClose={handleModalClose}
          title={language === 'sw' ? '👤 Ongeza Mgonjwa Mpya' : '👤 Add New Patient'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-bold text-blue-900 mb-2">
                {language === 'sw' ? 'Taarifa za Mgonjwa' : 'Patient Information'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={language === 'sw' ? 'Jina kamili' : 'Full name'}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder={language === 'sw' ? 'ID ya Kaya' : 'Household ID'}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  placeholder={language === 'sw' ? 'Tarehe ya kuzaliwa' : 'Date of birth'}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <select className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option value="">{language === 'sw' ? 'Chagua jinsia' : 'Select gender'}</option>
                  <option value="male">{language === 'sw' ? 'Mwanaume' : 'Male'}</option>
                  <option value="female">{language === 'sw' ? 'Mwanamke' : 'Female'}</option>
                </select>
                <input
                  type="tel"
                  placeholder={language === 'sw' ? 'Nambari ya simu' : 'Phone number'}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder={language === 'sw' ? 'Jina la CHV' : 'CHV name'}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleModalClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  // Mock patient creation
                  const newPatient: Patient = {
                    id: `patient_${Date.now()}`,
                    name: 'New Patient',
                    householdId: 'HH-001',
                    age: 25,
                    gender: 'female',
                    location: user?.location || 'Health Facility',
                    status: 'active',
                    registeredAt: new Date(),
                    registeredBy: user?.id || 'health_worker'
                  };
                  handlePatientAdded(newPatient);
                }}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-bold"
              >
                {language === 'sw' ? 'Ongeza Mgonjwa' : 'Add Patient'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Patient Profile Modal */}
      {activeModal === 'patientProfile' && selectedPatient && (
        <Modal
          isOpen={true}
          onClose={handleModalClose}
          title={`👤 ${selectedPatient.name}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Patient Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedPatient.name}</h3>
                    <p className="text-purple-100">
                      {language === 'sw' ? 'Kaya' : 'Household'}: {selectedPatient.householdId}
                    </p>
                    <p className="text-purple-100 text-sm">
                      {language === 'sw' ? 'Umri' : 'Age'}: {selectedPatient.age} {language === 'sw' ? 'miaka' : 'years'} • {selectedPatient.gender}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-100">{language === 'sw' ? 'Hali' : 'Status'}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedPatient.status)}`}>
                    {selectedPatient.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  handleServiceCompleted(selectedPatient.id, 'anc');
                  handleModalClose();
                }}
                className="p-4 bg-pink-50 border-2 border-pink-200 rounded-xl hover:bg-pink-100 transition-colors"
              >
                <div className="text-center">
                  <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <h4 className="font-bold text-pink-900">{language === 'sw' ? 'Maliza ANC' : 'Complete ANC'}</h4>
                  <p className="text-sm text-pink-700">{language === 'sw' ? 'Rekodi ziara ya ANC' : 'Record ANC visit'}</p>
                </div>
              </button>

              <button
                onClick={() => {
                  handleServiceCompleted(selectedPatient.id, 'vaccination');
                  handleModalClose();
                }}
                className="p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="text-center">
                  <Syringe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-bold text-green-900">{language === 'sw' ? 'Toa Chanjo' : 'Give Vaccine'}</h4>
                  <p className="text-sm text-green-700">{language === 'sw' ? 'Rekodi chanjo' : 'Record vaccination'}</p>
                </div>
              </button>

              <button
                onClick={() => {
                  handleServiceCompleted(selectedPatient.id, 'consultation');
                  handleModalClose();
                }}
                className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="text-center">
                  <Stethoscope className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-bold text-blue-900">{language === 'sw' ? 'Uchunguzi' : 'Consultation'}</h4>
                  <p className="text-sm text-blue-700">{language === 'sw' ? 'Rekodi uchunguzi' : 'Record consultation'}</p>
                </div>
              </button>
            </div>

            {/* Patient History */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-3">
                {language === 'sw' ? 'Historia ya Huduma' : 'Service History'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Ziara za ANC' : 'ANC visits'}:</span>
                  <span className="font-semibold">{selectedPatient.ancVisitsCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Chanjo zilizopokelewa' : 'Vaccines received'}:</span>
                  <span className="font-semibold">{selectedPatient.vaccinationsReceived || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Huduma ya mwisho' : 'Last service'}:</span>
                  <span className="font-semibold">
                    {selectedPatient.lastServiceDate?.toLocaleDateString() || (language === 'sw' ? 'Hakuna' : 'None')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Stock Modal */}
      {activeModal === 'updateStock' && (
        <Modal
          isOpen={true}
          onClose={handleModalClose}
          title={language === 'sw' ? '📦 Sasisha Hisa' : '📦 Update Stock'}
          size="md"
        >
          <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-xl">
              <h4 className="font-bold text-orange-900 mb-2">
                {language === 'sw' ? 'Chagua Bidhaa' : 'Select Item'}
              </h4>
              <select className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500">
                <option value="">{language === 'sw' ? 'Chagua bidhaa...' : 'Select item...'}</option>
                <optgroup label={language === 'sw' ? 'Chanjo' : 'Vaccines'}>
                  {vaccineStock.map((vaccine) => (
                    <option key={vaccine.id} value={vaccine.id}>
                      {vaccine.name} ({vaccine.currentStock} {language === 'sw' ? 'zimebaki' : 'remaining'})
                    </option>
                  ))}
                </optgroup>
                <optgroup label={language === 'sw' ? 'Virutubisho' : 'Supplements'}>
                  {supplementStock.map((supplement) => (
                    <option key={supplement.id} value={supplement.id}>
                      {supplement.name} ({supplement.currentStock} {language === 'sw' ? 'zimebaki' : 'remaining'})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Hisa Mpya' : 'New Stock'}
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Tarehe ya kuisha' : 'Expiry date'}
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleModalClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  addNotification({
                    title: language === 'sw' ? 'Hisa Imesasishwa' : 'Stock Updated',
                    message: language === 'sw' ? 'Hisa ya duka imesasishwa' : 'Inventory stock updated',
                    type: 'success',
                    read: false
                  });
                  handleModalClose();
                }}
                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-bold"
              >
                {language === 'sw' ? 'Sasisha Hisa' : 'Update Stock'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Schedule Visit Modal */}
      {activeModal === 'scheduleVisit' && (
        <Modal
          isOpen={true}
          onClose={handleModalClose}
          title={language === 'sw' ? '📅 Panga Ziara' : '📅 Schedule Visit'}
          size="md"
        >
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-xl">
              <h4 className="font-bold text-purple-900 mb-4">
                {language === 'sw' ? 'Maelezo ya Ziara' : 'Visit Details'}
              </h4>
              <div className="space-y-4">
                <select className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500">
                  <option value="">{language === 'sw' ? 'Chagua mgonjwa...' : 'Select patient...'}</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.householdId}
                    </option>
                  ))}
                </select>
                
                <select className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500">
                  <option value="">{language === 'sw' ? 'Aina ya huduma...' : 'Service type...'}</option>
                  <option value="anc">{language === 'sw' ? 'Ziara za ANC' : 'ANC Visit'}</option>
                  <option value="vaccination">{language === 'sw' ? 'Chanjo' : 'Vaccination'}</option>
                  <option value="consultation">{language === 'sw' ? 'Uchunguzi' : 'Consultation'}</option>
                  <option value="followup">{language === 'sw' ? 'Ufuatiliaji' : 'Follow-up'}</option>
                </select>

                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                />

                <textarea
                  placeholder={language === 'sw' ? 'Maelezo ya ziada...' : 'Additional notes...'}
                  rows={3}
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleModalClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  addNotification({
                    title: language === 'sw' ? 'Ziara Imepangwa' : 'Visit Scheduled',
                    message: language === 'sw' ? 'Ziara imepangwa kikamilifu' : 'Visit scheduled successfully',
                    type: 'success',
                    read: false
                  });
                  handleModalClose();
                }}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-bold"
              >
                {language === 'sw' ? 'Panga Ziara' : 'Schedule Visit'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Service Request Details Modal */}
      {activeModal === 'serviceRequestDetails' && selectedServiceRequest && (
        <Modal
          isOpen={true}
          onClose={handleModalClose}
          title={`🚕 ${selectedServiceRequest.patientName}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Request Header */}
            <div className={`p-6 rounded-2xl border-2 ${getUrgencyColor(selectedServiceRequest.urgency)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedServiceRequest.patientName}</h3>
                  <p className="text-gray-600">
                    {language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {selectedServiceRequest.requestedBy}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(selectedServiceRequest.urgency)}`}>
                  {selectedServiceRequest.urgency.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{language === 'sw' ? 'Huduma' : 'Service'}:</span>
                  <span className="ml-2 font-semibold">{selectedServiceRequest.serviceType}</span>
                </div>
                <div>
                  <span className="text-gray-600">{language === 'sw' ? 'Wakati' : 'Time'}:</span>
                  <span className="ml-2 font-semibold">{selectedServiceRequest.requestedAt.toLocaleString()}</span>
                </div>
              </div>

              {selectedServiceRequest.symptoms && (
                <div className="mt-4 p-3 bg-white/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">{language === 'sw' ? 'Dalili' : 'Symptoms'}:</h4>
                  <p className="text-gray-700">{selectedServiceRequest.symptoms}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  addNotification({
                    title: language === 'sw' ? 'Ombi Limekubaliwa' : 'Request Accepted',
                    message: language === 'sw' ? 'Ombi la huduma limekubaliwa' : 'Service request accepted',
                    type: 'success',
                    read: false
                  });
                  handleModalClose();
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold"
              >
                {language === 'sw' ? 'Kubali Ombi' : 'Accept Request'}
              </button>

              <button
                onClick={() => {
                  setActiveModal('scheduleService');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold"
              >
                {language === 'sw' ? 'Panga Huduma' : 'Schedule Service'}
              </button>

              <button
                onClick={() => {
                  addNotification({
                    title: language === 'sw' ? 'Ombi Limeelekezwa' : 'Request Referred',
                    message: language === 'sw' ? 'Ombi limeelekezwa kwa kituo kingine' : 'Request referred to another facility',
                    type: 'info',
                    read: false
                  });
                  handleModalClose();
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold"
              >
                {language === 'sw' ? 'Elekeza' : 'Refer'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};