import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { 
  PiggyBank, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Loader,
  Target,
  Calendar,
  X
} from 'lucide-react';

interface AddSavingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentSavings?: number;
  currentBalance?: number;
}

export const AddSavingsForm: React.FC<AddSavingsFormProps> = ({ 
  isOpen,
  onClose,
  onSuccess,
  currentSavings = 0,
  currentBalance
}) => {
  const { language } = useLanguage();
  const { addToMSupu, addNotification } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    savingsType: 'general',
    goalName: '',
    targetAmount: '',
    paymentMethod: 'mpesa',
    phoneNumber: '',
    notes: '',
    isRecurring: false,
    recurringFrequency: 'monthly'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const savingsGoals = [
    { id: 'general', name: language === 'sw' ? 'Akiba ya Jumla' : 'General Savings', icon: '💰' },
    { id: 'emergency', name: language === 'sw' ? 'Dharura' : 'Emergency Fund', icon: '🚨' },
    { id: 'health', name: language === 'sw' ? 'Afya' : 'Health Expenses', icon: '🏥' },
    { id: 'sha', name: language === 'sw' ? 'SHA Michango' : 'SHA Contributions', icon: '🛡️' },
    { id: 'education', name: language === 'sw' ? 'Elimu' : 'Education', icon: '📚' },
    { id: 'business', name: language === 'sw' ? 'Biashara' : 'Business', icon: '💼' },
    { id: 'transport', name: language === 'sw' ? 'Usafiri' : 'Transport', icon: '🏍️' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = language === 'sw' ? 'Kiasi kinahitajika' : 'Amount is required';
    } else if (parseFloat(formData.amount) < 50) {
      newErrors.amount = language === 'sw' ? 'Kiasi kidogo zaidi ni KSh 50' : 'Minimum amount is KSh 50';
    }

    if (formData.savingsType === 'target' && !formData.goalName.trim()) {
      newErrors.goalName = language === 'sw' ? 'Jina la lengo linahitajika' : 'Goal name is required';
    }

    if (formData.savingsType === 'target' && (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0)) {
      newErrors.targetAmount = language === 'sw' ? 'Lengo la kiasi kinahitajika' : 'Target amount is required';
    }

    if (formData.paymentMethod === 'mpesa' && !formData.phoneNumber) {
      newErrors.phoneNumber = language === 'sw' ? 'Nambari ya simu ya M-Pesa inahitajika' : 'M-Pesa phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const amount = parseFloat(formData.amount);

      // Add to personal savings (not community fund)
      // This would update the user's personal savings balance
      console.log('Adding to personal savings:', amount);

      addNotification({
        title: language === 'sw' ? 'Akiba Imeongezwa' : 'Savings Added',
        message: language === 'sw' 
          ? `KSh ${amount.toLocaleString()} imeongezwa kwenye akiba yako`
          : `KSh ${amount.toLocaleString()} has been added to your savings`,
        type: 'success',
        read: false
      });

      setIsSubmitted(true);
      onSuccess();

    } catch (error) {
      addNotification({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        message: language === 'sw' 
          ? 'Kuna hitilafu katika kuongeza akiba'
          : 'There was an error adding your savings',
        type: 'error',
        read: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'sw' ? 'Akiba Imeongezwa!' : 'Savings Added!'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'sw'
              ? 'Pesa zako zimeongezwa kikamilifu kwenye akiba.'
              : 'Your money has been successfully added to savings.'
            }
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {language === 'sw' ? 'Jumla ya akiba' : 'Total savings'}: 
              <span className="font-bold text-blue-600 ml-2">
                KSh {(currentSavings + parseFloat(formData.amount)).toLocaleString()}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-wallet-primary-500 text-white rounded-xl hover:bg-wallet-primary-600 transition-colors"
          >
            {language === 'sw' ? 'Sawa' : 'Done'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'sw' 
                  ? 'Weka pesa kwenye akiba kwa ajili ya malengo yako'
                  : 'Save money towards your goals'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Savings Display */}
            {currentSavings > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    {language === 'sw' ? 'Akiba ya sasa' : 'Current savings'}:
                  </span>
                  <span className="text-green-600 font-bold text-xl">
                    KSh {currentSavings.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Savings Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {language === 'sw' ? 'Aina ya Akiba' : 'Savings Type'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {savingsGoals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, savingsType: goal.id }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.savingsType === goal.id
                        ? 'border-wallet-primary-500 bg-wallet-primary-50 dark:bg-wallet-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{goal.icon}</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                      {goal.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount to Save */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Kiasi cha Kuweka' : 'Amount to Save'} *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="50"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1,000"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.amount}</span>
                </p>
              )}

              {/* Quick Amount Buttons */}
              <div className="mt-2 flex flex-wrap gap-2">
                {[500, 1000, 2000, 5000].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, amount: quickAmount.toString() }))}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    KSh {quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'sw' ? 'Njia ya Malipo' : 'Payment Method'}
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">{language === 'sw' ? 'Pesa Taslimu' : 'Cash'}</option>
                </select>
              </div>

              {formData.paymentMethod === 'mpesa' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'sw' ? 'Nambari ya M-Pesa' : 'M-Pesa Number'} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+254 7XX XXX XXX"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Maelezo (Hiari)' : 'Notes (Optional)'}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={language === 'sw' ? 'Maelezo mengine...' : 'Additional notes...'}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-[48px] px-6 py-3 bg-wallet-primary-500 text-white rounded-xl hover:bg-wallet-primary-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{language === 'sw' ? 'Inaweka...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <PiggyBank className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Weka Akiba' : 'Save Money'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};