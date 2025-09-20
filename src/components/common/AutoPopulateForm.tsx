import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, MapPin, Phone, Mail } from 'lucide-react';

interface AutoPopulateFormProps {
  onDataPopulated: (data: {
    name: string;
    phone: string;
    location: string;
    email?: string;
  }) => void;
  showPreview?: boolean;
}

export const AutoPopulateForm: React.FC<AutoPopulateFormProps> = ({
  onDataPopulated,
  showPreview = true
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    if (user) {
      onDataPopulated({
        name: user.name,
        phone: user.phone || '',
        location: user.location || '',
        email: user.email
      });
    }
  }, [user, onDataPopulated]);

  if (!showPreview || !user) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-blue-900 mb-2">
            {language === 'sw' ? 'Taarifa Zimejaziwa Kiotomatiki' : 'Auto-Populated Information'}
          </h4>
          <div className="space-y-1 text-sm text-blue-800">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{user.name}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};