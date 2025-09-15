import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { BSenseAI } from '../common/BSenseAI';
import { QRScanner } from '../common/QRScanner';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { Modal } from '../common/Modal';
import { CreditProfileCard } from '../wallet/CreditProfileCard';
import { CreditCoachChat } from '../wallet/CreditCoachChat';
import { MedicalLoanOptions, LoanApplicationForm, LoanPaymentForm } from '../wallet/loans';
import { AddSavingsForm } from '../wallet/AddSavingsForm';
import { RewardsModal } from '../common/RewardsModal';
import { 
  Users, 
  Syringe, 
  Bike, 
  FileText, 
  Brain, 
  QrCode,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  Baby,
  Heart,
  Wallet,
  Eye,
  DollarSign,
  PiggyBank,
  CreditCard,
  Award,
  X,
  Phone,
  MapPin,
  Activity,
  Clock,
  Shield
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone?: string;
  location: string;
  lastVisit?: Date;
  nextAppointment?: Date;
  vaccinationStatus: 'up_to_date' | 'overdue' | 'partial';
  medicalHistory: string[];
  emergencyContact?: string;
}

interface Vaccine {
  id: string;
  name: string;
  batchNumber: string;
  expiryDate: Date;
  stockQuantity: number;
  manufacturer: string;
  status: 'in_stock' | 'low_stock' | 'expired' | 'out_of_stock';
}

export const HealthWorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification, communityFunds } = useData();
  
  // Modal and tab states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [showCreditCoach, setShowCreditCoach] = useState(false);
  
  // Health worker data - higher allocation due to professional role
  const userPoints = user?.points || 400;
  const walletData = {
    balance: Math.floor(communityFunds * 0.12),
    savings: Math.floor(communityFunds * 0.10),
    creditScore: Math.min(850, 450 + (userPoints * 1.8)),
    eligibilityStatus: user?.level === 'Platinum' ? 'approved' : user?.level === 'Gold' ? 'approved' : 'pending',
    loanReadiness: Math.min(100, 70 + userPoints / 6),
    trustLevel: user?.level === 'Platinum' ? 'platinum' : 'gold'
  };
  
  // Health worker data
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'pat_001',
      name: 'Grace Wanjiku',
      age: 28,
      gender: 'female',
      phone: '+254712345678',
      location: 'Kiambu Village',
      lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextAppointment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      vaccinationStatus: 'up_to_date',
      medicalHistory: ['Pregnancy - 32 weeks', 'Previous normal delivery'],
      emergencyContact: '+254723456789'
    },
    {
      id: 'pat_002',
      name: 'Baby Michael',
      age: 0,
      gender: 'male',
      location: 'Nakuru Town',
      lastVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      vaccinationStatus: 'overdue',
      medicalHistory: ['Birth weight: 3.2kg', 'BCG vaccine given'],
      emergencyContact: '+254734567890'
    }
  ]);

  const [vaccines, setVaccines] = useState<Vaccine[]>([
    {
      id: 'vac_001',
      name: 'BCG',
      batchNumber: 'BCG2024001',
      expiryDate: new Date(2024, 11, 31),
      stockQuantity: 45,
      manufacturer: 'Kenya Medical Supplies',
      status: 'in_stock'
    },
    {
      id: 'vac_002',
      name: 'Polio (OPV)',
      batchNumber: 'OPV2024002',
      expiryDate: new Date(2024, 8, 15),
      stockQuantity: 12,
      manufacturer: 'UNICEF Supply',
      status: 'low_stock'
    }
  ]);

  const handleServiceRequest = (serviceData: any) => {
    addNotification({
      title: language === 'sw' ? 'Ombi la Usafiri Limewasilishwa' : 'Transport Request Submitted',
      message: language === 'sw' ? 'Ombi limewasilishwa kwa ParaBoda' : 'Request submitted to ParaBoda',
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
    <div className="min-h-screen dashboard-bg-health">
      <Header 
        title={language === 'sw' ? 'Mfanyakazi wa Afya' : 'Health Worker'}
        subtitle={language === 'sw' ? 'Huduma za kimatibabu' : 'Medical services'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-blue-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-6xl">👩‍⚕️</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  {language === 'sw' ? '👩‍⚕️ Dashibodi ya Mfanyakazi wa Afya' : '👩‍⚕️ Health Worker Dashboard'}
                </h1>
                <p className="text-lg text-purple-600 font-bold">
                  {language === 'sw' ? 'Huduma za Kimatibabu na Chanjo' : 'Medical Services and Vaccinations'}
                </p>
              </div>
            </div>
            <div className="bg-purple-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-purple-800 font-semibold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </p>
              <p className="text-xs text-purple-700">
                {language === 'sw' ? `Wagonjwa ${patients.length} • Chanjo ${vaccines.length}` : `${patients.length} Patients • ${vaccines.length} Vaccines`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Patient Management */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => setActiveModal('patients')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">👥</div>
            <Users className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'WAGONJWA' : 'PATIENTS'}
              </div>
              <div className="text-sm opacity-90">
                {patients.length} {language === 'sw' ? 'wagonjwa' : 'patients'}
              </div>
            </div>
          </motion.button>

          {/* Vaccines & Inventory */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setActiveModal('vaccines')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">💉</div>
            <Syringe className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'CHANJO' : 'VACCINES'}
              </div>
              <div className="text-sm opacity-90">
                {vaccines.filter(v => v.status === 'in_stock').length} {language === 'sw' ? 'zinapatikana' : 'in stock'}
              </div>
            </div>
          </motion.button>

          {/* Transport Requests */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveModal('transport')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[140px] bg-gradient-to-br from-purple-400 to-purple-500 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🚲</div>
            <Bike className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'USAFIRI' : 'TRANSPORT'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Maombi ya wagonjwa' : 'Patient requests'}
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
            className="min-h-[140px] bg-gradient-to-br from-purple-700 to-purple-800 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">🧠</div>
            <Brain className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'MSAIDIZI' : 'AI HELPER'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Msaidizi wa kliniki' : 'Clinical assistant'}
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
            className="min-h-[140px] bg-gradient-to-br from-purple-300 to-purple-400 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
          >
            <div className="text-5xl">📱</div>
            <QrCode className="w-8 h-8" />
            <div className="text-center">
              <div className="text-xl font-bold">
                {language === 'sw' ? 'SKANI' : 'SCAN'}
              </div>
              <div className="text-sm opacity-90">
                {language === 'sw' ? 'Skani rekodi za mgonjwa' : 'Scan patient records'}
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

        {/* MSUPU Wallet Section for Health Workers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Wallet className="w-8 h-8 text-emerald-600" />
            <span>{language === 'sw' ? 'M-SUPU Pochi ya Mfanyakazi wa Afya' : 'Health Worker M-SUPU Wallet'}</span>
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
                  className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
                >
                  <DollarSign className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Vifaa vya matibabu' : 'Medical equipment'}</div>
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

                {/* Rewards */}
                <button
                  onClick={() => setActiveModal('rewards')}
                  className="w-full p-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-2xl hover:from-purple-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg min-h-[60px] flex items-center space-x-3"
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

      {/* Patients Modal */}
      {activeModal === 'patients' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '👥 Wagonjwa Wako' : '👥 Your Patients'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {language === 'sw' ? 'Orodha ya Wagonjwa' : 'Patient List'}
              </h3>
              <button
                onClick={() => setActiveModal('addPatient')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'sw' ? 'Ongeza Mgonjwa' : 'Add Patient'}</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {patients.map((patient) => (
                <div key={patient.id} className="p-6 bg-gray-50 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">
                        {language === 'sw' ? 'Umri' : 'Age'}: {patient.age} • {patient.gender === 'male' ? (language === 'sw' ? 'Mwanaume' : 'Male') : (language === 'sw' ? 'Mwanamke' : 'Female')}
                      </p>
                      <p className="text-sm text-gray-600">{patient.location}</p>
                      {patient.phone && (
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{patient.phone}</span>
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      patient.vaccinationStatus === 'up_to_date' ? 'bg-green-100 text-green-800' :
                      patient.vaccinationStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patient.vaccinationStatus === 'up_to_date' ? (language === 'sw' ? 'SAWA' : 'UP TO DATE') :
                       patient.vaccinationStatus === 'overdue' ? (language === 'sw' ? 'UMECHELEWA' : 'OVERDUE') :
                       (language === 'sw' ? 'NUSU' : 'PARTIAL')}
                    </span>
                  </div>
                  
                  {patient.nextAppointment && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Miadi ijayo' : 'Next appointment'}: {patient.nextAppointment.toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveModal('viewPatient')}
                      className="min-h-[48px] bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all transform hover:scale-105"
                    >
                      {language === 'sw' ? 'ONA' : 'VIEW'}
                    </button>
                    <button
                      onClick={() => setActiveModal('scheduleAppointment')}
                      className="min-h-[48px] bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all transform hover:scale-105"
                    >
                      {language === 'sw' ? 'PANGA' : 'SCHEDULE'}
                    </button>
                    <button
                      onClick={() => setActiveModal('vaccinate')}
                      className="min-h-[48px] bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all transform hover:scale-105"
                    >
                      {language === 'sw' ? 'CHANJO' : 'VACCINATE'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Vaccines Modal */}
      {activeModal === 'vaccines' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '💉 Hifadhi ya Chanjo' : '💉 Vaccine Inventory'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {language === 'sw' ? 'Hifadhi ya Chanjo' : 'Vaccine Stock'}
              </h3>
              <button
                onClick={() => setActiveModal('addVaccine')}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'sw' ? 'Ongeza Chanjo' : 'Add Vaccine'}</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {vaccines.map((vaccine) => (
                <div key={vaccine.id} className="p-6 bg-gray-50 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{vaccine.name}</h3>
                      <p className="text-sm text-gray-600">{language === 'sw' ? 'Nambari ya kundi' : 'Batch'}: {vaccine.batchNumber}</p>
                      <p className="text-sm text-gray-600">{language === 'sw' ? 'Mtengenezaji' : 'Manufacturer'}: {vaccine.manufacturer}</p>
                      <p className="text-sm text-gray-600">{language === 'sw' ? 'Mwisho' : 'Expires'}: {vaccine.expiryDate.toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      vaccine.status === 'in_stock' ? 'bg-green-100 text-green-800' :
                      vaccine.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vaccine.status === 'in_stock' ? '✅ ' + (language === 'sw' ? 'ZINAPATIKANA' : 'IN STOCK') :
                       vaccine.status === 'low_stock' ? '🟡 ' + (language === 'sw' ? 'HISA KIDOGO' : 'LOW STOCK') :
                       '🔴 ' + (language === 'sw' ? 'HAIPATIKANI' : 'OUT OF STOCK')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">{language === 'sw' ? 'Hisa' : 'Stock'}: {vaccine.stockQuantity}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActiveModal('updateStock')}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-all"
                      >
                        {language === 'sw' ? 'Sasisha' : 'Update'}
                      </button>
                      <button
                        onClick={() => setActiveModal('vaccineHistory')}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-all"
                      >
                        {language === 'sw' ? 'Historia' : 'History'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Placeholder Modals */}
      {(activeModal === 'addPatient' || activeModal === 'viewPatient' || activeModal === 'scheduleAppointment' || activeModal === 'vaccinate') && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '👥 Usimamizi wa Wagonjwa' : '👥 Patient Management'}
          size="md"
        >
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {activeModal === 'addPatient' ? (language === 'sw' ? 'Ongeza Mgonjwa Mpya' : 'Add New Patient') :
               activeModal === 'viewPatient' ? (language === 'sw' ? 'Ona Mgonjwa' : 'View Patient') :
               activeModal === 'scheduleAppointment' ? (language === 'sw' ? 'Panga Miadi' : 'Schedule Appointment') :
               (language === 'sw' ? 'Toa Chanjo' : 'Give Vaccination')}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'sw' 
                ? 'Kipengele hiki kitaongezwa hivi karibuni'
                : 'This feature will be available soon'
              }
            </p>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-blue-800 text-sm">
                {language === 'sw' 
                  ? 'Utaweza kusimamia rekodi za wagonjwa, kupanga miadi, na kutoa chanjo'
                  : 'You will be able to manage patient records, schedule appointments, and administer vaccines'
                }
              </p>
            </div>
          </div>
        </Modal>
      )}

      {(activeModal === 'addVaccine' || activeModal === 'updateStock' || activeModal === 'vaccineHistory') && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '💉 Usimamizi wa Chanjo' : '💉 Vaccine Management'}
          size="md"
        >
          <div className="text-center py-8">
            <Syringe className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {activeModal === 'addVaccine' ? (language === 'sw' ? 'Ongeza Chanjo Mpya' : 'Add New Vaccine') :
               activeModal === 'updateStock' ? (language === 'sw' ? 'Sasisha Hisa' : 'Update Stock') :
               (language === 'sw' ? 'Historia ya Chanjo' : 'Vaccine History')}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'sw' 
                ? 'Kipengele hiki kitaongezwa hivi karibuni'
                : 'This feature will be available soon'
              }
            </p>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-green-800 text-sm">
                {language === 'sw' 
                  ? 'Utaweza kusimamia hifadhi ya chanjo, kufuatilia mwisho, na kuona historia'
                  : 'You will be able to manage vaccine inventory, track expiry, and view history'
                }
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* All Modals */}
      <BSenseAI
        isOpen={activeModal === 'bsenseAI'}
        onClose={() => setActiveModal(null)}
        userRole="health_worker"
      />

      <QRScanner
        isOpen={activeModal === 'qrScanner'}
        onClose={() => setActiveModal(null)}
        onScan={(data) => {
          console.log('QR Scanned:', data);
          setActiveModal(null);
          addNotification({
            title: language === 'sw' ? 'Rekodi za Mgonjwa Zimepatikana' : 'Patient Records Retrieved',
            message: language === 'sw' ? 'Rekodi za mgonjwa zimepatikana' : 'Patient records have been retrieved',
            type: 'success',
            read: false
          });
        }}
      />

      <ServiceRequestModal
        isOpen={activeModal === 'transport'}
        onClose={() => setActiveModal(null)}
        onRequest={handleServiceRequest}
        serviceType="transport"
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