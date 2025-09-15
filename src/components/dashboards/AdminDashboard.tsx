import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { StatsCard } from '../common/StatsCard';
import { Modal } from '../common/Modal';
import { 
  Shield, 
  Users, 
  Activity,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  BarChart3,
  FileText,
  Bell,
  UserCheck,
  Bike,
  Heart,
  Stethoscope,
  MapPin,
  Clock,
  Star,
  Award,
  Target,
  Zap,
  Brain,
  Navigation,
  Phone,
  Mail,
  Globe,
  X,
  Plus,
  Download,
  Upload,
  Database,
  Server,
  Wifi
} from 'lucide-react';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalSavings: number;
  loansIssued: number;
  loansRepaid: number;
  emergencyRequests: number;
  shaContributions: number;
  systemUptime: number;
}

interface UserSwitchData {
  id: string;
  name: string;
  role: string;
  location: string;
  lastActive: Date;
  status: 'online' | 'offline';
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useData();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserSwitchData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Admin-specific data
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalUsers: 1247,
    activeUsers: 892,
    totalSavings: 2450000,
    loansIssued: 156,
    loansRepaid: 134,
    emergencyRequests: 23,
    shaContributions: 890000,
    systemUptime: 99.8
  });

  const [userSwitchList, setUserSwitchList] = useState<UserSwitchData[]>([]);

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Location access denied:', error);
        }
      );
    }
  }, []);

  // Initialize mock user data for switching
  useEffect(() => {
    setUserSwitchList([
      {
        id: 'user_001',
        name: 'Grace Wanjiku',
        role: 'Caregiver',
        location: 'Kiambu County',
        lastActive: new Date(Date.now() - 30 * 60 * 1000),
        status: 'online'
      },
      {
        id: 'user_002',
        name: 'John Mwangi',
        role: 'ParaBoda Rider',
        location: 'Nakuru County',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'online'
      },
      {
        id: 'user_003',
        name: 'Sarah Akinyi',
        role: 'CHV',
        location: 'Kisumu County',
        lastActive: new Date(Date.now() - 15 * 60 * 1000),
        status: 'online'
      },
      {
        id: 'user_004',
        name: 'Dr. Mary Njeri',
        role: 'Health Worker',
        location: 'Meru County',
        lastActive: new Date(Date.now() - 45 * 60 * 1000),
        status: 'offline'
      }
    ]);
  }, []);

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  const handleSwitchToDashboard = (userData: UserSwitchData) => {
    const roleRoutes: Record<string, string> = {
      'Caregiver': '/community',
      'ParaBoda Rider': '/rider',
      'CHV': '/chv',
      'Health Worker': '/health-worker'
    };

    const route = roleRoutes[userData.role];
    if (route) {
      addNotification({
        title: language === 'sw' ? 'Umebadilisha Mtumiaji' : 'User Switched',
        message: language === 'sw' 
          ? `Sasa unaona dashibodi ya ${userData.name}`
          : `Now viewing ${userData.name}'s dashboard`,
        type: 'info',
        read: false
      });

      window.open(route, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  // Check if user is super admin
  const isSuperAdmin = user?.email === 'admin@paraboda.com' || user?.role === 'admin';

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'sw' ? 'Ufikiaji Umekatazwa' : 'Access Denied'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'sw' 
              ? 'Dashibodi hii ni kwa msimamizi mkuu tu.'
              : 'This dashboard is for super admin only.'
            }
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'sw' ? 'Rudi Nyumbani' : 'Go Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-bg-admin">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya Msimamizi' : 'Admin Dashboard'}
        subtitle={language === 'sw' ? 'Usimamizi wa mfumo' : 'System management'}
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
              <div className="text-6xl">⚙️</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  {language === 'sw' ? '⚙️ Dashibodi ya Msimamizi' : '⚙️ Admin Dashboard'}
                </h1>
                <p className="text-lg text-gray-600 font-bold">
                  {language === 'sw' ? 'Usimamizi wa Mfumo wa ParaBoda' : 'ParaBoda System Management'}
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-gray-800 font-semibold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </p>
              <p className="text-xs text-gray-700">
                {language === 'sw' ? 'Msimamizi Mkuu' : 'Super Administrator'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Overview with Graphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <span>{language === 'sw' ? 'Muhtasari wa Haraka' : 'Quick Overview'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title={language === 'sw' ? 'Watumiaji Hai' : 'Active Users'}
              value={`${systemMetrics.activeUsers}/${systemMetrics.totalUsers}`}
              change="+12% this week"
              changeType="positive"
              icon={Users}
              color="blue"
            />
            <StatsCard
              title={language === 'sw' ? 'Jumla ya Akiba' : 'Total Savings'}
              value={formatAmount(systemMetrics.totalSavings)}
              change="+8% this month"
              changeType="positive"
              icon={DollarSign}
              color="green"
              isCurrency={true}
              currencyAmount={systemMetrics.totalSavings}
            />
            <StatsCard
              title={language === 'sw' ? 'Mikopo vs Malipo' : 'Loans vs Repayments'}
              value={`${systemMetrics.loansIssued}/${systemMetrics.loansRepaid}`}
              change="86% repayment rate"
              changeType="positive"
              icon={TrendingUp}
              color="purple"
            />
            <StatsCard
              title={language === 'sw' ? 'Maombi ya Dharura' : 'Emergency Requests'}
              value={systemMetrics.emergencyRequests}
              change="5 resolved today"
              changeType="positive"
              icon={AlertTriangle}
              color="red"
            />
          </div>
        </motion.div>

        {/* User Dashboard Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Eye className="w-8 h-8 text-green-500" />
            <span>{language === 'sw' ? 'Ufikiaji wa Dashibodi za Watumiaji' : 'User Dashboard Access'}</span>
          </h2>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
            <p className="text-gray-600 mb-6 text-center">
              {language === 'sw' 
                ? 'Bofya mtumiaji yoyote kuona dashibodi yao kwa wakati halisi'
                : 'Click any user to view their dashboard in real-time'
              }
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userSwitchList.map((userData) => (
                <button
                  key={userData.id}
                  onClick={() => handleSwitchToDashboard(userData)}
                  className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all text-left transform hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{userData.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(userData.status)}`}>
                      {userData.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4" />
                      <span>{userData.role}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Mwisho' : 'Last active'}: {userData.lastActive.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* System Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Settings className="w-8 h-8 text-gray-500" />
            <span>{language === 'sw' ? 'Usimamizi wa Mfumo' : 'System Management'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => setActiveModal('userManagement')}
              className="min-h-[120px] bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <Users className="w-10 h-10" />
              <span className="font-bold text-lg">
                {language === 'sw' ? 'WATUMIAJI' : 'USERS'}
              </span>
            </button>

            <button
              onClick={() => setActiveModal('systemSettings')}
              className="min-h-[120px] bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <Settings className="w-10 h-10" />
              <span className="font-bold text-lg">
                {language === 'sw' ? 'MIPANGILIO' : 'SETTINGS'}
              </span>
            </button>

            <button
              onClick={() => setActiveModal('reports')}
              className="min-h-[120px] bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <FileText className="w-10 h-10" />
              <span className="font-bold text-lg">
                {language === 'sw' ? 'RIPOTI' : 'REPORTS'}
              </span>
            </button>

            <button
              onClick={() => setActiveModal('notifications')}
              className="min-h-[120px] bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <Bell className="w-10 h-10" />
              <span className="font-bold text-lg">
                {language === 'sw' ? 'ARIFA' : 'NOTIFICATIONS'}
              </span>
            </button>
          </div>
        </motion.div>

        {/* System Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Activity className="w-8 h-8 text-purple-500" />
            <span>{language === 'sw' ? 'Uchanganuzi wa Mfumo' : 'System Analytics'}</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Distribution */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {language === 'sw' ? 'Mgawanyo wa Watumiaji' : 'User Distribution'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-emerald-600" />
                    <span className="font-bold">{language === 'sw' ? 'Walezi' : 'Caregivers'}</span>
                  </div>
                  <span className="font-bold text-emerald-600 text-xl">456</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Bike className="w-6 h-6 text-blue-600" />
                    <span className="font-bold">{language === 'sw' ? 'Wasafiri' : 'Riders'}</span>
                  </div>
                  <span className="font-bold text-blue-600 text-xl">234</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-purple-600" />
                    <span className="font-bold">CHVs</span>
                  </div>
                  <span className="font-bold text-purple-600 text-xl">89</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Stethoscope className="w-6 h-6 text-indigo-600" />
                    <span className="font-bold">{language === 'sw' ? 'Wafanyakazi wa Afya' : 'Health Workers'}</span>
                  </div>
                  <span className="font-bold text-indigo-600 text-xl">67</span>
                </div>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {language === 'sw' ? 'Muhtasari wa Kifedha' : 'Financial Overview'}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl">
                  <span className="text-gray-700 font-medium">{language === 'sw' ? 'Akiba za Jumla' : 'Total Savings'}:</span>
                  <span className="font-bold text-green-600 text-xl">{formatAmount(systemMetrics.totalSavings)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
                  <span className="text-gray-700 font-medium">{language === 'sw' ? 'Michango ya SHA' : 'SHA Contributions'}:</span>
                  <span className="font-bold text-blue-600 text-xl">{formatAmount(systemMetrics.shaContributions)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl">
                  <span className="text-gray-700 font-medium">{language === 'sw' ? 'Kiwango cha Kulipa' : 'Repayment Rate'}:</span>
                  <span className="font-bold text-purple-600 text-xl">
                    {Math.round((systemMetrics.loansRepaid / systemMetrics.loansIssued) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-2xl">
                  <span className="text-gray-700 font-medium">{language === 'sw' ? 'Uptime wa Mfumo' : 'System Uptime'}:</span>
                  <span className="font-bold text-yellow-600 text-xl">{systemMetrics.systemUptime}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Management Modal */}
      {activeModal === 'userManagement' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '👥 Usimamizi wa Watumiaji' : '👥 User Management'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {systemMetrics.totalUsers}
                </div>
                <p className="text-blue-800 font-medium">
                  {language === 'sw' ? 'Watumiaji Wote' : 'Total Users'}
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {systemMetrics.activeUsers}
                </div>
                <p className="text-green-800 font-medium">
                  {language === 'sw' ? 'Watumiaji Hai' : 'Active Users'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveModal('addUser')}
                className="min-h-[60px] bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg font-bold flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>{language === 'sw' ? 'Ongeza Mtumiaji' : 'Add User'}</span>
              </button>
              <button
                onClick={() => setActiveModal('exportUsers')}
                className="min-h-[60px] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-bold flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>{language === 'sw' ? 'Hamisha Data' : 'Export Data'}</span>
              </button>
              <button
                onClick={() => setActiveModal('userAnalytics')}
                className="min-h-[60px] bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-bold flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>{language === 'sw' ? 'Uchanganuzi' : 'Analytics'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* System Settings Modal */}
      {activeModal === 'systemSettings' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '⚙️ Mipangilio ya Mfumo' : '⚙️ System Settings'}
          size="lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setActiveModal('generalSettings')}
              className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Settings className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Mipangilio ya Jumla' : 'General Settings'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Mipangilio ya msingi' : 'Basic configuration'}</div>
              </div>
            </button>
            
            <button
              onClick={() => setActiveModal('securitySettings')}
              className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Shield className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Usalama' : 'Security'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Mipangilio ya usalama' : 'Security settings'}</div>
              </div>
            </button>
            
            <button
              onClick={() => setActiveModal('backupSettings')}
              className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Database className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Hifadhi ya Data' : 'Data Backup'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Hifadhi na kurejesha' : 'Backup & restore'}</div>
              </div>
            </button>

            <button
              onClick={() => setActiveModal('systemHealth')}
              className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Activity className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Afya ya Mfumo' : 'System Health'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Ufuatiliaji wa mfumo' : 'System monitoring'}</div>
              </div>
            </button>
          </div>
        </Modal>
      )}

      {/* Reports Modal */}
      {activeModal === 'reports' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '📊 Ripoti za Mfumo' : '📊 System Reports'}
          size="lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => {
                addNotification({
                  title: language === 'sw' ? 'Ripoti ya Watumiaji' : 'User Report',
                  message: language === 'sw' ? 'Ripoti ya watumiaji imetengenezwa' : 'User report generated',
                  type: 'success',
                  read: false
                });
                setActiveModal(null);
              }}
              className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Users className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Ripoti ya Watumiaji' : 'User Report'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Shughuli za watumiaji' : 'User activities'}</div>
              </div>
            </button>
            
            <button
              onClick={() => {
                addNotification({
                  title: language === 'sw' ? 'Ripoti ya Kifedha' : 'Financial Report',
                  message: language === 'sw' ? 'Ripoti ya kifedha imetengenezwa' : 'Financial report generated',
                  type: 'success',
                  read: false
                });
                setActiveModal(null);
              }}
              className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <DollarSign className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Ripoti ya Kifedha' : 'Financial Report'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Akiba na mikopo' : 'Savings & loans'}</div>
              </div>
            </button>
            
            <button
              onClick={() => {
                addNotification({
                  title: language === 'sw' ? 'Ripoti ya Shughuli' : 'Activity Report',
                  message: language === 'sw' ? 'Ripoti ya shughuli imetengenezwa' : 'Activity report generated',
                  type: 'success',
                  read: false
                });
                setActiveModal(null);
              }}
              className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Activity className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Ripoti ya Shughuli' : 'Activity Report'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Shughuli za mfumo' : 'System activities'}</div>
              </div>
            </button>

            <button
              onClick={() => {
                addNotification({
                  title: language === 'sw' ? 'Ripoti ya Afya' : 'Health Report',
                  message: language === 'sw' ? 'Ripoti ya afya imetengenezwa' : 'Health report generated',
                  type: 'success',
                  read: false
                });
                setActiveModal(null);
              }}
              className="p-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
            >
              <Heart className="w-8 h-8" />
              <div className="text-left">
                <div className="font-bold text-lg">{language === 'sw' ? 'Ripoti ya Afya' : 'Health Report'}</div>
                <div className="text-sm opacity-90">{language === 'sw' ? 'Takwimu za afya' : 'Health statistics'}</div>
              </div>
            </button>
          </div>
        </Modal>
      )}

      {/* Notifications Modal */}
      {activeModal === 'notifications' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🔔 Usimamizi wa Arifa' : '🔔 Notification Management'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  addNotification({
                    title: language === 'sw' ? 'Arifa ya Mfumo' : 'System Notification',
                    message: language === 'sw' ? 'Arifa ya mfumo imetumwa kwa watumiaji wote' : 'System notification sent to all users',
                    type: 'info',
                    read: false
                  });
                  setActiveModal(null);
                }}
                className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
              >
                <Bell className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-bold text-lg">{language === 'sw' ? 'Tuma Arifa ya Mfumo' : 'Send System Notification'}</div>
                  <div className="text-sm opacity-90">{language === 'sw' ? 'Arifa kwa wote' : 'Broadcast to all'}</div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveModal('notificationHistory')}
                className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[100px] flex items-center space-x-4"
              >
                <FileText className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-bold text-lg">{language === 'sw' ? 'Historia ya Arifa' : 'Notification History'}</div>
                  <div className="text-sm opacity-90">{language === 'sw' ? 'Arifa zilizotumwa' : 'Sent notifications'}</div>
                </div>
              </button>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl">
              <h4 className="font-bold text-yellow-800 mb-2">
                {language === 'sw' ? 'Arifa za Hivi Karibuni' : 'Recent Notifications'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Arifa ya mfumo' : 'System update'}</span>
                  <span className="text-gray-500">2 {language === 'sw' ? 'masaa' : 'hours'} ago</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Arifa ya usalama' : 'Security alert'}</span>
                  <span className="text-gray-500">1 {language === 'sw' ? 'siku' : 'day'} ago</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Placeholder Modals for Coming Soon Features */}
      {(activeModal === 'addUser' || activeModal === 'exportUsers' || activeModal === 'userAnalytics' || 
        activeModal === 'generalSettings' || activeModal === 'securitySettings' || activeModal === 'backupSettings' || 
        activeModal === 'systemHealth' || activeModal === 'notificationHistory') && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={language === 'sw' ? '🚧 Inaendelezwa' : '🚧 Coming Soon'}
          size="md"
        >
          <div className="text-center py-8">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'sw' ? 'Kipengele Kinaendelezwa' : 'Feature Under Development'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'sw' 
                ? 'Kipengele hiki kitaongezwa katika toleo lijalo'
                : 'This feature will be available in the next release'
              }
            </p>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-blue-800 text-sm">
                {language === 'sw' 
                  ? 'Tunafanya kazi kuongeza vipengele vya kisasa vya usimamizi'
                  : 'We are working on adding advanced management features'
                }
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};