import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown, X, Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current language display
  const currentLanguage = languages.find(l => l.code === language);

  // Check if language is supported by NLLB
  const isKenyanLanguage = (code: string) => {
    return ['sw', 'fr', 'rw', 'rn', 'am', 'ln', 'om', 'so'].includes(code);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all shadow-lg"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5 text-white" />
        <span className="text-white text-lg font-bold">
          {currentLanguage?.flag}
        </span>
        <span className="hidden sm:inline text-white font-bold">
          {currentLanguage?.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl border-4 border-gray-200 overflow-hidden z-50 min-w-[320px] max-h-[500px] flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <h3 className="font-bold text-lg flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Choose Language</span>
              </h3>
              <p className="text-sm opacity-90">Chagua Lugha • Choisir la Langue • Hitamo Ururimi</p>
            </div>
            
            {/* Search input */}
            <div className="p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-bold text-lg">{lang.name}</span>
                        </div>
                        <div className="text-gray-600 text-sm">{lang.nativeName}</div>
                        {isKenyanLanguage(lang.code) && lang.code !== 'en' && (
                          <div className="text-xs text-green-600 font-medium">
                            📝 {language === 'sw' ? 'Tafsiri ya kimsingi' : 'Basic translation'}
                          </div>
                        )}
                      </div>
                    </div>
                    {language === lang.code && (
                      <Check className="w-6 h-6 text-emerald-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>No languages found</p>
                </div>
              )}
            </div>

            {/* Footer with translation info */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600 text-center">
                <span>{language === 'sw' ? 'Kutumia tafsiri ya kimsingi' : 'Using basic translation for East African languages'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};