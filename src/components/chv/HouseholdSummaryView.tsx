import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { chvService, Household, Mother, Child } from '../../services/chvService';
import { 
  Home, 
  User, 
  Phone, 
  MapPin, 
  Shield,
  Users,
  Heart,
  Baby,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Edit,
  Car,
  Eye,
  Activity,
  Clock,
  Star,
  Award
} from 'lucide-react';

interface HouseholdSummaryViewProps {
  isOpen: boolean;
  onClose: () => void;
  household: Household | null;
  mothers: Mother[];
  children: Child[];
  onEditHousehold: (household: Household) => void;
  onRequestTransport: () => void;
}

export const HouseholdSummaryView: React.FC<HouseholdSummaryViewProps> = ({
  isOpen,
  onClose,
  household,
  mothers,
  children,
  onEditHousehold,
  onRequestTransport
}) => {
  const { language } = useLanguage();

  if (!household) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-300';
      case 'anc_due': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'vaccination_due': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getInsuranceColor = (insurance: string) => {
    switch (insurance) {
      case 'SHA': return 'bg-green-100 text-green-800';
      case 'NHIF': return 'bg-blue-100 text-blue-800';
      case 'Mutuelle': return 'bg-purple-100 text-purple-800';
      case 'None': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getVaccinationStatus = (child: Child) => {
    // Mock vaccination status calculation
    const expectedVaccines = Math.floor(child.ageInMonths / 2) + 1; // Simplified calculation
    const completedVaccines = Math.floor(expectedVaccines * 0.8); // 80% completion rate
    
    if (completedVaccines === expectedVaccines) return { status: 'up_to_date', color: 'green' };
    if (completedVaccines >= expectedVaccines * 0.8) return { status: 'mostly_complete', color: 'yellow' };
    return { status: 'behind', color: 'red' };
  };

  const getANCProgress = (mother: Mother) => {
    const progress = (mother.ancVisitsCompleted / mother.ancVisitsRequired) * 100;
    return {
      percentage: Math.min(100, progress),
      color: progress >= 75 ? 'green' : progress >= 50 ? 'yellow' : 'red'
    };
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🏠 ${household.headOfHousehold.name} - ${household.householdId}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Household Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Home className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{household.headOfHousehold.name}</h2>
                <p className="text-blue-100">ID: {household.householdId}</p>
                <p className="text-blue-100">{household.location.village}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{household.totalMembers}</div>
              <div className="text-blue-100">{language === 'sw' ? 'Wanakaya' : 'Members'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{household.adults}</div>
              <div className="text-blue-100 text-sm">{language === 'sw' ? 'Wazima' : 'Adults'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{household.children}</div>
              <div className="text-blue-100 text-sm">{language === 'sw' ? 'Watoto' : 'Children'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{household.pregnantWomen}</div>
              <div className="text-blue-100 text-sm">{language === 'sw' ? 'Wajawazito' : 'Pregnant'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{household.childrenUnder5}</div>
              <div className="text-blue-100 text-sm">{language === 'sw' ? '<5 yrs' : '<5 yrs'}</div>
            </div>
          </div>
        </div>

        {/* Status and Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>{language === 'sw' ? 'Hali ya Kaya' : 'Household Status'}</span>
            </h3>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(household.status)}`}>
              {household.status === 'overdue' ? (language === 'sw' ? 'IMECHELEWA' : 'OVERDUE') :
               household.status === 'anc_due' ? (language === 'sw' ? 'ANC INASTAHILI' : 'ANC DUE') :
               household.status === 'vaccination_due' ? (language === 'sw' ? 'CHANJO INASTAHILI' : 'VACCINE DUE') :
               (language === 'sw' ? 'SAWA' : 'ACTIVE')}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>{language === 'sw' ? 'Hali ya Bima' : 'Insurance Status'}</span>
            </h3>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getInsuranceColor(household.insuranceStatus)}`}>
              {household.insuranceStatus}
            </span>
            {household.otherInsurance && (
              <p className="text-sm text-gray-600 mt-2">{household.otherInsurance}</p>
            )}
          </div>
        </div>

        {/* Vulnerable Groups */}
        {household.vulnerableGroups.length > 0 && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <h3 className="font-bold text-red-900 mb-3 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{language === 'sw' ? 'Vikundi vya Hatari' : 'Vulnerable Groups'}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {household.vulnerableGroups.map((group) => (
                <span key={group} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {group === 'pregnant' ? (language === 'sw' ? '🤱 Wajawazito' : '🤱 Pregnant') :
                   group === 'under5' ? (language === 'sw' ? '👶 Watoto <5' : '👶 Children <5') :
                   group === 'elderly' ? (language === 'sw' ? '👴 Wazee' : '👴 Elderly') :
                   group === 'disabled' ? (language === 'sw' ? '♿ Walemavu' : '♿ Disabled') :
                   group === 'chronic' ? (language === 'sw' ? '💊 Magonjwa ya Kudumu' : '💊 Chronic Illness') : group}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pregnant Women Details */}
        {mothers.length > 0 && (
          <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
            <h3 className="font-bold text-pink-900 mb-4 flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>{language === 'sw' ? 'Wajawazito' : 'Pregnant Women'}</span>
            </h3>

            <div className="space-y-4">
              {mothers.map((mother) => {
                const ancProgress = getANCProgress(mother);
                return (
                  <div key={mother.id} className="bg-white p-4 rounded-xl border border-pink-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{mother.name}</h4>
                        <p className="text-sm text-gray-600">
                          {language === 'sw' ? 'Wiki za ujauzito' : 'Gestational age'}: {mother.gestationalAge} {language === 'sw' ? 'wiki' : 'weeks'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        mother.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                        mother.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {mother.riskLevel === 'high' ? (language === 'sw' ? 'HATARI KUBWA' : 'HIGH RISK') :
                         mother.riskLevel === 'medium' ? (language === 'sw' ? 'HATARI YA KATI' : 'MEDIUM RISK') :
                         (language === 'sw' ? 'HATARI NDOGO' : 'LOW RISK')}
                      </span>
                    </div>

                    {/* ANC Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language === 'sw' ? 'Maendeleo ya ANC' : 'ANC Progress'}</span>
                        <span>{mother.ancVisitsCompleted}/{mother.ancVisitsRequired}</span>
                      </div>
                      <div className="w-full bg-pink-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            ancProgress.color === 'green' ? 'bg-green-500' :
                            ancProgress.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${ancProgress.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Next ANC Date */}
                    {mother.nextANCDate && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-pink-600" />
                        <span className="text-gray-600">
                          {language === 'sw' ? 'ANC ijayo' : 'Next ANC'}: {mother.nextANCDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {mother.riskFactors.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">
                          {language === 'sw' ? 'Sababu za Hatari' : 'Risk Factors'}:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {mother.riskFactors.slice(0, 3).map((factor) => (
                            <span key={factor} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                              {factor.replace('_', ' ')}
                            </span>
                          ))}
                          {mother.riskFactors.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              +{mother.riskFactors.length - 3} {language === 'sw' ? 'zaidi' : 'more'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Children Details */}
        {children.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <h3 className="font-bold text-purple-900 mb-4 flex items-center space-x-2">
              <Baby className="w-5 h-5" />
              <span>{language === 'sw' ? 'Watoto' : 'Children'}</span>
            </h3>

            <div className="space-y-4">
              {children.map((child) => {
                const vaccinationStatus = getVaccinationStatus(child);
                return (
                  <div key={child.id} className="bg-white p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{child.name}</h4>
                        <p className="text-sm text-gray-600">
                          {child.ageInMonths} {language === 'sw' ? 'miezi' : 'months'} • {child.sex === 'male' ? (language === 'sw' ? 'Mvulana' : 'Male') : (language === 'sw' ? 'Msichana' : 'Female')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        vaccinationStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                        vaccinationStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vaccinationStatus.status === 'up_to_date' ? (language === 'sw' ? 'CHANJO SAWA' : 'VACCINES UP TO DATE') :
                         vaccinationStatus.status === 'mostly_complete' ? (language === 'sw' ? 'KARIBU KUKAMILIKA' : 'MOSTLY COMPLETE') :
                         (language === 'sw' ? 'CHANJO ZILIZOCHELEWA' : 'VACCINES BEHIND')}
                      </span>
                    </div>

                    {/* Growth Status */}
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      {child.currentWeight && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{child.currentWeight}kg</div>
                          <div className="text-xs text-gray-600">{language === 'sw' ? 'Uzito' : 'Weight'}</div>
                        </div>
                      )}
                      {child.height && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{child.height}cm</div>
                          <div className="text-xs text-gray-600">{language === 'sw' ? 'Urefu' : 'Height'}</div>
                        </div>
                      )}
                      {child.muacColor && (
                        <div className="text-center">
                          <div className="text-lg">
                            {child.muacColor === 'green' ? '🟢' : child.muacColor === 'yellow' ? '🟡' : '🔴'}
                          </div>
                          <div className="text-xs text-gray-600">MUAC</div>
                        </div>
                      )}
                    </div>

                    {/* Next Vaccination */}
                    {child.nextVaccinationDue && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-600">
                          {language === 'sw' ? 'Chanjo ijayo' : 'Next vaccine'}: {child.nextVaccinationDue.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Phone className="w-5 h-5 text-gray-600" />
            <span>{language === 'sw' ? 'Taarifa za Mawasiliano' : 'Contact Information'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">{language === 'sw' ? 'Mkuu wa Kaya' : 'Head of Household'}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{household.headOfHousehold.name}</span>
                </div>
                {household.headOfHousehold.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{household.headOfHousehold.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {household.emergencyContact && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">{language === 'sw' ? 'Mtu wa Dharura' : 'Emergency Contact'}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{household.emergencyContact.name}</span>
                  </div>
                  {household.emergencyContact.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{household.emergencyContact.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visit History */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>{language === 'sw' ? 'Historia ya Ziara' : 'Visit History'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">{language === 'sw' ? 'Ziara ya Mwisho' : 'Last Visit'}</h4>
              <p className="text-sm text-gray-600">
                {household.lastVisit ? household.lastVisit.toLocaleDateString() : (language === 'sw' ? 'Hakuna ziara' : 'No visits yet')}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">{language === 'sw' ? 'Ziara Ijayo' : 'Next Visit'}</h4>
              <p className="text-sm text-gray-600">
                {household.nextVisit ? household.nextVisit.toLocaleDateString() : (language === 'sw' ? 'Haijapangwa' : 'Not scheduled')}
              </p>
            </div>
          </div>

          {household.notes && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">{language === 'sw' ? 'Maelezo' : 'Notes'}</h4>
              <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">{household.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onEditHousehold(household)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            <Edit className="w-5 h-5" />
            <span>{language === 'sw' ? 'Hariri Kaya' : 'Edit Household'}</span>
          </button>

          <button
            onClick={onRequestTransport}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold"
          >
            <Car className="w-5 h-5" />
            <span>{language === 'sw' ? 'Omba Usafiri' : 'Request Transport'}</span>
          </button>

          <button
            onClick={() => {
              // Schedule visit functionality
              console.log('Schedule visit for household:', household.id);
            }}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
          >
            <Calendar className="w-5 h-5" />
            <span>{language === 'sw' ? 'Panga Ziara' : 'Schedule Visit'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};