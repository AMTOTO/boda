import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { chvService, Household, Mother, Child } from '../../services/chvService';
import { 
  Car, 
  User, 
  MapPin, 
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Save,
  Navigation,
  Phone,
  Heart,
  Baby,
  Stethoscope,
  Shield
} from 'lucide-react';

interface TransportCoordinationProps {
  isOpen: boolean;
  onClose: () => void;
  onTransportRequested: (requestData: any) => void;
  households: Household[];
  mothers: Mother[];
  children: Child[];
}

export const TransportCoordination: React.FC<TransportCoordinationProps> = ({
  isOpen,
  onClose,
  onTransportRequested,
  households,
  mothers,
  children
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    householdId: '',
    patientType: '' as 'household_member' | 'mother' | 'child' | '',
    patientId: '',
    patientName: '',
    serviceType: '' as 'anc' | 'vaccination' | 'emergency' | 'consultation' | 'referral' | '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'emergency',
    pickupAddress: '',
    destinationFacility: '',
    estimatedDistance: 5,
    symptoms: '',
    specialRequirements: [] as string[],
    paymentMethod: 'chv_approved' as 'chv_approved' | 'household_pays' | 'insurance' | 'emergency_fund',
    approvalReason: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const serviceTypes = [
    {
      id: 'anc',
      name: language === 'sw' ? 'Ziara za ANC' : 'ANC Visits',
      icon: Heart,
      color: 'pink',
      description: language === 'sw' ? 'Huduma za mimba' : 'Antenatal care services'
    },
    {
      id: 'vaccination',
      name: language === 'sw' ? 'Chanjo' : 'Vaccination',
      icon: Baby,
      color: 'blue',
      description: language === 'sw' ? 'Chanjo za watoto' : 'Child immunization'
    },
    {
      id: 'emergency',
      name: language === 'sw' ? 'Dharura' : 'Emergency',
      icon: AlertTriangle,
      color: 'red',
      description: language === 'sw' ? 'Hali za dharura' : 'Emergency situations'
    },
    {
      id: 'consultation',
      name: language === 'sw' ? 'Uchunguzi' : 'Consultation',
      icon: Stethoscope,
      color: 'green',
      description: language === 'sw' ? 'Uchunguzi wa kawaida' : 'Routine checkup'
    },
    {
      id: 'referral',
      name: language === 'sw' ? 'Rufaa' : 'Referral',
      icon: Shield,
      color: 'purple',
      description: language === 'sw' ? 'Kupelekwa hospitali kubwa' : 'Referral to higher facility'
    }
  ];

  const urgencyLevels = [
    {
      level: 'low',
      name: language === 'sw' ? 'Chini' : 'Low',
      color: 'green',
      description: language === 'sw' ? 'Inaweza kusubiri' : 'Can wait',
      responseTime: '2-4 hours'
    },
    {
      level: 'medium',
      name: language === 'sw' ? 'Wastani' : 'Medium',
      color: 'yellow',
      description: language === 'sw' ? 'Inahitaji huduma siku chache' : 'Needs attention within days',
      responseTime: '30-60 minutes'
    },
    {
      level: 'high',
      name: language === 'sw' ? 'Juu' : 'High',
      color: 'orange',
      description: language === 'sw' ? 'Inahitaji huduma haraka' : 'Needs urgent attention',
      responseTime: '15-30 minutes'
    },
    {
      level: 'emergency',
      name: language === 'sw' ? 'Dharura' : 'Emergency',
      color: 'red',
      description: language === 'sw' ? 'Inahitaji huduma mara moja' : 'Needs immediate attention',
      responseTime: '5-15 minutes'
    }
  ];

  const specialRequirementsOptions = [
    language === 'sw' ? 'Stretcher' : 'Stretcher',
    language === 'sw' ? 'Oksijeni' : 'Oxygen',
    language === 'sw' ? 'Mwanamke mjamzito' : 'Pregnant woman',
    language === 'sw' ? 'Mtoto mchanga' : 'Newborn baby',
    language === 'sw' ? 'Mgonjwa wa akili' : 'Mental health patient',
    language === 'sw' ? 'Mtu mlemavu' : 'Disabled person',
    language === 'sw' ? 'Mgonjwa wa kuambukiza' : 'Infectious patient'
  ];

  const paymentMethods = [
    {
      id: 'chv_approved',
      name: language === 'sw' ? 'Imeidhinishwa na CHV' : 'CHV Approved',
      description: language === 'sw' ? 'CHV anaidhinisha malipo' : 'CHV authorizes payment'
    },
    {
      id: 'household_pays',
      name: language === 'sw' ? 'Kaya Italipa' : 'Household Pays',
      description: language === 'sw' ? 'Kaya italipa moja kwa moja' : 'Household pays directly'
    },
    {
      id: 'insurance',
      name: language === 'sw' ? 'Bima' : 'Insurance',
      description: language === 'sw' ? 'Bima italipa' : 'Insurance covers cost'
    },
    {
      id: 'emergency_fund',
      name: language === 'sw' ? 'Fedha za Dharura' : 'Emergency Fund',
      description: language === 'sw' ? 'Fedha za dharura za jamii' : 'Community emergency fund'
    }
  ];

  const calculateEstimatedCost = () => {
    const baseCost = 300;
    const perKmRate = 40;
    const urgencyMultiplier = formData.urgency === 'emergency' ? 1.5 :
                             formData.urgency === 'high' ? 1.3 :
                             formData.urgency === 'medium' ? 1.1 : 1.0;
    
    return Math.round((baseCost + (formData.estimatedDistance * perKmRate)) * urgencyMultiplier);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.householdId) {
      newErrors.householdId = language === 'sw' ? 'Chagua kaya' : 'Select household';
    }

    if (!formData.patientName.trim()) {
      newErrors.patientName = language === 'sw' ? 'Jina la mgonjwa linahitajika' : 'Patient name is required';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = language === 'sw' ? 'Chagua aina ya huduma' : 'Select service type';
    }

    if (!formData.destinationFacility.trim()) {
      newErrors.destinationFacility = language === 'sw' ? 'Kituo cha afya kinahitajika' : 'Destination facility is required';
    }

    if (formData.paymentMethod === 'chv_approved' && !formData.approvalReason.trim()) {
      newErrors.approvalReason = language === 'sw' ? 'Sababu za idhini zinahitajika' : 'Approval reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSpecialRequirementToggle = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter(r => r !== requirement)
        : [...prev.specialRequirements, requirement]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const transportRequestData = {
        householdId: formData.householdId,
        patientName: formData.patientName,
        serviceType: formData.serviceType,
        urgency: formData.urgency,
        pickupAddress: formData.pickupAddress || user?.location || 'CHV Area',
        destinationFacility: formData.destinationFacility,
        estimatedDistance: formData.estimatedDistance,
        estimatedCost: calculateEstimatedCost(),
        symptoms: formData.symptoms,
        specialRequirements: formData.specialRequirements,
        paymentMethod: formData.paymentMethod,
        approvalReason: formData.approvalReason,
        approvedBy: user?.id,
        approvedByName: user?.name,
        notes: formData.notes,
        requestedAt: new Date(),
        status: 'chv_approved'
      };

      // Create transport request through CHV service
      await chvService.createTransportRequest(transportRequestData);
      onTransportRequested(transportRequestData);

    } catch (error) {
      console.error('Error creating transport request:', error);
      setErrors({ submit: language === 'sw' ? 'Imeshindwa kuomba usafiri' : 'Failed to request transport' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'border-red-500 bg-red-100 text-red-800';
      case 'high': return 'border-orange-500 bg-orange-100 text-orange-800';
      case 'medium': return 'border-yellow-500 bg-yellow-100 text-yellow-800';
      default: return 'border-green-500 bg-green-100 text-green-800';
    }
  };

  const selectedHousehold = households.find(h => h.id === formData.householdId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🚕 ${language === 'sw' ? 'Ratibu Usafiri wa Afya' : 'Coordinate Health Transport'}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Household and Patient Selection */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{language === 'sw' ? 'Chagua Mgonjwa' : 'Select Patient'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Kaya' : 'Household'} *
              </label>
              <select
                value={formData.householdId}
                onChange={(e) => {
                  const household = households.find(h => h.id === e.target.value);
                  setFormData(prev => ({ 
                    ...prev, 
                    householdId: e.target.value,
                    pickupAddress: household?.location.village || '',
                    patientId: '',
                    patientName: ''
                  }));
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  errors.householdId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{language === 'sw' ? 'Chagua kaya...' : 'Select household...'}</option>
                {households.map((household) => (
                  <option key={household.id} value={household.id}>
                    {household.headOfHousehold.name} - {household.householdId}
                  </option>
                ))}
              </select>
              {errors.householdId && (
                <p className="mt-1 text-sm text-red-600">{errors.householdId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jina la Mgonjwa' : 'Patient Name'} *
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  errors.patientName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'sw' ? 'Jina la mgonjwa' : 'Patient name'}
              />
              {errors.patientName && (
                <p className="mt-1 text-sm text-red-600">{errors.patientName}</p>
              )}
            </div>
          </div>

          {/* Quick Patient Selection from Registered */}
          {selectedHousehold && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-gray-900">
                {language === 'sw' ? 'Au chagua kutoka kwa waliosajiliwa' : 'Or select from registered members'}:
              </h4>
              
              {/* Mothers */}
              {mothers.filter(m => m.householdId === formData.householdId).length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-pink-600 mb-2">
                    {language === 'sw' ? 'Wajawazito' : 'Pregnant Women'}:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {mothers.filter(m => m.householdId === formData.householdId).map((mother) => (
                      <button
                        key={mother.id}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          patientType: 'mother',
                          patientId: mother.id,
                          patientName: mother.name,
                          serviceType: 'anc'
                        }))}
                        className="px-3 py-2 bg-pink-100 text-pink-800 rounded-lg hover:bg-pink-200 transition-colors text-sm"
                      >
                        🤱 {mother.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Children */}
              {children.filter(c => c.householdId === formData.householdId).length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-purple-600 mb-2">
                    {language === 'sw' ? 'Watoto' : 'Children'}:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {children.filter(c => c.householdId === formData.householdId).map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          patientType: 'child',
                          patientId: child.id,
                          patientName: child.name,
                          serviceType: 'vaccination'
                        }))}
                        className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                      >
                        👶 {child.name} ({child.ageInMonths}m)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Service Type Selection */}
        <div className="bg-green-50 p-4 rounded-xl">
          <h3 className="font-bold text-green-900 mb-4">
            {language === 'sw' ? 'Aina ya Huduma' : 'Service Type'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceTypes.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, serviceType: service.id as any }))}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  formData.serviceType === service.id
                    ? `border-${service.color}-500 bg-${service.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <service.icon className={`w-6 h-6 mx-auto mb-2 ${
                  formData.serviceType === service.id ? `text-${service.color}-600` : 'text-gray-400'
                }`} />
                <h4 className="font-semibold text-gray-900 text-sm">{service.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{service.description}</p>
              </button>
            ))}
          </div>
          {errors.serviceType && (
            <p className="mt-2 text-sm text-red-600">{errors.serviceType}</p>
          )}
        </div>

        {/* Urgency Level */}
        <div className="bg-orange-50 p-4 rounded-xl">
          <h3 className="font-bold text-orange-900 mb-4">
            {language === 'sw' ? 'Kiwango cha Haraka' : 'Urgency Level'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {urgencyLevels.map((level) => (
              <button
                key={level.level}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, urgency: level.level as any }))}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  formData.urgency === level.level
                    ? getUrgencyColor(level.level)
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full mx-auto mb-2 ${
                  level.color === 'green' ? 'bg-green-500' :
                  level.color === 'yellow' ? 'bg-yellow-500' :
                  level.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>
                <h4 className="font-semibold text-gray-900 text-sm">{level.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                <p className="text-xs text-gray-500 mt-1">{level.responseTime}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Mahali pa Kuchukua' : 'Pickup Location'}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.pickupAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder={selectedHousehold?.location.village || user?.location || 'Pickup address'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Kituo cha Afya' : 'Health Facility'} *
            </label>
            <input
              type="text"
              value={formData.destinationFacility}
              onChange={(e) => setFormData(prev => ({ ...prev, destinationFacility: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.destinationFacility ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={language === 'sw' ? 'Kiambu District Hospital' : 'Kiambu District Hospital'}
            />
            {errors.destinationFacility && (
              <p className="mt-1 text-sm text-red-600">{errors.destinationFacility}</p>
            )}
          </div>
        </div>

        {/* Distance and Cost */}
        <div className="bg-yellow-50 p-4 rounded-xl">
          <h3 className="font-bold text-yellow-900 mb-4">
            {language === 'sw' ? 'Umbali na Gharama' : 'Distance and Cost'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Umbali (km)' : 'Distance (km)'}
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={formData.estimatedDistance}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDistance: parseFloat(e.target.value) || 5 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Gharama ya Kadirio' : 'Estimated Cost'}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formatAmount(calculateEstimatedCost())}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Muda wa Kadirio' : 'Estimated Time'}
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={`${Math.round((formData.estimatedDistance / 30) * 60)} min`}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Symptoms and Special Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Dalili au Hali ya Mgonjwa' : 'Symptoms or Patient Condition'}
            </label>
            <textarea
              value={formData.symptoms}
              onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder={language === 'sw' ? 'Eleza dalili au hali ya mgonjwa...' : 'Describe symptoms or patient condition...'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Mahitaji Maalum' : 'Special Requirements'}
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {specialRequirementsOptions.map((requirement) => (
                <button
                  key={requirement}
                  type="button"
                  onClick={() => handleSpecialRequirementToggle(requirement)}
                  className={`w-full p-2 rounded-lg border transition-all text-left text-sm ${
                    formData.specialRequirements.includes(requirement)
                      ? 'border-blue-500 bg-blue-100 text-blue-800'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {formData.specialRequirements.includes(requirement) && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                    <span>{requirement}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-purple-50 p-4 rounded-xl">
          <h3 className="font-bold text-purple-900 mb-4">
            {language === 'sw' ? 'Njia ya Malipo' : 'Payment Method'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.paymentMethod === method.id
                    ? 'border-purple-500 bg-purple-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <h4 className="font-semibold text-gray-900 text-sm">{method.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{method.description}</p>
              </button>
            ))}
          </div>

          {/* CHV Approval Reason */}
          {formData.paymentMethod === 'chv_approved' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Sababu za Idhini' : 'Approval Reason'} *
              </label>
              <textarea
                value={formData.approvalReason}
                onChange={(e) => setFormData(prev => ({ ...prev, approvalReason: e.target.value }))}
                rows={2}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                  errors.approvalReason ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'sw' ? 'Eleza kwa nini unaidhinisha ombi hili...' : 'Explain why you are approving this request...'}
              />
              {errors.approvalReason && (
                <p className="mt-1 text-sm text-red-600">{errors.approvalReason}</p>
              )}
            </div>
          )}
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

        {/* Cost Summary */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-3">
            {language === 'sw' ? 'Muhtasari wa Gharama' : 'Cost Summary'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{language === 'sw' ? 'Gharama ya msingi' : 'Base cost'}:</span>
              <span>KSh 300</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'sw' ? 'Umbali' : 'Distance'} ({formData.estimatedDistance} km):</span>
              <span>KSh {(formData.estimatedDistance * 40).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'sw' ? 'Kiwango cha haraka' : 'Urgency multiplier'}:</span>
              <span>×{formData.urgency === 'emergency' ? '1.5' : formData.urgency === 'high' ? '1.3' : formData.urgency === 'medium' ? '1.1' : '1.0'}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>{language === 'sw' ? 'Jumla' : 'Total'}:</span>
              <span className="text-green-600">{formatAmount(calculateEstimatedCost())}</span>
            </div>
          </div>
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
            className={`flex-1 min-h-[48px] px-6 py-3 rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
              formData.urgency === 'emergency' 
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'sw' ? 'Inaomba...' : 'Requesting...'}</span>
              </>
            ) : (
              <>
                <Car className="w-5 h-5" />
                <span>
                  {formData.urgency === 'emergency' 
                    ? (language === 'sw' ? 'OMBA USAFIRI WA DHARURA' : 'REQUEST EMERGENCY TRANSPORT')
                    : (language === 'sw' ? 'Omba Usafiri' : 'Request Transport')
                  }
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};