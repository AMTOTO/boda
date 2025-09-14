import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../common/Header';
import { StatsCard } from '../common/StatsCard';
import { Modal } from '../common/Modal';
import { ToastContainer } from '../common/Toast';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { CameraCapture } from '../common/CameraCapture';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BSenseAI } from '../common/BSenseAI';
import { Stethoscope, Users, Shield, Calendar, Activity, TrendingUp, CheckCircle, Clock, MapPin, Phone, MessageSquare, Plus, Star, Target, Zap, Bell, Eye, Camera, Mic, Upload, Send, Heart, AlertTriangle, FileText, Navigation, Compass, Battery, Signal, Wifi, Volume2, Brain, UserCheck, Baby, Thermometer, Scale, Award, DollarSign, Package, Gift, Bike, Route, Timer, Settings, Edit, Trash2, Search, Filter, Download, Share2, QrCode, Syringe, Pill, Clipboard, UserPlus, BookOpen, Microscope, Ban as Bandage } from 'lucide-react';

export const HealthWorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    rideRequests, 
    healthAlerts, 
    mythReports, 
    addRideRequest,
    addHealthAlert, 
    addMythReport,
    updateRideRequest
  } = useData();
  
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraContext, setCameraContext] = useState<'patient' | 'vaccine' | 'myth' | 'transport' | 'scanner'>('patient');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showQRScannerModal, setShowQRScannerModal] = useState(false);
  const [showParabodaAI, setShowParabodaAI] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: 'success' | 'warning' | 'error' | 'info' }>>([]);

  // Mock data for health worker
  const [patients, setPatients] = useState([
    {
      id: '1',
      name: 'Grace Muthoni',
      age: 28,
      gender: 'Female',
      condition: 'Pregnancy - ANC',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-22',
      status: 'active',
      notes: 'Second pregnancy, no complications'
    },
    {
      id: '2',
      name: 'Baby Michael',
      age: 0.5,
      gender: 'Male',
      condition: 'Vaccination due',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-20',
      status: 'vaccine_due',
      notes: 'Due for 3rd dose of pentavalent vaccine'
    },
    {
      id: '3',
      name: 'John Kamau',
      age: 45,
      gender: 'Male',
      condition: 'Hypertension',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-01-25',
      status: 'follow_up',
      notes: 'Blood pressure monitoring required'
    }
  ]);

  const [vaccineInventory, setVaccineInventory] = useState([
    { id: '1', name: 'BCG', stock: 45, expiry: '2024-06-15', status: 'good' },
    { id: '2', name: 'Pentavalent', stock: 23, expiry: '2024-04-20', status: 'low' },
    { id: '3', name: 'Polio', stock: 67, expiry: '2024-08-10', status: 'good' },
    { id: '4', name: 'Measles', stock: 8, expiry: '2024-03-15', status: 'critical' },
    { id: '5', name: 'Yellow Fever', stock: 34, expiry: '2024-07-22', status: 'good' }
  ]);

  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: '1',
      patientName: 'Grace Muthoni',
      time: '09:00',
      type: 'ANC Visit',
      status: 'pending',
      notes: 'Routine checkup'
    },
    {
      id: '2',
      patientName: 'Baby Michael',
      time: '10:30',
      type: 'Vaccination',
      status: 'pending',
      notes: 'Pentavalent 3rd dose'
    },
    {
      id: '3',
      patientName: 'John Kamau',
      time: '14:00',
      type: 'Follow-up',
      status: 'completed',
      notes: 'Blood pressure check'
    }
  ]);

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const tabs = [
    { id: 'overview', name: t('nav.overview'), icon: Activity, emoji: '📊' },
    { id: 'patients', name: 'Patients', icon: Users, emoji: '👥' },
    { id: 'vaccines', name: 'Vaccines', icon: Syringe, emoji: '💉' },
    { id: 'scanner', name: 'QR Scanner', icon: QrCode, emoji: '📱' },
    { id: 'transport', name: t('nav.transport'), icon: Bike, emoji: '🏍️' },
    { id: 'myths', name: t('nav.myths'), icon: Shield, emoji: '🛡️' },
    { id: 'reports', name: t('nav.reports'), icon: FileText, emoji: '📋' }
  ];

  // Health worker statistics
  const healthWorkerStats = {
    totalPatients: patients.length,
    todayAppointments: todayAppointments.filter(apt => apt.status === 'pending').length,
    vaccinesGiven: 127,
    criticalVaccines: vaccineInventory.filter(v => v.status === 'critical').length,
    incomingPatients: rideRequests.filter(req => req.destination.includes('Health')).length
  };

  const handleServiceRequest = (serviceData: any) => {
    addRideRequest({
      type: serviceData.serviceId,
      patientName: serviceData.patientName,
      pickup: serviceData.pickupLocation,
      destination: serviceData.destination,
      urgency: serviceData.urgency,
      status: 'pending',
      requestedBy: user?.name || 'Health Worker',
      cost: serviceData.estimatedCost || 500,
      notes: serviceData.additionalNotes
    });

    setShowServiceModal(false);
    showToast(
      t('message.success'),
      language === 'sw' ? 'Ombi la usafiri limewasilishwa' : 'Transport request submitted',
      'success'
    );
  };

  const handleAddPatient = () => {
    const newPatient = {
      id: `patient_${Date.now()}`,
      name: 'New Patient',
      age: 0,
      gender: 'Unknown',
      condition: 'General consultation',
      lastVisit: new Date().toISOString().split('T')[0],
      nextAppointment: '',
      status: 'active',
      notes: ''
    };

    setPatients(prev => [newPatient, ...prev]);
    setShowAddPatientModal(false);
    showToast(
      t('message.success'),
      language === 'sw' ? 'Mgonjwa ameongezwa' : 'Patient added successfully',
      'success'
    );
  };

  const handleAttendAppointment = (appointmentId: string) => {
    setTodayAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'completed' }
          : apt
      )
    );
    
    showToast(
      t('message.success'),
      language === 'sw' ? 'Miadi imehudhuria' : 'Appointment attended',
      'success'
    );
  };

  const handleStartConsultation = (patientId: string) => {
    setSelectedPatient(patients.find(p => p.id === patientId));
    showToast(
      t('message.success'),
      language === 'sw' ? 'Ushauri umeanza' : 'Consultation started',
      'info'
    );
  };

  const handleEndConsultation = () => {
    setSelectedPatient(null);
    showToast(
      t('message.success'),
      language === 'sw' ? 'Ushauri umekamilika' : 'Consultation completed',
      'success'
    );
  };

  const handleUpdateInventory = (vaccineId: string, newStock: number) => {
    setVaccineInventory(prev =>
      prev.map(vaccine =>
        vaccine.id === vaccineId
          ? { 
              ...vaccine, 
              stock: newStock,
              status: newStock <= 10 ? 'critical' : newStock <= 25 ? 'low' : 'good'
            }
          : vaccine
      )
    );
    
    showToast(
      t('message.success'),
      language === 'sw' ? 'Hifadhi imesasishwa' : 'Inventory updated',
      'success'
    );
  };

  const handleReportMyth = () => {
    const mythData = {
      category: 'general',
      content: 'Health myth reported by health worker',
      location: user?.location || 'Health Facility',
      reportedBy: user?.name || 'Health Worker',
      verified: false,
      debunked: false
    };

    addMythReport(mythData);
    showToast(
      t('message.success'),
      language === 'sw' ? 'Ripoti ya uwongo imewasilishwa' : 'Myth report submitted',
      'success'
    );
  };

  const handleCameraCapture = (imageData: string, file: File) => {
    switch (cameraContext) {
      case 'patient':
        showToast(
          language === 'sw' ? 'Picha ya Mgonjwa Imehifadhiwa' : 'Patient Photo Saved',
          language === 'sw' ? 'Picha ya mgonjwa imehifadhiwa' : 'Patient photo has been saved',
          'success'
        );
        break;
      case 'vaccine':
        showToast(
          language === 'sw' ? 'Picha ya Chanjo Imehifadhiwa' : 'Vaccine Photo Saved',
          language === 'sw' ? 'Picha ya chanjo imehifadhiwa' : 'Vaccine photo has been saved',
          'success'
        );
        break;
      case 'myth':
        showToast(
          language === 'sw' ? 'Picha ya Uwongo Imehifadhiwa' : 'Myth Photo Saved',
          language === 'sw' ? 'Picha ya uwongo imehifadhiwa' : 'Myth photo has been saved',
          'success'
        );
        break;
      case 'transport':
        showToast(
          language === 'sw' ? 'Picha ya Usafiri Imehifadhiwa' : 'Transport Photo Saved',
          language === 'sw' ? 'Picha ya usafiri imehifadhiwa' : 'Transport photo has been saved',
          'success'
        );
        break;
      case 'scanner':
        showToast(
          language === 'sw' ? 'Picha ya Skana Imehifadhiwa' : 'Scanner Photo Saved',
          language === 'sw' ? 'Picha ya skana imehifadhiwa' : 'Scanner photo has been saved',
          'success'
        );
        break;
    }
    setShowCameraModal(false);
  };

  const openCamera = (context: 'patient' | 'vaccine' | 'myth' | 'transport' | 'scanner') => {
    setCameraContext(context);
    setShowCameraModal(true);
  };

  const handleQRScan = () => {
    showToast(
      language === 'sw' ? 'QR Code Imesomwa' : 'QR Code Scanned',
      language === 'sw' ? 'Taarifa za mgonjwa zimepatikana' : 'Patient information retrieved',
      'success'
    );
    setShowQRScannerModal(false);
  };

  return (
    <div className="min-h-screen dashboard-bg-health">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya Mfanyakazi wa Afya' : 'Health Worker Dashboard'}
        subtitle={language === 'sw' ? `Karibu, ${user?.name}` : `Welcome, ${user?.name}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title={language === 'sw' ? 'Wagonjwa wa Jumla' : 'Total Patients'}
            value={healthWorkerStats.totalPatients}
            change="+3 this week"
            changeType="positive"
            icon={Users}
            color="blue"
            delay={0}
          />
          <StatsCard
            title={language === 'sw' ? 'Miadi ya Leo' : "Today's Appointments"}
            value={healthWorkerStats.todayAppointments}
            change="2 pending"
            changeType="warning"
            icon={Calendar}
            color="orange"
            delay={0.1}
          />
          <StatsCard
            title={language === 'sw' ? 'Chanjo Zilizotolewa' : 'Vaccines Given'}
            value={healthWorkerStats.vaccinesGiven}
            change="+12 this week"
            changeType="positive"
            icon={Syringe}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title={language === 'sw' ? 'Chanjo za Dharura' : 'Critical Vaccines'}
            value={healthWorkerStats.criticalVaccines}
            change="Need restocking"
            changeType="negative"
            icon={AlertTriangle}
            color="red"
            delay={0.3}
          />
          <StatsCard
            title={language === 'sw' ? 'Wagonjwa Wanaokuja' : 'Incoming Patients'}
            value={healthWorkerStats.incomingPatients}
            change="Via ParaBoda"
            changeType="positive"
            icon={Route}
            color="purple"
            delay={0.4}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-xl border-4 border-blue-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                <span className="text-xl">{tab.emoji}</span>
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-blue-500" />
                  <span>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={handleAddPatient}
                    className="flex flex-col items-center space-y-3 p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:border-green-300 hover:bg-green-100 transition-all"
                  >
                    <UserPlus className="w-8 h-8 text-green-600" />
                    <span className="font-bold text-green-800 text-center">
                      {language === 'sw' ? 'Ongeza Mgonjwa' : 'Add Patient'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowQRScannerModal(true)}
                    className="flex flex-col items-center space-y-3 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-100 transition-all"
                  >
                    <QrCode className="w-8 h-8 text-blue-600" />
                    <span className="font-bold text-blue-800 text-center">
                      {language === 'sw' ? 'Skani QR' : 'Scan QR'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowParabodaAI(true)}
                    className="flex flex-col items-center space-y-3 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl hover:border-purple-300 hover:bg-purple-100 transition-all"
                  >
                    <Brain className="w-8 h-8 text-purple-600" />
                    <span className="font-bold text-purple-800 text-center">
                      {language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}
                    </span>
                  </button>

                  <button
                    onClick={handleReportMyth}
                    className="flex flex-col items-center space-y-3 p-6 bg-red-50 border-2 border-red-200 rounded-xl hover:border-red-300 hover:bg-red-100 transition-all"
                  >
                    <Shield className="w-8 h-8 text-red-600" />
                    <span className="font-bold text-red-800 text-center">
                      {language === 'sw' ? 'Ripoti Uwongo' : 'Report Myth'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <span>{language === 'sw' ? 'Miadi ya Leo' : "Today's Appointments"}</span>
                </h3>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-gray-900">{appointment.patientName}</span>
                          <span className="text-sm text-gray-500">{appointment.time}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <span className="font-medium text-blue-600">{appointment.type}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{appointment.notes}</p>
                      <div className="flex space-x-3">
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleAttendAppointment(appointment.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-bold text-sm"
                          >
                            {language === 'sw' ? 'Hudhuria' : 'Attend'}
                          </button>
                        )}
                        <button
                          onClick={() => openCamera('patient')}
                          className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incoming Patients via ParaBoda */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Route className="w-6 h-6 text-blue-500" />
                  <span>{language === 'sw' ? 'Wagonjwa Wanaokuja' : 'Incoming Patients'}</span>
                </h3>
                <div className="space-y-4">
                  {rideRequests.filter(req => req.destination.includes('Health')).slice(0, 3).map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-gray-900">{request.patientName}</span>
                        <span className="text-sm text-blue-600">ETA: 15 min</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Aina' : 'Type'}</p>
                          <p className="font-medium">{request.type.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Haraka' : 'Urgency'}</p>
                          <p className={`font-medium ${
                            request.urgency === 'high' ? 'text-red-600' :
                            request.urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {request.urgency}
                          </p>
                        </div>
                      </div>
                      {request.notes && (
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                          {request.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="space-y-6">
              {/* Search and Add Patient */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={language === 'sw' ? 'Tafuta mgonjwa...' : 'Search patients...'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAddPatient}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-bold"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Ongeza Mgonjwa' : 'Add Patient'}</span>
                  </button>
                </div>
              </div>

              {/* Patients List */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  <span>{language === 'sw' ? 'Wagonjwa' : 'Patients'} ({patients.length})</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {patients.filter(patient => 
                    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((patient) => (
                    <div key={patient.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">{patient.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          patient.status === 'vaccine_due' ? 'bg-orange-100 text-orange-800' :
                          patient.status === 'follow_up' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {patient.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Umri' : 'Age'}</p>
                          <p className="font-bold">{patient.age} {patient.age === 0.5 ? 'months' : 'years'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Jinsia' : 'Gender'}</p>
                          <p className="font-bold">{patient.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Hali' : 'Condition'}</p>
                          <p className="font-bold">{patient.condition}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{language === 'sw' ? 'Ziara Ijayo' : 'Next Visit'}</p>
                          <p className="font-bold text-sm">
                            {patient.nextAppointment 
                              ? new Date(patient.nextAppointment).toLocaleDateString()
                              : 'Not scheduled'
                            }
                          </p>
                        </div>
                      </div>

                      {patient.notes && (
                        <p className="text-gray-700 text-sm mb-4 bg-yellow-50 p-3 rounded-lg">
                          {patient.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStartConsultation(patient.id)}
                          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold"
                        >
                          <Stethoscope className="w-4 h-4" />
                          <span>{language === 'sw' ? 'Anza Ushauri' : 'Start Consultation'}</span>
                        </button>
                        
                        <button
                          onClick={() => openCamera('patient')}
                          className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Camera className="w-4 h-4" />
                          <span>{language === 'sw' ? 'Picha' : 'Photo'}</span>
                        </button>

                        <button
                          onClick={() => setShowParabodaAI(true)}
                          className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-bold"
                        >
                          <Brain className="w-4 h-4" />
                          <span>{language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}</span>
                        </button>

                        {selectedPatient?.id === patient.id && (
                          <button
                            onClick={handleEndConsultation}
                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-bold"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>{language === 'sw' ? 'Maliza Ushauri' : 'End Consultation'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vaccines Tab */}
          {activeTab === 'vaccines' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Syringe className="w-6 h-6 text-blue-500" />
                  <span>{language === 'sw' ? 'Hifadhi ya Chanjo' : 'Vaccine Inventory'}</span>
                </h3>
                <button
                  onClick={() => openCamera('vaccine')}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-bold"
                >
                  <Camera className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Piga Picha' : 'Take Photo'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaccineInventory.map((vaccine) => (
                  <div key={vaccine.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900">{vaccine.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        vaccine.status === 'critical' ? 'bg-red-100 text-red-800' :
                        vaccine.status === 'low' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {vaccine.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">{language === 'sw' ? 'Hisa' : 'Stock'}</p>
                        <p className="text-2xl font-bold text-blue-600">{vaccine.stock}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{language === 'sw' ? 'Mwisho wa Matumizi' : 'Expiry Date'}</p>
                        <p className="font-medium">{new Date(vaccine.expiry).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="New stock"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const newStock = parseInt((e.target as HTMLInputElement).value);
                            if (newStock >= 0) {
                              handleUpdateInventory(vaccine.id, newStock);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => openCamera('vaccine')}
                        className="border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scanner Tab */}
          {activeTab === 'scanner' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <QrCode className="w-6 h-6 text-blue-500" />
                <span>{language === 'sw' ? 'Skana ya QR' : 'QR Scanner'}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={handleQRScan}
                  className="flex flex-col items-center space-y-4 p-8 bg-blue-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-100 transition-all"
                >
                  <QrCode className="w-16 h-16 text-blue-600" />
                  <div className="text-center">
                    <h4 className="font-bold text-blue-800 text-lg mb-2">
                      {language === 'sw' ? 'Skani Mgonjwa' : 'Scan Patient'}
                    </h4>
                    <p className="text-blue-600">
                      {language === 'sw' ? 'Skani QR code ya mgonjwa' : 'Scan patient QR code'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => openCamera('scanner')}
                  className="flex flex-col items-center space-y-4 p-8 bg-green-50 border-2 border-green-200 rounded-xl hover:border-green-300 hover:bg-green-100 transition-all"
                >
                  <Camera className="w-16 h-16 text-green-600" />
                  <div className="text-center">
                    <h4 className="font-bold text-green-800 text-lg mb-2">
                      {language === 'sw' ? 'Piga Picha ya Skana' : 'Take Scanner Photo'}
                    </h4>
                    <p className="text-green-600">
                      {language === 'sw' ? 'Piga picha ya vifaa' : 'Capture equipment photo'}
                    </p>
                  </div>
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">
                  {language === 'sw' ? 'Historia ya Skana za Hivi Karibuni' : 'Recent Scan History'}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">Grace Muthoni</p>
                      <p className="text-sm text-gray-500">Patient ID: PAT001</p>
                    </div>
                    <span className="text-sm text-gray-500">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">Vaccine Batch #VB2024</p>
                      <p className="text-sm text-gray-500">BCG Vaccine</p>
                    </div>
                    <span className="text-sm text-gray-500">15 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">Baby Michael</p>
                      <p className="text-sm text-gray-500">Patient ID: PAT002</p>
                    </div>
                    <span className="text-sm text-gray-500">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transport Tab */}
          {activeTab === 'transport' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Bike className="w-6 h-6 text-blue-500" />
                  <span>{language === 'sw' ? 'Usimamizi wa Usafiri' : 'Transport Management'}</span>
                </h3>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-bold"
                >
                  <Plus className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {rideRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900">{request.patientName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">KSh {request.cost}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">{language === 'sw' ? 'Kuchukua' : 'Pickup'}</p>
                        <p className="font-medium">{request.pickup}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{language === 'sw' ? 'Marudio' : 'Destination'}</p>
                        <p className="font-medium">{request.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{language === 'sw' ? 'Aina' : 'Type'}</p>
                        <p className="font-medium">{request.type.replace('_', ' ')}</p>
                      </div>
                    </div>

                    {request.notes && (
                      <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-lg">
                        {request.notes}
                      </p>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={() => openCamera('transport')}
                        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Myths Tab */}
          {activeTab === 'myths' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-blue-500" />
                  <span>{language === 'sw' ? 'Ripoti za Uwongo' : 'Myth Reports'}</span>
                </h3>
                <button
                  onClick={handleReportMyth}
                  className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-bold"
                >
                  <Plus className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Ripoti Uwongo' : 'Report Myth'}</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {mythReports.map((myth) => (
                  <div key={myth.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900">{myth.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          myth.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {myth.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      {myth.reach && (
                        <span className="text-sm text-gray-500">Reach: {myth.reach}</span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{myth.content}</p>
                    <p className="text-gray-500 text-sm mb-4">{myth.location}</p>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => openCamera('myth')}
                        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Service Request Modal */}
      <ServiceRequestModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onRequest={handleServiceRequest}
      />

      {/* Camera Modal */}
      <CameraCapture
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
        title={
          cameraContext === 'patient' ? (language === 'sw' ? 'Piga Picha ya Mgonjwa' : 'Take Patient Photo') :
          cameraContext === 'vaccine' ? (language === 'sw' ? 'Piga Picha ya Chanjo' : 'Take Vaccine Photo') :
          cameraContext === 'myth' ? (language === 'sw' ? 'Piga Picha ya Uwongo' : 'Take Myth Photo') :
          cameraContext === 'transport' ? (language === 'sw' ? 'Piga Picha ya Usafiri' : 'Take Transport Photo') :
          (language === 'sw' ? 'Piga Picha ya Skana' : 'Take Scanner Photo')
        }
        context={
          cameraContext === 'patient' ? (language === 'sw' ? 'Piga picha ya mgonjwa' : 'Capture patient information') :
          cameraContext === 'vaccine' ? (language === 'sw' ? 'Piga picha ya chanjo' : 'Capture vaccine information') :
          cameraContext === 'myth' ? (language === 'sw' ? 'Piga picha ya uwongo wa kiafya' : 'Capture health misinformation') :
          cameraContext === 'transport' ? (language === 'sw' ? 'Piga picha ya usafiri' : 'Capture transport evidence') :
          (language === 'sw' ? 'Piga picha ya vifaa' : 'Capture equipment photo')
        }
      />

      {/* ParaBoda-AI Modal */}
      <BSenseAI
        isOpen={showParabodaAI}
        onClose={() => setShowParabodaAI(false)}
        userRole="health_worker"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};