import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { chvService, DiseaseCase, Household, Mother, Child } from '../../services/chvService';
import { 
  Activity, 
  AlertTriangle, 
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Stethoscope,
  Brain,
  Heart,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MapPin,
  Phone
} from 'lucide-react';

interface DiseaseOutbreakReportingProps {
  isOpen: boolean;
  onClose: () => void;
  onDiseaseReported: (diseaseCase: DiseaseCase) => void;
  households: Household[];
  mothers: Mother[];
  children: Child[];
}

export const DiseaseOutbreakReporting: React.FC<DiseaseOutbreakReportingProps> = ({
  isOpen,
  onClose,
  onDiseaseReported,
  households,
  mothers,
  children
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    householdId: '',
    patientType: '' as 'household_member' | 'mother' | 'child' | '',
    patientId: '',
    patientName: '',
    patientAge: '',
    patientSex: '' as 'male' | 'female' | '',
    disease: '',
    symptoms: [] as string[],
    onsetDate: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    status: 'suspected' as 'suspected' | 'probable' | 'confirmed',
    labTestRequested: false,
    labResults: '',
    treatment: '',
    isolation: false,
    contactTracing: false,
    contacts: [] as string[],
    outcome: '' as 'recovering' | 'recovered' | 'referred' | 'hospitalized' | 'died' | '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Disease categories with auto-escalation rules
  const diseaseCategories = {
    critical: {
      name: language === 'sw' ? 'Hatari Kubwa' : 'Critical',
      color: 'red',
      diseases: [
        { id: 'ebola', name: 'Ebola', symptoms: ['fever', 'bleeding', 'vomiting', 'diarrhea'] },
        { id: 'marburg', name: 'Marburg', symptoms: ['fever', 'bleeding', 'headache'] },
        { id: 'cholera', name: language === 'sw' ? 'Kipindupindu' : 'Cholera', symptoms: ['severe_diarrhea', 'vomiting', 'dehydration'] },
        { id: 'polio', name: 'Polio', symptoms: ['paralysis', 'fever', 'muscle_weakness'] },
        { id: 'measles', name: language === 'sw' ? 'Surua' : 'Measles', symptoms: ['fever', 'rash', 'cough', 'red_eyes'] },
        { id: 'meningitis', name: language === 'sw' ? 'Uvimbe wa ubongo' : 'Meningitis', symptoms: ['severe_headache', 'neck_stiffness', 'fever'] },
        { id: 'rabies', name: language === 'sw' ? 'Kichaa cha mbwa' : 'Rabies', symptoms: ['animal_bite', 'fever', 'confusion'] }
      ]
    },
    medium: {
      name: language === 'sw' ? 'Hatari ya Kati' : 'Medium',
      color: 'yellow',
      diseases: [
        { id: 'malaria', name: 'Malaria', symptoms: ['fever', 'headache', 'chills', 'vomiting'] },
        { id: 'pneumonia', name: language === 'sw' ? 'Nimonia' : 'Pneumonia', symptoms: ['cough', 'fever', 'difficulty_breathing'] },
        { id: 'typhoid', name: language === 'sw' ? 'Homa ya matumbo' : 'Typhoid', symptoms: ['fever', 'headache', 'abdominal_pain'] },
        { id: 'covid19', name: 'COVID-19', symptoms: ['fever', 'cough', 'difficulty_breathing', 'loss_of_taste'] },
        { id: 'diarrhea_cluster', name: language === 'sw' ? 'Kuhara kwa wingi' : 'Diarrhea Cluster', symptoms: ['diarrhea', 'vomiting', 'dehydration'] }
      ]
    },
    routine: {
      name: language === 'sw' ? 'Kawaida' : 'Routine',
      color: 'green',
      diseases: [
        { id: 'common_cold', name: language === 'sw' ? 'Mafua' : 'Common Cold', symptoms: ['cough', 'runny_nose', 'mild_fever'] },
        { id: 'skin_infection', name: language === 'sw' ? 'Maambukizi ya ngozi' : 'Skin Infection', symptoms: ['rash', 'itching', 'swelling'] },
        { id: 'conjunctivitis', name: language === 'sw' ? 'Uvimbe wa macho' : 'Conjunctivitis', symptoms: ['red_eyes', 'discharge', 'itching'] },
        { id: 'gastritis', name: language === 'sw' ? 'Maumivu ya tumbo' : 'Gastritis', symptoms: ['abdominal_pain', 'nausea', 'loss_of_appetite'] }
      ]
    }
  };

  const allSymptoms = [
    { id: 'fever', name: language === 'sw' ? 'Homa' : 'Fever', icon: Thermometer },
    { id: 'headache', name: language === 'sw' ? 'Maumivu ya kichwa' : 'Headache', icon: Brain },
    { id: 'cough', name: language === 'sw' ? 'Kikohozi' : 'Cough', icon: Wind },
    { id: 'difficulty_breathing', name: language === 'sw' ? 'Ugumu wa kupumua' : 'Difficulty breathing', icon: Wind },
    { id: 'diarrhea', name: language === 'sw' ? 'Kuhara' : 'Diarrhea', icon: Droplets },
    { id: 'vomiting', name: language === 'sw' ? 'Kutapika' : 'Vomiting', icon: Droplets },
    { id: 'rash', name: language === 'sw' ? 'Upele' : 'Rash', icon: Eye },
    { id: 'bleeding', name: language === 'sw' ? 'Kutokwa na damu' : 'Bleeding', icon: Droplets },
    { id: 'paralysis', name: language === 'sw' ? 'Kupooza' : 'Paralysis', icon: Activity },
    { id: 'neck_stiffness', name: language === 'sw' ? 'Ugumu wa shingo' : 'Neck stiffness', icon: Activity },
    { id: 'red_eyes', name: language === 'sw' ? 'Macho mekundu' : 'Red eyes', icon: Eye },
    { id: 'abdominal_pain', name: language === 'sw' ? 'Maumivu ya tumbo' : 'Abdominal pain', icon: Activity },
    { id: 'dehydration', name: language === 'sw' ? 'Upungufu wa maji' : 'Dehydration', icon: Droplets },
    { id: 'animal_bite', name: language === 'sw' ? 'Kuumwa na mnyama' : 'Animal bite', icon: AlertTriangle },
    { id: 'loss_of_taste', name: language === 'sw' ? 'Kupoteza ladha' : 'Loss of taste/smell', icon: Activity }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.householdId) {
      newErrors.householdId = language === 'sw' ? 'Chagua kaya' : 'Select household';
    }

    if (!formData.patientName.trim()) {
      newErrors.patientName = language === 'sw' ? 'Jina la mgonjwa linahitajika' : 'Patient name is required';
    }

    if (!formData.disease) {
      newErrors.disease = language === 'sw' ? 'Chagua ugonjwa' : 'Select disease';
    }

    if (formData.symptoms.length === 0) {
      newErrors.symptoms = language === 'sw' ? 'Chagua angalau dalili moja' : 'Select at least one symptom';
    }

    if (!formData.onsetDate) {
      newErrors.onsetDate = language === 'sw' ? 'Tarehe ya kuanza dalili inahitajika' : 'Symptom onset date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSymptomToggle = (symptomId: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(s => s !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  const handleContactAdd = () => {
    const contactName = prompt(language === 'sw' ? 'Jina la mtu aliyegusana na mgonjwa' : 'Name of person who had contact with patient');
    if (contactName && contactName.trim()) {
      setFormData(prev => ({
        ...prev,
        contacts: [...prev.contacts, contactName.trim()]
      }));
    }
  };

  const handleContactRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Determine severity based on disease category
      const diseaseCategory = Object.values(diseaseCategories).find(category =>
        category.diseases.some(d => d.id === formData.disease)
      );

      const autoSeverity = diseaseCategory?.name === 'Critical' ? 'critical' :
                          diseaseCategory?.name === 'Medium' ? 'high' : 'medium';

      const diseaseCaseData: Omit<DiseaseCase, 'id' | 'caseId' | 'reportedAt' | 'reportedBy'> = {
        householdId: formData.householdId,
        patientName: formData.patientName,
        patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
        patientSex: formData.patientSex || undefined,
        disease: formData.disease,
        symptoms: formData.symptoms,
        onsetDate: new Date(formData.onsetDate),
        severity: autoSeverity as any,
        status: formData.status,
        labTestRequested: formData.labTestRequested,
        labResults: formData.labResults || undefined,
        treatment: formData.treatment || undefined,
        isolation: formData.isolation,
        contactTracing: formData.contactTracing,
        contacts: formData.contacts,
        outcome: formData.outcome || undefined,
        location: {
          gpsCoords: null, // Will be set by service
          address: user?.location || 'Unknown location',
          administrativeUnits: user?.administrativeUnits || []
        },
        escalationLevel: diseaseCategory?.name === 'Critical' ? 'national' :
                        diseaseCategory?.name === 'Medium' ? 'district' : 'facility',
        notes: formData.notes || undefined
      };

      const diseaseCase = await chvService.reportDiseaseCase(diseaseCaseData, user!.id);
      onDiseaseReported(diseaseCase);

    } catch (error) {
      console.error('Error reporting disease case:', error);
      setErrors({ submit: language === 'sw' ? 'Imeshindwa kuripoti kesi ya ugonjwa' : 'Failed to report disease case' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  // Auto-determine severity based on selected disease
  const selectedDisease = Object.values(diseaseCategories)
    .flatMap(cat => cat.diseases)
    .find(d => d.id === formData.disease);

  const diseaseCategory = Object.entries(diseaseCategories)
    .find(([_, cat]) => cat.diseases.some(d => d.id === formData.disease))?.[1];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🦠 ${language === 'sw' ? 'Ripoti ya Mlipuko wa Ugonjwa' : 'Disease Outbreak Report'}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Critical Alert Banner */}
        {diseaseCategory?.name === 'Critical' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-600 text-white p-4 rounded-xl text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
              <h3 className="text-xl font-bold">
                {language === 'sw' ? '🚨 DHARURA YA UGONJWA' : '🚨 DISEASE EMERGENCY'}
              </h3>
            </div>
            <p className="text-red-100">
              {language === 'sw' 
                ? 'Ugonjwa huu ni wa hatari kubwa. Ripoti itapelekwa moja kwa moja kwa mamlaka za kitaifa.'
                : 'This disease is critically dangerous. Report will be escalated immediately to national authorities.'
              }
            </p>
          </motion.div>
        )}

        {/* Patient Selection */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>{language === 'sw' ? 'Chagua Mgonjwa' : 'Select Patient'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Kaya' : 'Household'} *
              </label>
              <select
                value={formData.householdId}
                onChange={(e) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    householdId: e.target.value,
                    patientId: '',
                    patientName: ''
                  }));
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  errors.householdId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{language === 'sw' ? 'Chagua kaya...' : 'Select household...'}</option>
                {households.map((household) => (
                  <option key={household.id} value={household.id}>
                    {household.headOfHousehold.name} - {household.householdId}
                  </option>
                ))}
              </select>
              {errors.householdId && (
                <p className="mt-1 text-sm text-red-600">{errors.householdId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Aina ya Mgonjwa' : 'Patient Type'}
              </label>
              <select
                value={formData.patientType}
                onChange={(e) => setFormData(prev => ({ ...prev, patientType: e.target.value as any, patientId: '', patientName: '' }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{language === 'sw' ? 'Chagua aina...' : 'Select type...'}</option>
                <option value="household_member">{language === 'sw' ? 'Mwanakaya' : 'Household Member'}</option>
                <option value="mother">{language === 'sw' ? 'Mama/Mjamzito' : 'Mother/Pregnant'}</option>
                <option value="child">{language === 'sw' ? 'Mtoto' : 'Child'}</option>
              </select>
            </div>
          </div>

          {/* Patient Name Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Jina la Mgonjwa' : 'Patient Name'} *
            </label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.patientName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={language === 'sw' ? 'Jina la mgonjwa' : 'Patient name'}
            />
            {errors.patientName && (
              <p className="mt-1 text-sm text-red-600">{errors.patientName}</p>
            )}
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Umri' : 'Age'}
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={formData.patientAge}
                onChange={(e) => setFormData(prev => ({ ...prev, patientAge: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'sw' ? 'Umri kwa miaka' : 'Age in years'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Jinsia' : 'Gender'}
              </label>
              <select
                value={formData.patientSex}
                onChange={(e) => setFormData(prev => ({ ...prev, patientSex: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{language === 'sw' ? 'Chagua jinsia...' : 'Select gender...'}</option>
                <option value="male">{language === 'sw' ? 'Mwanaume' : 'Male'}</option>
                <option value="female">{language === 'sw' ? 'Mwanamke' : 'Female'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Disease Selection */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span>{language === 'sw' ? 'Chagua Ugonjwa' : 'Select Disease'}</span>
          </h3>

          {Object.entries(diseaseCategories).map(([categoryKey, category]) => (
            <div key={categoryKey} className={`p-4 rounded-xl border-2 ${getCategoryColor(categoryKey)}`}>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${
                  category.color === 'red' ? 'bg-red-500' :
                  category.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span>{category.name}</span>
                {categoryKey === 'critical' && <span className="text-red-600 animate-pulse">🚨</span>}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.diseases.map((disease) => (
                  <button
                    key={disease.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        disease: disease.id,
                        symptoms: disease.symptoms // Auto-select common symptoms
                      }));
                    }}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.disease === disease.id
                        ? `border-${category.color}-500 bg-${category.color}-100`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {formData.disease === disease.id && (
                        <CheckCircle className={`w-4 h-4 text-${category.color}-600`} />
                      )}
                      <span className="font-medium text-sm">{disease.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {errors.disease && (
            <p className="text-sm text-red-600">{errors.disease}</p>
          )}
        </div>

        {/* Symptoms Checklist */}
        <div className="bg-purple-50 p-4 rounded-xl">
          <h3 className="font-bold text-purple-900 mb-4 flex items-center space-x-2">
            <Stethoscope className="w-5 h-5" />
            <span>{language === 'sw' ? 'Dalili za Ugonjwa' : 'Disease Symptoms'}</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allSymptoms.map((symptom) => (
              <button
                key={symptom.id}
                type="button"
                onClick={() => handleSymptomToggle(symptom.id)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  formData.symptoms.includes(symptom.id)
                    ? 'border-purple-500 bg-purple-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <symptom.icon className={`w-5 h-5 mx-auto mb-2 ${
                  formData.symptoms.includes(symptom.id) ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <span className="font-medium text-xs">{symptom.name}</span>
                {formData.symptoms.includes(symptom.id) && (
                  <CheckCircle className="w-4 h-4 text-purple-600 mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
          {errors.symptoms && (
            <p className="mt-2 text-sm text-red-600">{errors.symptoms}</p>
          )}
        </div>

        {/* Case Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Tarehe ya Kuanza Dalili' : 'Symptom Onset Date'} *
            </label>
            <input
              type="date"
              value={formData.onsetDate}
              onChange={(e) => setFormData(prev => ({ ...prev, onsetDate: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.onsetDate ? 'border-red-500' : 'border-gray-300'
              }`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.onsetDate && (
              <p className="mt-1 text-sm text-red-600">{errors.onsetDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Hali ya Kesi' : 'Case Status'}
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="suspected">{language === 'sw' ? 'Inashukiwa' : 'Suspected'}</option>
              <option value="probable">{language === 'sw' ? 'Inawezekana' : 'Probable'}</option>
              <option value="confirmed">{language === 'sw' ? 'Imethibitishwa' : 'Confirmed'}</option>
            </select>
          </div>
        </div>

        {/* Lab Testing */}
        <div className="bg-green-50 p-4 rounded-xl">
          <h3 className="font-bold text-green-900 mb-4">
            {language === 'sw' ? 'Uchunguzi wa Maabara' : 'Laboratory Testing'}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="labTest"
                checked={formData.labTestRequested}
                onChange={(e) => setFormData(prev => ({ ...prev, labTestRequested: e.target.checked }))}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="labTest" className="font-medium text-gray-900">
                {language === 'sw' ? 'Uchunguzi wa maabara umeombwa' : 'Laboratory test requested'}
              </label>
            </div>

            {formData.labTestRequested && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Matokeo ya Maabara' : 'Lab Results'}
                </label>
                <textarea
                  value={formData.labResults}
                  onChange={(e) => setFormData(prev => ({ ...prev, labResults: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={language === 'sw' ? 'Matokeo ya uchunguzi...' : 'Test results...'}
                />
              </div>
            )}
          </div>
        </div>

        {/* Treatment and Isolation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'sw' ? 'Matibabu Yaliyotolewa' : 'Treatment Given'}
            </label>
            <textarea
              value={formData.treatment}
              onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder={language === 'sw' ? 'Dawa au matibabu yaliyotolewa...' : 'Medications or treatments given...'}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isolation"
                checked={formData.isolation}
                onChange={(e) => setFormData(prev => ({ ...prev, isolation: e.target.checked }))}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="isolation" className="font-medium text-gray-900">
                {language === 'sw' ? 'Mgonjwa ametenga' : 'Patient isolated'}
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="contactTracing"
                checked={formData.contactTracing}
                onChange={(e) => setFormData(prev => ({ ...prev, contactTracing: e.target.checked }))}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="contactTracing" className="font-medium text-gray-900">
                {language === 'sw' ? 'Ufuatiliaji wa waliogusana' : 'Contact tracing initiated'}
              </label>
            </div>
          </div>
        </div>

        {/* Contact Tracing */}
        {formData.contactTracing && (
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-4">
              {language === 'sw' ? 'Watu Waliogusana' : 'Contact List'}
            </h3>

            <div className="space-y-2">
              {formData.contacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span className="font-medium">{contact}</span>
                  <button
                    type="button"
                    onClick={() => handleContactRemove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleContactAdd}
                className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 transition-colors text-blue-600 font-medium"
              >
                + {language === 'sw' ? 'Ongeza Mtu Aliyegusana' : 'Add Contact'}
              </button>
            </div>
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'sw' ? 'Maelezo ya Ziada' : 'Additional Notes'}
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'sw' ? 'Maelezo mengine muhimu...' : 'Any other important information...'}
          />
        </div>

        {/* Auto-Escalation Info */}
        {diseaseCategory && (
          <div className={`p-4 rounded-xl border-2 ${
            diseaseCategory.name === 'Critical' ? 'border-red-500 bg-red-50' :
            diseaseCategory.name === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
            'border-green-500 bg-green-50'
          }`}>
            <h4 className="font-semibold mb-2">
              {language === 'sw' ? 'Mchakato wa Kiotomatiki' : 'Auto-Escalation Process'}
            </h4>
            <p className="text-sm">
              {diseaseCategory.name === 'Critical' 
                ? (language === 'sw' 
                    ? '🚨 Ripoti hii itapelekwa moja kwa moja kwa: Kituo cha Afya → Wilaya → Kitaifa'
                    : '🚨 This report will be escalated immediately to: Health Facility → District → National')
                : diseaseCategory.name === 'Medium'
                ? (language === 'sw'
                    ? '⚠️ Ripoti hii itapelekwa kwa: Kituo cha Afya → Wilaya'
                    : '⚠️ This report will be escalated to: Health Facility → District')
                : (language === 'sw'
                    ? 'ℹ️ Ripoti hii itahifadhiwa katika kituo cha afya'
                    : 'ℹ️ This report will be stored at the health facility')
              }
            </p>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {language === 'sw' ? 'Ghairi' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 min-h-[48px] px-6 py-3 rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
              diseaseCategory?.name === 'Critical' 
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'sw' ? 'Inaripoti...' : 'Reporting...'}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>
                  {diseaseCategory?.name === 'Critical' 
                    ? (language === 'sw' ? 'RIPOTI DHARURA' : 'REPORT EMERGENCY')
                    : (language === 'sw' ? 'Ripoti Kesi' : 'Report Case')
                  }
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};