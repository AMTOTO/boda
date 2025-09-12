import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useData } from '../../../contexts/DataContext';
import { 
  DollarSign, 
  FileText, 
  Calculator, 
  CheckCircle,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';

interface LoanOption {
  id: string;
  name: string;
  nameSwahili: string;
  description: string;
  descriptionSwahili: string;
  maxAmount: number;
  interestRate: number;
  category: 'medical' | 'transport' | 'emergency';
}

interface LoanApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loanType: string;
}

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  loanType
}) => {
  const { language } = useLanguage();
  const { addNotification } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    loanAmount: '',
    purpose: '',
    urgency: 'medium',
    repaymentPeriod: '3',
    phoneNumber: '',
    alternateContact: '',
    employmentStatus: '',
    monthlyIncome: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const MAX_LOAN_AMOUNT = 10000;

  // Get loan option details based on loanType
  const getLoanOption = (): LoanOption => {
    const loanOptions: Record<string, LoanOption> = {
      'emergency_assistance': {
        id: 'emergency_assistance',
        name: 'Emergency Assistance',
        nameSwahili: 'Msaada wa Dharura',
        description: 'Immediate medical emergency support',
        descriptionSwahili: 'Msaada wa haraka wa kiafya',
        maxAmount: 10000,
        interestRate: 5,
        category: 'emergency'
      },
      'anc_care': {
        id: 'anc_care',
        name: 'Antenatal Care (ANC)',
        nameSwahili: 'Huduma za Mimba',
        description: 'Support for prenatal care and checkups',
        descriptionSwahili: 'Msaada wa huduma za mimba',
        maxAmount: 10000,
        interestRate: 3,
        category: 'medical'
      },
      'delivery_support': {
        id: 'delivery_support',
        name: 'Delivery Support',
        nameSwahili: 'Msaada wa Kujifungua',
        description: 'Financial assistance for delivery expenses',
        descriptionSwahili: 'Msaada wa gharama za kujifungua',
        maxAmount: 10000,
        interestRate: 4,
        category: 'medical'
      },
      'maternal_health': {
        id: 'maternal_health',
        name: 'Maternal Health Services',
        nameSwahili: 'Huduma za Afya ya Mama',
        description: 'Comprehensive maternal healthcare support',
        descriptionSwahili: 'Msaada wa huduma za afya ya mama',
        maxAmount: 10000,
        interestRate: 3,
        category: 'medical'
      },
      'transport_care': {
        id: 'transport_care',
        name: 'Transport to Care Facilities',
        nameSwahili: 'Usafiri wa Kwenda Hospitali',
        description: 'Transportation costs for medical visits',
        descriptionSwahili: 'Gharama za usafiri wa kwenda hospitali',
        maxAmount: 10000,
        interestRate: 2,
        category: 'transport'
      }
    };

    return loanOptions[loanType] || loanOptions['emergency_assistance'];
  };

  const loanOption = getLoanOption();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) {
      newErrors.loanAmount = language === 'sw' ? 'Weka kiasi sahihi' : 'Enter a valid amount';
    } else if (parseFloat(formData.loanAmount) > MAX_LOAN_AMOUNT) {
      newErrors.loanAmount = language === 'sw' 
        ? `Kiwango cha juu ni KSh ${MAX_LOAN_AMOUNT.toLocaleString()}` 
        : `Maximum loan amount is KSh ${MAX_LOAN_AMOUNT.toLocaleString()}`;
    } else if (parseFloat(formData.loanAmount) < 1000) {
      newErrors.loanAmount = language === 'sw' ? 'Kiasi kidogo zaidi ni KSh 1,000' : 'Minimum amount is KSh 1,000';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = language === 'sw' ? 'Eleza madhumuni ya mkopo' : 'Enter loan purpose';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = language === 'sw' ? 'Nambari ya simu inahitajika' : 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateMonthlyPayment = () => {
    if (!formData.loanAmount || !formData.repaymentPeriod) return 0;

    const principal = parseFloat(formData.loanAmount);
    const months = parseInt(formData.repaymentPeriod);
    const monthlyRate = (loanOption.interestRate / 100) / 12;

    if (monthlyRate === 0) return principal / months;

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);

    return monthlyPayment;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const applicationData = {
        loanType: loanOption.id,
        loanTypeName: language === 'sw' ? loanOption.nameSwahili : loanOption.name,
        amount: parseFloat(formData.loanAmount),
        purpose: formData.purpose,
        urgency: formData.urgency,
        repaymentPeriod: parseInt(formData.repaymentPeriod),
        monthlyPayment: calculateMonthlyPayment(),
        interestRate: loanOption.interestRate,
        status: 'pending',
        applicationDate: new Date(),
        ...formData
      };

      addNotification({
        title: language === 'sw' ? 'Ombi la Mkopo Limewasilishwa' : 'Loan Application Submitted',
        message: language === 'sw' 
          ? 'Ombi lako la mkopo limepokelewa na litaangaliwa'
          : 'Your loan application has been received and will be reviewed',
        type: 'success',
        read: false
      });

      setIsSubmitted(true);
      onSuccess();

    } catch (error) {
      addNotification({
        title: language === 'sw' ? 'Hitilafu' : 'Error',
        message: language === 'sw' 
          ? 'Kuna hitilafu katika kuwasilisha ombi'
          : 'There was an error submitting your application',
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'sw' ? 'Ombi Limewasilishwa!' : 'Application Submitted!'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'sw'
              ? 'Ombi lako la mkopo limepokelewa. Utapokea jibu ndani ya masaa 24.'
              : 'Your loan application has been received. You will receive a response within 24 hours.'
            }
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-wallet-primary-500 text-white rounded-xl hover:bg-wallet-primary-600 transition-colors"
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? loanOption.nameSwahili : loanOption.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'sw' ? 'Jaza fomu ya ombi' : 'Fill out the application form'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Kiasi cha Mkopo' : 'Loan Amount'} (KSh)
                <span className="text-xs text-gray-500 ml-2">
                  {language === 'sw' ? `(Kiwango cha juu: KSh ${MAX_LOAN_AMOUNT.toLocaleString()})` 
                    : `(Max: KSh ${MAX_LOAN_AMOUNT.toLocaleString()})`}
                </span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="1000"
                  max={MAX_LOAN_AMOUNT}
                  value={formData.loanAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, loanAmount: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.loanAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={`${language === 'sw' ? 'Kwa mfano' : 'e.g.'} 5,000`}
                />
              </div>
              {errors.loanAmount && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.loanAmount}</span>
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {language === 'sw' ? 'Juu ya' : 'Maximum'}: KSh {MAX_LOAN_AMOUNT.toLocaleString()}
              </p>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'sw' ? 'Maelezo ya Lengo' : 'Purpose Description'} *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.purpose ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={language === 'sw' 
                    ? 'Eleza jinsi utakavyotumia mkopo huu...'
                    : 'Describe how you will use this loan...'
                  }
                />
              </div>
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.purpose}</span>
                </p>
              )}
            </div>

            {/* Urgency & Repayment Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'sw' ? 'Haraka' : 'Urgency'}
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="low">{language === 'sw' ? 'Kidogo' : 'Low'}</option>
                  <option value="medium">{language === 'sw' ? 'Kati' : 'Medium'}</option>
                  <option value="high">{language === 'sw' ? 'Juu' : 'High'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'sw' ? 'Muda wa Kulipa (Miezi)' : 'Repayment Period (Months)'}
                </label>
                <select
                  value={formData.repaymentPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, repaymentPeriod: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="1">1 {language === 'sw' ? 'mwezi' : 'month'}</option>
                  <option value="3">3 {language === 'sw' ? 'miezi' : 'months'}</option>
                  <option value="6">6 {language === 'sw' ? 'miezi' : 'months'}</option>
                  <option value="12">12 {language === 'sw' ? 'miezi' : 'months'}</option>
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+254 7XX XXX XXX"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'sw' ? 'Nambari Mbadala' : 'Alternative Contact'}
                </label>
                <input
                  type="tel"
                  value={formData.alternateContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, alternateContact: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-wallet-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
            </div>

            {/* Payment Calculation */}
            {formData.loanAmount && formData.repaymentPeriod && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    {language === 'sw' ? 'Muhtasari wa Malipo' : 'Payment Summary'}
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === 'sw' ? 'Kiasi cha mkopo' : 'Loan amount'}:
                    </span>
                    <span className="font-semibold">KSh {parseFloat(formData.loanAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === 'sw' ? 'Riba' : 'Interest rate'}:
                    </span>
                    <span className="font-semibold">{loanOption.interestRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === 'sw' ? 'Malipo ya kila mwezi' : 'Monthly payment'}:
                    </span>
                    <span className="font-bold text-blue-600">
                      KSh {calculateMonthlyPayment().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-[48px] px-6 py-3 bg-wallet-primary-500 text-white rounded-xl hover:bg-wallet-primary-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{language === 'sw' ? 'Inawasilisha...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <span>{language === 'sw' ? 'Wasilisha Ombi' : 'Submit Application'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};