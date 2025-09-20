import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { StatsCard } from '../common/StatsCard';
import { Modal } from '../common/Modal';
import { QRScanner } from '../common/QRScanner';
import { 
  Stethoscope, 
  Users, 
  Baby,
  Syringe,
  FileText,
  QrCode,
  Plus,
  Eye,
  Edit,
  Calendar,
  Activity,
  TrendingUp,
  Heart,
  Shield,
  Award,
  Target,
  Clock,
  User,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Search,
  Download,
  Upload,
  Bell,
  Settings,
  BarChart3
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  phone?: string;
  conditions: string[];
  lastVisit?: Date;
  nextAppointment?: Date;
  vaccinations: {
    vaccine: string;
    date: Date;
    nextDue?: Date;
  }[];
}

interface VaccineInventory {
  id: string;
  name: string;
  stock: number;
  expiryDate: Date;
  batchNumber: string;
  manufacturer: string;
}

export const HealthWorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification } = useData();
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vaccineInventory, setVaccineInventory] = useState<VaccineInventory[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize mock data
  useEffect(() => {
    setPatients([
      {
        id: 'patient_001',
        name: 'Grace Wanjiku',
        age: 28,
        gender: 'female',
        location: 'Kiambu Village',
        phone: '+254712345678',
        conditions: ['Pregnancy - 24 weeks'],
        lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        vaccinations: [
          { vaccine: 'Tetanus', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        id: 'patient_002',
        name: 'Baby Michael',
        age: 0,
        gender: 'male',
        location: 'Nakuru Town',
        conditions: ['Routine vaccination'],
        lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        nextAppointment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        vaccinations: [
          { vaccine: 'BCG', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
          { vaccine: 'Polio 1', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), nextDue: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
        ]
      }
    ]);

    setVaccineInventory([
      {
        id: 'vac_001',
        name: 'BCG',
        stock: 45,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        batchNumber: 'BCG2024001',
        manufacturer: 'Serum Institute'
      },
      {
        id: 'vac_002',
        name: 'Polio (OPV)',
        stock: 32,
        expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        batchNumber: 'OPV2024002',
        manufacturer: 'Sanofi'
      },
      {
        id: 'vac_003',
        name: 'Measles',
        stock: 28,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        batchNumber: 'MV2024003',
        manufacturer: 'Merck'
      },
      {
        id: 'vac_004',
        name: 'DPT',
        stock: 15,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        batchNumber: 'DPT2024004',
        manufacturer: 'GSK'
      }
    ]);
  }, []);

  const handleQRScan = (qrData: string) => {
    try {
      const data = JSON.parse(qrData);
      if (data.type === 'paraboda_user') {
        // Auto-populate patient data from QR scan
        const existingPatient = patients.find(p => p.name === data.name);
        if (existingPatient) {
          setSelectedPatient(existingPatient);
          setActiveModal('viewPatient');
        } else {
          // Create new patient from QR data
          const newPatient: Patient = {
            id: `patient_${Date.now()}`,
            name: data.name,
            age: data.age || 25,
            gender: data.gender || 'female',
            location: data.location || '',
            phone: data.phone,
            conditions: [],
            vaccinations: []
          };
          setPatients(prev => [newPatient, ...prev]);
          setSelectedPatient(newPatient);
          setActiveModal('viewPatient');
        }
        
        addNotification({
          title: language === 'sw' ? 'QR Code Imesomwa' : 'QR Code Scanned',
          message: language === 'sw' ? `Mgonjwa ${data.name} amepatikana` : `Patient ${data.name} found`,
          type: 'success',
          read: false
        });
      }
    } catch (error) {
      addNotification({
        title: language === 'sw' ? 'Hitilafu ya QR' : 'QR Error',
        message: language === 'sw' ? 'QR code haiwezi kusomwa' : 'Unable to read QR code',
        type: 'error',
        read: false
      });
    }
    setShowQRScanner(false);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVaccineStockColor = (stock: number) => {
    if (stock < 10) return 'text-red-600 bg-red-100';
    if (stock < 20) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="min-h-screen dashboard-bg-health">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya Mfanyakazi wa Afya' : 'Health Worker Dashboard'}
        subtitle={language === 'sw' ? 'Huduma za kimatibabu' : 'Medical services'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-purple-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-6xl">🩺</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  {language === 'sw' ? '🩺 Dashibodi ya Mfanyakazi wa Afya' : '🩺 Health Worker Dashboard'}
                </h1>
                <p className="text-lg text-purple-600 font-bold">
                  {language === 'sw' ? 'Huduma za Kimatibabu' : 'Medical Services'}
                </p>
              </div>
            </div>
            <div className="bg-purple-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-purple-800 font-semibold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </p>
              <p className="text-xs text-purple-700">
                {user?.location} • {language === 'sw' ? 'Mfanyakazi ID' : 'Worker ID'}: {user?.id?.slice(-6)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Activity className="w-8 h-8 text-purple-500" />
            <span>{language === 'sw' ? 'Muhtasari wa Kazi' : 'Work Overview'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title={language === 'sw' ? 'Wagonjwa' : 'Patients'}
              value={patients.length.toString()}
              change={`${patients.filter(p => p.nextAppointment && p.nextAppointment > new Date()).length} upcoming`}
              changeType="neutral"
              icon={Users}
              color="purple"
            />
            <StatsCard
              title={language === 'sw' ? 'Chanjo Zilizotolewa' : 'Vaccines Given'}
              value="156"
              change="+12 this week"
              changeType="positive"
              icon={Syringe}
              color="green"
            />
            <StatsCard
              title={language === 'sw' ? 'Hifadhi ya Chanjo' : 'Vaccine Stock'}
              value={vaccineInventory.reduce((sum, v) => sum + v.stock, 0).toString()}
              change={`${vaccineInventory.filter(v => v.stock < 20).length} low stock`}
              changeType="neutral"
              icon={Shield}
              color="blue"
            />
            <StatsCard
              title={language === 'sw' ? 'Wajawazito' : 'Pregnant Women'}
              value={patients.filter(p => p.conditions.some(c => c.includes('Pregnancy'))).length.toString()}
              change="Under care"
              changeType="neutral"
              icon={Heart}
              color="pink"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Target className="w-8 h-8 text-purple-500" />
            <span>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => setShowQRScanner(true)}
              className="min-h-[120px] bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <div className="text-5xl">📱</div>
              <QrCode className="w-8 h-8" />
              <div className="text-center">
                <div className="text-xl font-bold">
                  {language === 'sw' ? 'SKANI QR' : 'SCAN QR'}
                </div>
                <div className="text-sm opacity-90">
                  {language === 'sw' ? 'Tambua mgonjwa' : 'Identify patient'}
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveModal('addPatient')}
              className="min-h-[120px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <div className="text-5xl">👤</div>
              <Plus className="w-8 h-8" />
              <div className="text-center">
                <div className="text-xl font-bold">
                  {language === 'sw' ? 'ONGEZA MGONJWA' : 'ADD PATIENT'}
                </div>
                <div className="text-sm opacity-90">
                  {language === 'sw' ? 'Mgonjwa mpya' : 'New patient'}
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveModal('vaccineInventory')}
              className="min-h-[120px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <div className="text-5xl">💉</div>
              <Syringe className="w-8 h-8" />
              <div className="text-center">
                <div className="text-xl font-bold">
                  {language === 'sw' ? 'HIFADHI CHANJO' : 'VACCINE STOCK'}
                </div>
                <div className="text-sm opacity-90">
                  {language === 'sw' ? 'Simamia chanjo' : 'Manage vaccines'}
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveModal('reports')}
              className="min-h-[120px] bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <div className="text-5xl">📊</div>
              <BarChart3 className="w-8 h-8" />
              <div className="text-center">
                <div className="text-xl font-bold">
                  {language === 'sw' ? 'RIPOTI' : 'REPORTS'}
                </div>
                <div className="text-sm opacity-90">
                  {language === 'sw' ? 'Ripoti za afya' : 'Health reports'}
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Patient Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-500" />
              <span>{language === 'sw' ? 'Usimamizi wa Wagonjwa' : 'Patient Management'}</span>
            </h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder={language === 'sw' ? 'Tafuta mgonjwa...' : 'Search patients...'}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
            {filteredPatients.length > 0 ? (
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                          <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {patient.age} {language === 'sw' ? 'miaka' : 'years'} • {patient.gender === 'male' ? (language === 'sw' ? 'Mwanaume' : 'Male') : (language === 'sw' ? 'Mwanamke' : 'Female')}
                          </span>
                        </div>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-purple-500" />
                            <span>{patient.location}</span>
                          </div>
                          {patient.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-purple-500" />
                              <span>{patient.phone}</span>
                            </div>
                          )}
                          {patient.conditions.length > 0 && (
                            <div className="flex items-start space-x-2">
                              <Heart className="w-4 h-4 text-purple-500 mt-0.5" />
                              <span className="text-sm">{patient.conditions.join(', ')}</span>
                            </div>
                          )}
                          {patient.nextAppointment && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-purple-500" />
                              <span className="text-sm">
                                {language === 'sw' ? 'Miadi ijayo' : 'Next appointment'}: {patient.nextAppointment.toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setActiveModal('viewPatient');
                          }}
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                          title={language === 'sw' ? 'Ona maelezo' : 'View details'}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setActiveModal('giveVaccination');
                          }}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title={language === 'sw' ? 'Toa chanjo' : 'Give vaccination'}
                        >
                          <Syringe className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">
                  {searchTerm ? (language === 'sw' ? 'Hakuna Matokeo' : 'No Results') : (language === 'sw' ? 'Hakuna Wagonjwa' : 'No Patients')}
                </h3>
                <p className="text-gray-400">
                  {searchTerm 
                    ? (language === 'sw' ? 'Jaribu neno lingine la utafutaji' : 'Try a different search term')
                    : (language === 'sw' ? 'Wagonjwa wataonyeshwa hapa' : 'Patients will appear here')
                  }
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* QR Scanner */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
        title={language === 'sw' ? 'Skani QR ya Mgonjwa' : 'Scan Patient QR'}
      />

      {/* Vaccine Inventory Modal */}
      {activeModal === 'vaccineInventory' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '💉 Hifadhi ya Chanjo' : '💉 Vaccine Inventory'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vaccineInventory.map((vaccine) => (
                <div key={vaccine.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{vaccine.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getVaccineStockColor(vaccine.stock)}`}>
                      {vaccine.stock} {language === 'sw' ? 'vipimo' : 'doses'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>{language === 'sw' ? 'Mtengenezaji' : 'Manufacturer'}: {vaccine.manufacturer}</div>
                    <div>{language === 'sw' ? 'Nambari ya kundi' : 'Batch'}: {vaccine.batchNumber}</div>
                    <div>{language === 'sw' ? 'Mwisho' : 'Expires'}: {vaccine.expiryDate.toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Add Patient Modal */}
      {activeModal === 'addPatient' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '👤 Ongeza Mgonjwa Mpya' : '👤 Add New Patient'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-xl">
              <h3 className="font-bold text-purple-900 mb-2">{language === 'sw' ? 'Ongeza Mgonjwa' : 'Add Patient'}</h3>
              <p className="text-purple-800 text-sm">{language === 'sw' ? 'Kipengele kimefunguliwa' : 'Feature is now available'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Jina Kamili' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder={language === 'sw' ? 'Grace Wanjiku' : 'Grace Wanjiku'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Umri' : 'Age'} *
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Jinsia' : 'Gender'} *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                  <option value="">{language === 'sw' ? 'Chagua jinsia' : 'Select gender'}</option>
                  <option value="female">{language === 'sw' ? 'Mwanamke' : 'Female'}</option>
                  <option value="male">{language === 'sw' ? 'Mwanaume' : 'Male'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'sw' ? 'Mahali' : 'Location'} *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder={language === 'sw' ? 'Kiambu Village' : 'Kiambu Village'}
                />
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
                    title: language === 'sw' ? 'Mgonjwa Ameongezwa' : 'Patient Added',
                    message: language === 'sw' ? 'Mgonjwa mpya ameongezwa kikamilifu' : 'New patient added successfully',
                    type: 'success',
                    read: false
                  });
                  setActiveModal(null);
                }}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                {language === 'sw' ? 'Ongeza Mgonjwa' : 'Add Patient'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Other Modals */}
      {(activeModal === 'reports' || activeModal === 'giveVaccination' || activeModal === 'viewPatient') && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={
            activeModal === 'reports' ? (language === 'sw' ? '📊 Ripoti za Afya' : '📊 Health Reports') :
            activeModal === 'giveVaccination' ? (language === 'sw' ? '💉 Toa Chanjo' : '💉 Give Vaccination') :
            (language === 'sw' ? '👤 Maelezo ya Mgonjwa' : '👤 Patient Details')
          }
          size="md"
        >
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <Stethoscope className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="font-bold text-purple-900 mb-2">
                {activeModal === 'reports' ? (language === 'sw' ? 'Ripoti za Afya' : 'Health Reports') :
                 activeModal === 'giveVaccination' ? (language === 'sw' ? 'Toa Chanjo' : 'Give Vaccination') :
                 (language === 'sw' ? 'Maelezo ya Mgonjwa' : 'Patient Details')}
              </h3>
              <p className="text-purple-800 text-sm">
                {language === 'sw' ? 'Kipengele kimefunguliwa' : 'Feature is now available'}
              </p>
            </div>
            
            {selectedPatient && activeModal === 'viewPatient' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">{selectedPatient.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{language === 'sw' ? 'Umri' : 'Age'}:</span>
                      <span className="ml-2 font-semibold">{selectedPatient.age} {language === 'sw' ? 'miaka' : 'years'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{language === 'sw' ? 'Jinsia' : 'Gender'}:</span>
                      <span className="ml-2 font-semibold">{selectedPatient.gender === 'male' ? (language === 'sw' ? 'Mwanaume' : 'Male') : (language === 'sw' ? 'Mwanamke' : 'Female')}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">{language === 'sw' ? 'Mahali' : 'Location'}:</span>
                      <span className="ml-2 font-semibold">{selectedPatient.location}</span>
                    </div>
                  </div>
                </div>
                
                {selectedPatient.vaccinations.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-bold text-green-900 mb-2">{language === 'sw' ? 'Historia ya Chanjo' : 'Vaccination History'}</h4>
                    <div className="space-y-2">
                      {selectedPatient.vaccinations.map((vac, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{vac.vaccine}</span>
                          <span>{vac.date.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setActiveModal(null)}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              {language === 'sw' ? 'Funga' : 'Close'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};