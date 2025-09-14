import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  DollarSign, 
  Package, 
  Cow, 
  Hammer,
  Smartphone,
  CreditCard,
  Banknote,
  Send,
  CheckCircle,
  X
} from 'lucide-react';

interface ContributionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onContribute: (data: any) => void;
}

export const ContributionsMenu: React.FC<ContributionsMenuProps> = ({
  isOpen,
  onClose,
  onContribute
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useNotification();
  const [selectedType, setSelectedType] = useState<'cash' | 'items' | 'animals' | 'labor'>('cash');
  const [selectedPayment, setSelectedPayment] = useState<'mpesa' | 'bank' | 'cash'>('mpesa');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const depositTypes = [
    {
      id: 'cash',
      name: language === 'sw' ? 'Fedha' : 'Cash',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      emoji: '💰'
    },
    {
      id: 'items',
      name: language === 'sw' ? 'Vitu' : 'Items',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      emoji: '📦'
    },
    {
      id: 'animals',
      name: language === 'sw' ? 'Wanyamapori' : 'Animals',
      icon: Cow,
      color: 'from-amber-500 to-amber-600',
      emoji: '🐄'
    },
    {
      id: 'labor',
      name: language === 'sw' ? 'Kazi' : 'Labor',
      icon: Hammer,
      color: 'from-purple-500 to-purple-600',
      emoji: '💪'
    }
  ];

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      color: 'from-green-500 to-green-600',
      details: `Pay Bill: 247247, Account: ${user?.phone || user?.id}`
    },
    {
      id: 'bank',
      name: language === 'sw' ? 'Uhamisho wa Benki' : 'Bank Transfer',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      details: 'Account: ParaBoda Community Fund'
    },
    {
      id: 'cash',
      name: language === 'sw' ? 'Fedha Taslimu' : 'Cash Deposit',
      icon: Banknote,
      color: 'from-yellow-500 to-yellow-600',
      details: language === 'sw' ? 'Peleka kwa CHV wa karibu' : 'Deliver to nearest CHV'
    }
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast(
        language === 'sw' ? 'Hitilafu' : 'Error',
        language === 'sw' ? 'Tafadhali ingiza kiasi sahihi' : 'Please enter a valid amount',
        'error'
      );
      return;
    }

    setIsSubmitting(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const contributionData = {
      type: selectedType,
      paymentMethod: selectedPayment,
      amount: parseFloat(amount),
      notes,
      timestamp: new Date().toISOString()
    };

    onContribute(contributionData);
    setShowConfirmation(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(false);
      onClose();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setAmount('');
    setNotes('');
    setSelectedType('cash');
    setSelectedPayment('mpesa');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
        >
          {/* Success Animation */}
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center z-10"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">
                  {language === 'sw' ? 'Mchango Umefanikiwa!' : 'Contribution Successful!'}
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  {language === 'sw' ? 'Mchango wako umeongezwa kwenye M-Supu' : 'Your contribution has been added to M-Supu'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'sw' ? 'Changia M-Supu' : 'Contribute to M-Supu'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Deposit Type Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {language === 'sw' ? 'Aina ya Mchango' : 'Contribution Type'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {depositTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.emoji}</div>
                    <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                      selectedType === type.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {type.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            {selectedType === 'cash' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {language === 'sw' ? 'Njia ya Malipo' : 'Payment Method'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id as any)}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPayment === method.id
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <method.icon className={`w-6 h-6 ${
                          selectedPayment === method.id ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {method.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {method.details}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {language === 'sw' ? 'Kiasi' : 'Amount'}
              </h3>
              
              {/* Quick Select Amounts */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {quickAmounts.map((quickAmount) => (
                  <motion.button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg border-2 transition-all text-center font-bold ${
                      amount === quickAmount.toString()
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400">KSh</div>
                    <div className="text-lg">{quickAmount.toLocaleString()}</div>
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={language === 'sw' ? 'Ingiza kiasi' : 'Enter amount'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {language === 'sw' ? 'Maelezo ya Ziada' : 'Additional Notes'}
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'sw' ? 'Andika maelezo ya ziada...' : 'Add additional notes...'}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{language === 'sw' ? 'Inawasilisha...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Wasilisha Mchango' : 'Submit Contribution'}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};