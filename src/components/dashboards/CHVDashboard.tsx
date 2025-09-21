import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Modal } from '../common/Modal';
import { GPSLocationDisplay } from '../common/GPSLocationDisplay';
import { EmergencyReportModal } from '../common/EmergencyReportModal';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { BSenseAI } from '../common/BSenseAI';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { HouseholdManagement } from '../chv/HouseholdManagement';
import { MotherRegistration } from '../chv/MotherRegistration';
import { ChildRegistration } from '../chv/ChildRegistration';
import { HazardReporting } from '../chv/HazardReporting';
import { DiseaseOutbreakReporting } from '../chv/DiseaseOutbreakReporting';
import { TransportCoordination } from '../chv/TransportCoordination';
import { HouseholdSummaryView } from '../chv/HouseholdSummaryView';
import { chvService, Household, Mother, Child, Hazard, DiseaseCase } from '../../services/chvService';
import { 
  Home, 
  Heart, 
  Baby, 
  Car, 
  AlertTriangle, 
  Activity,
  Users,
  MapPin,
  Calendar,
  Bell,
  Eye,
  Plus,
  Search,
  Filter,
  BarChart3,
  FileText,
  Settings,
  Stethoscope,
  Shield,
  Navigation,
  Target,
  Zap,
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Award,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const CHVDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification } = useData();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [selectedMother, setSelectedMother] = useState<Mother | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [emergencyType, setEmergencyType] = useState<'medical' | 'accident' | 'outbreak' | 'weather'>('medical');
  
  // Data states
  const [households, setHouseholds] = useState<Household[]>([]);
  const [mothers, setMothers] = useState<Mother[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [diseaseCases, setDiseaseCases] = useState<DiseaseCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'priority' | 'due' | 'overdue'>('all');
  
  // CHV stats
  const [chvStats, setChvStats] = useState({
    totalHouseholds: 0,
    pregnantWomen: 0,
    childrenUnder5: 0,
    overdueVaccinations: 0,
    upcomingANC: 0,
    transportRequests: 0,
    hazardReports: 0,
    diseaseReports: 0
  });

  // Load CHV data
  useEffect(() => {
    if (!user) return;

    const loadCHVData = async () => {
      setIsLoading(true);
      
      try {
        // Load households assigned to this CHV
        const chvHouseholds = chvService.getCHVHouseholds(user.id);
        setHouseholds(chvHouseholds);

        // Load mothers and children
        const allMothers = chvService.getAllMothers().filter(m => 
          chvHouseholds.some(h => h.id === m.householdId)
        );
        setMothers(allMothers);

        const allChildren = chvService.getAllChildren().filter(c => 
          chvHouseholds.some(h => h.id === c.householdId)
        );
        setChildren(allChildren);

        // Load hazards and disease cases
        const chvHazards = chvService.getHazardsByLocation(user.location || '');
        setHazards(chvHazards);

        const chvDiseases = chvService.getDiseaseCasesByLocation(user.location || '');
        setDiseaseCases(chvDiseases);

        // Calculate stats
        const stats = chvService.getCHVStats(user.id);
        setChvStats(stats);

      } catch (error) {
        console.error('Error loading CHV data:', error);
        addNotification({
          title: t('status.error'),
          message: language === 'sw' ? 'Imeshindwa kupakia data ya CHV' : 'Failed to load CHV data',
          type: 'error',
          read: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCHVData();
  }, [user, t, language, addNotification]);

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedHousehold(null);
    setSelectedMother(null);
    setSelectedChild(null);
  };

  const handleHouseholdAdded = (household: Household) => {
    setHouseholds(prev => [household, ...prev]);
    setChvStats(prev => ({ ...prev, totalHouseholds: prev.totalHouseholds + 1 }));
    addNotification({
      title: language === 'sw' ? 'Kaya Imeongezwa' : 'Household Added',
      message: language === 'sw' 
        ? `Kaya ya ${household.headOfHousehold.name} imeongezwa`
        : `${household.headOfHousehold.name}'s household added`,
      type: 'success',
      read: false
    });
    handleModalClose();
  };

  const handleMotherAdded = (mother: Mother) => {
    setMothers(prev => [mother, ...prev]);
    setChvStats(prev => ({ ...prev, pregnantWomen: prev.pregnantWomen + 1 }));
    addNotification({
      title: language === 'sw' ? 'Mama Amesajiliwa' : 'Mother Registered',
      message: language === 'sw' 
        ? `${mother.name} amesajiliwa kwa huduma za ANC`
        : `${mother.name} registered for ANC services`,
      type: 'success',
      read: false
    });
    handleModalClose();
  };

  const handleChildAdded = (child: Child) => {
    setChildren(prev => [child, ...prev]);
    setChvStats(prev => ({ ...prev, childrenUnder5: prev.childrenUnder5 + 1 }));
    addNotification({
      title: language === 'sw' ? 'Mtoto Amesajiliwa' : 'Child Registered',
      message: language === 'sw' 
        ? `${child.name} amesajiliwa kwa huduma za chanjo`
        : `${child.name} registered for vaccination services`,
      type: 'success',
      read: false
    });
    handleModalClose();
  };

  const handleHazardReported = (hazard: Hazard) => {
    setHazards(prev => [hazard, ...prev]);
    setChvStats(prev => ({ ...prev, hazardReports: prev.hazardReports + 1 }));
    addNotification({
      title: language === 'sw' ? 'Hatari Imeripotiwa' : 'Hazard Reported',
      message: language === 'sw' 
        ? `Hatari ya ${hazard.type} imeripotiwa`
        : `${hazard.type} hazard reported`,
      type: 'warning',
      read: false
    });
    handleModalClose();
  };

  const handleDiseaseReported = (diseaseCase: DiseaseCase) => {
    setDiseaseCases(prev => [diseaseCase, ...prev]);
    setChvStats(prev => ({ ...prev, diseaseReports: prev.diseaseReports + 1 }));
    
    // Auto-escalate based on severity
    if (diseaseCase.severity === 'critical') {
      addNotification({
        title: language === 'sw' ? '🚨 DHARURA YA UGONJWA' : '🚨 DISEASE EMERGENCY',
        message: language === 'sw' 
          ? `Kesi ya ${diseaseCase.disease} - Inahitaji ufuatiliaji wa haraka`
          : `${diseaseCase.disease} case - Requires immediate follow-up`,
        type: 'error',
        read: false
      });
    } else {
      addNotification({
        title: language === 'sw' ? 'Kesi ya Ugonjwa Imeripotiwa' : 'Disease Case Reported',
        message: language === 'sw' 
          ? `Kesi ya ${diseaseCase.disease} imeripotiwa`
          : `${diseaseCase.disease} case reported`,
        type: 'warning',
        read: false
      });
    }
    handleModalClose();
  };

  const handleTransportRequested = (requestData: any) => {
    setChvStats(prev => ({ ...prev, transportRequests: prev.transportRequests + 1 }));
    addNotification({
      title: language === 'sw' ? 'Ombi la Usafiri Limewasilishwa' : 'Transport Request Submitted',
      message: language === 'sw' 
        ? 'Ombi limewasilishwa kwa wasafiri wa karibu'
        : 'Request submitted to nearby riders',
      type: 'success',
      read: false
    });
    handleModalClose();
  };

  // Filter households based on search and status
  const filteredHouseholds = households.filter(household => {
    const matchesSearch = household.headOfHousehold.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         household.householdId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         household.location.village.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filterStatus) {
      case 'priority':
        return household.vulnerableGroups.length > 0;
      case 'due':
        return household.status === 'anc_due' || household.status === 'vaccination_due';
      case 'overdue':
        return household.status === 'overdue';
      default:
        return true;
    }
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

  const getPriorityIcon = (vulnerableGroups: string[]) => {
    if (vulnerableGroups.includes('pregnant')) return '🤱';
    if (vulnerableGroups.includes('under5')) return '👶';
    if (vulnerableGroups.includes('elderly')) return '👴';
    if (vulnerableGroups.includes('disabled')) return '♿';
    if (vulnerableGroups.includes('chronic')) return '💊';
    return '👥';
  };

  return (
    <div className="min-h-screen dashboard-bg-chv">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya CHV' : 'CHV Dashboard'}
        subtitle={language === 'sw' ? 'Usimamizi wa afya ya jamii' : 'Community health management'}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-green-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-6xl">❤️</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  {language === 'sw' ? '❤️ Dashibodi ya CHV' : '❤️ CHV Dashboard'}
                </h1>
                <p className="text-lg text-green-600 font-bold">
                  {language === 'sw' ? 'Usimamizi wa Afya ya Jamii' : 'Community Health Management'}
                </p>
              </div>
            </div>
            <div className="bg-green-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-green-800 font-semibold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </p>
              <p className="text-xs text-green-700">
                {user?.location} • CHV ID: {user?.id?.slice(-6)}
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
            <div className="text-3xl mb-2">🏠</div>
            <div className="text-2xl font-bold text-blue-600">{chvStats.totalHouseholds}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Kaya' : 'Households'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-pink-200 text-center">
            <div className="text-3xl mb-2">🤱</div>
            <div className="text-2xl font-bold text-pink-600">{chvStats.pregnantWomen}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Wajawazito' : 'Pregnant'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-purple-200 text-center">
            <div className="text-3xl mb-2">👶</div>
            <div className="text-2xl font-bold text-purple-600">{chvStats.childrenUnder5}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Watoto <5' : 'Under 5'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-red-200 text-center">
            <div className="text-3xl mb-2">💉</div>
            <div className="text-2xl font-bold text-red-600">{chvStats.overdueVaccinations}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Chanjo Zilizochelewa' : 'Overdue Vaccines'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-yellow-200 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-yellow-600">{chvStats.upcomingANC}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'ANC Zinazokuja' : 'Upcoming ANC'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-orange-200 text-center">
            <div className="text-3xl mb-2">🚕</div>
            <div className="text-2xl font-bold text-orange-600">{chvStats.transportRequests}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Usafiri' : 'Transport'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-indigo-200 text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-indigo-600">{chvStats.hazardReports}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Hatari' : 'Hazards'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border-2 border-teal-200 text-center">
            <div className="text-3xl mb-2">🦠</div>
            <div className="text-2xl font-bold text-teal-600">{chvStats.diseaseReports}</div>
            <div className="text-xs text-gray-600 font-medium">
              {language === 'sw' ? 'Magonjwa' : 'Diseases'}
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
            <Zap className="w-8 h-8 text-green-500" />
            <span>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Add Household */}
            <motion.button
              onClick={() => setActiveModal('addHousehold')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">🏡</div>
              <Home className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'ONGEZA KAYA' : 'ADD HOUSEHOLD'}
                </div>
              </div>
            </motion.button>

            {/* Add Mother */}
            <motion.button
              onClick={() => setActiveModal('addMother')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">🤰</div>
              <Heart className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'SAJILI MAMA' : 'ADD MOTHER'}
                </div>
              </div>
            </motion.button>

            {/* Add Child */}
            <motion.button
              onClick={() => setActiveModal('addChild')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">👶</div>
              <Baby className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'SAJILI MTOTO' : 'ADD CHILD'}
                </div>
              </div>
            </motion.button>

            {/* Request Transport */}
            <motion.button
              onClick={() => setActiveModal('requestTransport')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">🚕</div>
              <Car className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'OMBA USAFIRI' : 'REQUEST TRANSPORT'}
                </div>
              </div>
            </motion.button>

            {/* Report Hazard */}
            <motion.button
              onClick={() => setActiveModal('reportHazard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">🌦️</div>
              <AlertTriangle className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'RIPOTI HATARI' : 'HAZARD REPORT'}
                </div>
              </div>
            </motion.button>

            {/* Disease Outbreak */}
            <motion.button
              onClick={() => setActiveModal('diseaseOutbreak')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[120px] bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-center space-y-2 animate-pulse"
            >
              <div className="text-4xl">🦠</div>
              <Activity className="w-6 h-6" />
              <div className="text-center">
                <div className="text-sm font-bold">
                  {language === 'sw' ? 'RIPOTI UGONJWA' : 'DISEASE OUTBREAK'}
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={language === 'sw' ? 'Tafuta kaya, jina, au mahali...' : 'Search households, names, or locations...'}
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">{language === 'sw' ? 'Zote' : 'All'}</option>
                  <option value="priority">{language === 'sw' ? 'Kipaumbele' : 'Priority'}</option>
                  <option value="due">{language === 'sw' ? 'Zinazostahili' : 'Due'}</option>
                  <option value="overdue">{language === 'sw' ? 'Zilizochelewa' : 'Overdue'}</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveModal('mapView')}
                  className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                  title={language === 'sw' ? 'Ona kwenye ramani' : 'View on map'}
                >
                  <MapPin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveModal('analytics')}
                  className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                  title={language === 'sw' ? 'Ona takwimu' : 'View analytics'}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Household List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <span>{language === 'sw' ? 'Kaya za Jamii' : 'Community Households'}</span>
            </h2>
            <div className="text-sm text-gray-600">
              {filteredHouseholds.length} {language === 'sw' ? 'kaya' : 'households'}
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
          ) : filteredHouseholds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHouseholds.map((household) => (
                <motion.div
                  key={household.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all p-6 cursor-pointer"
                  onClick={() => {
                    setSelectedHousehold(household);
                    setActiveModal('householdDetails');
                  }}
                >
                  {/* Household Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{getPriorityIcon(household.vulnerableGroups)}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {household.headOfHousehold.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ID: {household.householdId}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(household.status)}`}>
                      {household.status === 'overdue' ? (language === 'sw' ? 'IMECHELEWA' : 'OVERDUE') :
                       household.status === 'anc_due' ? (language === 'sw' ? 'ANC' : 'ANC DUE') :
                       household.status === 'vaccination_due' ? (language === 'sw' ? 'CHANJO' : 'VACCINE DUE') :
                       (language === 'sw' ? 'SAWA' : 'ACTIVE')}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {household.location.village}, {household.location.administrativeUnits[0]}
                    </span>
                  </div>

                  {/* Household Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{household.totalMembers}</div>
                      <div className="text-xs text-gray-600">{language === 'sw' ? 'Wanakaya' : 'Members'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-600">{household.pregnantWomen}</div>
                      <div className="text-xs text-gray-600">{language === 'sw' ? 'Wajawazito' : 'Pregnant'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{household.childrenUnder5}</div>
                      <div className="text-xs text-gray-600">{language === 'sw' ? '<5 yrs' : '<5 yrs'}</div>
                    </div>
                  </div>

                  {/* Insurance Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">{language === 'sw' ? 'Bima' : 'Insurance'}:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      household.insuranceStatus === 'SHA' ? 'bg-green-100 text-green-800' :
                      household.insuranceStatus === 'NHIF' ? 'bg-blue-100 text-blue-800' :
                      household.insuranceStatus === 'Mutuelle' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {household.insuranceStatus}
                    </span>
                  </div>

                  {/* Vulnerable Groups */}
                  {household.vulnerableGroups.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-1">{language === 'sw' ? 'Vikundi vya Hatari' : 'Vulnerable Groups'}:</div>
                      <div className="flex flex-wrap gap-1">
                        {household.vulnerableGroups.map((group) => (
                          <span key={group} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            {group === 'pregnant' ? (language === 'sw' ? 'Mjamzito' : 'Pregnant') :
                             group === 'under5' ? (language === 'sw' ? '<5 yrs' : '<5 yrs') :
                             group === 'elderly' ? (language === 'sw' ? 'Wazee' : 'Elderly') :
                             group === 'disabled' ? (language === 'sw' ? 'Walemavu' : 'Disabled') :
                             group === 'chronic' ? (language === 'sw' ? 'Magonjwa' : 'Chronic') : group}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Last Visit */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {language === 'sw' ? 'Ziara ya mwisho' : 'Last visit'}:
                    </span>
                    <span className="font-medium">
                      {household.lastVisit ? household.lastVisit.toLocaleDateString() : 'Never'}
                    </span>
                  </div>

                  {/* Next Visit */}
                  {household.nextVisit && (
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">
                        {language === 'sw' ? 'Ziara ijayo' : 'Next visit'}:
                      </span>
                      <span className="font-medium text-green-600">
                        {household.nextVisit.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">
                {language === 'sw' ? 'Hakuna Kaya' : 'No Households'}
              </h3>
              <p className="text-gray-400 mb-6">
                {language === 'sw' ? 'Anza kwa kuongeza kaya ya kwanza' : 'Start by adding your first household'}
              </p>
              <button
                onClick={() => setActiveModal('addHousehold')}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-bold"
              >
                {language === 'sw' ? 'Ongeza Kaya' : 'Add Household'}
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* All Modals */}
      <HouseholdManagement
        isOpen={activeModal === 'addHousehold'}
        onClose={handleModalClose}
        onHouseholdAdded={handleHouseholdAdded}
        mode="add"
      />

      <ErrorBoundary>
        <MotherRegistration
          isOpen={activeModal === 'addMother'}
          onClose={handleModalClose}
          onMotherAdded={handleMotherAdded}
          availableHouseholds={households}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <ChildRegistration
          isOpen={activeModal === 'addChild'}
          onClose={handleModalClose}
          onChildAdded={handleChildAdded}
          availableHouseholds={households}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <TransportCoordination
          isOpen={activeModal === 'requestTransport'}
          onClose={handleModalClose}
          onTransportRequested={handleTransportRequested}
          households={households}
          mothers={mothers}
          children={children}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <HazardReporting
          isOpen={activeModal === 'reportHazard'}
          onClose={handleModalClose}
          onHazardReported={handleHazardReported}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <DiseaseOutbreakReporting
          isOpen={activeModal === 'diseaseOutbreak'}
          onClose={handleModalClose}
          onDiseaseReported={handleDiseaseReported}
          households={households}
          mothers={mothers}
          children={children}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <HouseholdSummaryView
          isOpen={activeModal === 'householdDetails'}
          onClose={handleModalClose}
          household={selectedHousehold}
          mothers={mothers.filter(m => m.householdId === selectedHousehold?.id)}
          children={children.filter(c => c.householdId === selectedHousehold?.id)}
          onEditHousehold={(household) => {
            setSelectedHousehold(household);
            setActiveModal('editHousehold');
          }}
          onRequestTransport={() => {
            setActiveModal('requestTransport');
          }}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <HouseholdManagement
          isOpen={activeModal === 'editHousehold'}
          onClose={handleModalClose}
          onHouseholdAdded={(household) => {
            setHouseholds(prev => prev.map(h => h.id === household.id ? household : h));
            handleModalClose();
          }}
          mode="edit"
          existingHousehold={selectedHousehold}
        />
      </ErrorBoundary>

      {/* Map View Modal */}
      {activeModal === 'mapView' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🗺️ Ramani ya Kaya' : '🗺️ Household Map'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-blue-900 mb-2">
                {language === 'sw' ? 'Ramani ya GPS' : 'GPS Map View'}
              </h3>
              <p className="text-blue-800 text-sm">
                {language === 'sw' 
                  ? 'Ramani inayoonyesha mahali pa kaya zote na hali zao'
                  : 'Map showing all household locations and their status'
                }
              </p>
            </div>
            
            <GPSLocationDisplay
              showAccuracy={true}
              autoUpdate={true}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-2xl mb-1">🟢</div>
                <div className="text-sm font-medium text-green-800">
                  {language === 'sw' ? 'Sawa' : 'Active'}
                </div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-xl">
                <div className="text-2xl mb-1">🟡</div>
                <div className="text-sm font-medium text-yellow-800">
                  {language === 'sw' ? 'Zinazostahili' : 'Due'}
                </div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <div className="text-2xl mb-1">🔴</div>
                <div className="text-sm font-medium text-red-800">
                  {language === 'sw' ? 'Zilizochelewa' : 'Overdue'}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <div className="text-2xl mb-1">🟣</div>
                <div className="text-sm font-medium text-purple-800">
                  {language === 'sw' ? 'Kipaumbele' : 'Priority'}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Analytics Modal */}
      {activeModal === 'analytics' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '📊 Takwimu za CHV' : '📊 CHV Analytics'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{chvStats.totalHouseholds}</div>
                <div className="text-blue-800 font-medium">{language === 'sw' ? 'Jumla ya Kaya' : 'Total Households'}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round((households.filter(h => h.status === 'active').length / households.length) * 100) || 0}%
                </div>
                <div className="text-green-800 font-medium">{language === 'sw' ? 'Kiwango cha Afya' : 'Health Coverage'}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{chvStats.upcomingANC + chvStats.overdueVaccinations}</div>
                <div className="text-yellow-800 font-medium">{language === 'sw' ? 'Zinazostahili' : 'Services Due'}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">{chvStats.hazardReports + chvStats.diseaseReports}</div>
                <div className="text-red-800 font-medium">{language === 'sw' ? 'Ripoti za Hatari' : 'Risk Reports'}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-3">
                {language === 'sw' ? 'Muhtasari wa Kazi' : 'Work Summary'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Kaya zilizosajiliwa' : 'Households registered'}:</span>
                  <span className="font-semibold">{chvStats.totalHouseholds}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Wajawazito wanaofuatiliwa' : 'Pregnant women tracked'}:</span>
                  <span className="font-semibold">{chvStats.pregnantWomen}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Watoto chini ya miaka 5' : 'Children under 5'}:</span>
                  <span className="font-semibold">{chvStats.childrenUnder5}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Maombi ya usafiri' : 'Transport requests'}:</span>
                  <span className="font-semibold">{chvStats.transportRequests}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <BSenseAI
        isOpen={activeModal === 'bsenseAI'}
        onClose={() => setActiveModal(null)}
        userRole="chv"
      />
    </div>
  );
};