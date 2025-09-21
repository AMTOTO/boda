import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { GPSLocationDisplay } from '../common/GPSLocationDisplay';
import { CameraCapture } from '../common/CameraCapture';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { chvService, Hazard } from '../../services/chvService';
import { 
  AlertTriangle, 
  MapPin, 
  Camera,
  Save,
  Thermometer,
  Droplets,
  Wind,
  Mountain,
  Flame,
  Zap,
  Home,
  Users,
  Car,
  Wheat,
  X
} from 'lucide-react';

interface HazardReportingProps {
  isOpen: boolean;
  onClose: () => void;
  onHazardReported: (hazard: Hazard) => void;
}

export const HazardReporting: React.FC<HazardReportingProps> = ({
  isOpen,
  onClose,
  onHazardReported
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: '' as 'flood' | 'drought' | 'storm' | 'landslide' | 'heatwave' | 'earthquake' | 'fire' | '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    description: '',
    impact: {
      displacement: false,
      roadCutOff: false,
      cropLoss: false,
      infrastructureDamage: false,
      waterContamination: false,
      powerOutage: false,
      communicationDown: false
    },
    affectedHouseholds: 0,
    affectedPeople: 0,
    casualties: 0,
    immediateNeeds: [] as string[],
    responseActions: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const hazardTypes = [
    { 
      id: 'flood', 
      name: language === 'sw' ? 'Mafuriko' : 'Flood', 
      icon: Droplets, 
      emoji: '🌊', 
      color: 'blue',
      healthRisks: language === 'sw' ? 'Kipindupindu, malaria, magonjwa ya ngozi' : 'Cholera, malaria, skin diseases'
    },
    { 
      id: 'drought', 
      name: language === 'sw' ? 'Ukame' : 'Drought', 
      icon: Thermometer, 
      emoji: '☀️', 
      color: 'yellow',
      healthRisks: language === 'sw' ? 'Utapiamlo, magonjwa ya tumbo' : 'Malnutrition, gastrointestinal diseases'
    },
    { 
      id: 'storm', 
      name: language === 'sw' ? 'Dhoruba' : 'Storm', 
      icon: Wind, 
      emoji: '⛈️', 
      color: 'gray',
      healthRisks: language === 'sw' ? 'Majeraha, magonjwa ya kupumua' : 'Injuries, respiratory diseases'
    },
    { 
      id: 'landslide', 
      name: language === 'sw' ? 'Mteremko wa Ardhi' : 'Landslide', 
      icon: Mountain, 
      emoji: '🌋', 
      color: 'orange',
      healthRisks: language === 'sw' ? 'Majeraha makubwa, kifo' : 'Severe injuries, fatalities'
    },
    { 
      id: 'heatwave', 
      name: language === 'sw' ? 'Joto Kali' : 'Heatwave', 
      icon: Flame, 
      emoji: '🔥', 
      color: 'red',
      healthRisks: language === 'sw' ? 'Joto la mwili, upungufu wa maji' : 'Heat stroke, dehydration'
    },
    { 
      id: 'earthquake', 
      name: language === 'sw' ? 'Tetemeko la Ardhi' : 'Earthquake', 
      icon: Zap, 
      emoji: '🌍', 
      color: 'purple',
      healthRisks: language === 'sw' ? 'Majeraha, msongo wa mawazo' : 'Injuries, psychological trauma'
    }
  ];

  const impactOptions = [
    { id: 'displacement', label: language === 'sw' ? 'Watu wamehamishwa' : 'People displaced', icon: Home },
    { id: 'roadCutOff', label: language === 'sw' ? 'Barabara zimekatwa' : 'Roads cut off', icon: Car },
    { id: 'cropLoss', label: language === 'sw' ? 'Mazao yameharibiwa' : 'Crop loss', icon: Wheat },
    { id: 'infrastructureDamage', label: language === 'sw' ? 'Miundombinu imeharibiwa' : 'Infrastructure damage', icon: Home },
    { id: 'waterContamination', label: language === 'sw' ? 'Maji yamechafuliwa' : 'Water contamination', icon: Droplets },
    { id: 'powerOutage', label: language === 'sw' ? 'Umeme umekatika' : 'Power outage', icon: Zap },
    { id: 'communicationDown', label: language === 'sw' ? 'Mawasiliano yameshindikana' : 'Communication down', icon: AlertTriangle }
  ];

  const immediateNeedsOptions = [
    language === 'sw' ? 'Makazi ya muda' : 'Temporary shelter',
    language === 'sw' ? 'Maji safi' : 'Clean water',
    language === 'sw' ? 'Chakula' : 'Food',
    language === 'sw' ? 'Huduma za matibabu' : 'Medical care',
    language === 'sw' ? 'Blanketi na nguo' : 'Blankets and clothing',
    language === 'sw' ? 'Usafiri wa dharura' : 'Emergency transport',
    language === 'sw' ? 'Mawasiliano' : 'Communication',
    language === 'sw' ? 'Usalama' : 'Security'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = language === 'sw' ? 'Chagua aina ya hatari' : 'Select hazard type';
    }

    if (!formData.description.trim()) {
      newErrors.description = language === 'sw' ? 'Maelezo yanahitajika' : 'Description is required';
    }

    if (!currentLocation) {
      newErrors.location = language === 'sw' ? 'Mahali pa GPS panahitajika' : 'GPS location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImpactToggle = (impactId: keyof typeof formData.impact) => {
    setFormData(prev => ({
      ...prev,
      impact: {
        ...prev.impact,
        [impactId]: !prev.impact[impactId]
      }
    }));
  };

  const handleImmediateNeedToggle = (need: string) => {
    setFormData(prev => ({
      ...prev,
      immediateNeeds: prev.immediateNeeds.includes(need)
        ? prev.immediateNeeds.filter(n => n !== need)
        : [...prev.immediateNeeds, need]
    }));
  };

  const handleCameraCapture = (imageData: string, file: File) => {
    setCapturedPhoto(imageData);
    setShowCameraCapture(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const hazardData: Omit<Hazard, 'id' | 'reportedAt' | 'reportedBy'> = {
        type: formData.type as any,
        severity: formData.severity,
        location: {
          gpsCoords: currentLocation!,
          address: user?.location || 'Unknown location',
          administrativeUnits: user?.administrativeUnits || []
        },
        description: formData.description,
        impact: formData.impact,
        affectedHouseholds: formData.affectedHouseholds,
        affectedPeople: formData.affectedPeople,
        casualties: formData.casualties,
        immediateNeeds: formData.immediateNeeds,
        responseActions: formData.responseActions || undefined,
        photoUrl: capturedPhoto || undefined,
        status: 'reported',
        healthRisks: hazardTypes.find(h => h.id === formData.type)?.healthRisks || '',
        notes: formData.notes || undefined
      };

      const hazard = await chvService.reportHazard(hazardData, user!.id);
      onHazardReported(hazard);

    } catch (error) {
      console.error('Error reporting hazard:', error);
      setErrors({ submit: language === 'sw' ? 'Imeshindwa kuripoti hatari' : 'Failed to report hazard' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-100 text-red-800';
      case 'medium': return 'border-yellow-500 bg-yellow-100 text-yellow-800';
      default: return 'border-green-500 bg-green-100 text-green-800';
    }
  };

  const selectedHazard = hazardTypes.find(h => h.id === formData.type);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`🌦️ ${language === 'sw' ? 'Ripoti ya Hatari za Mazingira' : 'Environmental Hazard Report'}`}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hazard Type Selection */}
          <div className="bg-red-50 p-4 rounded-xl">
            <h3 className="font-bold text-red-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{language === 'sw' ? 'Aina ya Hatari' : 'Hazard Type'}</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hazardTypes.map((hazard) => (
                <button
                  key={hazard.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: hazard.id as any }))}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    formData.type === hazard.id
                      ? `border-${hazard.color}-500 bg-${hazard.color}-50`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{hazard.emoji}</div>
                  <hazard.icon className={`w-6 h-6 mx-auto mb-2 ${
                    formData.type === hazard.id ? `text-${hazard.color}-600` : 'text-gray-400'
                  }`} />
                  <h4 className="font-semibold text-gray-900 text-sm">{hazard.name}</h4>
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600">{errors.type}</p>
            )}

            {/* Health Risks Warning */}
            {selectedHazard && (
              <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">
                      {language === 'sw' ? 'Hatari za Afya Zinazohusiana' : 'Associated Health Risks'}
                    </h4>
                    <p className="text-sm text-yellow-700">{selectedHazard.healthRisks}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Severity Level */}
          <div className="bg-orange-50 p-4 rounded-xl">
            <h3 className="font-bold text-orange-900 mb-4">
              {language === 'sw' ? 'Kiwango cha Hatari' : 'Severity Level'}
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {[
                { level: 'low', label: language === 'sw' ? 'Chini' : 'Low', color: 'green', description: language === 'sw' ? 'Hatari ndogo' : 'Minor threat' },
                { level: 'medium', label: language === 'sw' ? 'Wastani' : 'Medium', color: 'yellow', description: language === 'sw' ? 'Hatari ya kati' : 'Moderate threat' },
                { level: 'high', label: language === 'sw' ? 'Juu' : 'High', color: 'red', description: language === 'sw' ? 'Hatari kubwa' : 'Major threat' }
              ].map((option) => (
                <button
                  key={option.level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: option.level as any }))}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    formData.severity === option.level
                      ? getSeverityColor(option.level)
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mx-auto mb-2 ${
                    option.color === 'green' ? 'bg-green-500' :
                    option.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <h4 className="font-semibold text-gray-900 text-sm">{option.label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{language === 'sw' ? 'Mahali pa Hatari' : 'Hazard Location'}</span>
            </h3>

            <GPSLocationDisplay
              onLocationUpdate={setCurrentLocation}
              showAccuracy={true}
              autoUpdate={true}
            />
            {errors.location && (
              <p className="mt-2 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Maelezo ya Hatari' : 'Hazard Description'} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={language === 'sw' ? 'Eleza kile kilichotokea, wakati, na athari...' : 'Describe what happened, when, and the effects...'}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Impact Assessment */}
          <div className="bg-purple-50 p-4 rounded-xl">
            <h3 className="font-bold text-purple-900 mb-4">
              {language === 'sw' ? 'Athari za Hatari' : 'Impact Assessment'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {impactOptions.map((impact) => (
                <button
                  key={impact.id}
                  type="button"
                  onClick={() => handleImpactToggle(impact.id as keyof typeof formData.impact)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.impact[impact.id as keyof typeof formData.impact]
                      ? 'border-purple-500 bg-purple-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <impact.icon className={`w-5 h-5 ${
                      formData.impact[impact.id as keyof typeof formData.impact] ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <span className="font-medium text-sm">{impact.label}</span>
                    {formData.impact[impact.id as keyof typeof formData.impact] && (
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Affected Numbers */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Kaya Zilizoathiriwa' : 'Affected Households'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.affectedHouseholds}
                  onChange={(e) => setFormData(prev => ({ ...prev, affectedHouseholds: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Watu Walioathiriwa' : 'Affected People'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.affectedPeople}
                  onChange={(e) => setFormData(prev => ({ ...prev, affectedPeople: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Majeruhi/Wafu' : 'Casualties'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.casualties}
                  onChange={(e) => setFormData(prev => ({ ...prev, casualties: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Immediate Needs */}
          <div className="bg-yellow-50 p-4 rounded-xl">
            <h3 className="font-bold text-yellow-900 mb-4">
              {language === 'sw' ? 'Mahitaji ya Haraka' : 'Immediate Needs'}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {immediateNeedsOptions.map((need) => (
                <button
                  key={need}
                  type="button"
                  onClick={() => handleImmediateNeedToggle(need)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    formData.immediateNeeds.includes(need)
                      ? 'border-yellow-500 bg-yellow-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {formData.immediateNeeds.includes(need) && (
                      <CheckCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className="font-medium text-sm">{need}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Evidence */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>{language === 'sw' ? 'Ushahidi wa Picha' : 'Photo Evidence'}</span>
            </h3>

            {capturedPhoto ? (
              <div className="relative">
                <img 
                  src={capturedPhoto} 
                  alt="Hazard evidence" 
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setCapturedPhoto(null)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCameraCapture(true)}
                className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors text-center"
              >
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">
                  {language === 'sw' ? 'Piga Picha ya Hatari' : 'Take Photo of Hazard'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'sw' ? 'Hiari - lakini inasaidia' : 'Optional - but helpful'}
                </p>
              </button>
            )}
          </div>

          {/* Response Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Hatua za Mjibu Zilizochukuliwa' : 'Response Actions Taken'}
            </label>
            <textarea
              value={formData.responseActions}
              onChange={(e) => setFormData(prev => ({ ...prev, responseActions: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder={language === 'sw' ? 'Eleza hatua zozote zilizochukuliwa...' : 'Describe any actions already taken...'}
            />
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
              className="flex-1 min-h-[48px] px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{language === 'sw' ? 'Inaripoti...' : 'Reporting...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Ripoti Hatari' : 'Report Hazard'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={showCameraCapture}
        onClose={() => setShowCameraCapture(false)}
        onCapture={handleCameraCapture}
        title={language === 'sw' ? 'Piga Picha ya Hatari' : 'Capture Hazard Photo'}
        context={language === 'sw' ? 'Piga picha ya hatari ya mazingira' : 'Take a photo of the environmental hazard'}
      />
    </>
  );
};