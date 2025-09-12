import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Check, ChevronDown, X } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = '',
  showLabel = false,
  size = 'md'
}) => {
  const { currency, setCurrency, currencies } = useCurrency();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentCurrency = currencies.find(c => c.code === currency);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 ${sizeClasses[size]} bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all shadow-lg`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <DollarSign className={iconSizes[size]} />
        <span className="text-2xl">{currentCurrency?.flag}</span>
        {showLabel && (
          <span className="hidden sm:inline font-bold">
            {currentCurrency?.code}
          </span>
        )}
        <ChevronDown className={`${iconSizes[size]} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[320px] max-h-[400px] flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>{language === 'sw' ? 'Chagua Sarafu' : 'Choose Currency'}</span>
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm opacity-90 mt-1">
                {language === 'sw' ? 'Chagua sarafu yako ya upendeleo' : 'Select your preferred currency'}
              </p>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr.code);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{curr.flag}</span>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">{curr.code}</span>
                        <span className="text-gray-600 dark:text-gray-400 font-medium">{curr.symbol}</span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{curr.name}</div>
                    </div>
                  </div>
                  {currency === curr.code && (
                    <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer with exchange rate info */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                <span>{language === 'sw' ? 'Viwango vya ubadilishaji ni vya mkadirio' : 'Exchange rates are approximate'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};