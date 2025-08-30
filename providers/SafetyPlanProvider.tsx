import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { SafetyPlan } from '@/types/SafetyPlan';

const STORAGE_KEY = 'safety_plan';

const defaultSafetyPlan: SafetyPlan = {
  warningSigns: [],
  copingStrategies: [],
  supportContacts: [],
  safePlaces: [],
  reasonsForLiving: [],
};

export const [SafetyPlanProvider, useSafetyPlan] = createContextHook(() => {
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan>(defaultSafetyPlan);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSafetyPlan();
  }, []);

  const loadSafetyPlan = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSafetyPlan(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading safety plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSafetyPlan = async (newPlan: SafetyPlan) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
      setSafetyPlan(newPlan);
    } catch (error) {
      console.error('Error saving safety plan:', error);
    }
  };

  return {
    safetyPlan,
    updateSafetyPlan,
    isLoading,
  };
});
