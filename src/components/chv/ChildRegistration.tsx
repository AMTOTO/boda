import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { chvService, Child, Household } from '../../services/chvService';
import { 
  Baby, 
  User, 
  Calendar, 
  Scale,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Save,
  Home,
  Activity
} from 'lucide-react';

interface ChildRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onChildAdded: (child: Child) => void;
  availableHouseholds: Household[];
}

export const ChildRegistration: React.FC<ChildRegistrationProps> = ({
  isOpen,
  onClose,
  onChildAdded,
  availableHouseholds
}) => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    householdId: '',
    name: '',
    dateOfBirth: '',
    sex: '' as 'male' | 'female' | '',
    birthWeight: '',
    currentWeight: '',
    height: '',
    muacColor: '' as 'green' | 'yellow' | 'red' | '',
    motherName: '',
    fatherName: '',
    birthCertificateNumber: '',
    placeOfBirth: '',
    deliveryType: '' as 'normal' | 'caesarean' | 'assisted' | '',
    birthAttendant: '' as 'doctor' | 'nurse' | 'midwife' | 'traditional' | 'unattended' | '',
    complications: [] as string[],
    medicalHistory: '',
    allergies: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const complicationOptions = [
    { id: 'premature', label: language === 'sw' ? 'Kuzaliwa mapema' : 'Premature birth', severity: 'high' },
    { id: 'low_birth_weight', label: language === 'sw' ? 'Uzito mdogo wa kuzaliwa' : 'Low birth weight', severity: 'medium' },
    { id: 'birth_asphyxia', label: language === 'sw' ? 'Kukosa hewa wakati wa kuzaliwa' : 'Birth asphyxia', severity: 'high' },
    { id: 'jaundice', label: language === 'sw' ? 'Manjano' : 'Jaundice', severity: 'medium' },
    { id: 'feeding_difficulties', label: language === 'sw' ? 'Shida za kunyonya' : 'Feeding difficulties', severity: 'medium' },
    { id: 'respiratory_distress', label: language === 'sw' ? 'Shida za kupumua' : 'Respiratory distress', severity: 'high' },
    { id: 'congenital_anomaly', label: language === 'sw' ? 'Kasoro za kuzaliwa' : 'Congenital anomaly', severity: 'high' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.householdId) {
      newErrors.householdId = language === 'sw' ? 'Chagua kaya' : 'Select household';
    }

    if (!formData.name.trim()) {
      newErrors.name = language === 'sw' ? 'Jina la mtoto linahitajika' : 'Child name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = language === 'sw' ? 'Tarehe ya kuzaliwa inahitajika' : 'Date of birth is required';
    }

    if (!formData.sex) {
      newErrors.sex = language === 'sw' ? 'Chagua jinsia' : 'Select gender';
    }

    if (!formData.motherName.trim()) {
      newErrors.motherName = language === 'sw' ? 'Jina la mama linahitajika' : 'Mother name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplicationToggle = (complicationId: string) => {
    setFormData(prev => ({
      ...prev,
      complications: prev.complications.includes(complicationId)
        ? prev.complications.filter(c => c !== complicationId)
        : [...prev.complications, complicationId]
    }));
  };

  const calculateAgeInMonths = (birthDate: string) => {
    if (!birthDate) return 0;
    
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average month length
    
    return diffMonths;
  };

  const getMUACColorMeaning = (color: string) => {
    switch (color) {
      case 'green': return language === 'sw' ? 'Lishe nzuri' : 'Well nourished';
      case 'yellow': return language === 'sw' ? 'Hatari ya utapiamlo' : 'At risk of malnutrition';
      case 'red': return language === 'sw' ? 'Utapiamlo mkali' : 'Severe malnutrition';
      default: return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const childData: Omit<Child, 'id' | 'childId' | 'registeredAt' | 'registeredBy'> = {
        householdId: formData.householdId,
        name: formData.name,
        dateOfBirth: new Date(formData.dateOfBirth),
        sex: formData.sex as 'male' | 'female',
        ageInMonths: calculateAgeInMonths(formData.dateOfBirth),
        birthWeight: formData.birthWeight ? parseFloat(formData.birthWeight) : undefined,
        currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        muacColor: formData.muacColor || undefined,
        nutritionStatus: formData.muacColor === 'red' ? 'severe_malnutrition' :
                        formData.muacColor === 'yellow' ? 'moderate_malnutrition' :
                        formData.muacColor === 'green' ? 'well_nourished' : 'not_assessed',
        motherName: formData.motherName,
        fatherName: formData.fatherName || undefined,
        birthCertificateNumber: formData.birthCertificateNumber || undefined,
        birthDetails: {
          placeOfBirth: formData.placeOfBirth || undefined,
          deliveryType: formData.deliveryType || undefined,
          birthAttendant: formData.birthAttendant || undefined,
          complications: formData.complications
        },
        vaccinationStatus: 'up_to_date', // Will be updated based on actual vaccination records
        nextVaccinationDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        medicalHistory: formData.medicalHistory || undefined,
        allergies: formData.allergies || undefined,
        notes: formData.notes || undefined,
        status: 'active'
      };

      const child = await chvService.addChild(childData, user!.id);
      onChildAdded(child);

    } catch (error) {
      console.error('Error registering child:', error);
      setErrors({ submit: language === 'sw' ? 'Imeshindwa kusajili mtoto' : 'Failed to register child' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getComplicationColor = (severity: string) => {
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
      title={`👶 ${language === 'sw' ? 'Sajili Mtoto' : 'Register Child'}`}
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

        {/* Basic Information */}
        <div className="bg-purple-50 p-4 rounded-xl">
          <h3 className="font-bold text-purple-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{language === 'sw' ? 'Taarifa za Msingi' : 'Basic Information'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jina la Mtoto' : 'Child Name'} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'sw' ? 'Michael Wanjiku' : 'Michael Wanjiku'}
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
              {formData.dateOfBirth && (
                <p className="mt-1 text-sm text-purple-600">
                  {language === 'sw' ? 'Umri' : 'Age'}: {calculateAgeInMonths(formData.dateOfBirth)} {language === 'sw' ? 'miezi' : 'months'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jinsia' : 'Gender'} *
              </label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as any }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                  errors.sex ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{language === 'sw' ? 'Chagua jinsia...' : 'Select gender...'}</option>
                <option value="male">{language === 'sw' ? 'Mvulana' : 'Male'}</option>
                <option value="female">{language === 'sw' ? 'Msichana' : 'Female'}</option>
              </select>
              {errors.sex && (
                <p className="mt-1 text-sm text-red-600">{errors.sex}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Uzito wa Kuzaliwa (kg)' : 'Birth Weight (kg)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="6"
                value={formData.birthWeight}
                onChange={(e) => setFormData(prev => ({ ...prev, birthWeight: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                placeholder="3.2"
              />
            </div>
          </div>
        </div>

        {/* Growth Monitoring */}
        <div className="bg-green-50 p-4 rounded-xl">
          <h3 className="font-bold text-green-900 mb-4 flex items-center space-x-2">
            <Scale className="w-5 h-5" />
            <span>{language === 'sw' ? 'Ufuatiliaji wa Ukuaji' : 'Growth Monitoring'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Uzito wa Sasa (kg)' : 'Current Weight (kg)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.currentWeight}
                onChange={(e) => setFormData(prev => ({ ...prev, currentWeight: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="12.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Urefu (cm)' : 'Height (cm)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="85"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Rangi ya MUAC' : 'MUAC Color'}
              </label>
              <select
                value={formData.muacColor}
                onChange={(e) => setFormData(prev => ({ ...prev, muacColor: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="">{language === 'sw' ? 'Chagua rangi...' : 'Select color...'}</option>
                <option value="green">🟢 {language === 'sw' ? 'Kijani (Nzuri)' : 'Green (Good)'}</option>
                <option value="yellow">🟡 {language === 'sw' ? 'Njano (Hatari)' : 'Yellow (At Risk)'}</option>
                <option value="red">🔴 {language === 'sw' ? 'Nyekundu (Mbaya)' : 'Red (Severe)'}</option>
              </select>
              {formData.muacColor && (
                <p className="mt-1 text-sm text-gray-600">
                  {getMUACColorMeaning(formData.muacColor)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Parents Information */}
        <div className="bg-yellow-50 p-4 rounded-xl">
          <h3 className="font-bold text-yellow-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{language === 'sw' ? 'Taarifa za Wazazi' : 'Parents Information'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jina la Mama' : 'Mother Name'} *
              </label>
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 ${
                  errors.motherName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'sw' ? 'Grace Wanjiku' : 'Grace Wanjiku'}
              />
              {errors.motherName && (
                <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jina la Baba' : 'Father Name'}
              </label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
                placeholder={language === 'sw' ? 'John Wanjiku' : 'John Wanjiku'}
              />
            </div>
          </div>
        </div>

        {/* Birth Details */}
        <div className="bg-orange-50 p-4 rounded-xl">
          <h3 className="font-bold text-orange-900 mb-4 flex items-center space-x-2">
            <Baby className="w-5 h-5" />
            <span>{language === 'sw' ? 'Maelezo ya Kuzaliwa' : 'Birth Details'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Mahali pa Kuzaliwa' : 'Place of Birth'}
              </label>
              <input
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                placeholder={language === 'sw' ? 'Kiambu District Hospital' : 'Kiambu District Hospital'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Aina ya Kujifungua' : 'Delivery Type'}
              </label>
              <select
                value={formData.deliveryType}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryType: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
              >
                <option value="">{language === 'sw' ? 'Chagua aina...' : 'Select type...'}</option>
                <option value="normal">{language === 'sw' ? 'Kawaida' : 'Normal delivery'}</option>
                <option value="caesarean">{language === 'sw' ? 'Upasuaji' : 'Caesarean section'}</option>
                <option value="assisted">{language === 'sw' ? 'Kwa msaada' : 'Assisted delivery'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Aliyesaidia Kujifungua' : 'Birth Attendant'}
              </label>
              <select
                value={formData.birthAttendant}
                onChange={(e) => setFormData(prev => ({ ...prev, birthAttendant: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
              >
                <option value="">{language === 'sw' ? 'Chagua msaidizi...' : 'Select attendant...'}</option>
                <option value="doctor">{language === 'sw' ? 'Daktari' : 'Doctor'}</option>
                <option value="nurse">{language === 'sw' ? 'Muuguzi' : 'Nurse'}</option>
                <option value="midwife">{language === 'sw' ? 'Mkunga' : 'Midwife'}</option>
                <option value="traditional">{language === 'sw' ? 'Mkunga wa jadi' : 'Traditional attendant'}</option>
                <option value="unattended">{language === 'sw' ? 'Hakuna msaada' : 'Unattended'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Nambari ya Cheti cha Kuzaliwa' : 'Birth Certificate Number'}
              </label>
              <input
                type="text"
                value={formData.birthCertificateNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, birthCertificateNumber: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                placeholder="BC/2024/XXXXX"
              />
            </div>
          </div>
        </div>

        {/* Birth Complications */}
        <div className="bg-red-50 p-4 rounded-xl">
          <h3 className="font-bold text-red-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{language === 'sw' ? 'Matatizo ya Kuzaliwa' : 'Birth Complications'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {complicationOptions.map((complication) => (
              <button
                key={complication.id}
                type="button"
                onClick={() => handleComplicationToggle(complication.id)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  formData.complications.includes(complication.id)
                    ? getComplicationColor(complication.severity)
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {formData.complications.includes(complication.id) && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span className="font-medium text-sm">{complication.label}</span>
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {complication.severity === 'high' ? (language === 'sw' ? 'Hatari Kubwa' : 'High Risk') :
                   (language === 'sw' ? 'Hatari ya Kati' : 'Medium Risk')}
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
            className="flex-1 min-h-[48px] px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'sw' ? 'Inasajili...' : 'Registering...'}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{language === 'sw' ? 'Sajili Mtoto' : 'Register Child'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};