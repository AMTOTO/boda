import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { EmergencyReportModal } from '../common/EmergencyReportModal';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { BSenseAI } from '../common/BSenseAI';
import { QRScanner } from '../common/QRScanner';
import { CreditProfileCard } from '../wallet/CreditProfileCard';
import { CreditCoachChat } from '../wallet/CreditCoachChat';
import { MedicalLoanOptions, LoanApplicationForm, LoanPaymentForm } from '../wallet/loans';
import { AddSavingsForm } from '../wallet/AddSavingsForm';
import { RewardsModal } from '../common/RewardsModal';
import { 
  Home, 
  AlertTriangle, 
  Brain, 
  QrCode,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  MapPin,
  Users,
  Heart,
  Wallet,
  DollarSign,
  PiggyBank,
  Award,
  Target,
  X
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
}

interface TransportRequest {
  id: string;
  patientName: string;
  pickup: string;
  destination: string;
  distance: number;
  cost: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  timestamp: Date;
}

export const CHVDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification, communityFunds } = useData();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [emergencyType, setEmergencyType] = useState<'medical' | 'accident' | 'outbreak' | 'weather'>('medical');
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [showCreditCoach, setShowCreditCoach] = useState(false);
  
  // CHV data - higher allocation due to community leadership role
  const userPoints = user?.points || 500;
  const walletData = {
    balance: Math.floor(communityFunds * 0.15), // 15% allocation for CHVs
    savings: Math.floor(communityFunds * 0.12),
    creditScore: Math.min(850, 400 + (userPoints * 1.6)), // Higher base for CHVs
    eligibilityStatus: user?.level === 'Gold' ? 'approved' : user?.level === 'Silver' ? 'approved' : 'pending',
    loanReadiness: Math.min(100, 65 + userPoints / 7),
    trustLevel: user?.level === 'Platinum' ? 'platinum' : user?.level === 'Gold' ? 'gold' : 'silver'
  };
  
  // Mock households data
  const [households, setHouseholds] = useState<Household[]>([
    {
      id: 'hh_001',
      name: 'Wanjiku Family',
      location: 'Kiambu Village, Zone A',
      members: 5,
      adults: 2,
      children: 3,
      pregnantWomen: 1,
      childrenUnder5: 2,
      status: 'active',
      lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextVisit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
      lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    }
  ]);

  // Mock transport requests
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>([
    {
      id: 'tr_001',
      patientName: 'Grace Wanjiku',
      pickup: 'Kiambu Village',
      destination: 'Kiambu Hospital',
      distance: 8,
      cost: 820, // 500 base + 8km * 40
      urgency: 'high',
      status: 'pending',
      requestedBy: 'Caregiver Mary',
      timestamp: new Date()
    }
  ]);

  const getHouseholdStatusColor = (status: string) => {
    switch (status) {
      case 'priority': return 'bg-red-100 text-red-800 border-red-300';
      case 'mch_due': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const handleApproveRequest = (requestId: string, approved: boolean) => {
    setTransportRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: approved ? 'approved' : 'rejected' }
          : req
      )
    );
    
    addNotification({
      title: language === 'sw' ? 'Ombi Limesindikizwa' : 'Request Processed',
      message: language === 'sw' 
        ? `Ombi la usafiri lime${approved ? 'idhinishwa' : 'kataliwa'}`
        : `Transport request has been ${approved ? 'approved' : 'rejected'}`,
      type: approved ? 'success' : 'info',
      read: false
    });
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
    <div className="min-h-screen dashboard-bg-chv">
      <Header 
        title={language === 'sw' ? 'CHV' : 'Community Health Volunteer'}
        subtitle={language === 'sw' ? 'Mjumbe wa afya ya jamii' : 'Community health volunteer'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-4 border-purple-200">
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              {language === 'sw' ? `Kaya ${households.length} • Maombi ${transportRequests.length}` : `${households.length} Households • ${transportRequests.length} Requests`}
            </p>
            <div className="mt-4 bg-purple-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-purple-800 font-semibold">
                {language === 'sw' ? 'Salio lako' : 'Your balance'}: {formatAmount(walletData.balance)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Household Management */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => setActiveModal('households')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🏠</div>
            <Home className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'KAYA' : 'HOUSEHOLDS'}
              </div>
              <div className="text-sm opacity-90">
                {households.length} {language === 'sw' ? 'kaya' : 'households'}
              </div>
            </div>
          </motion.button>

          {/* Transport Requests */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setActiveModal('transportRequests')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🚲</div>
            <Target className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'USAFIRI' : 'TRANSPORT'}
              </div>
              <div className="text-sm opacity-90">
                {transportRequests.filter(r => r.status === 'pending').length} {language === 'sw' ? 'maombi' : 'pending'}
              </div>
            </div>
          </motion.button>

          {/* Community Alerts */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveModal('alerts')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🚨</div>
            <AlertTriangle className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'TAHADHARI' : 'ALERTS'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Ripoti za jamii' : 'Community reports'}
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
                {language === 'sw' ? 'Ushauri wa jamii' : 'Community guidance'}
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

        {/* MSUPU Wallet Section for CHVs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Wallet className="w-8 h-8 text-emerald-600" />
            <span>{language === 'sw' ? 'M-SUPU Pochi ya CHV' : 'CHV M-SUPU Wallet'}</span>
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
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Vifaa vya jamii' : 'Community equipment'}</div>
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

      {/* Households Modal */}
      {activeModal === 'households' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === 'sw' ? 'Kaya Zako' : 'Your Households'}
                </h2>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {households.map((household) => (
                <div key={household.id} className={`p-6 rounded-2xl border-2 ${getHouseholdStatusColor(household.status)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{household.name}</h3>
                      <p className="text-sm opacity-75">{household.location}</p>
                      <p className="text-sm">
                        {household.members} {language === 'sw' ? 'wanachama' : 'members'} • 
                        {household.pregnantWomen} {language === 'sw' ? 'wajawazito' : 'pregnant'} • 
                        {household.childrenUnder5} {language === 'sw' ? 'watoto <5' : 'children <5'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getHouseholdStatusColor(household.status)}`}>
                      {household.status === 'priority' ? (language === 'sw' ? 'KIPAUMBELE' : 'PRIORITY') :
                       household.status === 'mch_due' ? (language === 'sw' ? 'MCH INAHITAJIKA' : 'MCH DUE') :
                       (language === 'sw' ? 'HAI' : 'ACTIVE')}
                    </span>
                  </div>
                  
                  {household.notes && (
                    <div className="bg-white/50 p-3 rounded-lg mb-3">
                      <p className="text-sm">{household.notes}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => console.log('Visit household:', household.id)}
                      className="min-h-[48px] bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all transform hover:scale-105"
                    >
                      {language === 'sw' ? 'TEMBELEA' : 'VISIT'}
                    </button>
                    <button
                      onClick={() => console.log('Update household:', household.id)}
                      className="min-h-[48px] bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all transform hover:scale-105"
                    >
                      {language === 'sw' ? 'SASISHA' : 'UPDATE'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setActiveModal(null)}
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
            >
              {language === 'sw' ? 'Funga' : 'Close'}
            </button>
          </motion.div>
        </div>
      )}

      {/* Transport Requests Modal */}
      {activeModal === 'transportRequests' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === 'sw' ? 'Maombi ya Usafiri' : 'Transport Requests'}
                </h2>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {transportRequests.map((request) => (
                <div key={request.id} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{request.patientName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {request.requestedBy}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{request.pickup} → {request.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-green-600">{formatAmount(request.cost)}</span>
                          <span className="text-gray-500">({request.distance}km)</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {request.urgency === 'high' ? (language === 'sw' ? 'DHARURA' : 'URGENT') :
                       request.urgency === 'medium' ? (language === 'sw' ? 'WASTANI' : 'MEDIUM') :
                       (language === 'sw' ? 'CHINI' : 'LOW')}
                    </span>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleApproveRequest(request.id, true)}
                        className="min-h-[48px] bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>{language === 'sw' ? 'IDHINISHA' : 'APPROVE'}</span>
                      </button>
                      <button
                        onClick={() => handleApproveRequest(request.id, false)}
                        className="min-h-[48px] bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>{language === 'sw' ? 'KATAA' : 'REJECT'}</span>
                      </button>
                    </div>
                  )}
                  
                  {request.status !== 'pending' && (
                    <div className={`text-center py-2 rounded-xl font-bold ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status === 'approved' 
                        ? (language === 'sw' ? 'IMEIDHINISHWA' : 'APPROVED')
                        : (language === 'sw' ? 'IMEKATALIWA' : 'REJECTED')
                      }
                    </div>
                  )}
                </div>
              ))}
              
              {transportRequests.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🚲</div>
                  <p className="text-gray-500 text-lg">
                    {language === 'sw' ? 'Hakuna maombi ya usafiri' : 'No transport requests'}
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setActiveModal(null)}
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
            >
              {language === 'sw' ? 'Funga' : 'Close'}
            </button>
          </motion.div>
        </div>
      )}

      {/* Alerts Modal */}
      {activeModal === 'alerts' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Tahadhari za Jamii' : 'Community Alerts'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  setEmergencyType('medical');
                  setActiveModal('emergencyReport');
                }}
                className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center justify-center space-x-3"
              >
                <AlertTriangle className="w-6 h-6" />
                <span className="font-bold text-lg">{language === 'sw' ? 'Ripoti Dharura' : 'Report Emergency'}</span>
              </button>
              
              <button
                onClick={() => {
                  setEmergencyType('outbreak');
                  setActiveModal('emergencyReport');
                }}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center justify-center space-x-3"
              >
                <div className="text-2xl">🦠</div>
                <span className="font-bold text-lg">{language === 'sw' ? 'Mlipuko wa Ugonjwa' : 'Disease Outbreak'}</span>
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
        onSubmit={(reportData) => {
          addNotification({
            title: language === 'sw' ? 'Ripoti ya Dharura Imewasilishwa' : 'Emergency Report Submitted',
            message: language === 'sw' ? 'Ripoti yako imewasilishwa kwa msimamizi' : 'Your report has been submitted to admin',
            type: 'warning',
            read: false
          });
          setActiveModal(null);
        }}
        emergencyType={emergencyType}
      />

      <BSenseAI
        isOpen={activeModal === 'bsenseAI'}
        onClose={() => setActiveModal(null)}
        userRole="chv"
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
        isOpen={activeModal === 'transport'}
        onClose={() => setActiveModal(null)}
        onRequest={(serviceData) => {
          addNotification({
            title: language === 'sw' ? 'Ombi la Huduma Limewasilishwa' : 'Service Request Submitted',
            message: language === 'sw' ? 'Ombi lako limewasilishwa' : 'Your request has been submitted',
            type: 'success',
            read: false
          });
          setActiveModal(null);
        }}
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