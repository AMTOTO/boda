import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { StatsCard } from '../common/StatsCard';
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
  X
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-4 border-purple-200">
            <div className="text-6xl mb-4">⚙️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              {language === 'sw' ? 'Msimamizi Mkuu' : 'Super Administrator'}
            </p>
            <div className="mt-4 bg-purple-100 rounded-2xl p-4 inline-block">
              <p className="text-sm text-purple-800 font-semibold">
                {language === 'sw' ? 'Uptime wa Mfumo' : 'System Uptime'}: {systemMetrics.systemUptime}%
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
              </div>
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
              className="min-h-[120px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <Users className="w-10 h-10" />
              <span className="font-bold text-lg">
                {language === 'sw' ? 'Watumiaji' : 'Users'}
              </span>
            </button>

            <button
              onClick={() => setActiveModal('systemSettings')}
              className="min-h-[120px] bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <Settings className="w-10 h-10" />
              <span className="font-bold text-lg">
                {language === 'sw' ? 'Mipangilio' : 'Settings'}
              </span>
            </button>

            <button
              onClick={() => setActiveModal('reports')}
              className="min-h-[120px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <FileText className="w-10 h-10" />
              <span className="font-bold text-lg">
                {language === 'sw' ? 'Ripoti' : 'Reports'}
              </span>
            </button>

            <button
              onClick={() => setActiveModal('notifications')}
              className="min-h-[120px] bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-6 flex flex-col items-center justify-center space-y-3"
            >
              <Bell className="w-10 h-10" />
              <span className="font-bold text-lg">
                {language === 'sw' ? 'Arifa' : 'Notifications'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* User Management Modal */}
      {activeModal === 'userManagement' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === 'sw' ? 'Usimamizi wa Watumiaji' : 'User Management'}
                </h2>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {systemMetrics.totalUsers}
                  </div>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    {language === 'sw' ? 'Watumiaji Wote' : 'Total Users'}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {systemMetrics.activeUsers}
                  </div>
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    {language === 'sw' ? 'Watumiaji Hai' : 'Active Users'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => console.log('Add user')}
                  className="min-h-[60px] bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg font-bold"
                >
                  {language === 'sw' ? 'Ongeza Mtumiaji' : 'Add User'}
                </button>
                <button
                  onClick={() => console.log('Export users')}
                  className="min-h-[60px] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-bold"
                >
                  {language === 'sw' ? 'Hamisha Data' : 'Export Data'}
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setActiveModal(null)}
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
            >
              {language === 'sw' ? 'Funga' : 'Close'}
            </button>
          </motion.div>
        </div>
      )}

      {/* System Settings Modal */}
      {activeModal === 'systemSettings' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Mipangilio ya Mfumo' : 'System Settings'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => console.log('General settings')}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] font-bold"
              >
                {language === 'sw' ? 'Mipangilio ya Jumla' : 'General Settings'}
              </button>
              
              <button
                onClick={() => console.log('Security settings')}
                className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] font-bold"
              >
                {language === 'sw' ? 'Usalama' : 'Security'}
              </button>
              
              <button
                onClick={() => console.log('Backup settings')}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] font-bold"
              >
                {language === 'sw' ? 'Hifadhi ya Data' : 'Data Backup'}
              </button>
              
              <button
                onClick={() => setActiveModal(null)}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
              >
                {language === 'sw' ? 'Funga' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reports Modal */}
      {activeModal === 'reports' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Ripoti za Mfumo' : 'System Reports'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
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
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] font-bold"
              >
                {language === 'sw' ? 'Ripoti ya Watumiaji' : 'User Report'}
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
                className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] font-bold"
              >
                {language === 'sw' ? 'Ripoti ya Kifedha' : 'Financial Report'}
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
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] font-bold"
              >
                {language === 'sw' ? 'Ripoti ya Shughuli' : 'Activity Report'}
              </button>
              
              <button
                onClick={() => setActiveModal(null)}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
              >
                {language === 'sw' ? 'Funga' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notifications Modal */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'sw' ? 'Usimamizi wa Arifa' : 'Notification Management'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
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
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] font-bold"
              >
                {language === 'sw' ? 'Tuma Arifa ya Mfumo' : 'Send System Notification'}
              </button>
              
              <button
                onClick={() => console.log('View notification history')}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px] font-bold"
              >
                {language === 'sw' ? 'Historia ya Arifa' : 'Notification History'}
              </button>
              
              <button
                onClick={() => setActiveModal(null)}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold min-h-[60px]"
              >
                {language === 'sw' ? 'Funga' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};