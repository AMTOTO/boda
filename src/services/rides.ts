export const BASE_COST = 500;
export const COST_PER_KM = 40;

export type PaymentMethod = 'wallet' | 'sha_loan' | 'direct';
export type RideStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';

export interface RideRequest {
  id: string;
  createdAt: string;
  requesterRole: 'caregiver' | 'chv' | 'health_officer';
  patientName: string;
  caregiverId?: string;
  pickup: string;
  dropoff: string;
  distanceKm: number;
  paymentMethod: PaymentMethod;
  estimatedCost: number;
  emergency?: boolean;
  status: RideStatus;
  notes?: string;
  riderId?: string;
}

export interface RideHistoryItem {
  id: string;
  date: string;
  patientName: string;
  distanceKm: number;
  cost: number;
  status: 'Completed' | 'Cancelled';
  rating?: number;
  pickup: string;
  dropoff: string;
}

// In-memory store for demo purposes
let rideRequestsStore: RideRequest[] = [];
let rideHistoryStore: RideHistoryItem[] = [];

export const calcCost = (km: number): number => {
  return BASE_COST + COST_PER_KM * Math.max(0, km);
};

export function listRideRequests(): Promise<RideRequest[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...rideRequestsStore]);
    }, 300);
  });
}

export function acceptRide(id: string, riderId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rideIndex = rideRequestsStore.findIndex(r => r.id === id);
      if (rideIndex !== -1) {
        rideRequestsStore[rideIndex] = {
          ...rideRequestsStore[rideIndex],
          status: 'accepted',
          riderId
        };
        resolve();
      } else {
        reject(new Error('Ride not found'));
      }
    }, 500);
  });
}

export function rejectRide(id: string, riderId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rideIndex = rideRequestsStore.findIndex(r => r.id === id);
      if (rideIndex !== -1) {
        rideRequestsStore[rideIndex] = {
          ...rideRequestsStore[rideIndex],
          status: 'rejected',
          riderId
        };
        resolve();
      } else {
        reject(new Error('Ride not found'));
      }
    }, 500);
  });
}

export function startRide(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rideIndex = rideRequestsStore.findIndex(r => r.id === id);
      if (rideIndex !== -1 && rideRequestsStore[rideIndex].status === 'accepted') {
        rideRequestsStore[rideIndex] = {
          ...rideRequestsStore[rideIndex],
          status: 'in_progress'
        };
        resolve();
      } else {
        reject(new Error('Ride not found or not in accepted state'));
      }
    }, 500);
  });
}

export function completeRide(id: string): Promise<RideHistoryItem> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rideIndex = rideRequestsStore.findIndex(r => r.id === id);
      if (rideIndex !== -1 && rideRequestsStore[rideIndex].status === 'in_progress') {
        const ride = rideRequestsStore[rideIndex];
        
        // Update ride status
        rideRequestsStore[rideIndex] = {
          ...ride,
          status: 'completed'
        };

        // Create history entry
        const historyItem: RideHistoryItem = {
          id: `hist_${Date.now()}`,
          date: new Date().toLocaleDateString(),
          patientName: ride.patientName,
          distanceKm: ride.distanceKm,
          cost: ride.estimatedCost,
          status: 'Completed',
          rating: 5, // Default rating
          pickup: ride.pickup,
          dropoff: ride.dropoff
        };

        rideHistoryStore.unshift(historyItem);
        resolve(historyItem);
      } else {
        reject(new Error('Ride not found or not in progress'));
      }
    }, 500);
  });
}

export function createRideRequest(request: Omit<RideRequest, 'id' | 'createdAt' | 'estimatedCost'>): Promise<RideRequest> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRequest: RideRequest = {
        ...request,
        id: `ride_${Date.now()}`,
        createdAt: new Date().toISOString(),
        estimatedCost: calcCost(request.distanceKm)
      };

      rideRequestsStore.unshift(newRequest);
      resolve(newRequest);
    }, 500);
  });
}

export function getRideHistory(riderId?: string): Promise<RideHistoryItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...rideHistoryStore]);
    }, 300);
  });
}

export function updateRideStatus(id: string, status: RideStatus): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rideIndex = rideRequestsStore.findIndex(r => r.id === id);
      if (rideIndex !== -1) {
        rideRequestsStore[rideIndex] = {
          ...rideRequestsStore[rideIndex],
          status
        };
        resolve();
      } else {
        reject(new Error('Ride not found'));
      }
    }, 500);
  });
}

// Initialize with some mock data
if (rideRequestsStore.length === 0) {
  rideRequestsStore = [
    {
      id: 'ride_001',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      requesterRole: 'caregiver',
      patientName: 'Grace Wanjiku',
      caregiverId: 'caregiver_001',
      pickup: 'Kiambu Village',
      dropoff: 'Kiambu District Hospital',
      distanceKm: 8,
      paymentMethod: 'wallet',
      estimatedCost: calcCost(8),
      emergency: true,
      status: 'pending',
      notes: 'Pregnant woman in labor - urgent'
    },
    {
      id: 'ride_002',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      requesterRole: 'chv',
      patientName: 'Baby Michael',
      pickup: 'Nakuru Town',
      dropoff: 'Nakuru Health Center',
      distanceKm: 5,
      paymentMethod: 'sha_loan',
      estimatedCost: calcCost(5),
      emergency: false,
      status: 'pending',
      notes: 'Vaccination appointment'
    }
  ];
}

if (rideHistoryStore.length === 0) {
  rideHistoryStore = [
    {
      id: 'hist_001',
      date: 'Today',
      patientName: 'Mary Akinyi',
      distanceKm: 6,
      cost: calcCost(6),
      status: 'Completed',
      rating: 5,
      pickup: 'Kisumu Central',
      dropoff: 'Kisumu General Hospital'
    },
    {
      id: 'hist_002',
      date: 'Yesterday',
      patientName: 'John Mwangi',
      distanceKm: 15,
      cost: calcCost(15),
      status: 'Completed',
      rating: 4,
      pickup: 'Nakuru West',
      dropoff: 'Nakuru Referral Hospital'
    }
  ];
}