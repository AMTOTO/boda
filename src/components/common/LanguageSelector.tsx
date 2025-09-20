import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown, X, Search, Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LanguageSelectorProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  position?: 'top-right' | 'center' | 'inline';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  size = 'md',
  showLabel = true,
  position = 'top-right',
  className = ''
}) => {
  const { language, setLanguage, languages, isOfflineMode, cacheTranslations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const flagSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'center': 'mx-auto',
    'inline': ''
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current language display
  const currentLanguage = languages.find(l => l.code === language);

  // Handle language change with caching
  const handleLanguageChange = async (langCode: string) => {
    setLanguage(langCode as any);
    setIsOpen(false);
    setSearchTerm('');
    
    // Cache translations for offline use
    try {
      await cacheTranslations();
    } catch (error) {
      console.error('Error caching translations:', error);
    }
  };

  return (
    <div className={`relative ${positionClasses[position]} ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 ${sizeClasses[size]} bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all shadow-lg border border-white/20`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <Globe className={`${iconSizes[size]} text-white`} />
        <span className={`text-white font-bold ${flagSizes[size]}`}>
          {currentLanguage?.flag}
        </span>
        {showLabel && (
          <span className="hidden sm:inline text-white font-bold">
            {currentLanguage?.nativeName}
          </span>
        )}
        <div className="flex items-center space-x-1">
          {isOfflineMode && <WifiOff className="w-3 h-3 text-white/70" />}
          <ChevronDown className={`${iconSizes[size]} text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[380px] max-h-[500px] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Choose Language</h3>
                  {isOfflineMode && (
                    <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                      <WifiOff className="w-3 h-3" />
                      <span className="text-xs">Offline</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close language selector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm opacity-90 mt-1">
                Chagua Lugha • Choisir la Langue • Hitamo Ururimi • Londa Olulimi
              </p>
            </div>
            
            {/* Search input */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Language list */}
            <div className="overflow-y-auto flex-1">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{lang.flag}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">{lang.name}</span>
                          {isOfflineMode && (
                            <WifiOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{lang.nativeName}</div>
                        <div className="text-gray-500 dark:text-gray-500 text-xs">{lang.country}</div>
                      </div>
                    </div>
                    {language === lang.code && (
                      <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No languages found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer with offline info */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  {isOfflineMode ? (
                    <>
                      <WifiOff className="w-4 h-4 text-red-500" />
                      <span>Offline mode - using cached translations</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span>Online - full translation support</span>
                    </>
                  )}
                </div>
                <span>{filteredLanguages.length} languages</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};