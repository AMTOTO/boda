import React, { useState } from 'react';
import { X, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SHAContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBalance: number;
}

export const SHAContributionForm: React.FC<SHAContributionFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentBalance
}) => {
  const { language } = useLanguage();
  const [contributionAmount, setContributionAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const shaRegistrationFee = 500; // KES 500 for SHA registration

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amount = parseFloat(contributionAmount);
    
    if (amount < shaRegistrationFee) {
      setError(language === 'sw' ? 
        `Kiasi cha chini ni KES ${shaRegistrationFee}` : 
        `Minimum amount is KES ${shaRegistrationFee}`
      );
      return;
    }
    
    if (amount > currentBalance) {
      setError(language === 'sw' ? 
        'Salio halitosha' : 
        'Insufficient balance'
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
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Mchango wa SHA' : 'SHA Contribution'}
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

          {/* SHA Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  {language === 'sw' ? 'Faida za SHA' : 'SHA Benefits'}
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• {language === 'sw' ? 'Matibabu ya haraka' : 'Priority healthcare'}</li>
                  <li>• {language === 'sw' ? 'Punguzo la gharama' : 'Reduced costs'}</li>
                  <li>• {language === 'sw' ? 'Huduma za dharura' : 'Emergency services'}</li>
                  <li>• {language === 'sw' ? 'Huduma za uzazi' : 'Maternal services'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Kiasi cha Mchango (KES)' : 'Contribution Amount (KES)'}
              </label>
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder={`${language === 'sw' ? 'Chini kabisa' : 'Minimum'} ${shaRegistrationFee}`}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
                required
                min={shaRegistrationFee}
                max={currentBalance}
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'sw' ? 'Salio la Sasa' : 'Current Balance'}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  KES {currentBalance.toLocaleString()}
                </span>
              </div>
              {contributionAmount && (
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'sw' ? 'Salio Baada ya Mchango' : 'Balance After Contribution'}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    KES {(currentBalance - parseFloat(contributionAmount || '0')).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

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
                disabled={isLoading || !contributionAmount}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-h-[48px]"
              >
                {isLoading 
                  ? (language === 'sw' ? 'Inachangia...' : 'Contributing...')
                  : (language === 'sw' ? 'Changia SHA' : 'Contribute to SHA')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};