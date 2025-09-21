import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { GPSLocationDisplay } from '../common/GPSLocationDisplay';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { TransportRequest } from '../../services/riderService';
import { 
  Navigation, 
  MapPin, 
  Target, 
  Clock, 
  Phone, 
  MessageSquare,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertTriangle,
  Fuel,
  Battery,
  Signal,
  Compass
} from 'lucide-react';

interface RideTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  request: TransportRequest | null;
  onCompleteRide: () => void;
}

export const RideTracker: React.FC<RideTrackerProps> = ({
  isOpen,
  onClose,
  request,
  onCompleteRide
}) => {
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const [rideStatus, setRideStatus] = useState<'not_started' | 'en_route_pickup' | 'passenger_onboard' | 'en_route_destination' | 'completed'>('not_started');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [distanceTraveled, setDistanceTraveled] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRide = () => {
    setRideStatus('en_route_pickup');
    setIsTracking(true);
  };

  const handlePickupComplete = () => {
    setRideStatus('passenger_onboard');
  };

  const handleStartToDestination = () => {
    setRideStatus('en_route_destination');
  };

  const handleCompleteRide = () => {
    setRideStatus('completed');
    setIsTracking(false);
    onCompleteRide();
  };

  const getStatusColor = () => {
    switch (rideStatus) {
      case 'not_started': return 'bg-gray-500';
      case 'en_route_pickup': return 'bg-blue-500';
      case 'passenger_onboard': return 'bg-yellow-500';
      case 'en_route_destination': return 'bg-green-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (rideStatus) {
      case 'not_started': return language === 'sw' ? 'Haijanza' : 'Not Started';
      case 'en_route_pickup': return language === 'sw' ? 'Njiani Kuchukua' : 'En Route to Pickup';
      case 'passenger_onboard': return language === 'sw' ? 'Mgonjwa Amepanda' : 'Passenger Onboard';
      case 'en_route_destination': return language === 'sw' ? 'Njiani Hospitali' : 'En Route to Hospital';
      case 'completed': return language === 'sw' ? 'Imekamilika' : 'Completed';
      default: return '';
    }
  };

  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'sw' ? '🚴‍♂️ Ufuatiliaji wa Safari' : '🚴‍♂️ Ride Tracker'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Status Header */}
        <div className={`${getStatusColor()} text-white p-6 rounded-2xl text-center`}>
          <div className="text-4xl mb-2">🏍️</div>
          <h3 className="text-2xl font-bold mb-2">{request.patientName}</h3>
          <p className="text-lg font-medium">{getStatusText()}</p>
          <div className="mt-4 flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
              <div className="text-sm opacity-80">{language === 'sw' ? 'Muda' : 'Time'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatAmount(request.estimatedCost)}</div>
              <div className="text-sm opacity-80">{language === 'sw' ? 'Mapato' : 'Earnings'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{request.estimatedDistance} km</div>
              <div className="text-sm opacity-80">{language === 'sw' ? 'Umbali' : 'Distance'}</div>
            </div>
          </div>
        </div>

        {/* GPS Location */}
        <GPSLocationDisplay
          onLocationUpdate={setCurrentLocation}
          showAccuracy={true}
          autoUpdate={true}
        />

        {/* Route Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-blue-900">{language === 'sw' ? 'Kuchukua' : 'Pickup Location'}</span>
            </div>
            <p className="text-gray-700 mb-2">{request.pickup.address}</p>
            {request.pickup.gpsCoords && (
              <p className="text-xs text-gray-500">
                {request.pickup.gpsCoords.lat.toFixed(6)}, {request.pickup.gpsCoords.lng.toFixed(6)}
              </p>
            )}
            <button
              onClick={() => {
                // Open navigation to pickup
                if (request.pickup.gpsCoords) {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${request.pickup.gpsCoords.lat},${request.pickup.gpsCoords.lng}`;
                  window.open(url, '_blank');
                }
              }}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>{language === 'sw' ? 'Ongoza' : 'Navigate'}</span>
            </button>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-900">{language === 'sw' ? 'Peleka' : 'Destination'}</span>
            </div>
            <p className="text-gray-700 mb-2">{request.destination.address}</p>
            <p className="text-sm text-gray-600 mb-2">{request.destination.facilityType}</p>
            <button
              onClick={() => {
                // Open navigation to destination
                if (request.destination.gpsCoords) {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${request.destination.gpsCoords.lat},${request.destination.gpsCoords.lng}`;
                  window.open(url, '_blank');
                }
              }}
              className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>{language === 'sw' ? 'Ongoza' : 'Navigate'}</span>
            </button>
          </div>
        </div>

        {/* Patient Condition */}
        {request.symptoms && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-bold text-red-900 mb-2 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{language === 'sw' ? 'Hali ya Mgonjwa' : 'Patient Condition'}</span>
            </h4>
            <p className="text-red-800">{request.symptoms}</p>
            {request.specialRequirements && request.specialRequirements.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-900 mb-1">
                  {language === 'sw' ? 'Mahitaji Maalum' : 'Special Requirements'}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {request.specialRequirements.map((req, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* System Status */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-bold text-gray-900 mb-3">
            {language === 'sw' ? 'Hali ya Mfumo' : 'System Status'}
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Signal className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">
                {language === 'sw' ? 'Mtandao' : 'Network'}
              </div>
              <div className="text-xs text-green-600">Strong</div>
            </div>
            <div className="text-center">
              <Battery className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">
                {language === 'sw' ? 'Betri' : 'Battery'}
              </div>
              <div className="text-xs text-yellow-600">75%</div>
            </div>
            <div className="text-center">
              <Compass className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">GPS</div>
              <div className="text-xs text-blue-600">Active</div>
            </div>
          </div>
        </div>

        {/* Action Buttons Based on Status */}
        <div className="space-y-3">
          {rideStatus === 'not_started' && (
            <button
              onClick={handleStartRide}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold text-lg flex items-center justify-center space-x-2"
            >
              <Play className="w-6 h-6" />
              <span>{language === 'sw' ? 'Anza Safari' : 'Start Ride'}</span>
            </button>
          )}

          {rideStatus === 'en_route_pickup' && (
            <button
              onClick={handlePickupComplete}
              className="w-full bg-yellow-600 text-white py-4 rounded-2xl hover:bg-yellow-700 transition-all font-bold text-lg flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-6 h-6" />
              <span>{language === 'sw' ? 'Nimemchukua Mgonjwa' : 'Patient Picked Up'}</span>
            </button>
          )}

          {rideStatus === 'passenger_onboard' && (
            <button
              onClick={handleStartToDestination}
              className="w-full bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 transition-all font-bold text-lg flex items-center justify-center space-x-2"
            >
              <Navigation className="w-6 h-6" />
              <span>{language === 'sw' ? 'Elekea Hospitali' : 'Head to Hospital'}</span>
            </button>
          )}

          {rideStatus === 'en_route_destination' && (
            <button
              onClick={handleCompleteRide}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl hover:bg-purple-700 transition-all font-bold text-lg flex items-center justify-center space-x-2 animate-pulse"
            >
              <CheckCircle className="w-6 h-6" />
              <span>{language === 'sw' ? 'Maliza Safari' : 'Complete Ride'}</span>
            </button>
          )}

          {/* Emergency Contact */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                // Call emergency services
                window.location.href = 'tel:999';
              }}
              className="bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all font-bold flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>{language === 'sw' ? 'Piga 999' : 'Call 999'}</span>
            </button>
            <button
              onClick={() => {
                // Send message to CHV
                const message = `Rider update: ${getStatusText()} for ${request.patientName}`;
                window.location.href = `sms:+254700000000?body=${encodeURIComponent(message)}`;
              }}
              className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-bold flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{language === 'sw' ? 'Tuma SMS' : 'Send SMS'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};