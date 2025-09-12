import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { 
  Heart, 
  Stethoscope, 
  Baby, 
  Bike, 
  AlertTriangle,
  ChevronRight,
  DollarSign,
  Shield
} from 'lucide-react';

interface LoanOption {
  id: string;
  name: string;
  nameSwahili: string;
  description: string;
  descriptionSwahili: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  maxAmount: number;
  interestRate: number;
  category: 'medical' | 'transport' | 'emergency';
}

interface MedicalLoanOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanSelect: (loanOption: LoanOption) => void;
}

export const MedicalLoanOptions: React.FC<MedicalLoanOptionsProps> = ({ 
  isOpen,
  onClose,
  onLoanSelect
}) => {
  const { language } = useLanguage();

  const loanOptions: LoanOption[] = [
    {
      id: 'emergency_assistance',
      name: 'Emergency Assistance',
      nameSwahili: 'Msaada wa Dharura',
      description: 'Immediate medical emergency support',
      descriptionSwahili: 'Msaada wa haraka wa kiafya',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      maxAmount: 10000,
      interestRate: 5,
      category: 'emergency'
    },
    {
      id: 'anc_care',
      name: 'Antenatal Care (ANC)',
      nameSwahili: 'Huduma za Mimba',
      description: 'Support for prenatal care and checkups',
      descriptionSwahili: 'Msaada wa huduma za mimba',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 border-pink-200',
      maxAmount: 10000,
      interestRate: 3,
      category: 'medical'
    },
    {
      id: 'delivery_support',
      name: 'Delivery Support',
      nameSwahili: 'Msaada wa Kujifungua',
      description: 'Financial assistance for delivery expenses',
      descriptionSwahili: 'Msaada wa gharama za kujifungua',
      icon: Baby,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      maxAmount: 10000,
      interestRate: 4,
      category: 'medical'
    },
    {
      id: 'maternal_health',
      name: 'Maternal Health Services',
      nameSwahili: 'Huduma za Afya ya Mama',
      description: 'Comprehensive maternal healthcare support',
      descriptionSwahili: 'Msaada wa huduma za afya ya mama',
      icon: Stethoscope,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      maxAmount: 10000,
      interestRate: 3,
      category: 'medical'
    },
    {
      id: 'transport_care',
      name: 'Transport to Care Facilities',
      nameSwahili: 'Usafiri wa Kwenda Hospitali',
      description: 'Transportation costs for medical visits',
      descriptionSwahili: 'Gharama za usafiri wa kwenda hospitali',
      icon: Bike,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      maxAmount: 10000,
      interestRate: 2,
      category: 'transport'
    },
    {
      id: 'social_health_loan',
      name: 'Social Health Insurance Loan',
      nameSwahili: 'Mkopo wa Bima ya Afya ya Kijamii',
      description: 'Loan for social health insurance contributions',
      descriptionSwahili: 'Mkopo wa michango ya bima ya afya ya kijamii',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      maxAmount: 10000,
      interestRate: 1.5,
      category: 'medical'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'sw' ? 'Chagua Aina ya Mkopo' : 'Choose Loan Type'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'sw' 
                ? 'Chagua aina ya mkopo unaouhitaji kwa huduma za afya'
                : 'Select the type of loan you need for health services'
              }
            </p>
          </div>

          <div className="grid gap-4">
            {loanOptions.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onLoanSelect(option)}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-left ${option.bgColor}`}
                aria-label={`${language === 'sw' ? option.nameSwahili : option.name} loan option`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${option.bgColor.replace('50', '100')}`}>
                      <option.icon className={`w-6 h-6 ${option.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {language === 'sw' ? option.nameSwahili : option.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {language === 'sw' ? option.descriptionSwahili : option.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {language === 'sw' ? 'Juu ya' : 'Up to'} KSh {option.maxAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-gray-500">
                          {option.interestRate}% {language === 'sw' ? 'riba' : 'interest'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {language === 'sw' ? 'Ghairi' : 'Cancel'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};