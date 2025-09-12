import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Car, 
  Heart, 
  Stethoscope, 
  Baby,
  Shield,
  MapPin,
  Clock,
  User,
  Phone,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  Loader
} from 'lucide-react';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequest: (service: any) => void;
  serviceType?: string;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onRequest,
  serviceType = ''
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [selectedService, setSelectedService] = useState<string>('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [pickupLocation, setPickupLocation] = useState(user?.location || '');
  const [destination, setDestination] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distanceInKm, setDistanceInKm] = useState<number>(1);

  // Cost calculation with new pricing tiers
  const calculateTotalCost = () => {
    const distance = Math.max(1, distanceInKm || 1);
    if (distance <= 3) return 50;
    if (distance <= 5) return 100;
    return 100 + ((distance - 5) * 40); // 100 for first 5km + 40 per additional km
  };
  const totalCost = calculateTotalCost();

  const services = [
    {
      id: 'emergency_transport',
      name: language === 'sw' ? 'Usafiri wa Dharura' : 'Emergency Transport',
      icon: Shield,
      color: 'red',
      emoji: '🚨',
      description: language === 'sw' ? 'Usafiri wa haraka kwa hali za dharura' : 'Urgent transport for emergencies',
      estimatedCost: totalCost,
      estimatedTime: '5-10 min'
    },
    {
      id: 'anc_transport',
      name: language === 'sw' ? 'Usafiri wa ANC' : 'ANC Transport',
      icon: Heart,
      color: 'pink',
      emoji: '🤱',
      description: language === 'sw' ? 'Usafiri kwa ziara za ANC' : 'Transport for ANC visits',
      estimatedCost: totalCost,
      estimatedTime: '15-30 min'
    },
    {
      id: 'vaccination_transport',
      name: language === 'sw' ? 'Usafiri wa Chanjo' : 'Vaccination Transport',
      icon: Baby,
      color: 'blue',
      emoji: '💉',
      description: language === 'sw' ? 'Usafiri kwa chanjo za watoto' : 'Transport for child vaccinations',
      estimatedCost: totalCost,
      estimatedTime: '15-30 min'
    },
    {
      id: 'general_checkup',
      name: language === 'sw' ? 'Uchunguzi wa Kawaida' : 'General Checkup',
      icon: Stethoscope,
      color: 'green',
      emoji: '🩺',
      description: language === 'sw' ? 'Usafiri kwa uchunguzi wa kawaida' : 'Transport for routine checkups',
      estimatedCost: totalCost,
      estimatedTime: '20-40 min'
    },
    {
      id: 'home_visit',
      name: language === 'sw' ? 'Ziara ya Nyumbani' : 'Home Visit',
      icon: User,
      color: 'purple',
      emoji: '🏠',
      description: language === 'sw' ? 'Omba CHV aje nyumbani' : 'Request CHV home visit',
      estimatedCost: 0,
      estimatedTime: '1-2 hours'
    },
    {
      id: 'consultation',
      name: language === 'sw' ? 'Ushauri wa Afya' : 'Health Consultation',
      icon: MessageSquare,
      color: 'indigo',
      emoji: '💬',
      description: language === 'sw' ? 'Mazungumzo ya afya na CHV' : 'Health discussion with CHV',
      estimatedCost: 0,
      estimatedTime: '30-60 min'
    }
  ];

  const urgencyLevels = [
    {
      level: 'low',
      name: language === 'sw' ? 'Chini' : 'Low',
      color: 'green',
      description: language === 'sw' ? 'Si haraka, unaweza kusubiri' : 'Not urgent, can wait'
    },
    {
      level: 'medium',
      name: language === 'sw' ? 'Wastani' : 'Medium',
      color: 'yellow',
      description: language === 'sw' ? 'Inahitaji huduma siku chache' : 'Needs attention within days'
    },
    {
      level: 'high',
      name: language === 'sw' ? 'Juu' : 'High',
      color: 'red',
      description: language === 'sw' ? 'Inahitaji huduma haraka' : 'Needs immediate attention'
    }
  ];

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(coords);
          setPickupLocation(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Auto-populate user details on mount
  useEffect(() => {
    if (user) {
      setPatientName(user.name);
      setPickupLocation(user.location || '');
      if (navigator.geolocation) {
        getCurrentLocation();
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !patientName) return;
    
    // Validate distance for transport services
    if (selectedService.includes('transport') && (!distanceInKm || distanceInKm < 1)) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate request processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const service = services.find(s => s.id === selectedService);
    const requestData = {
      serviceId: selectedService,
      serviceName: service?.name,
      urgency,
      patientName,
      patientAge,
      patientGender,
      symptoms,
      pickupLocation,
      destination,
      preferredTime,
      additionalNotes,
      estimatedCost: service?.estimatedCost,
      requestedBy: user?.name,
      timestamp: new Date().toISOString(),
      gpsLocation: currentLocation
    };
    
    onRequest(requestData);
    setShowSuccess(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(false);
      onClose();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setSelectedService('');
    setUrgency('medium');
    setPatientName(user?.name || '');
    setPatientAge('');
    setPatientGender('');
    setSymptoms('');
    setPickupLocation(user?.location || '');
    setDestination('');
    setPreferredTime('');
    setAdditionalNotes('');
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  // Auto-select emergency service if serviceType is emergency
  useEffect(() => {
    if (serviceType === 'emergency' && !selectedService) {
      setSelectedService('emergency_transport');
      setUrgency('high');
    }
  }, [serviceType, selectedService]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'sw' ? 'Omba Huduma' : 'Request Service'}
      size="xl"
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
              {language === 'sw' ? 'Ombi Limewasilishwa!' : 'Request Submitted!'}
            </h3>
            <p className="text-green-700">
              {language === 'sw' 
                ? 'Ombi lako limewasilishwa kwa CHV kwa ukaguzi'
                : 'Your request has been submitted to CHV for review'
              }
            </p>
          </motion.div>
        )}

        {/* Service Selection */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'sw' ? 'Chagua Huduma' : 'Select Service'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <motion.button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedService === service.id
                    ? `border-${service.color}-500 bg-${service.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">{service.emoji}</div>
                  <service.icon className={`w-6 h-6 ${
                    selectedService === service.id ? `text-${service.color}-600` : 'text-gray-400'
                  }`} />
                </div>
                <h5 className="font-semibold text-gray-900 mb-1">{service.name}</h5>
                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{service.estimatedTime}</span>
                  <span className={`font-medium ${service.estimatedCost > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                    {service.estimatedCost > 0 ? `KSh ${service.estimatedCost}` : 'Free'}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {selectedService && (
          <>
            {/* Urgency Level */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">
                {language === 'sw' ? 'Kiwango cha Haraka' : 'Urgency Level'}
              </h5>
              <div className="grid grid-cols-3 gap-3">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.level}
                    onClick={() => setUrgency(level.level as any)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      urgency === level.level
                        ? `border-${level.color}-500 bg-${level.color}-50`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                      level.color === 'green' ? 'bg-green-500' :
                      level.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <h6 className="font-medium text-gray-900 text-sm">{level.name}</h6>
                    <p className="text-xs text-gray-600">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Jina la Mgonjwa' : 'Patient Name'}
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'sw' ? 'Ingiza jina' : 'Enter name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Umri' : 'Age'}
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'sw' ? 'Umri' : 'Age'}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Jinsia' : 'Gender'}
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{language === 'sw' ? 'Chagua jinsia' : 'Select gender'}</option>
                  <option value="male">{language === 'sw' ? 'Mwanaume' : 'Male'}</option>
                  <option value="female">{language === 'sw' ? 'Mwanamke' : 'Female'}</option>
                  <option value="other">{language === 'sw' ? 'Nyingine' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Muda Unaofaa' : 'Preferred Time'}
                </label>
                <input
                  type="datetime-local"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Location Information */}
            {(selectedService.includes('transport') || selectedService === 'home_visit') && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'sw' ? 'Mahali pa Kuchukua' : 'Pickup Location'}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={language === 'sw' ? 'Mahali pa kuchukua' : 'Pickup location'}
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                        title={language === 'sw' ? 'Tumia Mahali Pako' : 'Use Your Location'}
                      >
                        <MapPin className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'sw' ? 'Marudio' : 'Destination'}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={language === 'sw' ? 'Kituo cha afya' : 'Health center'}
                      />
                    </div>
                  </div>
                </div>

                {/* Distance Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sw' ? 'Umbali (km)' : 'Distance (km)'}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={distanceInKm || ''}
                    onChange={(e) => setDistanceInKm(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'sw' ? 'Ingiza umbali kwa kilomita' : 'Enter distance in kilometers'}
                    min="1"
                    step="0.1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {language === 'sw' ? 'Kiwango cha chini: 1 km' : 'Minimum: 1 km'}
                  </p>
                </div>

                {/* Cost Display */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2">
                    {language === 'sw' ? 'Gharama ya Kadirio' : 'Estimated Cost'}
                  </h5>
                  <div className="text-sm text-blue-800">
                    <div className="flex justify-between items-center mb-1">
                      <span>{language === 'sw' ? 'Umbali:' : 'Distance:'}</span>
                      <span className="font-medium">{distanceInKm || 1} km</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span>{language === 'sw' ? 'Viwango vya bei:' : 'Pricing tiers:'}</span>
                      <span className="font-medium text-xs">
                        {distanceInKm <= 3 ? 'KSh 50 (0-3km)' :
                         distanceInKm <= 5 ? 'KSh 100 (3-5km)' :
                         `KSh 100 + ${((distanceInKm - 5) * 40).toFixed(0)} (>5km)`}
                      </span>
                    </div>
                    <div className="border-t border-blue-300 pt-2 mt-2">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>{language === 'sw' ? 'Jumla:' : 'Total:'}</span>
                        <span className="text-blue-600">KSh {totalCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Symptoms/Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Dalili au Maelezo' : 'Symptoms or Description'}
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={language === 'sw' ? 'Eleza dalili au hali ya mgonjwa...' : 'Describe symptoms or patient condition...'}
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Maelezo ya Ziada' : 'Additional Notes'}
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={language === 'sw' ? 'Maelezo mengine muhimu...' : 'Any other important information...'}
              />
            </div>

            {/* Service Summary */}
            {selectedServiceData && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h6 className="font-medium text-gray-900 mb-2">
                  {language === 'sw' ? 'Muhtasari wa Huduma' : 'Service Summary'}
                </h6>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{language === 'sw' ? 'Huduma:' : 'Service:'}</span>
                    <span className="ml-2 font-medium">{selectedServiceData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{language === 'sw' ? 'Gharama:' : 'Cost:'}</span>
                    <span className="ml-2 font-medium text-green-600">
                      {selectedServiceData.estimatedCost > 0 ? `KSh ${selectedServiceData.estimatedCost}` : 'Free'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">{language === 'sw' ? 'Muda:' : 'Time:'}</span>
                    <span className="ml-2 font-medium">{selectedServiceData.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{language === 'sw' ? 'Haraka:' : 'Urgency:'}</span>
                    <span className={`ml-2 font-medium ${
                      urgency === 'high' ? 'text-red-600' :
                      urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {urgencyLevels.find(l => l.level === urgency)?.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {language === 'sw' ? 'Ghairi' : 'Cancel'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedService || !patientName || (selectedService.includes('transport') && (!distanceInKm || distanceInKm < 1))}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>{language === 'sw' ? 'Inawasilisha...' : 'Submitting...'}</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>{language === 'sw' ? 'Wasilisha Ombi' : 'Submit Request'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};