export interface Patient {
  id: string;
  name: string;
  householdId: string;
  age?: number;
  gender?: 'male' | 'female';
  dateOfBirth?: Date;
  phone?: string;
  email?: string;
  location: string;
  chvName?: string;
  chvId?: string;
  isPregnant?: boolean;
  gestationalAge?: number;
  status: 'active' | 'anc_due' | 'vaccination_due' | 'overdue' | 'referred' | 'discharged';
  registeredAt: Date;
  registeredBy: string;
  lastServiceDate?: Date;
  nextAppointment?: Date;
  ancVisitsCompleted?: number;
  ancVisitsRequired?: number;
  vaccinationsReceived?: number;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string[];
  insuranceStatus?: 'SHA' | 'NHIF' | 'Mutuelle' | 'None' | 'Other';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
}

export interface VaccineStock {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitCost: number;
  expiryDate?: Date;
  storageRequirements: string;
  targetAgeGroup: string;
  dosesPerVial: number;
  lastUpdated: Date;
  updatedBy: string;
  usageHistory: Array<{
    date: Date;
    quantityUsed: number;
    patientId?: string;
    administeredBy: string;
    notes?: string;
  }>;
}

export interface SupplementStock {
  id: string;
  name: string;
  type: 'iron' | 'folate' | 'calcium' | 'vitamin_d' | 'multivitamin' | 'other';
  dosage: string;
  manufacturer: string;
  batchNumber: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitCost: number;
  expiryDate?: Date;
  targetGroup: 'pregnant_women' | 'children' | 'adults' | 'all';
  lastUpdated: Date;
  updatedBy: string;
  distributionHistory: Array<{
    date: Date;
    quantityDispensed: number;
    patientId?: string;
    dispensedBy: string;
    notes?: string;
  }>;
}

export interface ServiceRequest {
  id: string;
  patientId?: string;
  patientName: string;
  householdId?: string;
  serviceType: 'anc' | 'vaccination' | 'consultation' | 'emergency' | 'referral' | 'followup';
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  symptoms?: string;
  requestedBy: string;
  requestedByRole: 'caregiver' | 'chv' | 'health_worker';
  requestedAt: Date;
  scheduledDate?: Date;
  status: 'pending' | 'accepted' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'referred';
  assignedTo?: string;
  transportStatus?: 'not_needed' | 'requested' | 'arranged' | 'in_transit' | 'arrived';
  estimatedCost?: number;
  actualCost?: number;
  paymentMethod?: 'cash' | 'insurance' | 'sha' | 'msupu_wallet';
  notes?: string;
  completedAt?: Date;
  completedBy?: string;
  outcome?: string;
}

export interface ANCRecord {
  id: string;
  patientId: string;
  visitNumber: number;
  gestationalAge: number;
  weight?: number;
  bloodPressure?: string;
  hemoglobin?: number;
  urinalysis?: string;
  fundalHeight?: number;
  fetalHeartRate?: number;
  complications?: string[];
  supplementsGiven: string[];
  nextVisitDate?: Date;
  visitDate: Date;
  attendedBy: string;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  patientId: string;
  vaccineId: string;
  vaccineName: string;
  dose: number;
  totalDoses: number;
  batchNumber: string;
  administrationDate: Date;
  administeredBy: string;
  site: 'left_arm' | 'right_arm' | 'left_thigh' | 'right_thigh' | 'oral';
  reactions?: string[];
  nextDoseDate?: Date;
  notes?: string;
}

class HealthWorkerService {
  private patients: Patient[] = [];
  private vaccineStock: VaccineStock[] = [];
  private supplementStock: SupplementStock[] = [];
  private serviceRequests: ServiceRequest[] = [];
  private ancRecords: ANCRecord[] = [];
  private vaccinationRecords: VaccinationRecord[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock patients
    this.patients = [
      {
        id: 'patient_001',
        name: 'Grace Wanjiku',
        householdId: 'KE-13-09-0001',
        age: 28,
        gender: 'female',
        dateOfBirth: new Date(1995, 5, 15),
        phone: '+254712345678',
        location: 'Kiambu Village, Kiambu County',
        chvName: 'Sarah Akinyi',
        chvId: 'chv_001',
        isPregnant: true,
        gestationalAge: 24,
        status: 'anc_due',
        registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        registeredBy: 'health_worker_001',
        lastServiceDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ancVisitsCompleted: 2,
        ancVisitsRequired: 4,
        insuranceStatus: 'SHA',
        emergencyContact: {
          name: 'John Wanjiku',
          phone: '+254723456789',
          relationship: 'Husband'
        }
      },
      {
        id: 'patient_002',
        name: 'Baby Michael',
        householdId: 'KE-13-09-0001',
        age: 0,
        gender: 'male',
        dateOfBirth: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        location: 'Kiambu Village, Kiambu County',
        chvName: 'Sarah Akinyi',
        chvId: 'chv_001',
        status: 'vaccination_due',
        registeredAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        registeredBy: 'health_worker_001',
        lastServiceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextAppointment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        vaccinationsReceived: 3,
        insuranceStatus: 'SHA'
      },
      {
        id: 'patient_003',
        name: 'Mary Akinyi',
        householdId: 'KE-17-01-0002',
        age: 32,
        gender: 'female',
        phone: '+254734567890',
        location: 'Kisumu Central, Kisumu County',
        chvName: 'Peter Ochieng',
        chvId: 'chv_002',
        status: 'active',
        registeredAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        registeredBy: 'health_worker_001',
        lastServiceDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        ancVisitsCompleted: 4,
        vaccinationsReceived: 0,
        insuranceStatus: 'NHIF'
      }
    ];

    // Mock vaccine stock
    this.vaccineStock = [
      {
        id: 'vaccine_001',
        name: 'BCG',
        manufacturer: 'Serum Institute',
        batchNumber: 'BCG2024001',
        currentStock: 45,
        minimumStock: 50,
        maximumStock: 200,
        unitCost: 25,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        storageRequirements: '2-8°C',
        targetAgeGroup: 'Birth',
        dosesPerVial: 20,
        lastUpdated: new Date(),
        updatedBy: 'health_worker_001',
        usageHistory: []
      },
      {
        id: 'vaccine_002',
        name: 'Polio (OPV)',
        manufacturer: 'Bio Farma',
        batchNumber: 'OPV2024002',
        currentStock: 15,
        minimumStock: 30,
        maximumStock: 150,
        unitCost: 15,
        expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        storageRequirements: '2-8°C',
        targetAgeGroup: '6 weeks, 10 weeks, 14 weeks',
        dosesPerVial: 10,
        lastUpdated: new Date(),
        updatedBy: 'health_worker_001',
        usageHistory: []
      },
      {
        id: 'vaccine_003',
        name: 'Measles',
        manufacturer: 'Serum Institute',
        batchNumber: 'MV2024003',
        currentStock: 80,
        minimumStock: 40,
        maximumStock: 120,
        unitCost: 35,
        expiryDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000),
        storageRequirements: '2-8°C',
        targetAgeGroup: '9 months, 18 months',
        dosesPerVial: 10,
        lastUpdated: new Date(),
        updatedBy: 'health_worker_001',
        usageHistory: []
      },
      {
        id: 'vaccine_004',
        name: 'DPT-HepB-Hib',
        manufacturer: 'GSK',
        batchNumber: 'PENTA2024004',
        currentStock: 25,
        minimumStock: 60,
        maximumStock: 180,
        unitCost: 45,
        expiryDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
        storageRequirements: '2-8°C',
        targetAgeGroup: '6, 10, 14 weeks',
        dosesPerVial: 1,
        lastUpdated: new Date(),
        updatedBy: 'health_worker_001',
        usageHistory: []
      }
    ];

    // Mock supplement stock
    this.supplementStock = [
      {
        id: 'supplement_001',
        name: 'Iron Tablets',
        type: 'iron',
        dosage: '60mg',
        manufacturer: 'Cosmos Pharmaceuticals',
        batchNumber: 'IRON2024001',
        currentStock: 120,
        minimumStock: 100,
        maximumStock: 500,
        unitCost: 2,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        targetGroup: 'pregnant_women',
        lastUpdated: new Date(),
        updatedBy: 'health_worker_001',
        distributionHistory: []
      },
      {
        id: 'supplement_002',
        name: 'Folic Acid',
        type: 'folate',
        dosage: '5mg',
        manufacturer: 'Dawa Pharmaceuticals',
        batchNumber: 'FOLIC2024002',
        currentStock: 85,
        minimumStock: 80,
        maximumStock: 400,
        unitCost: 1.5,
        expiryDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
        targetGroup: 'pregnant_women',
        lastUpdated: new Date(),
        updatedBy: 'health_worker_001',
        distributionHistory: []
      },
      {
        id: 'supplement_003',
        name: 'Calcium Tablets',
        type: 'calcium',
        dosage: '500mg',
        manufacturer: 'Healthy Life',
        batchNumber: 'CAL2024003',
        currentStock: 40,
        minimumStock: 60,
        maximumStock: 300,
        unitCost: 3,
        expiryDate: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000),
        targetGroup: 'pregnant_women',
        lastUpdated: new Date(),
        updatedBy: 'health_worker_001',
        distributionHistory: []
      },
      {
        id: 'supplement_004',
        name: 'Vitamin D',
        type: 'vitamin_d',
        dosage: '1000 IU',
        manufacturer: 'Wellness Labs',
        batchNumber: 'VD2024004',
        currentStock: 25,
        minimumStock: 50,
        maximumStock: 250,
        unitCost: 4,
        expiryDate: new Date(Date.now() + 450 * 24 * 60 * 60 * 1000),
        targetGroup: 'all',
        lastUpdated: new Date(),
        updatedBy: 'health_worker_001',
        distributionHistory: []
      }
    ];

    // Mock service requests
    this.serviceRequests = [
      {
        id: 'request_001',
        patientName: 'Grace Wanjiku',
        patientId: 'patient_001',
        householdId: 'KE-13-09-0001',
        serviceType: 'anc',
        urgency: 'medium',
        symptoms: 'Routine ANC checkup - 24 weeks pregnant',
        requestedBy: 'CHV Sarah',
        requestedByRole: 'chv',
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'pending',
        transportStatus: 'arranged',
        estimatedCost: 500,
        paymentMethod: 'sha'
      },
      {
        id: 'request_002',
        patientName: 'Baby Michael',
        patientId: 'patient_002',
        householdId: 'KE-13-09-0001',
        serviceType: 'vaccination',
        urgency: 'high',
        symptoms: 'Overdue vaccination - 6 months old',
        requestedBy: 'Mother Grace',
        requestedByRole: 'caregiver',
        requestedAt: new Date(Date.now() - 30 * 60 * 1000),
        status: 'pending',
        transportStatus: 'requested',
        estimatedCost: 300
      },
      {
        id: 'request_003',
        patientName: 'John Mwangi',
        serviceType: 'emergency',
        urgency: 'emergency',
        symptoms: 'Severe chest pain, difficulty breathing',
        requestedBy: 'CHV Peter',
        requestedByRole: 'chv',
        requestedAt: new Date(Date.now() - 15 * 60 * 1000),
        status: 'pending',
        transportStatus: 'in_transit',
        estimatedCost: 800,
        paymentMethod: 'msupu_wallet'
      }
    ];
  }

  // Patient management methods
  getFacilityPatients(facilityLocation: string): Patient[] {
    return this.patients
      .filter(p => p.location.includes(facilityLocation.split(',')[0]) || facilityLocation === '')
      .sort((a, b) => {
        // Sort by urgency: overdue > due > active
        const statusPriority = { 'overdue': 3, 'anc_due': 2, 'vaccination_due': 2, 'active': 1, 'referred': 0, 'discharged': 0 };
        return (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
      });
  }

  async addPatient(patientData: Omit<Patient, 'id' | 'registeredAt' | 'registeredBy'>, healthWorkerId: string): Promise<Patient> {
    const patient: Patient = {
      ...patientData,
      id: `patient_${Date.now()}`,
      registeredAt: new Date(),
      registeredBy: healthWorkerId
    };

    this.patients.unshift(patient);
    return patient;
  }

  async updatePatient(patientId: string, updates: Partial<Patient>): Promise<Patient> {
    const index = this.patients.findIndex(p => p.id === patientId);
    if (index === -1) throw new Error('Patient not found');

    this.patients[index] = { ...this.patients[index], ...updates };
    return this.patients[index];
  }

  getPatientById(patientId: string): Patient | null {
    return this.patients.find(p => p.id === patientId) || null;
  }

  // Vaccine inventory methods
  getVaccineInventory(): VaccineStock[] {
    return this.vaccineStock.sort((a, b) => {
      // Sort by stock level (low stock first)
      const aPercentage = (a.currentStock / a.minimumStock) * 100;
      const bPercentage = (b.currentStock / b.minimumStock) * 100;
      return aPercentage - bPercentage;
    });
  }

  async updateVaccineStock(vaccineId: string, newStock: number, updatedBy: string): Promise<VaccineStock> {
    const index = this.vaccineStock.findIndex(v => v.id === vaccineId);
    if (index === -1) throw new Error('Vaccine not found');

    this.vaccineStock[index].currentStock = newStock;
    this.vaccineStock[index].lastUpdated = new Date();
    this.vaccineStock[index].updatedBy = updatedBy;

    return this.vaccineStock[index];
  }

  async administeVaccine(vaccineId: string, patientId: string, administeredBy: string): Promise<VaccinationRecord> {
    const vaccine = this.vaccineStock.find(v => v.id === vaccineId);
    if (!vaccine) throw new Error('Vaccine not found');
    if (vaccine.currentStock <= 0) throw new Error('Vaccine out of stock');

    // Reduce stock
    vaccine.currentStock -= 1;
    vaccine.lastUpdated = new Date();
    vaccine.updatedBy = administeredBy;

    // Add usage history
    vaccine.usageHistory.push({
      date: new Date(),
      quantityUsed: 1,
      patientId,
      administeredBy,
      notes: 'Vaccination administered'
    });

    // Create vaccination record
    const vaccinationRecord: VaccinationRecord = {
      id: `vaccination_${Date.now()}`,
      patientId,
      vaccineId,
      vaccineName: vaccine.name,
      dose: 1, // This would be calculated based on patient's vaccination history
      totalDoses: 1, // This would be based on vaccine schedule
      batchNumber: vaccine.batchNumber,
      administrationDate: new Date(),
      administeredBy,
      site: 'left_arm', // Default, would be selected by health worker
      reactions: [],
      notes: 'Vaccination completed successfully'
    };

    this.vaccinationRecords.unshift(vaccinationRecord);

    // Update patient vaccination count
    const patient = this.patients.find(p => p.id === patientId);
    if (patient) {
      patient.vaccinationsReceived = (patient.vaccinationsReceived || 0) + 1;
      patient.lastServiceDate = new Date();
    }

    return vaccinationRecord;
  }

  // Supplement inventory methods
  getSupplementInventory(): SupplementStock[] {
    return this.supplementStock.sort((a, b) => {
      // Sort by stock level (low stock first)
      const aPercentage = (a.currentStock / a.minimumStock) * 100;
      const bPercentage = (b.currentStock / b.minimumStock) * 100;
      return aPercentage - bPercentage;
    });
  }

  async updateSupplementStock(supplementId: string, newStock: number, updatedBy: string): Promise<SupplementStock> {
    const index = this.supplementStock.findIndex(s => s.id === supplementId);
    if (index === -1) throw new Error('Supplement not found');

    this.supplementStock[index].currentStock = newStock;
    this.supplementStock[index].lastUpdated = new Date();
    this.supplementStock[index].updatedBy = updatedBy;

    return this.supplementStock[index];
  }

  async dispenseSupplement(supplementId: string, quantity: number, patientId: string, dispensedBy: string): Promise<void> {
    const supplement = this.supplementStock.find(s => s.id === supplementId);
    if (!supplement) throw new Error('Supplement not found');
    if (supplement.currentStock < quantity) throw new Error('Insufficient stock');

    // Reduce stock
    supplement.currentStock -= quantity;
    supplement.lastUpdated = new Date();
    supplement.updatedBy = dispensedBy;

    // Add distribution history
    supplement.distributionHistory.push({
      date: new Date(),
      quantityDispensed: quantity,
      patientId,
      dispensedBy,
      notes: 'Supplement dispensed'
    });

    // Update patient record
    const patient = this.patients.find(p => p.id === patientId);
    if (patient) {
      patient.lastServiceDate = new Date();
    }
  }

  // Service request methods
  getServiceRequests(facilityLocation: string): ServiceRequest[] {
    return this.serviceRequests
      .sort((a, b) => {
        // Sort by urgency and time
        const urgencyPriority = { 'emergency': 4, 'high': 3, 'medium': 2, 'low': 1 };
        const aPriority = urgencyPriority[a.urgency] || 0;
        const bPriority = urgencyPriority[b.urgency] || 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        return b.requestedAt.getTime() - a.requestedAt.getTime();
      });
  }

  async acceptServiceRequest(requestId: string, healthWorkerId: string): Promise<ServiceRequest> {
    const index = this.serviceRequests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Service request not found');

    this.serviceRequests[index].status = 'accepted';
    this.serviceRequests[index].assignedTo = healthWorkerId;

    return this.serviceRequests[index];
  }

  async scheduleService(requestId: string, scheduledDate: Date, notes?: string): Promise<ServiceRequest> {
    const index = this.serviceRequests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Service request not found');

    this.serviceRequests[index].status = 'scheduled';
    this.serviceRequests[index].scheduledDate = scheduledDate;
    if (notes) {
      this.serviceRequests[index].notes = notes;
    }

    return this.serviceRequests[index];
  }

  async completeService(requestId: string, healthWorkerId: string, outcome: string, actualCost?: number): Promise<ServiceRequest> {
    const index = this.serviceRequests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Service request not found');

    this.serviceRequests[index].status = 'completed';
    this.serviceRequests[index].completedAt = new Date();
    this.serviceRequests[index].completedBy = healthWorkerId;
    this.serviceRequests[index].outcome = outcome;
    
    if (actualCost) {
      this.serviceRequests[index].actualCost = actualCost;
    }

    return this.serviceRequests[index];
  }

  // ANC record methods
  async recordANCVisit(ancData: Omit<ANCRecord, 'id' | 'visitDate' | 'attendedBy'>, healthWorkerId: string): Promise<ANCRecord> {
    const ancRecord: ANCRecord = {
      ...ancData,
      id: `anc_${Date.now()}`,
      visitDate: new Date(),
      attendedBy: healthWorkerId
    };

    this.ancRecords.unshift(ancRecord);

    // Update patient ANC count
    const patient = this.patients.find(p => p.id === ancData.patientId);
    if (patient) {
      patient.ancVisitsCompleted = (patient.ancVisitsCompleted || 0) + 1;
      patient.lastServiceDate = new Date();
      if (ancRecord.nextVisitDate) {
        patient.nextAppointment = ancRecord.nextVisitDate;
      }
    }

    return ancRecord;
  }

  getPatientANCRecords(patientId: string): ANCRecord[] {
    return this.ancRecords
      .filter(r => r.patientId === patientId)
      .sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
  }

  // Vaccination record methods
  getPatientVaccinationRecords(patientId: string): VaccinationRecord[] {
    return this.vaccinationRecords
      .filter(r => r.patientId === patientId)
      .sort((a, b) => b.administrationDate.getTime() - a.administrationDate.getTime());
  }

  // Statistics and analytics
  getHealthWorkerStats(healthWorkerId: string): {
    totalPatients: number;
    patientsToday: number;
    vaccinationsGiven: number;
    ancVisitsCompleted: number;
    lowStockItems: number;
    pendingRequests: number;
    emergencyRequests: number;
    shaContributions: number;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const patientsToday = this.patients.filter(p => 
      p.lastServiceDate && p.lastServiceDate >= today
    ).length;

    const vaccinationsToday = this.vaccinationRecords.filter(v => 
      v.administrationDate >= today && v.administeredBy === healthWorkerId
    ).length;

    const ancToday = this.ancRecords.filter(a => 
      a.visitDate >= today && a.attendedBy === healthWorkerId
    ).length;

    const lowStockVaccines = this.vaccineStock.filter(v => v.currentStock <= v.minimumStock).length;
    const lowStockSupplements = this.supplementStock.filter(s => s.currentStock <= s.minimumStock).length;

    const pendingRequests = this.serviceRequests.filter(r => r.status === 'pending').length;
    const emergencyRequests = this.serviceRequests.filter(r => r.urgency === 'emergency' && r.status === 'pending').length;

    return {
      totalPatients: this.patients.length,
      patientsToday,
      vaccinationsGiven: vaccinationsToday,
      ancVisitsCompleted: ancToday,
      lowStockItems: lowStockVaccines + lowStockSupplements,
      pendingRequests,
      emergencyRequests,
      shaContributions: 0 // Would be calculated from SHA service
    };
  }

  // Stock alert methods
  getLowStockAlerts(): {
    vaccines: VaccineStock[];
    supplements: SupplementStock[];
  } {
    return {
      vaccines: this.vaccineStock.filter(v => v.currentStock <= v.minimumStock),
      supplements: this.supplementStock.filter(s => s.currentStock <= s.minimumStock)
    };
  }

  getExpiringItems(daysAhead: number = 30): {
    vaccines: VaccineStock[];
    supplements: SupplementStock[];
  } {
    const cutoffDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

    return {
      vaccines: this.vaccineStock.filter(v => v.expiryDate && v.expiryDate <= cutoffDate),
      supplements: this.supplementStock.filter(s => s.expiryDate && s.expiryDate <= cutoffDate)
    };
  }

  // Integration with CHV dashboard
  async syncWithCHV(chvId: string): Promise<void> {
    // Mock sync with CHV dashboard
    console.log('Syncing patient data with CHV:', chvId);
    
    // In real implementation:
    // 1. Send updated patient records to CHV
    // 2. Receive household updates from CHV
    // 3. Update patient statuses based on CHV data
    // 4. Sync vaccination schedules
  }

  // Integration with district health system
  async syncWithDistrict(): Promise<void> {
    // Mock sync with district health management system
    console.log('Syncing with district health system');
    
    // In real implementation:
    // 1. Send stock usage reports
    // 2. Request stock replenishment
    // 3. Submit vaccination coverage reports
    // 4. Send disease surveillance data
  }

  // SHA integration methods
  async processSHAContribution(patientId: string, amount: number, healthWorkerId: string): Promise<void> {
    // Mock SHA contribution processing
    console.log('Processing SHA contribution:', { patientId, amount, healthWorkerId });
    
    // In real implementation:
    // 1. Validate patient eligibility
    // 2. Process payment through M-Supu wallet
    // 3. Update SHA membership status
    // 4. Generate receipt
  }

  async approveSHALoan(patientId: string, loanAmount: number, healthWorkerId: string): Promise<void> {
    // Mock SHA loan approval
    console.log('Approving SHA loan:', { patientId, loanAmount, healthWorkerId });
    
    // In real implementation:
    // 1. Verify patient eligibility
    // 2. Check loan limits
    // 3. Process through M-Supu wallet service
    // 4. Update patient financial status
  }

  // Data export methods
  async exportPatientData(format: 'csv' | 'json' = 'csv'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify({
        patients: this.patients,
        ancRecords: this.ancRecords,
        vaccinationRecords: this.vaccinationRecords,
        exportedAt: new Date().toISOString()
      }, null, 2);
    }

    // CSV format
    const headers = ['Name', 'Household ID', 'Age', 'Gender', 'Status', 'Last Service', 'CHV', 'Phone'];
    const rows = this.patients.map(p => [
      p.name,
      p.householdId,
      p.age?.toString() || '',
      p.gender || '',
      p.status,
      p.lastServiceDate?.toLocaleDateString() || '',
      p.chvName || '',
      p.phone || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  async exportInventoryData(format: 'csv' | 'json' = 'csv'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify({
        vaccines: this.vaccineStock,
        supplements: this.supplementStock,
        exportedAt: new Date().toISOString()
      }, null, 2);
    }

    // CSV format for vaccines
    const vaccineHeaders = ['Type', 'Name', 'Current Stock', 'Minimum Stock', 'Expiry Date', 'Batch Number'];
    const vaccineRows = this.vaccineStock.map(v => [
      'Vaccine',
      v.name,
      v.currentStock.toString(),
      v.minimumStock.toString(),
      v.expiryDate?.toLocaleDateString() || '',
      v.batchNumber
    ]);

    const supplementRows = this.supplementStock.map(s => [
      'Supplement',
      s.name,
      s.currentStock.toString(),
      s.minimumStock.toString(),
      s.expiryDate?.toLocaleDateString() || '',
      s.batchNumber
    ]);

    return [vaccineHeaders, ...vaccineRows, ...supplementRows].map(row => row.join(',')).join('\n');
  }
}

export const healthWorkerService = new HealthWorkerService();