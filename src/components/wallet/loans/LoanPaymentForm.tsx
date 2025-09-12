import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useData } from '../../../contexts/DataContext';
import { 
  DollarSign, 
  CreditCard, 
  CheckCircle,
  AlertCircle,
  Loader,
  Calendar,
  X
} from 'lucide-react';

interface ActiveLoan {
  id: string;
  loanTypeName: string;
  amount: number;
  remainingBalance: number;
  monthlyPayment: number;
  nextDueDate: Date;
  status: 'active' | 'overdue' | 'completed';
}

interface LoanPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoanPaymentForm: React.FC<LoanPaymentFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { language } = useLanguage();
  const { addNotification } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    loanId: '',
    paymentAmount: '',
    paymentMethod: 'mpesa',
    phoneNumber: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock active loans data - includes SHA loans
  const mockActiveLoans: ActiveLoan[] = [
    {
      id: 'loan_001',
      loanTypeName: language === 'sw' ? 'Msaada wa Dharura' : 'Emergency Assistance',
      amount: 5000,
      remainingBalance: 3200,
      monthlyPayment: 450,
      nextDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'loan_002', 
      loanTypeName: language === 'sw' ? 'Huduma za Mimba' : 'Antenatal Care',
      amount: 10000,
      remainingBalance: 7400,
      monthlyPayment: 620,
      nextDueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'sha_loan_001',
      loanTypeName: language === 'sw' ? 'Mkopo wa Mchango wa SHA' : 'SHA Contribution Loan',
      amount: 8000,
      remainingBalance: 5600,
      monthlyPayment: 580,
      nextDueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'loan_003',
      loanTypeName: language === 'sw' ? 'Usaidizi wa Kujifungua' : 'Delivery Support',
      amount: 9500,
      remainingBalance: 4200,
      monthlyPayment: 750,
      nextDueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ];

  // Use mock data for active loans
  const loansToUse = mockActiveLoans;
  const selectedLoan = loansToUse.find(loan => loan.id === formData.loanId);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.loanId) {
      newErrors.loanId = language === 'sw' ? 'Chagua mkopo' : 'Select a loan';
    }

    if (!formData.paymentAmount) {
      newErrors.paymentAmount = language === 'sw' ? 'Kiasi cha malipo kinahitajika' : 'Payment amount is required';
    } else {
      const numericPaymentAmount = parseFloat(formData.paymentAmount);
      if (isNaN(numericPaymentAmount) || numericPaymentAmount <= 0) {
        newErrors.paymentAmount = language === 'sw' ? 'Kiasi lazima kiwe zaidi ya sifuri' : 'Amount must be greater than zero';
      } else if (selectedLoan && numericPaymentAmount > selectedLoan.remainingBalance) {
        newErrors.paymentAmount = language === 'sw' 
          ? 'Kiasi kikubwa kuliko deni lililopo'
          : 'Amount exceeds remaining balance';
      }
    }

    if (formData.paymentMethod === 'mpesa' && !formData.phoneNumber) {
      newErrors.phoneNumber = language === 'sw' ? 'Nambari ya simu ya M-Pesa inahitajika' : 'M-Pesa phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      addNotification({
        title: language === 'sw' ? 'Malipo Yamepokelewa' : 'Payment Received',
        message: language === 'sw' 
          ? `Malipo ya KSh ${parseFloat(formData.paymentAmount).toLocaleString()} yamepokelewa`
          : `Payment of KSh ${parseFloat(formData.paymentAmount).toLocaleString()} has been received`,
        type: 'success',
        read: false
      });

      setIsSubmitted(true);
      onSuccess();

    } catch (error) {
      addNotification({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        message: language === 'sw' 
          ? 'Kuna hitilafu katika kuwasilisha malipo'
          : 'There was an error processing your payment',
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
            {language === 'sw' ? 'Malipo Yamekamilika!' : 'Payment Completed!'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'sw'
              ? 'Malipo yako yamepokelewa kikamilifu.'
              : 'Your payment has been successfully received.'
            }
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-wallet-primary-500 text-white rounded-xl hover:bg-wallet-primary-600 transition-colors"
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
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Lipa Mkopo' : 'Make Loan Payment'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'sw' 
                  ? 'Chagua mkopo na kiasi cha kulipa'
                  : 'Select a loan and payment amount'
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
            {/* Loan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Chagua Mkopo' : 'Select Loan'} *
              </label>
              <select
                value={formData.loanId}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, loanId: e.target.value }));
                  setFormData(prev => ({ ...prev, paymentAmount: '' }));
                  setErrors(prev => ({ ...prev, paymentAmount: '' }));
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.loanId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{language === 'sw' ? 'Chagua mkopo...' : 'Select a loan...'}</option>
                {loansToUse.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.loanTypeName} - {language === 'sw' ? 'Deni' : 'Balance'}: KSh {loan.remainingBalance.toLocaleString()}
                  </option>
                ))}
              </select>
              {errors.loanId && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.loanId}</span>
                </p>
              )}
            </div>

            {/* Loan Details */}
            {selectedLoan && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  {language === 'sw' ? 'Maelezo ya Mkopo' : 'Loan Details'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === 'sw' ? 'Deni lililopo' : 'Remaining balance'}:
                    </span>
                    <span className="font-semibold">KSh {selectedLoan.remainingBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === 'sw' ? 'Malipo ya kila mwezi' : 'Monthly payment'}:
                    </span>
                    <span className="font-semibold">KSh {selectedLoan.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === 'sw' ? 'Tarehe ya malipo' : 'Next due date'}:
                    </span>
                    <span className="font-semibold">{selectedLoan.nextDueDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Kiasi cha Malipo' : 'Payment Amount'} *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  value={formData.paymentAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentAmount: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.paymentAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
              </div>
              {errors.paymentAmount && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.paymentAmount}</span>
                </p>
              )}
              {selectedLoan && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      paymentAmount: Math.min(selectedLoan.monthlyPayment, selectedLoan.remainingBalance).toString() 
                    }))}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {language === 'sw' ? 'Malipo ya kawaida' : 'Regular payment'}: KSh {selectedLoan.monthlyPayment.toLocaleString()}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      paymentAmount: selectedLoan.remainingBalance.toString() 
                    }))}
                    className="px-3 py-1 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
                  >
                    {language === 'sw' ? 'Maliza mkopo' : 'Pay off loan'}: KSh {selectedLoan.remainingBalance.toLocaleString()}
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
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
                <option value="savings">{language === 'sw' ? 'Kutoka Akiba' : 'From Savings'}</option>
                <option value="points">{language === 'sw' ? 'Kutoka Pointi za Zawadi' : 'From Reward Points'}</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">{language === 'sw' ? 'Pesa Taslimu' : 'Cash'}</option>
              </select>
            </div>

            {/* Phone Number for M-Pesa */}
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

            {/* Payment Source Information */}
            {(formData.paymentMethod === 'savings' || formData.paymentMethod === 'points') && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  {language === 'sw' ? 'Chanzo cha Malipo' : 'Payment Source'}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {formData.paymentMethod === 'savings' 
                    ? (language === 'sw' ? 'Malipo yatatolewa kutoka akiba zako za kibinafsi' : 'Payment will be deducted from your personal savings')
                    : (language === 'sw' ? 'Malipo yatatolewa kutoka pointi zako za zawadi' : 'Payment will be deducted from your reward points')
                  }
                </p>
              </div>
            )}
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
                    <span>{language === 'sw' ? 'Inawasilisha...' : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Lipa Sasa' : 'Pay Now'}</span>
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