import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Settings, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const AdminIcon: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  // Only show for super admin
  const isSuperAdmin = user?.email === 'admin@paraboda.com' || user?.role === 'admin';

  if (!isSuperAdmin) {
    return null;
  }

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        onClick={handleAdminAccess}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
        aria-label={language === 'sw' ? 'Dashibodi ya Msimamizi' : 'Admin Dashboard'}
      >
        <Shield className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            {language === 'sw' ? 'Dashibodi ya Msimamizi' : 'Admin Dashboard'}
            <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};