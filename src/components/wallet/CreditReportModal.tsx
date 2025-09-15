import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useData } from '../../contexts/DataContext';
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Eye,
  CreditCard,
  Target,
  Award,
  Activity,
  BarChart3,
  History,
  Loader,
  X
} from 'lucide-react';

interface CreditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditScore?: number;
  className?: string;
}

interface LoanHistoryItem {
  id: string;
  loanType: string;
  amount: number;
  status: 'active' | 'completed' | 'overdue' | 'pending';
  applicationDate: Date;
  completionDate?: Date;
  monthlyPayment: number;
  remainingBalance: number;
  interestRate: number;
}

interface ActiveLoan {
  id: string;
  loanType: string;
  originalAmount: number;
  remainingBalance: number;
  monthlyPayment: number;
  nextDueDate: Date;
  interestRate: number;
  status: 'active' | 'overdue';
}

export const CreditReportModal: React.FC<CreditReportModalProps> = ({
  isOpen,
  onClose,
  creditScore = 720,
  className = ''
}) => {
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock loan history data
  const loanHistory: LoanHistoryItem[] = [
    {
      id: 'loan_001',
      loanType: language === 'sw' ? 'Msaada wa Dharura' : 'Emergency Assistance',
      amount: 8000,
      status: 'completed',
      applicationDate: new Date(2024, 0, 15),
      completionDate: new Date(2024, 2, 20),
      monthlyPayment: 1400,
      remainingBalance: 0,
      interestRate: 5
    },
    {
      id: 'loan_002',
      loanType: language === 'sw' ? 'Huduma za Mimba' : 'Antenatal Care',
      amount: 6000,
      status: 'completed',
      applicationDate: new Date(2023, 10, 10),
      completionDate: new Date(2024, 0, 15),
      monthlyPayment: 1050,
      remainingBalance: 0,
      interestRate: 3
    },
    {
      id: 'sha_loan_001',
      loanType: language === 'sw' ? 'Mkopo wa Mchango wa SHA' : 'SHA Contribution Loan',
      amount: 10000,
      status: 'active',
      applicationDate: new Date(2024, 0, 20),
      monthlyPayment: 900,
      remainingBalance: 5400,
      interestRate: 2
    }
  ];

  // Mock active loans data
  const activeLoans: ActiveLoan[] = [
    {
      id: 'sha_loan_001',
      loanType: language === 'sw' ? 'Mkopo wa Mchango wa SHA' : 'SHA Contribution Loan',
      originalAmount: 10000,
      remainingBalance: 5400,
      monthlyPayment: 900,
      nextDueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      interestRate: 2,
      status: 'active'
    }
  ];

  const tabs = [
    { id: 'overview', name: language === 'sw' ? 'Muhtasari' : 'Overview', icon: BarChart3 },
    { id: 'history', name: language === 'sw' ? 'Historia' : 'History', icon: History },
    { id: 'active', name: language === 'sw' ? 'Mikopo Hai' : 'Active Loans', icon: Activity },
    { id: 'analysis', name: language === 'sw' ? 'Uchanganuzi' : 'Analysis', icon: TrendingUp }
  ];

  const handleDownloadReport = async () => {
    setIsLoading(true);

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate CSV content
    const csvData = [
      ['Loan ID', 'Type', 'Amount', 'Status', 'Application Date', 'Remaining Balance'],
      ...loanHistory.map(loan => [
        loan.id,
        loan.loanType,
        loan.amount.toString(),
        loan.status,
        loan.applicationDate.toLocaleDateString(),
        loan.remainingBalance.toString()
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    addNotification({
      title: language === 'sw' ? 'Ripoti Imepakuliwa' : 'Report Downloaded',
      message: language === 'sw' ? 'Ripoti ya mkopo imepakuliwa' : 'Credit report has been downloaded',
      type: 'success',
      read: false
    });
    setIsLoading(false);
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return language === 'sw' ? 'Bora Sana' : 'Excellent';
    if (score >= 700) return language === 'sw' ? 'Nzuri Sana' : 'Very Good';
    if (score >= 650) return language === 'sw' ? 'Nzuri' : 'Good';
    if (score >= 600) return language === 'sw' ? 'Wastani' : 'Fair';
    return language === 'sw' ? 'Mbaya' : 'Poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Credit Score Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>{language === 'sw' ? 'Alama za Mkopo' : 'Credit Score'}</span>
          </h3>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getCreditScoreColor(creditScore)}`}>
              {creditScore}
            </div>
            <div className="text-sm text-gray-600">
              {getCreditScoreLabel(creditScore)}
            </div>
          </div>
        </div>

        {/* Credit Score Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              creditScore >= 750 ? 'bg-green-500' :
              creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((creditScore / 850) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>300</span>
          <span>850</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {loanHistory.filter(l => l.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'sw' ? 'Mikopo Iliyokamilika' : 'Completed Loans'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {activeLoans.length}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'sw' ? 'Mikopo Hai' : 'Active Loans'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(activeLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0))}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'sw' ? 'Deni Lililopo' : 'Outstanding Balance'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const HistoryTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {language === 'sw' ? 'Historia ya Mikopo' : 'Loan History'}
        </h3>
        <button
          onClick={handleDownloadReport}
          disabled={isLoading}
          className="min-h-[48px] flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{language === 'sw' ? 'Pakua' : 'Download'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {loanHistory.map((loan) => (
          <div key={loan.id} className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{loan.loanType}</h4>
                <p className="text-sm text-gray-600">
                  {language === 'sw' ? 'Imeombwa' : 'Applied'}: {loan.applicationDate.toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                {loan.status === 'completed' ? (language === 'sw' ? 'Imekamilika' : 'Completed') :
                 loan.status === 'active' ? (language === 'sw' ? 'Hai' : 'Active') :
                 loan.status === 'overdue' ? (language === 'sw' ? 'Imechelewa' : 'Overdue') :
                 (language === 'sw' ? 'Inasubiri' : 'Pending')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">
                  {language === 'sw' ? 'Kiasi' : 'Amount'}:
                </span>
                <span className="ml-2 font-semibold">{formatAmount(loan.amount)}</span>
              </div>
              <div>
                <span className="text-gray-600">
                  {language === 'sw' ? 'Riba' : 'Interest'}:
                </span>
                <span className="ml-2 font-semibold">{loan.interestRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">
                  {language === 'sw' ? 'Malipo ya Mwezi' : 'Monthly Payment'}:
                </span>
                <span className="ml-2 font-semibold">{formatAmount(loan.monthlyPayment)}</span>
              </div>
              <div>
                <span className="text-gray-600">
                  {language === 'sw' ? 'Deni Lililopo' : 'Remaining'}:
                </span>
                <span className="ml-2 font-semibold">{formatAmount(loan.remainingBalance)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ActiveLoansTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {language === 'sw' ? 'Mikopo Hai' : 'Active Loans'}
      </h3>

      {activeLoans.length > 0 ? (
        <div className="space-y-4">
          {activeLoans.map((loan) => (
            <div key={loan.id} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{loan.loanType}</h4>
                  <p className="text-sm text-gray-600">
                    {language === 'sw' ? 'Tarehe ya malipo ijayo' : 'Next payment due'}: {loan.nextDueDate.toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                  {loan.status === 'active' ? (language === 'sw' ? 'Hai' : 'Active') : (language === 'sw' ? 'Imechelewa' : 'Overdue')}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{language === 'sw' ? 'Maendeleo ya Malipo' : 'Payment Progress'}</span>
                  <span>{Math.round(((loan.originalAmount - loan.remainingBalance) / loan.originalAmount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((loan.originalAmount - loan.remainingBalance) / loan.originalAmount) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">
                    {language === 'sw' ? 'Kiasi cha Awali' : 'Original Amount'}:
                  </span>
                  <span className="ml-2 font-semibold">{formatAmount(loan.originalAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-600">
                    {language === 'sw' ? 'Deni Lililopo' : 'Remaining Balance'}:
                  </span>
                  <span className="ml-2 font-semibold text-blue-600">{formatAmount(loan.remainingBalance)}</span>
                </div>
                <div>
                  <span className="text-gray-600">
                    {language === 'sw' ? 'Malipo ya Mwezi' : 'Monthly Payment'}:
                  </span>
                  <span className="ml-2 font-semibold">{formatAmount(loan.monthlyPayment)}</span>
                </div>
                <div>
                  <span className="text-gray-600">
                    {language === 'sw' ? 'Riba' : 'Interest Rate'}:
                  </span>
                  <span className="ml-2 font-semibold">{loan.interestRate}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => {
                    addNotification({
                      title: language === 'sw' ? 'Malipo Yameanza' : 'Payment Initiated',
                      message: language === 'sw' ? 'Mchakato wa malipo umeanza' : 'Payment process started',
                      type: 'info',
                      read: false
                    });
                    onClose();
                  }}
                  className="min-h-[48px] flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold"
                >
                  {language === 'sw' ? 'Lipa Sasa' : 'Make Payment'}
                </button>
                <button
                  onClick={() => {
                    addNotification({
                      title: language === 'sw' ? 'Maelezo ya Mkopo' : 'Loan Details',
                      message: language === 'sw' ? 'Maelezo kamili ya mkopo yameonyeshwa' : 'Full loan details displayed',
                      type: 'info',
                      read: false
                    });
                  }}
                  className="min-h-[48px] px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{language === 'sw' ? 'Hakuna mikopo hai' : 'No active loans'}</p>
        </div>
      )}
    </div>
  );

  const AnalysisTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {language === 'sw' ? 'Uchanganuzi wa Mkopo' : 'Credit Analysis'}
      </h3>

      {/* Credit Factors */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              {language === 'sw' ? 'Historia ya Malipo' : 'Payment History'}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-sm font-semibold text-green-600">85%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              {language === 'sw' ? 'Akiba' : 'Savings'}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <span className="text-sm font-semibold text-blue-600">70%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              {language === 'sw' ? 'Ushiriki wa Jamii' : 'Community Participation'}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <span className="text-sm font-semibold text-purple-600">90%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>{language === 'sw' ? 'Mapendekezo ya Kuboresha' : 'Improvement Recommendations'}</span>
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• {language === 'sw' ? 'Ongeza akiba zako kwa 20%' : 'Increase your savings by 20%'}</li>
          <li>• {language === 'sw' ? 'Lipa mikopo kwa wakati' : 'Make timely loan payments'}</li>
          <li>• {language === 'sw' ? 'Shiriki zaidi katika shughuli za jamii' : 'Participate more in community activities'}</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'sw' ? '📊 Ripoti ya Mkopo' : '📊 Credit Report'}
      size="xl"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[48px] flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'active' && <ActiveLoansTab />}
            {activeTab === 'analysis' && <AnalysisTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  );
};