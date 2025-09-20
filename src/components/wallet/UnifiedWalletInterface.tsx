import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useData } from '../../contexts/DataContext';
import { walletService, Transaction, Loan, CreditProfile } from '../../services/walletService';
import { CreditProfileCard } from './CreditProfileCard';
import { CreditCoachChat } from './CreditCoachChat';
import { MedicalLoanOptions, LoanApplicationForm, LoanPaymentForm } from './loans';
import { AddSavingsForm } from './AddSavingsForm';
import { SHAContributionForm, SHALoanRequestForm } from './sha';
import { CreditReportModal } from './CreditReportModal';
import { 
  Wallet,
  TrendingUp,
  DollarSign,
  PiggyBank,
  CreditCard,
  Award,
  Target,
  Star,
  Shield,
  Brain,
  Plus,
  Eye,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Smartphone,
  Banknote,
  Gift,
  Users,
  Activity,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Zap
} from 'lucide-react';

interface UnifiedWalletInterfaceProps {
  className?: string;
  embedded?: boolean;
}

export const UnifiedWalletInterface: React.FC<UnifiedWalletInterfaceProps> = ({
  className = '',
  embedded = false
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification } = useData();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [showCreditCoach, setShowCreditCoach] = useState(false);
  
  // Wallet data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [creditProfile, setCreditProfile] = useState<CreditProfile | null>(null);
  const [walletSummary, setWalletSummary] = useState({
    totalBalance: 0,
    totalSavings: 0,
    totalLoans: 0,
    activeLoans: 0,
    creditScore: 300,
    monthlyIncome: 0,
    monthlyExpenses: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load wallet data
  useEffect(() => {
    if (!user) return;

    const loadWalletData = async () => {
      setIsLoading(true);
      
      try {
        // Load transactions
        const userTransactions = walletService.getTransactionHistory(user.id, 10);
        setTransactions(userTransactions);

        // Load loans
        const userLoans = walletService.getUserLoans(user.id);
        setLoans(userLoans);

        // Load or create credit profile
        let profile = walletService.getCreditProfile(user.id);
        if (!profile) {
          profile = await walletService.updateCreditScore(user.id);
        }
        setCreditProfile(profile);

        // Load wallet summary
        const summary = walletService.getWalletSummary(user.id);
        setWalletSummary(summary);

      } catch (error) {
        console.error('Error loading wallet data:', error);
        addNotification({
          title: t('status.error'),
          message: language === 'sw' ? 'Imeshindwa kupakia data ya pochi' : 'Failed to load wallet data',
          type: 'error',
          read: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWalletData();
  }, [user, t, language, addNotification]);

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync offline transactions when coming back online
      walletService.syncOfflineTransactions();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedLoanType('');
    setShowCreditCoach(false);
  };

  const handleModalSuccess = () => {
    // Refresh wallet data after successful operation
    if (user) {
      const summary = walletService.getWalletSummary(user.id);
      setWalletSummary(summary);
      
      const userTransactions = walletService.getTransactionHistory(user.id, 10);
      setTransactions(userTransactions);
      
      const userLoans = walletService.getUserLoans(user.id);
      setLoans(userLoans);
    }
    
    handleModalClose();
  };

  const handleLoanApplication = (loanType: string) => {
    setSelectedLoanType(loanType);
    setActiveModal('loanApplication');
  };

  const refreshWalletData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update credit profile
      const updatedProfile = await walletService.updateCreditScore(user.id);
      setCreditProfile(updatedProfile);
      
      // Refresh summary
      const summary = walletService.getWalletSummary(user.id);
      setWalletSummary(summary);
      
      addNotification({
        title: t('status.success'),
        message: language === 'sw' ? 'Data ya pochi imesasishwa' : 'Wallet data refreshed',
        type: 'success',
        read: false
      });
    } catch (error) {
      console.error('Error refreshing wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">
          {language === 'sw' ? 'Tafadhali ingia kuona pochi yako' : 'Please login to view your wallet'}
        </p>
      </div>
    );
  }

  const containerClass = embedded 
    ? `space-y-6 ${className}`
    : `min-h-screen dashboard-bg-msupu ${className}`;

  return (
    <div className={containerClass}>
      {/* Header - only show if not embedded */}
      {!embedded && (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-6 shadow-xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-6xl">💳</div>
                <div>
                  <h1 className="text-4xl font-black mb-2">
                    {t('wallet.title')}
                  </h1>
                  <p className="text-xl text-teal-100 font-bold">
                    {language === 'sw' ? 'Akiba na Mikopo' : 'Savings & Loans'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {!isOnline && (
                  <div className="bg-red-500/20 px-3 py-1 rounded-full text-sm">
                    {language === 'sw' ? 'Nje ya mtandao' : 'Offline'}
                  
                  </div>
                )}
                <button
                  onClick={refreshWalletData}
                  disabled={isLoading}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  aria-label="Refresh wallet data"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={embedded ? '' : 'max-w-6xl mx-auto px-4 py-8'}>
        {/* Wallet Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8" />
              <span className="text-sm opacity-80">{t('wallet.balance')}</span>
            </div>
            <div className="text-3xl font-black mb-2">
              {formatAmount(walletSummary.totalBalance)}
            </div>
            <div className="text-emerald-100 text-sm">
              {language === 'sw' ? 'Salio la jumla' : 'Total balance'}
            </div>
          </div>

          {/* Savings Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <PiggyBank className="w-8 h-8" />
              <span className="text-sm opacity-80">{t('wallet.savings')}</span>
            </div>
            <div className="text-3xl font-black mb-2">
              {formatAmount(walletSummary.totalSavings)}
            </div>
            <div className="text-blue-100 text-sm">
              {language === 'sw' ? 'Akiba za kibinafsi' : 'Personal savings'}
            </div>
          </div>

          {/* Credit Score Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8" />
              <span className="text-sm opacity-80">{t('wallet.credit_score')}</span>
            </div>
            <div className="text-3xl font-black mb-2">
              {walletSummary.creditScore}
            </div>
            <div className="text-purple-100 text-sm">
              {creditProfile?.trustLevel && (
                <span className="capitalize">{creditProfile.trustLevel} {language === 'sw' ? 'kiwango' : 'level'}</span>
              )}
            </div>
          </div>

          {/* Active Loans Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8" />
              <span className="text-sm opacity-80">{t('wallet.active_loans')}</span>
            </div>
            <div className="text-3xl font-black mb-2">
              {walletSummary.activeLoans}
            </div>
            <div className="text-orange-100 text-sm">
              {language === 'sw' ? 'Mikopo hai' : 'Active loans'}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Credit Profile */}
          <div className="lg:col-span-2">
            {creditProfile && (
              <CreditProfileCard
                creditScore={creditProfile.creditScore}
                savingsBalance={walletSummary.totalSavings}
                eligibilityStatus={creditProfile.eligibilityStatus}
                loanReadiness={creditProfile.loanReadiness}
                trustLevel={creditProfile.trustLevel}
                className="mb-6"
              />
            )}

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <span>{language === 'sw' ? 'Shughuli za Hivi Karibuni' : 'Recent Activity'}</span>
                </h3>
                <button
                  onClick={() => setActiveModal('transactionHistory')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {t('action.view')} {language === 'sw' ? 'zote' : 'all'}
                </button>
              </div>

              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          transaction.type === 'deposit' || transaction.type === 'savings' ? 'bg-green-100 text-green-600' :
                          transaction.type === 'withdrawal' ? 'bg-red-100 text-red-600' :
                          transaction.type === 'loan_payment' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'savings' ? <ArrowUp className="w-4 h-4" /> :
                           transaction.type === 'withdrawal' ? <ArrowDown className="w-4 h-4" /> :
                           <DollarSign className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.timestamp.toLocaleDateString()} • {transaction.paymentMethod}
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold text-sm ${
                        transaction.type === 'withdrawal' || transaction.type === 'loan_payment' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'withdrawal' || transaction.type === 'loan_payment' ? '-' : '+'}
                        {formatAmount(transaction.amount)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'sw' ? 'Hakuna shughuli bado' : 'No transactions yet'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-600" />
                <span>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</span>
              </h3>

              <div className="space-y-3">
                {/* Add Savings */}
                <button
                  onClick={() => setActiveModal('addSavings')}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-3"
                >
                  <PiggyBank className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{t('wallet.add_savings')}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Ongeza akiba' : 'Increase savings'}</div>
                  </div>
                </button>

                {/* Apply for Loan */}
                <button
                  onClick={() => setActiveModal('medicalLoanOptions')}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-3"
                >
                  <DollarSign className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{t('wallet.apply_loan')}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Omba mkopo' : 'Apply for loan'}</div>
                  </div>
                </button>

                {/* Loan Payment */}
                {walletSummary.activeLoans > 0 && (
                  <button
                    onClick={() => setActiveModal('loanPayment')}
                    className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-3"
                  >
                    <CreditCard className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-bold">{t('wallet.loan_payment')}</div>
                      <div className="text-sm opacity-90">{language === 'sw' ? 'Lipa mkopo' : 'Pay loan'}</div>
                    </div>
                  </button>
                )}

                {/* Credit Report */}
                <button
                  onClick={() => setActiveModal('creditReport')}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-3"
                >
                  <Eye className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{t('wallet.credit_report')}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Ona ripoti' : 'View report'}</div>
                  </div>
                </button>

                {/* Credit Coach */}
                <button
                  onClick={() => setShowCreditCoach(true)}
                  className="w-full p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-3"
                >
                  <Brain className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold">{t('wallet.credit_coach')}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Mshauri' : 'Advisor'}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* SHA Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {language === 'sw' ? 'Bima ya Afya ya Kijamii (SHA)' : 'Social Health Insurance (SHA)'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {language === 'sw' 
                      ? 'Jiunge na bima ya afya ya jamii'
                      : 'Join the community health insurance program'
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setActiveModal('shaContribution')}
                  className="p-4 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {t('wallet.sha_contribution')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'sw' ? 'Changia SHA' : 'Contribute to SHA'}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal('shaLoanRequest')}
                  className="p-4 border-2 border-green-200 dark:border-green-700 rounded-xl hover:border-green-400 dark:hover:border-green-500 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {t('wallet.sha_loan')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'sw' ? 'Omba mkopo wa SHA' : 'Request SHA loan'}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Active Loans Summary */}
            {loans.filter(l => l.status === 'active').length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                  <span>{t('wallet.active_loans')}</span>
                </h3>

                <div className="space-y-3">
                  {loans.filter(l => l.status === 'active').map((loan) => (
                    <div key={loan.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{loan.loanType}</h4>
                        <span className="text-sm text-green-600 font-medium">
                          {loan.status === 'active' ? (language === 'sw' ? 'Hai' : 'Active') : loan.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex justify-between">
                          <span>{language === 'sw' ? 'Deni' : 'Balance'}:</span>
                          <span className="font-semibold">{formatAmount(loan.remainingBalance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'sw' ? 'Malipo ya mwezi' : 'Monthly payment'}:</span>
                          <span className="font-semibold">{formatAmount(loan.monthlyPayment)}</span>
                        </div>
                        {loan.nextPaymentDate && (
                          <div className="flex justify-between">
                            <span>{language === 'sw' ? 'Tarehe ya malipo' : 'Next payment'}:</span>
                            <span className="font-semibold">{loan.nextPaymentDate.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Additional Actions */}
          <div className="space-y-6">
            {/* Mobile Money Options */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Smartphone className="w-6 h-6 text-green-600" />
                <span>{language === 'sw' ? 'Malipo ya Simu' : 'Mobile Money'}</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">M-Pesa</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Kenya</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <span className="text-2xl">📲</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">MTN Money</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Uganda</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Airtel Money</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Multi-country</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <span>{language === 'sw' ? 'Takwimu' : 'Statistics'}</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'sw' ? 'Mapato ya mwezi' : 'Monthly income'}:</span>
                  <span className="font-bold text-green-600">{formatAmount(walletSummary.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'sw' ? 'Matumizi ya mwezi' : 'Monthly expenses'}:</span>
                  <span className="font-bold text-red-600">{formatAmount(walletSummary.monthlyExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'sw' ? 'Mikopo ya jumla' : 'Total loans'}:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{walletSummary.totalLoans}</span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Download className="w-6 h-6 text-gray-600" />
                <span>{language === 'sw' ? 'Hamisha Data' : 'Export Data'}</span>
              </h3>

              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      const csvData = await walletService.exportTransactionHistory(user.id, 'csv');
                      const blob = new Blob([csvData], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `wallet-history-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Export error:', error);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'sw' ? 'Pakua Historia' : 'Download History'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Modals */}
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
        currentBalance={walletSummary.totalBalance}
        currentSavings={walletSummary.totalSavings}
      />

      <LoanPaymentForm
        isOpen={activeModal === 'loanPayment'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <CreditReportModal
        isOpen={activeModal === 'creditReport'}
        onClose={handleModalClose}
        creditScore={walletSummary.creditScore}
      />

      <SHAContributionForm
        isOpen={activeModal === 'shaContribution'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        currentBalance={walletSummary.totalSavings}
      />

      <SHALoanRequestForm
        isOpen={activeModal === 'shaLoanRequest'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <CreditCoachChat
        isOpen={showCreditCoach}
        onClose={() => setShowCreditCoach(false)}
        userCreditScore={walletSummary.creditScore}
        userSavings={walletSummary.totalSavings}
      />
    </div>
  );
};