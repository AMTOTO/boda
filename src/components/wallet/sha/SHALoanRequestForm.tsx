import React, { useState } from 'react';
import { X, Shield, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SHALoanRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SHALoanRequestForm: React.FC<SHALoanRequestFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { language } = useLanguage();
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [repaymentPeriod, setRepaymentPeriod] = useState('3');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const maxLoanAmount = 2000; // KES 2000 max for SHA loans
  const interestRate = 5; // 5% interest

  const calculateMonthlyPayment = () => {
    const amount = parseFloat(loanAmount || '0');
    const months = parseInt(repaymentPeriod);
    const totalWithInterest = amount * (1 + interestRate / 100);
    return months > 0 ? totalWithInterest / months : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amount = parseFloat(loanAmount);
    
    if (amount < 500) {
      setError(language === 'sw' ? 
        'Kiasi cha chini ni KES 500' : 
        'Minimum amount is KES 500'
      );
      return;
    }
    
    if (amount > maxLoanAmount) {
      setError(language === 'sw' ? 
        `Kiasi cha juu ni KES ${maxLoanAmount}` : 
        `Maximum amount is KES ${maxLoanAmount}`
      );
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess();
      onClose();
    } catch (err) {
      setError(language === 'sw' ? 
        'Hitilafu imetokea. Jaribu tena.' : 
        'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Ombi la Mkopo wa SHA' : 'SHA Loan Request'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={language === 'sw' ? 'Funga' : 'Close'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Loan Information */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  {language === 'sw' ? 'Makala ya Mkopo wa SHA' : 'SHA Loan Terms'}
                </h3>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• {language === 'sw' ? `Riba ya ${interestRate}% tu` : `Only ${interestRate}% interest`}</li>
                  <li>• {language === 'sw' ? 'Muda wa kulipa: miezi 1-12' : 'Repayment: 1-12 months'}</li>
                  <li>• {language === 'sw' ? 'Hakuna dhamana' : 'No collateral required'}</li>
                  <li>• {language === 'sw' ? 'Idhini ya haraka' : 'Quick approval'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Kiasi cha Mkopo (KES)' : 'Loan Amount (KES)'}
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder={`${language === 'sw' ? 'Juu kabisa' : 'Maximum'} ${maxLoanAmount}`}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
                required
                min="500"
                max={maxLoanAmount}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Madhumuni ya Mkopo' : 'Loan Purpose'}
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder={language === 'sw' ? 
                  'Eleza jinsi utakavyotumia mkopo huu...' : 
                  'Explain how you will use this loan...'
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[96px] resize-none"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Muda wa Kulipa (Miezi)' : 'Repayment Period (Months)'}
              </label>
              <select
                value={repaymentPeriod}
                onChange={(e) => setRepaymentPeriod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
                required
              >
                <option value="1">1 {language === 'sw' ? 'mwezi' : 'month'}</option>
                <option value="3">3 {language === 'sw' ? 'miezi' : 'months'}</option>
                <option value="6">6 {language === 'sw' ? 'miezi' : 'months'}</option>
                <option value="12">12 {language === 'sw' ? 'miezi' : 'months'}</option>
              </select>
            </div>

            {loanAmount && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {language === 'sw' ? 'Muhtasari wa Mkopo' : 'Loan Summary'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'sw' ? 'Kiasi cha Mkopo' : 'Loan Amount'}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      KES {parseFloat(loanAmount || '0').toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'sw' ? 'Riba' : 'Interest'} ({interestRate}%)
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      KES {(parseFloat(loanAmount || '0') * interestRate / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'sw' ? 'Malipo ya Kila Mwezi' : 'Monthly Payment'}
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      KES {calculateMonthlyPayment().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[48px]"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isLoading || !loanAmount || !purpose}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-h-[48px]"
              >
                {isLoading 
                  ? (language === 'sw' ? 'Inaomba...' : 'Requesting...')
                  : (language === 'sw' ? 'Omba Mkopo' : 'Request Loan')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};