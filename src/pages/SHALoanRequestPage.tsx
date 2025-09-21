import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Heart, AlertCircle, Calendar, CreditCard } from 'lucide-react';

interface SHALoanRequestPageProps {
  onClose: () => void;
}

export const SHALoanRequestPage: React.FC<SHALoanRequestPageProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  
  const [amount, setAmount] = useState('');
  const [repaymentPlan, setRepaymentPlan] = useState('monthly');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const MAX_SHA_LOAN_AMOUNT = 10000;
  const SHA_ANNUAL_SUBSCRIPTION = 2700;
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = language === 'sw' ? 'Weka kiasi sahihi' : 'Enter a valid amount';
    } else if (Number(amount) > MAX_SHA_LOAN_AMOUNT) {
      newErrors.amount = language === 'sw' 
        ? `Kiwango cha juu ni ${currency.symbol} ${MAX_SHA_LOAN_AMOUNT.toLocaleString()}` 
        : `Maximum loan amount is ${currency.symbol} ${MAX_SHA_LOAN_AMOUNT.toLocaleString()}`;
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
      
      // Handle successful submission
      console.log('SHA Loan Request submitted:', {
        loanType: 'SHA Contribution Loan',
        amount: Number(amount),
        repaymentPlan,
        purpose: 'Annual SHA Subscription Payment'
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting SHA loan request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-responsive p-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'sw' ? 'Omba Mkopo wa SHA' : 'Request SHA Loan'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'sw' ? 'Mkopo huu ni kwa ajili ya malipo ya SHA pekee' : 'This loan is exclusively for SHA subscription payments'}
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              {language === 'sw' ? 'Muhtasari wa SHA' : 'SHA Summary'}
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {language === 'sw' 
                ? `Kiwango cha mwaka: ${currency.symbol} ${SHA_ANNUAL_SUBSCRIPTION.toLocaleString()}`
                : `Annual subscription: ${currency.symbol} ${SHA_ANNUAL_SUBSCRIPTION.toLocaleString()}`
              }
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {language === 'sw' 
                ? `Kiwango cha juu cha mkopo: ${currency.symbol} ${MAX_SHA_LOAN_AMOUNT.toLocaleString()}`
                : `Maximum loan amount: ${currency.symbol} ${MAX_SHA_LOAN_AMOUNT.toLocaleString()}`
              }
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'sw' ? 'Aina ya Mkopo' : 'Loan Type'}
          </label>
          <input
            type="text"
            value={language === 'sw' ? 'Mkopo wa Michango ya SHA' : 'SHA Contribution Loan'}
            disabled
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl cursor-not-allowed"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'sw' ? 'Kiasi cha Mkopo' : 'Loan Amount'} ({currency.symbol})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={MAX_SHA_LOAN_AMOUNT}
            className={`w-full p-3 border rounded-xl ${
              errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            placeholder={language === 'sw' ? 'Weka kiasi' : 'Enter amount'}
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'sw' ? 'Mpango wa Kulipa' : 'Repayment Plan'}
          </label>
          <select
            value={repaymentPlan}
            onChange={(e) => setRepaymentPlan(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
          >
            <option value="monthly">
              {language === 'sw' ? 'Kila mwezi' : 'Monthly'}
            </option>
            <option value="quarterly">
              {language === 'sw' ? 'Kila robo mwaka' : 'Quarterly'}
            </option>
          </select>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'sw' ? 'Madhumuni' : 'Purpose'}
          </label>
          <input
            type="text"
            value={language === 'sw' ? 'Malipo ya Michango ya SHA ya Mwaka' : 'Annual SHA Subscription Payment'}
            disabled
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl cursor-not-allowed"
          />
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[48px] px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all"
          >
            {language === 'sw' ? 'Ghairi' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 min-h-[48px] px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'sw' ? 'Inatuma...' : 'Submitting...'}</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>{language === 'sw' ? 'Tuma Ombi' : 'Submit Request'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};