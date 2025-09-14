import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../common/Header';
import { StatsCard } from '../common/StatsCard';
import { ToastContainer } from '../common/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BSenseAI } from '../common/BSenseAI';
import { Users, Activity, Settings, Shield, Bike, Heart, Stethoscope, Bell, Send, Zap, AlertTriangle, FileText, BarChart2, PieChart, TrendingUp, Map, Download, Upload, RefreshCw, CheckCircle, XCircle, HelpCircle, PenTool as Tool, Wrench, Database, Server, Cpu, MessageSquare, Brain } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [showParabodaAI, setShowParabodaAI] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: 'success' | 'warning' | 'error' | 'info' }>>([]);

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const tabs = [
    { id: 'overview', name: language === 'sw' ? 'Muhtasari' : 'Overview', icon: Activity },
    { id: 'users', name: language === 'sw' ? 'Watumiaji' : 'Users', icon: Users },
    { id: 'analytics', name: language === 'sw' ? 'Takwimu' : 'Analytics', icon: BarChart2 },
    { id: 'settings', name: language === 'sw' ? 'Mipangilio' : 'Settings', icon: Settings },
    { id: 'tools', name: language === 'sw' ? 'Zana' : 'Tools', icon: Tool }
  ];

  // Mock data for admin dashboard
  const systemStats = {
    totalUsers: 1247,
    activeRiders: 89,
    chvs: 45,
    healthWorkers: 23,
    emergencyResponse: '4.2 min',
    totalRides: 5678,
    totalAlerts: 234,
    systemUptime: '99.8%'
  };

  const userTypes = [
    { id: 'community', name: language === 'sw' ? 'Jamii' : 'Community', count: 1090, icon: Users, color: 'emerald' },
    { id: 'rider', name: language === 'sw' ? 'Wasafiri' : 'Riders', count: 89, icon: Bike, color: 'orange' },
    { id: 'chv', name: language === 'sw' ? 'CHVs' : 'CHVs', count: 45, icon: Heart, color: 'purple' },
    { id: 'health_worker', name: language === 'sw' ? 'Wafanyakazi wa Afya' : 'Health Workers', count: 23, icon: Stethoscope, color: 'blue' }
  ];

  const handleOpenTools = (userType: string) => {
    showToast(
      language === 'sw' ? 'Zana Zimefunguliwa' : 'Tools Opened',
      language === 'sw' ? `Zana za ${userType} zimefunguliwa` : `${userType} tools opened`,
      'info'
    );
  };

  const handlePushUpdate = () => {
    showToast(
      language === 'sw' ? 'Sasisho Limetumwa' : 'Update Pushed',
      language === 'sw' ? 'Sasisho la programu limetumwa kwa watumiaji waliochaguliwa' : 'App update pushed to selected users',
      'success'
    );
  };

  const handleSendEmergencyNotification = () => {
    if (!emergencyMessage.trim()) {
      showToast(
        language === 'sw' ? 'Hitilafu' : 'Error',
        language === 'sw' ? 'Tafadhali ingiza ujumbe wa dharura' : 'Please enter an emergency message',
        'error'
      );
      return;
    }

    showToast(
      language === 'sw' ? 'Arifa ya Dharura Imetumwa' : 'Emergency Notification Sent',
      language === 'sw' ? 'Arifa ya dharura imetumwa kwa watumiaji wote' : 'Emergency notification sent to all users',
      'success'
    );
    setEmergencyMessage('');
  };

  return (
    <div className="min-h-screen dashboard-bg-admin">
      <Header 
        title={language === 'sw' ? 'Dashibodi ya Msimamizi' : 'Admin Dashboard'}
        subtitle={language === 'sw' ? `Karibu, ${user?.name}` : `Welcome, ${user?.name}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title={language === 'sw' ? 'Watumiaji wa Jumla' : 'Total Users'}
            value={systemStats.totalUsers}
            change="+15% this month"
            changeType="positive"
            icon={Users}
            color="blue"
            delay={0}
          />
          <StatsCard
            title={language === 'sw' ? 'Wasafiri Hai' : 'Active Riders'}
            value={systemStats.activeRiders}
            change="+5 today"
            changeType="positive"
            icon={Bike}
            color="orange"
            delay={0.1}
          />
          <StatsCard
            title={language === 'sw' ? 'Jumla ya Safari' : 'Total Rides'}
            value={systemStats.totalRides}
            change="+123 this week"
            changeType="positive"
            icon={Activity}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title={language === 'sw' ? 'Muda wa Kujibu Dharura' : 'Emergency Response Time'}
            value={systemStats.emergencyResponse}
            change="-0.3 min"
            changeType="positive"
            icon={AlertTriangle}
            color="red"
            delay={0.3}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-xl border-4 border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
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
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => setShowParabodaAI(true)}
                    className="flex items-center space-x-4 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl hover:border-purple-300 hover:bg-purple-100 transition-all"
                  >
                    <Brain className="w-8 h-8 text-purple-600" />
                    <div className="text-left">
                      <h4 className="font-bold text-purple-800">
                        {language === 'sw' ? 'ParaBoda-AI' : 'ParaBoda-AI'}
                      </h4>
                      <p className="text-purple-600 text-sm">
                        {language === 'sw' ? 'Msaidizi wa akili bandia' : 'AI assistant'}
                      </p>
                    </div>
                  </button>

                  <button
                    className="flex items-center space-x-4 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-100 transition-all"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart2 className="w-8 h-8 text-blue-600" />
                    <div className="text-left">
                      <h4 className="font-bold text-blue-800">
                        {language === 'sw' ? 'Takwimu' : 'Analytics'}
                      </h4>
                      <p className="text-blue-600 text-sm">
                        {language === 'sw' ? 'Angalia takwimu za mfumo' : 'View system analytics'}
                      </p>
                    </div>
                  </button>

                  <button
                    className="flex items-center space-x-4 p-6 bg-red-50 border-2 border-red-200 rounded-xl hover:border-red-300 hover:bg-red-100 transition-all"
                    onClick={() => setActiveTab('tools')}
                  >
                    <Tool className="w-8 h-8 text-red-600" />
                    <div className="text-left">
                      <h4 className="font-bold text-red-800">
                        {language === 'sw' ? 'Zana za Utatuzi' : 'Troubleshooting Tools'}
                      </h4>
                      <p className="text-red-600 text-sm">
                        {language === 'sw' ? 'Tatua matatizo ya mfumo' : 'Fix system issues'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'sw' ? 'Hali ya Mfumo' : 'System Status'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                      <Server className="w-5 h-5 text-blue-600" />
                      <span>{language === 'sw' ? 'Seva' : 'Servers'}</span>
                    </h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">API: {language === 'sw' ? 'Inafanya kazi' : 'Operational'}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Database: {language === 'sw' ? 'Inafanya kazi' : 'Operational'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Storage: {language === 'sw' ? 'Inafanya kazi' : 'Operational'}</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      <span>{language === 'sw' ? 'Utendaji' : 'Performance'}</span>
                    </h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-gray-700">{language === 'sw' ? 'Muda Hai' : 'Uptime'}:</span>
                      <span className="font-bold text-green-600">{systemStats.systemUptime}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-gray-700">{language === 'sw' ? 'Mwitikio' : 'Response Time'}:</span>
                      <span className="font-bold text-green-600">245ms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">{language === 'sw' ? 'Matumizi ya CPU' : 'CPU Usage'}:</span>
                      <span className="font-bold text-green-600">32%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Notifications */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Bell className="w-6 h-6 text-red-600" />
                  <span>{language === 'sw' ? 'Arifa za Dharura' : 'Emergency Notifications'}</span>
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {language === 'sw' 
                      ? 'Tuma arifa za dharura kwa watumiaji wote mara moja.'
                      : 'Send emergency notifications to all users immediately.'
                    }
                  </p>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={emergencyMessage}
                      onChange={(e) => setEmergencyMessage(e.target.value)}
                      placeholder={language === 'sw' ? 'Ujumbe wa dharura...' : 'Emergency message...'}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <button
                      onClick={handleSendEmergencyNotification}
                      className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-bold flex items-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>{language === 'sw' ? 'Tuma' : 'Send'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'sw' ? 'Usimamizi wa Watumiaji' : 'User Management'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userTypes.map((type) => (
                  <div key={type.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${type.color}-100 rounded-xl flex items-center justify-center`}>
                          <type.icon className={`w-6 h-6 text-${type.color}-600`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-500">{type.count} {language === 'sw' ? 'watumiaji' : 'users'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenTools(type.name)}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          {language === 'sw' ? 'Fungua Zana' : 'Open Tools'}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{language === 'sw' ? 'Hai' : 'Active'}:</span>
                        <span className="font-medium text-green-600">{Math.floor(type.count * 0.85)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{language === 'sw' ? 'Mpya Wiki Hii' : 'New This Week'}:</span>
                        <span className="font-medium text-blue-600">{Math.floor(type.count * 0.12)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{language === 'sw' ? 'Matatizo' : 'Issues'}:</span>
                        <span className="font-medium text-red-600">{Math.floor(type.count * 0.03)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'sw' ? 'Takwimu za Mfumo' : 'System Analytics'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>{language === 'sw' ? 'Ukuaji wa Watumiaji' : 'User Growth'}</span>
                  </h4>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart2 className="w-16 h-16 text-gray-400" />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    <span>{language === 'sw' ? 'Mgawanyo wa Watumiaji' : 'User Distribution'}</span>
                  </h4>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <PieChart className="w-16 h-16 text-gray-400" />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span>{language === 'sw' ? 'Safari kwa Wiki' : 'Rides per Week'}</span>
                  </h4>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-16 h-16 text-gray-400" />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Map className="w-5 h-5 text-orange-600" />
                    <span>{language === 'sw' ? 'Ramani ya Joto' : 'Heat Map'}</span>
                  </h4>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Map className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'sw' ? 'Mipangilio ya Mfumo' : 'System Settings'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>{language === 'sw' ? 'Mipangilio ya Usalama' : 'Security Settings'}</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Uthibitishaji wa Hatua Mbili' : 'Two-Factor Authentication'}</span>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Sera za Nenosiri' : 'Password Policies'}</span>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Usimamizi wa Vipindi' : 'Session Management'}</span>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Database className="w-5 h-5 text-green-600" />
                    <span>{language === 'sw' ? 'Mipangilio ya Hifadhi' : 'Storage Settings'}</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Nakala Rudufu Otomatiki' : 'Automatic Backups'}</span>
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Usafishaji wa Data' : 'Data Cleanup'}</span>
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Usimamizi wa Faili' : 'File Management'}</span>
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span>{language === 'sw' ? 'Sasisho za Programu' : 'App Updates'}</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Sasisho za Otomatiki' : 'Automatic Updates'}</span>
                      <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Sasisho za Kulazimishwa' : 'Forced Updates'}</span>
                      <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Toleo la Programu' : 'App Version'}</span>
                      <button 
                        onClick={handlePushUpdate}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                      >
                        {language === 'sw' ? 'Sukuma' : 'Push'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-red-600" />
                    <span>{language === 'sw' ? 'Mipangilio ya Arifa' : 'Notification Settings'}</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Arifa za Dharura' : 'Emergency Notifications'}</span>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Arifa za Mfumo' : 'System Notifications'}</span>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'sw' ? 'Ratiba za Arifa' : 'Notification Schedules'}</span>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                        {language === 'sw' ? 'Fungua Mipangilio' : 'Open Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'sw' ? 'Zana za Utatuzi' : 'Troubleshooting Tools'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>{language === 'sw' ? 'Watumiaji' : 'Users'}</span>
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {language === 'sw' ? 'Tatua matatizo ya watumiaji' : 'Troubleshoot user issues'}
                    </p>
                    <button 
                      onClick={() => handleOpenTools('Users')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {language === 'sw' ? 'Fungua Zana' : 'Open Tools'}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Bike className="w-5 h-5 text-orange-600" />
                      <span>{language === 'sw' ? 'Wasafiri' : 'Riders'}</span>
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {language === 'sw' ? 'Tatua matatizo ya wasafiri' : 'Troubleshoot rider issues'}
                    </p>
                    <button 
                      onClick={() => handleOpenTools('Riders')}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      {language === 'sw' ? 'Fungua Zana' : 'Open Tools'}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-purple-600" />
                      <span>{language === 'sw' ? 'CHVs' : 'CHVs'}</span>
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {language === 'sw' ? 'Tatua matatizo ya CHV' : 'Troubleshoot CHV issues'}
                    </p>
                    <button 
                      onClick={() => handleOpenTools('CHVs')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      {language === 'sw' ? 'Fungua Zana' : 'Open Tools'}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Database className="w-5 h-5 text-green-600" />
                      <span>{language === 'sw' ? 'Hifadhidata' : 'Database'}</span>
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {language === 'sw' ? 'Tatua matatizo ya hifadhidata' : 'Troubleshoot database issues'}
                    </p>
                    <button 
                      onClick={() => handleOpenTools('Database')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      {language === 'sw' ? 'Fungua Zana' : 'Open Tools'}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Server className="w-5 h-5 text-indigo-600" />
                      <span>{language === 'sw' ? 'Seva' : 'Servers'}</span>
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {language === 'sw' ? 'Tatua matatizo ya seva' : 'Troubleshoot server issues'}
                    </p>
                    <button 
                      onClick={() => handleOpenTools('Servers')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      {language === 'sw' ? 'Fungua Zana' : 'Open Tools'}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Cpu className="w-5 h-5 text-red-600" />
                      <span>{language === 'sw' ? 'Mfumo' : 'System'}</span>
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {language === 'sw' ? 'Tatua matatizo ya mfumo' : 'Troubleshoot system issues'}
                    </p>
                    <button 
                      onClick={() => handleOpenTools('System')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      {language === 'sw' ? 'Fungua Zana' : 'Open Tools'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-4 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'sw' ? 'Sasisho za Programu' : 'App Updates'}
                </h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">
                      {language === 'sw' ? 'Sukuma Sasisho kwa Watumiaji Waliochaguliwa' : 'Push Updates to Selected Users'}
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="community" className="w-4 h-4 text-blue-600" />
                        <label htmlFor="community" className="text-gray-700">{language === 'sw' ? 'Jamii' : 'Community'}</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="riders" className="w-4 h-4 text-blue-600" />
                        <label htmlFor="riders" className="text-gray-700">{language === 'sw' ? 'Wasafiri' : 'Riders'}</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="chvs" className="w-4 h-4 text-blue-600" />
                        <label htmlFor="chvs" className="text-gray-700">CHVs</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="health_workers" className="w-4 h-4 text-blue-600" />
                        <label htmlFor="health_workers" className="text-gray-700">{language === 'sw' ? 'Wafanyakazi wa Afya' : 'Health Workers'}</label>
                      </div>
                      <button
                        onClick={handlePushUpdate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        {language === 'sw' ? 'Sukuma' : 'Push'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ParaBoda-AI Modal */}
      <BSenseAI
        isOpen={showParabodaAI}
        onClose={() => setShowParabodaAI(false)}
        userRole="admin"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};