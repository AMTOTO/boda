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
import { RewardsModal } from '../common/RewardsModal';
import { DepositModal } from '../common/DepositModal';
import { CreditProfileCard } from '../wallet/CreditProfileCard';
import { CreditCoachChat } from '../wallet/CreditCoachChat';
import { MedicalLoanOptions, LoanApplicationForm, LoanPaymentForm } from '../wallet/loans';
import { AddSavingsForm } from '../wallet/AddSavingsForm';
import { SHAContributionForm, SHALoanRequestForm } from '../wallet/sha';
import { CreditReportModal } from '../wallet/CreditReportModal';
import { Modal } from '../common/Modal';
import { 
  AlertTriangle, 
  Bike, 
  Heart, 
  Brain, 
  QrCode,
  Wallet,
  Star,
  DollarSign,
  CreditCard,
  PiggyBank,
  FileText,
  Shield,
  Award,
  Car,
  Stethoscope,
  Plus,
  Eye,
  X,
  Users,
  Calendar,
  MapPin,
  Phone,
  Baby,
  Syringe,
  Activity,
  TrendingUp,
  Settings,
  Bell,
  Home
} from 'lucide-react';

export const CommunityDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification, addRideRequest, communityFunds } = useData();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [emergencyType, setEmergencyType] = useState<'medical' | 'accident' | 'outbreak' | 'weather'>('medical');
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [showCreditCoach, setShowCreditCoach] = useState(false);

  // User points for rewards
  const userPoints = user?.points || 150;

  // Mock wallet data based on user
  const walletData = {
    balance: 15750,
    savings: Math.floor(communityFunds * 0.1),
    creditScore: Math.min(850, 300 + (userPoints * 2)),
    eligibilityStatus: user?.level === 'Gold' ? 'approved' : user?.level === 'Silver' ? 'pending' : 'not_assessed',
    loanReadiness: Math.min(100, 40 + userPoints / 10),
    trustLevel: user?.level === 'Platinum' ? 'platinum' : user?.level === 'Gold' ? 'gold' : user?.level === 'Silver' ? 'silver' : 'bronze'
  };

  const handleEmergencyRequest = (type: 'medical' | 'accident') => {
    setEmergencyType(type);
    setActiveModal('emergencyReport');
  };

  const handleServiceRequest = (serviceData: any) => {
    addRideRequest({
      type: serviceData.urgency === 'high' ? 'emergency' : 'routine',
      patientName: serviceData.patientName,
      pickup: serviceData.pickupLocation,
      destination: serviceData.destination,
      urgency: serviceData.urgency,
      status: 'pending',
      requestedBy: user?.name || 'Community Member',
      cost: serviceData.estimatedCost || 0,
      notes: serviceData.additionalNotes
    });
    
    addNotification({
      title: language === 'sw' ? 'Ombi Limewasilishwa' : 'Request Submitted',
      message: language === 'sw' ? 'Ombi lako la huduma limewasilishwa' : 'Your service request has been submitted',
      type: 'success',
      read: false
    });
    
    setActiveModal(null);
  };

  const handleEmergencySubmit = (reportData: any) => {
    addNotification({
      title: language === 'sw' ? 'Ripoti ya Dharura Imewasilishwa' : 'Emergency Report Submitted',
      message: language === 'sw' ? 'Ripoti yako ya dharura imewasilishwa kwa CHV' : 'Your emergency report has been submitted to CHV',
      type: 'warning',
      read: false
    });
    
    setActiveModal(null);
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

  const handleDeposit = (type: string, amount: number, description: string, photoUrl?: string) => {
    addNotification({
      title: language === 'sw' ? 'Mchango Umeongezwa' : 'Contribution Added',
      message: language === 'sw' 
        ? `Mchango wa ${formatAmount(amount)} umeongezwa`
        : `Contribution of ${formatAmount(amount)} added`,
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

  return (
    <div className="min-h-screen dashboard-bg-community">
      <Header 
        title={language === 'sw' ? 'Walezi' : 'Caregivers'}
        subtitle={language === 'sw' ? 'Huduma za afya na usafiri' : 'Health and transport services'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-emerald-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-6xl">🏠</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  {language === 'sw' ? '🏠 Dashibodi ya Walezi' : '🏠 Caregiver Dashboard'}
                </h1>
                <p className="text-lg text-emerald-600 font-bold">
                  {language === 'sw' ? 'Huduma za Afya na Usafiri' : 'Health and Transport Services'}
                </p>
              </div>
            </div>
            <div className="bg-blue-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-emerald-800 font-semibold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </p>
              <p className="text-xs text-emerald-700">
                {language === 'sw' ? 'Salio la jamii' : 'Community balance'}: {formatAmount(communityFunds)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Emergency Request */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => handleEmergencyRequest('medical')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🚨</div>
            <AlertTriangle className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'DHARURA' : 'EMERGENCY'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Omba msaada wa haraka' : 'Request urgent help'}
              </div>
            </div>
          </motion.button>

          {/* Request Transport */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setActiveModal('serviceRequest')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🚲</div>
            <Bike className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'USAFIRI' : 'TRANSPORT'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Omba usafiri wa afya' : 'Request health transport'}
              </div>
            </div>
          </motion.button>

          {/* Health Services */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveModal('healthServices')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🏥</div>
            <Heart className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'AFYA' : 'HEALTH'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Huduma za afya' : 'Health services'}
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
            className="min-h-[140px] bg-gradient-to-br from-blue-700 to-blue-800 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🧠</div>
            <Brain className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'MSAIDIZI' : 'AI HELPER'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Msaada wa afya' : 'Health assistance'}
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
            className="min-h-[140px] bg-gradient-to-br from-blue-300 to-blue-400 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
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
            className="min-h-[140px] bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
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

        {/* MSUPU Wallet Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Wallet className="w-8 h-8 text-emerald-600" />
            <span>{language === 'sw' ? 'M-SUPU Pochi - Muhtasari' : 'M-SUPU Wallet - Overview'}</span>
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
                  className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <DollarSign className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Matibabu na usafiri' : 'Medical & transport'}</div>
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
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Hifadhi ya jamii' : 'Community savings'}</div>
                  </div>
                </button>

                {/* Loan Payment */}
                <button
                  onClick={() => setActiveModal('loanPayment')}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <CreditCard className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Lipa Mkopo' : 'Loan Payment'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Malipo ya mkopo' : 'Repay loan'}</div>
                  </div>
                </button>

                {/* View Credit Report */}
                <button
                  onClick={() => setActiveModal('creditReport')}
                  className="w-full p-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <FileText className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Ripoti ya Mkopo' : 'Credit Report'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Historia na alama' : 'History & score'}</div>
                  </div>
                </button>

                {/* Credit Coach */}
                <button
                  onClick={() => setShowCreditCoach(true)}
                  className="w-full p-4 bg-gradient-to-r from-blue-300 to-blue-400 text-white rounded-2xl hover:from-blue-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
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
                  className="w-full p-4 bg-gradient-to-r from-blue-200 to-blue-300 text-white rounded-2xl hover:from-blue-300 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
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

        {/* SHA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'sw' ? 'Bima ya Afya ya Kijamii (SHA)' : 'Social Health Insurance (SHA)'}
                </h3>
                <p className="text-gray-600">
                  {language === 'sw' 
                    ? 'Jiunge na bima ya afya ya jamii'
                    : 'Join the community health insurance program'
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Register & Contribute */}
              <button
                onClick={() => setActiveModal('shaContribution')}
                className="p-6 border-2 border-blue-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left min-h-[120px] flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {language === 'sw' ? 'Jiunge & Changia' : 'Register & Contribute'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'sw' 
                      ? 'Tumia akiba zako za jamii kuchangia SHA'
                      : 'Use your community savings to contribute to SHA'
                    }
                  </p>
                </div>
              </button>

              {/* Request SHA Loan */}
              <button
                onClick={() => setActiveModal('shaLoanRequest')}
                className="p-6 border-2 border-teal-200 rounded-2xl hover:border-teal-400 hover:bg-teal-50 transition-all text-left min-h-[120px] flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {language === 'sw' ? 'Omba Mkopo wa SHA' : 'Request SHA Loan'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'sw' 
                      ? 'Pata mkopo wa kujiunga na SHA'
                      : 'Get a loan to register for SHA'
                    }
                  </p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Health Services Modal */}
      {activeModal === 'healthServices' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🏥 Huduma za Afya' : '🏥 Health Services'}
          size="lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setActiveModal('serviceRequest')}
              className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Stethoscope className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Huduma za Mimba' : 'Antenatal Care'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Ziara za ANC' : 'ANC visits'}</div>
              </div>
            </button>
            
            <button
              onClick={() => setActiveModal('serviceRequest')}
              className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Baby className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Chanjo za Watoto' : 'Child Vaccinations'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Ratiba ya chanjo' : 'Vaccine schedule'}</div>
              </div>
            </button>

            <button
              onClick={() => {
                setEmergencyType('medical');
                setActiveModal('emergencyReport');
              }}
              className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <AlertTriangle className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Dharura ya Matibabu' : 'Medical Emergency'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Msaada wa haraka' : 'Urgent assistance'}</div>
              </div>
            </button>

            <button
              onClick={() => setActiveModal('bsenseAI')}
              className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Brain className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Ushauri wa Afya' : 'Health Consultation'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'AI msaidizi' : 'AI assistant'}</div>
              </div>
            </button>
          </div>
        </Modal>
      )}

      {/* Wallet Modal */}
      {activeModal === 'wallet' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '💰 M-Supu Pochi' : '💰 M-Supu Wallet'}
          size="md"
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-emerald-50 p-6 rounded-2xl">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {formatAmount(walletData.balance)}
                </div>
                <p className="text-emerald-800 font-medium">
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
            </div>
          </div>
        </Modal>
      )}

      {/* All Modals */}
      <EmergencyReportModal
        isOpen={activeModal === 'emergencyReport'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleEmergencySubmit}
        emergencyType={emergencyType}
      />

      <ServiceRequestModal
        isOpen={activeModal === 'serviceRequest'}
        onClose={() => setActiveModal(null)}
        onRequest={handleServiceRequest}
      />

      <BSenseAI
        isOpen={activeModal === 'bsenseAI'}
        onClose={() => setActiveModal(null)}
        userRole="community"
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

      <RewardsModal
        isOpen={activeModal === 'rewards'}
        onClose={() => setActiveModal(null)}
        userPoints={userPoints}
        onRedeem={handleRewardsRedeem}
      />

      <DepositModal
        isOpen={activeModal === 'deposit'}
        onClose={() => setActiveModal(null)}
        onDeposit={handleDeposit}
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

      <CreditReportModal
        isOpen={activeModal === 'creditReport'}
        onClose={handleModalClose}
        creditScore={walletData.creditScore}
      />

      <SHAContributionForm
        isOpen={activeModal === 'shaContribution'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        currentBalance={walletData.savings}
      />

      <SHALoanRequestForm
        isOpen={activeModal === 'shaLoanRequest'}
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