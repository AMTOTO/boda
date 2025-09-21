interface Location {
  country: string;
  administrativeUnits: string[];
  village: string;
  manualAddress?: string;
  gpsCoords?: { lat: number; lng: number };
}

export interface Household {
  id: string;
  householdId: string; // Auto-generated: COUNTRYCODE-ADMINCODES-XXXX
  headOfHousehold: {
    name: string;
    phone?: string;
  };
  location: Location;
  totalMembers: number;
  adults: number;
  children: number;
  pregnantWomen: number;
  childrenUnder5: number;
  elderly?: number;
  disabled?: number;
  chronicIllness?: number;
  insuranceStatus: 'SHA' | 'NHIF' | 'Mutuelle' | 'None' | 'Other';
  otherInsurance?: string;
  vulnerableGroups: string[];
  status: 'active' | 'priority' | 'anc_due' | 'vaccination_due' | 'overdue';
  registeredAt: Date;
  registeredBy: string; // CHV ID
  lastVisit?: Date;
  nextVisit?: Date;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  notes?: string;
}

export interface Mother {
  id: string;
  motherId: string; // Auto-generated: COUNTRYCODE-ADMINCODES-M-XXXX
  householdId: string;
  name: string;
  dateOfBirth: Date;
  phone?: string;
  gravida: number;
  para: number;
  lastMenstrualPeriod: Date;
  expectedDeliveryDate: Date;
  gestationalAge: number;
  ancVisitsCompleted: number;
  ancVisitsRequired: number;
  supplements: {
    iron: boolean;
    folate: boolean;
    calcium: boolean;
    vitaminD: boolean;
  };
  birthPlan: {
    preferredFacility: string;
    emergencyContact: string;
    emergencyPhone: string;
    transportPlan: string;
  };
  riskFactors: string[];
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'delivered' | 'referred' | 'lost_to_followup';
  registeredAt: Date;
  registeredBy: string; // CHV ID
  nextANCDate?: Date;
  medicalHistory?: string;
  allergies?: string;
  notes?: string;
}

export interface Child {
  id: string;
  childId: string; // Auto-generated: COUNTRYCODE-ADMINCODES-C-XXXX
  householdId: string;
  name: string;
  dateOfBirth: Date;
  sex: 'male' | 'female';
  ageInMonths: number;
  birthWeight?: number;
  currentWeight?: number;
  height?: number;
  muacColor?: 'green' | 'yellow' | 'red';
  nutritionStatus: 'well_nourished' | 'moderate_malnutrition' | 'severe_malnutrition' | 'not_assessed';
  motherName: string;
  fatherName?: string;
  birthCertificateNumber?: string;
  birthDetails?: {
    placeOfBirth?: string;
    deliveryType?: 'normal' | 'caesarean' | 'assisted';
    birthAttendant?: 'doctor' | 'nurse' | 'midwife' | 'traditional' | 'unattended';
    complications: string[];
  };
  vaccinationStatus: 'up_to_date' | 'behind' | 'overdue' | 'not_started';
  nextVaccinationDue?: Date;
  registeredAt: Date;
  registeredBy: string; // CHV ID
  medicalHistory?: string;
  allergies?: string;
  notes?: string;
  status: 'active' | 'referred' | 'lost_to_followup';
}

export interface Hazard {
  id: string;
  type: 'flood' | 'drought' | 'storm' | 'landslide' | 'heatwave' | 'earthquake' | 'fire';
  severity: 'low' | 'medium' | 'high';
  location: {
    gpsCoords: { lat: number; lng: number };
    address: string;
    administrativeUnits: string[];
  };
  description: string;
  impact: {
    displacement: boolean;
    roadCutOff: boolean;
    cropLoss: boolean;
    infrastructureDamage: boolean;
    waterContamination: boolean;
    powerOutage: boolean;
    communicationDown: boolean;
  };
  affectedHouseholds: number;
  affectedPeople: number;
  casualties: number;
  immediateNeeds: string[];
  responseActions?: string;
  photoUrl?: string;
  status: 'reported' | 'investigating' | 'responding' | 'resolved';
  healthRisks: string;
  reportedAt: Date;
  reportedBy: string; // CHV ID
  notes?: string;
}

export interface DiseaseCase {
  id: string;
  caseId: string; // Auto-generated: COUNTRYCODE-ADMINCODES-D-XXXX
  householdId: string;
  patientName: string;
  patientAge?: number;
  patientSex?: 'male' | 'female';
  disease: string;
  symptoms: string[];
  onsetDate: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'suspected' | 'probable' | 'confirmed';
  labTestRequested: boolean;
  labResults?: string;
  treatment?: string;
  isolation: boolean;
  contactTracing: boolean;
  contacts: string[];
  outcome?: 'recovering' | 'recovered' | 'referred' | 'hospitalized' | 'died';
  location: {
    gpsCoords: { lat: number; lng: number } | null;
    address: string;
    administrativeUnits: string[];
  };
  escalationLevel: 'facility' | 'district' | 'national';
  reportedAt: Date;
  reportedBy: string; // CHV ID
  notes?: string;
}

class CHVService {
  private households: Household[] = [];
  private mothers: Mother[] = [];
  private children: Child[] = [];
  private hazards: Hazard[] = [];
  private diseaseCases: DiseaseCase[] = [];
  private sequenceCounters: Map<string, number> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with some mock data
    this.households = [
      {
        id: 'household_001',
        householdId: 'KE-13-09-0001',
        headOfHousehold: {
          name: 'Grace Wanjiku',
          phone: '+254712345678'
        },
        location: {
          country: 'KE',
          administrativeUnits: ['KE-13', 'KE-13-09'],
          village: 'Kiambu Village',
          gpsCoords: { lat: -1.1743, lng: 36.8356 }
        },
        totalMembers: 5,
        adults: 2,
        children: 3,
        pregnantWomen: 1,
        childrenUnder5: 2,
        insuranceStatus: 'SHA',
        vulnerableGroups: ['pregnant', 'under5'],
        status: 'anc_due',
        registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        registeredBy: 'chv_001',
        lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        nextVisit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];

    this.mothers = [
      {
        id: 'mother_001',
        motherId: 'KE-13-09-M-0001',
        householdId: 'household_001',
        name: 'Grace Wanjiku',
        dateOfBirth: new Date(1995, 5, 15),
        phone: '+254712345678',
        gravida: 2,
        para: 1,
        lastMenstrualPeriod: new Date(Date.now() - 24 * 7 * 24 * 60 * 60 * 1000), // 24 weeks ago
        expectedDeliveryDate: new Date(Date.now() + 16 * 7 * 24 * 60 * 60 * 1000), // 16 weeks from now
        gestationalAge: 24,
        ancVisitsCompleted: 2,
        ancVisitsRequired: 4,
        supplements: {
          iron: true,
          folate: true,
          calcium: false,
          vitaminD: false
        },
        birthPlan: {
          preferredFacility: 'Kiambu District Hospital',
          emergencyContact: 'John Wanjiku',
          emergencyPhone: '+254723456789',
          transportPlan: 'ParaBoda emergency transport'
        },
        riskFactors: [],
        riskLevel: 'low',
        status: 'active',
        registeredAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        registeredBy: 'chv_001',
        nextANCDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    ];

    this.children = [
      {
        id: 'child_001',
        childId: 'KE-13-09-C-0001',
        householdId: 'household_001',
        name: 'Baby Michael',
        dateOfBirth: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // 6 months ago
        sex: 'male',
        ageInMonths: 6,
        birthWeight: 3.2,
        currentWeight: 7.5,
        height: 65,
        muacColor: 'green',
        nutritionStatus: 'well_nourished',
        motherName: 'Grace Wanjiku',
        fatherName: 'John Wanjiku',
        birthDetails: {
          placeOfBirth: 'Kiambu District Hospital',
          deliveryType: 'normal',
          birthAttendant: 'nurse',
          complications: []
        },
        vaccinationStatus: 'up_to_date',
        nextVaccinationDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        registeredAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        registeredBy: 'chv_001',
        status: 'active'
      }
    ];
  }

  // Generate unique IDs
  private generateHouseholdId(administrativeUnits: string[]): string {
    const locationCode = administrativeUnits.join('-');
    const currentCount = this.sequenceCounters.get(`household_${locationCode}`) || 0;
    const newCount = currentCount + 1;
    this.sequenceCounters.set(`household_${locationCode}`, newCount);
    
    return `${locationCode}-${newCount.toString().padStart(4, '0')}`;
  }

  private generateMotherId(administrativeUnits: string[]): string {
    const locationCode = administrativeUnits.join('-');
    const currentCount = this.sequenceCounters.get(`mother_${locationCode}`) || 0;
    const newCount = currentCount + 1;
    this.sequenceCounters.set(`mother_${locationCode}`, newCount);
    
    return `${locationCode}-M-${newCount.toString().padStart(4, '0')}`;
  }

  private generateChildId(administrativeUnits: string[]): string {
    const locationCode = administrativeUnits.join('-');
    const currentCount = this.sequenceCounters.get(`child_${locationCode}`) || 0;
    const newCount = currentCount + 1;
    this.sequenceCounters.set(`child_${locationCode}`, newCount);
    
    return `${locationCode}-C-${newCount.toString().padStart(4, '0')}`;
  }

  private generateCaseId(administrativeUnits: string[]): string {
    const locationCode = administrativeUnits.join('-');
    const currentCount = this.sequenceCounters.get(`case_${locationCode}`) || 0;
    const newCount = currentCount + 1;
    this.sequenceCounters.set(`case_${locationCode}`, newCount);
    
    return `${locationCode}-D-${newCount.toString().padStart(4, '0')}`;
  }

  // Household management
  async addHousehold(householdData: Omit<Household, 'id' | 'householdId' | 'registeredAt' | 'registeredBy'>, chvId: string): Promise<Household> {
    const household: Household = {
      ...householdData,
      id: `household_${Date.now()}`,
      householdId: this.generateHouseholdId(householdData.location.administrativeUnits),
      registeredAt: new Date(),
      registeredBy: chvId
    };

    this.households.unshift(household);
    return household;
  }

  async updateHousehold(householdId: string, updates: Partial<Household>): Promise<Household> {
    const index = this.households.findIndex(h => h.id === householdId);
    if (index === -1) throw new Error('Household not found');

    this.households[index] = { ...this.households[index], ...updates };
    return this.households[index];
  }

  getCHVHouseholds(chvId: string): Household[] {
    return this.households
      .filter(h => h.registeredBy === chvId)
      .sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime());
  }

  // Mother management
  async addMother(motherData: Omit<Mother, 'id' | 'motherId' | 'registeredAt' | 'registeredBy'>, chvId: string): Promise<Mother> {
    const household = this.households.find(h => h.id === motherData.householdId);
    if (!household) throw new Error('Household not found');

    const mother: Mother = {
      ...motherData,
      id: `mother_${Date.now()}`,
      motherId: this.generateMotherId(household.location.administrativeUnits),
      registeredAt: new Date(),
      registeredBy: chvId
    };

    this.mothers.unshift(mother);
    return mother;
  }

  getAllMothers(): Mother[] {
    return this.mothers.sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime());
  }

  // Child management
  async addChild(childData: Omit<Child, 'id' | 'childId' | 'registeredAt' | 'registeredBy'>, chvId: string): Promise<Child> {
    const household = this.households.find(h => h.id === childData.householdId);
    if (!household) throw new Error('Household not found');

    const child: Child = {
      ...childData,
      id: `child_${Date.now()}`,
      childId: this.generateChildId(household.location.administrativeUnits),
      registeredAt: new Date(),
      registeredBy: chvId
    };

    this.children.unshift(child);
    return child;
  }

  getAllChildren(): Child[] {
    return this.children.sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime());
  }

  // Hazard reporting
  async reportHazard(hazardData: Omit<Hazard, 'id' | 'reportedAt' | 'reportedBy'>, chvId: string): Promise<Hazard> {
    const hazard: Hazard = {
      ...hazardData,
      id: `hazard_${Date.now()}`,
      reportedAt: new Date(),
      reportedBy: chvId
    };

    this.hazards.unshift(hazard);
    
    // Auto-escalate based on severity
    if (hazard.severity === 'high') {
      await this.escalateHazard(hazard);
    }

    return hazard;
  }

  private async escalateHazard(hazard: Hazard): Promise<void> {
    // Mock escalation to district/national level
    console.log('Escalating hazard to higher authorities:', hazard);
    
    // In real implementation:
    // 1. Send to district emergency management
    // 2. Alert national disaster management if critical
    // 3. Notify health facilities about health risks
    // 4. Update early warning systems
  }

  getHazardsByLocation(location: string): Hazard[] {
    return this.hazards
      .filter(h => h.location.address.includes(location))
      .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
  }

  // Disease outbreak reporting
  async reportDiseaseCase(caseData: Omit<DiseaseCase, 'id' | 'caseId' | 'reportedAt' | 'reportedBy'>, chvId: string): Promise<DiseaseCase> {
    const household = this.households.find(h => h.id === caseData.householdId);
    if (!household) throw new Error('Household not found');

    const diseaseCase: DiseaseCase = {
      ...caseData,
      id: `case_${Date.now()}`,
      caseId: this.generateCaseId(household.location.administrativeUnits),
      reportedAt: new Date(),
      reportedBy: chvId,
      location: {
        ...caseData.location,
        gpsCoords: household.location.gpsCoords || null
      }
    };

    this.diseaseCases.unshift(diseaseCase);
    
    // Auto-escalate based on disease and severity
    await this.escalateDiseaseCase(diseaseCase);

    return diseaseCase;
  }

  private async escalateDiseaseCase(diseaseCase: DiseaseCase): Promise<void> {
    console.log(`Escalating ${diseaseCase.escalationLevel} level disease case:`, diseaseCase);
    
    // Auto-escalation logic
    switch (diseaseCase.escalationLevel) {
      case 'national':
        // Critical diseases (Ebola, Cholera, etc.)
        await this.notifyNationalSurveillance(diseaseCase);
        await this.notifyDistrictSurveillance(diseaseCase);
        await this.notifyHealthFacility(diseaseCase);
        break;
      case 'district':
        // Medium priority diseases
        await this.notifyDistrictSurveillance(diseaseCase);
        await this.notifyHealthFacility(diseaseCase);
        break;
      case 'facility':
        // Routine diseases
        await this.notifyHealthFacility(diseaseCase);
        break;
    }
  }

  private async notifyNationalSurveillance(diseaseCase: DiseaseCase): Promise<void> {
    // Mock notification to national surveillance system
    console.log('🚨 NATIONAL ALERT: Critical disease case reported', diseaseCase);
  }

  private async notifyDistrictSurveillance(diseaseCase: DiseaseCase): Promise<void> {
    // Mock notification to district surveillance
    console.log('⚠️ DISTRICT ALERT: Disease case reported', diseaseCase);
  }

  private async notifyHealthFacility(diseaseCase: DiseaseCase): Promise<void> {
    // Mock notification to local health facility
    console.log('ℹ️ FACILITY ALERT: Disease case reported', diseaseCase);
  }

  getDiseaseCasesByLocation(location: string): DiseaseCase[] {
    return this.diseaseCases
      .filter(c => c.location.address.includes(location))
      .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
  }

  // Transport coordination
  async createTransportRequest(requestData: any): Promise<void> {
    // Mock transport request creation
    console.log('Creating transport request:', requestData);
    
    // In real implementation:
    // 1. Validate CHV approval authority
    // 2. Check payment method availability
    // 3. Notify nearby riders
    // 4. Create request in transport system
    // 5. Send notifications to household
  }

  // Statistics and analytics
  getCHVStats(chvId: string): {
    totalHouseholds: number;
    pregnantWomen: number;
    childrenUnder5: number;
    overdueVaccinations: number;
    upcomingANC: number;
    transportRequests: number;
    hazardReports: number;
    diseaseReports: number;
  } {
    const chvHouseholds = this.getCHVHouseholds(chvId);
    const chvMothers = this.mothers.filter(m => 
      chvHouseholds.some(h => h.id === m.householdId)
    );
    const chvChildren = this.children.filter(c => 
      chvHouseholds.some(h => h.id === c.householdId)
    );

    return {
      totalHouseholds: chvHouseholds.length,
      pregnantWomen: chvMothers.filter(m => m.status === 'active').length,
      childrenUnder5: chvChildren.filter(c => c.ageInMonths < 60).length,
      overdueVaccinations: chvChildren.filter(c => c.vaccinationStatus === 'overdue').length,
      upcomingANC: chvMothers.filter(m => 
        m.nextANCDate && m.nextANCDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ).length,
      transportRequests: 0, // Would be calculated from transport service
      hazardReports: this.hazards.filter(h => h.reportedBy === chvId).length,
      diseaseReports: this.diseaseCases.filter(c => c.reportedBy === chvId).length
    };
  }

  // Data export for integration
  async exportCHVData(chvId: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    const households = this.getCHVHouseholds(chvId);
    const mothers = this.mothers.filter(m => 
      households.some(h => h.id === m.householdId)
    );
    const children = this.children.filter(c => 
      households.some(h => h.id === c.householdId)
    );

    const data = {
      households,
      mothers,
      children,
      hazards: this.hazards.filter(h => h.reportedBy === chvId),
      diseaseCases: this.diseaseCases.filter(c => c.reportedBy === chvId),
      exportedAt: new Date().toISOString(),
      exportedBy: chvId
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    // CSV format (simplified)
    const csvRows = [
      ['Type', 'ID', 'Name', 'Status', 'Date'],
      ...households.map(h => ['Household', h.householdId, h.headOfHousehold.name, h.status, h.registeredAt.toISOString()]),
      ...mothers.map(m => ['Mother', m.motherId, m.name, m.status, m.registeredAt.toISOString()]),
      ...children.map(c => ['Child', c.childId, c.name, c.status, c.registeredAt.toISOString()])
    ];

    return csvRows.map(row => row.join(',')).join('\n');
  }

  // Sync with health facility systems
  async syncWithHealthFacility(chvId: string): Promise<void> {
    // Mock sync with health facility DHIS2 or similar system
    console.log('Syncing CHV data with health facility for CHV:', chvId);
    
    // In real implementation:
    // 1. Push household, mother, and child data to facility system
    // 2. Pull any updates from facility (lab results, referrals, etc.)
    // 3. Update vaccination schedules
    // 4. Sync disease surveillance data
  }

  // Offline data management
  async saveOfflineData(data: any): Promise<void> {
    // Store data locally for offline access
    try {
      localStorage.setItem('chv_offline_data', JSON.stringify({
        households: this.households,
        mothers: this.mothers,
        children: this.children,
        hazards: this.hazards,
        diseaseCases: this.diseaseCases,
        lastSync: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  async loadOfflineData(): Promise<void> {
    // Load data from local storage
    try {
      const stored = localStorage.getItem('chv_offline_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.households = data.households || [];
        this.mothers = data.mothers || [];
        this.children = data.children || [];
        this.hazards = data.hazards || [];
        this.diseaseCases = data.diseaseCases || [];
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }
}

export const chvService = new CHVService();

// Load offline data on service initialization
chvService.loadOfflineData();

// Auto-save data when online
window.addEventListener('online', () => {
  chvService.saveOfflineData({});
});