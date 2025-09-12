import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatsCard } from '../common/StatsCard';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { RewardsModal } from '../common/RewardsModal';
import { CreditProfileCard } from '../wallet/CreditProfileCard';
import { LoanApplicationForm, MedicalLoanOptions, LoanPaymentForm } from '../wallet/loans';
import { AddSavingsForm } from '../wallet/AddSavingsForm';
import { SHAContributionForm, SHALoanRequestForm } from '../wallet/sha';
import { CreditReportModal } from '../wallet/CreditReportModal';
import {
  Wallet,
  Heart,
  Users,
  MapPin,
  Phone,
  Calendar,
  Star,
  TrendingUp,
  Shield,
  DollarSign,
  Plus,
  CreditCard,
  PiggyBank,
  FileText,
  AlertCircle,
  CheckCircle,
  Car,
  Stethoscope,
  Award
} from 'lucide-react';

export const CaregiverDashboard: React.FC = () => {
  const { language } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');

  // Mock wallet data
  const walletData = {
    balance: 15750,
    savings: 8500,
    totalLoans: 2,
    activeLoans: 1,
    creditScore: 750,
    loanLimit: 25000,
    recentTransactions: [
      { id: 1, type: 'savings', amount: 1000, date: '2024-01-15', description: 'Monthly savings' },
      { id: 2, type: 'loan_payment', amount: -500, date: '2024-01-10', description: 'Medical loan payment' },
      { id: 3, type: 'reward', amount: 250, date: '2024-01-08', description: 'Community service reward' },
    ],
    activeLoansData: [
      {
        id: 1,
        type: 'Medical Emergency',
        amount: 5000,
        remaining: 2500,
        nextPayment: 500,
        dueDate: '2024-02-01',
        status: 'current'
      }
    ]
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedLoanType('');
  };

  const handleModalSuccess = () => {
    // Handle success actions (refresh data, show toast, etc.)
    handleModalClose();
  };

  const handleLoanApplication = (loanType: string) => {
    setSelectedLoanType(loanType);
    setActiveModal('loanApplication');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {language === 'sw' ? 'Karibu, Mzazi' : 'Welcome, Caregiver'}
            </h1>
            <p className="text-green-100">
              {language === 'sw' 
                ? 'Uongozi wa afya ya jamii yako'
                : 'Managing your family\'s health and wellness'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">KES {walletData.balance.toLocaleString()}</div>
            <div className="text-green-100">{language === 'sw' ? 'Salio' : 'Balance'}</div>
          </div>
        </div>
      </div>

      {/* M-SUPU Wallet Overview - Primary Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-green-600" />
          <span>{language === 'sw' ? 'M-SUPU Pochi - Muhtasari' : 'M-SUPU Wallet - Overview'}</span>
        </h2>

        {/* Wallet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title={language === 'sw' ? 'Akiba' : 'Savings'}
            value={`KES ${walletData.savings.toLocaleString()}`}
            icon={PiggyBank}
            color="green"
          />
          <StatsCard
            title={language === 'sw' ? 'Alama za Mkopo' : 'Credit Score'}
            value={walletData.creditScore.toString()}
            icon={TrendingUp}
            color="blue"
          />
          <StatsCard
            title={language === 'sw' ? 'Mikopo Hai' : 'Active Loans'}
            value={walletData.activeLoans.toString()}
            icon={CreditCard}
            color="orange"
          />
          <StatsCard
            title={language === 'sw' ? 'Kiwango cha Mkopo' : 'Loan Limit'}
            value={`KES ${walletData.loanLimit.toLocaleString()}`}
            icon={Shield}
            color="purple"
          />
        </div>

        {/* Wallet Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Credit Profile Card */}
          <div className="lg:col-span-2">
            <CreditProfileCard />
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}
            </h3>

            {/* Apply for Loan */}
            <button
              onClick={() => setActiveModal('medicalLoanOptions')}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[48px]"
              aria-label={language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan'}
            >
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan'}</div>
                  <div className="text-sm opacity-90">{language === 'sw' ? 'Matibabu na usafiri' : 'Medical & transport'}</div>
                </div>
              </div>
            </button>

            {/* Add Savings */}
            <button
              onClick={() => setActiveModal('addSavings')}
              className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg min-h-[48px]"
              aria-label={language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}</div>
                  <div className="text-sm opacity-90">{language === 'sw' ? 'Hifadhi ya jamii' : 'Community savings'}</div>
                </div>
              </div>
            </button>

            {/* Loan Payment */}
            <button
              onClick={() => setActiveModal('loanPayment')}
              className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[48px]"
              aria-label={language === 'sw' ? 'Lipa Mkopo' : 'Loan Payment'}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{language === 'sw' ? 'Lipa Mkopo' : 'Loan Payment'}</div>
                  <div className="text-sm opacity-90">{language === 'sw' ? 'Malipo ya mkopo' : 'Repay loan'}</div>
                </div>
              </div>
            </button>

            {/* View Credit Report */}
            <button
              onClick={() => setActiveModal('creditReport')}
              className="w-full p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg min-h-[48px]"
              aria-label={language === 'sw' ? 'Ona Ripoti ya Mkopo' : 'View Credit Report'}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{language === 'sw' ? 'Ripoti ya Mkopo' : 'Credit Report'}</div>
                  <div className="text-sm opacity-90">{language === 'sw' ? 'Historia na alama' : 'History & score'}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* SHA (Social Health Insurance) Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Bima ya Afya ya Kijamii (SHA)' : 'Social Health Insurance (SHA)'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'sw' 
                  ? 'Jiunge na bima ya afya ya jamii'
                  : 'Join the community health insurance program'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Register & Contribute */}
            <button
              onClick={() => setActiveModal('shaContribution')}
              className="p-6 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-left min-h-[48px]"
              aria-label={language === 'sw' ? 'Changia SHA' : 'Contribute to SHA'}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {language === 'sw' ? 'Jiunge & Changia' : 'Register & Contribute'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {language === 'sw' 
                      ? 'Tumia akiba zako za jamii kuchangia SHA'
                      : 'Use your community savings to contribute to SHA'
                    }
                  </p>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">
                    {language === 'sw' ? 'Changia Sasa' : 'Contribute Now'} →
                  </div>
                </div>
              </div>
            </button>

            {/* Request SHA Loan */}
            <button
              onClick={() => setActiveModal('shaLoanRequest')}
              className="p-6 border-2 border-green-200 dark:border-green-700 rounded-xl hover:border-green-400 dark:hover:border-green-500 transition-colors text-left min-h-[48px]"
              aria-label={language === 'sw' ? 'Omba Mkopo wa SHA' : 'Request SHA Loan'}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {language === 'sw' ? 'Omba Mkopo wa SHA' : 'Request SHA Loan'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {language === 'sw' 
                      ? 'Pata mkopo wa kujiunga na SHA'
                      : 'Get a loan to register for SHA'
                    }
                  </p>
                  <div className="text-green-600 dark:text-green-400 font-semibold">
                    {language === 'sw' ? 'Omba Mkopo' : 'Request Loan'} →
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Active Loans */}
        {walletData.activeLoansData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-orange-600" />
              <span>{language === 'sw' ? 'Mikopo Hai' : 'Active Loans'}</span>
            </h3>

            <div className="space-y-4">
              {walletData.activeLoansData.map((loan) => (
                <div key={loan.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{loan.type}</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div>{language === 'sw' ? 'Kiasi' : 'Amount'}: KES {loan.amount.toLocaleString()}</div>
                        <div>{language === 'sw' ? 'Kimebaki' : 'Remaining'}: KES {loan.remaining.toLocaleString()}</div>
                        <div>{language === 'sw' ? 'Malipo ya Ijayo' : 'Next Payment'}: KES {loan.nextPayment.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        loan.status === 'current' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {loan.status === 'current' 
                          ? (language === 'sw' ? 'Sawa' : 'Current')
                          : (language === 'sw' ? 'Kuchelewa' : 'Overdue')
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {language === 'sw' ? 'Tarehe' : 'Due'}: {loan.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Secondary Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Emergency Transport */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Usafiri wa Dharura' : 'Emergency Transport'}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'sw' 
              ? 'Omba usafiri wa haraka wa kimatibabu'
              : 'Request immediate medical transport'
            }
          </p>
          <button
            onClick={() => setActiveModal('emergencyTransport')}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors min-h-[48px]"
            aria-label={language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}
          >
            {language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}
          </button>
        </div>

        {/* Health Services */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Huduma za Afya' : 'Health Services'}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'sw' 
              ? 'Pata huduma za afya na ushauri'
              : 'Access health services and consultations'
            }
          </p>
          <button 
            onClick={() => setActiveModal('healthServices')}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors min-h-[48px]"
          >
            {language === 'sw' ? 'Ona Huduma' : 'View Services'}
          </button>
        </div>

        {/* Community Rewards */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Zawadi za Jamii' : 'Community Rewards'}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'sw' 
              ? 'Pata alama kwa ushiriki wa jamii'
              : 'Earn points for community participation'
            }
          </p>
          <button
            onClick={() => setActiveModal('rewards')}
            className="w-full px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors min-h-[48px]"
            aria-label={language === 'sw' ? 'Ona Zawadi' : 'View Rewards'}
          >
            {language === 'sw' ? 'Ona Zawadi' : 'View Rewards'}
          </button>
        </div>
      </div>

      {/* Modals */}
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

      <ServiceRequestModal
        isOpen={activeModal === 'emergencyTransport'}
        onClose={handleModalClose}
        onRequest={(data) => {
          console.log('Service requested:', data);
          handleModalClose();
        }}
        serviceType="transport"
      />

      <RewardsModal
        isOpen={activeModal === 'rewards'}
        onClose={handleModalClose}
        userPoints={150}
        onRedeem={(item) => {
          console.log('Reward redeemed:', item);
          handleModalClose();
        }}
      />
    </div>
  );
};