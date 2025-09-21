import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { EmergencyReportModal } from '../common/EmergencyReportModal';
import { BSenseAI } from '../common/BSenseAI';
import { QRScanner } from '../common/QRScanner';
import { GPSLocationDisplay } from '../common/GPSLocationDisplay';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { CreditProfileCard } from '../wallet/CreditProfileCard';
import { CreditCoachChat } from '../wallet/CreditCoachChat';
import { MedicalLoanOptions, LoanApplicationForm, LoanPaymentForm } from '../wallet/loans';
import { AddSavingsForm } from '../wallet/AddSavingsForm';
import { RewardsModal } from '../common/RewardsModal';
import { Modal } from '../common/Modal';
import { riderService, TransportRequest, RiderStats, SafetyAlert } from '../../services/riderService';
import { 
  AlertTriangle, 
  MapPin, 
  DollarSign, 
  Brain, 
  QrCode,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Bike,
  Navigation,
  Wallet,
  PiggyBank,
  CreditCard,
  FileText,
  Award,
  Eye,
  Target,
  X,
  Clock,
  Users,
  Activity,
  BarChart3,
  Settings,
  Phone,
  Car,
  Shield,
  Zap,
  Bell,
  Volume2,
  VolumeX,
  Vibrate,
  Route,
  Fuel,
  Wrench,
  Heart,
  Baby,
  Stethoscope,
  Home,
  ArrowRight,
  Play,
  Pause,
  Square,
  RotateCcw,
  Send,
  MessageSquare,
  Camera,
  Map,
  Compass,
  Timer,
  TrendingDown,
  Plus,
  Minus,
  Download,
  Upload,
  Loader
} from 'lucide-react';

export const RiderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification, communityFunds } = useData();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [emergencyType, setEmergencyType] = useState<'medical' | 'accident' | 'outbreak' | 'weather'>('medical');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [showCreditCoach, setShowCreditCoach] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  
  // Rider-specific data
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>([]);
  const [riderStats, setRiderStats] = useState<RiderStats>({
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    totalRides: 0,
    completedRides: 0,
    rating: 0,
    totalDistance: 0,
    emergencyRides: 0,
    onTimePercentage: 0
  });
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [riderAvailability, setRiderAvailability] = useState<'available' | 'busy' | 'offline'>('available');
  
  // User points for rewards
  const userPoints = user?.points || 320;

  // Enhanced wallet data for riders
  const walletData = {
    balance: Math.floor(communityFunds * 0.15),
    savings: Math.floor(communityFunds * 0.12),
    creditScore: Math.min(850, 350 + (userPoints * 1.5)),
    eligibilityStatus: user?.level === 'Gold' ? 'approved' : user?.level === 'Silver' ? 'approved' : 'pending',
    loanReadiness: Math.min(100, 60 + userPoints / 8),
    trustLevel: user?.level === 'Platinum' ? 'platinum' : user?.level === 'Gold' ? 'gold' : 'silver'
  };

  // Load rider data
  useEffect(() => {
    if (!user) return;

    const loadRiderData = async () => {
      setIsLoadingRequests(true);
      
      try {
        // Load transport requests
        const requests = await riderService.getAvailableRequests(user.id);
        setTransportRequests(requests);

        // Load rider statistics
        const stats = await riderService.getRiderStats(user.id);
        setRiderStats(stats);

        // Load safety alerts
        const alerts = await riderService.getSafetyAlerts(user.location || '');
        setSafetyAlerts(alerts);

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
            }
          );
        }

      } catch (error) {
        console.error('Error loading rider data:', error);
        addNotification({
          title: language === 'sw' ? 'Hitilafu' : 'Error',
          message: language === 'sw' ? 'Imeshindwa kupakia data ya msafiri' : 'Failed to load rider data',
          type: 'error',
          read: false
        });
      } finally {
        setIsLoadingRequests(false);
      }
    };

    loadRiderData();

    // Set up real-time updates
    const interval = setInterval(loadRiderData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [user, language, addNotification]);

  // Emergency alert system
  useEffect(() => {
    const emergencyRequests = transportRequests.filter(r => r.urgency === 'emergency');
    
    if (emergencyRequests.length > 0 && riderAvailability === 'available') {
      // Trigger emergency alert
      triggerEmergencyAlert(emergencyRequests[0]);
    }
  }, [transportRequests, riderAvailability]);

  const triggerEmergencyAlert = (request: TransportRequest) => {
    // Sound alert
    if (soundEnabled) {
      const audio = new Audio('/emergency-alert.mp3');
      audio.play().catch(console.error);
    }

    // Vibration alert
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Show emergency modal
    setSelectedRequest(request);
    setActiveModal('emergencyRequest');
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await riderService.acceptRequest(requestId, user!.id);
      
      // Update local state
      setTransportRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'accepted', riderId: user!.id, riderName: user!.name }
            : req
        )
      );

      addNotification({
        title: language === 'sw' ? 'Ombi Limekubaliwa' : 'Request Accepted',
        message: language === 'sw' ? 'Umeanza safari' : 'You have started the ride',
        type: 'success',
        read: false
      });

      setActiveModal(null);
    } catch (error) {
      console.error('Error accepting request:', error);
      addNotification({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        message: language === 'sw' ? 'Imeshindwa kukubali ombi' : 'Failed to accept request',
        type: 'error',
        read: false
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await riderService.rejectRequest(requestId, user!.id);
      
      // Remove from local state
      setTransportRequests(prev => prev.filter(req => req.id !== requestId));

      addNotification({
        title: language === 'sw' ? 'Ombi Limekataliwa' : 'Request Rejected',
        message: language === 'sw' ? 'Ombi limekataliwa' : 'Request has been rejected',
        type: 'info',
        read: false
      });

      setActiveModal(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleCompleteRide = async (requestId: string) => {
    try {
      const completedRide = await riderService.completeRide(requestId, user!.id);
      
      // Update local state
      setTransportRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'completed', completedAt: new Date() }
            : req
        )
      );

      // Update earnings
      setRiderStats(prev => ({
        ...prev,
        todayEarnings: prev.todayEarnings + completedRide.actualCost,
        completedRides: prev.completedRides + 1
      }));

      addNotification({
        title: language === 'sw' ? 'Safari Imekamilika' : 'Ride Completed',
        message: language === 'sw' 
          ? `Umepokea ${formatAmount(completedRide.actualCost)}`
          : `You earned ${formatAmount(completedRide.actualCost)}`,
        type: 'success',
        read: false
      });

      setActiveModal(null);
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  };

  const handleEmergencySubmit = (reportData: any) => {
    addNotification({
      title: language === 'sw' ? 'Ripoti ya Dharura Imewasilishwa' : 'Emergency Report Submitted',
      message: language === 'sw' ? 'Ripoti yako imewasilishwa kwa msimamizi' : 'Your report has been submitted to admin',
      type: 'warning',
      read: false
    });
    setActiveModal(null);
  };

  const handleServiceRequest = (serviceData: any) => {
    addNotification({
      title: language === 'sw' ? 'Ombi la Huduma Limewasilishwa' : 'Service Request Submitted',
      message: language === 'sw' ? 'Ombi lako limewasilishwa' : 'Your request has been submitted',
      type: 'success',
      read: false
    });
    setActiveModal(null);
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedLoanType('');
    setShowCreditCoach(false);
    setSelectedRequest(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
  };

  const handleLoanApplication = (loanType: string) => {
    setSelectedLoanType(loanType);
    setActiveModal('loanApplication');
  };

  const handleRewardsRedeem = (item: any) => {
    addNotification({
      title: language === 'sw' ? 'Zawadi Imechukuliwa' : 'Reward Redeemed',
      message: language === 'sw' 
        ? `Umechukua ${item.nameSwahili || item.name}`
        : `You redeemed ${item.name}`,
      type: 'success',
      read: false
    });
    setActiveModal(null);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'border-red-500 bg-red-50 animate-pulse';
      case 'semi_urgent': return 'border-yellow-500 bg-yellow-50';
      case 'normal': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '🔴';
      case 'semi_urgent': return '🟡';
      case 'normal': return '🟢';
      default: return '⚪';
    }
  };

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'anc': return <Heart className="w-5 h-5 text-pink-600" />;
      case 'vaccination': return <Baby className="w-5 h-5 text-blue-600" />;
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'consultation': return <Stethoscope className="w-5 h-5 text-green-600" />;
      default: return <Car className="w-5 h-5 text-gray-600" />;
    }
  };

  const toggleAvailability = () => {
    const newStatus = riderAvailability === 'available' ? 'offline' : 'available';
    setRiderAvailability(newStatus);
    
    addNotification({
      title: language === 'sw' ? 'Hali Imebadilika' : 'Status Changed',
      message: language === 'sw' 
        ? `Sasa uko ${newStatus === 'available' ? 'mtandaoni' : 'nje ya mtandao'}`
        : `You are now ${newStatus}`,
      type: 'info',
      read: false
    });
  };

  return (
    <div className="min-h-screen dashboard-bg-rider">
      <Header 
        title={language === 'sw' ? 'ParaBoda' : 'ParaBoda Rider'}
        subtitle={language === 'sw' ? 'Msafiri wa afya' : 'Health transport rider'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Header with Earnings */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-6xl">🏍️</div>
                <div>
                  <h1 className="text-4xl font-black text-gray-900">
                    {language === 'sw' ? '🏍️ Dashibodi ya ParaBoda' : '🏍️ ParaBoda Rider Dashboard'}
                  </h1>
                  <p className="text-lg text-orange-600 font-bold">
                    {language === 'sw' ? 'Usafiri wa Afya na Dharura' : 'Health and Emergency Transport'}
                  </p>
                </div>
              </div>
              
              {/* Availability Toggle */}
              <div className="text-right">
                <button
                  onClick={toggleAvailability}
                  className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
                    riderAvailability === 'available' 
                      ? 'bg-green-500 text-white animate-pulse'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {riderAvailability === 'available' 
                    ? (language === 'sw' ? '🟢 MTANDAONI' : '🟢 ONLINE')
                    : (language === 'sw' ? '🔴 INJE YA MTANDAO' : '🔴 OFFLINE')
                  }
                </button>
              </div>
            </div>
            
            {/* Today's Earnings Display */}
            <div className="bg-orange-100 rounded-2xl p-4 inline-block">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-orange-800 font-semibold">
                    {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
                  </p>
                  <p className="text-xs text-orange-700">
                    {language === 'sw' ? 'Mapato ya leo: ' : 'Today\'s earnings: '}{formatAmount(riderStats.todayEarnings)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{riderStats.completedRides}</div>
                  <div className="text-xs text-orange-700">{language === 'sw' ? 'Safari' : 'Rides'}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Alert Banner */}
        {transportRequests.filter(r => r.urgency === 'emergency').length > 0 && riderAvailability === 'available' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-600 text-white p-6 rounded-3xl mb-8 text-center animate-pulse shadow-2xl"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black">
                  {language === 'sw' ? '🚨 DHARURA YA USAFIRI' : '🚨 EMERGENCY TRANSPORT'}
                </h2>
                <p className="text-red-100 text-lg">
                  {transportRequests.filter(r => r.urgency === 'emergency').length} {language === 'sw' ? 'maombi ya dharura' : 'emergency requests'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal('emergencyRequests')}
              className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-xl hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg"
            >
              {language === 'sw' ? 'ONA MAOMBI YA DHARURA' : 'VIEW EMERGENCY REQUESTS'}
            </button>
          </motion.div>
        )}

        {/* Safety Alerts */}
        {safetyAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border-4 border-yellow-200 rounded-3xl p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
              <h3 className="text-xl font-bold text-yellow-900">
                {language === 'sw' ? 'Tahadhari za Usalama' : 'Safety Alerts'}
              </h3>
            </div>
            <div className="space-y-3">
              {safetyAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="bg-white p-4 rounded-xl border border-yellow-300">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{alert.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{alert.title}</h4>
                      <p className="text-gray-700 text-sm">{alert.description}</p>
                      <p className="text-yellow-600 text-xs font-medium mt-1">
                        {alert.location} • {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Action Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {/* Emergency Requests */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => setActiveModal('emergencyRequests')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3 animate-pulse relative"
          >
            <div className="text-5xl">🚨</div>
            <AlertTriangle className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'DHARURA' : 'EMERGENCY'}
              </div>
              <div className="text-sm opacity-90">
                {transportRequests.filter(r => r.urgency === 'emergency').length} {language === 'sw' ? 'maombi' : 'requests'}
              </div>
            </div>
            {transportRequests.filter(r => r.urgency === 'emergency').length > 0 && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-red-900 rounded-full flex items-center justify-center text-sm font-bold animate-bounce">
                {transportRequests.filter(r => r.urgency === 'emergency').length}
              </div>
            )}
          </motion.button>

          {/* All Requests */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setActiveModal('allRequests')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">📋</div>
            <Car className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'MAOMBI' : 'REQUESTS'}
              </div>
              <div className="text-sm opacity-90">
                {transportRequests.filter(r => r.status === 'pending').length} {language === 'sw' ? 'yapo' : 'available'}
              </div>
            </div>
          </motion.button>

          {/* Map View */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveModal('mapView')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🗺️</div>
            <Map className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'RAMANI' : 'MAP'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Ona maombi' : 'View requests'}
              </div>
            </div>
          </motion.button>

          {/* Earnings */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setActiveModal('earnings')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">💰</div>
            <DollarSign className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'MAPATO' : 'EARNINGS'}
              </div>
              <div className="text-sm opacity-90">
                {formatAmount(riderStats.todayEarnings)}
              </div>
            </div>
          </motion.button>

          {/* AI Safety Helper */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setActiveModal('safetyHelper')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🛡️</div>
            <Brain className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'USALAMA' : 'SAFETY'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Msaidizi' : 'AI Helper'}
              </div>
            </div>
          </motion.button>

          {/* QR Scanner */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setActiveModal('qrScanner')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">📱</div>
            <QrCode className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'SKANI' : 'SCAN QR'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Thibitisha safari' : 'Verify trip'}
              </div>
            </div>
          </motion.button>
        </div>

        {/* M-SUPU Wallet Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Wallet className="w-8 h-8 text-emerald-600" />
            <span>{language === 'sw' ? 'M-SUPU Pochi ya Msafiri' : 'Rider M-SUPU Wallet'}</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Credit Profile Card */}
            <CreditProfileCard
              creditScore={walletData.creditScore}
              savingsBalance={walletData.savings}
              eligibilityStatus={walletData.eligibilityStatus as any}
              loanReadiness={walletData.loanReadiness}
              trustLevel={walletData.trustLevel as any}
            />

            {/* Quick Wallet Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {/* Withdraw Earnings */}
                <button
                  onClick={() => setActiveModal('withdrawEarnings')}
                  className="w-full p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <Download className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Toa Mapato' : 'Withdraw Earnings'}</div>
                    <div className="text-sm opacity-90">{formatAmount(riderStats.todayEarnings)} {language === 'sw' ? 'yapo' : 'available'}</div>
                  </div>
                </button>

                {/* Add Savings */}
                <button
                  onClick={() => setActiveModal('addSavings')}
                  className="w-full p-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl hover:from-teal-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <PiggyBank className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Akiba za kibinafsi' : 'Personal savings'}</div>
                  </div>
                </button>

                {/* Apply for Equipment Loan */}
                <button
                  onClick={() => setActiveModal('equipmentLoanOptions')}
                  className="w-full p-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-2xl hover:from-orange-700 hover:to-orange-800 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <Wrench className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Mkopo wa Vifaa' : 'Equipment Loan'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Vifaa vya pikipiki' : 'Motorcycle equipment'}</div>
                  </div>
                </button>

                {/* Credit Coach */}
                <button
                  onClick={() => setShowCreditCoach(true)}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <Brain className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Mkocha wa Mkopo' : 'Credit Coach'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Ushauri wa kifedha' : 'Financial advice'}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Rides Status */}
        {transportRequests.filter(r => r.riderId === user?.id && ['accepted', 'in_progress'].includes(r.status)).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-500" />
              <span>{language === 'sw' ? 'Safari za Sasa' : 'Current Rides'}</span>
            </h2>

            <div className="space-y-4">
              {transportRequests
                .filter(r => r.riderId === user?.id && ['accepted', 'in_progress'].includes(r.status))
                .map((request) => (
                  <div key={request.id} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{request.patientName}</h3>
                        <p className="text-gray-600">
                          {language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {request.requestedBy}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{formatAmount(request.estimatedCost)}</div>
                        <div className="text-sm text-gray-600">{request.estimatedDistance} km</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{language === 'sw' ? 'Kuchukua' : 'Pickup'}</div>
                          <div className="text-sm text-gray-600">{request.pickup.address}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Target className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900">{language === 'sw' ? 'Peleka' : 'Drop-off'}</div>
                          <div className="text-sm text-gray-600">{request.destination.address}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      {request.status === 'accepted' && (
                        <button
                          onClick={() => riderService.startRide(request.id)}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-2xl hover:bg-blue-700 transition-all font-bold flex items-center justify-center space-x-2"
                        >
                          <Play className="w-5 h-5" />
                          <span>{language === 'sw' ? 'Anza Safari' : 'Start Ride'}</span>
                        </button>
                      )}
                      {request.status === 'in_progress' && (
                        <button
                          onClick={() => handleCompleteRide(request.id)}
                          className="flex-1 bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 transition-all font-bold flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>{language === 'sw' ? 'Maliza Safari' : 'Complete Ride'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => setActiveModal('navigation')}
                        className="px-6 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-all font-bold flex items-center space-x-2"
                      >
                        <Navigation className="w-5 h-5" />
                        <span>{language === 'sw' ? 'Ongoza' : 'Navigate'}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Emergency Requests Modal */}
      {activeModal === 'emergencyRequests' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🚨 Maombi ya Dharura' : '🚨 Emergency Requests'}
          size="xl"
        >
          <div className="space-y-6">
            {transportRequests.filter(r => r.urgency === 'emergency').length > 0 ? (
              transportRequests
                .filter(r => r.urgency === 'emergency')
                .map((request) => (
                  <div key={request.id} className="bg-red-50 border-4 border-red-200 rounded-2xl p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                          {getServiceTypeIcon(request.serviceType)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-red-900">{request.patientName}</h3>
                          <p className="text-red-700 font-medium">
                            {language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {request.requestedBy}
                          </p>
                          <p className="text-sm text-red-600">
                            {request.householdCode && `${language === 'sw' ? 'Kaya' : 'Household'}: ${request.householdCode}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">{formatAmount(request.estimatedCost)}</div>
                        <div className="text-sm text-red-500">{request.estimatedDistance} km</div>
                        <div className="text-xs text-red-500">{request.estimatedTime} min</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-gray-900">{language === 'sw' ? 'Kuchukua' : 'Pickup'}</span>
                        </div>
                        <p className="text-gray-700">{request.pickup.address}</p>
                        {request.pickup.gpsCoords && (
                          <p className="text-xs text-gray-500">
                            {request.pickup.gpsCoords.lat.toFixed(6)}, {request.pickup.gpsCoords.lng.toFixed(6)}
                          </p>
                        )}
                      </div>
                      <div className="bg-white p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-gray-900">{language === 'sw' ? 'Peleka' : 'Drop-off'}</span>
                        </div>
                        <p className="text-gray-700">{request.destination.address}</p>
                        <p className="text-xs text-gray-500">{request.destination.facilityType}</p>
                      </div>
                    </div>

                    {request.symptoms && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                        <h4 className="font-bold text-yellow-900 mb-2">
                          {language === 'sw' ? 'Dalili/Hali' : 'Symptoms/Condition'}
                        </h4>
                        <p className="text-yellow-800">{request.symptoms}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="min-h-[56px] bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 animate-pulse"
                      >
                        <CheckCircle className="w-6 h-6" />
                        <span>{language === 'sw' ? 'KUBALI DHARURA' : 'ACCEPT EMERGENCY'}</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="min-h-[56px] bg-gray-500 text-white rounded-2xl font-bold text-lg hover:bg-gray-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-6 h-6" />
                        <span>{language === 'sw' ? 'KATAA' : 'DECLINE'}</span>
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏍️</div>
                <h3 className="text-xl font-bold text-gray-500 mb-2">
                  {language === 'sw' ? 'Hakuna Maombi ya Dharura' : 'No Emergency Requests'}
                </h3>
                <p className="text-gray-400">
                  {language === 'sw' ? 'Maombi ya dharura yataonyeshwa hapa' : 'Emergency requests will appear here'}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* All Requests Modal */}
      {activeModal === 'allRequests' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '📋 Maombi Yote ya Usafiri' : '📋 All Transport Requests'}
          size="xl"
        >
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex space-x-2 bg-gray-100 p-2 rounded-xl">
              <button className="flex-1 py-2 px-4 bg-white rounded-lg font-medium text-gray-900 shadow-sm">
                {language === 'sw' ? 'Yote' : 'All'} ({transportRequests.filter(r => r.status === 'pending').length})
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg font-medium text-gray-600">
                {language === 'sw' ? 'ANC' : 'ANC'} ({transportRequests.filter(r => r.serviceType === 'anc').length})
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg font-medium text-gray-600">
                {language === 'sw' ? 'Chanjo' : 'Vaccines'} ({transportRequests.filter(r => r.serviceType === 'vaccination').length})
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transportRequests.filter(r => r.status === 'pending').map((request) => (
                <div key={request.id} className={`p-6 rounded-2xl border-4 transition-all ${getUrgencyColor(request.urgency)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        {getServiceTypeIcon(request.serviceType)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{request.patientName}</h3>
                        <p className="text-gray-600">
                          {language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {request.requestedBy}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-2xl">{getUrgencyIcon(request.urgency)}</span>
                          <span className="text-sm font-medium">
                            {request.urgency === 'emergency' ? (language === 'sw' ? 'DHARURA' : 'EMERGENCY') :
                             request.urgency === 'semi_urgent' ? (language === 'sw' ? 'HARAKA' : 'URGENT') :
                             (language === 'sw' ? 'KAWAIDA' : 'NORMAL')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{formatAmount(request.estimatedCost)}</div>
                      <div className="text-sm text-gray-600">{request.estimatedDistance} km</div>
                      <div className="text-xs text-gray-500">{request.estimatedTime} min</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{language === 'sw' ? 'Kuchukua' : 'Pickup'}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{request.pickup.address}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">{language === 'sw' ? 'Peleka' : 'Drop-off'}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{request.destination.address}</p>
                    </div>
                  </div>

                  {request.symptoms && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                      <h4 className="font-medium text-blue-900 mb-1">
                        {language === 'sw' ? 'Maelezo' : 'Details'}
                      </h4>
                      <p className="text-blue-800 text-sm">{request.symptoms}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className={`min-h-[56px] text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                        request.urgency === 'emergency' 
                          ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      <CheckCircle className="w-6 h-6" />
                      <span>{language === 'sw' ? 'KUBALI' : 'ACCEPT'}</span>
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="min-h-[56px] bg-gray-500 text-white rounded-2xl font-bold text-lg hover:bg-gray-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-6 h-6" />
                      <span>{language === 'sw' ? 'KATAA' : 'DECLINE'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Map View Modal */}
      {activeModal === 'mapView' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🗺️ Ramani ya Maombi' : '🗺️ Requests Map'}
          size="xl"
        >
          <div className="space-y-6">
            <GPSLocationDisplay
              onLocationUpdate={setCurrentLocation}
              showAccuracy={true}
              autoUpdate={true}
            />
            
            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="font-bold text-blue-900 mb-3">
                {language === 'sw' ? 'Maombi ya Karibu' : 'Nearby Requests'}
              </h3>
              <div className="space-y-3">
                {transportRequests.filter(r => r.status === 'pending').slice(0, 3).map((request) => (
                  <div key={request.id} className="bg-white p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{request.patientName}</h4>
                        <p className="text-sm text-gray-600">{request.pickup.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatAmount(request.estimatedCost)}</div>
                        <div className="text-xs text-gray-500">{request.estimatedDistance} km</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Earnings Modal */}
      {activeModal === 'earnings' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '💰 Mapato Yako' : '💰 Your Earnings'}
          size="lg"
        >
          <div className="space-y-6">
            {/* Earnings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {formatAmount(riderStats.todayEarnings)}
                </div>
                <p className="text-green-800 font-medium">
                  {language === 'sw' ? 'Leo' : 'Today'}
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {formatAmount(riderStats.weeklyEarnings)}
                </div>
                <p className="text-blue-800 font-medium">
                  {language === 'sw' ? 'Wiki hii' : 'This Week'}
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {formatAmount(riderStats.monthlyEarnings)}
                </div>
                <p className="text-purple-800 font-medium">
                  {language === 'sw' ? 'Mwezi huu' : 'This Month'}
                </p>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{riderStats.totalRides}</div>
                <p className="text-gray-600 text-sm">{language === 'sw' ? 'Jumla ya Safari' : 'Total Rides'}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl font-bold text-yellow-600">{riderStats.rating}/5</div>
                <p className="text-gray-600 text-sm">{language === 'sw' ? 'Kiwango' : 'Rating'}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{riderStats.totalDistance} km</div>
                <p className="text-gray-600 text-sm">{language === 'sw' ? 'Umbali' : 'Distance'}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{riderStats.onTimePercentage}%</div>
                <p className="text-gray-600 text-sm">{language === 'sw' ? 'Kwa Wakati' : 'On Time'}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveModal('withdrawEarnings')}
                className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg font-bold flex items-center justify-center space-x-3"
              >
                <Download className="w-6 h-6" />
                <span>{language === 'sw' ? 'Toa Mapato' : 'Withdraw Earnings'}</span>
              </button>
              <button
                onClick={() => setActiveModal('earningsHistory')}
                className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-bold flex items-center justify-center space-x-3"
              >
                <BarChart3 className="w-6 h-6" />
                <span>{language === 'sw' ? 'Historia ya Mapato' : 'Earnings History'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Safety Helper Modal */}
      {activeModal === 'safetyHelper' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🛡️ Msaidizi wa Usalama' : '🛡️ AI Safety Helper'}
          size="lg"
        >
          <div className="space-y-6">
            {/* Safety Tips */}
            <div className="bg-purple-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6" />
                <span>{language === 'sw' ? 'Vidokezo vya Usalama' : 'Safety Tips'}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl mb-2">🪖</div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    {language === 'sw' ? 'Vaa Kofia ya Usalama' : 'Wear Helmet'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'sw' ? 'Daima vaa kofia ya usalama' : 'Always wear protective helmet'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl mb-2">🌧️</div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    {language === 'sw' ? 'Angalia Hali ya Hewa' : 'Check Weather'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'sw' ? 'Angalia mvua kabla ya safari' : 'Check rain before rides'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl mb-2">⛽</div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    {language === 'sw' ? 'Angalia Mafuta' : 'Check Fuel'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'sw' ? 'Hakikisha una mafuta ya kutosha' : 'Ensure sufficient fuel'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl mb-2">📱</div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    {language === 'sw' ? 'Simu Imejaa' : 'Phone Charged'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'sw' ? 'Hakikisha simu ina chaji' : 'Keep phone charged'}
                  </p>
                </div>
              </div>
            </div>

            {/* Route Hazards */}
            {safetyAlerts.length > 0 && (
              <div className="bg-red-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6" />
                  <span>{language === 'sw' ? 'Hatari za Barabara' : 'Route Hazards'}</span>
                </h3>
                <div className="space-y-3">
                  {safetyAlerts.map((alert) => (
                    <div key={alert.id} className="bg-white p-4 rounded-xl border border-red-200">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{alert.icon}</div>
                        <div>
                          <h4 className="font-bold text-gray-900">{alert.title}</h4>
                          <p className="text-gray-700 text-sm">{alert.description}</p>
                          <p className="text-red-600 text-xs font-medium mt-1">
                            {alert.location} • {alert.severity.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'sw' ? 'Mipangilio ya Usalama' : 'Safety Settings'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {language === 'sw' ? 'Sauti ya Tahadhari' : 'Alert Sounds'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      soundEnabled ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Vibrate className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {language === 'sw' ? 'Mtetemo' : 'Vibration'}
                    </span>
                  </div>
                  <button
                    onClick={() => setVibrationEnabled(!vibrationEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      vibrationEnabled ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Withdraw Earnings Modal */}
      {activeModal === 'withdrawEarnings' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '💸 Toa Mapato' : '💸 Withdraw Earnings'}
          size="md"
        >
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {formatAmount(riderStats.todayEarnings)}
              </div>
              <p className="text-green-800 font-medium">
                {language === 'sw' ? 'Mapato Yanayopatikana' : 'Available Earnings'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Kiasi cha Kutoa' : 'Withdrawal Amount'}
                </label>
                <input
                  type="number"
                  max={riderStats.todayEarnings}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={formatAmount(riderStats.todayEarnings)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Njia ya Kutoa' : 'Withdrawal Method'}
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500">
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="savings">{language === 'sw' ? 'Weka Akiba' : 'Move to Savings'}</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  addNotification({
                    title: language === 'sw' ? 'Mapato Yametolewa' : 'Earnings Withdrawn',
                    message: language === 'sw' ? 'Mapato yako yametolewa kikamilifu' : 'Your earnings have been withdrawn successfully',
                    type: 'success',
                    read: false
                  });
                  setActiveModal(null);
                }}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold"
              >
                {language === 'sw' ? 'Toa Sasa' : 'Withdraw Now'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Equipment Loan Options Modal */}
      {activeModal === 'equipmentLoanOptions' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🛵 Mikopo ya Vifaa' : '🛵 Equipment Loans'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleLoanApplication('motorcycle_equipment')}
                className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg text-left"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Bike className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {language === 'sw' ? 'Vifaa vya Pikipiki' : 'Motorcycle Equipment'}
                    </h3>
                    <p className="text-orange-100 text-sm">
                      {language === 'sw' ? 'Kofia, jaketi, glavu' : 'Helmet, jacket, gloves'}
                    </p>
                  </div>
                </div>
                <div className="text-sm opacity-90">
                  {language === 'sw' ? 'Hadi KSh 15,000 • Riba 8%' : 'Up to KSh 15,000 • 8% interest'}
                </div>
              </button>

              <button
                onClick={() => handleLoanApplication('motorcycle_maintenance')}
                className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg text-left"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Wrench className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {language === 'sw' ? 'Matengenezo ya Pikipiki' : 'Motorcycle Maintenance'}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {language === 'sw' ? 'Marekebisho na vipuri' : 'Repairs and spare parts'}
                    </p>
                  </div>
                </div>
                <div className="text-sm opacity-90">
                  {language === 'sw' ? 'Hadi KSh 25,000 • Riba 10%' : 'Up to KSh 25,000 • 10% interest'}
                </div>
              </button>

              <button
                onClick={() => handleLoanApplication('fuel_advance')}
                className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg text-left"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Fuel className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {language === 'sw' ? 'Mkopo wa Mafuta' : 'Fuel Advance'}
                    </h3>
                    <p className="text-yellow-100 text-sm">
                      {language === 'sw' ? 'Mafuta ya wiki' : 'Weekly fuel advance'}
                    </p>
                  </div>
                </div>
                <div className="text-sm opacity-90">
                  {language === 'sw' ? 'Hadi KSh 5,000 • Riba 5%' : 'Up to KSh 5,000 • 5% interest'}
                </div>
              </button>

              <button
                onClick={() => handleLoanApplication('medical_emergency')}
                className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg text-left"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Heart className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {language === 'sw' ? 'Dharura ya Matibabu' : 'Medical Emergency'}
                    </h3>
                    <p className="text-red-100 text-sm">
                      {language === 'sw' ? 'Matibabu ya dharura' : 'Emergency medical care'}
                    </p>
                  </div>
                </div>
                <div className="text-sm opacity-90">
                  {language === 'sw' ? 'Hadi KSh 20,000 • Riba 3%' : 'Up to KSh 20,000 • 3% interest'}
                </div>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Navigation Modal */}
      {activeModal === 'navigation' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🧭 Mwongozo wa GPS' : '🧭 GPS Navigation'}
          size="md"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="font-bold text-blue-900 mb-2">{language === 'sw' ? 'Mwongozo wa GPS' : 'GPS Navigation'}</h3>
              <p className="text-blue-800 text-sm">{language === 'sw' ? 'Pata mwelekeo wa kwenda hospitali' : 'Get directions to hospitals'}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Chagua Hospitali' : 'Select Hospital'}
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option value="kiambu_hospital">Kiambu District Hospital</option>
                  <option value="nakuru_hospital">Nakuru General Hospital</option>
                  <option value="kisumu_hospital">Kisumu County Hospital</option>
                  <option value="meru_hospital">Meru Teaching Hospital</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">8.5 km</div>
                  <p className="text-green-800 text-sm">{language === 'sw' ? 'Umbali' : 'Distance'}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">15 min</div>
                  <p className="text-blue-800 text-sm">{language === 'sw' ? 'Muda' : 'Time'}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    addNotification({
                      title: language === 'sw' ? 'Mwongozo Umeanza' : 'Navigation Started',
                      message: language === 'sw' ? 'Fuata mwelekeo kwenda hospitali' : 'Follow directions to hospital',
                      type: 'info',
                      read: false
                    });
                    setActiveModal(null);
                  }}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold"
                >
                  {language === 'sw' ? 'Anza Mwongozo' : 'Start Navigation'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* All other existing modals */}
      <EmergencyReportModal
        isOpen={activeModal === 'emergencyReport'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleEmergencySubmit}
        emergencyType={emergencyType}
      />

      <BSenseAI
        isOpen={activeModal === 'bsenseAI'}
        onClose={() => setActiveModal(null)}
        userRole="rider"
      />

      <QRScanner
        isOpen={activeModal === 'qrScanner'}
        onClose={() => setActiveModal(null)}
        onScan={(data) => {
          try {
            const qrData = JSON.parse(data);
            if (qrData.type === 'paraboda_user' && qrData.userId) {
              addNotification({
                title: language === 'sw' ? 'QR Code Imesomwa' : 'QR Code Scanned',
                message: language === 'sw' 
                  ? `Mgonjwa: ${qrData.name} - Safari imethibitishwa`
                  : `Patient: ${qrData.name} - Trip verified`,
                type: 'success',
                read: false
              });
            }
          } catch (error) {
            addNotification({
              title: language === 'sw' ? 'QR Code si Sahihi' : 'Invalid QR Code',
              message: language === 'sw' ? 'QR code haiwezi kusomwa' : 'Unable to read QR code',
              type: 'error',
              read: false
            });
          }
          setActiveModal(null);
        }}
      />

      <ServiceRequestModal
        isOpen={activeModal === 'serviceRequest'}
        onClose={() => setActiveModal(null)}
        onRequest={handleServiceRequest}
      />

      <RewardsModal
        isOpen={activeModal === 'rewards'}
        onClose={() => setActiveModal(null)}
        userPoints={userPoints}
        onRedeem={handleRewardsRedeem}
      />

      {/* Wallet Modals */}
      <MedicalLoanOptions
        isOpen={activeModal === 'medicalLoanOptions'}
        onClose={handleModalClose}
        onLoanSelect={handleLoanApplication}
      />

      <LoanApplicationForm
        isOpen={activeModal === 'loanApplication'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        loanType={selectedLoanType}
      />

      <AddSavingsForm
        isOpen={activeModal === 'addSavings'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        currentBalance={walletData.balance}
      />

      <LoanPaymentForm
        isOpen={activeModal === 'loanPayment'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <CreditCoachChat
        isOpen={showCreditCoach}
        onClose={() => setShowCreditCoach(false)}
        userCreditScore={walletData.creditScore}
        userSavings={walletData.savings}
      />
    </div>
  );
};