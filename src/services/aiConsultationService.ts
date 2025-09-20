interface ConsultationRequest {
  id: string;
  caregiverId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  previousConditions?: string[];
  currentMedications?: string[];
  allergies?: string[];
  isPregnant?: boolean;
  gestationalAge?: number;
  isChild?: boolean;
  childAge?: number;
  timestamp: Date;
}

interface ConsultationResponse {
  id: string;
  requestId: string;
  assessment: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    urgency: number; // 1-10 scale
    possibleConditions: string[];
    recommendations: string[];
    homeCareTips: string[];
    warningSignsToWatch: string[];
    whenToSeekHelp: string[];
  };
  referralNeeded: boolean;
  referralType?: 'chv' | 'health_center' | 'hospital' | 'emergency';
  followUpRequired: boolean;
  followUpDays?: number;
  educationalContent?: string;
  timestamp: Date;
}

interface MCHGuidance {
  ancReminders: string[];
  vaccinationAlerts: string[];
  nutritionAdvice: string[];
  dangerSigns: string[];
  emergencyContacts: string[];
}

class AIConsultationService {
  private consultationHistory: ConsultationRequest[] = [];
  private responses: ConsultationResponse[] = [];

  // Contextualized AI consultation for caregivers
  async requestConsultation(request: Omit<ConsultationRequest, 'id' | 'timestamp'>): Promise<ConsultationResponse> {
    const consultationRequest: ConsultationRequest = {
      ...request,
      id: `consult_${Date.now()}`,
      timestamp: new Date()
    };

    this.consultationHistory.unshift(consultationRequest);

    // Generate AI response based on caregiver context
    const response = await this.generateContextualResponse(consultationRequest);
    this.responses.unshift(response);

    return response;
  }

  private async generateContextualResponse(request: ConsultationRequest): Promise<ConsultationResponse> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const symptoms = request.symptoms.join(', ').toLowerCase();
    let assessment = this.assessSymptoms(symptoms, request);
    
    // Enhance assessment based on patient context
    if (request.isPregnant) {
      assessment = this.enhanceForPregnancy(assessment, request);
    }
    
    if (request.isChild) {
      assessment = this.enhanceForChild(assessment, request);
    }

    const response: ConsultationResponse = {
      id: `response_${Date.now()}`,
      requestId: request.id,
      assessment,
      referralNeeded: assessment.riskLevel === 'high' || assessment.riskLevel === 'critical',
      referralType: this.determineReferralType(assessment.riskLevel, request),
      followUpRequired: assessment.riskLevel !== 'low',
      followUpDays: assessment.riskLevel === 'high' ? 1 : assessment.riskLevel === 'medium' ? 3 : 7,
      educationalContent: this.generateEducationalContent(symptoms, request),
      timestamp: new Date()
    };

    return response;
  }

  private assessSymptoms(symptoms: string, request: ConsultationRequest): ConsultationResponse['assessment'] {
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let urgency = 2;
    let possibleConditions: string[] = [];
    let recommendations: string[] = [];
    let homeCareTips: string[] = [];
    let warningSignsToWatch: string[] = [];
    let whenToSeekHelp: string[] = [];

    // Critical symptoms
    if (/difficulty breathing|chest pain|severe bleeding|unconscious|seizure|convulsion/i.test(symptoms)) {
      riskLevel = 'critical';
      urgency = 9;
      possibleConditions = ['Medical Emergency'];
      recommendations = ['Seek immediate emergency care', 'Call emergency services', 'Do not delay'];
      whenToSeekHelp = ['Immediately - this is a medical emergency'];
      return { riskLevel, urgency, possibleConditions, recommendations, homeCareTips, warningSignsToWatch, whenToSeekHelp };
    }

    // High risk symptoms
    if (/high fever|severe pain|persistent vomiting|severe diarrhea|bleeding/i.test(symptoms)) {
      riskLevel = 'high';
      urgency = 7;
    }

    // Medium risk symptoms
    if (/fever|headache|cough|vomiting|diarrhea|pain/i.test(symptoms)) {
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
      urgency = Math.max(urgency, 5);
    }

    // Specific condition assessment
    if (/fever.*headache|headache.*fever/i.test(symptoms)) {
      possibleConditions.push('Malaria', 'Viral infection', 'Typhoid');
      recommendations.push('Get malaria test', 'Take paracetamol for fever', 'Stay hydrated');
      homeCareTips.push('Rest in cool environment', 'Use ORS if vomiting', 'Monitor temperature');
      warningSignsToWatch.push('Worsening fever', 'Severe headache', 'Confusion');
      whenToSeekHelp.push('If fever persists for more than 2 days', 'If unable to keep fluids down');
    }

    if (/cough/i.test(symptoms)) {
      possibleConditions.push('Common cold', 'Bronchitis', 'Pneumonia');
      recommendations.push('Rest and fluids', 'Honey for throat soothing', 'Steam inhalation');
      homeCareTips.push('Drink warm liquids', 'Avoid cold drinks', 'Sleep with head elevated');
      warningSignsToWatch.push('Difficulty breathing', 'Blood in cough', 'High fever');
      whenToSeekHelp.push('If cough persists for more than a week', 'If breathing becomes difficult');
    }

    if (/diarrhea|vomiting/i.test(symptoms)) {
      possibleConditions.push('Gastroenteritis', 'Food poisoning', 'Dehydration');
      recommendations.push('Use ORS solution', 'Continue eating bland foods', 'Avoid dairy temporarily');
      homeCareTips.push('Small frequent sips of ORS', 'BRAT diet (banana, rice, apple, toast)', 'Monitor for dehydration');
      warningSignsToWatch.push('Signs of severe dehydration', 'Blood in stool', 'Severe abdominal pain');
      whenToSeekHelp.push('If symptoms persist for more than 2 days', 'If signs of dehydration appear');
    }

    // Default recommendations if none matched
    if (recommendations.length === 0) {
      recommendations = ['Rest and monitor symptoms', 'Stay hydrated', 'Take paracetamol for pain/fever if needed'];
      homeCareTips = ['Get adequate rest', 'Drink plenty of fluids', 'Eat nutritious foods'];
      whenToSeekHelp = ['If symptoms worsen', 'If no improvement in 2-3 days'];
    }

    return {
      riskLevel,
      urgency,
      possibleConditions,
      recommendations,
      homeCareTips,
      warningSignsToWatch,
      whenToSeekHelp
    };
  }

  private enhanceForPregnancy(assessment: ConsultationResponse['assessment'], request: ConsultationRequest): ConsultationResponse['assessment'] {
    // Pregnancy-specific enhancements
    assessment.warningSignsToWatch.push(
      'Severe abdominal pain',
      'Vaginal bleeding',
      'Severe headache with vision changes',
      'Reduced fetal movements'
    );

    assessment.whenToSeekHelp.unshift('Any concerning symptoms during pregnancy should be evaluated promptly');

    if (request.gestationalAge && request.gestationalAge > 20) {
      assessment.recommendations.unshift('Monitor fetal movements daily');
    }

    return assessment;
  }

  private enhanceForChild(assessment: ConsultationResponse['assessment'], request: ConsultationRequest): ConsultationResponse['assessment'] {
    // Child-specific enhancements
    assessment.warningSignsToWatch.push(
      'Difficulty breathing',
      'Unusual drowsiness',
      'Refusing to feed/drink',
      'High fever in infants under 3 months'
    );

    if (request.childAge && request.childAge < 12) {
      assessment.urgency = Math.min(10, assessment.urgency + 1); // Children need more urgent care
      assessment.whenToSeekHelp.unshift('Children can deteriorate quickly - seek care early');
    }

    return assessment;
  }

  private determineReferralType(riskLevel: string, request: ConsultationRequest): 'chv' | 'health_center' | 'hospital' | 'emergency' {
    if (riskLevel === 'critical') return 'emergency';
    if (riskLevel === 'high') return 'hospital';
    if (riskLevel === 'medium') return 'health_center';
    return 'chv';
  }

  private generateEducationalContent(symptoms: string, request: ConsultationRequest): string {
    // Generate relevant educational content based on symptoms and context
    if (request.isPregnant) {
      return 'During pregnancy, it\'s important to attend all ANC visits, eat nutritious foods, and report any concerning symptoms immediately.';
    }

    if (request.isChild) {
      return 'Children need regular health check-ups and vaccinations. Watch for danger signs and seek care early when concerned.';
    }

    return 'Maintain good hygiene, eat balanced meals, and don\'t hesitate to seek professional medical care when needed.';
  }

  // Get MCH-specific guidance for caregivers
  getMCHGuidance(caregiverId: string, isPregnant: boolean = false, hasChildren: boolean = false): MCHGuidance {
    const guidance: MCHGuidance = {
      ancReminders: [],
      vaccinationAlerts: [],
      nutritionAdvice: [],
      dangerSigns: [],
      emergencyContacts: []
    };

    if (isPregnant) {
      guidance.ancReminders = [
        'Schedule ANC visit every 4 weeks until 28 weeks',
        'Take iron and folic acid supplements daily',
        'Monitor fetal movements after 20 weeks',
        'Prepare birth plan and emergency transport'
      ];

      guidance.dangerSigns = [
        'Severe headache with vision changes',
        'Vaginal bleeding',
        'Severe abdominal pain',
        'Reduced or no fetal movements',
        'Persistent vomiting',
        'Signs of labor before 37 weeks'
      ];

      guidance.nutritionAdvice = [
        'Eat iron-rich foods (meat, beans, leafy greens)',
        'Take folic acid to prevent birth defects',
        'Avoid alcohol and smoking',
        'Eat small frequent meals if nauseous'
      ];
    }

    if (hasChildren) {
      guidance.vaccinationAlerts = [
        'BCG vaccine at birth',
        'Polio and DPT series starting at 6 weeks',
        'Measles vaccine at 9 months',
        'Follow national immunization schedule'
      ];

      guidance.dangerSigns = [
        'Difficulty breathing or fast breathing',
        'High fever (especially in infants under 3 months)',
        'Refusing to feed or drink',
        'Unusual drowsiness or difficulty waking',
        'Persistent vomiting or diarrhea',
        'Signs of dehydration'
      ];

      guidance.nutritionAdvice = [
        'Exclusive breastfeeding for first 6 months',
        'Introduce complementary foods at 6 months',
        'Continue breastfeeding up to 2 years',
        'Ensure adequate protein and vitamins'
      ];
    }

    guidance.emergencyContacts = [
      'Emergency Services: 999',
      'Nearest Health Facility: +254-XXX-XXXX',
      'CHV Contact: +254-XXX-XXXY',
      'ParaBoda Emergency Transport: *247#'
    ];

    return guidance;
  }

  // Get consultation history for caregiver
  getConsultationHistory(caregiverId: string): ConsultationRequest[] {
    return this.consultationHistory
      .filter(c => c.caregiverId === caregiverId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get AI response for consultation
  getConsultationResponse(requestId: string): ConsultationResponse | null {
    return this.responses.find(r => r.requestId === requestId) || null;
  }

  // Schedule follow-up consultation
  async scheduleFollowUp(originalRequestId: string, followUpDays: number): Promise<void> {
    const originalRequest = this.consultationHistory.find(c => c.id === originalRequestId);
    if (!originalRequest) return;

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + followUpDays);

    // In real implementation, this would:
    // 1. Create calendar reminder
    // 2. Send notification to caregiver
    // 3. Alert CHV if needed
    // 4. Update health records

    console.log(`Follow-up scheduled for ${followUpDate.toLocaleDateString()}`);
  }

  // Generate health education based on consultation
  generateHealthEducation(symptoms: string[], patientContext: any): string {
    // Generate relevant health education content
    const education = [];

    if (symptoms.some(s => s.includes('fever'))) {
      education.push('Fever Management: Use paracetamol, increase fluids, rest in cool environment');
    }

    if (symptoms.some(s => s.includes('cough'))) {
      education.push('Cough Care: Honey for soothing, warm liquids, avoid irritants');
    }

    if (patientContext.isPregnant) {
      education.push('Pregnancy Care: Attend all ANC visits, take supplements, monitor fetal movements');
    }

    if (patientContext.isChild) {
      education.push('Child Care: Ensure vaccinations are up to date, watch for danger signs, maintain nutrition');
    }

    return education.join('\n\n');
  }

  // Integration with health records
  async syncWithHealthRecords(caregiverId: string): Promise<void> {
    // Sync consultation data with health records service
    const consultations = this.getConsultationHistory(caregiverId);
    
    // In real implementation:
    // 1. Update health records with consultation data
    // 2. Flag any concerning patterns
    // 3. Alert CHV if needed
    // 4. Update care plans

    console.log(`Syncing ${consultations.length} consultations with health records`);
  }
}

export const aiConsultationService = new AIConsultationService();
export type { ConsultationRequest, ConsultationResponse, MCHGuidance };