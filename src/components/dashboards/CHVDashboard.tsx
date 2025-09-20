import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Modal } from '../common/Modal';
import { GovernanceSelector } from '../common/GovernanceSelector';
import { GPSLocationDisplay } from '../common/GPSLocationDisplay';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { EmptyState } from '../common/EmptyState';
import { governanceService, AdministrativeUnit } from '../../services/governanceService';
import { gpsService, GPSLocation } from '../../services/gpsService';
import { Home, Users, Baby, Heart, Car, AlertTriangle, MapPin, Calendar, Phone, Shield, Plus, Eye, Edit, ArrowLeft, Navigation, Clock, CheckCircle, XCircle, Star, Target, Activity, Thermometer, Droplets, Wind, Mountain, Sun, Cloud, Zap, FileText, Bell, Search, Filter, Download, Upload, RefreshCw, Settings, Info, FileWarning as Warning, X, Save, Trash2, UserPlus, BabyIcon, Stethoscope, Ambulance, Building, Globe } from 'lucide-react';

// Types
interface Household {
  id: string;
  name: string;
  headOfHousehold: {
    name: string;
    phone: string;
  };
  location: {
    village: string;
    gpsCoords: GPSLocation;
    governancePath: AdministrativeUnit[];
  };
  members: {
    total: number;
    adults: number;
    children: number;
    pregnantWomen: number;
    childrenUnder5: number;
    elderly: number;
    disabled: number;
    chronicIllness: number;
  };
  insurance: {
    type: 'SHA' | 'NHIF' | 'Mutuelle' | 'None' | 'Other';
    details?: string;
  };
  vulnerableGroups: string[];
  status: 'active' | 'priority' | 'inactive';
  lastVisit?: Date;
  nextVisit?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Mother {
  id: string;
  householdId: string;
  name: string;
  dateOfBirth: Date;
  phone?: string;
  gravida: number;
  para: number;
  lmp: Date;
  edd: Date;
  ancVisits: number;
  supplements: {
    iron: boolean;
    folate: boolean;
    calcium: boolean;
    other?: string;
  };
  birthPlan: {
    facility: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  dangerSigns: string[];
  status: 'active' | 'delivered' | 'referred';
  createdAt: Date;
}

interface Child {
  id: string;
  householdId: string;
  name: string;
  dateOfBirth: Date;
  sex: 'male' | 'female';
  birthWeight: number;
  immunizations: {
    vaccine: string;
    date: Date;
    status: 'given' | 'due' | 'overdue' | 'missed';
  }[];
  growthMonitoring: {
    date: Date;
    weight: number;
    muac: number;
    muacColor: 'green' | 'yellow' | 'red';
  }[];
  illnessHistory: {
    date: Date;
    illness: string;
    treatment: string;
    outcome: string;
  }[];
  status: 'healthy' | 'malnourished' | 'sick' | 'referred';
  createdAt: Date;
}

interface EnvironmentalHazard {
  id: string;
  type: 'flood' | 'drought' | 'storm' | 'landslide' | 'heatwave';
  location: GPSLocation;
  village: string;
  severity: 'low' | 'medium' | 'high';
  date: Date;
  impact: string[];
  description: string;
  reportedBy: string;
  status: 'active' | 'resolved' | 'monitoring';
  healthRisks: string[];
}

interface DiseaseCase {
  id: string;
  householdId: string;
  patientName: string;
  patientAge: number;
  symptoms: string[];
  disease: string;
  urgency: 'routine' | 'medium' | 'critical';
  status: 'reported' | 'investigating' | 'confirmed' | 'resolved';
  reportedAt: Date;
  location: GPSLocation;
  escalated: boolean;
}

export const CHVDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [households, setHouseholds] = useState<Household[]>([]);
  const [mothers, setMothers] = useState<Mother[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [hazards, setHazards] = useState<EnvironmentalHazard[]>([]);
  const [diseaseCases, setDiseaseCases] = useState<DiseaseCase[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form states
  const [householdForm, setHouseholdForm] = useState({
    name: '',
    headName: '',
    headPhone: '',
    village: '',
    governanceUnits: [] as string[],
    governancePath: [] as AdministrativeUnit[],
    gpsLocation: null as GPSLocation | null,
    totalMembers: 1,
    adults: 1,
    children: 0,
    pregnantWomen: 0,
    childrenUnder5: 0,
    elderly: 0,
    disabled: 0,
    chronicIllness: 0,
    insuranceType: 'None' as Household['insurance']['type'],
    insuranceDetails: '',
    vulnerableGroups: [] as string[],
    notes: ''
  });

  // Initialize mock data
  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      
      // Mock households
      const mockHouseholds: Household[] = [
        {
          id: generateHouseholdId('KE', ['KE-13', 'KE-13-09'], 1),
          name: 'Wanjiku Family',
          headOfHousehold: {
            name: 'Grace Wanjiku',
            phone: '+254712345678'
          },
          location: {
            village: 'Kiambu Village',
            gpsCoords: { lat: -1.1743, lng: 36.8356, timestamp: new Date() },
            governancePath: []
          },
          members: {
            total: 5,
            adults: 2,
            children: 3,
            pregnantWomen: 1,
            childrenUnder5: 2,
            elderly: 0,
            disabled: 0,
            chronicIllness: 0
          },
          insurance: { type: 'SHA' },
          vulnerableGroups: ['Pregnant woman', 'Children under 5'],
          status: 'priority',
          lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          nextVisit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        },
        {
          id: generateHouseholdId('KE', ['KE-13', 'KE-13-09'], 2),
          name: 'Mwangi Family',
          headOfHousehold: {
            name: 'John Mwangi',
            phone: '+254723456789'
          },
          location: {
            village: 'Kiambu Central',
            gpsCoords: { lat: -1.1700, lng: 36.8300, timestamp: new Date() },
            governancePath: []
          },
          members: {
            total: 4,
            adults: 2,
            children: 2,
            pregnantWomen: 0,
            childrenUnder5: 1,
            elderly: 1,
            disabled: 0,
            chronicIllness: 1
          },
          insurance: { type: 'NHIF' },
          vulnerableGroups: ['Elderly', 'Chronic illness'],
          status: 'active',
          lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      ];

      setHouseholds(mockHouseholds);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Generate household ID
  const generateHouseholdId = (countryCode: string, adminCodes: string[], sequentialNumber: number): string => {
    const adminPart = adminCodes.join('-');
    const seqPart = sequentialNumber.toString().padStart(4, '0');
    return `${countryCode}-${adminPart}-${seqPart}`;
  };

  // Calculate EDD from LMP
  const calculateEDD = (lmp: Date): Date => {
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280); // 40 weeks
    return edd;
  };

  // Handle household creation
  const handleCreateHousehold = async () => {
    if (!householdForm.name || !householdForm.headName || !householdForm.village) {
      addNotification({
        title: t('status.error'),
        message: language === 'sw' ? 'Jaza sehemu zote muhimu' : 'Fill all required fields',
        type: 'error',
        read: false
      });
      return;
    }

    try {
      const newHousehold: Household = {
        id: generateHouseholdId('KE', householdForm.governanceUnits, households.length + 1),
        name: householdForm.name,
        headOfHousehold: {
          name: householdForm.headName,
          phone: householdForm.headPhone
        },
        location: {
          village: householdForm.village,
          gpsCoords: householdForm.gpsLocation || { lat: 0, lng: 0, timestamp: new Date() },
          governancePath: householdForm.governancePath
        },
        members: {
          total: householdForm.totalMembers,
          adults: householdForm.adults,
          children: householdForm.children,
          pregnantWomen: householdForm.pregnantWomen,
          childrenUnder5: householdForm.childrenUnder5,
          elderly: householdForm.elderly,
          disabled: householdForm.disabled,
          chronicIllness: householdForm.chronicIllness
        },
        insurance: {
          type: householdForm.insuranceType,
          details: householdForm.insuranceDetails
        },
        vulnerableGroups: householdForm.vulnerableGroups,
        status: 'active',
        notes: householdForm.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setHouseholds(prev => [newHousehold, ...prev]);
      setActiveModal(null);
      resetHouseholdForm();

      addNotification({
        title: language === 'sw' ? 'Kaya Imeongezwa' : 'Household Added',
        message: language === 'sw' 
          ? `Kaya ya ${newHousehold.name} imeongezwa (ID: ${newHousehold.id})`
          : `${newHousehold.name} household added (ID: ${newHousehold.id})`,
        type: 'success',
        read: false
      });

    } catch (error) {
      console.error('Error creating household:', error);
      addNotification({
        title: t('status.error'),
        message: language === 'sw' ? 'Imeshindwa kuongeza kaya' : 'Failed to add household',
        type: 'error',
        read: false
      });
    }
  };

  const resetHouseholdForm = () => {
    setHouseholdForm({
      name: '',
      headName: '',
      headPhone: '',
      village: '',
      governanceUnits: [],
      governancePath: [],
      gpsLocation: null,
      totalMembers: 1,
      adults: 1,
      children: 0,
      pregnantWomen: 0,
      childrenUnder5: 0,
      elderly: 0,
      disabled: 0,
      chronicIllness: 0,
      insuranceType: 'None',
      insuranceDetails: '',
      vulnerableGroups: [],
      notes: ''
    });
  };

  // Filter households
  const filteredHouseholds = households.filter(household => {
    const matchesSearch = household.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         household.headOfHousehold.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         household.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || household.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Get priority households (those with due services)
  const getPriorityHouseholds = () => {
    return households.filter(h => 
      h.status === 'priority' || 
      h.members.pregnantWomen > 0 || 
      h.members.childrenUnder5 > 0 ||
      (h.nextVisit && h.nextVisit <= new Date())
    );
  };

  // CHV Overview Component
  const CHVOverview: React.FC = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{households.length}</div>
              <div className="text-sm text-gray-600">{language === 'sw' ? 'Kaya' : 'Households'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-pink-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {households.reduce((sum, h) => sum + h.members.pregnantWomen, 0)}
              </div>
              <div className="text-sm text-gray-600">{language === 'sw' ? 'Wajawazito' : 'Pregnant Women'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Baby className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {households.reduce((sum, h) => sum + h.members.childrenUnder5, 0)}
              </div>
              <div className="text-sm text-gray-600">{language === 'sw' ? 'Watoto <5' : 'Children <5'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{getPriorityHouseholds().length}</div>
              <div className="text-sm text-gray-600">{language === 'sw' ? 'Kipaumbele' : 'Priority'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.button
          onClick={() => setActiveModal('addHousehold')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="min-h-[140px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
        >
          <div className="text-5xl">🏡</div>
          <Home className="w-8 h-8" />
          <div className="text-center">
            <div className="text-xl font-bold">{language === 'sw' ? 'ONGEZA KAYA' : 'ADD HOUSEHOLD'}</div>
            <div className="text-sm opacity-90">{language === 'sw' ? 'Sajili kaya mpya' : 'Register new household'}</div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => setActiveModal('addMother')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="min-h-[140px] bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
        >
          <div className="text-5xl">🤰</div>
          <Heart className="w-8 h-8" />
          <div className="text-center">
            <div className="text-xl font-bold">{language === 'sw' ? 'ONGEZA MAMA' : 'ADD MOTHER'}</div>
            <div className="text-sm opacity-90">{language === 'sw' ? 'Sajili mjamzito' : 'Register pregnant woman'}</div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => setActiveModal('addChild')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="min-h-[140px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
        >
          <div className="text-5xl">👶</div>
          <Baby className="w-8 h-8" />
          <div className="text-center">
            <div className="text-xl font-bold">{language === 'sw' ? 'ONGEZA MTOTO' : 'ADD CHILD'}</div>
            <div className="text-sm opacity-90">{language === 'sw' ? 'Sajili mtoto' : 'Register child'}</div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => setActiveModal('requestTransport')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="min-h-[140px] bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
        >
          <div className="text-5xl">🚕</div>
          <Car className="w-8 h-8" />
          <div className="text-center">
            <div className="text-xl font-bold">{language === 'sw' ? 'OMBA USAFIRI' : 'REQUEST TRANSPORT'}</div>
            <div className="text-sm opacity-90">{language === 'sw' ? 'Usafiri wa afya' : 'Health transport'}</div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => setActiveModal('reportHazard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="min-h-[140px] bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
        >
          <div className="text-5xl">🌦️</div>
          <Cloud className="w-8 h-8" />
          <div className="text-center">
            <div className="text-xl font-bold">{language === 'sw' ? 'RIPOTI HATARI' : 'HAZARD REPORT'}</div>
            <div className="text-sm opacity-90">{language === 'sw' ? 'Mazingira hatari' : 'Environmental hazards'}</div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => setActiveModal('reportDisease')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="min-h-[140px] bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 flex flex-col items-center justify-center space-y-3"
        >
          <div className="text-5xl">🦠</div>
          <AlertTriangle className="w-8 h-8" />
          <div className="text-center">
            <div className="text-xl font-bold">{language === 'sw' ? 'RIPOTI UGONJWA' : 'DISEASE OUTBREAK'}</div>
            <div className="text-sm opacity-90">{language === 'sw' ? 'Mlipuko wa ugonjwa' : 'Disease outbreak'}</div>
          </div>
        </motion.button>
      </div>

      {/* Priority Households Alert */}
      {getPriorityHouseholds().length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-xl font-bold text-red-900">
                {language === 'sw' ? 'Kaya za Kipaumbele' : 'Priority Households'}
              </h3>
              <p className="text-red-700">
                {getPriorityHouseholds().length} {language === 'sw' ? 'kaya zinahitaji uangalizi' : 'households need attention'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/chv/households')}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-bold"
          >
            {language === 'sw' ? 'Ona Kaya za Kipaumbele' : 'View Priority Households'}
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <Activity className="w-6 h-6 text-purple-600" />
          <span>{language === 'sw' ? 'Shughuli za Hivi Karibuni' : 'Recent Activity'}</span>
        </h3>
        
        <div className="space-y-4">
          {households.slice(0, 3).map((household) => (
            <div key={household.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{household.name}</div>
                  <div className="text-sm text-gray-600">{household.location.village}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedHousehold(household);
                  setActiveModal('viewHousehold');
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {language === 'sw' ? 'Ona' : 'View'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Households List Component
  const HouseholdsList: React.FC = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/chv')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'sw' ? 'Rudi Muhtasari' : 'Back to Overview'}</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'sw' ? 'Tafuta kaya...' : 'Search households...'}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">{language === 'sw' ? 'Zote' : 'All'}</option>
            <option value="active">{language === 'sw' ? 'Hai' : 'Active'}</option>
            <option value="priority">{language === 'sw' ? 'Kipaumbele' : 'Priority'}</option>
            <option value="inactive">{language === 'sw' ? 'Zisizo hai' : 'Inactive'}</option>
          </select>
        </div>
      </div>

      {/* Households Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHouseholds.map((household) => (
          <motion.div
            key={household.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl shadow-lg border-2 p-6 hover:shadow-xl transition-all ${
              household.status === 'priority' ? 'border-red-300 bg-red-50' :
              household.status === 'active' ? 'border-green-300' : 'border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{household.name}</h3>
                <p className="text-sm text-gray-600">{household.id}</p>
                <p className="text-sm text-gray-600">{household.location.village}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                household.status === 'priority' ? 'bg-red-100 text-red-800' :
                household.status === 'active' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {household.status === 'priority' ? (language === 'sw' ? 'KIPAUMBELE' : 'PRIORITY') :
                 household.status === 'active' ? (language === 'sw' ? 'HAI' : 'ACTIVE') :
                 (language === 'sw' ? 'ZISIZO HAI' : 'INACTIVE')}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{language === 'sw' ? 'Wanakaya' : 'Members'}:</span>
                <span className="font-semibold">{household.members.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{language === 'sw' ? 'Wajawazito' : 'Pregnant'}:</span>
                <span className="font-semibold text-pink-600">{household.members.pregnantWomen}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{language === 'sw' ? 'Watoto <5' : 'Children <5'}:</span>
                <span className="font-semibold text-blue-600">{household.members.childrenUnder5}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{language === 'sw' ? 'Bima' : 'Insurance'}:</span>
                <span className="font-semibold">{household.insurance.type}</span>
              </div>
            </div>

            {household.nextVisit && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 text-sm font-medium">
                    {language === 'sw' ? 'Ziara ijayo' : 'Next visit'}: {household.nextVisit.toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedHousehold(household);
                  setActiveModal('viewHousehold');
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                {language === 'sw' ? 'Ona' : 'View'}
              </button>
              <button
                onClick={() => {
                  setSelectedHousehold(household);
                  setActiveModal('scheduleVisit');
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {language === 'sw' ? 'Panga Ziara' : 'Schedule Visit'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredHouseholds.length === 0 && (
        <EmptyState
          icon={Home}
          title={language === 'sw' ? 'Hakuna Kaya' : 'No Households'}
          description={language === 'sw' ? 'Ongeza kaya ya kwanza' : 'Add your first household'}
          actionLabel={language === 'sw' ? 'Ongeza Kaya' : 'Add Household'}
          onAction={() => setActiveModal('addHousehold')}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen dashboard-bg-chv">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya CHV' : 'CHV Dashboard'}
        subtitle={language === 'sw' ? 'Usimamizi wa afya ya jamii' : 'Community health management'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-green-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-6xl">❤️</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  {language === 'sw' ? '❤️ Dashibodi ya CHV' : '❤️ CHV Dashboard'}
                </h1>
                <p className="text-lg text-green-600 font-bold">
                  {language === 'sw' ? 'Usimamizi wa Afya ya Jamii' : 'Community Health Management'}
                </p>
              </div>
            </div>
            <div className="bg-green-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-green-800 font-semibold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </p>
              <p className="text-xs text-green-700">
                {user?.location} • CHV ID: {user?.id?.slice(-6)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<CHVOverview />} />
          <Route path="/households" element={<HouseholdsList />} />
        </Routes>
      </div>

      {/* Add Household Modal */}
      {activeModal === 'addHousehold' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🏡 Ongeza Kaya Mpya' : '🏡 Add New Household'}
          size="xl"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Jina la Kaya' : 'Household Name'} *
                </label>
                <input
                  type="text"
                  value={householdForm.name}
                  onChange={(e) => setHouseholdForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={language === 'sw' ? 'Familia ya Wanjiku' : 'Wanjiku Family'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Kijiji' : 'Village'} *
                </label>
                <input
                  type="text"
                  value={householdForm.village}
                  onChange={(e) => setHouseholdForm(prev => ({ ...prev, village: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={language === 'sw' ? 'Kiambu Village' : 'Kiambu Village'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Mkuu wa Kaya' : 'Head of Household'} *
                </label>
                <input
                  type="text"
                  value={householdForm.headName}
                  onChange={(e) => setHouseholdForm(prev => ({ ...prev, headName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={language === 'sw' ? 'Grace Wanjiku' : 'Grace Wanjiku'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={householdForm.headPhone}
                  onChange={(e) => setHouseholdForm(prev => ({ ...prev, headPhone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
            </div>

            {/* Governance Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Eneo la Utawala' : 'Administrative Location'} *
              </label>
              <GovernanceSelector
                selectedCountry="KE"
                selectedUnits={householdForm.governanceUnits}
                onSelectionChange={(units, path) => {
                  setHouseholdForm(prev => ({
                    ...prev,
                    governanceUnits: units,
                    governancePath: path
                  }));
                }}
                required={true}
              />
            </div>

            {/* GPS Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Mahali pa GPS' : 'GPS Location'}
              </label>
              <GPSLocationDisplay
                onLocationUpdate={(location) => {
                  setHouseholdForm(prev => ({ ...prev, gpsLocation: location }));
                }}
                autoUpdate={false}
              />
            </div>

            {/* Household Members */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-4">
                {language === 'sw' ? 'Wanakaya' : 'Household Members'}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {language === 'sw' ? 'Jumla' : 'Total'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={householdForm.totalMembers}
                    onChange={(e) => setHouseholdForm(prev => ({ ...prev, totalMembers: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {language === 'sw' ? 'Wazima' : 'Adults'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={householdForm.adults}
                    onChange={(e) => setHouseholdForm(prev => ({ ...prev, adults: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {language === 'sw' ? 'Watoto' : 'Children'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={householdForm.children}
                    onChange={(e) => setHouseholdForm(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {language === 'sw' ? 'Wajawazito' : 'Pregnant'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={householdForm.pregnantWomen}
                    onChange={(e) => setHouseholdForm(prev => ({ ...prev, pregnantWomen: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {language === 'sw' ? 'Watoto <5' : 'Under 5'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={householdForm.childrenUnder5}
                    onChange={(e) => setHouseholdForm(prev => ({ ...prev, childrenUnder5: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {language === 'sw' ? 'Wazee' : 'Elderly'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={householdForm.elderly}
                    onChange={(e) => setHouseholdForm(prev => ({ ...prev, elderly: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {language === 'sw' ? 'Walemavu' : 'Disabled'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={householdForm.disabled}
                    onChange={(e) => setHouseholdForm(prev => ({ ...prev, disabled: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {language === 'sw' ? 'Magonjwa' : 'Chronic Illness'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={householdForm.chronicIllness}
                    onChange={(e) => setHouseholdForm(prev => ({ ...prev, chronicIllness: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Aina ya Bima' : 'Insurance Type'}
              </label>
              <select
                value={householdForm.insuranceType}
                onChange={(e) => setHouseholdForm(prev => ({ ...prev, insuranceType: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="None">{language === 'sw' ? 'Hakuna' : 'None'}</option>
                <option value="SHA">SHA</option>
                <option value="NHIF">NHIF</option>
                <option value="Mutuelle">Mutuelle</option>
                <option value="Other">{language === 'sw' ? 'Nyingine' : 'Other'}</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Maelezo' : 'Notes'}
              </label>
              <textarea
                value={householdForm.notes}
                onChange={(e) => setHouseholdForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder={language === 'sw' ? 'Maelezo mengine...' : 'Additional notes...'}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={handleCreateHousehold}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                {language === 'sw' ? 'Ongeza Kaya' : 'Add Household'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Household Modal */}
      {activeModal === 'viewHousehold' && selectedHousehold && (
        <Modal
          isOpen={true}
          onClose={() => {
            setActiveModal(null);
            setSelectedHousehold(null);
          }}
          title={`🏡 ${selectedHousehold.name}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Household Header */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-green-900 mb-2">
                    {language === 'sw' ? 'Taarifa za Kaya' : 'Household Information'}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>ID:</strong> {selectedHousehold.id}</div>
                    <div><strong>{language === 'sw' ? 'Mkuu' : 'Head'}:</strong> {selectedHousehold.headOfHousehold.name}</div>
                    <div><strong>{language === 'sw' ? 'Simu' : 'Phone'}:</strong> {selectedHousehold.headOfHousehold.phone}</div>
                    <div><strong>{language === 'sw' ? 'Kijiji' : 'Village'}:</strong> {selectedHousehold.location.village}</div>
                    <div><strong>{language === 'sw' ? 'Bima' : 'Insurance'}:</strong> {selectedHousehold.insurance.type}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-2">
                    {language === 'sw' ? 'Wanakaya' : 'Members'}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>{language === 'sw' ? 'Jumla' : 'Total'}: <strong>{selectedHousehold.members.total}</strong></div>
                    <div>{language === 'sw' ? 'Wazima' : 'Adults'}: <strong>{selectedHousehold.members.adults}</strong></div>
                    <div>{language === 'sw' ? 'Watoto' : 'Children'}: <strong>{selectedHousehold.members.children}</strong></div>
                    <div>{language === 'sw' ? 'Wajawazito' : 'Pregnant'}: <strong className="text-pink-600">{selectedHousehold.members.pregnantWomen}</strong></div>
                    <div>{language === 'sw' ? 'Watoto <5' : 'Under 5'}: <strong className="text-blue-600">{selectedHousehold.members.childrenUnder5}</strong></div>
                    <div>{language === 'sw' ? 'Wazee' : 'Elderly'}: <strong>{selectedHousehold.members.elderly}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setActiveModal('addMother');
                  // Pre-fill household ID
                }}
                className="p-4 bg-pink-100 border border-pink-200 rounded-xl hover:bg-pink-200 transition-colors"
              >
                <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                <div className="text-pink-900 font-semibold">
                  {language === 'sw' ? 'Ongeza Mama' : 'Add Mother'}
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveModal('addChild');
                  // Pre-fill household ID
                }}
                className="p-4 bg-blue-100 border border-blue-200 rounded-xl hover:bg-blue-200 transition-colors"
              >
                <Baby className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-blue-900 font-semibold">
                  {language === 'sw' ? 'Ongeza Mtoto' : 'Add Child'}
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveModal('requestTransport');
                  // Pre-fill household data
                }}
                className="p-4 bg-orange-100 border border-orange-200 rounded-xl hover:bg-orange-200 transition-colors"
              >
                <Car className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-orange-900 font-semibold">
                  {language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}
                </div>
              </button>
            </div>

            {/* Visit History */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                {language === 'sw' ? 'Historia ya Ziara' : 'Visit History'}
              </h4>
              <div className="space-y-2">
                {selectedHousehold.lastVisit && (
                  <div className="flex justify-between text-sm">
                    <span>{language === 'sw' ? 'Ziara ya mwisho' : 'Last visit'}:</span>
                    <span className="font-semibold">{selectedHousehold.lastVisit.toLocaleDateString()}</span>
                  </div>
                )}
                {selectedHousehold.nextVisit && (
                  <div className="flex justify-between text-sm">
                    <span>{language === 'sw' ? 'Ziara ijayo' : 'Next visit'}:</span>
                    <span className="font-semibold text-blue-600">{selectedHousehold.nextVisit.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveModal('scheduleVisit')}
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'sw' ? 'Panga Ziara' : 'Schedule Visit'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Environmental Hazard Report Modal */}
      {activeModal === 'reportHazard' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🌦️ Ripoti ya Hatari za Mazingira' : '🌦️ Environmental Hazard Report'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600">
                {language === 'sw' 
                  ? 'Ripoti hatari za mazingira katika eneo lako'
                  : 'Report environmental hazards in your area'
                }
              </p>
            </div>

            {/* Hazard Type Selection */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'sw' ? 'Aina ya Hatari' : 'Hazard Type'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: 'flood', emoji: '🌊', name: language === 'sw' ? 'Mafuriko' : 'Flood', color: 'blue' },
                  { type: 'drought', emoji: '☀️', name: language === 'sw' ? 'Ukame' : 'Drought', color: 'yellow' },
                  { type: 'storm', emoji: '⛈️', name: language === 'sw' ? 'Dhoruba' : 'Storm', color: 'purple' },
                  { type: 'landslide', emoji: '🌋', name: language === 'sw' ? 'Mteremko' : 'Landslide', color: 'orange' },
                  { type: 'heatwave', emoji: '🔥', name: language === 'sw' ? 'Joto Kali' : 'Heatwave', color: 'red' }
                ].map((hazard) => (
                  <button
                    key={hazard.type}
                    className={`p-6 rounded-xl border-2 border-${hazard.color}-200 bg-${hazard.color}-50 hover:bg-${hazard.color}-100 transition-all text-center`}
                  >
                    <div className="text-4xl mb-2">{hazard.emoji}</div>
                    <div className={`font-semibold text-${hazard.color}-900`}>{hazard.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Selection */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'sw' ? 'Kiwango cha Hatari' : 'Severity Level'}
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { level: 'low', name: language === 'sw' ? 'Chini' : 'Low', color: 'green', emoji: '🟢' },
                  { level: 'medium', name: language === 'sw' ? 'Wastani' : 'Medium', color: 'yellow', emoji: '🟡' },
                  { level: 'high', name: language === 'sw' ? 'Juu' : 'High', color: 'red', emoji: '🔴' }
                ].map((severity) => (
                  <button
                    key={severity.level}
                    className={`p-4 rounded-xl border-2 border-${severity.color}-200 bg-${severity.color}-50 hover:bg-${severity.color}-100 transition-all text-center`}
                  >
                    <div className="text-3xl mb-2">{severity.emoji}</div>
                    <div className={`font-semibold text-${severity.color}-900`}>{severity.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location and Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Maelezo ya Hatari' : 'Hazard Description'}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={language === 'sw' ? 'Eleza hatari na athari zake...' : 'Describe the hazard and its impact...'}
                />
              </div>

              <GPSLocationDisplay
                onLocationUpdate={(location) => {
                  console.log('Hazard location:', location);
                }}
                autoUpdate={true}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  addNotification({
                    title: language === 'sw' ? 'Ripoti ya Hatari Imewasilishwa' : 'Hazard Report Submitted',
                    message: language === 'sw' ? 'Ripoti imewasilishwa kwa mamlaka' : 'Report submitted to authorities',
                    type: 'warning',
                    read: false
                  });
                  setActiveModal(null);
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
              >
                {language === 'sw' ? 'Wasilisha Ripoti' : 'Submit Report'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Disease Outbreak Report Modal */}
      {activeModal === 'reportDisease' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🦠 Ripoti ya Mlipuko wa Ugonjwa' : '🦠 Disease Outbreak Report'}
          size="lg"
        >
          <div className="space-y-6">
            {/* Disease Categories */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'sw' ? 'Aina ya Ugonjwa' : 'Disease Category'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { category: 'fever', name: language === 'sw' ? 'Homa' : 'Fever', emoji: '🌡️', urgency: 'medium' },
                  { category: 'diarrhea', name: language === 'sw' ? 'Kuhara' : 'Diarrhea', emoji: '💧', urgency: 'critical' },
                  { category: 'cough', name: language === 'sw' ? 'Kikohozi' : 'Cough', emoji: '😷', urgency: 'medium' },
                  { category: 'rash', name: language === 'sw' ? 'Upele' : 'Skin Rash', emoji: '🔴', urgency: 'routine' },
                  { category: 'bite', name: language === 'sw' ? 'Kuumwa na Mnyama' : 'Animal Bite', emoji: '🐕', urgency: 'critical' },
                  { category: 'other', name: language === 'sw' ? 'Nyingine' : 'Other', emoji: '🏥', urgency: 'routine' }
                ].map((disease) => (
                  <button
                    key={disease.category}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      disease.urgency === 'critical' ? 'border-red-200 bg-red-50 hover:bg-red-100' :
                      disease.urgency === 'medium' ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100' :
                      'border-green-200 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    <div className="text-3xl mb-2">{disease.emoji}</div>
                    <div className={`font-semibold ${
                      disease.urgency === 'critical' ? 'text-red-900' :
                      disease.urgency === 'medium' ? 'text-yellow-900' :
                      'text-green-900'
                    }`}>
                      {disease.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Household Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'sw' ? 'Chagua Kaya' : 'Select Household'}
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500">
                <option value="">{language === 'sw' ? 'Chagua kaya...' : 'Select household...'}</option>
                {households.map((household) => (
                  <option key={household.id} value={household.id}>
                    {household.name} - {household.location.village}
                  </option>
                ))}
              </select>
            </div>

            {/* Symptoms Checklist */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'sw' ? 'Dalili' : 'Symptoms'}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  language === 'sw' ? 'Homa' : 'Fever',
                  language === 'sw' ? 'Kikohozi' : 'Cough',
                  language === 'sw' ? 'Kuhara' : 'Diarrhea',
                  language === 'sw' ? 'Kutapika' : 'Vomiting',
                  language === 'sw' ? 'Maumivu ya kichwa' : 'Headache',
                  language === 'sw' ? 'Uchovu' : 'Fatigue',
                  language === 'sw' ? 'Upele' : 'Rash',
                  language === 'sw' ? 'Ugumu wa kupumua' : 'Difficulty breathing'
                ].map((symptom) => (
                  <label key={symptom} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  // Simulate disease reporting with escalation
                  addNotification({
                    title: language === 'sw' ? '🚨 Kesi ya Ugonjwa Imeripotiwa' : '🚨 Disease Case Reported',
                    message: language === 'sw' ? 'Kesi imewasilishwa kwa ufuatiliaji wa wilaya' : 'Case submitted to district surveillance',
                    type: 'warning',
                    read: false
                  });
                  setActiveModal(null);
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
              >
                {language === 'sw' ? 'Wasilisha Ripoti' : 'Submit Report'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Transport Request Modal */}
      <ServiceRequestModal
        isOpen={activeModal === 'requestTransport'}
        onClose={() => setActiveModal(null)}
        onRequest={(data) => {
          addNotification({
            title: language === 'sw' ? 'Ombi la Usafiri Limewasilishwa' : 'Transport Request Submitted',
            message: language === 'sw' ? 'Wasafiri wamearifu' : 'Riders have been notified',
            type: 'success',
            read: false
          });
          setActiveModal(null);
        }}
      />

      {/* Add Mother Modal */}
      {activeModal === 'addMother' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🤰 Sajili Mama Mjamzito' : '🤰 Register Pregnant Mother'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Jina Kamili' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                  placeholder={language === 'sw' ? 'Grace Wanjiku' : 'Grace Wanjiku'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Tarehe ya Kuzaliwa' : 'Date of Birth'} *
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Chagua Kaya' : 'Select Household'} *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500">
                  <option value="">{language === 'sw' ? 'Chagua kaya...' : 'Select household...'}</option>
                  {households.map((household) => (
                    <option key={household.id} value={household.id}>
                      {household.name} - {household.location.village}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gravida *
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para *
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Tarehe ya Mwisho ya Hedhi (LMP)' : 'Last Menstrual Period (LMP)'} *
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Tarehe ya Kujifungua (EDD)' : 'Expected Delivery Date (EDD)'}
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 bg-gray-100"
                  readOnly
                />
              </div>
            </div>

            {/* Birth Plan */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <h4 className="font-semibold text-pink-900 mb-4">
                {language === 'sw' ? 'Mpango wa Kujifungua' : 'Birth Plan'}
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'sw' ? 'Kituo cha Kujifungua' : 'Delivery Facility'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder={language === 'sw' ? 'Hospitali ya Kiambu' : 'Kiambu Hospital'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'sw' ? 'Mtu wa Kuwasiliana Dharura' : 'Emergency Contact'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder={language === 'sw' ? 'Jina la mtu wa kuwasiliana' : 'Emergency contact name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'sw' ? 'Nambari ya Dharura' : 'Emergency Phone'}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  addNotification({
                    title: language === 'sw' ? 'Mama Amesajiliwa' : 'Mother Registered',
                    message: language === 'sw' ? 'Mama mjamzito amesajiliwa kikamilifu' : 'Pregnant mother registered successfully',
                    type: 'success',
                    read: false
                  });
                  setActiveModal(null);
                }}
                className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-semibold"
              >
                {language === 'sw' ? 'Sajili Mama' : 'Register Mother'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Child Modal */}
      {activeModal === 'addChild' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '👶 Sajili Mtoto' : '👶 Register Child'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Jina la Mtoto' : 'Child Name'} *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder={language === 'sw' ? 'Baby Grace' : 'Baby Grace'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Tarehe ya Kuzaliwa' : 'Date of Birth'} *
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Jinsia' : 'Sex'} *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option value="">{language === 'sw' ? 'Chagua jinsia...' : 'Select sex...'}</option>
                  <option value="male">{language === 'sw' ? 'Mwanaume' : 'Male'}</option>
                  <option value="female">{language === 'sw' ? 'Mwanamke' : 'Female'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Uzito wa Kuzaliwa (kg)' : 'Birth Weight (kg)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="3.2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Chagua Kaya' : 'Select Household'} *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option value="">{language === 'sw' ? 'Chagua kaya...' : 'Select household...'}</option>
                  {households.map((household) => (
                    <option key={household.id} value={household.id}>
                      {household.name} - {household.location.village}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Immunization Schedule Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-3">
                {language === 'sw' ? 'Ratiba ya Chanjo' : 'Immunization Schedule'}
              </h4>
              <div className="text-sm text-blue-800">
                <p>{language === 'sw' ? 'Ratiba ya chanjo itatengenezwa kiotomatiki kulingana na tarehe ya kuzaliwa' : 'Immunization schedule will be auto-generated based on birth date'}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  addNotification({
                    title: language === 'sw' ? 'Mtoto Amesajiliwa' : 'Child Registered',
                    message: language === 'sw' ? 'Mtoto amesajiliwa na ratiba ya chanjo imetengenezwa' : 'Child registered and immunization schedule created',
                    type: 'success',
                    read: false
                  });
                  setActiveModal(null);
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                {language === 'sw' ? 'Sajili Mtoto' : 'Register Child'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};