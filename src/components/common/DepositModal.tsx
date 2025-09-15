import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Package, Upload, CheckCircle, Camera, X, Smartphone, CreditCard, Banknote, Coins, Gift, Scale, Calculator } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Modal } from './Modal';
import { CameraCapture } from './CameraCapture';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (type: string, amount: number, description: string, photoUrl?: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ 
  isOpen, 
  onClose, 
  onDeposit 
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount, convertAmount, currency } = useCurrency();
  const [depositType, setDepositType] = useState<'cash' | 'items' | 'animals' | 'labor'>('cash');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank' | 'cash'>('mpesa');
  const [itemDescription, setItemDescription] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemUnit, setItemUnit] = useState('kg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [animalQuantity, setAnimalQuantity] = useState('1');
  const [laborHours, setLaborHours] = useState('');
  const [laborType, setLaborType] = useState('');
  const [description, setDescription] = useState('');


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

  // Item categories with estimated values (in KSh)
  const itemCategories = {
    'household': {
      name: language === 'sw' ? 'Vifaa vya Nyumbani' : 'Household Items',
      items: {
        'cooking-pot': { name: language === 'sw' ? 'Sufuria' : 'Cooking Pot', value: 1500 },
        'blanket': { name: language === 'sw' ? 'Blanketi' : 'Blanket', value: 800 },
        'mattress': { name: language === 'sw' ? 'Godoro' : 'Mattress', value: 3000 },
        'chairs': { name: language === 'sw' ? 'Viti' : 'Chairs', value: 2000 },
        'table': { name: language === 'sw' ? 'Meza' : 'Table', value: 2500 }
      }
    },
    'tools': {
      name: language === 'sw' ? 'Vifaa vya Kazi' : 'Work Tools',
      items: {
        'hoe': { name: language === 'sw' ? 'Jembe' : 'Hoe', value: 500 },
        'machete': { name: language === 'sw' ? 'Panga' : 'Machete', value: 300 },
        'wheelbarrow': { name: language === 'sw' ? 'Mkokoteni' : 'Wheelbarrow', value: 4000 },
        'bucket': { name: language === 'sw' ? 'Ndoo' : 'Bucket', value: 200 },
        'rope': { name: language === 'sw' ? 'Kamba' : 'Rope', value: 150 }
      }
    },
    'electronics': {
      name: language === 'sw' ? 'Vifaa vya Umeme' : 'Electronics',
      items: {
        'radio': { name: language === 'sw' ? 'Redio' : 'Radio', value: 1200 },
        'torch': { name: language === 'sw' ? 'Tochi' : 'Torch', value: 300 },
        'solar-panel': { name: language === 'sw' ? 'Sola Paneli' : 'Solar Panel', value: 8000 },
        'phone': { name: language === 'sw' ? 'Simu' : 'Phone', value: 5000 }
      }
    }
  };

  // Animal categories with estimated values (in KSh)
  const animalCategories = {
    'poultry': {
      name: language === 'sw' ? 'Kuku na Bata' : 'Poultry',
      animals: {
        'chicken': { name: language === 'sw' ? 'Kuku' : 'Chicken', value: 800 },
        'duck': { name: language === 'sw' ? 'Bata' : 'Duck', value: 600 },
        'turkey': { name: language === 'sw' ? 'Bata Mzinga' : 'Turkey', value: 1500 },
        'guinea-fowl': { name: language === 'sw' ? 'Kanga' : 'Guinea Fowl', value: 500 }
      }
    },
    'livestock': {
      name: language === 'sw' ? 'Mifugo' : 'Livestock',
      animals: {
        'goat': { name: language === 'sw' ? 'Mbuzi' : 'Goat', value: 8000 },
        'sheep': { name: language === 'sw' ? 'Kondoo' : 'Sheep', value: 12000 },
        'pig': { name: language === 'sw' ? 'Nguruwe' : 'Pig', value: 15000 },
        'cow': { name: language === 'sw' ? 'Ng\'ombe' : 'Cow', value: 50000 },
        'donkey': { name: language === 'sw' ? 'Punda' : 'Donkey', value: 25000 }
      }
    },
    'small-animals': {
      name: language === 'sw' ? 'Wanyamapori Wadogo' : 'Small Animals',
      animals: {
        'rabbit': { name: language === 'sw' ? 'Sungura' : 'Rabbit', value: 300 },
        'pigeon': { name: language === 'sw' ? 'Hua' : 'Pigeon', value: 200 }
      }
    }
  };

  // Labor types with hourly rates (in KSh)
  const laborTypes = {
    'farming': { name: language === 'sw' ? 'Kilimo' : 'Farming', rate: 200 },
    'construction': { name: language === 'sw' ? 'Ujenzi' : 'Construction', rate: 300 },
    'cleaning': { name: language === 'sw' ? 'Usafi' : 'Cleaning', rate: 150 },
    'cooking': { name: language === 'sw' ? 'Upishi' : 'Cooking', rate: 180 },
    'childcare': { name: language === 'sw' ? 'Utunzaji wa Watoto' : 'Childcare', rate: 170 },
    'transport': { name: language === 'sw' ? 'Usafiri' : 'Transport', rate: 250 }
  };

  const calculateValue = () => {
    switch (depositType) {
      case 'cash':
        return parseFloat(amount) || 0;
      case 'items':
        if (selectedItem) {
          const [category, item] = selectedItem.split('.');
          return itemCategories[category as keyof typeof itemCategories]?.items[item as keyof typeof itemCategories[keyof typeof itemCategories]['items']]?.value || 0;
        }
        return 0;
      case 'animals':
        if (selectedAnimal) {
          const [category, animal] = selectedAnimal.split('.');
          const animalValue = animalCategories[category as keyof typeof animalCategories]?.animals[animal as keyof typeof animalCategories[keyof typeof animalCategories]['animals']]?.value || 0;
          return animalValue * parseInt(animalQuantity || '1');
        }
        return 0;
      case 'labor':
        if (laborType && laborHours) {
          const rate = laborTypes[laborType as keyof typeof laborTypes]?.rate || 0;
          return rate * parseFloat(laborHours);
        }
        return 0;
      default:
        return 0;
    }
  };

  const handleCameraCapture = (imageData: string, file: File) => {
    setCapturedPhoto(imageData);
    setShowCameraCapture(false);
  };

  const handleSubmit = () => {
    const calculatedValue = calculateValue();
    if (calculatedValue > 0) {
      let finalDescription = description;

      if (depositType === 'items' && selectedItem) {
        const [category, item] = selectedItem.split('.');
        const itemName = itemCategories[category as keyof typeof itemCategories]?.items[item as keyof typeof itemCategories[keyof typeof itemCategories]['items']]?.name;
        finalDescription = `${itemName} - ${description}`;
      } else if (depositType === 'animals' && selectedAnimal) {
        const [category, animal] = selectedAnimal.split('.');
        const animalName = animalCategories[category as keyof typeof animalCategories]?.animals[animal as keyof typeof animalCategories[keyof typeof animalCategories]['animals']]?.name;
        finalDescription = `${animalQuantity} x ${animalName} - ${description}`;
      } else if (depositType === 'labor' && laborType) {
        const laborName = laborTypes[laborType as keyof typeof laborTypes]?.name;
        finalDescription = `${laborHours} ${language === 'sw' ? 'masaa' : 'hours'} ${laborName} - ${description}`;
      } else if (depositType === 'cash') {
        finalDescription = `Cash deposit: ${description}`;
      }

      onDeposit(depositType, calculatedValue, finalDescription, capturedPhoto || undefined);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        resetForm();
      }, 2000);
    }
  };

  const resetForm = () => {
    setAmount('');
    setItemDescription('');
    setItemValue('');
    setItemQuantity('');
    setPaymentMethod('mpesa');
    setDepositType('cash');
    setCapturedPhoto(null);
    setSelectedItem('');
    setSelectedAnimal('');
    setAnimalQuantity('1');
    setLaborHours('');
    setLaborType('');
    setDescription('');
  };

  const selectCommonItem = (item: any) => {
    // This function is no longer needed as we use categories
  };

  const calculateItemValue = () => {
    const qty = parseFloat(itemQuantity) || 1;
    try {
      const allItems = Object.entries(itemCategories).flatMap(([categoryKey, category]) => 
        Object.entries(category.items).map(([itemKey, item]) => [`${categoryKey}.${itemKey}`, item])
      );
      const selectedItemData = allItems.find(([key]) => key === selectedItem);

      if (selectedItemData) {
        const [, item] = selectedItemData;
        const convertedValue = convertAmount(item.value * qty);
        setItemValue(convertedValue.toFixed(2));
      }
    } catch (error) {
      console.error('Error calculating item value:', error);
    }
  };

  const getPresetAmounts = () => {
    const kshAmounts = [100, 500, 1000, 2000, 5000];
    return kshAmounts.map(kshAmount => ({
      ksh: kshAmount,
      converted: convertAmount(kshAmount),
      display: formatAmount(kshAmount)
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'sw' ? 'Weka Mchango' : 'Make Deposit'}
      size="lg"
    >
      <div className="space-y-6">
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

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'sw' ? 'Aina ya Mchango' : 'Deposit Type'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                {language === 'sw' ? 'Weka fedha taslimu' : 'Deposit cash money'}
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

            <button
              onClick={() => setDepositType('animals')}
              className={`p-6 rounded-xl border-2 transition-all text-center ${
                depositType === 'animals'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`text-2xl mx-auto mb-3 ${
                depositType === 'animals' ? 'text-orange-600' : 'text-gray-400'
              }`}>🐄</div>
              <h5 className="font-semibold text-gray-900 mb-1">
                {language === 'sw' ? 'Wanyama' : 'Animals'}
              </h5>
              <p className="text-sm text-gray-600">
                {language === 'sw' ? 'Changia wanyama wa kufuga' : 'Contribute livestock'}
              </p>
            </button>

            <button
              onClick={() => setDepositType('labor')}
              className={`p-6 rounded-xl border-2 transition-all text-center ${
                depositType === 'labor'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`text-2xl mx-auto mb-3 ${
                depositType === 'labor' ? 'text-purple-600' : 'text-gray-400'
              }`}>💪</div>
              <h5 className="font-semibold text-gray-900 mb-1">
                {language === 'sw' ? 'Kazi' : 'Labor'}
              </h5>
              <p className="text-sm text-gray-600">
                {language === 'sw' ? 'Changia kwa kufanya kazi' : 'Contribute through work'}
              </p>
            </button>
          </div>
        </div>

        {/* Deposit Forms */}
        {!showSuccess && (
          <div className="space-y-4">
            {depositType === 'cash' && (
              <>
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
                    {language === 'sw' ? `Kiasi (${currency})` : `Amount (${currency})`}
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
                      step="0.01"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getPresetAmounts().map((preset) => (
                      <button
                        key={preset.ksh}
                        onClick={() => setAmount(preset.converted.toFixed(2))}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        {preset.display}
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
                      <li>5. {language === 'sw' ? `Kiasi: ${formatAmount(parseFloat(amount) || 0)}` : `Amount: ${formatAmount(parseFloat(amount) || 0)}`}</li>
                    </ol>
                  </div>
                )}
              </>
            )}

            {depositType === 'items' && (
              <div className="space-y-4">
                {/* Common Items - Removed as categories are now used */}

                {/* Item Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Chagua Kitu' : 'Select Item'}
                  </label>
                  <select
                    value={selectedItem}
                    onChange={(e) => {
                      setSelectedItem(e.target.value);
                      const [categoryKey, itemKey] = e.target.value.split('.');
                      const selectedItemData = itemCategories[categoryKey as keyof typeof itemCategories]?.items[itemKey as keyof typeof itemCategories[keyof typeof itemCategories]['items']];
                      if (selectedItemData) {
                        setItemDescription(selectedItemData.name);
                        setItemQuantity('1'); // Reset quantity
                        calculateItemValue(); // Calculate value based on quantity
                      } else {
                        setItemDescription('');
                        setItemValue('');
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{language === 'sw' ? 'Chagua kitu...' : 'Select item...'}</option>
                    {Object.entries(itemCategories).map(([categoryKey, category]) => (
                      <optgroup key={categoryKey} label={category.name}>
                        {Object.entries(category.items).map(([itemKey, item]) => (
                          <option key={`${categoryKey}.${itemKey}`} value={`${categoryKey}.${itemKey}`}>
                            {item.name} (KSh {item.value.toLocaleString()})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                
                {/* Item Quantity */}
                {selectedItem && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'sw' ? 'Idadi' : 'Quantity'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(e) => {
                        setItemQuantity(e.target.value);
                        calculateItemValue(); // Recalculate value on quantity change
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>
                )}

                {/* Estimated Value */}
                {selectedItem && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'sw' ? `Thamani Inayokadirika (${currency})` : `Estimated Value (${currency})`}
                    </label>
                    <div className="relative">
                      <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={calculateValue()} // This should reflect the calculated value
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                        placeholder={language === 'sw' ? 'Thamani itahesabiwa' : 'Value will be calculated'}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'sw' 
                        ? 'Thamani itahesabiwa kulingana na kiasi na bei ya soko'
                        : 'Value will be calculated based on quantity and market price'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {depositType === 'animals' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Chagua Mnyama' : 'Select Animal'}
                  </label>
                  <select
                    value={selectedAnimal}
                    onChange={(e) => {
                      setSelectedAnimal(e.target.value);
                      const [categoryKey, animalKey] = e.target.value.split('.');
                      const selectedAnimalData = animalCategories[categoryKey as keyof typeof animalCategories]?.animals[animalKey as keyof typeof animalCategories[keyof typeof animalCategories]['animals']];
                      if (selectedAnimalData) {
                        setItemDescription(`${selectedAnimalData.name}`);
                        setAnimalQuantity('1');
                        setItemValue(selectedAnimalData.value.toString());
                      } else {
                        setItemDescription('');
                        setItemValue('');
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{language === 'sw' ? 'Chagua mnyama...' : 'Select animal...'}</option>
                    {Object.entries(animalCategories).map(([categoryKey, category]) => (
                      <optgroup key={categoryKey} label={category.name}>
                        {Object.entries(category.animals).map(([animalKey, animal]) => (
                          <option key={`${categoryKey}.${animalKey}`} value={`${categoryKey}.${animalKey}`}>
                            {animal.name} (KSh {animal.value.toLocaleString()})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                {selectedAnimal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'sw' ? 'Idadi' : 'Quantity'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={animalQuantity}
                      onChange={(e) => {
                        setAnimalQuantity(e.target.value);
                        // Recalculate value if needed, though it's directly tied to selected animal and quantity
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>
                )}
                {selectedAnimal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'sw' ? `Thamani Inayokadirika (${currency})` : `Estimated Value (${currency})`}
                    </label>
                    <div className="relative">
                      <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={itemValue} // This should reflect the calculated value
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                        placeholder={language === 'sw' ? 'Thamani itahesabiwa' : 'Value will be calculated'}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {depositType === 'labor' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Aina ya Kazi' : 'Type of Labor'}
                  </label>
                  <select
                    value={laborType}
                    onChange={(e) => {
                      setLaborType(e.target.value);
                      const selectedLabor = laborTypes[e.target.value as keyof typeof laborTypes];
                      if (selectedLabor && laborHours) {
                        setItemValue((selectedLabor.rate * parseFloat(laborHours)).toString());
                      } else if (selectedLabor) {
                        setItemValue('');
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{language === 'sw' ? 'Chagua aina ya kazi...' : 'Select labor type...'}</option>
                    {Object.entries(laborTypes).map(([key, labor]) => (
                      <option key={key} value={key}>
                        {labor.name} (KSh {labor.rate}/{language === 'sw' ? 'saa' : 'hour'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Masaa' : 'Hours'}
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={laborHours}
                    onChange={(e) => {
                      setLaborHours(e.target.value);
                      const selectedLabor = laborTypes[laborType as keyof typeof laborTypes];
                      if (selectedLabor && e.target.value) {
                        setItemValue((selectedLabor.rate * parseFloat(e.target.value)).toString());
                      } else {
                        setItemValue('');
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="8"
                  />
                </div>
                 {laborType && laborHours && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'sw' ? `Thamani Inayokadirika (${currency})` : `Estimated Value (${currency})`}
                    </label>
                    <div className="relative">
                      <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={itemValue} // This should reflect the calculated value
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                        placeholder={language === 'sw' ? 'Thamani itahesabiwa' : 'Value will be calculated'}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Common Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Maelezo za ziada' : 'Additional notes'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'sw' ? 'Maelezo mengine...' : 'Additional details...'}
              />
            </div>

            {/* Photo Capture Section */}
            {(depositType === 'items' || depositType === 'animals') && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  {capturedPhoto ? (
                    <div className="relative">
                      <img 
                        src={capturedPhoto} 
                        alt="Contribution" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setCapturedPhoto(null)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'sw' 
                          ? 'Piga picha ya kitu unachochanga' 
                          : 'Take a photo of your contribution'
                        }
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowCameraCapture(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {language === 'sw' ? 'Piga Picha' : 'Take Photo'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Value Display */}
            {calculateValue() > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">
                    {language === 'sw' ? 'Thamani ya jumla' : 'Total value'}:
                  </span>
                  <span className="text-green-600 font-bold text-xl">
                    KSh {calculateValue().toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={calculateValue() === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {language === 'sw' ? 'Wasilisha Mchango' : 'Submit Contribution'}
            </button>
          </div>
        )}

        {/* Camera Capture Modal */}
        <CameraCapture
          isOpen={showCameraCapture}
          onClose={() => setShowCameraCapture(false)}
          onCapture={handleCameraCapture}
          title={language === 'sw' ? 'Piga Picha ya Mchango' : 'Capture Contribution Photo'}
          context={language === 'sw' 
            ? 'Piga picha ya kitu unachochanga ili kuthibitisha mchango wako'
            : 'Take a photo of your contribution item to verify your donation'
          }
        />
      </div>
    </Modal>
  );
};