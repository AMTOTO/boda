import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';
import { QRCodeDisplay } from './QRCodeDisplay';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  User, 
  Settings, 
  QrCode, 
  Moon, 
  Sun, 
  LogOut, 
  Edit, 
  Camera,
  Phone,
  Mail,
  MapPin,
  Award,
  Star,
  Shield,
  Bell,
  Globe,
  Save,
  X
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    location: user?.location || ''
  });

  const tabs = [
    { id: 'profile', name: language === 'sw' ? 'Wasifu' : 'Profile', icon: User },
    { id: 'qr', name: 'QR Code', icon: QrCode },
    { id: 'settings', name: language === 'sw' ? 'Mipangilio' : 'Settings', icon: Settings }
  ];

  const roleInfo = {
    community: { name: language === 'sw' ? 'Mwanajamii' : 'Community Member', color: 'emerald' },
    rider: { name: language === 'sw' ? 'Msafiri' : 'Rider', color: 'orange' },
    chv: { name: language === 'sw' ? 'CHV' : 'CHV', color: 'purple' },
    health_worker: { name: language === 'sw' ? 'Mfanyakazi wa Afya' : 'Health Worker', color: 'blue' },
    admin: { name: language === 'sw' ? 'Msimamizi' : 'Admin', color: 'gray' }
  };

  const currentRole = roleInfo[user?.role || 'community'];

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    showToast(
      language === 'sw' ? 'Mafanikio' : 'Success',
      language === 'sw' ? 'Wasifu umesasishwa' : 'Profile updated successfully',
      'success'
    );
    setIsEditing(false);
  };

  const qrCodeData = JSON.stringify({
    type: 'paraboda_user',
    userId: user?.id,
    name: user?.name,
    role: user?.role,
    timestamp: Date.now()
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'sw' ? 'Wasifu Wangu' : 'My Profile'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Profile Header */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className={`w-24 h-24 bg-gradient-to-r from-${currentRole.color}-500 to-${currentRole.color}-600 rounded-full flex items-center justify-center mb-4`}>
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className={`text-${currentRole.color}-600 font-medium`}>{currentRole.name}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400">{user?.level || 'Bronze'} Level</span>
                <span className="text-gray-600 dark:text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">{user?.points || 0} points</span>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'sw' ? 'Jina' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'sw' ? 'Simu' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'sw' ? 'Barua Pepe' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'sw' ? 'Mahali' : 'Location'}
                    </label>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Hifadhi' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Ghairi' : 'Cancel'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'sw' ? 'Simu' : 'Phone'}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'sw' ? 'Barua Pepe' : 'Email'}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user?.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'sw' ? 'Mahali' : 'Location'}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user?.location || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Award className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'sw' ? 'Pointi' : 'Points'}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user?.points || 0}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{language === 'sw' ? 'Hariri Wasifu' : 'Edit Profile'}</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* QR Code Tab */}
        {activeTab === 'qr' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <QRCodeDisplay
              value={qrCodeData}
              title={language === 'sw' ? 'QR Code Yako' : 'Your QR Code'}
              description={language === 'sw' ? 'Onyesha hii katika vituo vya afya' : 'Show this at health facilities'}
              size={200}
            />
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {language === 'sw' ? 'Hali ya Giza' : 'Dark Mode'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'sw' ? 'Badilisha mwanga wa skrini' : 'Toggle screen brightness'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {language === 'sw' ? 'Arifa' : 'Notifications'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'sw' ? 'Dhibiti arifa za programu' : 'Manage app notifications'}
                  </p>
                </div>
              </div>
              <button className="text-blue-500 hover:text-blue-600 font-medium">
                {language === 'sw' ? 'Dhibiti' : 'Manage'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {language === 'sw' ? 'Lugha' : 'Language'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'sw' ? 'Badilisha lugha ya programu' : 'Change app language'}
                  </p>
                </div>
              </div>
              <button className="text-blue-500 hover:text-blue-600 font-medium">
                {language === 'sw' ? 'Badilisha' : 'Change'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {language === 'sw' ? 'Usalama' : 'Security'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === 'sw' ? 'Badilisha nenosiri na mipangilio ya usalama' : 'Change password and security settings'}
                  </p>
                </div>
              </div>
              <button className="text-blue-500 hover:text-blue-600 font-medium">
                {language === 'sw' ? 'Dhibiti' : 'Manage'}
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>{language === 'sw' ? 'Toka' : 'Logout'}</span>
            </button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};