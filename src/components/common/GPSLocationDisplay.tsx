import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { gpsService, GPSLocation } from '../../services/gpsService';

interface GPSLocationDisplayProps {
  onLocationUpdate?: (location: GPSLocation) => void;
  showAccuracy?: boolean;
  autoUpdate?: boolean;
  className?: string;
}

export const GPSLocationDisplay: React.FC<GPSLocationDisplayProps> = ({
  onLocationUpdate,
  showAccuracy = true,
  autoUpdate = false,
  className = ''
}) => {
  const { language } = useLanguage();
  const [location, setLocation] = useState<GPSLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    if (autoUpdate) {
      getCurrentLocation();
    }
  }, [autoUpdate]);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError('');

    try {
      const currentLocation = await gpsService.getCurrentLocation();
      setLocation(currentLocation);
      
      // Get human-readable address
      const locationAddress = await gpsService.reverseGeocode(currentLocation);
      setAddress(locationAddress);

      if (onLocationUpdate) {
        onLocationUpdate(currentLocation);
      }
    } catch (err: any) {
      setError(err.message || (language === 'sw' ? 'Imeshindwa kupata mahali' : 'Failed to get location'));
    } finally {
      setIsLoading(false);
    }
  };

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'text-gray-500';
    if (accuracy < 10) return 'text-green-600';
    if (accuracy < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyLabel = (accuracy?: number) => {
    if (!accuracy) return language === 'sw' ? 'Haijulikani' : 'Unknown';
    if (accuracy < 10) return language === 'sw' ? 'Sahihi Sana' : 'Very Accurate';
    if (accuracy < 50) return language === 'sw' ? 'Sahihi' : 'Accurate';
    return language === 'sw' ? 'Sahihi Kidogo' : 'Less Accurate';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-blue-600" />
          <span>{language === 'sw' ? 'Mahali Pako' : 'Your Location'}</span>
        </h3>
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
          aria-label={language === 'sw' ? 'Onyesha mahali upya' : 'Refresh location'}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {location ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-green-600 mt-1" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'sw' ? 'Kuratibu' : 'Coordinates'}: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
              {showAccuracy && location.accuracy && (
                <p className={`text-sm ${getAccuracyColor(location.accuracy)}`}>
                  {language === 'sw' ? 'Usahihi' : 'Accuracy'}: {getAccuracyLabel(location.accuracy)} (±{Math.round(location.accuracy)}m)
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'sw' ? 'Imesasishwa' : 'Updated'}: {location.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="gps-indicator">
            <span>{language === 'sw' ? 'GPS Inaendelea' : 'GPS Active'}</span>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-4">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isLoading 
              ? (language === 'sw' ? 'Inapata mahali...' : 'Getting location...')
              : (language === 'sw' ? 'Bofya kitufe cha onyesha upya' : 'Click refresh to get location')
            }
          </p>
        </div>
      )}
    </div>
  );
};