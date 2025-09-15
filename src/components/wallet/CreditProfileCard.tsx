import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Star,
  Target,
  Award,
  Clock,
  ArrowUp,
  ArrowDown,
  Info
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';

interface CreditProfileCardProps {
  creditScore: number;
  savingsBalance: number;
  eligibilityStatus: 'approved' | 'pending' | 'denied' | 'not_assessed';
  loanReadiness: number; // 0-100 percentage
  trustLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  recentActivity?: {
    type: 'deposit' | 'withdrawal' | 'loan_payment' | 'savings';
    amount: number;
    date: string;
  }[];
  className?: string;
}

export const CreditProfileCard: React.FC<Partial<CreditProfileCardProps>> = ({
  creditScore = 720,
  savingsBalance = 15000,
  eligibilityStatus = 'approved',
  loanReadiness = 85,
  trustLevel = 'gold',
  recentActivity = [
    { type: 'deposit', amount: 500, date: 'Yesterday' },
    { type: 'savings', amount: 200, date: 'Last week' }
  ],
  className = ''
}) => {
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();

  // Trust level configurations
  const trustLevels = {
    bronze: {
      name: language === 'sw' ? 'Shaba' : 'Bronze',
      color: 'wallet-accent-600',
      bgColor: 'wallet-accent-50',
      icon: Award,
      benefits: language === 'sw' ? 'Mikopo ya kimsingi' : 'Basic loans available'
    },
    silver: {
      name: language === 'sw' ? 'Fedha' : 'Silver',
      color: 'wallet-primary-600',
      bgColor: 'wallet-primary-50',
      icon: Star,
      benefits: language === 'sw' ? 'Mikopo ya wastani' : 'Medium loans available'
    },
    gold: {
      name: language === 'sw' ? 'Dhahabu' : 'Gold',
      color: 'wallet-warning-600',
      bgColor: 'wallet-warning-50',
      icon: Target,
      benefits: language === 'sw' ? 'Mikopo makubwa' : 'Large loans available'
    },
    platinum: {
      name: language === 'sw' ? 'Platinamu' : 'Platinum',
      color: 'wallet-secondary-700',
      bgColor: 'wallet-secondary-50',
      icon: Shield,
      benefits: language === 'sw' ? 'Mikopo yote' : 'All loans available'
    }
  };

  // Eligibility status configurations
  const eligibilityConfig = {
    approved: {
      icon: CheckCircle,
      color: 'text-wallet-trust-approved',
      bgColor: 'bg-wallet-success-50',
      borderColor: 'border-wallet-trust-approved',
      shadowColor: 'shadow-trust-approved',
      text: language === 'sw' ? 'Imeidhinishwa' : 'Approved',
      description: language === 'sw' ? 'Unastahili mkopo' : 'You qualify for loans'
    },
    pending: {
      icon: AlertTriangle,
      color: 'text-wallet-trust-pending',
      bgColor: 'bg-wallet-warning-50',
      borderColor: 'border-wallet-trust-pending',
      shadowColor: 'shadow-trust-pending',
      text: language === 'sw' ? 'Inasubiri' : 'Pending',
      description: language === 'sw' ? 'Ukaguzi unaendelea' : 'Under review'
    },
    denied: {
      icon: XCircle,
      color: 'text-wallet-trust-denied',
      bgColor: 'bg-wallet-error-50',
      borderColor: 'border-wallet-trust-denied',
      shadowColor: 'shadow-trust-denied',
      text: language === 'sw' ? 'Imekataliwa' : 'Denied',
      description: language === 'sw' ? 'Haustahili kwa sasa' : 'Not eligible currently'
    },
    not_assessed: {
      icon: Clock,
      color: 'text-wallet-trust-neutral',
      bgColor: 'bg-wallet-secondary-50',
      borderColor: 'border-wallet-trust-neutral',
      shadowColor: 'shadow-wallet',
      text: language === 'sw' ? 'Haijapimwa' : 'Not Assessed',
      description: language === 'sw' ? 'Hakuna ukaguzi bado' : 'No assessment yet'
    }
  };

  const currentTrust = trustLevels[trustLevel];
  const currentEligibility = eligibilityConfig[eligibilityStatus];
  const TrustIcon = currentTrust.icon;
  const EligibilityIcon = currentEligibility.icon;

  // Calculate credit score color
  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-wallet-success-600';
    if (score >= 650) return 'text-wallet-warning-600';
    return 'text-wallet-error-600';
  };

  // Calculate loan readiness color
  const getLoanReadinessColor = (readiness: number) => {
    if (readiness >= 80) return 'bg-wallet-success-500';
    if (readiness >= 60) return 'bg-wallet-warning-500';
    return 'bg-wallet-error-500';
  };

  // Placeholder for onViewCreditReport function if needed by parent
  const onViewCreditReport = () => {
    console.log('View Credit Report clicked');
    // In a real application, this would navigate or trigger a modal
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-3xl shadow-wallet-xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {/* Header with Trust Level */}
      <div className={`bg-gradient-to-r from-${currentTrust.color} to-${currentTrust.color}/80 p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 pattern-kente opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <TrustIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {language === 'sw' ? 'Kiwango cha Uaminifu' : 'Trust Level'}
                </h3>
                <p className="text-white/80 text-sm">{currentTrust.name}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">{creditScore}</div>
              <div className="text-white/80 text-sm">
                {language === 'sw' ? 'Alama' : 'Score'}
              </div>
            </div>
          </div>

          <div className="text-white/90 text-sm">
            {currentTrust.benefits}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Credit Score Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-wallet-primary-600" />
              <span>{language === 'sw' ? 'Alama za Mkopo' : 'Credit Score'}</span>
            </h4>
            <button 
              className="text-wallet-primary-600 hover:text-wallet-primary-700 transition-colors"
              aria-label={language === 'sw' ? 'Maelezo zaidi' : 'More information'}
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-wallet-primary-50 to-wallet-secondary-50 dark:from-wallet-primary-900/20 dark:to-wallet-secondary-900/20 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-wallet-secondary-600 dark:text-wallet-secondary-400 font-medium">
                {language === 'sw' ? 'Alama Zako' : 'Your Score'}
              </span>
              <span className={`text-3xl font-black ${getCreditScoreColor(creditScore)}`}>
                {creditScore}
              </span>
            </div>

            {/* Credit Score Progress Bar */}
            <div className="w-full bg-wallet-secondary-200 dark:bg-wallet-secondary-700 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  creditScore >= 750 ? 'bg-wallet-success-500' :
                  creditScore >= 650 ? 'bg-wallet-warning-500' : 'bg-wallet-error-500'
                }`}
                style={{ width: `${Math.min((creditScore / 850) * 100, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-wallet-secondary-500 dark:text-wallet-secondary-400">
              <span>300</span>
              <span>850</span>
            </div>
          </div>
        </div>

        {/* Savings Balance */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-wallet-success-600" />
            <span>{language === 'sw' ? 'Akiba' : 'Savings'}</span>
          </h4>

          <div className="bg-gradient-to-r from-wallet-success-50 to-wallet-primary-50 dark:from-wallet-success-900/20 dark:to-wallet-primary-900/20 p-4 rounded-2xl">
            <div className="text-center">
              <div className="text-3xl font-black text-wallet-success-600 dark:text-wallet-success-400 mb-2">
                {formatAmount(savingsBalance)}
              </div>
              <p className="text-wallet-secondary-600 dark:text-wallet-secondary-400 font-medium">
                {language === 'sw' ? 'Jumla ya Akiba' : 'Total Savings'}
              </p>
            </div>
          </div>
        </div>

        {/* Loan Readiness */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-wallet-accent-600" />
            <span>{language === 'sw' ? 'Utayari wa Mkopo' : 'Loan Readiness'}</span>
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-wallet-secondary-600 dark:text-wallet-secondary-400 font-medium">
                {language === 'sw' ? 'Kiwango cha Utayari' : 'Readiness Level'}
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {loanReadiness}%
              </span>
            </div>

            {/* Loan Readiness Progress Bar */}
            <div className="w-full bg-wallet-secondary-200 dark:bg-wallet-secondary-700 rounded-full h-4 relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${loanReadiness}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-4 rounded-full ${getLoanReadinessColor(loanReadiness)} relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </motion.div>
            </div>

            <div className="text-sm text-wallet-secondary-500 dark:text-wallet-secondary-400">
              {loanReadiness >= 80 
                ? (language === 'sw' ? 'Tayari kwa mkopo mkubwa' : 'Ready for large loans')
                : loanReadiness >= 60 
                ? (language === 'sw' ? 'Tayari kwa mkopo wa wastani' : 'Ready for medium loans')
                : (language === 'sw' ? 'Ongeza akiba kuongeza utayari' : 'Increase savings to improve readiness')
              }
            </div>
          </div>
        </div>

        {/* Eligibility Status */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-wallet-primary-600" />
            <span>{language === 'sw' ? 'Hali ya Ustahili' : 'Eligibility Status'}</span>
          </h4>

          <div className={`${currentEligibility.bgColor} ${currentEligibility.borderColor} border-2 ${currentEligibility.shadowColor} p-4 rounded-2xl`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${currentEligibility.bgColor} rounded-xl flex items-center justify-center`}>
                <EligibilityIcon className={`w-6 h-6 ${currentEligibility.color}`} />
              </div>
              <div className="flex-1">
                <div className={`font-bold text-lg ${currentEligibility.color}`}>
                  {currentEligibility.text}
                </div>
                <div className="text-sm text-wallet-secondary-600 dark:text-wallet-secondary-400">
                  {currentEligibility.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-wallet-secondary-600" />
              <span>{language === 'sw' ? 'Shughuli za Hivi Karibuni' : 'Recent Activity'}</span>
            </h4>

            <div className="space-y-3 max-h-32 overflow-y-auto">
              {recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-wallet-secondary-50 dark:bg-wallet-secondary-900/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'deposit' ? 'bg-wallet-success-100 text-wallet-success-600' :
                      activity.type === 'withdrawal' ? 'bg-wallet-error-100 text-wallet-error-600' :
                      activity.type === 'loan_payment' ? 'bg-wallet-warning-100 text-wallet-warning-600' :
                      'bg-wallet-primary-100 text-wallet-primary-600'
                    }`}>
                      {activity.type === 'deposit' ? <ArrowUp className="w-4 h-4" /> :
                       activity.type === 'withdrawal' ? <ArrowDown className="w-4 h-4" /> :
                       <DollarSign className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {activity.type === 'deposit' ? (language === 'sw' ? 'Amana' : 'Deposit') :
                         activity.type === 'withdrawal' ? (language === 'sw' ? 'Kutoa' : 'Withdrawal') :
                         activity.type === 'loan_payment' ? (language === 'sw' ? 'Malipo ya Mkopo' : 'Loan Payment') :
                         (language === 'sw' ? 'Akiba' : 'Savings')}
                      </div>
                      <div className="text-xs text-wallet-secondary-500 dark:text-wallet-secondary-400">
                        {activity.date}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${
                    activity.type === 'deposit' ? 'text-wallet-success-600' :
                    activity.type === 'withdrawal' ? 'text-wallet-error-600' :
                    'text-wallet-secondary-600'
                  }`}>
                    {activity.type === 'withdrawal' ? '-' : '+'}
                    {formatAmount(activity.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={() => {
              console.log('Loan History clicked');
              if (typeof window !== 'undefined') {
                const event = new CustomEvent('loanHistoryRequested');
                window.dispatchEvent(event);
              }
            }}
            className="min-h-[48px] bg-gradient-to-r from-wallet-primary-500 to-wallet-primary-600 text-white py-2 px-4 rounded-xl hover:from-wallet-primary-600 hover:to-wallet-primary-700 transition-all font-semibold shadow-wallet active:scale-95"
          >
            {language === 'sw' ? 'Historia ya Mikopo' : 'Loan History'}
          </button>
          <button 
            onClick={() => {
              console.log('Credit Report clicked');
              onViewCreditReport();
            }}
            className="min-h-[48px] bg-gradient-to-r from-wallet-accent-500 to-wallet-accent-600 text-white py-2 px-4 rounded-xl hover:from-wallet-accent-600 hover:to-wallet-accent-700 transition-all font-semibold shadow-wallet active:scale-95"
          >
            {language === 'sw' ? 'Ripoti ya Mkopo' : 'Credit Report'}
          </button>
          <button 
            onClick={() => {
              console.log('Add Savings clicked from Credit Profile');
              if (typeof window !== 'undefined') {
                const event = new CustomEvent('addSavingsRequested');
                window.dispatchEvent(event);
              }
            }}
            className="min-h-[48px] bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-wallet active:scale-95"
          >
            {language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}
          </button>
        </div>

        {/* Tips for Improvement */}
        <div className="bg-wallet-accent-50 dark:bg-wallet-accent-900/20 border border-wallet-accent-200 dark:border-wallet-accent-800 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-wallet-accent-100 dark:bg-wallet-accent-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-wallet-accent-600 dark:text-wallet-accent-400" />
            </div>
            <div>
              <h5 className="font-semibold text-wallet-accent-800 dark:text-wallet-accent-200 mb-1">
                {language === 'sw' ? 'Vidokezo vya Kuboresha' : 'Improvement Tips'}
              </h5>
              <ul className="text-sm text-wallet-accent-700 dark:text-wallet-accent-300 space-y-1">
                {creditScore < 650 && (
                  <li>• {language === 'sw' ? 'Ongeza akiba zako' : 'Increase your savings'}</li>
                )}
                {loanReadiness < 80 && (
                  <li>• {language === 'sw' ? 'Fanya malipo kwa wakati' : 'Make timely payments'}</li>
                )}
                {eligibilityStatus === 'not_assessed' && (
                  <li>• {language === 'sw' ? 'Omba ukaguzi wa mkopo' : 'Request credit assessment'}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};