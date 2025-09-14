import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../common/Header';
import { StatsCard } from '../common/StatsCard';
import { Modal } from '../common/Modal';
import { ToastContainer } from '../common/Toast';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { DepositModal } from '../common/DepositModal';
import { RewardsModal } from '../common/RewardsModal';
import { CameraCapture } from '../common/CameraCapture';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BSenseAI } from '../common/BSenseAI';
import { 
  Heart, 
  Bike, 
  Award, 
  DollarSign,
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
  Users,
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
  Gift,
  Package,
  Route,
  Timer,
  Settings,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Share2,
  AlertTriangle
} from 'lucide-react';

export const CommunityDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    rideRequests, 
    healthAlerts, 
    mythReports, 
    addRideRequest, 
    addMythReport,
    communityFunds,
    addToMSupu,
    contributeItems
  } = useData();
  
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraContext, setCameraContext] = useState<'deposit' | 'health' | 'transport'>('deposit');
  const [showParabodaAI, setShowParabodaAI] = useState(false);
  const [userPoints, setUserPoints] = useState(user?.points || 150);
  const [nearbyRiders, setNearbyRiders] = useState([
    { id: '1', name: 'John M.', distance: '0.8 km', eta: '3 min', rating: 4.8 },
    { id: '2', name: 'Sarah K.', distance: '1.2 km', eta: '5 min', rating: 4.9 },
    { id: '3', name: 'David O.', distance: '2.5 km', eta: '8 min', rating: 4.7 }
  ]);
  
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
    { id: 'health', name: t('nav.health'), icon: Heart, emoji: '❤️' },
    { id: 'transport', name: t('nav.transport'), icon: Bike, emoji: '🏍️' },
    { id: 'rewards', name: t('nav.rewards'), icon: Award, emoji: '🏆' },
    { id: 'wallet', name: t('nav.wallet'), icon: DollarSign, emoji: '💰' }
  ];

  // Community member statistics
  const communityStats = {
    healthPoints: userPoints,
    ridesTaken: 12,
    mSupuContribution: 2500,
    nextAppointment: '2024-02-15',
    upcomingVaccines: 1,
    pendingRides: rideRequests.filter(req => req.status === 'pending' && req.requestedBy === user?.name).length
  };

  const handleServiceRequest = (serviceData: any) => {
    addRideRequest({
      type: serviceData.serviceId,
      patientName: serviceData.patientName,
      pickup: serviceData.pickupLocation,
      destination: serviceData.destination,
      urgency: serviceData.urgency,
      status: 'pending',
      requestedBy: user?.name || 'Community Member',
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

  const handleDeposit = (type: 'cash' | 'items', amount: number, description?: string) => {
    if (type === 'cash') {
      addToMSupu(amount);
    } else {
      contributeItems(description || 'Item contribution', amount);
    }

    showToast(
      t('message.success'),
      language === 'sw' 
        ? `Mchango wa ${type === 'cash' ? 'fedha' : 'vitu'} umewasilishwa` 
        : `${type === 'cash' ? 'Cash' : 'Item'} contribution submitted`,
      'success'
    );
  };

  const handleRedeemReward = (item: any) => {
    setUserPoints(prev => prev - item.points);
    
    showToast(
      t('message.success'),
      language === 'sw' 
        ? `Umefanikiwa kuchukua ${language === 'sw' ? item.nameSwahili : item.name}` 
        : `Successfully redeemed ${item.name}`,
      'success'
    );
  };

  const handleCameraCapture = (imageData: string, file: File) => {
    switch (cameraContext) {
      case 'deposit':
        showToast(
          language === 'sw' ? 'Picha ya Mchango Imehifadhiwa' : 'Deposit Photo Saved',
          language === 'sw' ? 'Picha ya mchango wako imehifadhiwa' : 'Your contribution photo has been saved',
          'success'
        );
        break;
      case 'health':
        showToast(
          language === 'sw' ? 'Picha ya Afya Imehifadhiwa' : 'Health Photo Saved',
          language === 'sw' ? 'Picha ya hali ya afya imehifadhiwa' : 'Health condition photo has been saved',
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

  const openCamera = (context: 'deposit' | 'health' | 'transport') => {
    setCameraContext(context);
    setShowCameraModal(true);
  };

  const reportMyth = (mythText: string) => {
    addMythReport({
      category: 'general',
      content: mythText,
      location: user?.location || 'Unknown',
      reportedBy: user?.name || 'Community Member',
      verified: false,
      debunked: false
    });
    
    showToast(
      t('message.success'),
      language === 'sw' ? 'Ripoti ya uwongo imewasilishwa' : 'Myth report submitted',
      'success'
    );
  };

  return (
    <div className="min-h-screen dashboard-bg-community">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya Jamii' : 'Community Dashboard'}
        subtitle={language === 'sw' ? `Karibu, ${user?.name}` : `Welcome, ${user?.name}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title={language === 'sw' ? 'Pointi za Afya' : 'Health Points'}
            value={communityStats.healthPoints}
            change="+25 this week"
            changeType="positive"
            icon={Award}
            color="emerald"
            delay={0}
          />
          <StatsCard
            title={language === 'sw' ? 'Safari Zilizochukuliwa' : 'Rides Taken'}
            value={communityStats.ridesTaken}
            change="+3 this month"
            changeType="positive"
            icon={Bike}
            color="blue"
            delay={0.1}
          />
          <StatsCard
            title={language === 'sw' ? 'Mchango wa M-Supu' : 'M-Supu Contribution'}
            value={`KSh ${communityStats.mSupuContribution}`}
            change="+500 last week"
            changeType="positive"
            icon={DollarSign}
            color="purple"
            delay={0.2}
          />
          <StatsCard
            title={language === 'sw' ? 'Miadi Ijayo' : 'Next Appointment'}
            value={new Date(communityStats.nextAppointment).toLocaleDateString()}
            change={communityStats.upcomingVaccines > 0 ? `${communityStats.upcomingVaccines} vaccines due` : 'No vaccines due'}
            changeType={communityStats.upcomingVaccines > 0 ? 'warning' : 'positive'}
            icon={Calendar}
            color="orange"
            delay={0.3}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-xl border-4 border-emerald-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-emerald-100'
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
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-emerald-500" />
                  <span>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    onClick={() => setShowParabodaAI(true)}
                    className="flex flex-col items-center space-y-3 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl hover:border-purple-300 hover:bg-purple-100 transition-all"
                  >
                    <Brain className="w-8 h-8 text-purple-600" />
                    <span className="font-bold text-purple-800 text-center">
                      {language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowRewardsModal(true)}
                    className="flex flex-col items-center space-y-3 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:border-yellow-300 hover:bg-yellow-100 transition-all"
                  >
                    <Award className="w-8 h-8 text-yellow-600" />
                    <span className="font-bold text-yellow-800 text-center">
                      {language === 'sw' ? 'Zawadi' : 'Rewards'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="flex flex-col items-center space-y-3 p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:border-green-300 hover:bg-green-100 transition-all"
                  >
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <span className="font-bold text-green-800 text-center">
                      {language === 'sw' ? 'Changia M-Supu' : 'Contribute to M-Supu'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Nearby ParaBodas */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-emerald-500" />
                  <span>{language === 'sw' ? 'ParaBodas za Karibu' : 'Nearby ParaBodas'}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {nearbyRiders.map((rider) => (
                    <div key={rider.id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-gray-900">{rider.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{rider.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">{language === 'sw' ? 'Umbali' : 'Distance'}</p>
                          <p className="font-medium">{rider.distance}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ETA</p>
                          <p className="font-medium">{rider.eta}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowServiceModal(true)}
                        className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm font-bold"
                      >
                        {language === 'sw' ? 'Omba Usafiri' : 'Request Ride'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Tips */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-emerald-500" />
                  <span>{language === 'sw' ? 'Vidokezo vya Afya' : 'Health Tips'}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                    <div className="text-3xl mb-2">💧</div>
                    <h4 className="font-bold text-blue-800 mb-2">
                      {language === 'sw' ? 'Kunywa Maji ya Kutosha' : 'Stay Hydrated'}
                    </h4>
                    <p className="text-blue-600 text-sm">
                      {language === 'sw' 
                        ? 'Kunywa angalau lita 2 za maji kila siku kwa afya bora.'
                        : 'Drink at least 2 liters of water daily for optimal health.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-100">
                    <div className="text-3xl mb-2">🥗</div>
                    <h4 className="font-bold text-green-800 mb-2">
                      {language === 'sw' ? 'Kula Matunda na Mboga' : 'Eat Fruits & Vegetables'}
                    </h4>
                    <p className="text-green-600 text-sm">
                      {language === 'sw' 
                        ? 'Kula angalau vipimo 5 vya matunda na mboga kila siku.'
                        : 'Eat at least 5 servings of fruits and vegetables daily.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-100">
                    <div className="text-3xl mb-2">🧠</div>
                    <h4 className="font-bold text-purple-800 mb-2">
                      {language === 'sw' ? 'Punguza Msongo wa Mawazo' : 'Reduce Stress'}
                    </h4>
                    <p className="text-purple-600 text-sm">
                      {language === 'sw' 
                        ? 'Fanya mazoezi ya kupumua na kutafakari kila siku.'
                        : 'Practice breathing exercises and meditation daily.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-xl p-4 border-2 border-red-100">
                    <div className="text-3xl mb-2">🦟</div>
                    <h4 className="font-bold text-red-800 mb-2">
                      {language === 'sw' ? 'Kinga ya Malaria' : 'Malaria Prevention'}
                    </h4>
                    <p className="text-red-600 text-sm">
                      {language === 'sw' 
                        ? 'Tumia chandarua kilichotibiwa kila usiku.'
                        : 'Use treated mosquito nets every night.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Tab */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Health Records */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-emerald-500" />
                  <span>{language === 'sw' ? 'Rekodi za Afya' : 'Health Records'}</span>
                </h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{language === 'sw' ? 'Ziara ya Mwisho' : 'Last Visit'}</h4>
                      <span className="text-sm text-gray-500">2024-01-10</span>
                    </div>
                    <p className="text-gray-600 mb-3">{language === 'sw' ? 'Uchunguzi wa kawaida' : 'Routine checkup'}</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openCamera('health')}
                        className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{language === 'sw' ? 'Picha' : 'Photo'}</span>
                      </button>
                      <button
                        onClick={() => setShowParabodaAI(true)}
                        className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-bold"
                      >
                        <Brain className="w-4 h-4" />
                        <span>{language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{language === 'sw' ? 'Chanjo Zinazokuja' : 'Upcoming Vaccines'}</h4>
                      <span className="text-sm text-gray-500">2024-02-15</span>
                    </div>
                    <p className="text-gray-600 mb-3">{language === 'sw' ? 'Chanjo ya Polio kwa mtoto' : 'Polio vaccine for child'}</p>
                    <button
                      onClick={() => setShowServiceModal(true)}
                      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold"
                    >
                      <Bike className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}</span>
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{language === 'sw' ? 'Ripoti Uwongo wa Afya' : 'Report Health Myth'}</h4>
                    </div>
                    <div className="flex space-y-3 flex-col">
                      <input
                        type="text"
                        placeholder={language === 'sw' ? 'Andika uwongo wa afya ulioskia...' : 'Type a health myth you heard...'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            reportMyth((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openCamera('health')}
                          className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Camera className="w-4 h-4" />
                          <span>{language === 'sw' ? 'Picha' : 'Photo'}</span>
                        </button>
                        <button
                          onClick={() => setShowParabodaAI(true)}
                          className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-bold"
                        >
                          <Brain className="w-4 h-4" />
                          <span>{language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transport Tab */}
          {activeTab === 'transport' && (
            <div className="space-y-6">
              {/* Request Transport */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-emerald-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Bike className="w-6 h-6 text-emerald-500" />
                    <span>{language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}</span>
                  </h3>
                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-bold"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Ombi Jipya' : 'New Request'}</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{language === 'sw' ? 'ParaBodas za Karibu' : 'Nearby ParaBodas'}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {nearbyRiders.map((rider) => (
                        <div key={rider.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{rider.name}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm">{rider.rating}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{rider.distance}</span>
                            <span>ETA: {rider.eta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{language === 'sw' ? 'Maombi ya Hivi Karibuni' : 'Recent Requests'}</h4>
                    </div>
                    <div className="space-y-3">
                      {rideRequests.filter(req => req.requestedBy === user?.name).slice(0, 3).map((request) => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{request.type.replace('_', ' ')}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              request.status === 'completed' ? 'bg-green-100 text-green-800' :
                              request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{request.pickup} → {request.destination}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{new Date(request.timestamp).toLocaleDateString()}</span>
                            <span className="font-medium text-emerald-600">KSh {request.cost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{language === 'sw' ? 'Ripoti Dharura' : 'Report Emergency'}</h4>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowServiceModal(true)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-bold"
                      >
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        {language === 'sw' ? 'Omba Usafiri wa Dharura' : 'Request Emergency Transport'}
                      </button>
                      <button
                        onClick={() => openCamera('transport')}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              {/* Rewards Overview */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-emerald-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Award className="w-6 h-6 text-emerald-500" />
                    <span>{language === 'sw' ? 'Zawadi na Pointi' : 'Rewards & Points'}</span>
                  </h3>
                  <button
                    onClick={() => setShowRewardsModal(true)}
                    className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-bold"
                  >
                    <Gift className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Duka la Zawadi' : 'Rewards Store'}</span>
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl text-white text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Award className="w-8 h-8" />
                    <span className="text-3xl font-black">{userPoints}</span>
                    <Star className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-bold">
                    {language === 'sw' ? 'Pointi Zako za Zawadi' : 'Your Reward Points'}
                  </p>
                  <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <span className="font-bold">
                      {language === 'sw' ? 'Kiwango: Shaba' : 'Level: Bronze'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {language === 'sw' ? 'Pointi Zilizopatikana' : 'Points Earned'}
                    </h4>
                    <p className="text-2xl font-bold text-emerald-600">350</p>
                    <p className="text-sm text-gray-500">
                      {language === 'sw' ? 'Jumla' : 'Total'}
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🎁</div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {language === 'sw' ? 'Pointi Zilizotumika' : 'Points Spent'}
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">200</p>
                    <p className="text-sm text-gray-500">
                      {language === 'sw' ? 'Jumla' : 'Total'}
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {language === 'sw' ? 'Kiwango Kijacho' : 'Next Level'}
                    </h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {language === 'sw' ? 'Fedha' : 'Silver'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'sw' ? 'Pointi 350 zaidi' : '350 more points'}
                    </p>
                  </div>
                </div>
              </div>

              {/* How to Earn Points */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'sw' ? 'Jinsi ya Kupata Pointi' : 'How to Earn Points'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-gray-900">
                        {language === 'sw' ? 'Hudhurio la Afya' : 'Health Visit'}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {language === 'sw' 
                        ? 'Hudhuria miadi yako ya afya kwa wakati'
                        : 'Attend your health appointments on time'
                      }
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {language === 'sw' ? 'Kila miadi' : 'Per appointment'}
                      </span>
                      <span className="font-bold text-emerald-600">+25 pts</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Baby className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900">
                        {language === 'sw' ? 'Chanjo za Watoto' : 'Child Vaccinations'}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {language === 'sw' 
                        ? 'Hakikisha mtoto wako anapata chanjo zote kwa wakati'
                        : 'Ensure your child gets all vaccinations on time'
                      }
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {language === 'sw' ? 'Kila chanjo' : 'Per vaccination'}
                      </span>
                      <span className="font-bold text-blue-600">+50 pts</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-gray-900">
                        {language === 'sw' ? 'Changia M-Supu' : 'Contribute to M-Supu'}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {language === 'sw' 
                        ? 'Changia fedha au vitu kwenye M-Supu ya jamii'
                        : 'Contribute cash or items to community M-Supu'
                      }
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {language === 'sw' ? 'Kwa kila KSh 100' : 'Per KSh 100'}
                      </span>
                      <span className="font-bold text-purple-600">+10 pts</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-red-600" />
                      </div>
                      <h4 className="font-bold text-gray-900">
                        {language === 'sw' ? 'Ripoti Uwongo wa Afya' : 'Report Health Myths'}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {language === 'sw' 
                        ? 'Saidia kupambana na uwongo kuhusu afya katika jamii'
                        : 'Help combat health misinformation in the community'
                      }
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {language === 'sw' ? 'Kwa kila ripoti' : 'Per report'}
                      </span>
                      <span className="font-bold text-red-600">+15 pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              {/* M-Supu Overview */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-emerald-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <DollarSign className="w-6 h-6 text-emerald-500" />
                    <span>{language === 'sw' ? 'M-Supu ya Jamii' : 'Community M-Supu'}</span>
                  </h3>
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-bold"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Changia' : 'Contribute'}</span>
                  </button>
                </div>
                
                <div className="text-center mb-8">
                  <p className="text-4xl font-bold text-emerald-600 mb-2">KSh {communityFunds.toLocaleString()}</p>
                  <p className="text-gray-600">
                    {language === 'sw' ? 'Jumla ya Fedha za Jamii' : 'Total Community Funds'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <h4 className="font-bold text-green-800 mb-2">
                      {language === 'sw' ? 'Mchango Wako' : 'Your Contribution'}
                    </h4>
                    <p className="text-2xl font-bold text-green-600">KSh {communityStats.mSupuContribution}</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <h4 className="font-bold text-blue-800 mb-2">
                      {language === 'sw' ? 'Wachangiaji' : 'Contributors'}
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">47</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl">
                    <h4 className="font-bold text-purple-800 mb-2">
                      {language === 'sw' ? 'Wanufaika' : 'Beneficiaries'}
                    </h4>
                    <p className="text-2xl font-bold text-purple-600">23</p>
                  </div>
                </div>
              </div>

              {/* Contribution Methods */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'sw' ? 'Njia za Kuchangia' : 'Contribution Methods'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-7 h-7 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {language === 'sw' ? 'Changia Fedha' : 'Contribute Cash'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === 'sw' ? 'Lipa kupitia M-Pesa au benki' : 'Pay via M-Pesa or bank transfer'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowDepositModal(true);
                      }}
                      className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-bold"
                    >
                      {language === 'sw' ? 'Changia Fedha' : 'Contribute Cash'}
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Package className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {language === 'sw' ? 'Changia Vitu' : 'Contribute Items'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === 'sw' ? 'Changia chakula, nguo, au vitu vingine' : 'Contribute food, clothes, or other items'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowDepositModal(true);
                        }}
                        className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-bold"
                      >
                        {language === 'sw' ? 'Changia Vitu' : 'Contribute Items'}
                      </button>
                      <button
                        onClick={() => openCamera('deposit')}
                        className="px-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
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

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
      />

      {/* Rewards Modal */}
      <RewardsModal
        isOpen={showRewardsModal}
        onClose={() => setShowRewardsModal(false)}
        userPoints={userPoints}
        onRedeem={handleRedeemReward}
      />

      {/* Camera Modal */}
      <CameraCapture
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
        title={
          cameraContext === 'deposit' ? (language === 'sw' ? 'Piga Picha ya Mchango' : 'Take Contribution Photo') :
          cameraContext === 'health' ? (language === 'sw' ? 'Piga Picha ya Afya' : 'Take Health Photo') :
          (language === 'sw' ? 'Piga Picha ya Usafiri' : 'Take Transport Photo')
        }
        context={
          cameraContext === 'deposit' ? (language === 'sw' ? 'Piga picha ya mchango wako' : 'Capture your contribution') :
          cameraContext === 'health' ? (language === 'sw' ? 'Piga picha ya hali ya afya' : 'Capture health condition') :
          (language === 'sw' ? 'Piga picha ya usafiri' : 'Capture transport')
        }
      />

      {/* ParaBoda-AI Modal */}
      <BSenseAI
        isOpen={showParabodaAI}
        onClose={() => setShowParabodaAI(false)}
        userRole="community"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};