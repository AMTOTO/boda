import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, ChevronRight, Search, X, Globe } from 'lucide-react';
import { governanceService, AdministrativeUnit } from '../../services/governanceService';
import { useLanguage } from '../../contexts/LanguageContext';

interface GovernanceSelectorProps {
  selectedCountry: string;
  selectedUnits: string[];
  onSelectionChange: (units: string[], fullPath: AdministrativeUnit[]) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const GovernanceSelector: React.FC<GovernanceSelectorProps> = ({
  selectedCountry,
  selectedUnits,
  onSelectionChange,
  className = '',
  required = false,
  disabled = false
}) => {
  const { t, language } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [availableUnits, setAvailableUnits] = useState<AdministrativeUnit[]>([]);
  const [selectedPath, setSelectedPath] = useState<AdministrativeUnit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const hierarchyLevels = governanceService.getHierarchyLevels(selectedCountry);

  // Load units for current level
  useEffect(() => {
    if (!selectedCountry) return;

    setIsLoading(true);
    
    try {
      const parentCode = currentLevel === 1 ? undefined : selectedUnits[currentLevel - 2];
      const units = governanceService.getAdministrativeUnits(selectedCountry, currentLevel, parentCode);
      setAvailableUnits(units);
    } catch (error) {
      console.error('Error loading administrative units:', error);
      setAvailableUnits([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, currentLevel, selectedUnits]);

  // Update selected path when units change
  useEffect(() => {
    const path = governanceService.getFullAdministrativePath(selectedUnits[selectedUnits.length - 1] || '');
    setSelectedPath(path);
  }, [selectedUnits]);

  // Filter units based on search
  const filteredUnits = availableUnits.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnitSelect = (unit: AdministrativeUnit) => {
    const newSelectedUnits = [...selectedUnits];
    
    // Update the selection for the current level
    newSelectedUnits[currentLevel - 1] = unit.code;
    
    // Clear any selections for deeper levels
    newSelectedUnits.splice(currentLevel);
    
    // Update the full path
    const fullPath = governanceService.getFullAdministrativePath(unit.code);
    
    onSelectionChange(newSelectedUnits, fullPath);
    
    // Move to next level if available
    if (currentLevel < hierarchyLevels.length) {
      setCurrentLevel(currentLevel + 1);
    }
    
    setSearchTerm('');
  };

  const handleLevelClick = (level: number) => {
    if (level <= selectedUnits.length) {
      setCurrentLevel(level);
      setSearchTerm('');
    }
  };

  const getCurrentLevelName = () => {
    return hierarchyLevels[currentLevel - 1] || 'Administrative Unit';
  };

  const getSelectedUnitName = (level: number) => {
    const unitCode = selectedUnits[level - 1];
    if (!unitCode) return null;
    
    const unit = availableUnits.find(u => u.code === unitCode) || 
                 selectedPath.find(u => u.code === unitCode);
    return unit?.name;
  };

  if (!selectedCountry) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center ${className}`}>
        <Globe className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 dark:text-gray-400">
          {t('admin.select_country_first', { defaultValue: 'Please select a country first' })}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress Breadcrumbs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {hierarchyLevels.map((levelName, index) => {
          const level = index + 1;
          const isSelected = selectedUnits[index];
          const isCurrent = currentLevel === level;
          const isClickable = level <= selectedUnits.length + 1;

          return (
            <React.Fragment key={level}>
              <button
                onClick={() => handleLevelClick(level)}
                disabled={!isClickable || disabled}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700'
                    : isSelected
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600'
                } ${isClickable && !disabled ? 'hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              >
                <span className="text-lg">
                  {level === 1 ? '🏛️' : level === 2 ? '🏢' : level === 3 ? '🏘️' : level === 4 ? '🏠' : '📍'}
                </span>
                <span>{levelName}</span>
                {isSelected && (
                  <span className="text-xs bg-white/50 px-2 py-1 rounded-full">
                    {getSelectedUnitName(level)}
                  </span>
                )}
              </button>
              {index < hierarchyLevels.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current Level Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-lg">
                  {t('admin.select_unit', { unit: getCurrentLevelName() })}
                </h3>
                <p className="text-sm opacity-90">
                  {t('admin.step_of_total', { 
                    step: currentLevel.toString(), 
                    total: hierarchyLevels.length.toString() 
                  })}
                </p>
              </div>
            </div>
            {required && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {t('form.required')}
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${getCurrentLevelName().toLowerCase()}...`}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
              disabled={disabled}
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

        {/* Units List */}
        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t('status.loading')}...
              </p>
            </div>
          ) : filteredUnits.length > 0 ? (
            filteredUnits.map((unit) => {
              const isSelected = selectedUnits[currentLevel - 1] === unit.code;
              
              return (
                <motion.button
                  key={unit.code}
                  onClick={() => handleUnitSelect(unit)}
                  disabled={disabled}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  className={`w-full flex items-center justify-between px-6 py-4 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-left ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {currentLevel === 1 ? '🏛️' : currentLevel === 2 ? '🏢' : currentLevel === 3 ? '🏘️' : '📍'}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {unit.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {unit.code}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </motion.button>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No {getCurrentLevelName().toLowerCase()} found</p>
              {searchTerm && (
                <p className="text-xs mt-1">Try a different search term</p>
              )}
            </div>
          )}
        </div>

        {/* Village Input for Final Level */}
        {currentLevel > hierarchyLevels.length && selectedUnits.length === hierarchyLevels.length && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('register.village')} {required && '*'}
            </label>
            <input
              type="text"
              placeholder={t('admin.enter_village')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Selected Path Display */}
      {selectedPath.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                {t('admin.selected_location')}
              </h4>
              <div className="text-sm text-green-800 dark:text-green-200">
                {governanceService.formatLocationString(selectedUnits, true)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                {selectedPath.map(unit => unit.code).join(' → ')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};