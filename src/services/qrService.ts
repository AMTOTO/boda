interface QRUserData {
  type: 'paraboda_user';
  userId: string;
  name: string;
  role: string;
  country: string;
  location: string;
  phone?: string;
  email?: string;
  dateOfBirth: string;
  registrationDate: string;
  qrVersion: string;
}

interface QRServiceData {
  type: 'paraboda_service';
  serviceId: string;
  serviceName: string;
  providerId: string;
  cost: number;
  timestamp: string;
}

class QRService {
  generateUserQR(userData: Partial<QRUserData>): string {
    const qrData: QRUserData = {
      type: 'paraboda_user',
      userId: userData.userId || `user_${Date.now()}`,
      name: userData.name || '',
      role: userData.role || 'community',
      country: userData.country || 'Kenya',
      location: userData.location || '',
      phone: userData.phone,
      email: userData.email,
      dateOfBirth: userData.dateOfBirth || '',
      registrationDate: userData.registrationDate || new Date().toISOString(),
      qrVersion: '1.0'
    };

    return JSON.stringify(qrData);
  }

  generateServiceQR(serviceData: Partial<QRServiceData>): string {
    const qrData: QRServiceData = {
      type: 'paraboda_service',
      serviceId: serviceData.serviceId || `service_${Date.now()}`,
      serviceName: serviceData.serviceName || '',
      providerId: serviceData.providerId || '',
      cost: serviceData.cost || 0,
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(qrData);
  }

  parseQRData(qrString: string): QRUserData | QRServiceData | null {
    try {
      const data = JSON.parse(qrString);
      
      if (data.type === 'paraboda_user' || data.type === 'paraboda_service') {
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing QR data:', error);
      return null;
    }
  }

  validateQRData(qrData: any): boolean {
    if (!qrData || typeof qrData !== 'object') return false;
    
    if (qrData.type === 'paraboda_user') {
      return !!(qrData.userId && qrData.name && qrData.role);
    }
    
    if (qrData.type === 'paraboda_service') {
      return !!(qrData.serviceId && qrData.serviceName && qrData.providerId);
    }
    
    return false;
  }

  // Auto-populate biodata from QR scan
  populateBiodata(qrData: QRUserData): {
    name: string;
    location: string;
    phone?: string;
    email?: string;
    role: string;
    country: string;
  } {
    return {
      name: qrData.name,
      location: qrData.location,
      phone: qrData.phone,
      email: qrData.email,
      role: qrData.role,
      country: qrData.country
    };
  }

  // Process service completion and auto-deduction
  async processServiceCompletion(
    userQR: string, 
    serviceQR: string, 
    actualCost: number
  ): Promise<{
    success: boolean;
    deductedAmount: number;
    paymentMethod: 'wallet' | 'credit' | 'points';
    remainingBalance: number;
  }> {
    try {
      const userData = this.parseQRData(userQR) as QRUserData;
      const serviceData = this.parseQRData(serviceQR) as QRServiceData;

      if (!userData || !serviceData) {
        throw new Error('Invalid QR data');
      }

      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate auto-deduction logic
      const paymentResult = {
        success: true,
        deductedAmount: actualCost,
        paymentMethod: 'wallet' as const,
        remainingBalance: Math.max(0, 1000 - actualCost) // Mock remaining balance
      };

      return paymentResult;
    } catch (error) {
      console.error('Service completion error:', error);
      return {
        success: false,
        deductedAmount: 0,
        paymentMethod: 'wallet',
        remainingBalance: 0
      };
    }
  }

  // Generate downloadable QR code
  generateDownloadableQR(qrData: string, filename: string = 'paraboda-qr'): void {
    // This would integrate with the QRCodeDisplay component's download functionality
    const event = new CustomEvent('downloadQR', {
      detail: { qrData, filename }
    });
    window.dispatchEvent(event);
  }

  // Validate QR code format for ParaBoda system
  isParaBodaQR(qrString: string): boolean {
    try {
      const data = JSON.parse(qrString);
      return data.type === 'paraboda_user' || data.type === 'paraboda_service';
    } catch {
      return false;
    }
  }
}

export const qrService = new QRService();
export type { QRUserData, QRServiceData };