export interface TransportRequest {
  id: string;
  patientName: string;
  householdCode?: string;
  pickup: {
    address: string;
    gpsCoords?: { lat: number; lng: number };
  };
  destination: {
    address: string;
    facilityType: 'hospital' | 'health_center' | 'clinic' | 'pharmacy';
    gpsCoords?: { lat: number; lng: number };
  };
  serviceType: 'anc' | 'vaccination' | 'emergency' | 'consultation' | 'routine';
  urgency: 'normal' | 'semi_urgent' | 'emergency';
  estimatedDistance: number;
  estimatedCost: number;
  estimatedTime: number;
  status: 'pending' | 'accepted' | 'rider_assigned' | 'in_progress' | 'completed' | 'cancelled';
  requestedAt: Date;
  requestedBy: string;
  requestedByRole: 'caregiver' | 'chv' | 'health_worker';
  acceptedAt?: Date;
  completedAt?: Date;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  paymentMethod: 'wallet' | 'sha_loan' | 'cash' | 'insurance';
  paymentStatus: 'pending' | 'paid' | 'failed';
  symptoms?: string;
  specialRequirements?: string[];
  notes?: string;
  actualCost?: number;
  rating?: number;
}

export interface RiderStats {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalRides: number;
  completedRides: number;
  rating: number;
  totalDistance: number;
  emergencyRides: number;
  onTimePercentage: number;
}

export interface SafetyAlert {
  id: string;
  type: 'weather' | 'road_hazard' | 'traffic' | 'security' | 'health_risk';
  title: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon: string;
  timestamp: Date;
  affectedRoutes?: string[];
  recommendations?: string[];
}

export interface RideHistory {
  id: string;
  patientName: string;
  pickup: string;
  destination: string;
  distance: number;
  cost: number;
  duration: number;
  completedAt: Date;
  rating: number;
  serviceType: string;
  urgency: string;
}

class RiderService {
  private transportRequests: TransportRequest[] = [];
  private safetyAlerts: SafetyAlert[] = [];
  private rideHistory: RideHistory[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock transport requests
    this.transportRequests = [
      {
        id: 'req_001',
        patientName: 'Grace Wanjiku',
        householdCode: 'KE-13-09-0001',
        pickup: {
          address: 'Kiambu Village, Zone A',
          gpsCoords: { lat: -1.1743, lng: 36.8356 }
        },
        destination: {
          address: 'Kiambu District Hospital',
          facilityType: 'hospital',
          gpsCoords: { lat: -1.1650, lng: 36.8400 }
        },
        serviceType: 'emergency',
        urgency: 'emergency',
        estimatedDistance: 8,
        estimatedCost: 1200,
        estimatedTime: 15,
        status: 'pending',
        requestedAt: new Date(Date.now() - 5 * 60 * 1000),
        requestedBy: 'CHV Sarah Akinyi',
        requestedByRole: 'chv',
        paymentMethod: 'wallet',
        paymentStatus: 'pending',
        symptoms: 'Pregnant woman in labor - contractions every 3 minutes',
        specialRequirements: ['stretcher', 'oxygen_ready'],
        notes: 'High-risk pregnancy, needs immediate attention'
      },
      {
        id: 'req_002',
        patientName: 'Baby Michael',
        householdCode: 'KE-13-09-0001',
        pickup: {
          address: 'Nakuru Town, Central',
          gpsCoords: { lat: -0.3031, lng: 36.0800 }
        },
        destination: {
          address: 'Nakuru Health Center',
          facilityType: 'health_center',
          gpsCoords: { lat: -0.3000, lng: 36.0850 }
        },
        serviceType: 'vaccination',
        urgency: 'semi_urgent',
        estimatedDistance: 5,
        estimatedCost: 700,
        estimatedTime: 12,
        status: 'pending',
        requestedAt: new Date(Date.now() - 30 * 60 * 1000),
        requestedBy: 'Mother Jane Wanjiku',
        requestedByRole: 'caregiver',
        paymentMethod: 'sha_loan',
        paymentStatus: 'pending',
        symptoms: '6-month-old baby needs overdue vaccination',
        notes: 'BCG and Polio vaccines overdue by 2 weeks'
      },
      {
        id: 'req_003',
        patientName: 'Mary Akinyi',
        householdCode: 'KE-17-01-0002',
        pickup: {
          address: 'Kisumu Central, Market Area',
          gpsCoords: { lat: -0.1022, lng: 34.7617 }
        },
        destination: {
          address: 'Kisumu County Hospital',
          facilityType: 'hospital',
          gpsCoords: { lat: -0.1000, lng: 34.7650 }
        },
        serviceType: 'anc',
        urgency: 'normal',
        estimatedDistance: 3,
        estimatedCost: 500,
        estimatedTime: 8,
        status: 'pending',
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        requestedBy: 'CHV Peter Ochieng',
        requestedByRole: 'chv',
        paymentMethod: 'insurance',
        paymentStatus: 'pending',
        symptoms: 'Routine ANC visit - 28 weeks pregnant',
        notes: 'Third ANC visit, blood pressure check needed'
      }
    ];

    // Mock safety alerts
    this.safetyAlerts = [
      {
        id: 'alert_001',
        type: 'weather',
        title: 'Heavy Rain Warning',
        description: 'Heavy rainfall expected in Kiambu area. Roads may be slippery.',
        location: 'Kiambu County',
        severity: 'medium',
        icon: '🌧️',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        affectedRoutes: ['Kiambu-Thika Road', 'Kiambu-Nairobi Highway'],
        recommendations: ['Drive slowly', 'Use headlights', 'Avoid flooded areas']
      },
      {
        id: 'alert_002',
        type: 'road_hazard',
        title: 'Road Construction',
        description: 'Road construction on Nakuru-Nairobi highway causing delays.',
        location: 'Nakuru County',
        severity: 'low',
        icon: '🚧',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        affectedRoutes: ['Nakuru-Nairobi Highway'],
        recommendations: ['Use alternative route', 'Allow extra time']
      },
      {
        id: 'alert_003',
        type: 'health_risk',
        title: 'Cholera Outbreak Alert',
        description: 'Cholera cases reported in Kisumu. Extra hygiene precautions needed.',
        location: 'Kisumu County',
        severity: 'high',
        icon: '🦠',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        recommendations: ['Use hand sanitizer', 'Avoid contaminated water', 'Wear mask']
      }
    ];

    // Mock ride history
    this.rideHistory = [
      {
        id: 'hist_001',
        patientName: 'Grace Wanjiku',
        pickup: 'Kiambu Village',
        destination: 'Kiambu Hospital',
        distance: 8,
        cost: 820,
        duration: 18,
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        rating: 5,
        serviceType: 'emergency',
        urgency: 'emergency'
      },
      {
        id: 'hist_002',
        patientName: 'Baby Michael',
        pickup: 'Nakuru Town',
        destination: 'Nakuru Health Center',
        distance: 5,
        cost: 500,
        duration: 12,
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        rating: 5,
        serviceType: 'vaccination',
        urgency: 'normal'
      }
    ];
  }

  // Get available transport requests for rider
  async getAvailableRequests(riderId: string): Promise<TransportRequest[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.transportRequests
      .filter(r => r.status === 'pending' || (r.riderId === riderId && ['accepted', 'in_progress'].includes(r.status)))
      .sort((a, b) => {
        // Emergency requests first
        if (a.urgency === 'emergency' && b.urgency !== 'emergency') return -1;
        if (b.urgency === 'emergency' && a.urgency !== 'emergency') return 1;
        
        // Then by request time
        return b.requestedAt.getTime() - a.requestedAt.getTime();
      });
  }

  // Accept transport request
  async acceptRequest(requestId: string, riderId: string): Promise<TransportRequest> {
    const request = this.transportRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');

    request.status = 'accepted';
    request.riderId = riderId;
    request.acceptedAt = new Date();

    return request;
  }

  // Reject transport request
  async rejectRequest(requestId: string, riderId: string): Promise<void> {
    // In real implementation, this would notify the system to find another rider
    console.log(`Rider ${riderId} rejected request ${requestId}`);
  }

  // Start ride
  async startRide(requestId: string): Promise<TransportRequest> {
    const request = this.transportRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'accepted') {
      throw new Error('Request not found or not in accepted state');
    }

    request.status = 'in_progress';
    return request;
  }

  // Complete ride
  async completeRide(requestId: string, riderId: string): Promise<{
    request: TransportRequest;
    actualCost: number;
    bonusPoints?: number;
  }> {
    const request = this.transportRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'in_progress') {
      throw new Error('Request not found or not in progress');
    }

    request.status = 'completed';
    request.completedAt = new Date();
    request.paymentStatus = 'paid';

    // Calculate actual cost (could be different from estimate)
    const actualCost = request.estimatedCost;
    request.actualCost = actualCost;

    // Calculate bonus points for emergency rides
    let bonusPoints = 0;
    if (request.urgency === 'emergency') {
      bonusPoints = 50; // Bonus points for emergency rides
    }

    // Add to ride history
    this.rideHistory.unshift({
      id: `hist_${Date.now()}`,
      patientName: request.patientName,
      pickup: request.pickup.address,
      destination: request.destination.address,
      distance: request.estimatedDistance,
      cost: actualCost,
      duration: request.estimatedTime,
      completedAt: new Date(),
      rating: 5, // Default rating
      serviceType: request.serviceType,
      urgency: request.urgency
    });

    return { request, actualCost, bonusPoints };
  }

  // Get rider statistics
  async getRiderStats(riderId: string): Promise<RiderStats> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    const completedRides = this.rideHistory.length;
    const todayRides = this.rideHistory.filter(r => 
      r.completedAt.toDateString() === new Date().toDateString()
    );
    const weekRides = this.rideHistory.filter(r => 
      r.completedAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    const monthRides = this.rideHistory.filter(r => 
      r.completedAt.getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    return {
      todayEarnings: todayRides.reduce((sum, r) => sum + r.cost, 0),
      weeklyEarnings: weekRides.reduce((sum, r) => sum + r.cost, 0),
      monthlyEarnings: monthRides.reduce((sum, r) => sum + r.cost, 0),
      totalRides: completedRides + 50, // Add some base rides
      completedRides,
      rating: this.rideHistory.length > 0 
        ? this.rideHistory.reduce((sum, r) => sum + r.rating, 0) / this.rideHistory.length 
        : 4.8,
      totalDistance: this.rideHistory.reduce((sum, r) => sum + r.distance, 0),
      emergencyRides: this.rideHistory.filter(r => r.urgency === 'emergency').length,
      onTimePercentage: 95 // Mock on-time percentage
    };
  }

  // Get safety alerts for rider's area
  async getSafetyAlerts(location: string): Promise<SafetyAlert[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.safetyAlerts
      .filter(alert => alert.location.toLowerCase().includes(location.toLowerCase().split(',')[0]))
      .sort((a, b) => {
        // Sort by severity and recency
        const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        const aSeverity = severityOrder[a.severity] || 0;
        const bSeverity = severityOrder[b.severity] || 0;
        
        if (aSeverity !== bSeverity) {
          return bSeverity - aSeverity;
        }
        
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  // Get ride history
  async getRideHistory(riderId: string, limit?: number): Promise<RideHistory[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const history = this.rideHistory.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    return limit ? history.slice(0, limit) : history;
  }

  // Update rider availability
  async updateAvailability(riderId: string, isAvailable: boolean): Promise<void> {
    // In real implementation, this would update the rider's status in the database
    console.log(`Rider ${riderId} availability updated to: ${isAvailable}`);
  }

  // Get earnings breakdown
  async getEarningsBreakdown(riderId: string, period: 'day' | 'week' | 'month'): Promise<{
    totalEarnings: number;
    rideEarnings: number;
    bonusEarnings: number;
    tips: number;
    deductions: number;
    netEarnings: number;
  }> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const periodRides = this.rideHistory.filter(r => r.completedAt >= startDate);
    const rideEarnings = periodRides.reduce((sum, r) => sum + r.cost, 0);
    const bonusEarnings = periodRides.filter(r => r.urgency === 'emergency').length * 100;
    const tips = periodRides.length * 50; // Mock tips
    const deductions = 0; // Mock deductions
    const totalEarnings = rideEarnings + bonusEarnings + tips;
    const netEarnings = totalEarnings - deductions;

    return {
      totalEarnings,
      rideEarnings,
      bonusEarnings,
      tips,
      deductions,
      netEarnings
    };
  }

  // Report safety issue
  async reportSafetyIssue(alert: Omit<SafetyAlert, 'id' | 'timestamp'>): Promise<SafetyAlert> {
    const newAlert: SafetyAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      timestamp: new Date()
    };

    this.safetyAlerts.unshift(newAlert);
    return newAlert;
  }

  // Get nearby requests based on rider location
  async getNearbyRequests(riderLocation: { lat: number; lng: number }, radiusKm: number = 15): Promise<TransportRequest[]> {
    return this.transportRequests
      .filter(r => r.status === 'pending' && r.pickup.gpsCoords)
      .map(r => ({
        ...r,
        distanceFromRider: this.calculateDistance(riderLocation, r.pickup.gpsCoords!)
      }))
      .filter(r => (r as any).distanceFromRider <= radiusKm)
      .sort((a, b) => {
        // Emergency first, then by distance
        if (a.urgency === 'emergency' && b.urgency !== 'emergency') return -1;
        if (b.urgency === 'emergency' && a.urgency !== 'emergency') return 1;
        return (a as any).distanceFromRider - (b as any).distanceFromRider;
      });
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

  // Verify QR code for trip
  async verifyTripQR(qrData: string, requestId: string): Promise<{
    valid: boolean;
    patientInfo?: any;
    error?: string;
  }> {
    try {
      const data = JSON.parse(qrData);
      
      if (data.type === 'paraboda_user') {
        const request = this.transportRequests.find(r => r.id === requestId);
        
        if (request && data.name === request.patientName) {
          return {
            valid: true,
            patientInfo: {
              name: data.name,
              role: data.role,
              location: data.location,
              phone: data.phone
            }
          };
        }
      }
      
      return {
        valid: false,
        error: 'QR code does not match current trip request'
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid QR code format'
      };
    }
  }

  // Get performance analytics
  async getPerformanceAnalytics(riderId: string): Promise<{
    averageRating: number;
    completionRate: number;
    responseTime: number;
    customerSatisfaction: number;
    safetyScore: number;
    earningsGrowth: number;
  }> {
    return {
      averageRating: 4.8,
      completionRate: 98,
      responseTime: 8, // minutes
      customerSatisfaction: 95,
      safetyScore: 92,
      earningsGrowth: 15 // percentage
    };
  }

  // Emergency notification system
  async sendEmergencyNotification(riderId: string, request: TransportRequest): Promise<void> {
    // In real implementation, this would:
    // 1. Send push notification
    // 2. Trigger sound alert
    // 3. Activate vibration
    // 4. Show emergency overlay
    
    console.log(`Emergency notification sent to rider ${riderId} for request ${request.id}`);
  }
}

export const riderService = new RiderService();