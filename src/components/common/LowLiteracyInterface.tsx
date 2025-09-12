import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

interface LowLiteracyButtonProps {
  icon: React.ComponentType<any>;
  emoji: string;
  label: string;
  description?: string;
  onClick: () => void;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const LowLiteracyButton: React.FC<LowLiteracyButtonProps> = ({
  icon: Icon,
  emoji,
  label,
  description,
  onClick,
  color = 'blue',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const { language } = useLanguage();

  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  const emojiSizes = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        ${sizeClasses[size]}
        bg-${color}-50 border-2 border-${color}-200 
        hover:bg-${color}-100 hover:border-${color}-300
        disabled:opacity-50 disabled:cursor-not-allowed
        rounded-2xl transition-all shadow-lg
        flex flex-col items-center justify-center space-y-2
        min-h-[80px] w-full
        ${className}
      `}
      aria-label={`${label}${description ? ` - ${description}` : ''}`}
    >
      <div className={emojiSizes[size]}>{emoji}</div>
      <Icon className={`${iconSizes[size]} text-${color}-600`} />
      <span className={`font-bold text-${color}-900 text-center leading-tight`}>
        {label}
      </span>
      {description && (
        <span className={`text-xs text-${color}-700 text-center leading-tight`}>
          {description}
        </span>
      )}
    </motion.button>
  );
};

interface LowLiteracyGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

export const LowLiteracyGrid: React.FC<LowLiteracyGridProps> = ({
  children,
  columns = 2,
  className = ''
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  };

  return (
    <div className={`grid ${gridClasses[columns as keyof typeof gridClasses]} gap-4 ${className}`}>
      {children}
    </div>
  );
};

interface LowLiteracyCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  emoji?: string;
  color?: string;
  className?: string;
}

export const LowLiteracyCard: React.FC<LowLiteracyCardProps> = ({
  title,
  children,
  icon: Icon,
  emoji,
  color = 'blue',
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className={`bg-${color}-50 dark:bg-${color}-900/20 p-4 border-b border-${color}-200 dark:border-${color}-800`}>
        <div className="flex items-center space-x-3">
          {emoji && <span className="text-3xl">{emoji}</span>}
          {Icon && <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />}
          <h3 className={`text-lg font-bold text-${color}-900 dark:text-${color}-100`}>
            {title}
          </h3>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

interface LowLiteracyAlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  emoji?: string;
  onClose?: () => void;
  className?: string;
}

export const LowLiteracyAlert: React.FC<LowLiteracyAlertProps> = ({
  type,
  title,
  message,
  emoji,
  onClose,
  className = ''
}) => {
  const { language } = useLanguage();

  const typeConfig = {
    success: { color: 'green', defaultEmoji: '✅' },
    warning: { color: 'yellow', defaultEmoji: '⚠️' },
    error: { color: 'red', defaultEmoji: '❌' },
    info: { color: 'blue', defaultEmoji: 'ℹ️' }
  };

  const config = typeConfig[type];
  const displayEmoji = emoji || config.defaultEmoji;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-${config.color}-50 border-2 border-${config.color}-200 
        rounded-2xl p-4 shadow-lg
        ${className}
      `}
    >
      <div className="flex items-start space-x-3">
        <span className="text-3xl">{displayEmoji}</span>
        <div className="flex-1">
          <h4 className={`text-lg font-bold text-${config.color}-900 mb-1`}>
            {title}
          </h4>
          <p className={`text-${config.color}-800 leading-relaxed`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`text-${config.color}-600 hover:text-${config.color}-800 transition-colors`}
            aria-label={language === 'sw' ? 'Funga' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};