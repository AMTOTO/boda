import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'md'
}) => {
  const { mode, setMode, isDark } = useTheme();
  const { language } = useLanguage();

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getLabel = () => {
    if (mode === 'light') return language === 'sw' ? 'Mwanga' : 'Light';
    if (mode === 'dark') return language === 'sw' ? 'Giza' : 'Dark';
    return language === 'sw' ? 'Mfumo' : 'System';
  };

  const getIcon = () => {
    if (mode === 'light') return <Sun className={iconSizes[size]} />;
    if (mode === 'dark') return <Moon className={iconSizes[size]} />;
    return <Monitor className={iconSizes[size]} />;
  };

  const cycleMode = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  return (
    <motion.button
      onClick={cycleMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-lg ${sizeClasses[size]} flex items-center space-x-2 ${
        isDark 
          ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
          : 'bg-white text-gray-800 hover:bg-gray-100'
      } transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {getIcon()}
      {showLabel && <span>{getLabel()}</span>}
    </motion.button>
  );
};