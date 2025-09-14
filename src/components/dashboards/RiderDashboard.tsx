import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../common/Header';
import { StatsCard } from '../common/StatsCard';
import { Modal } from '../common/Modal';
import { ToastContainer } from '../common/Toast';
import { CameraCapture } from '../common/CameraCapture';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BSenseAI } from '../common/BSenseAI';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
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
  Compass,
  Battery,
  Signal,
  Wifi,
  Volume2,
  Brain,
  Route,
  Car,
  Timer,
  Award,
  Heart,
  Package,
  Fuel,
  Settings,
  Map,
  UserCheck,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh
} from 'lucide-react';

export const RiderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    rideRequests, 
    healthAlerts, 
    mythReports, 
    addRideRequest, 
    addHealthAlert, 
    addMythReport,
    updateRideRequest
  } = useData();
  
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraContext, setCameraContext] = useState<'emergency' | 'myth' | 'report'>('emergency');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showMythModal, setShowMythModal] = useState(false);
  const [showParabodaAI, setShowParabodaAI] = useState(false);
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);
  const [currentLocation, setCurrentLocation] = useState('Kiambu County');
  const [earnings, setEarnings] = useState(2450);
  const [rating, setRating] = useState(4.8);
  const [completedRides, setCompletedRides] = useState(127);
  
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: 'success' | 'warning' | 'error' | 'info' }>>([]);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) {
        setEarnings(prev => prev + Math.floor(Math.random() * 50));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline]);

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const tabs = [
    { id: 'overview', name: t('nav.overview'), icon: Activity, emoji: '📊' },
    { id: 'map', name: t('nav.map') || 'Map', icon: Map, emoji: '🗺️' },
    { id: 'rides', name: t('dashboard.rides'), icon: Route, emoji: '🏍️' },
    { id: 'emergency', name: t('nav.emergency') || 'Emergency', icon: AlertTriangle, emoji: '🚨' },
    { id: 'reports', name: t('nav.reports'), icon: FileText, emoji: '📋' },
    { id: 'myths', name: t('nav.myths'), icon: Shield, emoji: '🛡️' },
    { id: 'earnings', name: 'Earnings', icon: DollarSign, emoji: '💰' }
  ];

  // Mock data for rider
  const pendingRequests = rideRequests.filter(req => req.status === 'pending');
  const activeRides = rideRequests.filter(req => req.status === 'in_progress' && req.riderId === user?.id);
  
  const nearbyRequests = [
    {
      id: '1',
      type: 'emergency',
      patientName: 'Grace Muthoni',
      pickup: 'Kiambu Village',
      destination: 'Kiambu District Hospital',
      distance: '2.3 km',
      urgency: 'high',
      estimatedFare: 800,
      requestTime: '2 min ago'
    },
    {
      id: '2',
      type: 'vaccine',
      patientName: 'Baby Michael',
      pickup: 'Nakuru Town',
      destination: 'Nakuru Health Center',
      distance: '1.8 km',
      urgency: 'medium',
      estimatedFare: 300,
      requestTime: '5 min ago'
    }
  ];

  const riderStats = {
    todayEarnings: 1250,
    todayRides: 8,
    weeklyEarnings: 8750,
    monthlyEarnings: 35200,
    totalDistance: '2,847 km',
    fuelEfficiency: '45 km/l'
  };

  const handleAcceptRide = (requestId: string) => {
    updateRideRequest(requestId, { 
      status: 'accepted', 
      riderId: user?.id 
    });
    
    setCompletedRides(prev => prev + 1);
    showToast(
      t('message.success'),
      language === 'sw' ? 'Safari imekubaliwa' : 'Ride accepted',
      'success'
    );
  };

  const handleCompleteRide = (requestId: string) => {
    updateRideRequest(requestId, { status: 'completed' });
    setEarnings(prev => prev + 500);
    showToast(
      t('message.success'),
      language === 'sw' ? 'Safari imekamilika' : 'Ride completed',
      'success'
    );
  };

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    showToast(
      language === 'sw' ? 'Hali Imebadilika' : 'Status Changed',
      isOnline 
        ? (language === 'sw' ? 'Sasa uko nje ya mtandao' : 'You are now offline')
        : (language === 'sw' ? 'Sasa uko mtandaoni' : 'You are now online'),
      'info'
    );
  };

  const handleEmergencyReport = (data: any) => {
    addHealthAlert({
      type: data.type,
      location: data.location,
      description: data.description,
      priority: data.priority,
      reportedBy: user?.name || 'Rider',
      status: 'new'
    });

    showToast(
      t('message.success'),
      language === 'sw' ? 'Ripoti ya dharura imewasilishwa' : 'Emergency report submitted',
      'success'
    );
    setShowEmergencyModal(false);
  };

  const handleMythReport = (data: any) => {
    addMythReport({
      category: data.category,
      content: data.content,
      location: currentLocation,
      reportedBy: user?.name || 'Rider',
      verified: false,
      debunked: false
    });

    showToast(
      t('message.success'),
      language === 'sw' ? 'Ripoti ya uwongo imewasilishwa' : 'Myth report submitted',
      'success'
    );
    setShowMythModal(false);
  };

  const handleCameraCapture = (imageData: string, file: File) => {
    switch (cameraContext) {
      case 'emergency':
        showToast(
          language === 'sw' ? 'Picha ya Dharura Imehifadhiwa' : 'Emergency Photo Saved',
          language === 'sw' ? 'Picha ya dharura imehifadhiwa na ripoti' : 'Emergency photo saved with report',
          'success'
        );
        break;
      case 'myth':
        showToast(
          language === 'sw' ? 'Picha ya Uwongo Imehifadhiwa' : 'Myth Photo Saved',
          language === 'sw' ? 'Picha ya uwongo imehifadhiwa na ripoti' : 'Myth photo saved with report',
          'success'
        );
        break;
      case 'report':
        showToast(
          language === 'sw' ? 'Picha ya Ripoti Imehifadhiwa' : 'Report Photo Saved',
          language === 'sw' ? 'Picha ya ripoti imehifadhiwa' : 'Report photo saved',
          'success'
        );
        break;
    }
    setShowCameraModal(false);
  };

  const openCamera = (context: 'emergency' | 'myth' | 'report') => {
    setCameraContext(context);
    setShowCameraModal(true);
  };

  return (
    <div className="min-h-screen dashboard-bg-rider">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya ParaBoda' : 'ParaBoda Dashboard'}
        subtitle={language === 'sw' ? `Karibu, ${user?.name}` : `Welcome, ${user?.name}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Online Status Toggle */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-orange-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'sw' ? 'Hali ya Mtandao' : 'Online Status'}
                  </h3>
                  <p className="text-gray-600">
                    {isOnline 
                      ? (language === 'sw' ? 'Uko mtandaoni - unaweza kupokea safari' : 'You are online - ready to receive rides')
                      : (language === 'sw' ? 'Uko nje ya mtandao' : 'You are offline')
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleOnline}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  isOnline 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isOnline 
                  ? (language === 'sw' ? 'Toka Mtandaoni' : 'Go Offline')
                  : (language === 'sw' ? 'Ingia Mtandaoni' : 'Go Online')
                }
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title={language === 'sw' ? 'Mapato ya Leo' : "Today's Earnings"}
            value={`KSh ${riderStats.todayEarnings.toLocaleString()}`}
            change="+12%"
            changeType="positive"
            icon={DollarSign}
            color="green"
            delay={0}
          />
          <StatsCard
            title={language === 'sw' ? 'Safari za Leo' : "Today's Rides"}
            value={riderStats.todayRides}
            change="+3"
            changeType="positive"
            icon={Route}
            color="blue"
            delay={0.1}
          />
          <StatsCard
            title={language === 'sw' ? 'Ukadiriaji' : 'Rating'}
            value={rating.toFixed(1)}
            change="⭐"
            changeType="positive"
            icon={Star}
            color="yellow"
            delay={0.2}
          />
          <StatsCard
            title={language === 'sw' ? 'Safari Zilizokamilika' : 'Completed Rides'}
            value={completedRides}
            change="+5 this week"
            changeType="positive"
            icon={CheckCircle}
            color="purple"
            delay={0.3}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-xl border-4 border-orange-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-orange-100'
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
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-orange-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-orange-500" />
                  <span>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => openCamera('emergency')}
                    className="flex flex-col items-center space-y-3 p-6 bg-red-50 border-2 border-red-200 rounded-xl hover:border-red-300 hover:bg-red-100 transition-all"
                  >
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                    <span className="font-bold text-red-800 text-center">
                      {language === 'sw' ? 'Ripoti Dharura' : 'Report Emergency'}
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
                    onClick={() => setActiveTab('map')}
                    className="flex flex-col items-center space-y-3 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-100 transition-all"
                  >
                    <Map className="w-8 h-8 text-blue-600" />
                    <span className="font-bold text-blue-800 text-center">
                      {language === 'sw' ? 'Ona Ramani' : 'View Map'}
                    </span>
                  </button>

                  <button
                    onClick={() => openCamera('report')}
                    className="flex flex-col items-center space-y-3 p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:border-green-300 hover:bg-green-100 transition-all"
                  >
                    <Camera className="w-8 h-8 text-green-600" />
                    <span className="font-bold text-green-800 text-center">
                      {language === 'sw' ? 'Piga Picha' : 'Take Photo'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Nearby Requests */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-orange-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-orange-500" />
                  <span>{language === 'sw' ? 'Maombi ya Karibu' : 'Nearby Requests'}</span>
                </h3>
                <div className="space-y-4">
                  {nearbyRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            request.urgency === 'high' ? 'bg-red-500' :
                            request.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <span className="font-bold text-gray-900">{request.patientName}</span>
                          <span className="text-sm text-gray-500">{request.requestTime}</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">KSh {request.estimatedFare}</span>
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
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Umbali' : 'Distance'}</p>
                          <p className="font-medium">{request.distance}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAcceptRide(request.id)}
                          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-bold"
                        >
                          {language === 'sw' ? 'Kubali Safari' : 'Accept Ride'}
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          {language === 'sw' ? 'Ona Zaidi' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Map Tab */}
          {activeTab === 'map' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Map className="w-6 h-6 text-orange-500" />
                <span>{language === 'sw' ? 'Ramani ya Safari' : 'Ride Map'}</span>
              </h3>
              <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-bold">
                    {language === 'sw' ? 'Ramani Inapakia...' : 'Map Loading...'}
                  </p>
                  <p className="text-gray-500 mt-2">
                    {language === 'sw' ? 'Mahali pako pa sasa: ' : 'Current location: '}{currentLocation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-red-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <span>{language === 'sw' ? 'Ripoti za Dharura' : 'Emergency Reports'}</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <button
                    onClick={() => openCamera('emergency')}
                    className="flex items-center space-x-4 p-6 bg-red-50 border-2 border-red-200 rounded-xl hover:border-red-300 hover:bg-red-100 transition-all"
                  >
                    <Camera className="w-8 h-8 text-red-600" />
                    <div className="text-left">
                      <h4 className="font-bold text-red-800">
                        {language === 'sw' ? 'Piga Picha ya Dharura' : 'Take Emergency Photo'}
                      </h4>
                      <p className="text-red-600 text-sm">
                        {language === 'sw' ? 'Piga picha ya hali ya dharura' : 'Capture emergency situation'}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowEmergencyModal(true)}
                    className="flex items-center space-x-4 p-6 bg-orange-50 border-2 border-orange-200 rounded-xl hover:border-orange-300 hover:bg-orange-100 transition-all"
                  >
                    <FileText className="w-8 h-8 text-orange-600" />
                    <div className="text-left">
                      <h4 className="font-bold text-orange-800">
                        {language === 'sw' ? 'Andika Ripoti' : 'Write Report'}
                      </h4>
                      <p className="text-orange-600 text-sm">
                        {language === 'sw' ? 'Andika ripoti ya dharura' : 'Write emergency report'}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Recent Emergency Reports */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">
                    {language === 'sw' ? 'Ripoti za Hivi Karibuni' : 'Recent Reports'}
                  </h4>
                  <div className="space-y-3">
                    {healthAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{alert.type.replace('_', ' ')}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{alert.description}</p>
                        <p className="text-gray-500 text-xs mt-2">{alert.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Myths Tab */}
          {activeTab === 'myths' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-500" />
                <span>{language === 'sw' ? 'Ripoti za Uwongo' : 'Myth Reports'}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <button
                  onClick={() => openCamera('myth')}
                  className="flex items-center space-x-4 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl hover:border-purple-300 hover:bg-purple-100 transition-all"
                >
                  <Camera className="w-8 h-8 text-purple-600" />
                  <div className="text-left">
                    <h4 className="font-bold text-purple-800">
                      {language === 'sw' ? 'Piga Picha ya Uwongo' : 'Take Myth Photo'}
                    </h4>
                    <p className="text-purple-600 text-sm">
                      {language === 'sw' ? 'Piga picha ya uwongo wa kiafya' : 'Capture health misinformation'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setShowMythModal(true)}
                  className="flex items-center space-x-4 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-100 transition-all"
                >
                  <FileText className="w-8 h-8 text-indigo-600" />
                  <div className="text-left">
                    <h4 className="font-bold text-indigo-800">
                      {language === 'sw' ? 'Andika Ripoti ya Uwongo' : 'Write Myth Report'}
                    </h4>
                    <p className="text-indigo-600 text-sm">
                      {language === 'sw' ? 'Andika kuhusu uwongo wa kiafya' : 'Report health misinformation'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Recent Myth Reports */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">
                  {language === 'sw' ? 'Ripoti za Uwongo za Hivi Karibuni' : 'Recent Myth Reports'}
                </h4>
                <div className="space-y-3">
                  {mythReports.slice(0, 3).map((myth) => (
                    <div key={myth.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{myth.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          myth.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {myth.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{myth.content}</p>
                      <p className="text-gray-500 text-xs mt-2">{myth.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-green-200">
                  <h4 className="font-bold text-gray-900 mb-2">
                    {language === 'sw' ? 'Mapato ya Wiki' : 'Weekly Earnings'}
                  </h4>
                  <p className="text-3xl font-bold text-green-600">KSh {riderStats.weeklyEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-2">
                    {language === 'sw' ? 'Mapato ya Mwezi' : 'Monthly Earnings'}
                  </h4>
                  <p className="text-3xl font-bold text-blue-600">KSh {riderStats.monthlyEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-2">
                    {language === 'sw' ? 'Umbali wa Jumla' : 'Total Distance'}
                  </h4>
                  <p className="text-3xl font-bold text-purple-600">{riderStats.totalDistance}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Camera Modal */}
      <CameraCapture
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
        title={
          cameraContext === 'emergency' ? (language === 'sw' ? 'Piga Picha ya Dharura' : 'Take Emergency Photo') :
          cameraContext === 'myth' ? (language === 'sw' ? 'Piga Picha ya Uwongo' : 'Take Myth Photo') :
          (language === 'sw' ? 'Piga Picha ya Ripoti' : 'Take Report Photo')
        }
        context={
          cameraContext === 'emergency' ? (language === 'sw' ? 'Piga picha ya hali ya dharura' : 'Capture emergency situation') :
          cameraContext === 'myth' ? (language === 'sw' ? 'Piga picha ya uwongo wa kiafya' : 'Capture health misinformation') :
          (language === 'sw' ? 'Piga picha ya ripoti' : 'Capture report evidence')
        }
      />

      {/* ParaBoda-AI Modal */}
      <BSenseAI
        isOpen={showParabodaAI}
        onClose={() => setShowParabodaAI(false)}
        userRole="rider"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};