import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';
import { CameraCapture } from './CameraCapture';
import { useLanguage } from '../../contexts/LanguageContext';
import { gpsService } from '../../services/gpsService';
import { 
  AlertTriangle, 
  Mic, 
  MicOff, 
  Camera, 
  MapPin, 
  Clock,
  Loader,
  CheckCircle,
  Phone,
  Navigation
} from 'lucide-react';

interface EmergencyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: any) => void;
  emergencyType: 'medical' | 'accident' | 'outbreak' | 'weather';
}

export const EmergencyReportModal: React.FC<EmergencyReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  emergencyType
}) => {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState<Blob | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const emergencyTypes = {
    medical: {
      title: language === 'sw' ? 'Dharura ya Matibabu' : 'Medical Emergency',
      emoji: '🚨',
      color: 'red'
    },
    accident: {
      title: language === 'sw' ? 'Ajali ya Barabarani' : 'Road Accident',
      emoji: '🚗',
      color: 'orange'
    },
    outbreak: {
      title: language === 'sw' ? 'Mlipuko wa Ugonjwa' : 'Disease Outbreak',
      emoji: '🦠',
      color: 'purple'
    },
    weather: {
      title: language === 'sw' ? 'Tahadhari ya Hali ya Hewa' : 'Weather Alert',
      emoji: '🌪️',
      color: 'blue'
    }
  };

  const currentEmergency = emergencyTypes[emergencyType];

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await gpsService.getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      console.error('Failed to get location:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setVoiceRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCameraCapture = (imageData: string, file: File) => {
    setCapturedPhoto(imageData);
    setShowCameraCapture(false);
  };

  const handleSubmit = async () => {
    if (!description.trim() && !voiceRecording && !capturedPhoto) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current location if not already available
      let location = currentLocation;
      if (!location) {
        try {
          location = await gpsService.getCurrentLocation();
        } catch (error) {
          console.warn('Could not get location:', error);
          location = null;
        }
      }

      const reportData = {
        type: emergencyType,
        severity,
        description,
        location: location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Unknown',
        gpsCoords: location,
        voiceRecording,
        photo: capturedPhoto,
        timestamp: new Date().toISOString(),
        reportedBy: 'Current User' // Would be actual user data
      };

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onSubmit(reportData);
      onClose();
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`${currentEmergency.emoji} ${currentEmergency.title}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Location Display */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <div className="flex items-center space-x-3 mb-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                {language === 'sw' ? 'Mahali pa Tukio' : 'Incident Location'}
              </h3>
              <button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="p-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <MapPin className={`w-4 h-4 ${isGettingLocation ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {currentLocation ? (
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p>📍 {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}</p>
                <p className="text-xs opacity-75">
                  {language === 'sw' ? 'Mahali pamepatikana kiotomatiki' : 'Location detected automatically'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {isGettingLocation 
                  ? (language === 'sw' ? 'Inapata mahali...' : 'Getting location...')
                  : (language === 'sw' ? 'Bofya kitufe cha ramani kupata mahali' : 'Click map button to get location')
                }
              </p>
            )}
          </div>

          {/* Severity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {language === 'sw' ? 'Kiwango cha Dharura' : 'Emergency Severity'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { level: 'low', label: language === 'sw' ? 'Chini' : 'Low', color: 'green', emoji: '🟢' },
                { level: 'medium', label: language === 'sw' ? 'Wastani' : 'Medium', color: 'yellow', emoji: '🟡' },
                { level: 'high', label: language === 'sw' ? 'Juu' : 'High', color: 'orange', emoji: '🟠' },
                { level: 'critical', label: language === 'sw' ? 'Hatari' : 'Critical', color: 'red', emoji: '🔴' }
              ].map((option) => (
                <button
                  key={option.level}
                  type="button"
                  onClick={() => setSeverity(option.level as any)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    severity === option.level
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'sw' ? 'Maelezo ya Tukio' : 'Incident Description'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={language === 'sw' ? 'Eleza kile kilichotokea...' : 'Describe what happened...'}
            />
          </div>

          {/* Evidence Collection */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              {language === 'sw' ? 'Ongeza Ushahidi' : 'Add Evidence'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Voice Recording */}
              <button
                type="button"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`min-h-[48px] flex items-center justify-center space-x-2 p-4 rounded-xl transition-all ${
                  isRecording 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : voiceRecording
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="font-medium">
                  {isRecording 
                    ? (language === 'sw' ? 'Acha Kurekodi' : 'Stop Recording')
                    : voiceRecording
                    ? (language === 'sw' ? 'Sauti Imerekodi' : 'Voice Recorded')
                    : (language === 'sw' ? 'Rekodi Sauti' : 'Record Voice')
                  }
                </span>
              </button>

              {/* Photo Capture */}
              <button
                type="button"
                onClick={() => setShowCameraCapture(true)}
                className={`min-h-[48px] flex items-center justify-center space-x-2 p-4 rounded-xl transition-all ${
                  capturedPhoto
                    ? 'bg-green-100 text-green-600'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="font-medium">
                  {capturedPhoto 
                    ? (language === 'sw' ? 'Picha Imepigwa' : 'Photo Captured')
                    : (language === 'sw' ? 'Piga Picha' : 'Take Photo')
                  }
                </span>
              </button>
            </div>

            {/* Evidence Preview */}
            {(voiceRecording || capturedPhoto) && (
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'sw' ? 'Ushahidi Ulioongezwa' : 'Evidence Added'}
                </h5>
                <div className="space-y-2">
                  {voiceRecording && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <Mic className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Rekodi ya sauti imeongezwa' : 'Voice recording added'}</span>
                    </div>
                  )}
                  {capturedPhoto && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <Camera className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Picha imeongezwa' : 'Photo added'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
            <h4 className="font-medium text-red-900 dark:text-red-100 mb-2 flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>{language === 'sw' ? 'Nambari za Dharura' : 'Emergency Contacts'}</span>
            </h4>
            <div className="text-sm text-red-800 dark:text-red-200 space-y-1">
              <p>🚑 {language === 'sw' ? 'Huduma za Dharura' : 'Emergency Services'}: 999</p>
              <p>🚓 {language === 'sw' ? 'Polisi' : 'Police'}: 911</p>
              <p>🏥 {language === 'sw' ? 'Hospitali ya Karibu' : 'Nearest Hospital'}: +254-XXX-XXXX</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {language === 'sw' ? 'Ghairi' : 'Cancel'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!description.trim() && !voiceRecording && !capturedPhoto)}
              className="flex-1 min-h-[48px] px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{language === 'sw' ? 'Inawasilisha...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Wasilisha Ripoti' : 'Submit Report'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={showCameraCapture}
        onClose={() => setShowCameraCapture(false)}
        onCapture={handleCameraCapture}
        title={language === 'sw' ? 'Piga Picha ya Ushahidi' : 'Capture Evidence Photo'}
        context={language === 'sw' ? 'Piga picha ya tukio la dharura' : 'Take a photo of the emergency incident'}
      />
    </>
  );
};