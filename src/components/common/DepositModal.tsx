import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  DollarSign, 
  Package, 
  CreditCard, 
  Smartphone,
  Banknote,
  Coins,
  Gift,
  Scale,
  Calculator,
  CheckCircle,
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (type: 'cash' | 'items', amount: number, description?: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ 
  isOpen, 
  onClose, 
  onDeposit 
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [depositType, setDepositType] = useState<'cash' | 'items'>('cash');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank' | 'cash'>('mpesa');
  const [itemDescription, setItemDescription] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemUnit, setItemUnit] = useState('kg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const commonItems = [
    { name: 'Mahindi', nameEn: 'Maize', unit: 'kg', estimatedValue: 80 },
    { name: 'Maharage', nameEn: 'Beans', unit: 'kg', estimatedValue: 120 },
    { name: 'Nyama', nameEn: 'Meat', unit: 'kg', estimatedValue: 800 },
    { name: 'Kuku', nameEn: 'Chicken', unit: 'pieces', estimatedValue: 500 },
    { name: 'Maziwa', nameEn: 'Milk', unit: 'liters', estimatedValue: 60 },
    { name: 'Mayai', nameEn: 'Eggs', unit: 'pieces', estimatedValue: 15 }
  ];

  const handleCashDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onDeposit('cash', parseFloat(amount));
    setShowSuccess(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(false);
      onClose();
      resetForm();
    }, 2000);
  };

  const handleItemDeposit = async () => {
    if (!itemDescription || !itemValue || parseFloat(itemValue) <= 0) return;

    setIsProcessing(true);
    
    // Simulate item valuation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const description = `${itemDescription} (${itemQuantity} ${itemUnit})`;
    onDeposit('items', parseFloat(itemValue), description);
    setShowSuccess(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(false);
      onClose();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setAmount('');
    setItemDescription('');
    setItemValue('');
    setItemQuantity('');
    setPaymentMethod('mpesa');
    setDepositType('cash');
  };

  const selectCommonItem = (item: any) => {
    setItemDescription(language === 'sw' ? item.name : item.nameEn);
    setItemUnit(item.unit);
    setItemValue((item.estimatedValue * (parseFloat(itemQuantity) || 1)).toString());
  };

  const calculateItemValue = () => {
    const qty = parseFloat(itemQuantity) || 1;
    const selectedItem = commonItems.find(item => 
      (language === 'sw' ? item.name : item.nameEn) === itemDescription
    );
    if (selectedItem) {
      setItemValue((selectedItem.estimatedValue * qty).toString());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'sw' ? 'Weka Mchango' : 'Make Deposit'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              {language === 'sw' ? 'Mchango Umefanikiwa!' : 'Deposit Successful!'}
            </h3>
            <p className="text-green-700">
              {language === 'sw' 
                ? 'Mchango wako umeongezwa kwenye fedha za jamii'
                : 'Your contribution has been added to the community fund'
              }
            </p>
          </motion.div>
        )}

        {/* Deposit Type Selection */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'sw' ? 'Aina ya Mchango' : 'Deposit Type'}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setDepositType('cash')}
              className={`p-6 rounded-xl border-2 transition-all text-center ${
                depositType === 'cash'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <DollarSign className={`w-8 h-8 mx-auto mb-3 ${
                depositType === 'cash' ? 'text-green-600' : 'text-gray-400'
              }`} />
              <h5 className="font-semibold text-gray-900 mb-1">
                {language === 'sw' ? 'Fedha' : 'Cash'}
              </h5>
              <p className="text-sm text-gray-600">
                {language === 'sw' ? 'Weka fedha kwenye M-Supu' : 'Deposit money to M-Supu'}
              </p>
            </button>

            <button
              onClick={() => setDepositType('items')}
              className={`p-6 rounded-xl border-2 transition-all text-center ${
                depositType === 'items'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Package className={`w-8 h-8 mx-auto mb-3 ${
                depositType === 'items' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <h5 className="font-semibold text-gray-900 mb-1">
                {language === 'sw' ? 'Vitu' : 'Items'}
              </h5>
              <p className="text-sm text-gray-600">
                {language === 'sw' ? 'Changia vitu vya thamani' : 'Contribute valuable items'}
              </p>
            </button>
          </div>
        </div>

        {/* Cash Deposit Form */}
        {depositType === 'cash' && (
          <div className="space-y-6">
            {/* Payment Method */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">
                {language === 'sw' ? 'Njia ya Malipo' : 'Payment Method'}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
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
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Kiasi (KSh)' : 'Amount (KSh)'}
              </label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={language === 'sw' ? 'Ingiza kiasi' : 'Enter amount'}
                  min="1"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {[100, 500, 1000, 2000, 5000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    KSh {preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Instructions */}
            {paymentMethod === 'mpesa' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h6 className="font-medium text-green-800 mb-2">
                  {language === 'sw' ? 'Maagizo ya M-Pesa' : 'M-Pesa Instructions'}
                </h6>
                <ol className="text-sm text-green-700 space-y-1">
                  <li>1. {language === 'sw' ? 'Nenda kwenye M-Pesa' : 'Go to M-Pesa menu'}</li>
                  <li>2. {language === 'sw' ? 'Chagua Lipa Bill' : 'Select Pay Bill'}</li>
                  <li>3. {language === 'sw' ? 'Business Number: 247247' : 'Business Number: 247247'}</li>
                  <li>4. {language === 'sw' ? `Account: ${user?.phone}` : `Account: ${user?.phone}`}</li>
                  <li>5. {language === 'sw' ? `Kiasi: KSh ${amount}` : `Amount: KSh ${amount}`}</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Items Deposit Form */}
        {depositType === 'items' && (
          <div className="space-y-6">
            {/* Common Items */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">
                {language === 'sw' ? 'Vitu vya Kawaida' : 'Common Items'}
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {commonItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => selectCommonItem(item)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-center"
                  >
                    <div className="text-2xl mb-1">🌾</div>
                    <div className="font-medium text-sm text-gray-900">
                      {language === 'sw' ? item.name : item.nameEn}
                    </div>
                    <div className="text-xs text-gray-500">
                      KSh {item.estimatedValue}/{item.unit}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Aina ya Kitu' : 'Item Type'}
                </label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'sw' ? 'k.m., mahindi, maharage' : 'e.g., maize, beans'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Kiasi' : 'Quantity'}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={itemQuantity}
                    onChange={(e) => {
                      setItemQuantity(e.target.value);
                      calculateItemValue();
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
                  <select
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="pieces">{language === 'sw' ? 'vipande' : 'pieces'}</option>
                    <option value="liters">{language === 'sw' ? 'lita' : 'liters'}</option>
                    <option value="bags">{language === 'sw' ? 'magunia' : 'bags'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estimated Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Thamani Inayokadirika (KSh)' : 'Estimated Value (KSh)'}
              </label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={itemValue}
                  onChange={(e) => setItemValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'sw' ? 'Ingiza thamani' : 'Enter value'}
                  min="1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'sw' 
                  ? 'Thamani itahakikiwa na CHV kabla ya kukubaliwa'
                  : 'Value will be verified by CHV before approval'
                }
              </p>
            </div>

            {/* Photo Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h6 className="font-medium text-gray-900 mb-1">
                {language === 'sw' ? 'Piga Picha ya Kitu' : 'Take Photo of Item'}
              </h6>
              <p className="text-sm text-gray-600 mb-3">
                {language === 'sw' ? 'Picha itasaidia katika uthibitisho' : 'Photo will help with verification'}
              </p>
              <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                <Upload className="w-4 h-4 inline mr-2" />
                {language === 'sw' ? 'Pakia Picha' : 'Upload Photo'}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {language === 'sw' ? 'Ghairi' : 'Cancel'}
          </button>

          <button
            onClick={depositType === 'cash' ? handleCashDeposit : handleItemDeposit}
            disabled={
              isProcessing || 
              (depositType === 'cash' && (!amount || parseFloat(amount) <= 0)) ||
              (depositType === 'items' && (!itemDescription || !itemValue || parseFloat(itemValue) <= 0))
            }
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'sw' ? 'Inachakata...' : 'Processing...'}</span>
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                <span>
                  {depositType === 'cash' 
                    ? (language === 'sw' ? 'Weka Fedha' : 'Deposit Cash')
                    : (language === 'sw' ? 'Changia Kitu' : 'Contribute Item')
                  }
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};