import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { chvService, Mother, Household } from '../../services/chvService';
import { 
  Heart, 
  User, 
  Calendar, 
  Baby,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Save,
  Phone,
  MapPin,
  Home
} from 'lucide-react';

interface MotherRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onMotherAdded: (mother: Mother) => void;
  availableHouseholds: Household[];
}

export const MotherRegistration: React.FC<MotherRegistrationProps> = ({
  isOpen,
  onClose,
  onMotherAdded,
  availableHouseholds
}) => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    householdId: '',
    name: '',
    dateOfBirth: '',
    phone: '',
    gravida: 1,
    para: 0,
    lastMenstrualPeriod: '',
    expectedDeliveryDate: '',
    ancVisitsCompleted: 0,
    supplements: {
      iron: false,
      folate: false,
      calcium: false,
      vitaminD: false
    },
    birthPlan: {
      preferredFacility: '',
      emergencyContact: '',
      emergencyPhone: '',
      transportPlan: ''
    },
    riskFactors: [] as string[],
    medicalHistory: '',
    allergies: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const riskFactorOptions = [
    { id: 'age_under18', label: language === 'sw' ? 'Umri chini ya miaka 18' : 'Age under 18', severity: 'high' },
    { id: 'age_over35', label: language === 'sw' ? 'Umri zaidi ya miaka 35' : 'Age over 35', severity: 'medium' },
    { id: 'previous_complications', label: language === 'sw' ? 'Matatizo ya awali' : 'Previous complications', severity: 'high' },
    { id: 'multiple_pregnancy', label: language === 'sw' ? 'Mimba ya mapacha' : 'Multiple pregnancy', severity: 'high' },
    { id: 'diabetes', label: language === 'sw' ? 'Kisukari' : 'Diabetes', severity: 'high' },
    { id: 'hypertension', label: language === 'sw' ? 'Shinikizo la damu' : 'Hypertension', severity: 'high' },
    { id: 'anemia', label: language === 'sw' ? 'Upungufu wa damu' : 'Anemia', severity: 'medium' },
    { id: 'hiv_positive', label: language === 'sw' ? 'VVU chanya' : 'HIV positive', severity: 'high' },
    { id: 'malnutrition', label: language === 'sw' ? 'Utapiamlo' : 'Malnutrition', severity: 'medium' }
  ];

  // Calculate EDD from LMP
  const calculateEDD = (lmpDate: string) => {
    if (!lmpDate) return '';
    
    const lmp = new Date(lmpDate);
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280); // 40 weeks
    
    return edd.toISOString().split('T')[0];
  };

  // Calculate gestational age
  const calculateGestationalAge = (lmpDate: string) => {
    if (!lmpDate) return 0;
    
    const lmp = new Date(lmpDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lmp.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return diffWeeks;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.householdId) {
      newErrors.householdId = language === 'sw' ? 'Chagua kaya' : 'Select household';
    }

    if (!formData.name.trim()) {
      newErrors.name = language === 'sw' ? 'Jina linahitajika' : 'Name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = language === 'sw' ? 'Tarehe ya kuzaliwa inahitajika' : 'Date of birth is required';
    }

    if (!formData.lastMenstrualPeriod) {
      newErrors.lastMenstrualPeriod = language === 'sw' ? 'Tarehe ya hedhi ya mwisho inahitajika' : 'Last menstrual period is required';
    }

    if (!formData.birthPlan.preferredFacility.trim()) {
      newErrors.preferredFacility = language === 'sw' ? 'Kituo cha kujifungua kinahitajika' : 'Preferred delivery facility is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRiskFactorToggle = (factorId: string) => {
    setFormData(prev => ({
      ...prev,
      riskFactors: prev.riskFactors.includes(factorId)
        ? prev.riskFactors.filter(f => f !== factorId)
        : [...prev.riskFactors, factorId]
    }));
  };

  const handleSupplementToggle = (supplement: keyof typeof formData.supplements) => {
    setFormData(prev => ({
      ...prev,
      supplements: {
        ...prev.supplements,
        [supplement]: !prev.supplements[supplement]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const motherData: Omit<Mother, 'id' | 'motherId' | 'registeredAt' | 'registeredBy'> = {
        householdId: formData.householdId,
        name: formData.name,
        dateOfBirth: new Date(formData.dateOfBirth),
        phone: formData.phone || undefined,
        gravida: formData.gravida,
        para: formData.para,
        lastMenstrualPeriod: new Date(formData.lastMenstrualPeriod),
        expectedDeliveryDate: new Date(formData.expectedDeliveryDate || calculateEDD(formData.lastMenstrualPeriod)),
        gestationalAge: calculateGestationalAge(formData.lastMenstrualPeriod),
        ancVisitsCompleted: formData.ancVisitsCompleted,
        ancVisitsRequired: 4,
        supplements: formData.supplements,
        birthPlan: formData.birthPlan,
        riskFactors: formData.riskFactors,
        riskLevel: formData.riskFactors.some(f => 
          riskFactorOptions.find(opt => opt.id === f)?.severity === 'high'
        ) ? 'high' : formData.riskFactors.length > 0 ? 'medium' : 'low',
        status: 'active',
        medicalHistory: formData.medicalHistory || undefined,
        allergies: formData.allergies || undefined,
        notes: formData.notes || undefined,
        nextANCDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 4 weeks from now
      };

      const mother = await chvService.addMother(motherData, user!.id);
      onMotherAdded(mother);

    } catch (error) {
      console.error('Error registering mother:', error);
      setErrors({ submit: language === 'sw' ? 'Imeshindwa kusajili mama' : 'Failed to register mother' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-calculate EDD when LMP changes
  const handleLMPChange = (lmpDate: string) => {
    setFormData(prev => ({
      ...prev,
      lastMenstrualPeriod: lmpDate,
      expectedDeliveryDate: calculateEDD(lmpDate)
    }));
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-100 text-red-800';
      case 'medium': return 'border-yellow-500 bg-yellow-100 text-yellow-800';
      default: return 'border-green-500 bg-green-100 text-green-800';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🤱 ${language === 'sw' ? 'Sajili Mama/Mjamzito' : 'Register Mother/Pregnant Woman'}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Household Selection */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
            <Home className="w-5 h-5" />
            <span>{language === 'sw' ? 'Chagua Kaya' : 'Select Household'}</span>
          </h3>
          
          <select
            value={formData.householdId}
            onChange={(e) => setFormData(prev => ({ ...prev, householdId: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
              errors.householdId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{language === 'sw' ? 'Chagua kaya...' : 'Select household...'}</option>
            {availableHouseholds.map((household) => (
              <option key={household.id} value={household.id}>
                {household.headOfHousehold.name} - {household.householdId} ({household.location.village})
              </option>
            ))}
          </select>
          {errors.householdId && (
            <p className="mt-1 text-sm text-red-600">{errors.householdId}</p>
          )}
        </div>

        {/* Personal Information */}
        <div className="bg-pink-50 p-4 rounded-xl">
          <h3 className="font-bold text-pink-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{language === 'sw' ? 'Taarifa za Kibinafsi' : 'Personal Information'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jina Kamili' : 'Full Name'} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'sw' ? 'Grace Wanjiku' : 'Grace Wanjiku'}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Tarehe ya Kuzaliwa' : 'Date of Birth'} *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                placeholder="+254 7XX XXX XXX"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Gravida' : 'Gravida'} *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.gravida}
                  onChange={(e) => setFormData(prev => ({ ...prev, gravida: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Para' : 'Para'} *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.para}
                  onChange={(e) => setFormData(prev => ({ ...prev, para: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pregnancy Information */}
        <div className="bg-purple-50 p-4 rounded-xl">
          <h3 className="font-bold text-purple-900 mb-4 flex items-center space-x-2">
            <Baby className="w-5 h-5" />
            <span>{language === 'sw' ? 'Taarifa za Ujauzito' : 'Pregnancy Information'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Hedhi ya Mwisho (LMP)' : 'Last Menstrual Period (LMP)'} *
              </label>
              <input
                type="date"
                value={formData.lastMenstrualPeriod}
                onChange={(e) => handleLMPChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                  errors.lastMenstrualPeriod ? 'border-red-500' : 'border-gray-300'
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.lastMenstrualPeriod && (
                <p className="mt-1 text-sm text-red-600">{errors.lastMenstrualPeriod}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Tarehe ya Kujifungua (EDD)' : 'Expected Delivery Date (EDD)'}
              </label>
              <input
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-100"
                readOnly
              />
              {formData.lastMenstrualPeriod && (
                <p className="mt-1 text-sm text-purple-600">
                  {language === 'sw' ? 'Wiki za ujauzito' : 'Gestational age'}: {calculateGestationalAge(formData.lastMenstrualPeriod)} {language === 'sw' ? 'wiki' : 'weeks'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Ziara za ANC Zilizokamilika' : 'ANC Visits Completed'}
              </label>
              <input
                type="number"
                min="0"
                max="8"
                value={formData.ancVisitsCompleted}
                onChange={(e) => setFormData(prev => ({ ...prev, ancVisitsCompleted: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Supplements Tracking */}
        <div className="bg-green-50 p-4 rounded-xl">
          <h3 className="font-bold text-green-900 mb-4 flex items-center space-x-2">
            <Stethoscope className="w-5 h-5" />
            <span>{language === 'sw' ? 'Virutubisho' : 'Supplements'}</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(formData.supplements).map(([supplement, isSelected]) => (
              <button
                key={supplement}
                type="button"
                onClick={() => handleSupplementToggle(supplement as keyof typeof formData.supplements)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isSelected && <CheckCircle className="w-4 h-4 text-green-600" />}
                  <span className="font-medium text-gray-900 text-sm capitalize">
                    {supplement === 'iron' ? (language === 'sw' ? 'Chuma' : 'Iron') :
                     supplement === 'folate' ? (language === 'sw' ? 'Folate' : 'Folate') :
                     supplement === 'calcium' ? (language === 'sw' ? 'Kalsiamu' : 'Calcium') :
                     supplement === 'vitaminD' ? (language === 'sw' ? 'Vitamini D' : 'Vitamin D') :
                     supplement}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Birth Plan */}
        <div className="bg-yellow-50 p-4 rounded-xl">
          <h3 className="font-bold text-yellow-900 mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>{language === 'sw' ? 'Mpango wa Kujifungua' : 'Birth Plan'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Kituo cha Kujifungua' : 'Preferred Delivery Facility'} *
              </label>
              <input
                type="text"
                value={formData.birthPlan.preferredFacility}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  birthPlan: { ...prev.birthPlan, preferredFacility: e.target.value }
                }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 ${
                  errors.preferredFacility ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'sw' ? 'Kiambu District Hospital' : 'Kiambu District Hospital'}
              />
              {errors.preferredFacility && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredFacility}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Mpango wa Usafiri' : 'Transport Plan'}
              </label>
              <input
                type="text"
                value={formData.birthPlan.transportPlan}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  birthPlan: { ...prev.birthPlan, transportPlan: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
                placeholder={language === 'sw' ? 'ParaBoda, gari la familia, n.k.' : 'ParaBoda, family car, etc.'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Mtu wa Kuwasiliana Wakati wa Dharura' : 'Emergency Contact'}
              </label>
              <input
                type="text"
                value={formData.birthPlan.emergencyContact}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  birthPlan: { ...prev.birthPlan, emergencyContact: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
                placeholder={language === 'sw' ? 'Jina la mtu wa kuwasiliana' : 'Emergency contact name'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Simu ya Dharura' : 'Emergency Phone'}
              </label>
              <input
                type="tel"
                value={formData.birthPlan.emergencyPhone}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  birthPlan: { ...prev.birthPlan, emergencyPhone: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
                placeholder="+254 7XX XXX XXX"
              />
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-red-50 p-4 rounded-xl">
          <h3 className="font-bold text-red-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{language === 'sw' ? 'Sababu za Hatari' : 'Risk Factors'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {riskFactorOptions.map((factor) => (
              <button
                key={factor.id}
                type="button"
                onClick={() => handleRiskFactorToggle(factor.id)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  formData.riskFactors.includes(factor.id)
                    ? getRiskColor(factor.severity)
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {formData.riskFactors.includes(factor.id) && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span className="font-medium text-sm">{factor.label}</span>
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {factor.severity === 'high' ? (language === 'sw' ? 'Hatari Kubwa' : 'High Risk') :
                   factor.severity === 'medium' ? (language === 'sw' ? 'Hatari ya Kati' : 'Medium Risk') :
                   (language === 'sw' ? 'Hatari Ndogo' : 'Low Risk')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Medical History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Historia ya Matibabu' : 'Medical History'}
            </label>
            <textarea
              value={formData.medicalHistory}
              onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder={language === 'sw' ? 'Magonjwa ya awali, upasuaji, n.k.' : 'Previous illnesses, surgeries, etc.'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Mzio/Allergies' : 'Allergies'}
            </label>
            <textarea
              value={formData.allergies}
              onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder={language === 'sw' ? 'Dawa, chakula, au vitu vingine...' : 'Medications, foods, or other substances...'}
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'sw' ? 'Maelezo ya Ziada' : 'Additional Notes'}
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'sw' ? 'Maelezo mengine muhimu...' : 'Any other important information...'}
          />
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* Action Buttons */}
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
            className="flex-1 min-h-[48px] px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'sw' ? 'Inasajili...' : 'Registering...'}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{language === 'sw' ? 'Sajili Mama' : 'Register Mother'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};