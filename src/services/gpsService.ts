interface GPSLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: Date;
}

interface DistanceCalculation {
  distanceKm: number;
  estimatedTime: number;
  route?: string;
}

class GPSService {
  private watchId: number | null = null;
  private currentLocation: GPSLocation | null = null;

  async getCurrentLocation(): Promise<GPSLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: GPSLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          this.currentLocation = location;
          resolve(location);
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  startLocationTracking(callback: (location: GPSLocation) => void): void {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: GPSLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        };
        this.currentLocation = location;
        callback(location);
      },
      (error) => {
        console.error('Location tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000 // 1 minute
      }
    );
  }

  stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  calculateDistance(point1: GPSLocation, point2: GPSLocation): DistanceCalculation {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
    
    // Estimate time based on average speed (30 km/h for motorcycle in urban areas)
    const estimatedTime = Math.round((distanceKm / 30) * 60); // in minutes

    return {
      distanceKm: Math.round(distanceKm * 100) / 100, // Round to 2 decimal places
      estimatedTime,
      route: `${point1.lat.toFixed(6)},${point1.lng.toFixed(6)} to ${point2.lat.toFixed(6)},${point2.lng.toFixed(6)}`
    };
  }

  calculateRideCost(distanceKm: number): number {
    const BASE_RATE = 50; // KSh 50 base rate
    const PER_KM_RATE = 10; // KSh 10 per additional km
    
    return BASE_RATE + (Math.max(0, distanceKm - 1) * PER_KM_RATE);
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  getLocationString(location: GPSLocation): string {
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  }

  isLocationAccurate(location: GPSLocation): boolean {
    return location.accuracy ? location.accuracy < 100 : false; // Less than 100m accuracy
  }

  // Mock reverse geocoding (in real app, use Google Maps API)
  async reverseGeocode(location: GPSLocation): Promise<string> {
    // Mock implementation - in real app, use proper geocoding service
    const mockAddresses = [
      'Kiambu County, Kenya',
      'Nakuru County, Kenya', 
      'Kisumu County, Kenya',
      'Meru County, Kenya',
      'Nairobi County, Kenya'
    ];
    
    return mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
  }

  // Get distance between two addresses (mock implementation)
  async getDistanceBetweenAddresses(origin: string, destination: string): Promise<DistanceCalculation> {
    // Mock implementation - in real app, use Google Maps Distance Matrix API
    const mockDistance = Math.random() * 20 + 1; // 1-21 km
    
    return {
      distanceKm: Math.round(mockDistance * 100) / 100,
      estimatedTime: Math.round((mockDistance / 30) * 60),
      route: `${origin} to ${destination}`
    };
  }
}

export const gpsService = new GPSService();
export type { GPSLocation, DistanceCalculation };