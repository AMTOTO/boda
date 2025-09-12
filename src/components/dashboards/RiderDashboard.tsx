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
  Target
} from 'lucide-react';

interface RideRequest {
  id: string;
  patientName: string;
  pickup: string;
  destination: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedCost: number;
  distance: number;
  requestedBy: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'completed';
}

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
  
  // Rider stats
  const [todayEarnings, setTodayEarnings] = useState(3200);
  const [totalRides, setTotalRides] = useState(156);
  const [rating, setRating] = useState(4.8);
  
  // User points for rewards
  const userPoints = user?.points || 320;

  // Mock wallet data based on user - riders get higher allocation
  const walletData = {
    balance: Math.floor(communityFunds * 0.15),
    savings: Math.floor(communityFunds * 0.12),
    creditScore: Math.min(850, 350 + (userPoints * 1.5)),
    eligibilityStatus: user?.level === 'Gold' ? 'approved' : user?.level === 'Silver' ? 'approved' : 'pending',
    loanReadiness: Math.min(100, 60 + userPoints / 8),
    trustLevel: user?.level === 'Platinum' ? 'platinum' : user?.level === 'Gold' ? 'gold' : 'silver'
  };
  
  // Mock ride requests
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([
    {
      id: 'ride_001',
      patientName: 'Grace Wanjiku',
      pickup: 'Kiambu Village',
      destination: 'Kiambu District Hospital',
      urgency: 'high',
      estimatedCost: 800,
      distance: 8,
      requestedBy: 'CHV Sarah',
      timestamp: new Date(),
      status: 'pending'
    },
    {
      id: 'ride_002',
      patientName: 'Baby Michael',
      pickup: 'Nakuru Town',
      destination: 'Nakuru Health Center',
      urgency: 'medium',
      estimatedCost: 500,
      distance: 5,
      requestedBy: 'Mother Jane',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'pending'
    }
  ]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const handleAcceptRide = (rideId: string) => {
    setRideRequests(prev => 
      prev.map(ride => 
        ride.id === rideId 
          ? { ...ride, status: 'accepted' }
          : ride
      )
    );
    
    addNotification({
      title: language === 'sw' ? 'Safari Imekubaliwa' : 'Ride Accepted',
      message: language === 'sw' ? 'Umeanza safari' : 'You have started the ride',
      type: 'success',
      read: false
    });
  };

  const handleRejectRide = (rideId: string) => {
    setRideRequests(prev => prev.filter(ride => ride.id !== rideId));
    
    addNotification({
      title: language === 'sw' ? 'Safari Imekataliwa' : 'Ride Rejected',
      message: language === 'sw' ? 'Safari imekataliwa' : 'Ride has been rejected',
      type: 'info',
      read: false
    });
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

  return (
    <div className="min-h-screen dashboard-bg-rider">
      <Header 
        title={language === 'sw' ? 'ParaBoda' : 'ParaBoda Rider'}
        subtitle={language === 'sw' ? 'Msafiri wa afya' : 'Health transport rider'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-4 border-orange-200">
            <div className="text-6xl mb-4">🏍️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              {language === 'sw' ? 'Mapato ya leo: ' : 'Today\'s earnings: '}{formatAmount(todayEarnings)}
            </p>
            <div className="mt-4 bg-orange-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-orange-800 font-semibold">
                {language === 'sw' ? 'Salio lako' : 'Your balance'}: {formatAmount(walletData.balance)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Accept Emergency Ride */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => setActiveModal('rideRequests')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3 animate-pulse"
          >
            <div className="text-5xl">🚨</div>
            <AlertTriangle className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'SAFARI YA DHARURA' : 'EMERGENCY RIDE'}
              </div>
              <div className="text-sm opacity-90">
                {rideRequests.filter(r => r.urgency === 'high').length} {language === 'sw' ? 'maombi' : 'requests'}
              </div>
            </div>
          </motion.button>

          {/* View Map */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setActiveModal('map')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🗺️</div>
            <MapPin className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'RAMANI' : 'MAP'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Ona maombi ya safari' : 'View ride requests'}
              </div>
            </div>
          </motion.button>

          {/* Today's Earnings */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
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
                {formatAmount(todayEarnings)} {language === 'sw' ? 'leo' : 'today'}
              </div>
            </div>
          </motion.button>

          {/* ParaBoda AI */}
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
                {language === 'sw' ? 'MSAIDIZI' : 'AI HELPER'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Ushauri wa usalama' : 'Safety guidance'}
              </div>
            </div>
          </motion.button>

          {/* QR Scanner */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setActiveModal('qrScanner')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">📱</div>
            <QrCode className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'SKANI' : 'SCAN'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Skani QR code' : 'Scan QR code'}
              </div>
            </div>
          </motion.button>

          {/* M-SUPU Wallet */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setActiveModal('wallet')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">💰</div>
            <Wallet className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'M-SUPU' : 'M-SUPU'}
              </div>
              <div className="text-sm opacity-90">
                {formatAmount(walletData.balance)}
              </div>
            </div>
          </motion.button>
        </div>

        {/* MSUPU Wallet Section for Riders */}
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
                {/* Apply for Loan */}
                <button
                  onClick={() => setActiveModal('medicalLoanOptions')}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <DollarSign className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Vifaa vya pikipiki' : 'Motorcycle equipment'}</div>
                  </div>
                </button>

                {/* Add Savings */}
                <button
                  onClick={() => setActiveModal('addSavings')}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <PiggyBank className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Akiba za kibinafsi' : 'Personal savings'}</div>
                  </div>
                </button>

                {/* Credit Coach */}
                <button
                  onClick={() => setShowCreditCoach(true)}
                  className="w-full p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <Brain className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Mkocha wa Mkopo' : 'Credit Coach'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Ushauri wa kifedha' : 'Financial advice'}</div>
                  </div>
                </button>

                {/* Rewards */}
                <button
                  onClick={() => setActiveModal('rewards')}
                  className="w-full p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <Award className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Zawadi' : 'Rewards'}</div>
                    <div className="text-sm opacity-90">{userPoints} {language === 'sw' ? 'pointi' : 'points'}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ride Requests Modal */}
      {activeModal === 'rideRequests' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Maombi ya Safari' : 'Ride Requests'}
              </h2>
            </div>
            
            <div className="space-y-6">
              {rideRequests.map((request) => (
                <div key={request.id} className={`p-6 rounded-2xl border-2 ${getUrgencyColor(request.urgency)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{request.patientName}</h3>
                      <p className="text-sm opacity-75">{language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {request.requestedBy}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency === 'high' ? (language === 'sw' ? 'DHARURA' : 'URGENT') :
                       request.urgency === 'medium' ? (language === 'sw' ? 'WASTANI' : 'MEDIUM') :
                       (language === 'sw' ? 'CHINI' : 'LOW')}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{request.pickup}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{request.destination}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      <span className="font-bold text-green-600">{formatAmount(request.estimatedCost)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAcceptRide(request.id)}
                      className="min-h-[56px] bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-6 h-6" />
                      <span>{language === 'sw' ? 'KUBALI' : 'ACCEPT'}</span>
                    </button>
                    <button
                      onClick={() => handleRejectRide(request.id)}
                      className="min-h-[56px] bg-gray-500 text-white rounded-2xl font-bold text-lg hover:bg-gray-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-6 h-6" />
                      <span>{language === 'sw' ? 'KATAA' : 'REJECT'}</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {rideRequests.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏍️</div>
                  <p className="text-gray-500 text-lg">
                    {language === 'sw' ? 'Hakuna maombi ya safari' : 'No ride requests'}
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
            >
              {language === 'sw' ? 'Funga' : 'Close'}
            </button>
          </motion.div>
        </div>
      )}

      {/* Map Modal */}
      {activeModal === 'map' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Ramani ya GPS' : 'GPS Map'}
              </h2>
            </div>
            
            <GPSLocationDisplay
              onLocationUpdate={setCurrentLocation}
              showAccuracy={true}
              autoUpdate={true}
            />
            
            <div className="mt-6 grid grid-cols-1 gap-4">
              <button
                onClick={() => setActiveModal('rideRequests')}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] font-bold"
              >
                {language === 'sw' ? 'Ona Maombi ya Safari' : 'View Ride Requests'}
              </button>
              
              <button
                onClick={() => setActiveModal(null)}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
              >
                {language === 'sw' ? 'Funga' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Earnings Modal */}
      {activeModal === 'earnings' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Mapato Yako' : 'Your Earnings'}
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {formatAmount(todayEarnings)}
                </div>
                <p className="text-green-800 dark:text-green-200 font-medium">
                  {language === 'sw' ? 'Mapato ya Leo' : 'Today\'s Earnings'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalRides}</div>
                  <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">{language === 'sw' ? 'Safari' : 'Rides'}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{rating}/5</div>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">{language === 'sw' ? 'Kiwango' : 'Rating'}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
            >
              {language === 'sw' ? 'Funga' : 'Close'}
            </button>
          </motion.div>
        </div>
      )}

      {/* Wallet Modal */}
      {activeModal === 'wallet' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'sw' ? 'M-Supu Pochi' : 'M-Supu Wallet'}
              </h2>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {formatAmount(walletData.balance)}
                </div>
                <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                  {language === 'sw' ? 'Salio Lako' : 'Your Balance'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setActiveModal('addSavings')}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center justify-center space-x-3"
              >
                <PiggyBank className="w-6 h-6" />
                <span className="font-bold text-lg">{language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}</span>
              </button>
              
              <button
                onClick={() => setActiveModal('rewards')}
                className="w-full p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center justify-center space-x-3"
              >
                <Award className="w-6 h-6" />
                <span className="font-bold text-lg">{language === 'sw' ? 'Zawadi' : 'Rewards'}</span>
              </button>
              
              <button
                onClick={() => setActiveModal('creditReport')}
                className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center justify-center space-x-3"
              >
                <Eye className="w-6 h-6" />
                <span className="font-bold text-lg">{language === 'sw' ? 'Ripoti ya Mkopo' : 'Credit Report'}</span>
              </button>
              
              <button
                onClick={() => setActiveModal(null)}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
              >
                {language === 'sw' ? 'Funga' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* All Modals */}
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
          console.log('QR Scanned:', data);
          setActiveModal(null);
          addNotification({
            title: language === 'sw' ? 'QR Code Imesomwa' : 'QR Code Scanned',
            message: language === 'sw' ? 'Taarifa zimepatikana' : 'Information retrieved',
            type: 'success',
            read: false
          });
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