import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, Navigation, CheckCircle, XCircle, Clock, MapPin, Target } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { TransportRequest } from '../../services/riderService';

interface EmergencyRequestOverlayProps {
  isVisible: boolean;
  request: TransportRequest | null;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

export const EmergencyRequestOverlay: React.FC<EmergencyRequestOverlayProps> = ({
  isVisible,
  request,
  onAccept,
  onReject,
  onClose
}) => {
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to respond
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!isVisible || !request) return;

    setTimeLeft(30);
    setIsExpired(false);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, request]);

  useEffect(() => {
    if (isExpired) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isExpired, onClose]);

  if (!isVisible || !request) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Full screen red overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-red-600 flex items-center justify-center p-4"
        >
          {/* Emergency Alert Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-600 text-white p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 animate-pulse bg-red-700/30"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black mb-2">
                  {language === 'sw' ? '🚨 DHARURA' : '🚨 EMERGENCY'}
                </h2>
                <p className="text-red-100 text-lg font-bold">
                  {language === 'sw' ? 'OMBI LA USAFIRI WA DHARURA' : 'EMERGENCY TRANSPORT REQUEST'}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-yellow-400 text-yellow-900 p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-6 h-6" />
                <span className="text-2xl font-black">
                  {isExpired 
                    ? (language === 'sw' ? 'MUDA UMEISHA' : 'TIME EXPIRED')
                    : `${timeLeft}s`
                  }
                </span>
              </div>
              <p className="text-sm font-bold">
                {isExpired 
                  ? (language === 'sw' ? 'Ombi limeenda kwa msafiri mwingine' : 'Request sent to another rider')
                  : (language === 'sw' ? 'Jibu haraka' : 'Respond quickly')
                }
              </p>
            </div>

            {/* Patient Information */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{request.patientName}</h3>
                <p className="text-gray-600 font-medium">
                  {language === 'sw' ? 'Imeombwa na' : 'Requested by'}: {request.requestedBy}
                </p>
                {request.householdCode && (
                  <p className="text-sm text-gray-500">
                    {language === 'sw' ? 'Kaya' : 'Household'}: {request.householdCode}
                  </p>
                )}
              </div>

              {/* Location Details */}
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-900">{language === 'sw' ? 'Kuchukua' : 'Pickup'}</span>
                  </div>
                  <p className="text-gray-700">{request.pickup.address}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-900">{language === 'sw' ? 'Peleka' : 'Drop-off'}</span>
                  </div>
                  <p className="text-gray-700">{request.destination.address}</p>
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{formatAmount(request.estimatedCost)}</div>
                  <div className="text-xs text-gray-600">{language === 'sw' ? 'Mapato' : 'Earnings'}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{request.estimatedDistance} km</div>
                  <div className="text-xs text-gray-600">{language === 'sw' ? 'Umbali' : 'Distance'}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{request.estimatedTime} min</div>
                  <div className="text-xs text-gray-600">{language === 'sw' ? 'Muda' : 'Time'}</div>
                </div>
              </div>

              {/* Symptoms/Condition */}
              {request.symptoms && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-bold text-yellow-900 mb-2">
                    {language === 'sw' ? 'Hali ya Mgonjwa' : 'Patient Condition'}
                  </h4>
                  <p className="text-yellow-800 text-sm">{request.symptoms}</p>
                </div>
              )}

              {/* Action Buttons */}
              {!isExpired && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={onAccept}
                    className="min-h-[60px] bg-green-600 text-white rounded-2xl font-black text-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 animate-pulse"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>{language === 'sw' ? 'KUBALI' : 'ACCEPT'}</span>
                  </button>
                  <button
                    onClick={onReject}
                    className="min-h-[60px] bg-gray-500 text-white rounded-2xl font-black text-lg hover:bg-gray-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-6 h-6" />
                    <span>{language === 'sw' ? 'KATAA' : 'DECLINE'}</span>
                  </button>
                </div>
              )}

              {/* Emergency Contacts */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Mawasiliano ya Dharura' : 'Emergency Contacts'}</span>
                </h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>🚑 {language === 'sw' ? 'Huduma za Dharura' : 'Emergency Services'}: 999</p>
                  <p>🏥 {language === 'sw' ? 'Hospitali ya Karibu' : 'Nearest Hospital'}: +254-XXX-XXXX</p>
                  <p>👩‍⚕️ CHV: {request.requestedByRole === 'chv' ? request.requestedBy : 'Contact CHV'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};