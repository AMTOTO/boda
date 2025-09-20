interface HealthRecord {
  id: string;
  patientId: string;
  patientName: string;
  recordType: 'anc' | 'vaccination' | 'consultation' | 'emergency';
  date: Date;
  status: 'scheduled' | 'completed' | 'missed' | 'overdue';
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ANCRecord extends HealthRecord {
  recordType: 'anc';
  visitNumber: number;
  totalVisits: number;
  gestationalAge: number;
  weight?: number;
  bloodPressure?: string;
  hemoglobin?: number;
  nextVisitDate?: Date;
  complications?: string[];
}

export interface VaccinationRecord extends HealthRecord {
  recordType: 'vaccination';
  vaccine: string;
  dose: number;
  totalDoses: number;
  childAge: number;
  location?: string;
  batchNumber?: string;
  administeredBy?: string;
  nextDoseDate?: Date;
}

export interface ConsultationRecord extends HealthRecord {
  recordType: 'consultation';
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  referral?: string;
  followUpDate?: Date;
  consultedBy: string;
}

export interface EmergencyRecord extends HealthRecord {
  recordType: 'emergency';
  emergencyType: 'medical' | 'accident' | 'labor' | 'breathing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  outcome?: string;
  transportProvided: boolean;
  hospitalAdmission?: boolean;
  cost?: number;
}

class HealthRecordsService {
  private records: HealthRecord[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock ANC records
    this.records.push(
      {
        id: 'anc_001',
        patientId: 'preview-community',
        patientName: 'Amina Wanjiku',
        recordType: 'anc',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        status: 'completed',
        visitNumber: 2,
        totalVisits: 4,
        gestationalAge: 24,
        weight: 65,
        bloodPressure: '120/80',
        hemoglobin: 11.5,
        nextVisitDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        notes: 'Normal pregnancy progression, iron supplements prescribed'
      } as ANCRecord,
      {
        id: 'anc_002',
        patientId: 'preview-community',
        patientName: 'Amina Wanjiku',
        recordType: 'anc',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        status: 'completed',
        visitNumber: 1,
        totalVisits: 4,
        gestationalAge: 20,
        weight: 62,
        bloodPressure: '118/78',
        hemoglobin: 12.0,
        notes: 'First ANC visit, all tests normal'
      } as ANCRecord
    );

    // Mock vaccination records
    this.records.push(
      {
        id: 'vac_001',
        patientId: 'child_001',
        patientName: 'Baby Grace',
        recordType: 'vaccination',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'overdue',
        vaccine: 'BCG',
        dose: 1,
        totalDoses: 1,
        childAge: 6,
        notes: 'BCG vaccine overdue by 1 week'
      } as VaccinationRecord,
      {
        id: 'vac_002',
        patientId: 'child_001',
        patientName: 'Baby Grace',
        recordType: 'vaccination',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        vaccine: 'Polio',
        dose: 2,
        totalDoses: 4,
        childAge: 6,
        nextDoseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      } as VaccinationRecord,
      {
        id: 'vac_003',
        patientId: 'child_002',
        patientName: 'Michael',
        recordType: 'vaccination',
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        status: 'completed',
        vaccine: 'Measles',
        dose: 1,
        totalDoses: 1,
        childAge: 24,
        location: 'Kiambu Health Center',
        administeredBy: 'Nurse Mary',
        batchNumber: 'MV2024001'
      } as VaccinationRecord
    );
  }

  // Get records by patient and type
  getRecords(patientId: string, recordType?: HealthRecord['recordType']): HealthRecord[] {
    let filtered = this.records.filter(r => r.patientId === patientId);
    if (recordType) {
      filtered = filtered.filter(r => r.recordType === recordType);
    }
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Get ANC records with specific typing
  getANCRecords(patientId: string): ANCRecord[] {
    return this.getRecords(patientId, 'anc') as ANCRecord[];
  }

  // Get vaccination records with specific typing
  getVaccinationRecords(patientId: string): VaccinationRecord[] {
    return this.getRecords(patientId, 'vaccination') as VaccinationRecord[];
  }

  // Get overdue vaccinations
  getOverdueVaccinations(patientId: string): VaccinationRecord[] {
    const vaccinations = this.getVaccinationRecords(patientId);
    return vaccinations.filter(v => v.status === 'overdue' || 
      (v.status === 'scheduled' && v.date < new Date()));
  }

  // Get upcoming ANC visits
  getUpcomingANCVisits(patientId: string): ANCRecord[] {
    const ancRecords = this.getANCRecords(patientId);
    return ancRecords.filter(a => a.nextVisitDate && a.nextVisitDate > new Date());
  }

  // Add new health record
  async addRecord(record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
    const newRecord: HealthRecord = {
      ...record,
      id: `${record.recordType}_${Date.now()}`
    };

    this.records.unshift(newRecord);
    return newRecord;
  }

  // Update record status
  async updateRecordStatus(recordId: string, status: HealthRecord['status'], notes?: string): Promise<void> {
    const index = this.records.findIndex(r => r.id === recordId);
    if (index !== -1) {
      this.records[index].status = status;
      if (notes) {
        this.records[index].notes = notes;
      }
    }
  }

  // Schedule next ANC visit
  async scheduleNextANCVisit(patientId: string, visitDate: Date): Promise<ANCRecord> {
    const existingANC = this.getANCRecords(patientId);
    const lastVisit = existingANC[0];
    
    const nextVisit: ANCRecord = {
      id: `anc_${Date.now()}`,
      patientId,
      patientName: lastVisit?.patientName || 'Patient',
      recordType: 'anc',
      date: visitDate,
      status: 'scheduled',
      visitNumber: (lastVisit?.visitNumber || 0) + 1,
      totalVisits: 4,
      gestationalAge: (lastVisit?.gestationalAge || 20) + 4
    };

    this.records.unshift(nextVisit);
    return nextVisit;
  }

  // Schedule vaccination
  async scheduleVaccination(
    patientId: string, 
    patientName: string, 
    vaccine: string, 
    dose: number, 
    totalDoses: number, 
    childAge: number,
    dueDate: Date
  ): Promise<VaccinationRecord> {
    const vaccination: VaccinationRecord = {
      id: `vac_${Date.now()}`,
      patientId,
      patientName,
      recordType: 'vaccination',
      date: dueDate,
      status: 'scheduled',
      vaccine,
      dose,
      totalDoses,
      childAge
    };

    this.records.unshift(vaccination);
    return vaccination;
  }

  // Get health summary for caregiver
  getHealthSummary(caregiverId: string): {
    totalRecords: number;
    overdueVaccinations: number;
    upcomingANC: number;
    completedANC: number;
    emergencyRecords: number;
    lastConsultation?: Date;
  } {
    // Get all records for caregiver's family
    const familyRecords = this.records.filter(r => 
      r.patientId === caregiverId || r.patientId.startsWith('child_')
    );

    const vaccinations = familyRecords.filter(r => r.recordType === 'vaccination') as VaccinationRecord[];
    const ancRecords = familyRecords.filter(r => r.recordType === 'anc') as ANCRecord[];
    const emergencies = familyRecords.filter(r => r.recordType === 'emergency');
    const consultations = familyRecords.filter(r => r.recordType === 'consultation');

    return {
      totalRecords: familyRecords.length,
      overdueVaccinations: vaccinations.filter(v => v.status === 'overdue').length,
      upcomingANC: ancRecords.filter(a => a.nextVisitDate && a.nextVisitDate > new Date()).length,
      completedANC: ancRecords.filter(a => a.status === 'completed').length,
      emergencyRecords: emergencies.length,
      lastConsultation: consultations.length > 0 ? consultations[0].date : undefined
    };
  }

  // Generate health report for export
  async generateHealthReport(patientId: string, format: 'pdf' | 'csv' = 'pdf'): Promise<string> {
    const records = this.getRecords(patientId);
    
    if (format === 'csv') {
      const headers = ['Date', 'Type', 'Status', 'Notes'];
      const rows = records.map(r => [
        r.date.toISOString(),
        r.recordType,
        r.status,
        r.notes || ''
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // For PDF, return a formatted string (in real app, generate actual PDF)
    return records.map(r => 
      `${r.date.toLocaleDateString()} - ${r.recordType.toUpperCase()} - ${r.status} - ${r.notes || ''}`
    ).join('\n');
  }

  // Sync with CHV dashboard
  async syncWithCHV(caregiverId: string): Promise<void> {
    // Mock sync with CHV dashboard
    console.log('Syncing health records with CHV for caregiver:', caregiverId);
    
    // In real implementation, this would:
    // 1. Send updated records to CHV dashboard
    // 2. Receive any new records from CHV
    // 3. Update local cache
    // 4. Trigger notifications for any changes
  }

  // Check for due services
  checkDueServices(patientId: string): {
    overdueVaccinations: VaccinationRecord[];
    upcomingANC: ANCRecord[];
    missedAppointments: HealthRecord[];
  } {
    const vaccinations = this.getVaccinationRecords(patientId);
    const ancRecords = this.getANCRecords(patientId);
    const allRecords = this.getRecords(patientId);

    return {
      overdueVaccinations: vaccinations.filter(v => 
        v.status === 'overdue' || (v.status === 'scheduled' && v.date < new Date())
      ),
      upcomingANC: ancRecords.filter(a => 
        a.nextVisitDate && a.nextVisitDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ),
      missedAppointments: allRecords.filter(r => r.status === 'missed')
    };
  }
}

export const healthRecordsService = new HealthRecordsService();
export type { HealthRecord, ANCRecord, VaccinationRecord, ConsultationRecord, EmergencyRecord };