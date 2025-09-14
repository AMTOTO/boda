import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../common/Header';
import { WalletOverview } from './WalletOverview';
import { ContributionsMenu } from './ContributionsMenu';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { Modal } from '../common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  Wallet, 
  Plus, 
  CreditCard, 
  PiggyBank, 
  FileText, 
  Brain, 
  Award,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Target,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const MSUPUDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('wallet');
  const [showContributions, setShowContributions] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showCreditReportModal, setShowCreditReportModal] = useState(false);
  const [showCreditCoachModal, setShowCreditCoachModal] = useState(false);

  const tabs = [
    { id: 'wallet', name: language === 'sw' ? 'Pochi' : 'Wallet', icon: Wallet, emoji: '💳' },
    { id: 'loans', name: language === 'sw' ? 'Mikopo' : 'Loans', icon: CreditCard, emoji: '🏦' },
    { id: 'savings', name: language === 'sw' ? 'Akiba' : 'Savings', icon: PiggyBank, emoji: '🐷' },
    { id: 'community', name: language === 'sw' ? 'Jamii' : 'Community', icon: Users, emoji: '👥' }
  ];

  const fabActions = [
    {
      id: 'add-savings',
      label: language === 'sw' ? 'Ongeza Akiba' : 'Add Savings',
      icon: PiggyBank,
      color: 'from-green-500 to-green-600',
      onClick: () => setShowContributions(true)
    },
    {
      id: 'apply-loan',
      label: language === 'sw' ? 'Omba Mkopo' : 'Apply Loan',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      onClick: () => setShowLoanModal(true)
    },
    {
      id: 'credit-coach',
      label: language === 'sw' ? 'Mshauri' : 'Coach',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      onClick: () => setShowCreditCoachModal(true)
    }
  ];

  const handleContribution = (data: any) => {
    showToast(
      language === 'sw' ? 'Mafanikio' : 'Success',
      language === 'sw' ? 'Mchango umewasilishwa kwa mafanikio' : 'Contribution submitted successfully',
      'success'
    );
  };

  const handleApplyLoan = () => {
    setShowLoanModal(true);
  };

  const handleAddSavings = () => {
    setShowContributions(true);
  };

  const handleLoanPayment = () => {
    showToast(
      language === 'sw' ? 'Malipo ya Mkopo' : 'Loan Payment',
      language === 'sw' ? 'Ukurasa wa malipo ya mkopo umefunguliwa' : 'Loan payment page opened',
      'info'
    );
  };

  const handleCreditReport = () => {
    setShowCreditReportModal(true);
  };

  const handleCreditCoach = () => {
    setShowCreditCoachModal(true);
  };

  const handleRewards = () => {
    showToast(
      language === 'sw' ? 'Zawadi' : 'Rewards',
      language === 'sw' ? 'Ukurasa wa zawadi umefunguliwa' : 'Rewards page opened',
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <Header 
        title={language === 'sw' ? 'M-Supu Pochi' : 'M-Supu Wallet'}
        subtitle={language === 'sw' ? `Karibu, ${user?.name}` : `Welcome, ${user?.name}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-2xl shadow-xl border border-purple-200 dark:border-purple-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20'
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
          {activeTab === 'wallet' && (
            <WalletOverview
              onApplyLoan={handleApplyLoan}
              onAddSavings={handleAddSavings}
              onLoanPayment={handleLoanPayment}
              onCreditReport={handleCreditReport}
              onCreditCoach={handleCreditCoach}
              onRewards={handleRewards}
            />
          )}

          {activeTab === 'loans' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'sw' ? 'Mikopo Yangu' : 'My Loans'}
              </h3>
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'sw' ? 'Huna mikopo ya sasa' : 'No active loans'}
                </p>
                <button
                  onClick={handleApplyLoan}
                  className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'savings' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'sw' ? 'Akiba Zangu' : 'My Savings'}
              </h3>
              <div className="text-center py-12">
                <PiggyBank className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'sw' ? 'Anza kuokoa leo' : 'Start saving today'}
                </p>
                <button
                  onClick={handleAddSavings}
                  className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  {language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'sw' ? 'M-Supu ya Jamii' : 'Community M-Supu'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <h4 className="font-bold text-green-800 dark:text-green-400 mb-2">
                    {language === 'sw' ? 'Jumla ya Fedha' : 'Total Funds'}
                  </h4>
                  <p className="text-3xl font-bold text-green-600">KSh 125,000</p>
                </div>
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-2">
                    {language === 'sw' ? 'Wachangiaji' : 'Contributors'}
                  </h4>
                  <p className="text-3xl font-bold text-blue-600">247</p>
                </div>
                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <h4 className="font-bold text-purple-800 dark:text-purple-400 mb-2">
                    {language === 'sw' ? 'Wanufaika' : 'Beneficiaries'}
                  </h4>
                  <p className="text-3xl font-bold text-purple-600">89</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Contributions Modal */}
      <ContributionsMenu
        isOpen={showContributions}
        onClose={() => setShowContributions(false)}
        onContribute={handleContribution}
      />

      {/* Loan Application Modal */}
      <Modal
        isOpen={showLoanModal}
        onClose={() => setShowLoanModal(false)}
        title={language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan'}
        size="lg"
      >
        <div className="text-center py-8">
          <CreditCard className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'sw' ? 'Fomu ya Maombi ya Mkopo' : 'Loan Application Form'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'sw' ? 'Jaza fomu ya maombi ya mkopo' : 'Fill out the loan application form'}
          </p>
          <button
            onClick={() => {
              showToast(
                language === 'sw' ? 'Maombi Yamewasilishwa' : 'Application Submitted',
                language === 'sw' ? 'Maombi yako ya mkopo yamewasilishwa' : 'Your loan application has been submitted',
                'success'
              );
              setShowLoanModal(false);
            }}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {language === 'sw' ? 'Wasilisha Maombi' : 'Submit Application'}
          </button>
        </div>
      </Modal>

      {/* Credit Report Modal */}
      <Modal
        isOpen={showCreditReportModal}
        onClose={() => setShowCreditReportModal(false)}
        title={language === 'sw' ? 'Ripoti ya Mkopo' : 'Credit Report'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'sw' ? 'Ripoti Yako ya Mkopo' : 'Your Credit Report'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'sw' ? 'Historia kamili ya mkopo na alama' : 'Complete credit history and score'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                {language === 'sw' ? 'Alama ya Mkopo' : 'Credit Score'}
              </h4>
              <p className="text-2xl font-bold text-blue-600">600</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                {language === 'sw' ? 'Historia ya Malipo' : 'Payment History'}
              </h4>
              <p className="text-2xl font-bold text-green-600">95%</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Credit Coach Modal */}
      <Modal
        isOpen={showCreditCoachModal}
        onClose={() => setShowCreditCoachModal(false)}
        title={language === 'sw' ? 'Mshauri wa Mkopo' : 'Credit Coach'}
        size="lg"
      >
        <div className="text-center py-8">
          <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'sw' ? 'Mshauri Wako wa Kifedha' : 'Your Financial Advisor'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'sw' ? 'Pata ushauri wa kibinafsi wa kifedha' : 'Get personalized financial advice'}
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
              <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-2">
                {language === 'sw' ? 'Pendekezo la Leo' : "Today's Recommendation"}
              </h4>
              <p className="text-blue-700 dark:text-blue-300">
                {language === 'sw' 
                  ? 'Ongeza akiba yako kwa KSh 200 kila wiki ili kuboresha alama yako ya mkopo.'
                  : 'Increase your savings by KSh 200 weekly to improve your credit score.'
                }
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Floating Action Button */}
      <FloatingActionButton actions={fabActions} />
    </div>
  );
};