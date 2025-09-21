import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { 
  DollarSign, 
  Package, 
  Smartphone,
  CreditCard,
  Banknote,
  CheckCircle,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';

interface ContributionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  className?: string;
}

export const ContributionsMenu: React.FC<ContributionsMenuProps> = ({
  isOpen,
  onClose,
  onSuccess,
  className = ''
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { addToMSupu, addNotification } = useData();
  const { formatAmount } = useCurrency();
  
  const [depositType, setDepositType] = useState<'cash' | 'items' | 'animals' | 'labor'>('cash');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank' | 'cash'>('mpesa');
  const [itemDescription, setItemDescription] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const depositTypes = [
    {
      id: 'cash',
      name: language === 'sw' ? 'Fedha' : 'Cash',
      icon: DollarSign,
      description: language === 'sw' ? 'Weka fedha taslimu' : 'Deposit cash money',
      color: 'green'
    },
    {
      id: 'items',
      name: language === 'sw' ? 'Vitu' : 'Items',
      icon: Package,
      description: language === 'sw' ? 'Changia vitu vya thamani' : 'Contribute valuable items',
      color: 'blue'
    },
    {
      id: 'animals',
      name: language === 'sw' ? 'Wanyama' : 'Animals',
      icon: '🐄',
      description: language === 'sw' ? 'Changia wanyama wa kufuga' : 'Contribute livestock',
      color: 'orange'
    },
    {
      id: 'labor',
      name: language === 'sw' ? 'Kazi' : 'Labor',
      icon: '💪',
      description: language === 'sw' ? 'Changia kwa kufanya kazi' : 'Contribute through work',
      color: 'purple'
    }
  ];

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      description: language === 'sw' ? 'Lipa kwa simu' : 'Mobile payment',
      color: 'green'
    },
    {
      id: 'bank',
      name: language === 'sw' ? 'Benki' : 'Bank Transfer',
      icon: CreditCard,
      description: language === 'sw' ? 'Uhamisho wa benki' : 'Bank transfer',
      color: 'blue'
    },
    {
      id: 'cash',
      name: language === 'sw' ? 'Fedha Taslimu' : 'Cash Deposit',
      icon: Banknote,
      description: language === 'sw' ? 'Fedha za mkono' : 'Physical cash',
      color: 'yellow'
    }
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (depositType === 'cash') {
      if (!amount || parseFloat(amount) <= 0) {
        newErrors.amount = language === 'sw' ? 'Kiasi kinahitajika' : 'Amount is required';
      } else if (parseFloat(amount) < 100) {
        newErrors.amount = language === 'sw' ? 'Kiasi kidogo zaidi ni KSh 100' : 'Minimum amount is KSh 100';
      }
    } else if (depositType === 'items' || depositType === 'animals') {
      if (!itemDescription.trim()) {
        newErrors.itemDescription = language === 'sw' ? 'Maelezo yanahitajika' : 'Description is required';
      }
      if (!amount || parseFloat(amount) <= 0) {
        newErrors.amount = language === 'sw' ? 'Thamani inahitajika' : 'Value is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const contributionAmount = parseFloat(amount);
      addToMSupu(contributionAmount);

      addNotification({
        title: language === 'sw' ? 'Mchango Umeongezwa' : 'Contribution Added',
        message: language === 'sw' 
          ? `Mchango wa ${formatAmount(contributionAmount)} umeongezwa`
          : `Contribution of ${formatAmount(contributionAmount)} added`,
        type: 'success',
        read: false
      });

      setIsSubmitted(true);
      onSuccess();

    } catch (error) {
      addNotification({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        message: language === 'sw' 
          ? 'Kuna hitilafu katika kuongeza mchango'
          : 'There was an error adding your contribution',
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
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'sw' ? 'Mchango Umefanikiwa!' : 'Contribution Successful!'}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'sw'
              ? 'Mchango wako umeongezwa kwenye fedha za jamii'
              : 'Your contribution has been added to the community fund'
            }
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
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
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'sw' ? 'Weka Mchango' : 'Make Contribution'}
              </h2>
              <p className="text-gray-600">
                {language === 'sw' 
                  ? 'Changia kwenye fedha za jamii'
                  : 'Contribute to the community fund'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Deposit Type Selection */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'sw' ? 'Aina ya Mchango' : 'Contribution Type'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {depositTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDepositType(type.id as any)}
                    className={`p-6 rounded-xl border-2 transition-all text-center ${
                      depositType === type.id
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {typeof type.icon === 'string' ? (
                      <div className="text-4xl mb-3">{type.icon}</div>
                    ) : (
                      <type.icon className={`w-8 h-8 mx-auto mb-3 ${
                        depositType === type.id ? `text-${type.color}-600` : 'text-gray-400'
                      }`} />
                    )}
                    <h5 className="font-semibold text-gray-900 mb-1">{type.name}</h5>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount/Value Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {depositType === 'cash' 
                  ? (language === 'sw' ? 'Kiasi (KSh)' : 'Amount (KSh)')
                  : (language === 'sw' ? 'Thamani (KSh)' : 'Value (KSh)')
                } *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={language === 'sw' ? 'Ingiza kiasi' : 'Enter amount'}
                  min="1"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.amount}</span>
                </p>
              )}

              {/* Quick Amount Buttons */}
              {depositType === 'cash' && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => setAmount(quickAmount.toString())}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      KSh {quickAmount.toLocaleString()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item/Animal Description */}
            {(depositType === 'items' || depositType === 'animals' || depositType === 'labor') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Maelezo' : 'Description'} *
                </label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                    errors.itemDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={
                    depositType === 'items' ? (language === 'sw' ? 'Kwa mfano: Sufuria, blanketi' : 'e.g., Cooking pot, blanket') :
                    depositType === 'animals' ? (language === 'sw' ? 'Kwa mfano: Mbuzi 2, kuku 5' : 'e.g., 2 goats, 5 chickens') :
                    (language === 'sw' ? 'Kwa mfano: Kilimo masaa 8' : 'e.g., Farming 8 hours')
                  }
                />
                {errors.itemDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.itemDescription}</p>
                )}
              </div>
            )}

            {/* Payment Method Selection */}
            {depositType === 'cash' && (
              <div>
                <h5 className="font-medium text-gray-900 mb-3">
                  {language === 'sw' ? 'Njia ya Malipo' : 'Payment Method'}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        paymentMethod === method.id
                          ? `border-${method.color}-500 bg-${method.color}-50`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <method.icon className={`w-6 h-6 mx-auto mb-2 ${
                        paymentMethod === method.id ? `text-${method.color}-600` : 'text-gray-400'
                      }`} />
                      <h6 className="font-medium text-gray-900 text-sm">{method.name}</h6>
                      <p className="text-xs text-gray-600">{method.description}</p>
                    </button>
                  ))}
                </div>

                {/* M-Pesa Instructions */}
                {paymentMethod === 'mpesa' && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h6 className="font-medium text-green-800 mb-2">
                      {language === 'sw' ? 'Maagizo ya M-Pesa' : 'M-Pesa Instructions'}
                    </h6>
                    <ol className="text-sm text-green-700 space-y-1">
                      <li>1. {language === 'sw' ? 'Nenda kwenye M-Pesa' : 'Go to M-Pesa menu'}</li>
                      <li>2. {language === 'sw' ? 'Chagua Lipa Bill' : 'Select Pay Bill'}</li>
                      <li>3. {language === 'sw' ? 'Business Number: 247247' : 'Business Number: 247247'}</li>
                      <li>4. {language === 'sw' ? `Account: ${user?.phone || user?.id}` : `Account: ${user?.phone || user?.id}`}</li>
                      <li>5. {language === 'sw' ? `Kiasi: ${formatAmount(parseFloat(amount) || 0)}` : `Amount: ${formatAmount(parseFloat(amount) || 0)}`}</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Maelezo ya Ziada' : 'Additional Notes'}
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'sw' ? 'Maelezo mengine...' : 'Additional details...'}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-[48px] px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{language === 'sw' ? 'Inawasilisha...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Wasilisha Mchango' : 'Submit Contribution'}</span>
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