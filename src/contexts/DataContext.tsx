import React, { createContext, useContext, useState, useEffect } from 'react';

interface RideRequest {
  id: string;
  type: 'emergency' | 'vaccine' | 'mch' | 'routine';
  patientName: string;
  pickup: string;
  destination: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  requestedBy: string;
  riderId?: string;
  cost: number;
  timestamp: Date;
  notes?: string;
}

interface HealthAlert {
  id: string;
  type: 'gbv' | 'malnutrition' | 'unsafe_delivery' | 'disease_outbreak';
  location: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  status: 'new' | 'investigating' | 'resolved';
  timestamp: Date;
  gpsCoords?: { lat: number; lng: number };
}

interface MythReport {
  id: string;
  category: 'vaccine' | 'covid' | 'maternal' | 'general';
  content: string;
  location: string;
  reportedBy: string;
  verified: boolean;
  debunked: boolean;
  timestamp: Date;
  reach?: number;
}

interface YouthMission {
  id: string;
  title: string;
  description: string;
  type: 'health_screening' | 'vaccination' | 'education' | 'quiz';
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'expired';
  deadline: Date;
  participants: number;
}

interface Household {
  id: string;
  name: string;
  location: string;
  members: number;
  adults: number;
  children: number;
  pregnantWomen: number;
  childrenUnder5: number;
  status: 'active' | 'priority' | 'mch_due';
  notes?: string;
  lastVisit?: Date;
  nextVisit?: Date;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

// New interfaces for contributions
interface ItemContribution {
  id: string;
  description: string;
  value: number;
  photoUrl?: string;
  timestamp: Date;
}

interface AnimalContribution {
  id: string;
  animalType: 'cow' | 'goat' | 'sheep' | 'chicken' | 'other';
  quantity: number;
  estimatedValuePerAnimal: number;
  totalValue: number;
  timestamp: Date;
}


interface DataContextType {
  rideRequests: RideRequest[];
  healthAlerts: HealthAlert[];
  mythReports: MythReport[];
  youthMissions: YouthMission[];
  households: Household[];
  notifications: Notification[];
  communityFunds: number;
  itemContributions: ItemContribution[];
  animalContributions: AnimalContribution[];
  addRideRequest: (request: Omit<RideRequest, 'id' | 'timestamp'>) => void;
  updateRideRequest: (id: string, updates: Partial<RideRequest>) => void;
  addHealthAlert: (alert: Omit<HealthAlert, 'id' | 'timestamp'>) => void;
  updateHealthAlert: (id: string, updates: Partial<HealthAlert>) => void;
  addMythReport: (report: Omit<MythReport, 'id' | 'timestamp'>) => void;
  updateMythReport: (id: string, updates: Partial<MythReport>) => void;
  addHousehold: (household: Omit<Household, 'id'>) => void;
  updateHousehold: (id: string, updates: Partial<Household>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  addToMSupu: (amount: number) => void;
  contributeItems: (description: string, value: number, photoUrl?: string) => void;
  contributeAnimals: (type: AnimalContribution['animalType'], quantity: number, estimatedValuePerAnimal: number) => void;
  startQuizSession: () => void;
  recordMythWithVoice: (audioBlob: Blob) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return {
    ...context,
    communityFunds: context.communityFunds ?? 12500 // Fallback value
  };
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);
  const [mythReports, setMythReports] = useState<MythReport[]>([]);
  const [youthMissions, setYouthMissions] = useState<YouthMission[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [communityFunds, setCommunityFunds] = useState<number>(12500);
  const [itemContributions, setItemContributions] = useState<ItemContribution[]>([]);
  const [animalContributions, setAnimalContributions] = useState<AnimalContribution[]>([]);

  useEffect(() => {
    // Initialize with mock data
    setRideRequests([
      {
        id: '1',
        type: 'emergency',
        patientName: 'Grace Muthoni',
        pickup: 'Kiambu Village',
        destination: 'Kiambu District Hospital',
        urgency: 'high',
        status: 'pending',
        requestedBy: 'CHV Sarah',
        cost: 800,
        timestamp: new Date(),
        notes: 'Pregnant woman in labor'
      },
      {
        id: '2',
        type: 'vaccine',
        patientName: 'Baby Michael',
        pickup: 'Nakuru Town',
        destination: 'Nakuru Health Center',
        urgency: 'medium',
        status: 'completed',
        requestedBy: 'Mother Jane',
        riderId: '2',
        cost: 300,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ]);

    setHealthAlerts([
      {
        id: '1',
        type: 'malnutrition',
        location: 'Kisumu Rural',
        description: 'Multiple cases of child malnutrition reported',
        priority: 'high',
        reportedBy: 'Rider John',
        status: 'new',
        timestamp: new Date(),
        gpsCoords: { lat: -0.1022, lng: 34.7617 }
      }
    ]);

    setMythReports([
      {
        id: '1',
        category: 'vaccine',
        content: 'Vaccines cause autism in children',
        location: 'Meru County',
        reportedBy: 'Youth Champion',
        verified: true,
        debunked: false,
        timestamp: new Date(),
        reach: 150
      }
    ]);

    setYouthMissions([
      {
        id: '1',
        title: 'HPV Vaccination Drive',
        description: 'Get your HPV vaccine at the local health center',
        type: 'vaccination',
        points: 50,
        difficulty: 'easy',
        status: 'active',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        participants: 23
      },
      {
        id: '2',
        title: 'Health Quiz Challenge',
        description: 'Test your knowledge about maternal health',
        type: 'quiz',
        points: 25,
        difficulty: 'medium',
        status: 'active',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        participants: 45
      }
    ]);

    setHouseholds([
      {
        id: '1',
        name: 'Wanjiku Family',
        location: 'Kiambu Village, Zone A',
        members: 5,
        adults: 2,
        children: 3,
        pregnantWomen: 1,
        childrenUnder5: 2,
        status: 'active',
        lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextVisit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Mwangi Family',
        location: 'Nakuru West, Zone C',
        members: 4,
        adults: 2,
        children: 2,
        pregnantWomen: 0,
        childrenUnder5: 1,
        status: 'priority',
        notes: 'Child vaccination overdue, malnutrition risk detected',
        lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Akinyi Family',
        location: 'Kisumu Central, Zone B',
        members: 6,
        adults: 2,
        children: 4,
        pregnantWomen: 1,
        childrenUnder5: 2,
        status: 'mch_due',
        notes: 'ANC visit due in 3 days, baby needs 3rd dose vaccine',
        nextVisit: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    ]);

    setNotifications([
      {
        id: '1',
        title: 'Transport Request Approved',
        message: 'Your emergency transport request has been approved',
        type: 'success',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        title: 'Vaccination Reminder',
        message: 'Child vaccination due in 2 days',
        type: 'warning',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false
      }
    ]);
  }, []);

  const addRideRequest = (request: Omit<RideRequest, 'id' | 'timestamp'>) => {
    const newRequest: RideRequest = {
      ...request,
      id: `req_${Date.now()}`,
      timestamp: new Date()
    };
    setRideRequests(prev => [newRequest, ...prev]);

    // Add notification
    addNotification({
      title: 'Transport Request Submitted',
      message: `Your ${request.type} transport request has been submitted for approval`,
      type: 'info',
      read: false
    });
  };

  const updateRideRequest = (id: string, updates: Partial<RideRequest>) => {
    setRideRequests(prev => 
      prev.map(req => req.id === id ? { ...req, ...updates } : req)
    );
  };

  const addHealthAlert = (alert: Omit<HealthAlert, 'id' | 'timestamp'>) => {
    const newAlert: HealthAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      timestamp: new Date()
    };
    setHealthAlerts(prev => [newAlert, ...prev]);

    // Add notification
    addNotification({
      title: 'Emergency Report Submitted',
      message: `${alert.type.replace('_', ' ')} case reported successfully`,
      type: 'warning',
      read: false
    });
  };

  const updateHealthAlert = (id: string, updates: Partial<HealthAlert>) => {
    setHealthAlerts(prev => 
      prev.map(alert => alert.id === id ? { ...alert, ...updates } : alert)
    );
  };

  const addMythReport = (report: Omit<MythReport, 'id' | 'timestamp'>) => {
    const newReport: MythReport = {
      ...report,
      id: `myth_${Date.now()}`,
      timestamp: new Date()
    };
    setMythReports(prev => [newReport, ...prev]);

    // Add notification
    addNotification({
      title: 'Myth Report Submitted',
      message: `${report.category} myth reported for verification`,
      type: 'info',
      read: false
    });
  };

  const updateMythReport = (id: string, updates: Partial<MythReport>) => {
    setMythReports(prev => 
      prev.map(myth => myth.id === id ? { ...myth, ...updates } : myth)
    );
  };

  const addHousehold = (household: Omit<Household, 'id'>) => {
    const newHousehold: Household = {
      ...household,
      id: `household_${Date.now()}`
    };
    setHouseholds(prev => [newHousehold, ...prev]);

    // Add notification
    addNotification({
      title: 'Household Added',
      message: `${household.name} has been added to your management list`,
      type: 'success',
      read: false
    });
  };

  const updateHousehold = (id: string, updates: Partial<Household>) => {
    setHouseholds(prev => 
      prev.map(household => household.id === id ? { ...household, ...updates } : household)
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const addToMSupu = (amount: number) => {
    setCommunityFunds(prev => prev + amount);
    addNotification({
      title: 'M-Supu Contribution',
      message: `KSh ${amount} added to community fund`,
      type: 'success',
      read: false
    });
  };

  const contributeItems = (description: string, value: number, photoUrl?: string) => {
    const newItemContribution: ItemContribution = {
      id: `item_${Date.now()}`,
      description,
      value,
      photoUrl,
      timestamp: new Date()
    };
    setItemContributions(prev => [newItemContribution, ...prev]);
    setCommunityFunds(prev => prev + value);
    addNotification({
      title: 'Item Contribution',
      message: `${description} contributed (value: KSh ${value})`,
      type: 'success',
      read: false
    });
  };

  const contributeAnimals = (type: AnimalContribution['animalType'], quantity: number, estimatedValuePerAnimal: number) => {
    const totalValue = quantity * estimatedValuePerAnimal;
    const newAnimalContribution: AnimalContribution = {
      id: `animal_${Date.now()}`,
      animalType: type,
      quantity,
      estimatedValuePerAnimal,
      totalValue,
      timestamp: new Date()
    };
    setAnimalContributions(prev => [newAnimalContribution, ...prev]);
    setCommunityFunds(prev => prev + totalValue);
    addNotification({
      title: 'Animal Contribution',
      message: `${quantity} ${type}(s) contributed (Total Value: KSh ${totalValue})`,
      type: 'success',
      read: false
    });
  };


  const startQuizSession = () => {
    addNotification({
      title: 'Quiz Session Started',
      message: 'Youth health education quiz session has begun',
      type: 'info',
      read: false
    });
  };

  const recordMythWithVoice = (audioBlob: Blob) => {
    // Simulate voice recording processing
    addNotification({
      title: 'Voice Recording Processed',
      message: 'Your myth report voice recording has been processed by AI',
      type: 'info',
      read: false
    });
  };

  return (
    <DataContext.Provider value={{
      rideRequests,
      healthAlerts,
      mythReports,
      youthMissions,
      households,
      notifications,
      communityFunds,
      itemContributions,
      animalContributions,
      addRideRequest,
      updateRideRequest,
      addHealthAlert,
      updateHealthAlert,
      addMythReport,
      updateMythReport,
      addHousehold,
      updateHousehold,
      addNotification,
      markNotificationAsRead,
      addToMSupu,
      contributeItems,
      contributeAnimals,
      startQuizSession,
      recordMythWithVoice
    }}>
      {children}
    </DataContext.Provider>
  );
};