import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatsCard } from '../common/StatsCard';
import { Modal } from '../common/Modal';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { DepositModal } from '../common/DepositModal';
import { RewardsModal } from '../common/RewardsModal';
import { 
  Bike, 
  Wallet, 
  PiggyBank,
  CreditCard,
  Shield,
  Activity,
  Plus,
  Send,
  Eye,
  Award,
  Car,
  Stethoscope,
  Package,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface Loan {
  id: string;
  amount: number;
  purpose: string;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  remainingBalance: number;
  dueDate: Date;
  status: 'active' | 'completed' | 'overdue';
}

export const ParaBodaDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useData();
  const { language } = useLanguage();
  
  // Wallet state
  const [walletBalance, setWalletBalance] = useState(18750);
  const [savings, setSavings] = useState(12300);
  const [creditScore, setCreditScore] = useState(680);
  const [shaContribution, setShaContribution] = useState(4200);
  
  // Modal states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  
  // Delivery stats
  const [todayDeliveries, setTodayDeliveries] = useState(8);
  const [totalEarnings, setTotalEarnings] = useState(3200);
  const [customerRating, setCustomerRating] = useState(4.7);
  
  // User points for rewards
  const [userPoints, setUserPoints] = useState(2450);
  
  // Loans data
  const [activeLoans, setActiveLoans] = useState<Loan[]>([
    {
      id: '1',
      amount: 35000,
      purpose: 'Motorcycle Maintenance',
      interestRate: 9.0,
      term: 18,
      monthlyPayment: 2150,
      remainingBalance: 24500,
      dueDate: new Date('2024-02-20'),
      status: 'active'
    }
  ]);
  
  const [loanHistory, setLoanHistory] = useState<Loan[]>([
    {
      id: '2',
      amount: 20000,
      purpose: 'Safety Equipment',
      interestRate: 8.0,
      term: 12,
      monthlyPayment: 1735,
      remainingBalance: 0,
      dueDate: new Date('2023-11-30'),
      status: 'completed'
    }
  ]);

  const handleServiceRequest = (serviceType: string) => {
    setSelectedService(serviceType);
    setShowServiceModal(true);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'apply_loan':
        addNotification({
          title: language === 'sw' ? 'Ombi la Mkopo' : 'Loan Application',
          message: language === 'sw' ? 'Fomu ya ombi la mkopo imefunguliwa' : 'Loan application form opened',
          type: 'info',
          read: false
        });
        break;
      case 'add_savings':
        setShowDepositModal(true);
        break;
      case 'loan_payment':
        addNotification({
          title: language === 'sw' ? 'Malipo ya Mkopo' : 'Loan Payment',
          message: language === 'sw' ? 'Fomu ya malipo ya mkopo imefunguliwa' : 'Loan payment form opened',
          type: 'info',
          read: false
        });
        break;
      case 'credit_report':
        addNotification({
          title: language === 'sw' ? 'Ripoti ya Mkopo' : 'Credit Report',
          message: language === 'sw' ? 'Ripoti ya mkopo imefunguliwa' : 'Credit report opened',
          type: 'info',
          read: false
        });
        break;
      case 'rewards':
        setShowRewardsModal(true);
        break;
      case 'transport':
        handleServiceRequest('transport');
        break;
      case 'health_services':
        handleServiceRequest('health');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'sw' ? 'Karibu,' : 'Welcome,'} {user?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'sw' ? 'Dereva wa ParaBoda' : 'ParaBoda Rider'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'sw' ? 'Jumla ya Pesa' : 'Total Balance'}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  KSh {walletBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MSUPU Wallet Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'sw' ? 'Maelezo ya Pochi ya MSUPU' : 'MSUPU Wallet Overview'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title={language === 'sw' ? 'Akiba' : 'Savings'}
              value={`KSh ${savings.toLocaleString()}`}
              icon={PiggyBank}
              color="green"
              trend={15}
            />
            <StatsCard
              title={language === 'sw' ? 'Mikopo Hai' : 'Active Loans'}
              value={activeLoans.length.toString()}
              icon={CreditCard}
              color="blue"
            />
            <StatsCard
              title={language === 'sw' ? 'Alama za Mkopo' : 'Credit Score'}
              value={creditScore.toString()}
              icon={TrendingUp}
              color="purple"
              trend={8}
            />
            <StatsCard
              title={language === 'sw' ? 'Michango ya SHA' : 'SHA Contributions'}
              value={`KSh ${shaContribution.toLocaleString()}`}
              icon={Shield}
              color="indigo"
            />
          </div>
        </motion.div>

        {/* Today's Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'sw' ? 'Utendaji wa Leo' : 'Today\'s Performance'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title={language === 'sw' ? 'Utoaji Leo' : 'Today\'s Deliveries'}
              value={todayDeliveries.toString()}
              icon={Package}
              color="orange"
            />
            <StatsCard
              title={language === 'sw' ? 'Mapato ya Leo' : 'Today\'s Earnings'}
              value={`KSh ${totalEarnings.toLocaleString()}`}
              icon={DollarSign}
              color="green"
            />
            <StatsCard
              title={language === 'sw' ? 'Kiwango cha Wateja' : 'Customer Rating'}
              value={`${customerRating}/5`}
              icon={Star}
              color="yellow"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { key: 'apply_loan', icon: Plus, label: language === 'sw' ? 'Omba Mkopo' : 'Apply Loan' },
              { key: 'add_savings', icon: PiggyBank, label: language === 'sw' ? 'Ongeza Akiba' : 'Add Savings' },
              { key: 'loan_payment', icon: Send, label: language === 'sw' ? 'Lipa Mkopo' : 'Loan Payment' },
              { key: 'credit_report', icon: Eye, label: language === 'sw' ? 'Ripoti ya Mkopo' : 'Credit Report' },
              { key: 'rewards', icon: Award, label: language === 'sw' ? 'Tuzo' : 'Rewards' },
              { key: 'transport', icon: Car, label: language === 'sw' ? 'Usafiri' : 'Transport' },
              { key: 'health_services', icon: Stethoscope, label: language === 'sw' ? 'Huduma za Afya' : 'Health Services' }
            ].map((action) => (
              <button
                key={action.key}
                onClick={() => handleQuickAction(action.key)}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-center"
              >
                <action.icon className="w-6 h-6 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Active Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'sw' ? 'Mikopo Hai' : 'Active Loans'}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            {activeLoans.length > 0 ? (
              <div className="space-y-4">
                {activeLoans.map((loan) => (
                  <div key={loan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{loan.purpose}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        loan.status === 'active' ? 'bg-green-100 text-green-800' :
                        loan.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                        <p className="font-medium">KSh {loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Remaining:</span>
                        <p className="font-medium">KSh {loan.remainingBalance.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Monthly Payment:</span>
                        <p className="font-medium">KSh {loan.monthlyPayment.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Due Date:</span>
                        <p className="font-medium">{loan.dueDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'sw' ? 'Hakuna mikopo hai' : 'No active loans'}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Community Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'sw' ? 'Tuzo za Jamii' : 'Community Rewards'}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {language === 'sw' ? 'Tuzo za Mwezi' : 'Monthly Rewards'}
                </h3>
                <p className="text-2xl font-bold text-yellow-600">KSh 1,800</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'sw' ? 'Kutoka utoaji salama' : 'From safe deliveries'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {language === 'sw' ? 'Utoaji wa Mwezi' : 'Monthly Deliveries'}
                </h3>
                <p className="text-2xl font-bold text-green-600">156</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'sw' ? 'Mwezi huu' : 'This month'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bike className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {language === 'sw' ? 'Daraja la Dereva' : 'Rider Level'}
                </h3>
                <p className="text-2xl font-bold text-blue-600">Gold</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'sw' ? 'Kutoka utendaji mzuri' : 'From excellent performance'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showServiceModal && (
          <ServiceRequestModal
            isOpen={showServiceModal}
            onClose={() => setShowServiceModal(false)}
            serviceType={selectedService}
          />
        )}
        {showDepositModal && (
          <DepositModal
            isOpen={showDepositModal}
            onClose={() => setShowDepositModal(false)}
            onDeposit={(amount) => {
              setSavings(prev => prev + amount);
              setWalletBalance(prev => prev + amount);
              addNotification({
                title: language === 'sw' ? 'Amana Imehifadhiwa' : 'Deposit Successful',
                message: language === 'sw' ? `KSh ${amount.toLocaleString()} imehifadhiwa` : `KSh ${amount.toLocaleString()} deposited successfully`,
                type: 'success',
                read: false
              });
            }}
          />
        )}
        {showRewardsModal && (
          <RewardsModal
            isOpen={showRewardsModal}
            onClose={() => setShowRewardsModal(false)}
            userPoints={userPoints}
            onRedeem={(item) => {
              console.log('Reward redeemed:', item);
              setShowRewardsModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};