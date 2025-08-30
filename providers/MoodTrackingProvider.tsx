import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { MoodEntry, MoodTrend, CrisisAlert } from '@/types/MoodTracking';

const MOOD_STORAGE_KEY = 'mood_entries';
const CRISIS_ALERTS_KEY = 'crisis_alerts';

export const [MoodTrackingProvider, useMoodTracking] = createContextHook(() => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    try {
      const [storedMoods, storedAlerts] = await Promise.all([
        AsyncStorage.getItem(MOOD_STORAGE_KEY),
        AsyncStorage.getItem(CRISIS_ALERTS_KEY)
      ]);

      if (storedMoods) {
        setMoodEntries(JSON.parse(storedMoods));
      }
      if (storedAlerts) {
        setCrisisAlerts(JSON.parse(storedAlerts));
      }
    } catch (error) {
      console.error('Error loading mood data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMoodEntry = async (mood: number, notes?: string, warningSignsPresent: string[] = [], copingStrategiesUsed: string[] = [], photoUri?: string) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood,
      notes,
      warningSignsPresent,
      copingStrategiesUsed,
      timestamp: Date.now(),
      photoUri
    };

    const updatedEntries = [newEntry, ...moodEntries].slice(0, 100); // Keep last 100 entries
    setMoodEntries(updatedEntries);

    try {
      await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedEntries));
      
      // Check for crisis patterns after adding new entry
      await checkForCrisisPatterns(updatedEntries);
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }
  };

  const checkForCrisisPatterns = async (entries: MoodEntry[]) => {
    if (entries.length < 3) return;

    const recentEntries = entries.slice(0, 7); // Last 7 entries
    const averageMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    const latestMood = entries[0].mood;

    // Crisis detection logic
    let crisisLevel: 'mild' | 'moderate' | 'severe' | null = null;
    const triggers: string[] = [];
    const recommendedActions: string[] = [];

    // Severe crisis: Very low mood (1-3) or significant decline
    if (latestMood <= 3 || (averageMood <= 4 && latestMood <= 4)) {
      crisisLevel = 'severe';
      triggers.push('Very low mood detected');
      recommendedActions.push('Contact emergency services or crisis hotline immediately');
      recommendedActions.push('Reach out to your support contacts');
      recommendedActions.push('Go to a safe place from your safety plan');
    }
    // Moderate crisis: Low mood (4-5) with warning signs
    else if (latestMood <= 5 && entries[0].warningSignsPresent.length > 0) {
      crisisLevel = 'moderate';
      triggers.push('Low mood with warning signs present');
      recommendedActions.push('Review your coping strategies');
      recommendedActions.push('Consider contacting a support person');
      recommendedActions.push('Use grounding techniques');
    }
    // Mild concern: Declining trend
    else if (averageMood < 6 && recentEntries.length >= 3) {
      const trend = calculateTrend(recentEntries);
      if (trend === 'declining') {
        crisisLevel = 'mild';
        triggers.push('Declining mood trend detected');
        recommendedActions.push('Practice self-care activities');
        recommendedActions.push('Review your reasons for living');
        recommendedActions.push('Consider scheduling time with supportive people');
      }
    }

    if (crisisLevel) {
      const alert: CrisisAlert = {
        id: Date.now().toString(),
        level: crisisLevel,
        timestamp: Date.now(),
        triggers,
        recommendedActions,
        emergencyContactsNotified: false
      };

      const updatedAlerts = [alert, ...crisisAlerts].slice(0, 50);
      setCrisisAlerts(updatedAlerts);

      try {
        await AsyncStorage.setItem(CRISIS_ALERTS_KEY, JSON.stringify(updatedAlerts));
      } catch (error) {
        console.error('Error saving crisis alert:', error);
      }
    }
  };

  const calculateTrend = (entries: MoodEntry[]): 'improving' | 'declining' | 'stable' => {
    if (entries.length < 3) return 'stable';

    const recent = entries.slice(0, 3);
    const older = entries.slice(3, 6);

    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, entry) => sum + entry.mood, 0) / older.length : recentAvg;

    const difference = recentAvg - olderAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  };

  const getMoodTrend = (): MoodTrend => {
    if (moodEntries.length === 0) {
      return {
        averageMood: 5,
        trend: 'stable',
        riskLevel: 'low',
        patternInsights: []
      };
    }

    const recentEntries = moodEntries.slice(0, 14); // Last 2 weeks
    const averageMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    const trend = calculateTrend(recentEntries);

    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    const patternInsights: string[] = [];

    if (averageMood <= 4) {
      riskLevel = 'high';
      patternInsights.push('Your mood has been consistently low recently');
    } else if (averageMood <= 6) {
      riskLevel = 'moderate';
      patternInsights.push('Your mood has been below average');
    }

    if (trend === 'declining') {
      riskLevel = riskLevel === 'low' ? 'moderate' : 'high';
      patternInsights.push('Your mood trend is declining');
    } else if (trend === 'improving') {
      patternInsights.push('Your mood is improving - keep up the good work!');
    }

    // Analyze warning signs patterns
    const warningSignsCount = recentEntries.reduce((count, entry) => count + entry.warningSignsPresent.length, 0);
    if (warningSignsCount > recentEntries.length) {
      patternInsights.push('You\'ve been experiencing multiple warning signs');
      riskLevel = riskLevel === 'low' ? 'moderate' : 'high';
    }

    return {
      averageMood,
      trend,
      riskLevel,
      patternInsights
    };
  };

  const dismissAlert = async (alertId: string) => {
    const updatedAlerts = crisisAlerts.filter(alert => alert.id !== alertId);
    setCrisisAlerts(updatedAlerts);

    try {
      await AsyncStorage.setItem(CRISIS_ALERTS_KEY, JSON.stringify(updatedAlerts));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const getActiveAlerts = () => {
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    return crisisAlerts.filter(alert => alert.timestamp > twentyFourHoursAgo);
  };

  return {
    moodEntries,
    crisisAlerts,
    isLoading,
    addMoodEntry,
    getMoodTrend,
    dismissAlert,
    getActiveAlerts
  };
});
