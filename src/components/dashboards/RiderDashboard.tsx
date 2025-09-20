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
  Bike, 
  MapPin, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Phone,
  Star,
  Award,
  Activity,
  TrendingUp,
  Users,
  Car,
  Route,
  Fuel,
  Shield,
  Target,
  Zap,
  Eye,
  Plus,
  Bell,
  Settings,
  BarChart3,
  Calendar,
  Wallet,
  Heart,
  Stethoscope,
  Baby
} from 'lucide-react';

interface RideRequest {
  id: string;
  patientName: string;
  pickup: string;
  destination: string;
  distance: number;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  cost: number;
  requestedAt: Date;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  notes?: string;
}

export const RiderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification } = useData();
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [earnings, setEarnings] = useState({
    today: 2500,
    thisWeek: 15600,
    thisMonth: 45200,
    total: 156800
  });

  // Initialize mock data
  useEffect(() => {
    setRideRequests([
      {
        id: 'req_001',
        patientName: 'Grace Wanjiku',
        pickup: 'Kiambu Village',
        destination: 'Kiambu District Hospital',
        distance: 8,
        urgency: 'emergency',
        cost: 800,
        requestedAt: new Date(Date.now() - 5 * 60 * 1000),
        status: 'pending',
        notes: 'Pregnant woman in labor - urgent'
      },
      {
        id: 'req_002',
        patientName: 'Baby Michael',
        pickup: 'Nakuru Town',
        destination: 'Nakuru Health Center',
        distance: 5,
        urgency: 'medium',
        cost: 500,
        requestedAt: new Date(Date.now() - 15 * 60 * 1000),
        status: 'pending',
        notes: 'Vaccination appointment'
      },
      {
        id: 'req_003',
        patientName: 'John Mwangi',
        pickup: 'Meru Central',
        destination: 'Meru General Hospital',
        distance: 12,
        urgency: 'high',
        cost: 1000,
        requestedAt: new Date(Date.now() - 30 * 60 * 1000),
        status: 'pending',
        notes: 'Chest pain, needs immediate attention'
      }
    ]);

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Location access denied:', error);
          // Default to Nairobi coordinates
          setCurrentLocation({ lat: -1.2921, lng: 36.8219 });
        }
      );
    }
  }, []);

  const handleAcceptRide = (requestId: string) => {
    const request = rideRequests.find(r => r.id === requestId);
    if (request) {
      setActiveRide(request);
      setRideRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'accepted' } : r
      ));
      
      addNotification({
        title: language === 'sw' ? 'Safari Imekubaliwa' : 'Ride Accepted',
        message: language === 'sw' 
          ? `Umekubali safari ya ${request.patientName}`
          : `You accepted ride for ${request.patientName}`,
        type: 'success',
        read: false
      });
    }
  };

  const handleStartRide = () => {
    if (activeRide) {
      setActiveRide(prev => prev ? { ...prev, status: 'in_progress' } : null);
      addNotification({
        title: language === 'sw' ? 'Safari Imeanza' : 'Ride Started',
        message: language === 'sw' ? 'Safari imeanza' : 'Ride is now in progress',
        type: 'info',
        read: false
      });
    }
  };

  const handleCompleteRide = () => {
    if (activeRide) {
      setEarnings(prev => ({
        ...prev,
        today: prev.today + activeRide.cost,
        thisWeek: prev.thisWeek + activeRide.cost,
        thisMonth: prev.thisMonth + activeRide.cost,
        total: prev.total + activeRide.cost
      }));

      addNotification({
        title: language === 'sw' ? 'Safari Imekamilika' : 'Ride Completed',
        message: language === 'sw' 
          ? `Umepokea ${formatAmount(activeRide.cost)}`
          : `You earned ${formatAmount(activeRide.cost)}`,
        type: 'success',
        read: false
      });

      setActiveRide(null);
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    addNotification({
      title: language === 'sw' ? 'Hali Imebadilika' : 'Status Changed',
      message: language === 'sw' 
        ? `Sasa uko ${!isOnline ? 'mtandaoni' : 'nje ya mtandao'}`
        : `You are now ${!isOnline ? 'online' : 'offline'}`,
      type: 'info',
      read: false
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '🚨';
      case 'high': return '⚡';
      case 'medium': return '⏰';
      default: return '✅';
    }
  };

  return (
    <div className="min-h-screen dashboard-bg-rider">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya ParaBoda' : 'ParaBoda Dashboard'}
        subtitle={language === 'sw' ? 'Huduma za usafiri' : 'Transport services'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-orange-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-6xl">🏍️</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  {language === 'sw' ? '🏍️ Dashibodi ya ParaBoda' : '🏍️ ParaBoda Dashboard'}
                </h1>
                <p className="text-lg text-orange-600 font-bold">
                  {language === 'sw' ? 'Huduma za Usafiri wa Afya' : 'Health Transport Services'}
                </p>
              </div>
            </div>
            <div className="bg-orange-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-orange-800 font-semibold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </p>
              <p className="text-xs text-orange-700">
                {user?.location} • {language === 'sw' ? 'Msafiri ID' : 'Rider ID'}: {user?.id?.slice(-6)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Online Status Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xl font-bold text-gray-900">
                  {language === 'sw' ? 'Hali ya Mtandao' : 'Online Status'}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isOnline ? (language === 'sw' ? 'MTANDAONI' : 'ONLINE') : (language === 'sw' ? 'INJE YA MTANDAO' : 'OFFLINE')}
                </span>
              </div>
              <button
                onClick={toggleOnlineStatus}
                className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                  isOnline 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isOnline ? (language === 'sw' ? 'Toka Mtandaoni' : 'Go Offline') : (language === 'sw' ? 'Ingia Mtandaoni' : 'Go Online')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Earnings Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-orange-500" />
            <span>{language === 'sw' ? 'Mapato Yako' : 'Your Earnings'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title={language === 'sw' ? 'Leo' : 'Today'}
              value={formatAmount(earnings.today)}
              change="+15% from yesterday"
              changeType="positive"
              icon={DollarSign}
              color="green"
            />
            <StatsCard
              title={language === 'sw' ? 'Wiki Hii' : 'This Week'}
              value={formatAmount(earnings.thisWeek)}
              change="+8% from last week"
              changeType="positive"
              icon={TrendingUp}
              color="blue"
            />
            <StatsCard
              title={language === 'sw' ? 'Mwezi Huu' : 'This Month'}
              value={formatAmount(earnings.thisMonth)}
              change="+12% from last month"
              changeType="positive"
              icon={BarChart3}
              color="purple"
            />
            <StatsCard
              title={language === 'sw' ? 'Jumla' : 'Total'}
              value={formatAmount(earnings.total)}
              change="All time earnings"
              changeType="neutral"
              icon={Award}
              color="orange"
            />
          </div>
        </motion.div>

        {/* Active Ride */}
        {activeRide && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold flex items-center space-x-3">
                  <Car className="w-8 h-8" />
                  <span>{language === 'sw' ? 'Safari Hai' : 'Active Ride'}</span>
                </h3>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  activeRide.status === 'accepted' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {activeRide.status === 'accepted' ? (language === 'sw' ? 'IMEKUBALIWA' : 'ACCEPTED') : (language === 'sw' ? 'INAENDELEA' : 'IN PROGRESS')}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-xl mb-2">{activeRide.patientName}</h4>
                  <div className="space-y-2 text-blue-100">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>{activeRide.pickup}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5" />
                      <span>{activeRide.destination}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Route className="w-5 h-5" />
                      <span>{activeRide.distance} km</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-black mb-2">{formatAmount(activeRide.cost)}</div>
                  <div className="text-blue-100 mb-4">{language === 'sw' ? 'Malipo' : 'Payment'}</div>
                  
                  {activeRide.status === 'accepted' ? (
                    <button
                      onClick={handleStartRide}
                      className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105"
                    >
                      {language === 'sw' ? 'Anza Safari' : 'Start Ride'}
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteRide}
                      className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-600 transition-all transform hover:scale-105"
                    >
                      {language === 'sw' ? 'Maliza Safari' : 'Complete Ride'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ride Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Bell className="w-8 h-8 text-orange-500" />
            <span>{language === 'sw' ? 'Maombi ya Usafiri' : 'Transport Requests'}</span>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {rideRequests.filter(r => r.status === 'pending').length}
            </span>
          </h2>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-4 border-gray-200">
            {isOnline ? (
              <div className="p-6">
                {rideRequests.filter(r => r.status === 'pending').length > 0 ? (
                  <div className="space-y-4">
                    {rideRequests.filter(r => r.status === 'pending').map((request) => (
                      <div key={request.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-orange-300 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{request.patientName}</h3>
                              <span className="text-2xl">{getUrgencyIcon(request.urgency)}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(request.urgency)}`}>
                                {request.urgency === 'emergency' ? (language === 'sw' ? 'DHARURA' : 'EMERGENCY') :
                                 request.urgency === 'high' ? (language === 'sw' ? 'JUU' : 'HIGH') :
                                 request.urgency === 'medium' ? (language === 'sw' ? 'WASTANI' : 'MEDIUM') :
                                 (language === 'sw' ? 'CHINI' : 'LOW')}
                              </span>
                            </div>
                            <div className="space-y-2 text-gray-600">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                <span><strong>{language === 'sw' ? 'Kutoka' : 'From'}:</strong> {request.pickup}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Navigation className="w-4 h-4 text-orange-500" />
                                <span><strong>{language === 'sw' ? 'Kwenda' : 'To'}:</strong> {request.destination}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Route className="w-4 h-4 text-orange-500" />
                                <span><strong>{language === 'sw' ? 'Umbali' : 'Distance'}:</strong> {request.distance} km</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span><strong>{language === 'sw' ? 'Imeombwa' : 'Requested'}:</strong> {request.requestedAt.toLocaleTimeString()}</span>
                              </div>
                              {request.notes && (
                                <div className="flex items-start space-x-2">
                                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                                  <span><strong>{language === 'sw' ? 'Maelezo' : 'Notes'}:</strong> {request.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right ml-6">
                            <div className="text-2xl font-black text-green-600 mb-2">
                              {formatAmount(request.cost)}
                            </div>
                            <button
                              onClick={() => handleAcceptRide(request.id)}
                              disabled={!!activeRide}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {language === 'sw' ? 'Kubali Safari' : 'Accept Ride'}
                            </button>
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
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">😴</div>
                <h3 className="text-2xl font-bold text-gray-500 mb-2">
                  {language === 'sw' ? 'Uko Nje ya Mtandao' : 'You are Offline'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {language === 'sw' ? 'Ingia mtandaoni kupokea maombi ya usafiri' : 'Go online to receive transport requests'}
                </p>
                <button
                  onClick={toggleOnlineStatus}
                  className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-600 transition-all transform hover:scale-105"
                >
                  {language === 'sw' ? 'Ingia Mtandaoni' : 'Go Online'}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <button
            onClick={() => setActiveModal('emergencyReport')}
            className="min-h-[120px] bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🚨</div>
            <AlertTriangle className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'RIPOTI DHARURA' : 'REPORT EMERGENCY'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Ripoti hali ya dharura' : 'Report emergency situation'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('earnings')}
            className="min-h-[120px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">💰</div>
            <BarChart3 className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'MAPATO' : 'EARNINGS'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Ona mapato yako' : 'View your earnings'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('rideHistory')}
            className="min-h-[120px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">📋</div>
            <Activity className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'HISTORIA' : 'HISTORY'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Safari zilizopita' : 'Past rides'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('profile')}
            className="min-h-[120px] bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">👤</div>
            <Settings className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'PROFAILI' : 'PROFILE'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Mipangilio yako' : 'Your settings'}
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Emergency Report Modal */}
      <EmergencyReportModal
        isOpen={activeModal === 'emergencyReport'}
        onClose={() => setActiveModal(null)}
        onSubmit={(data) => {
          addNotification({
            title: language === 'sw' ? 'Ripoti ya Dharura Imewasilishwa' : 'Emergency Report Submitted',
            message: language === 'sw' ? 'Ripoti yako imewasilishwa kwa mamlaka' : 'Your report has been submitted to authorities',
            type: 'warning',
            read: false
          });
          setActiveModal(null);
        }}
        emergencyType="medical"
      />

      {/* Other Modals */}
      {activeModal === 'earnings' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '💰 Mapato Yako' : '💰 Your Earnings'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatAmount(earnings.today)}
                </div>
                <p className="text-green-800 font-medium">{language === 'sw' ? 'Mapato ya Leo' : 'Today\'s Earnings'}</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatAmount(earnings.thisWeek)}
                </div>
                <p className="text-blue-800 font-medium">{language === 'sw' ? 'Wiki Hii' : 'This Week'}</p>
              </div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-2xl">
              <h3 className="font-bold text-orange-900 mb-4">{language === 'sw' ? 'Takwimu za Mapato' : 'Earnings Statistics'}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Safari za leo' : 'Rides today'}:</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Wastani wa malipo' : 'Average payment'}:</span>
                  <span className="font-bold">{formatAmount(earnings.today / 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Alama za ukarimu' : 'Rating'}:</span>
                  <span className="font-bold flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>4.8/5</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'rideHistory' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '📋 Historia ya Safari' : '📋 Ride History'}
          size="lg"
        >
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">156</div>
              <p className="text-gray-600">{language === 'sw' ? 'Safari Zilizokamilika' : 'Completed Rides'}</p>
            </div>
            
            <div className="space-y-3">
              {[
                { patient: 'Mary Akinyi', date: 'Today', amount: 600, rating: 5 },
                { patient: 'John Mwangi', date: 'Yesterday', amount: 800, rating: 4 },
                { patient: 'Grace Wanjiku', date: '2 days ago', amount: 450, rating: 5 }
              ].map((ride, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">{ride.patient}</h4>
                      <p className="text-sm text-gray-600">{ride.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{formatAmount(ride.amount)}</div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < ride.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'profile' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '👤 Profaili Yako' : '👤 Your Profile'}
          size="md"
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
              <p className="text-orange-600 font-medium">{language === 'sw' ? 'Msafiri wa ParaBoda' : 'ParaBoda Rider'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{language === 'sw' ? 'Simu' : 'Phone'}</span>
                </div>
                <p className="text-gray-900">{user?.phone || '+254 7XX XXX XXX'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{language === 'sw' ? 'Mahali' : 'Location'}</span>
                </div>
                <p className="text-gray-900">{user?.location || 'Nairobi, Kenya'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{language === 'sw' ? 'Ukarimu' : 'Rating'}</span>
                </div>
                <p className="text-gray-900">4.8/5 ⭐⭐⭐⭐⭐</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{language === 'sw' ? 'Pointi' : 'Points'}</span>
                </div>
                <p className="text-gray-900">{user?.points || 320}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};