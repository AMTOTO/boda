import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export interface RewardEvent {
  id: string;
  type:
    | 'ride_completed'
    | 'savings_added'
    | 'loan_repayment'
    | 'sha_contribution'
    | 'emergency_request'
    | 'chv_visit'
    | 'approval_action'
    | 'alert_submit'
    | 'household_visit'
    | 'vaccination_given'
    | 'patient_added';
  points: number;
  meta?: Record<string, any>;
  at: string;
  description: string;
}

export function useRewards() {
  const { user } = useAuth();
  const { addNotification } = useData();
  const [rewardEvents, setRewardEvents] = useState<RewardEvent[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Initialize with user's current points
    if (user?.points) {
      setTotalPoints(user.points);
    }
  }, [user?.points]);

  const addReward = (event: Omit<RewardEvent, 'id' | 'at'>) => {
    const newEvent: RewardEvent = {
      ...event,
      id: `reward_${Date.now()}`,
      at: new Date().toISOString()
    };

    setRewardEvents(prev => [newEvent, ...prev]);
    setTotalPoints(prev => prev + event.points);

    // Update user points if user exists
    if (user && user.points !== undefined) {
      user.points += event.points;
    }

    // Add notification
    addNotification({
      title: 'Points Earned!',
      message: `You earned ${event.points} points: ${event.description}`,
      type: 'success',
      read: false
    });

    return newEvent;
  };

  const getRewardsByType = (type: RewardEvent['type']) => {
    return rewardEvents.filter(event => event.type === type);
  };

  const getTotalPointsByType = (type: RewardEvent['type']) => {
    return rewardEvents
      .filter(event => event.type === type)
      .reduce((sum, event) => sum + event.points, 0);
  };

  const getRecentRewards = (limit: number = 5) => {
    return rewardEvents.slice(0, limit);
  };

  // Predefined reward calculations
  const rewardCalculations = {
    ride_completed: (distanceKm: number) => 10 + distanceKm,
    savings_added: (amount: number) => Math.floor(amount / 100), // 1 point per 100 KSh
    loan_repayment: (amount: number) => Math.floor(amount / 200), // 1 point per 200 KSh
    sha_contribution: () => 15,
    emergency_request: () => 20,
    chv_visit: () => 10,
    approval_action: () => 5,
    alert_submit: () => 8,
    household_visit: () => 12,
    vaccination_given: () => 15,
    patient_added: () => 5
  };

  const calculateReward = (type: RewardEvent['type'], meta?: Record<string, any>) => {
    const calculator = rewardCalculations[type];
    if (typeof calculator === 'function') {
      if (type === 'ride_completed' && meta?.distanceKm) {
        return calculator(meta.distanceKm);
      } else if ((type === 'savings_added' || type === 'loan_repayment') && meta?.amount) {
        return calculator(meta.amount);
      } else {
        return calculator();
      }
    }
    return 0;
  };

  return {
    rewardEvents,
    totalPoints,
    addReward,
    getRewardsByType,
    getTotalPointsByType,
    getRecentRewards,
    calculateReward
  };
}