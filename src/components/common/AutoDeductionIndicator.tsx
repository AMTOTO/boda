import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, DollarSign, CreditCard, Award } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';

interface AutoDeductionIndicatorProps {
  isVisible: boolean;
  amount: number;
  paymentMethod: 'wallet' | 'credit' | 'points';
  serviceName: string;
  onComplete: () => void;
}

export const AutoDeductionIndicator: React.FC<AutoDeductionIndicatorProps> = ({
  isVisible,
  amount,
  paymentMethod,
  serviceName,
  onComplete
}) => {
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(onComplete, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isVisible, onComplete]);

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'wallet': return <DollarSign className="w-6 h-6" />;
      case 'credit': return <CreditCard className="w-6 h-6" />;
      case 'points': return <Award className="w-6 h-6" />;
      default: return <DollarSign className="w-6 h-6" />;
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'wallet': return language === 'sw' ? 'Pochi' : 'Wallet';
      case 'credit': return language === 'sw' ? 'Mkopo' : 'Credit';
      case 'points': return language === 'sw' ? 'Pointi' : 'Points';
      default: return language === 'sw' ? 'Pochi' : 'Wallet';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {getPaymentIcon()}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'sw' ? 'Malipo Yanafanywa Kiotomatiki' : 'Auto-Processing Payment'}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'sw' 
                ? `Inakata ${formatAmount(amount)} kutoka ${getPaymentMethodName()} kwa ${serviceName}`
                : `Deducting ${formatAmount(amount)} from ${getPaymentMethodName()} for ${serviceName}`
              }
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
              <motion.div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {progress < 100 
                ? (language === 'sw' ? 'Inamaliza malipo...' : 'Processing payment...')
                : (language === 'sw' ? 'Malipo yamekamilika!' : 'Payment completed!')
              }
            </p>

            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 flex items-center justify-center space-x-2 text-green-600"
              >
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">
                  {language === 'sw' ? 'Mafanikio!' : 'Success!'}
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};