import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { ProgressBar } from '../common/ProgressBar';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  Wallet, 
  TrendingUp, 
  Award, 
  CreditCard, 
  PiggyBank,
  Target,
  FileText,
  Brain,
  DollarSign,
  Plus,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb
} from 'lucide-react';

interface WalletOverviewProps {
  onApplyLoan: () => void;
  onAddSavings: () => void;
  onLoanPayment: () => void;
  onCreditReport: () => void;
  onCreditCoach: () => void;
  onRewards: () => void;
}

export const WalletOverview: React.FC<WalletOverviewProps> = ({
  onApplyLoan,
  onAddSavings,
  onLoanPayment,
  onCreditReport,
  onCreditCoach,
  onRewards
}) => {
  const { language } = useLanguage();
  const { showToast } = useNotification();
  const [showImprovementTips, setShowImprovementTips] = useState(false);

  const walletData = {
    trustLevel: 'Bronze',
    creditScore: 600,
    creditScoreMax: 850,
    savings: 1250,
    loanReadiness: 55,
    eligibilityStatus: 'Not Assessed',
    recentActivity: [
      { type: 'deposit', amount: 500, date: '2024-01-15', description: 'M-Pesa Deposit' },
      { type: 'savings', amount: 200, date: '2024-01-14', description: 'Community Savings' },
      { type: 'withdrawal', amount: -150, date: '2024-01-13', description: 'Medical Transport' }
    ],
    rewardPoints: 150
  };

  const improvementTips = [
    {
      icon: PiggyBank,
      tip: language === 'sw' ? 'Ongeza akiba yako kila wiki' : 'Increase your savings weekly',
      impact: '+15 points'
    },
    {
      icon: Clock,
      tip: language === 'sw' ? 'Lipa mikopo kwa wakati' : 'Pay loans on time',
      impact: '+25 points'
    },
    {
      icon: Target,
      tip: language === 'sw' ? 'Shiriki katika shughuli za jamii' : 'Participate in community activities',
      impact: '+10 points'
    },
    {
      icon: FileText,
      tip: language === 'sw' ? 'Kamili wasifu wako' : 'Complete your profile',
      impact: '+20 points'
    }
  ];

  const quickActions = [
    {
      id: 'apply-loan',
      label: language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan',
      sublabel: language === 'sw' ? 'Matibabu & Usafiri' : 'Medical & Transport',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      onClick: onApplyLoan
    },
    {
      id: 'add-savings',
      label: language === 'sw' ? 'Ongeza Akiba' : 'Add Savings',
      sublabel: language === 'sw' ? 'Akiba za Jamii' : 'Community Savings',
      icon: PiggyBank,
      color: 'from-green-500 to-green-600',
      onClick: onAddSavings
    },
    {
      id: 'loan-payment',
      label: language === 'sw' ? 'Lipa Mkopo' : 'Loan Payment',
      sublabel: language === 'sw' ? 'Rudisha Mkopo' : 'Repay Loan',
      icon: ArrowUp,
      color: 'from-purple-500 to-purple-600',
      onClick: onLoanPayment
    },
    {
      id: 'credit-report',
      label: language === 'sw' ? 'Ripoti ya Mkopo' : 'Credit Report',
      sublabel: language === 'sw' ? 'Historia & Alama' : 'History & Score',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      onClick: onCreditReport
    },
    {
      id: 'credit-coach',
      label: language === 'sw' ? 'Mshauri wa Mkopo' : 'Credit Coach',
      sublabel: language === 'sw' ? 'Ushauri wa Kifedha' : 'Financial Advice',
      icon: Brain,
      color: 'from-orange-500 to-orange-600',
      onClick: onCreditCoach
    },
    {
      id: 'rewards',
      label: language === 'sw' ? 'Zawadi' : 'Rewards',
      sublabel: `${walletData.rewardPoints} ${language === 'sw' ? 'pointi' : 'points'}`,
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      onClick: onRewards
    }
  ];

  const getTrustLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'bronze': return 'from-amber-600 to-amber-700';
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'gold': return 'from-yellow-500 to-yellow-600';
      case 'platinum': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'emerald';
    if (score >= 650) return 'yellow';
    if (score >= 550) return 'orange';
    return 'red';
  };

  const getEligibilityColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'eligible': return 'text-green-600';
      case 'not eligible': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Trust Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Kiwango cha Uaminifu' : 'Trust Level'}
            </h3>
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div className={`inline-block px-4 py-2 bg-gradient-to-r ${getTrustLevelColor(walletData.trustLevel)} text-white rounded-full font-bold text-lg`}>
            {walletData.trustLevel}
          </div>
        </motion.div>

        {/* Credit Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Alama ya Mkopo' : 'Credit Score'}
            </h3>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <AnimatedCounter value={walletData.creditScore} />
          </div>
          <ProgressBar
            value={walletData.creditScore}
            max={walletData.creditScoreMax}
            color={getCreditScoreColor(walletData.creditScore)}
            animated={true}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {language === 'sw' ? 'Kati ya' : 'Out of'} {walletData.creditScoreMax}
          </p>
        </motion.div>

        {/* Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Akiba' : 'Savings'}
            </h3>
            <PiggyBank className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            KSh <AnimatedCounter value={walletData.savings} />
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <ArrowUp className="w-4 h-4" />
            <span>+12% {language === 'sw' ? 'mwezi huu' : 'this month'}</span>
          </div>
        </motion.div>

        {/* Loan Readiness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Utayari wa Mkopo' : 'Loan Readiness'}
            </h3>
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            <AnimatedCounter value={walletData.loanReadiness} suffix="%" />
          </div>
          <ProgressBar
            value={walletData.loanReadiness}
            max={100}
            color="purple"
            animated={true}
          />
          <motion.button
            onClick={() => setShowImprovementTips(!showImprovementTips)}
            whileHover={{ scale: 1.05 }}
            className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{language === 'sw' ? 'Vidokezo vya Kuboresha' : 'Improvement Tips'}</span>
          </motion.button>
        </motion.div>

        {/* Eligibility Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Hali ya Ustahiki' : 'Eligibility Status'}
            </h3>
            <AlertCircle className="w-6 h-6 text-gray-600" />
          </div>
          <div className={`text-xl font-bold ${getEligibilityColor(walletData.eligibilityStatus)} mb-2`}>
            {walletData.eligibilityStatus}
          </div>
          <button
            onClick={() => showToast(
              language === 'sw' ? 'Ukaguzi Umeanza' : 'Assessment Started',
              language === 'sw' ? 'Ukaguzi wa ustahiki umeanza' : 'Eligibility assessment has started',
              'info'
            )}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {language === 'sw' ? 'Anza Ukaguzi' : 'Start Assessment'}
          </button>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Shughuli za Hivi Karibuni' : 'Recent Activity'}
            </h3>
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            {walletData.recentActivity.slice(0, 3).map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.amount > 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {activity.amount > 0 ? 
                      <ArrowUp className="w-4 h-4 text-green-600" /> : 
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${
                  activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {activity.amount > 0 ? '+' : ''}KSh {Math.abs(activity.amount)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Improvement Tips */}
      {showImprovementTips && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700"
        >
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>{language === 'sw' ? 'Vidokezo vya Kuboresha Alama' : 'Credit Score Improvement Tips'}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvementTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <tip.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{tip.tip}</p>
                  <p className="text-xs text-green-600 font-bold">{tip.impact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className={`relative overflow-hidden bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group`}
          >
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <action.icon className="w-6 h-6" />
                <span className="font-bold text-lg">{action.label}</span>
              </div>
              <p className="text-sm opacity-90">{action.sublabel}</p>
            </div>

            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full"
              whileHover={{ translateX: '200%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};