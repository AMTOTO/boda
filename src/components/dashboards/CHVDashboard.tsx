import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../common/Header';
import { StatsCard } from '../common/StatsCard';
import { Modal } from '../common/Modal';
import { ToastContainer } from '../common/Toast';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { CameraCapture } from '../common/CameraCapture';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BSenseAI } from '../common/BSenseAI';
import { 
  Home, 
  Users, 
  Heart, 
  AlertTriangle,
  Activity,
  TrendingUp,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Plus,
  Star,
  Target,
  Zap,
  Bell,
  Eye,
  Camera,
  Mic,
  Upload,
  Send,
  Stethoscope,
  Shield,
  Calendar,
  FileText,
  Navigation,
  Compass,
  Battery,
  Signal,
  Wifi,
  Volume2,
  Brain,
  UserCheck,
  Baby,
  Thermometer,
  Scale,
  Award,
  DollarSign,
  Package,
  Gift,
  Bike,
  Route,
  Timer,
  Settings,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Share2
} from 'lucide-react';

export const CHVDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    households, 
    rideRequests, 
    healthAlerts, 
    mythReports, 
    addHousehold, 
    updateHousehold,
    addRideRequest,
    addHealthAlert, 
    addMythReport,
    updateRideRequest,
    updateHealthAlert,
    communityFunds,
    addToMSupu
  } = useData();
  
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraContext, setCameraContext] = useState<'household' | 'alert' | 'myth' | 'transport'>('household');
  const [showAddHouseholdModal, setShowAddHouseholdModal] = useState(false);
  const [showMythModal, setShowMythModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showParabodaAI, setShowParabodaAI] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'priority' | 'mch_due'>('all');
  
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: 'success' | 'warning' | 'error' | 'info' }>>([]);

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const tabs = [
    { id: 'overview', name: t('nav.overview'), icon: Activity, emoji: '📊' },
    { id: 'households', name: t('nav.households'), icon: Home, emoji: '🏠' },
    { id: 'transport', name: t('nav.transport'), icon: Bike, emoji: '🏍️' },
    { id: 'alerts', name: t('nav.alerts'), icon: AlertTriangle, emoji: '🚨' },
    { id: 'myths', name: t('nav.myths'), icon: Shield, emoji: '🛡️' },
    { id: 'wallet', name: t('nav.wallet'), icon: DollarSign, emoji: '💰' },
    { id: 'reports', name: t('nav.reports'), icon: FileText, emoji: '📋' }
  ];

  // Filter households based on search and status
  const filteredHouseholds = households.filter(household => {
    const matchesSearch = household.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         household.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || household.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // CHV Statistics
  const chvStats = {
    totalHouseholds: households.length,
    priorityHouseholds: households.filter(h => h.status === 'priority').length,
    mchDue: households.filter(h => h.status === 'mch_due').length,
    visitsDue: households.filter(h => h.nextVisit && new Date(h.nextVisit) <= new Date()).length,
    totalMembers: households.reduce((sum, h) => sum + h.members, 0),
    childrenUnder5: households.reduce((sum, h) => sum + h.childrenUnder5, 0),
    pregnantWomen: households.reduce((sum, h) => sum + h.pregnantWomen, 0)
  };

  const handleServiceRequest = (serviceData: any) => {
    addRideRequest({
      type: serviceData.serviceId,
      patientName: serviceData.patientName,
      pickup: serviceData.pickupLocation,
      destination: serviceData.destination,
      urgency: serviceData.urgency,
      status: 'pending',
      requestedBy: user?.name || 'CHV',
      cost: serviceData.estimatedCost || 500,
      notes: serviceData.additionalNotes
    });

    setShowServiceModal(false);
    showToast(
      t('message.success'),
      language === 'sw' ? 'Ombi la usafiri limewasilishwa' : 'Transport request submitted',
      'success'
    );
  };

  const handleApproveTransport = (requestId: string) => {
    updateRideRequest(requestId, { status: 'approved' });
    showToast(
      t('message.success'),
      language === 'sw' ? 'Usafiri umeidhinishwa' : 'Transport approved',
      'success'
    );
  };

  const handleReportMyth = () => {
    const mythData = {
      category: 'general',
      content: 'Sample myth report from CHV',
      location: user?.location || 'Unknown',
      reportedBy: user?.name || 'CHV',
      verified: false,
      debunked: false
    };

    addMythReport(mythData);
    showToast(
      t('message.success'),
      language === 'sw' ? 'Ripoti ya uwongo imewasilishwa' : 'Myth report submitted',
      'success'
    );
  };

  const handleReportAlert = () => {
    const alertData = {
      type: 'disease_outbreak' as const,
      location: user?.location || 'Unknown',
      description: 'Health alert reported by CHV',
      priority: 'medium' as const,
      reportedBy: user?.name || 'CHV',
      status: 'new' as const
    };

    addHealthAlert(alertData);
    showToast(
      t('message.success'),
      language === 'sw' ? 'Tahadhari ya afya imewasilishwa' : 'Health alert submitted',
      'success'
    );
  };

  const handleInvestigateAlert = (alertId: string) => {
    updateHealthAlert(alertId, { status: 'investigating' });
    showToast(
      t('message.success'),
      language === 'sw' ? 'Uchunguzi umeanza' : 'Investigation started',
      'info'
    );
  };

  const handleResolveAlert = (alertId: string) => {
    updateHealthAlert(alertId, { status: 'resolved' });
    showToast(
      t('message.success'),
      language === 'sw' ? 'Tahadhari imetatuliwa' : 'Alert resolved',
      'success'
    );
  };

  const handleScheduleVisit = (householdId: string) => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    updateHousehold(householdId, { 
      nextVisit: nextWeek,
      lastVisit: new Date()
    });
    
    showToast(
      t('message.success'),
      language === 'sw' ? 'Ziara imepangwa' : 'Visit scheduled',
      'success'
    );
  };

  const handleCameraCapture = (imageData: string, file: File) => {
    switch (cameraContext) {
      case 'household':
        showToast(
          language === 'sw' ? 'Picha ya Kaya Imehifadhiwa' : 'Household Photo Saved',
          language === 'sw' ? 'Picha ya kaya imehifadhiwa' : 'Household photo has been saved',
          'success'
        );
        break;
      case 'alert':
        showToast(
          language === 'sw' ? 'Picha ya Tahadhari Imehifadhiwa' : 'Alert Photo Saved',
          language === 'sw' ? 'Picha ya tahadhari imehifadhiwa' : 'Alert photo has been saved',
          'success'
        );
        break;
      case 'myth':
        showToast(
          language === 'sw' ? 'Picha ya Uwongo Imehifadhiwa' : 'Myth Photo Saved',
          language === 'sw' ? 'Picha ya uwongo imehifadhiwa' : 'Myth photo has been saved',
          'success'
        );
        break;
      case 'transport':
        showToast(
          language === 'sw' ? 'Picha ya Usafiri Imehifadhiwa' : 'Transport Photo Saved',
          language === 'sw' ? 'Picha ya usafiri imehifadhiwa' : 'Transport photo has been saved',
          'success'
        );
        break;
    }
    setShowCameraModal(false);
  };

  const openCamera = (context: 'household' | 'alert' | 'myth' | 'transport') => {
    setCameraContext(context);
    setShowCameraModal(true);
  };

  const refreshMSupu = () => {
    showToast(
      language === 'sw' ? 'M-Supu Imesasishwa' : 'M-Supu Refreshed',
      language === 'sw' ? 'Taarifa za M-Supu zimesasishwa' : 'M-Supu information has been refreshed',
      'info'
    );
  };

  return (
    <div className="min-h-screen dashboard-bg-chv">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya CHV' : 'CHV Dashboard'}
        subtitle={language === 'sw' ? `Karibu, ${user?.name}` : `Welcome, ${user?.name}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title={language === 'sw' ? 'Kaya za Jumla' : 'Total Households'}
            value={chvStats.totalHouseholds}
            change={`+${chvStats.totalMembers} members`}
            changeType="positive"
            icon={Home}
            color="purple"
            delay={0}
          />
          <StatsCard
            title={language === 'sw' ? 'Kaya za Kipaumbele' : 'Priority Households'}
            value={chvStats.priorityHouseholds}
            change={`${chvStats.visitsDue} visits due`}
            changeType="warning"
            icon={AlertTriangle}
            color="orange"
            delay={0.1}
          />
          <StatsCard
            title={language === 'sw' ? 'Watoto Chini ya Miaka 5' : 'Children Under 5'}
            value={chvStats.childrenUnder5}
            change="Health monitoring"
            changeType="positive"
            icon={Baby}
            color="blue"
            delay={0.2}
          />
          <StatsCard
            title={language === 'sw' ? 'Wajawazito' : 'Pregnant Women'}
            value={chvStats.pregnantWomen}
            change={`${chvStats.mchDue} MCH due`}
            changeType="warning"
            icon={Heart}
            color="pink"
            delay={0.3}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-xl border-4 border-purple-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-purple-100'
                }`}
              >
                <span className="text-xl">{tab.emoji}</span>
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-purple-500" />
                  <span>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setShowAddHouseholdModal(true)}
                    className="flex flex-col items-center space-y-3 p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:border-green-300 hover:bg-green-100 transition-all"
                  >
                    <Plus className="w-8 h-8 text-green-600" />
                    <span className="font-bold text-green-800 text-center">
                      {language === 'sw' ? 'Ongeza Kaya' : 'Add Household'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="flex flex-col items-center space-y-3 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-100 transition-all"
                  >
                    <Bike className="w-8 h-8 text-blue-600" />
                    <span className="font-bold text-blue-800 text-center">
                      {language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}
                    </span>
                  </button>

                  <button
                    onClick={handleReportMyth}
                    className="flex flex-col items-center space-y-3 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl hover:border-purple-300 hover:bg-purple-100 transition-all"
                  >
                    <Shield className="w-8 h-8 text-purple-600" />
                    <span className="font-bold text-purple-800 text-center">
                      {language === 'sw' ? 'Ripoti Uwongo' : 'Report Myth'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowParabodaAI(true)}
                    className="flex flex-col items-center space-y-3 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-100 transition-all"
                  >
                    <Brain className="w-8 h-8 text-indigo-600" />
                    <span className="font-bold text-indigo-800 text-center">
                      {language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Transport Requests */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <Bike className="w-6 h-6 text-purple-500" />
                    <span>{language === 'sw' ? 'Maombi ya Usafiri' : 'Transport Requests'}</span>
                  </h3>
                  <div className="space-y-4">
                    {rideRequests.filter(req => req.status === 'pending').slice(0, 3).map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-900">{request.patientName}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                            request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {request.urgency}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{request.pickup} → {request.destination}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveTransport(request.id)}
                            className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-bold"
                          >
                            {language === 'sw' ? 'Idhinisha' : 'Approve'}
                          </button>
                          <button
                            onClick={() => openCamera('transport')}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Health Alerts */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <AlertTriangle className="w-6 h-6 text-purple-500" />
                    <span>{language === 'sw' ? 'Tahadhari za Afya' : 'Health Alerts'}</span>
                  </h3>
                  <div className="space-y-4">
                    {healthAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-900">{alert.type.replace('_', ' ')}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{alert.description}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleInvestigateAlert(alert.id)}
                            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold"
                          >
                            {language === 'sw' ? 'Chunguza' : 'Investigate'}
                          </button>
                          <button
                            onClick={() => handleResolveAlert(alert.id)}
                            className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-bold"
                          >
                            {language === 'sw' ? 'Tatua' : 'Resolve'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Households Tab */}
          {activeTab === 'households' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={language === 'sw' ? 'Tafuta kaya...' : 'Search households...'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">{language === 'sw' ? 'Zote' : 'All'}</option>
                    <option value="active">{language === 'sw' ? 'Hai' : 'Active'}</option>
                    <option value="priority">{language === 'sw' ? 'Kipaumbele' : 'Priority'}</option>
                    <option value="mch_due">{language === 'sw' ? 'MCH Inahitajika' : 'MCH Due'}</option>
                  </select>
                  <button
                    onClick={() => setShowAddHouseholdModal(true)}
                    className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-bold"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Ongeza Kaya' : 'Add Household'}</span>
                  </button>
                </div>
              </div>

              {/* Households List */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Home className="w-6 h-6 text-purple-500" />
                  <span>{language === 'sw' ? 'Kaya' : 'Households'} ({filteredHouseholds.length})</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredHouseholds.map((household) => (
                    <div key={household.id} className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">{household.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          household.status === 'priority' ? 'bg-red-100 text-red-800' :
                          household.status === 'mch_due' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {household.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Wanakaya' : 'Members'}</p>
                          <p className="font-bold">{household.members}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Watoto <5' : 'Children <5'}</p>
                          <p className="font-bold">{household.childrenUnder5}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Wajawazito' : 'Pregnant'}</p>
                          <p className="font-bold">{household.pregnantWomen}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Ziara Ijayo' : 'Next Visit'}</p>
                          <p className="font-bold text-sm">
                            {household.nextVisit 
                              ? new Date(household.nextVisit).toLocaleDateString()
                              : 'Not scheduled'
                            }
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{household.location}</p>
                      
                      {household.notes && (
                        <p className="text-gray-700 text-sm mb-4 bg-yellow-50 p-3 rounded-lg">
                          {household.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleScheduleVisit(household.id)}
                          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>{language === 'sw' ? 'Panga Ziara' : 'Schedule Visit'}</span>
                        </button>
                        
                        <button
                          onClick={() => setShowServiceModal(true)}
                          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-bold"
                        >
                          <Bike className="w-4 h-4" />
                          <span>{language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}</span>
                        </button>
                        
                        <button
                          onClick={() => openCamera('household')}
                          className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Camera className="w-4 h-4" />
                          <span>{language === 'sw' ? 'Picha' : 'Photo'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Transport Tab */}
          {activeTab === 'transport' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Bike className="w-6 h-6 text-purple-500" />
                  <span>{language === 'sw' ? 'Usimamizi wa Usafiri' : 'Transport Management'}</span>
                </h3>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-bold"
                >
                  <Plus className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {rideRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900">{request.patientName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">KSh {request.cost}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">{language === 'sw' ? 'Kuchukua' : 'Pickup'}</p>
                        <p className="font-medium">{request.pickup}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{language === 'sw' ? 'Marudio' : 'Destination'}</p>
                        <p className="font-medium">{request.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{language === 'sw' ? 'Aina' : 'Type'}</p>
                        <p className="font-medium">{request.type.replace('_', ' ')}</p>
                      </div>
                    </div>

                    {request.notes && (
                      <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-lg">
                        {request.notes}
                      </p>
                    )}

                    <div className="flex space-x-3">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleApproveTransport(request.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-bold"
                        >
                          {language === 'sw' ? 'Idhinisha' : 'Approve'}
                        </button>
                      )}
                      <button
                        onClick={() => openCamera('transport')}
                        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-purple-500" />
                  <span>{language === 'sw' ? 'Tahadhari za Afya' : 'Health Alerts'}</span>
                </h3>
                <button
                  onClick={handleReportAlert}
                  className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-bold"
                >
                  <Plus className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Ripoti Tahadhari' : 'Report Alert'}</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {healthAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900">{alert.type.replace('_', ' ')}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.priority}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        alert.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{alert.description}</p>
                    <p className="text-gray-500 text-sm mb-4">{alert.location}</p>

                    <div className="flex space-x-3">
                      {alert.status === 'new' && (
                        <button
                          onClick={() => handleInvestigateAlert(alert.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-bold"
                        >
                          {language === 'sw' ? 'Chunguza' : 'Investigate'}
                        </button>
                      )}
                      {alert.status === 'investigating' && (
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-bold"
                        >
                          {language === 'sw' ? 'Tatua' : 'Resolve'}
                        </button>
                      )}
                      <button
                        onClick={() => openCamera('alert')}
                        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Myths Tab */}
          {activeTab === 'myths' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-purple-500" />
                  <span>{language === 'sw' ? 'Ripoti za Uwongo' : 'Myth Reports'}</span>
                </h3>
                <button
                  onClick={handleReportMyth}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-bold"
                >
                  <Plus className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Ripoti Uwongo' : 'Report Myth'}</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {mythReports.map((myth) => (
                  <div key={myth.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900">{myth.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          myth.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {myth.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      {myth.reach && (
                        <span className="text-sm text-gray-500">Reach: {myth.reach}</span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{myth.content}</p>
                    <p className="text-gray-500 text-sm mb-4">{myth.location}</p>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => openCamera('myth')}
                        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <DollarSign className="w-6 h-6 text-purple-500" />
                  <span>{language === 'sw' ? 'M-Supu ya Jamii' : 'Community M-Supu'}</span>
                </h3>
                <button
                  onClick={refreshMSupu}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-bold"
                >
                  <Activity className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Sasisha' : 'Refresh'}</span>
                </button>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-4xl font-bold text-green-600 mb-2">KSh {communityFunds.toLocaleString()}</p>
                <p className="text-gray-600">
                  {language === 'sw' ? 'Jumla ya Fedha za Jamii' : 'Total Community Funds'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-2">
                    {language === 'sw' ? 'Michango ya Fedha' : 'Cash Contributions'}
                  </h4>
                  <p className="text-2xl font-bold text-green-600">KSh 8,500</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-bold text-blue-800 mb-2">
                    {language === 'sw' ? 'Michango ya Vitu' : 'Item Contributions'}
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">KSh 4,000</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <h4 className="font-bold text-purple-800 mb-2">
                    {language === 'sw' ? 'Wachangiaji' : 'Contributors'}
                  </h4>
                  <p className="text-2xl font-bold text-purple-600">47</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Service Request Modal */}
      <ServiceRequestModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onRequest={handleServiceRequest}
      />

      {/* Camera Modal */}
      <CameraCapture
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
        title={
          cameraContext === 'household' ? (language === 'sw' ? 'Piga Picha ya Kaya' : 'Take Household Photo') :
          cameraContext === 'alert' ? (language === 'sw' ? 'Piga Picha ya Tahadhari' : 'Take Alert Photo') :
          cameraContext === 'myth' ? (language === 'sw' ? 'Piga Picha ya Uwongo' : 'Take Myth Photo') :
          (language === 'sw' ? 'Piga Picha ya Usafiri' : 'Take Transport Photo')
        }
        context={
          cameraContext === 'household' ? (language === 'sw' ? 'Piga picha ya kaya' : 'Capture household information') :
          cameraContext === 'alert' ? (language === 'sw' ? 'Piga picha ya tahadhari ya afya' : 'Capture health alert evidence') :
          cameraContext === 'myth' ? (language === 'sw' ? 'Piga picha ya uwongo wa kiafya' : 'Capture health misinformation') :
          (language === 'sw' ? 'Piga picha ya usafiri' : 'Capture transport evidence')
        }
      />

      {/* ParaBoda-AI Modal */}
      <BSenseAI
        isOpen={showParabodaAI}
        onClose={() => setShowParabodaAI(false)}
        userRole="chv"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};