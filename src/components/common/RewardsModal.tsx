import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';
import { 
  Award, 
  Gift, 
  Star, 
  ShoppingCart, 
  Package, 
  Heart,
  Baby,
  Shirt,
  Book,
  Utensils,
  Home,
  Smartphone,
  Stethoscope,
  Droplets,
  Shield,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  onRedeem: (item: RewardItem) => void;
}

interface RewardItem {
  id: string;
  name: string;
  nameSwahili: string;
  points: number;
  category: 'health' | 'education' | 'household' | 'menstrual' | 'baby' | 'food';
  icon: React.ComponentType<any>;
  emoji: string;
  description: string;
  descriptionSwahili: string;
  available: boolean;
  stock: number;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({ 
  isOpen, 
  onClose, 
  userPoints, 
  onRedeem 
}) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [donationPurpose, setDonationPurpose] = useState<string>('');

  const rewardItems: RewardItem[] = [
    // Menstrual Hygiene Products
    {
      id: 'sanitary-pads',
      name: 'Sanitary Pads (Pack of 10)',
      nameSwahili: 'Pedi za Hedhi (Pakiti ya 10)',
      points: 50,
      category: 'menstrual',
      icon: Droplets,
      emoji: '🩸',
      description: 'High-quality sanitary pads for menstrual hygiene',
      descriptionSwahili: 'Pedi za ubora wa juu kwa usafi wa hedhi',
      available: true,
      stock: 25
    },
    {
      id: 'menstrual-cup',
      name: 'Menstrual Cup',
      nameSwahili: 'Kikombe cha Hedhi',
      points: 150,
      category: 'menstrual',
      icon: Heart,
      emoji: '🌸',
      description: 'Reusable menstrual cup - eco-friendly option',
      descriptionSwahili: 'Kikombe cha hedhi kinachotumika tena - chaguo la mazingira',
      available: true,
      stock: 15
    },
    {
      id: 'period-underwear',
      name: 'Period Underwear (3-pack)',
      nameSwahili: 'Chupi za Hedhi (Pakiti ya 3)',
      points: 120,
      category: 'menstrual',
      icon: Shirt,
      emoji: '👙',
      description: 'Absorbent period underwear for comfort',
      descriptionSwahili: 'Chupi za hedhi zinazofyonza kwa urahisi',
      available: true,
      stock: 20
    },
    {
      id: 'hygiene-kit',
      name: 'Complete Hygiene Kit',
      nameSwahili: 'Kifurushi Kamili cha Usafi',
      points: 200,
      category: 'menstrual',
      icon: Package,
      emoji: '🧴',
      description: 'Complete kit with pads, soap, and educational materials',
      descriptionSwahili: 'Kifurushi kamili chenye pedi, sabuni, na vifaa vya elimu',
      available: true,
      stock: 10
    },

    // Health Items
    {
      id: 'mosquito-net',
      name: 'Mosquito Net',
      nameSwahili: 'Chandarua',
      points: 100,
      category: 'health',
      icon: Shield,
      emoji: '🦟',
      description: 'Treated mosquito net for malaria prevention',
      descriptionSwahili: 'Chandarua kilichotibiwa kuzuia malaria',
      available: true,
      stock: 30
    },
    {
      id: 'first-aid-kit',
      name: 'First Aid Kit',
      nameSwahili: 'Kifurushi cha Huduma ya Kwanza',
      points: 150,
      category: 'health',
      icon: Stethoscope,
      emoji: '🏥',
      description: 'Basic first aid supplies for emergencies',
      descriptionSwahili: 'Vifaa vya msingi vya huduma ya kwanza kwa dharura',
      available: true,
      stock: 20
    },

    // Baby Items
    {
      id: 'baby-formula',
      name: 'Baby Formula (1kg)',
      nameSwahili: 'Maziwa ya Mtoto (1kg)',
      points: 80,
      category: 'baby',
      icon: Baby,
      emoji: '🍼',
      description: 'Nutritious baby formula for infants',
      descriptionSwahili: 'Maziwa ya lishe kwa watoto wachanga',
      available: true,
      stock: 40
    },
    {
      id: 'diapers',
      name: 'Diapers (Pack of 20)',
      nameSwahili: 'Nepi (Pakiti ya 20)',
      points: 60,
      category: 'baby',
      icon: Baby,
      emoji: '👶',
      description: 'Soft and absorbent baby diapers',
      descriptionSwahili: 'Nepi laini na zinazofyonza kwa watoto',
      available: true,
      stock: 35
    },

    // Education
    {
      id: 'school-supplies',
      name: 'School Supplies Kit',
      nameSwahili: 'Vifaa vya Shule',
      points: 120,
      category: 'education',
      icon: Book,
      emoji: '📚',
      description: 'Books, pens, and school materials',
      descriptionSwahili: 'Vitabu, kalamu, na vifaa vya shule',
      available: true,
      stock: 25
    },

    // Household
    {
      id: 'soap-detergent',
      name: 'Soap & Detergent Set',
      nameSwahili: 'Seti ya Sabuni na Unga wa Kufulia',
      points: 70,
      category: 'household',
      icon: Home,
      emoji: '🧼',
      description: 'Cleaning supplies for the home',
      descriptionSwahili: 'Vifaa vya usafi kwa nyumbani',
      available: true,
      stock: 50
    },

    // Food
    {
      id: 'nutrition-pack',
      name: 'Family Nutrition Pack',
      nameSwahili: 'Pakiti ya Lishe ya Familia',
      points: 180,
      category: 'food',
      icon: Utensils,
      emoji: '🥘',
      description: 'Nutritious food package for family',
      descriptionSwahili: 'Pakiti ya chakula chenye lishe kwa familia',
      available: true,
      stock: 15
    }
  ];

  const categories = [
    { id: 'all', name: 'All Items', nameSwahili: 'Vitu Vyote', emoji: '🛍️' },
    { id: 'menstrual', name: 'Menstrual Health', nameSwahili: 'Afya ya Hedhi', emoji: '🌸' },
    { id: 'health', name: 'Health', nameSwahili: 'Afya', emoji: '🏥' },
    { id: 'baby', name: 'Baby Care', nameSwahili: 'Huduma ya Mtoto', emoji: '👶' },
    { id: 'education', name: 'Education', nameSwahili: 'Elimu', emoji: '📚' },
    { id: 'household', name: 'Household', nameSwahili: 'Nyumbani', emoji: '🏠' },
    { id: 'food', name: 'Nutrition', nameSwahili: 'Lishe', emoji: '🥘' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? rewardItems 
    : rewardItems.filter(item => item.category === selectedCategory);

  const handleRedeem = (item: RewardItem) => {
    if (userPoints >= item.points && item.available && item.stock > 0) {
      onRedeem(item);
    }
  };

  const handleDonate = () => {
    if (donationAmount <= 0 || donationAmount > userPoints) return;
    
    // Mock donation functionality
    onRedeem({
      id: `donation_${Date.now()}`,
      name: `Donation: ${donationPurpose || 'General Fund'}`,
      nameSwahili: `Mchango: ${donationPurpose || 'Fedha za Jumla'}`,
      points: donationAmount,
      category: 'health',
      icon: Heart,
      emoji: '❤️',
      description: `Donation to ${donationPurpose || 'community fund'}`,
      descriptionSwahili: `Mchango kwa ${donationPurpose || 'fedha za jamii'}`,
      available: true,
      stock: 999
    });
    
    setShowDonationForm(false);
    setDonationAmount(0);
    setDonationPurpose('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'sw' ? 'Duka la Pointi' : 'Royalty Points Store'}
      size="xl"
    >
      <div className="space-y-6">
        {/* Points Display */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl text-white text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Award className="w-8 h-8" />
            <span className="text-3xl font-black">{userPoints}</span>
            <Star className="w-8 h-8" />
          </div>
          <p className="text-lg font-bold">
            {language === 'sw' ? 'Pointi Zako za Ufalme' : 'Your Royalty Points'}
          </p>
        </div>

        {/* Donation Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowDonationForm(!showDonationForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold"
          >
            <Heart className="w-5 h-5" />
            <span>{language === 'sw' ? 'Changia Pointi' : 'Donate Points'}</span>
          </button>
        </div>

        {/* Donation Form */}
        {showDonationForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-purple-50 p-4 rounded-xl border border-purple-200"
          >
            <h3 className="font-bold text-purple-900 mb-3">
              {language === 'sw' ? 'Changia Pointi Zako' : 'Donate Your Points'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'sw' ? 'Kiasi cha Pointi' : 'Points Amount'}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={donationAmount || ''}
                    onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder={language === 'sw' ? 'Ingiza kiasi' : 'Enter amount'}
                    min="1"
                    max={userPoints}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{language === 'sw' ? 'Kiwango cha Chini: 10' : 'Min: 10'}</span>
                  <span className="text-xs text-gray-500">{language === 'sw' ? 'Kiwango cha Juu:' : 'Max:'} {userPoints}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'sw' ? 'Madhumuni ya Mchango' : 'Donation Purpose'}
                </label>
                <select
                  value={donationPurpose}
                  onChange={(e) => setDonationPurpose(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">{language === 'sw' ? 'Chagua madhumuni' : 'Select purpose'}</option>
                  <option value="emergency_transport">{language === 'sw' ? 'Usafiri wa Dharura' : 'Emergency Transport'}</option>
                  <option value="maternal_health">{language === 'sw' ? 'Afya ya Mama' : 'Maternal Health'}</option>
                  <option value="child_nutrition">{language === 'sw' ? 'Lishe ya Watoto' : 'Child Nutrition'}</option>
                  <option value="community_fund">{language === 'sw' ? 'Fedha za Jamii' : 'Community Fund'}</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDonationForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'sw' ? 'Ghairi' : 'Cancel'}
                </button>
                <button
                  onClick={handleDonate}
                  disabled={donationAmount <= 0 || donationAmount > userPoints}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {language === 'sw' ? 'Changia Sasa' : 'Donate Now'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{category.emoji}</span>
              <span className="text-sm">
                {language === 'sw' ? category.nameSwahili : category.name}
              </span>
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredItems.map((item) => {
            const canAfford = userPoints >= item.points;
            const inStock = item.stock > 0;
            const canRedeem = canAfford && inStock && item.available;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border-2 rounded-xl p-4 transition-all ${
                  canRedeem 
                    ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <item.icon className={`w-6 h-6 mx-auto mb-2 ${
                    canRedeem ? 'text-emerald-600' : 'text-gray-400'
                  }`} />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {language === 'sw' ? item.nameSwahili : item.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {language === 'sw' ? item.descriptionSwahili : item.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'sw' ? 'Pointi' : 'Points'}:
                    </span>
                    <span className={`font-bold ${canAfford ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.points}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'sw' ? 'Hisa' : 'Stock'}:
                    </span>
                    <span className={`font-bold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {item.stock}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canRedeem}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                      canRedeem
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm">
                        {!canAfford 
                          ? (language === 'sw' ? 'Pointi Hazitoshi' : 'Not Enough Points')
                          : !inStock 
                          ? (language === 'sw' ? 'Haipatikani' : 'Out of Stock')
                          : (language === 'sw' ? 'Chukua' : 'Redeem')
                        }
                      </span>
                    </div>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{language === 'sw' ? 'Hakuna vitu katika aina hii' : 'No items in this category'}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};