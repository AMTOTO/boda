import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useData } from '../../contexts/DataContext';
import { 
  DollarSign, 
  Smartphone, 
  CreditCard, 
  PiggyBank,
  CheckCircle,
  AlertCircle,
  Loader,
  Download,
  TrendingUp,
  Award,
  X
} from 'lucide-react';

interface EarningsWithdrawalProps {
  isOpen: boolean;
  onClose: () => void;
  availableEarnings: number;
  onWithdrawalSuccess: (amount: number, method: string) => void;
}

export const EarningsWithdrawal: React.FC<EarningsWithdrawalProps> = ({
  isOpen,
  onClose,
  availableEarnings,
  onWithdrawalSuccess
}) => {
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification } = useData();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'mpesa' | 'bank' | 'savings'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const withdrawalMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      description: language === 'sw' ? 'Pokea pesa kwenye M-Pesa' : 'Receive money via M-Pesa',
      fee: 0,
      processingTime: language === 'sw' ? 'Mara moja' : 'Instant'
    },
    {
      id: 'bank',
      name: language === 'sw' ? 'Benki' : 'Bank Transfer',
      icon: CreditCard,
      description: language === 'sw' ? 'Hamisha kwenye akaunti ya benki' : 'Transfer to bank account',
      fee: 50,
      processingTime: language === 'sw' ? 'Masaa 2-4' : '2-4 hours'
    },
    {
      id: 'savings',
      name: language === 'sw' ? 'Akiba' : 'Move to Savings',
      icon: PiggyBank,
      description: language === 'sw' ? 'Weka kwenye akiba za M-SUPU' : 'Move to M-SUPU savings',
      fee: 0,
      processingTime: language === 'sw' ? 'Mara moja' : 'Instant'
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      newErrors.amount = language === 'sw' ? 'Weka kiasi sahihi' : 'Enter valid amount';
    } else if (parseFloat(withdrawalAmount) > availableEarnings) {
      newErrors.amount = language === 'sw' ? 'Kiasi kikubwa kuliko mapato' : 'Amount exceeds available earnings';
    } else if (parseFloat(withdrawalAmount) < 100) {
      newErrors.amount = language === 'sw' ? 'Kiasi kidogo zaidi ni KSh 100' : 'Minimum withdrawal is KSh 100';
    }

    if (withdrawalMethod === 'mpesa' && !phoneNumber) {
      newErrors.phone = language === 'sw' ? 'Nambari ya M-Pesa inahitajika' : 'M-Pesa number required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdrawal = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const amount = parseFloat(withdrawalAmount);
      const selectedMethod = withdrawalMethods.find(m => m.id === withdrawalMethod);
      const finalAmount = amount - (selectedMethod?.fee || 0);

      onWithdrawalSuccess(finalAmount, withdrawalMethod);
      
      addNotification({
        title: language === 'sw' ? 'Mapato Yametolewa' : 'Earnings Withdrawn',
        message: language === 'sw' 
          ? `${formatAmount(finalAmount)} yametolewa kwa ${selectedMethod?.name}`
          : `${formatAmount(finalAmount)} withdrawn via ${selectedMethod?.name}`,
        type: 'success',
        read: false
      });

      setIsCompleted(true);
      
      setTimeout(() => {
        onClose();
        setIsCompleted(false);
        setWithdrawalAmount('');
        setPhoneNumber('');
        setErrors({});
      }, 2000);

    } catch (error) {
      addNotification({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        message: language === 'sw' ? 'Imeshindwa kutoa mapato' : 'Failed to withdraw earnings',
        type: 'error',
        read: false
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, availableEarnings];

  if (isCompleted) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={language === 'sw' ? '✅ Mafanikio' : '✅ Success'}
        size="md"
      >
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'sw' ? 'Mapato Yametolewa!' : 'Earnings Withdrawn!'}
          </h3>
          <p className="text-gray-600 mb-4">
            {language === 'sw'
              ? 'Pesa zako zimetolewa kikamilifu'
              : 'Your money has been withdrawn successfully'
            }
          </p>
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-green-800 font-bold">
              {formatAmount(parseFloat(withdrawalAmount) - (withdrawalMethods.find(m => m.id === withdrawalMethod)?.fee || 0))}
            </p>
            <p className="text-green-600 text-sm">
              {language === 'sw' ? 'Imetolewa kwa' : 'Withdrawn via'} {withdrawalMethods.find(m => m.id === withdrawalMethod)?.name}
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'sw' ? '💸 Toa Mapato' : '💸 Withdraw Earnings'}
      size="md"
    >
      <div className="space-y-6">
        {/* Available Earnings */}
        <div className="bg-green-50 p-6 rounded-2xl text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {formatAmount(availableEarnings)}
          </div>
          <p className="text-green-800 font-medium">
            {language === 'sw' ? 'Mapato Yanayopatikana' : 'Available Earnings'}
          </p>
        </div>

        {/* Withdrawal Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'sw' ? 'Kiasi cha Kutoa' : 'Withdrawal Amount'} *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
              min="100"
              max={availableEarnings}
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
            {quickAmounts.filter(amount => amount <= availableEarnings).map((amount) => (
              <button
                key={amount}
                onClick={() => setWithdrawalAmount(amount.toString())}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {formatAmount(amount)}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawal Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'sw' ? 'Njia ya Kutoa' : 'Withdrawal Method'}
          </label>
          <div className="space-y-3">
            {withdrawalMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setWithdrawalMethod(method.id as any)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  withdrawalMethod === method.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    withdrawalMethod === method.id ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <method.icon className={`w-6 h-6 ${
                      withdrawalMethod === method.id ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {language === 'sw' ? 'Ada' : 'Fee'}: {method.fee > 0 ? formatAmount(method.fee) : language === 'sw' ? 'Bure' : 'Free'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {method.processingTime}
                      </span>
                    </div>
                  </div>
                  {withdrawalMethod === method.id && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* M-Pesa Number */}
        {withdrawalMethod === 'mpesa' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Nambari ya M-Pesa' : 'M-Pesa Number'} *
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+254 7XX XXX XXX"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        )}

        {/* Withdrawal Summary */}
        {withdrawalAmount && (
          <div className="bg-blue-50 p-4 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-3">
              {language === 'sw' ? 'Muhtasari wa Kutoa' : 'Withdrawal Summary'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">{language === 'sw' ? 'Kiasi' : 'Amount'}:</span>
                <span className="font-semibold">{formatAmount(parseFloat(withdrawalAmount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{language === 'sw' ? 'Ada' : 'Fee'}:</span>
                <span className="font-semibold">
                  {withdrawalMethods.find(m => m.id === withdrawalMethod)?.fee || 0 > 0 
                    ? formatAmount(withdrawalMethods.find(m => m.id === withdrawalMethod)?.fee || 0)
                    : (language === 'sw' ? 'Bure' : 'Free')
                  }
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-700 font-medium">{language === 'sw' ? 'Utapokea' : 'You will receive'}:</span>
                <span className="font-bold text-green-600">
                  {formatAmount(parseFloat(withdrawalAmount) - (withdrawalMethods.find(m => m.id === withdrawalMethod)?.fee || 0))}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {language === 'sw' ? 'Ghairi' : 'Cancel'}
          </button>
          <button
            onClick={handleWithdrawal}
            disabled={isProcessing || !withdrawalAmount}
            className="flex-1 min-h-[48px] px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>{language === 'sw' ? 'Inatoa...' : 'Processing...'}</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>{language === 'sw' ? 'Toa Sasa' : 'Withdraw Now'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};