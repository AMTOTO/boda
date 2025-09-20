interface TransportRequest {
  id: string;
  caregiverId: string;
  patientName: string;
  serviceType: 'anc' | 'vaccination' | 'emergency' | 'consultation' | 'routine';
  urgency: 'normal' | 'semi_urgent' | 'emergency';
  pickup: {
    address: string;
    gpsCoords?: { lat: number; lng: number };
  };
  destination: {
    address: string;
    facilityType: 'hospital' | 'health_center' | 'clinic' | 'pharmacy';
    gpsCoords?: { lat: number; lng: number };
  };
  estimatedDistance: number;
  estimatedCost: number;
  estimatedTime: number;
  status: 'pending' | 'accepted' | 'rider_assigned' | 'in_progress' | 'completed' | 'cancelled';
  requestedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  paymentMethod: 'wallet' | 'sha_loan' | 'cash' | 'insurance';
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes?: string;
  metadata?: Record<string, any>;
}

export interface RiderAvailability {
  riderId: string;
  riderName: string;
  phone: string;
  currentLocation: { lat: number; lng: number };
  isOnline: boolean;
  isAvailable: boolean;
  rating: number;
  completedRides: number;
  distanceFromRequest: number;
  estimatedArrival: number; // minutes
}

class TransportService {
  private requests: TransportRequest[] = [];
  private availableRiders: RiderAvailability[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock available riders
    this.availableRiders = [
      {
        riderId: 'rider_001',
        riderName: 'John Mwangi',
        phone: '+254723456789',
        currentLocation: { lat: -1.1743, lng: 36.8356 },
        isOnline: true,
        isAvailable: true,
        rating: 4.8,
        completedRides: 156,
        distanceFromRequest: 2.5,
        estimatedArrival: 8
      },
      {
        riderId: 'rider_002',
        riderName: 'Peter Kiprotich',
        phone: '+254734567890',
        currentLocation: { lat: -1.1650, lng: 36.8400 },
        isOnline: true,
        isAvailable: true,
        rating: 4.9,
        completedRides: 203,
        distanceFromRequest: 3.2,
        estimatedArrival: 12
      },
      {
        riderId: 'rider_003',
        riderName: 'Samuel Ochieng',
        phone: '+254745678901',
        currentLocation: { lat: -1.1800, lng: 36.8200 },
        isOnline: false,
        isAvailable: false,
        rating: 4.6,
        completedRides: 89,
        distanceFromRequest: 5.1,
        estimatedArrival: 18
      }
    ];
  }

  // Create transport request
  async createTransportRequest(requestData: Omit<TransportRequest, 'id' | 'requestedAt' | 'status' | 'paymentStatus'>): Promise<TransportRequest> {
    const newRequest: TransportRequest = {
      ...requestData,
      id: `transport_${Date.now()}`,
      requestedAt: new Date(),
      status: 'pending',
      paymentStatus: 'pending'
    };

    this.requests.unshift(newRequest);

    // Auto-assign to nearest available rider for emergencies
    if (requestData.urgency === 'emergency') {
      await this.autoAssignEmergencyRider(newRequest.id);
    }

    return newRequest;
  }

  // Get available riders near location
  getAvailableRiders(location: { lat: number; lng: number }, maxDistance: number = 10): RiderAvailability[] {
    return this.availableRiders
      .filter(rider => rider.isOnline && rider.isAvailable)
      .map(rider => ({
        ...rider,
        distanceFromRequest: this.calculateDistance(location, rider.currentLocation)
      }))
      .filter(rider => rider.distanceFromRequest <= maxDistance)
      .sort((a, b) => a.distanceFromRequest - b.distanceFromRequest);
  }

  // Auto-assign emergency rider
  private async autoAssignEmergencyRider(requestId: string): Promise<void> {
    const request = this.requests.find(r => r.id === requestId);
    if (!request || !request.pickup.gpsCoords) return;

    const availableRiders = this.getAvailableRiders(request.pickup.gpsCoords, 15);
    
    if (availableRiders.length > 0) {
      const nearestRider = availableRiders[0];
      
      // Assign rider
      request.status = 'rider_assigned';
      request.riderId = nearestRider.riderId;
      request.riderName = nearestRider.riderName;
      request.riderPhone = nearestRider.phone;
      request.acceptedAt = new Date();

      // Mark rider as unavailable
      const riderIndex = this.availableRiders.findIndex(r => r.riderId === nearestRider.riderId);
      if (riderIndex !== -1) {
        this.availableRiders[riderIndex].isAvailable = false;
      }
    }
  }

  // Calculate distance between two points
  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Calculate transport cost
  calculateCost(distance: number, urgency: TransportRequest['urgency'], serviceType: TransportRequest['serviceType']): number {
    let baseCost = 300; // Base cost in KES
    let perKmRate = 40;

    // Urgency multipliers
    if (urgency === 'emergency') {
      baseCost *= 1.5;
      perKmRate *= 1.3;
    } else if (urgency === 'semi_urgent') {
      baseCost *= 1.2;
      perKmRate *= 1.1;
    }

    // Service type adjustments
    if (serviceType === 'anc' || serviceType === 'vaccination') {
      baseCost *= 0.9; // Slight discount for routine health services
    }

    return Math.round(baseCost + (distance * perKmRate));
  }

  // Get transport requests for caregiver
  getCaregiverRequests(caregiverId: string): TransportRequest[] {
    return this.requests
      .filter(r => r.caregiverId === caregiverId)
      .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
  }

  // Get pending requests for riders
  getPendingRequests(riderLocation?: { lat: number; lng: number }): TransportRequest[] {
    let pending = this.requests.filter(r => r.status === 'pending');
    
    if (riderLocation) {
      // Sort by distance and urgency
      pending = pending.map(request => ({
        ...request,
        distanceFromRider: request.pickup.gpsCoords 
          ? this.calculateDistance(riderLocation, request.pickup.gpsCoords)
          : 999
      })).sort((a, b) => {
        // Emergency requests first
        if (a.urgency === 'emergency' && b.urgency !== 'emergency') return -1;
        if (b.urgency === 'emergency' && a.urgency !== 'emergency') return 1;
        
        // Then by distance
        return (a as any).distanceFromRider - (b as any).distanceFromRider;
      });
    }

    return pending;
  }

  // Accept transport request (rider action)
  async acceptRequest(requestId: string, riderId: string): Promise<void> {
    const request = this.requests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');

    const rider = this.availableRiders.find(r => r.riderId === riderId);
    if (!rider) throw new Error('Rider not found');

    request.status = 'accepted';
    request.riderId = riderId;
    request.riderName = rider.riderName;
    request.riderPhone = rider.phone;
    request.acceptedAt = new Date();

    // Mark rider as unavailable
    rider.isAvailable = false;
  }

  // Start ride (rider action)
  async startRide(requestId: string): Promise<void> {
    const request = this.requests.find(r => r.id === requestId);
    if (!request || request.status !== 'accepted') {
      throw new Error('Request not found or not in accepted state');
    }

    request.status = 'in_progress';
  }

  // Complete ride (rider action)
  async completeRide(requestId: string, actualCost?: number): Promise<void> {
    const request = this.requests.find(r => r.id === requestId);
    if (!request || request.status !== 'in_progress') {
      throw new Error('Request not found or not in progress');
    }

    request.status = 'completed';
    request.completedAt = new Date();
    
    if (actualCost) {
      request.estimatedCost = actualCost;
    }

    // Mark rider as available again
    const rider = this.availableRiders.find(r => r.riderId === request.riderId);
    if (rider) {
      rider.isAvailable = true;
      rider.completedRides += 1;
    }

    // Update payment status
    request.paymentStatus = 'paid';
  }

  // Cancel request
  async cancelRequest(requestId: string, reason?: string): Promise<void> {
    const request = this.requests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');

    request.status = 'cancelled';
    if (reason) {
      request.notes = (request.notes || '') + ` Cancelled: ${reason}`;
    }

    // Make rider available again if assigned
    if (request.riderId) {
      const rider = this.availableRiders.find(r => r.riderId === request.riderId);
      if (rider) {
        rider.isAvailable = true;
      }
    }
  }

  // Get transport statistics
  getTransportStats(caregiverId: string): {
    totalRequests: number;
    completedRides: number;
    totalSpent: number;
    averageCost: number;
    emergencyRequests: number;
    routineRequests: number;
  } {
    const requests = this.getCaregiverRequests(caregiverId);
    const completed = requests.filter(r => r.status === 'completed');
    const emergency = requests.filter(r => r.urgency === 'emergency');
    const routine = requests.filter(r => r.urgency === 'normal');

    const totalSpent = completed.reduce((sum, r) => sum + r.estimatedCost, 0);

    return {
      totalRequests: requests.length,
      completedRides: completed.length,
      totalSpent,
      averageCost: completed.length > 0 ? totalSpent / completed.length : 0,
      emergencyRequests: emergency.length,
      routineRequests: routine.length
    };
  }

  // Estimate arrival time
  estimateArrivalTime(riderLocation: { lat: number; lng: number }, pickupLocation: { lat: number; lng: number }): number {
    const distance = this.calculateDistance(riderLocation, pickupLocation);
    const averageSpeed = 25; // km/h for motorcycle in urban areas
    return Math.round((distance / averageSpeed) * 60); // Convert to minutes
  }

  // Get nearest health facilities
  getNearestFacilities(location: { lat: number; lng: number }, facilityType?: string): Array<{
    id: string;
    name: string;
    type: string;
    address: string;
    distance: number;
    phone?: string;
    services: string[];
  }> {
    // Mock health facilities data
    const facilities = [
      {
        id: 'fac_001',
        name: 'Kiambu District Hospital',
        type: 'hospital',
        address: 'Kiambu Town, Kiambu County',
        gpsCoords: { lat: -1.1743, lng: 36.8356 },
        phone: '+254-XXX-XXXX',
        services: ['Emergency', 'Maternity', 'Surgery', 'Laboratory']
      },
      {
        id: 'fac_002',
        name: 'Kiambu Health Center',
        type: 'health_center',
        address: 'Kiambu Central, Kiambu County',
        gpsCoords: { lat: -1.1700, lng: 36.8300 },
        phone: '+254-XXX-XXXY',
        services: ['ANC', 'Vaccination', 'Consultation', 'Pharmacy']
      },
      {
        id: 'fac_003',
        name: 'Thika Level 5 Hospital',
        type: 'hospital',
        address: 'Thika Town, Kiambu County',
        gpsCoords: { lat: -1.0332, lng: 37.0692 },
        phone: '+254-XXX-XXXZ',
        services: ['Emergency', 'Maternity', 'Pediatrics', 'ICU']
      }
    ];

    return facilities
      .map(facility => ({
        ...facility,
        distance: this.calculateDistance(location, facility.gpsCoords)
      }))
      .filter(facility => !facilityType || facility.type === facilityType)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }

  // Send notifications to CHV and riders
  async notifyStakeholders(request: TransportRequest): Promise<void> {
    // Mock notification system
    console.log('Notifying stakeholders for request:', request.id);
    
    // In real implementation:
    // 1. Send push notification to nearby riders
    // 2. Send SMS to CHV
    // 3. Update CHV dashboard
    // 4. Log notification in system
  }

  // Track ride in real-time
  async trackRide(requestId: string): Promise<{
    currentLocation?: { lat: number; lng: number };
    estimatedArrival: number;
    status: string;
    riderPhone?: string;
  }> {
    const request = this.requests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');

    // Mock real-time tracking
    return {
      currentLocation: { lat: -1.1743, lng: 36.8356 },
      estimatedArrival: 5,
      status: request.status,
      riderPhone: request.riderPhone
    };
  }
}

export const transportService = new TransportService();
export type { TransportRequest, RiderAvailability };