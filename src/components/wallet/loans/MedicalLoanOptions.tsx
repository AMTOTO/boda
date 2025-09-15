import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Modal } from '../../common/Modal';
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
  onLoanSelect: (loanType: string) => void;
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'sw' ? '💳 Chagua Aina ya Mkopo' : '💳 Choose Loan Type'}
      size="xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600">
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
              onClick={() => onLoanSelect(option.id)}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-left ${option.bgColor}`}
              aria-label={`${language === 'sw' ? option.nameSwahili : option.name} loan option`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${option.bgColor.replace('50', '100')}`}>
                    <option.icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {language === 'sw' ? option.nameSwahili : option.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {language === 'sw' ? option.descriptionSwahili : option.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-700">
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

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            {language === 'sw' ? 'Muhimu' : 'Important'}
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {language === 'sw' ? 'Kiwango cha juu cha mikopo ni KSh 10,000' : 'Maximum loan amount is KSh 10,000'}</li>
            <li>• {language === 'sw' ? 'Riba inahesabiwa kwa mwaka' : 'Interest rates are calculated annually'}</li>
            <li>• {language === 'sw' ? 'Malipo yanaweza kufanywa kwa miezi 1-12' : 'Repayment can be made over 1-12 months'}</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};