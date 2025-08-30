export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  notes?: string;
  warningSignsPresent: string[];
  copingStrategiesUsed: string[];
  timestamp: number;
}

export interface MoodTrend {
  averageMood: number;
  trend: 'improving' | 'declining' | 'stable';
  riskLevel: 'low' | 'moderate' | 'high';
  patternInsights: string[];
}

export interface CrisisAlert {
  id: string;
  level: 'mild' | 'moderate' | 'severe';
  timestamp: number;
  triggers: string[];
  recommendedActions: string[];
  emergencyContactsNotified: boolean;
}
