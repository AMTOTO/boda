import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { StatsCard } from '../common/StatsCard';
import { Modal } from '../common/Modal';
import { EmergencyReportModal } from '../common/EmergencyReportModal';
import { 
  Heart, 
  Users, 
  Home,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Calendar,
  Plus,
  Eye,
  Edit,
  Bell,
  Activity,
  TrendingUp,
  Shield,
  Award,
  Target,
  Clock,
  User,
  Baby,
  Stethoscope,
  Car,
  Navigation,
  DollarSign
} from 'lucide-react';

interface Household {
  id: string;
  name: string;
  location: string;
  members: number;
  adults: number;
  children: number;
  pregnantWomen: number;
  childrenUnder5: number;
  status: 'active' | 'priority' | 'mch_due';
  notes?: string;
  lastVisit?: Date;
  nextVisit?: Date;
  shaEnrolled: boolean;
}

export const CHVDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification, rideRequests, updateRideRequest } = useData();
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [newHousehold, setNewHousehold] = useState({
    name: '',
    location: '',
    members: 1,
    adults: 1,
    children: 0,
    pregnantWomen: 0,
    childrenUnder5: 0,
    notes: ''
  });

  // Initialize mock households
  useEffect(() => {
    setHouseholds([
      {
        id: 'hh_001',
        name: 'Wanjiku Family',
        location: 'Kiambu Village, Zone A',
        members: 5,
        adults: 2,
        children: 3,
        pregnantWomen: 1,
        childrenUnder5: 2,
        status: 'mch_due',
        notes: 'ANC visit due in 3 days, baby needs 3rd dose vaccine',
        lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextVisit: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        shaEnrolled: true
      },
      {
        id: 'hh_002',
        name: 'Mwangi Family',
        location: 'Nakuru West, Zone C',
        members: 4,
        adults: 2,
        children: 2,
        pregnantWomen: 0,
        childrenUnder5: 1,
        status: 'priority',
        notes: 'Child vaccination overdue, malnutrition risk detected',
        lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        shaEnrolled: false
      },
      {
        id: 'hh_003',
        name: 'Akinyi Family',
        location: 'Kisumu Central, Zone B',
        members: 6,
        adults: 2,
        children: 4,
        pregnantWomen: 1,
        childrenUnder5: 2,
        status: 'active',
        lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nextVisit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        shaEnrolled: true
      }
    ]);
  }, []);

  const handleApproveRequest = (requestId: string, approved: boolean) => {
    updateRideRequest(requestId, { 
      status: approved ? 'accepted' : 'rejected' 
    });
    
    addNotification({
      title: language === 'sw' ? 'Ombi Limesasishwa' : 'Request Updated',
      message: language === 'sw' 
        ? `Ombi la usafiri lime${approved ? 'kubaliwa' : 'kataliwa'}`
        : `Transport request ${approved ? 'approved' : 'rejected'}`,
      type: approved ? 'success' : 'warning',
      read: false
    });
  };

  const handleAddHousehold = () => {
    const household: Household = {
      id: `hh_${Date.now()}`,
      ...newHousehold,
      status: 'active',
      shaEnrolled: false
    };

    setHouseholds(prev => [household, ...prev]);
    
    addNotification({
      title: language === 'sw' ? 'Kaya Imeongezwa' : 'Household Added',
      message: language === 'sw' 
        ? `Kaya ya ${newHousehold.name} imeongezwa`
        : `${newHousehold.name} household added`,
      type: 'success',
      read: false
    });

    setActiveModal(null);
    setNewHousehold({
      name: '',
      location: '',
      members: 1,
      adults: 1,
      children: 0,
      pregnantWomen: 0,
      childrenUnder5: 0,
      notes: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'priority': return 'bg-red-100 text-red-800 border-red-300';
      case 'mch_due': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'priority': return <AlertTriangle className="w-5 h-5" />;
      case 'mch_due': return <Clock className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen dashboard-bg-chv">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya CHV' : 'CHV Dashboard'}
        subtitle={language === 'sw' ? 'Usimamizi wa afya ya jamii' : 'Community health management'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
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

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Activity className="w-8 h-8 text-green-500" />
            <span>{language === 'sw' ? 'Muhtasari wa Kazi' : 'Work Overview'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title={language === 'sw' ? 'Kaya Zilizopangiwa' : 'Assigned Households'}
              value={households.length.toString()}
              change={`${households.filter(h => h.status === 'priority').length} priority`}
              changeType="neutral"
              icon={Home}
              color="green"
            />
            <StatsCard
              title={language === 'sw' ? 'Maombi ya Usafiri' : 'Transport Requests'}
              value={rideRequests.filter(r => r.status === 'pending').length.toString()}
              change="Pending approval"
              changeType="neutral"
              icon={Car}
              color="orange"
            />
            <StatsCard
              title={language === 'sw' ? 'Ziara za Wiki' : 'Weekly Visits'}
              value="12"
              change="+3 from last week"
              changeType="positive"
              icon={Users}
              color="blue"
            />
            <StatsCard
              title={language === 'sw' ? 'Wajawazito' : 'Pregnant Women'}
              value={households.reduce((sum, h) => sum + h.pregnantWomen, 0).toString()}
              change="Under monitoring"
              changeType="neutral"
              icon={Heart}
              color="pink"
            />
          </div>
        </motion.div>

        {/* Household Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Home className="w-8 h-8 text-green-500" />
              <span>{language === 'sw' ? 'Usimamizi wa Kaya' : 'Household Management'}</span>
            </h2>
            <button
              onClick={() => setActiveModal('addHousehold')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{language === 'sw' ? 'Ongeza Kaya' : 'Add Household'}</span>
            </button>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
            <div className="space-y-4">
              {households.map((household) => (
                <div key={household.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{household.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(household.status)}`}>
                          {getStatusIcon(household.status)}
                          <span className="ml-1">
                            {household.status === 'priority' ? (language === 'sw' ? 'KIPAUMBELE' : 'PRIORITY') :
                             household.status === 'mch_due' ? (language === 'sw' ? 'MCH INAHITAJIKA' : 'MCH DUE') :
                             (language === 'sw' ? 'HAI' : 'ACTIVE')}
                          </span>
                        </span>
                        {household.shaEnrolled && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                            SHA ✓
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span>{household.location}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">{language === 'sw' ? 'Wanakaya' : 'Members'}:</span>
                            <span className="ml-1">{household.members}</span>
                          </div>
                          <div>
                            <span className="font-medium">{language === 'sw' ? 'Wazima' : 'Adults'}:</span>
                            <span className="ml-1">{household.adults}</span>
                          </div>
                          <div>
                            <span className="font-medium">{language === 'sw' ? 'Watoto' : 'Children'}:</span>
                            <span className="ml-1">{household.children}</span>
                          </div>
                          <div>
                            <span className="font-medium">{language === 'sw' ? 'Wajawazito' : 'Pregnant'}:</span>
                            <span className="ml-1">{household.pregnantWomen}</span>
                          </div>
                        </div>
                        {household.notes && (
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                            <span className="text-sm">{household.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedHousehold(household);
                          setActiveModal('viewHousehold');
                        }}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title={language === 'sw' ? 'Ona maelezo' : 'View details'}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedHousehold(household);
                          setActiveModal('editHousehold');
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title={language === 'sw' ? 'Hariri' : 'Edit'}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {household.nextVisit && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-800 font-medium">
                            {language === 'sw' ? 'Ziara ijayo' : 'Next visit'}: {household.nextVisit.toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            addNotification({
                              title: language === 'sw' ? 'Ziara Imepangwa' : 'Visit Scheduled',
                              message: language === 'sw' ? 'Ziara imepangwa' : 'Visit has been scheduled',
                              type: 'info',
                              read: false
                            });
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          {language === 'sw' ? 'Panga Ziara' : 'Schedule Visit'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transport Request Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Car className="w-8 h-8 text-orange-500" />
            <span>{language === 'sw' ? 'Maombi ya Usafiri' : 'Transport Requests'}</span>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {rideRequests.filter(r => r.status === 'pending').length}
            </span>
          </h2>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
            {rideRequests.filter(r => r.status === 'pending').length > 0 ? (
              <div className="space-y-4">
                {rideRequests.filter(r => r.status === 'pending').map((request) => (
                  <div key={request.id} className="border-2 border-gray-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{request.patientName}</h3>
                        <div className="space-y-1 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <span>{request.pickup} → {request.destination}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>{request.timestamp.toLocaleString()}</span>
                          </div>
                          {request.notes && (
                            <div className="flex items-start space-x-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                              <span className="text-sm">{request.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600 mb-2">
                          {formatAmount(request.cost)}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveRequest(request.id, false)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-bold"
                          >
                            {language === 'sw' ? 'Kataa' : 'Reject'}
                          </button>
                          <button
                            onClick={() => handleApproveRequest(request.id, true)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-bold"
                          >
                            {language === 'sw' ? 'Kubali' : 'Approve'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">
                  {language === 'sw' ? 'Hakuna Maombi ya Usafiri' : 'No Transport Requests'}
                </h3>
                <p className="text-gray-400">
                  {language === 'sw' ? 'Maombi mapya yataonyeshwa hapa' : 'New requests will appear here'}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <button
            onClick={() => setActiveModal('addHousehold')}
            className="min-h-[120px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🏠</div>
            <Plus className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'ONGEZA KAYA' : 'ADD HOUSEHOLD'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Kaya mpya' : 'New household'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('healthAlerts')}
            className="min-h-[120px] bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🚨</div>
            <AlertTriangle className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'TAHADHARI' : 'HEALTH ALERTS'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Ripoti dharura' : 'Report emergency'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('communityStats')}
            className="min-h-[120px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">📊</div>
            <BarChart3 className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'TAKWIMU' : 'STATISTICS'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Takwimu za jamii' : 'Community stats'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('reports')}
            className="min-h-[120px] bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">📋</div>
            <Activity className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'RIPOTI' : 'REPORTS'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Ripoti za kazi' : 'Work reports'}
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Add Household Modal */}
      {activeModal === 'addHousehold' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🏠 Ongeza Kaya Mpya' : '🏠 Add New Household'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Jina la Kaya' : 'Household Name'} *
                </label>
                <input
                  type="text"
                  value={newHousehold.name}
                  onChange={(e) => setNewHousehold(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={language === 'sw' ? 'Kwa mfano: Familia ya Mwangi' : 'e.g., Mwangi Family'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Mahali' : 'Location'} *
                </label>
                <input
                  type="text"
                  value={newHousehold.location}
                  onChange={(e) => setNewHousehold(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={language === 'sw' ? 'Kwa mfano: Kiambu Village, Zone A' : 'e.g., Kiambu Village, Zone A'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Wanakaya' : 'Total Members'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={newHousehold.members}
                  onChange={(e) => setNewHousehold(prev => ({ ...prev, members: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Wazima' : 'Adults'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={newHousehold.adults}
                  onChange={(e) => setNewHousehold(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Watoto' : 'Children'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={newHousehold.children}
                  onChange={(e) => setNewHousehold(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Wajawazito' : 'Pregnant Women'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={newHousehold.pregnantWomen}
                  onChange={(e) => setNewHousehold(prev => ({ ...prev, pregnantWomen: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Maelezo ya Ziada' : 'Additional Notes'}
              </label>
              <textarea
                value={newHousehold.notes}
                onChange={(e) => setNewHousehold(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder={language === 'sw' ? 'Maelezo mengine muhimu...' : 'Any important notes...'}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={handleAddHousehold}
                disabled={!newHousehold.name || !newHousehold.location}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'sw' ? 'Ongeza Kaya' : 'Add Household'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Other Modals */}
      {activeModal === 'healthAlerts' && (
        <EmergencyReportModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSubmit={(data) => {
            addNotification({
              title: language === 'sw' ? 'Tahadhari Imewasilishwa' : 'Alert Submitted',
              message: language === 'sw' ? 'Tahadhari ya afya imewasilishwa' : 'Health alert has been submitted',
              type: 'warning',
              read: false
            });
            setActiveModal(null);
          }}
          emergencyType="outbreak"
        />
      )}

      {(activeModal === 'communityStats' || activeModal === 'reports') && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={
            activeModal === 'communityStats' 
              ? (language === 'sw' ? '📊 Takwimu za Jamii' : '📊 Community Statistics')
              : (language === 'sw' ? '📋 Ripoti za Kazi' : '📋 Work Reports')
          }
          size="lg"
        >
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-2xl text-center">
              <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900 mb-2">
                {activeModal === 'communityStats' 
                  ? (language === 'sw' ? 'Takwimu za Jamii' : 'Community Statistics')
                  : (language === 'sw' ? 'Ripoti za Kazi' : 'Work Reports')
                }
              </h3>
              <p className="text-green-800">
                {language === 'sw' ? 'Kipengele kimefunguliwa' : 'Feature is now available'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{language === 'sw' ? 'Kaya Zilizopangiwa' : 'Assigned Households'}</h4>
                <div className="text-2xl font-bold text-green-600">{households.length}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{language === 'sw' ? 'Ziara za Mwezi' : 'Monthly Visits'}</h4>
                <div className="text-2xl font-bold text-blue-600">24</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};