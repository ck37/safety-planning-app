export interface NotificationPreferences {
  enabled: boolean;
  dailyCheckIn: {
    enabled: boolean;
    time: string; // HH:MM format
  };
  moodReminders: {
    enabled: boolean;
    frequency: 'daily' | 'twice-daily' | 'weekly';
    times: string[]; // Array of HH:MM times
  };
  crisisSupport: {
    enabled: boolean;
    proactiveReminders: boolean; // Send supportive messages during low mood periods
  };
  safetyPlanReminders: {
    enabled: boolean;
    reviewFrequency: 'weekly' | 'monthly';
  };
  encouragementMessages: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
  };
}

export interface SmartNotification {
  id: string;
  type: 'daily-checkin' | 'mood-reminder' | 'crisis-support' | 'safety-plan-review' | 'encouragement' | 'pattern-alert';
  title: string;
  body: string;
  scheduledTime?: number; // timestamp
  priority: 'low' | 'normal' | 'high' | 'critical';
  data?: {
    moodTrend?: string;
    riskLevel?: string;
    suggestedActions?: string[];
  };
  sent: boolean;
  timestamp: number;
}

export interface NotificationTrigger {
  id: string;
  type: 'time-based' | 'mood-pattern' | 'inactivity' | 'crisis-level';
  conditions: {
    timeOfDay?: string;
    daysSinceLastEntry?: number;
    moodThreshold?: number;
    crisisLevel?: 'mild' | 'moderate' | 'severe';
    trendPattern?: 'declining' | 'stable' | 'improving';
  };
  message: {
    title: string;
    body: string;
    actionText?: string;
  };
  enabled: boolean;
}

export interface NotificationAnalytics {
  totalSent: number;
  totalOpened: number;
  openRate: number;
  typeBreakdown: {
    [key: string]: {
      sent: number;
      opened: number;
    };
  };
  effectivenessScore: number; // Based on user engagement after notifications
}
