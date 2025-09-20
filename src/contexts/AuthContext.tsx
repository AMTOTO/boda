import React, { createContext, useContext, useState, useEffect } from 'react';
import { governanceService, AdministrativeUnit } from '../services/governanceService';

export type UserRole = 'community' | 'rider' | 'chv' | 'health_worker' | 'admin';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  location?: string;
  country?: string;
  administrativeUnits?: string[];
  administrativePath?: AdministrativeUnit[];
  village?: string;
  avatar?: string;
  qrCode?: string;
  isOnline?: boolean;
  points?: number;
  level?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  gpsLocation?: {lat: number, lng: number};
  registrationDate?: string;
  lastLogin?: string;
}

interface RegistrationData {
  name: string;
  role: UserRole;
  location: string;
  village?: string;
  dateOfBirth?: string;
  country?: string;
  administrativeUnits?: string[];
  administrativePath?: AdministrativeUnit[];
  gpsLocation?: {lat: number, lng: number};
  email?: string;
  password?: string;
  phone?: string;
  pin?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  setPreviewUser: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize user based on current path or stored data
    const initializeUser = () => {
      try {
        // Check for stored user data
        const storedUser = localStorage.getItem('paraboda_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoading(false);
          return;
        }

        // Set preview user based on current path
        const path = window.location.pathname;
        if (path.includes('/community')) {
          setPreviewUser('community');
        } else if (path.includes('/rider')) {
          setPreviewUser('rider');
        } else if (path.includes('/chv')) {
          setPreviewUser('chv');
        } else if (path.includes('/health-worker')) {
          setPreviewUser('health_worker');
        } else if (path.includes('/admin')) {
          setPreviewUser('admin');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing user:', error);
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const setPreviewUser = (role: UserRole) => {
    const previewUsers: Record<UserRole, User> = {
      'community': {
        id: 'preview-community',
        name: 'Amina Wanjiku',
        email: 'amina@preview.com',
        role: 'community',
        phone: '+254712345678',
        location: 'Kiambu Village, Kiambu County, Kenya',
        country: 'KE',
        administrativeUnits: ['KE-13', 'KE-13-09'],
        village: 'Kiambu Village',
        qrCode: 'QR-COMM-PREVIEW',
        points: 150,
        level: 'Bronze',
        preferredLanguage: 'sw',
        preferredCurrency: 'KES',
        gpsLocation: { lat: -1.1743, lng: 36.8356 },
        registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString()
      },
      'rider': {
        id: 'preview-rider',
        name: 'John Mwangi',
        email: 'john@preview.com',
        role: 'rider',
        phone: '+254723456789',
        location: 'Nakuru West, Nakuru County, Kenya',
        country: 'KE',
        administrativeUnits: ['KE-31'],
        village: 'Nakuru West',
        isOnline: true,
        points: 320,
        level: 'Silver',
        preferredLanguage: 'en',
        preferredCurrency: 'KES',
        gpsLocation: { lat: -0.3031, lng: 36.0800 },
        registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString()
      },
      'chv': {
        id: 'preview-chv',
        name: 'Sarah Akinyi',
        email: 'sarah@preview.com',
        role: 'chv',
        phone: '+254734567890',
        location: 'Kisumu Central, Kisumu County, Kenya',
        country: 'KE',
        administrativeUnits: ['KE-17'],
        village: 'Kisumu Central',
        points: 500,
        level: 'Gold',
        preferredLanguage: 'sw',
        preferredCurrency: 'KES',
        gpsLocation: { lat: -0.1022, lng: 34.7617 },
        registrationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString()
      },
      'health_worker': {
        id: 'preview-health',
        name: 'Nurse Mary Njeri',
        email: 'mary@preview.com',
        role: 'health_worker',
        phone: '+254756789012',
        location: 'Meru Town, Meru County, Kenya',
        country: 'KE',
        administrativeUnits: ['KE-26'],
        village: 'Meru Town',
        points: 400,
        level: 'Gold',
        preferredLanguage: 'en',
        preferredCurrency: 'KES',
        gpsLocation: { lat: 0.0467, lng: 37.6556 },
        registrationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString()
      },
      'admin': {
        id: 'preview-admin',
        name: 'Dr. Peter Kamau',
        email: 'peter@preview.com',
        role: 'admin',
        phone: '+254745678901',
        location: 'Nairobi Central, Nairobi County, Kenya',
        country: 'KE',
        administrativeUnits: ['KE-30'],
        village: 'Nairobi Central',
        points: 1000,
        level: 'Platinum',
        preferredLanguage: 'en',
        preferredCurrency: 'KES',
        gpsLocation: { lat: -1.2921, lng: 36.8219 },
        registrationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString()
      }
    };

    const previewUser = previewUsers[role];
    setUser(previewUser);
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('paraboda_user', JSON.stringify(previewUser));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock authentication - in production, this would call a real API
      const mockUsers: Record<string, User> = {
        'community@test.com': {
          id: '1',
          name: 'Amina Wanjiku',
          email: 'community@test.com',
          role: 'community',
          phone: '+254712345678',
          location: 'Kiambu Village, Kiambu County, Kenya',
          country: 'KE',
          administrativeUnits: ['KE-13', 'KE-13-09'],
          village: 'Kiambu Village',
          qrCode: 'QR-COMM-001',
          points: 150,
          level: 'Bronze',
          preferredLanguage: 'sw',
          preferredCurrency: 'KES',
          lastLogin: new Date().toISOString()
        },
        'rider@test.com': {
          id: '2',
          name: 'John Mwangi',
          email: 'rider@test.com',
          role: 'rider',
          phone: '+254723456789',
          location: 'Nakuru West, Nakuru County, Kenya',
          country: 'KE',
          administrativeUnits: ['KE-31'],
          village: 'Nakuru West',
          isOnline: true,
          points: 320,
          level: 'Silver',
          preferredLanguage: 'en',
          preferredCurrency: 'KES',
          lastLogin: new Date().toISOString()
        },
        'chv@test.com': {
          id: '3',
          name: 'Sarah Akinyi',
          email: 'chv@test.com',
          role: 'chv',
          phone: '+254734567890',
          location: 'Kisumu Central, Kisumu County, Kenya',
          country: 'KE',
          administrativeUnits: ['KE-17'],
          village: 'Kisumu Central',
          points: 500,
          level: 'Gold',
          preferredLanguage: 'sw',
          preferredCurrency: 'KES',
          lastLogin: new Date().toISOString()
        },
        'admin@test.com': {
          id: '4',
          name: 'Dr. Peter Kamau',
          email: 'admin@test.com',
          role: 'admin',
          phone: '+254745678901',
          location: 'Nairobi Central, Nairobi County, Kenya',
          country: 'KE',
          administrativeUnits: ['KE-30'],
          village: 'Nairobi Central',
          points: 1000,
          level: 'Platinum',
          preferredLanguage: 'en',
          preferredCurrency: 'KES',
          lastLogin: new Date().toISOString()
        },
        'health@test.com': {
          id: '5',
          name: 'Nurse Mary Njeri',
          email: 'health@test.com',
          role: 'health_worker',
          phone: '+254756789012',
          location: 'Meru Town, Meru County, Kenya',
          country: 'KE',
          administrativeUnits: ['KE-26'],
          village: 'Meru Town',
          points: 400,
          level: 'Gold',
          preferredLanguage: 'en',
          preferredCurrency: 'KES',
          lastLogin: new Date().toISOString()
        }
      };

      const mockUser = mockUsers[email];
      if (mockUser && password === 'password') {
        mockUser.lastLogin = new Date().toISOString();
        setUser(mockUser);
        localStorage.setItem('paraboda_user', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegistrationData) => {
    setIsLoading(true);
    
    try {
      // Mock registration - in production, this would call a real API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('paraboda_registered_users') || '[]');
      const identifier = data.email || data.phone;
      
      if (existingUsers.some((u: any) => u.email === data.email || u.phone === data.phone)) {
        throw new Error('User already exists with this email or phone number');
      }
      
      // Create new user with enhanced data
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        location: data.location,
        village: data.village,
        country: data.country,
        administrativeUnits: data.administrativeUnits,
        administrativePath: data.administrativePath,
        gpsLocation: data.gpsLocation,
        qrCode: `QR-${data.role.toUpperCase()}-${Date.now()}`,
        points: 0,
        level: 'Bronze',
        preferredLanguage: data.preferredLanguage || 'en',
        preferredCurrency: data.preferredCurrency || 'KES',
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isOnline: data.role === 'rider' ? false : undefined
      };
      
      // Store user in mock database
      existingUsers.push(newUser);
      localStorage.setItem('paraboda_registered_users', JSON.stringify(existingUsers));
      
      // Set as current user
      setUser(newUser);
      localStorage.setItem('paraboda_user', JSON.stringify(newUser));
      
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    try {
      localStorage.setItem('paraboda_user', JSON.stringify(updatedUser));
      
      // Update in registered users list
      const existingUsers = JSON.parse(localStorage.getItem('paraboda_registered_users') || '[]');
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('paraboda_registered_users', JSON.stringify(existingUsers));
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('paraboda_user');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      setPreviewUser,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};