import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { GovernanceSelector } from '../common/GovernanceSelector';
import { GPSLocationDisplay } from '../common/GPSLocationDisplay';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { chvService, Household } from '../../services/chvService';
import { 
  Home, 
  User, 
  Phone, 
  MapPin, 
  Shield, 
  Users,
  AlertTriangle,
  CheckCircle,
  Save,
  X,
  Navigation,
  Target
} from 'lucide-react';

interface HouseholdManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onHouseholdAdded: (household: Household) => void;
  mode: 'add' | 'edit';
  existingHousehold?: Household | null;
}

export const HouseholdManagement: React.FC<HouseholdManagementProps> = ({
  isOpen,
  onClose,
  onHouseholdAdded,
  mode,
  existingHousehold
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [useManualLocation, setUseManualLocation] = useState(false);

  const [formData, setFormData] = useState({
    headOfHouseholdName: '',
    headOfHouseholdPhone: '',
    country: 'KE',
    administrativeUnits: [] as string[],
    village: '',
    manualAddress: '',
    totalMembers: 1,
    adults: 1,
    children: 0,
    pregnantWomen: 0,
    childrenUnder5: 0,
    elderly: 0,
    disabled: 0,
    chronicIllness: 0,
    insuranceStatus: 'None' as 'SHA' | 'NHIF' | 'Mutuelle' | 'None' | 'Other',
    otherInsurance: '',
    vulnerableGroups: [] as string[],
    notes: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && existingHousehold) {
      setFormData({
        headOfHouseholdName: existingHousehold.headOfHousehold.name,
        headOfHouseholdPhone: existingHousehold.headOfHousehold.phone || '',
        country: existingHousehold.location.country,
        administrativeUnits: existingHousehold.location.administrativeUnits,
        village: existingHousehold.location.village,
        manualAddress: existingHousehold.location.manualAddress || '',
        totalMembers: existingHousehold.totalMembers,
        adults: existingHousehold.adults,
        children: existingHousehold.children,
        pregnantWomen: existingHousehold.pregnantWomen,
        childrenUnder5: existingHousehold.childrenUnder5,
        elderly: existingHousehold.elderly || 0,
        disabled: existingHousehold.disabled || 0,
        chronicIllness: existingHousehold.chronicIllness || 0,
        insuranceStatus: existingHousehold.insuranceStatus,
        otherInsurance: existingHousehold.otherInsurance || '',
        vulnerableGroups: existingHousehold.vulnerableGroups,
        notes: existingHousehold.notes || '',
        emergencyContact: existingHousehold.emergencyContact?.name || '',
        emergencyPhone: existingHousehold.emergencyContact?.phone || ''
      });
      
      if (existingHousehold.location.gpsCoords) {
        setCurrentLocation(existingHousehold.location.gpsCoords);
      }
    }
  }, [mode, existingHousehold]);

  const insuranceOptions = [
    { value: 'SHA', label: 'SHA (Social Health Authority)', color: 'green' },
    { value: 'NHIF', label: 'NHIF (National Hospital Insurance Fund)', color: 'blue' },
    { value: 'Mutuelle', label: 'Mutuelle de Santé (Rwanda)', color: 'purple' },
    { value: 'None', label: language === 'sw' ? 'Hakuna Bima' : 'No Insurance', color: 'gray' },
    { value: 'Other', label: language === 'sw' ? 'Nyingine' : 'Other', color: 'yellow' }
  ];

  const vulnerableGroupOptions = [
    { id: 'pregnant', label: language === 'sw' ? 'Wajawazito' : 'Pregnant Women', icon: '🤱' },
    { id: 'under5', label: language === 'sw' ? 'Watoto chini ya miaka 5' : 'Children Under 5', icon: '👶' },
    { id: 'elderly', label: language === 'sw' ? 'Wazee' : 'Elderly (65+)', icon: '👴' },
    { id: 'disabled', label: language === 'sw' ? 'Walemavu' : 'Disabled', icon: '♿' },
    { id: 'chronic', label: language === 'sw' ? 'Magonjwa ya Kudumu' : 'Chronic Illness', icon: '💊' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.headOfHouseholdName.trim()) {
      newErrors.headOfHouseholdName = language === 'sw' ? 'Jina la mkuu wa kaya linahitajika' : 'Head of household name is required';
    }

    if (!formData.headOfHouseholdPhone.trim()) {
      newErrors.headOfHouseholdPhone = language === 'sw' ? 'Nambari ya simu inahitajika' : 'Phone number is required';
    }

    if (formData.administrativeUnits.length === 0) {
      newErrors.administrativeUnits = language === 'sw' ? 'Chagua eneo la utawala' : 'Select administrative area';
    }

    if (!formData.village.trim() && !useManualLocation) {
      newErrors.village = language === 'sw' ? 'Jina la kijiji linahitajika' : 'Village name is required';
    }

    if (useManualLocation && !formData.manualAddress.trim()) {
      newErrors.manualAddress = language === 'sw' ? 'Anwani ya mkono inahitajika' : 'Manual address is required';
    }

    if (formData.totalMembers < 1) {
      newErrors.totalMembers = language === 'sw' ? 'Angalau mtu mmoja anahitajika' : 'At least one member required';
    }

    if (formData.adults + formData.children !== formData.totalMembers) {
      newErrors.totalMembers = language === 'sw' ? 'Jumla ya wanakaya hazilingani' : 'Total members do not match';
    }

    if (formData.insuranceStatus === 'Other' && !formData.otherInsurance.trim()) {
      newErrors.otherInsurance = language === 'sw' ? 'Eleza aina ya bima nyingine' : 'Specify other insurance type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVulnerableGroupToggle = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      vulnerableGroups: prev.vulnerableGroups.includes(groupId)
        ? prev.vulnerableGroups.filter(g => g !== groupId)
        : [...prev.vulnerableGroups, groupId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const householdData: Omit<Household, 'id' | 'householdId' | 'registeredAt' | 'registeredBy'> = {
        headOfHousehold: {
          name: formData.headOfHouseholdName,
          phone: formData.headOfHouseholdPhone
        },
        location: {
          country: formData.country,
          administrativeUnits: formData.administrativeUnits,
          village: useManualLocation ? 'Manual Location' : formData.village,
          manualAddress: useManualLocation ? formData.manualAddress : undefined,
          gpsCoords: currentLocation
        },
        totalMembers: formData.totalMembers,
        adults: formData.adults,
        children: formData.children,
        pregnantWomen: formData.pregnantWomen,
        childrenUnder5: formData.childrenUnder5,
        elderly: formData.elderly,
        disabled: formData.disabled,
        chronicIllness: formData.chronicIllness,
        insuranceStatus: formData.insuranceStatus,
        otherInsurance: formData.insuranceStatus === 'Other' ? formData.otherInsurance : undefined,
        vulnerableGroups: formData.vulnerableGroups,
        status: 'active',
        notes: formData.notes || undefined,
        emergencyContact: formData.emergencyContact ? {
          name: formData.emergencyContact,
          phone: formData.emergencyPhone
        } : undefined,
        lastVisit: mode === 'add' ? new Date() : existingHousehold?.lastVisit,
        nextVisit: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };

      let household: Household;
      
      if (mode === 'edit' && existingHousehold) {
        household = await chvService.updateHousehold(existingHousehold.id, householdData);
      } else {
        household = await chvService.addHousehold(householdData, user!.id);
      }

      onHouseholdAdded(household);

    } catch (error) {
      console.error('Error saving household:', error);
      setErrors({ submit: language === 'sw' ? 'Imeshindwa kuhifadhi kaya' : 'Failed to save household' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationUpdate = (location: {lat: number, lng: number}) => {
    setCurrentLocation(location);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🏠 ${mode === 'edit' ? (language === 'sw' ? 'Hariri Kaya' : 'Edit Household') : (language === 'sw' ? 'Ongeza Kaya' : 'Add Household')}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Head of Household Information */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{language === 'sw' ? 'Mkuu wa Kaya' : 'Head of Household'}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jina Kamili' : 'Full Name'} *
              </label>
              <input
                type="text"
                value={formData.headOfHouseholdName}
                onChange={(e) => setFormData(prev => ({ ...prev, headOfHouseholdName: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  errors.headOfHouseholdName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'sw' ? 'Grace Wanjiku' : 'Grace Wanjiku'}
              />
              {errors.headOfHouseholdName && (
                <p className="mt-1 text-sm text-red-600">{errors.headOfHouseholdName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.headOfHouseholdPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, headOfHouseholdPhone: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                    errors.headOfHouseholdPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
              {errors.headOfHouseholdPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.headOfHouseholdPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-green-50 p-4 rounded-xl">
          <h3 className="font-bold text-green-900 mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>{language === 'sw' ? 'Mahali pa Kaya' : 'Household Location'}</span>
          </h3>

          {/* Location Method Toggle */}
          <div className="mb-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUseManualLocation(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  !useManualLocation
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>{language === 'sw' ? 'GPS + Utawala' : 'GPS + Governance'}</span>
              </button>
              <button
                type="button"
                onClick={() => setUseManualLocation(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  useManualLocation
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>{language === 'sw' ? 'Anwani ya Mkono' : 'Manual Address'}</span>
              </button>
            </div>
          </div>

          {!useManualLocation ? (
            <>
              {/* GPS Location */}
              <div className="mb-4">
                <GPSLocationDisplay
                  onLocationUpdate={handleLocationUpdate}
                  showAccuracy={true}
                  autoUpdate={mode === 'add'}
                />
              </div>

              {/* Governance Selector */}
              <div className="mb-4">
                <GovernanceSelector
                  selectedCountry={formData.country}
                  selectedUnits={formData.administrativeUnits}
                  onSelectionChange={(units) => setFormData(prev => ({ ...prev, administrativeUnits: units }))}
                  required={true}
                />
                {errors.administrativeUnits && (
                  <p className="mt-1 text-sm text-red-600">{errors.administrativeUnits}</p>
                )}
              </div>

              {/* Village */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Kijiji/Mtaa' : 'Village/Neighborhood'} *
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${
                    errors.village ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={language === 'sw' ? 'Kiambu Village' : 'Kiambu Village'}
                />
                {errors.village && (
                  <p className="mt-1 text-sm text-red-600">{errors.village}</p>
                )}
              </div>
            </>
          ) : (
            /* Manual Address */
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Anwani Kamili' : 'Complete Address'} *
              </label>
              <textarea
                value={formData.manualAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, manualAddress: e.target.value }))}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${
                  errors.manualAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'sw' ? 'Andika anwani kamili ya kaya...' : 'Write complete household address...'}
              />
              {errors.manualAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.manualAddress}</p>
              )}
            </div>
          )}
        </div>

        {/* Household Composition */}
        <div className="bg-purple-50 p-4 rounded-xl">
          <h3 className="font-bold text-purple-900 mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>{language === 'sw' ? 'Muundo wa Kaya' : 'Household Composition'}</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jumla ya Wanakaya' : 'Total Members'} *
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalMembers}
                onChange={(e) => setFormData(prev => ({ ...prev, totalMembers: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Watu Wazima' : 'Adults'} *
              </label>
              <input
                type="number"
                min="0"
                value={formData.adults}
                onChange={(e) => setFormData(prev => ({ ...prev, adults: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Watoto' : 'Children'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.children}
                onChange={(e) => setFormData(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Wajawazito' : 'Pregnant Women'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.pregnantWomen}
                onChange={(e) => setFormData(prev => ({ ...prev, pregnantWomen: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Watoto <5' : 'Children <5'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.childrenUnder5}
                onChange={(e) => setFormData(prev => ({ ...prev, childrenUnder5: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {errors.totalMembers && (
            <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4" />
              <span>{errors.totalMembers}</span>
            </p>
          )}
        </div>

        {/* Insurance Status */}
        <div className="bg-yellow-50 p-4 rounded-xl">
          <h3 className="font-bold text-yellow-900 mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>{language === 'sw' ? 'Hali ya Bima' : 'Insurance Status'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {insuranceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, insuranceStatus: option.value as any }))}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  formData.insuranceStatus === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900 text-sm">{option.label}</div>
              </button>
            ))}
          </div>

          {formData.insuranceStatus === 'Other' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Eleza Aina ya Bima' : 'Specify Insurance Type'} *
              </label>
              <input
                type="text"
                value={formData.otherInsurance}
                onChange={(e) => setFormData(prev => ({ ...prev, otherInsurance: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 ${
                  errors.otherInsurance ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'sw' ? 'Andika aina ya bima...' : 'Enter insurance type...'}
              />
              {errors.otherInsurance && (
                <p className="mt-1 text-sm text-red-600">{errors.otherInsurance}</p>
              )}
            </div>
          )}
        </div>

        {/* Vulnerable Groups */}
        <div className="bg-red-50 p-4 rounded-xl">
          <h3 className="font-bold text-red-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{language === 'sw' ? 'Vikundi vya Hatari' : 'Vulnerable Groups'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {vulnerableGroupOptions.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => handleVulnerableGroupToggle(group.id)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  formData.vulnerableGroups.includes(group.id)
                    ? 'border-red-500 bg-red-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{group.icon}</span>
                  <span className="font-medium text-gray-900 text-sm">{group.label}</span>
                  {formData.vulnerableGroups.includes(group.id) && (
                    <CheckCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-orange-50 p-4 rounded-xl">
          <h3 className="font-bold text-orange-900 mb-4 flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>{language === 'sw' ? 'Mtu wa Kuwasiliana Wakati wa Dharura' : 'Emergency Contact'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jina' : 'Name'}
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                placeholder={language === 'sw' ? 'Jina la mtu wa kuwasiliana' : 'Emergency contact name'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                placeholder="+254 7XX XXX XXX"
              />
            </div>
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
            className="flex-1 min-h-[48px] px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'sw' ? 'Inahifadhi...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{mode === 'edit' ? (language === 'sw' ? 'Sasisha' : 'Update') : (language === 'sw' ? 'Hifadhi' : 'Save')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};