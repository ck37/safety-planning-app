import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import createContextHook from '@nkzw/create-context-hook';
import { 
  NotificationPreferences, 
  SmartNotification, 
  NotificationAnalytics 
} from '@/types/SmartNotifications';
import { useMoodTracking } from './MoodTrackingProvider';

const NOTIFICATION_PREFERENCES_KEY = 'notification_preferences';
const NOTIFICATION_HISTORY_KEY = 'notification_history';
const NOTIFICATION_ANALYTICS_KEY = 'notification_analytics';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  dailyCheckIn: {
    enabled: true,
    time: '19:00', // 7 PM default
  },
  moodReminders: {
    enabled: true,
    frequency: 'daily',
    times: ['10:00', '18:00'], // 10 AM and 6 PM
  },
  crisisSupport: {
    enabled: true,
    proactiveReminders: true,
  },
  safetyPlanReminders: {
    enabled: true,
    reviewFrequency: 'weekly',
  },
  encouragementMessages: {
    enabled: true,
    frequency: 'daily',
  },
};

export const [SmartNotificationsProvider, useSmartNotifications] = createContextHook(() => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [notificationHistory, setNotificationHistory] = useState<SmartNotification[]>([]);
  const [analytics, setAnalytics] = useState<NotificationAnalytics>({
    totalSent: 0,
    totalOpened: 0,
    openRate: 0,
    typeBreakdown: {},
    effectivenessScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');
  
  const moodTracking = useMoodTracking();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    initializeNotifications();
    loadNotificationData();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(handleNotificationReceived);
    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Monitor mood changes for smart triggers
  useEffect(() => {
    if (!isLoading && moodTracking && !moodTracking.isLoading) {
      checkForSmartTriggers();
    }
  }, [moodTracking?.moodEntries, moodTracking?.crisisAlerts, isLoading, moodTracking]);

  const initializeNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setPermissionStatus(finalStatus);

      if (finalStatus === 'granted') {
        await scheduleDefaultNotifications();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const loadNotificationData = async () => {
    try {
      const [storedPreferences, storedHistory, storedAnalytics] = await Promise.all([
        AsyncStorage.getItem(NOTIFICATION_PREFERENCES_KEY),
        AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY),
        AsyncStorage.getItem(NOTIFICATION_ANALYTICS_KEY)
      ]);

      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
      if (storedHistory) {
        setNotificationHistory(JSON.parse(storedHistory));
      }
      if (storedAnalytics) {
        setAnalytics(JSON.parse(storedAnalytics));
      }
    } catch (error) {
      console.error('Error loading notification data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationReceived = (notification: Notifications.Notification) => {
    // Handle notification received while app is in foreground
    console.log('Notification received:', notification);
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    // Handle user interaction with notification
    const notificationId = response.notification.request.identifier;
    trackNotificationOpened(notificationId);
    
    // Navigate to appropriate screen based on notification type
    const notificationData = response.notification.request.content.data;
    if (notificationData?.type === 'mood-reminder') {
      // Navigate to mood tracking screen
    } else if (notificationData?.type === 'crisis-support') {
      // Navigate to crisis resources
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);

    try {
      await AsyncStorage.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(updatedPreferences));
      
      // Reschedule notifications based on new preferences
      if (updatedPreferences.enabled) {
        await scheduleDefaultNotifications();
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const scheduleDefaultNotifications = async () => {
    if (!preferences.enabled || permissionStatus !== 'granted') return;

    // Cancel existing scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule daily check-in
    if (preferences.dailyCheckIn.enabled) {
      await scheduleNotification({
        id: 'daily-checkin',
        type: 'daily-checkin',
        title: 'Daily Check-in',
        body: 'How are you feeling today? Take a moment to track your mood.',
        priority: 'normal',
        sent: false,
        timestamp: Date.now(),
      }, {
        hour: parseInt(preferences.dailyCheckIn.time.split(':')[0]),
        minute: parseInt(preferences.dailyCheckIn.time.split(':')[1]),
        repeats: true,
      });
    }

    // Schedule mood reminders
    if (preferences.moodReminders.enabled) {
      for (const time of preferences.moodReminders.times) {
        await scheduleNotification({
          id: `mood-reminder-${time}`,
          type: 'mood-reminder',
          title: 'Mood Check',
          body: 'A quick mood check can help you stay aware of your mental health.',
          priority: 'normal',
          sent: false,
          timestamp: Date.now(),
        }, {
          hour: parseInt(time.split(':')[0]),
          minute: parseInt(time.split(':')[1]),
          repeats: true,
        });
      }
    }

    // Schedule safety plan reminders
    if (preferences.safetyPlanReminders.enabled) {
      const frequency = preferences.safetyPlanReminders.reviewFrequency === 'weekly' ? 7 : 30;
      await scheduleNotification({
        id: 'safety-plan-review',
        type: 'safety-plan-review',
        title: 'Safety Plan Review',
        body: 'Take a few minutes to review and update your safety plan.',
        priority: 'normal',
        sent: false,
        timestamp: Date.now(),
      }, {
        hour: 10,
        minute: 0,
        repeats: true,
        intervalDays: frequency,
      });
    }
  };

  const scheduleNotification = async (
    notification: SmartNotification, 
    schedule: {
      hour: number;
      minute: number;
      repeats?: boolean;
      intervalDays?: number;
    }
  ) => {
    try {
      const trigger: any = schedule.repeats
        ? {
            hour: schedule.hour,
            minute: schedule.minute,
            repeats: true,
          }
        : {
            seconds: calculateSecondsUntil(schedule.hour, schedule.minute),
          };

      await Notifications.scheduleNotificationAsync({
        identifier: notification.id,
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            type: notification.type,
            priority: notification.priority,
            ...notification.data,
          },
        },
        trigger,
      });

      // Add to history
      const updatedHistory = [notification, ...notificationHistory].slice(0, 100);
      setNotificationHistory(updatedHistory);
      await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(updatedHistory));

    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const calculateSecondsUntil = (hour: number, minute: number): number => {
    const now = new Date();
    const target = new Date();
    target.setHours(hour, minute, 0, 0);

    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    return Math.floor((target.getTime() - now.getTime()) / 1000);
  };

  const checkForSmartTriggers = async () => {
    if (!moodTracking || !preferences.enabled) return;

    const moodTrend = moodTracking.getMoodTrend();
    const lastEntry = moodTracking.moodEntries[0];

    // Check for inactivity (no mood entry in 2+ days)
    if (preferences.moodReminders.enabled) {
      const daysSinceLastEntry = lastEntry 
        ? Math.floor((Date.now() - lastEntry.timestamp) / (1000 * 60 * 60 * 24))
        : 999;

      if (daysSinceLastEntry >= 2) {
        await sendSmartNotification({
          id: `inactivity-${Date.now()}`,
          type: 'mood-reminder',
          title: 'We miss you!',
          body: `You haven't checked in for ${daysSinceLastEntry} days. How are you feeling?`,
          priority: 'normal',
          sent: false,
          timestamp: Date.now(),
        });
      }
    }

    // Check for declining mood patterns
    if (preferences.crisisSupport.enabled && preferences.crisisSupport.proactiveReminders) {
      if (moodTrend.trend === 'declining' && moodTrend.riskLevel !== 'low') {
        await sendSmartNotification({
          id: `pattern-alert-${Date.now()}`,
          type: 'pattern-alert',
          title: 'Gentle Reminder',
          body: 'Your mood has been declining lately. Remember, you have tools and people who care about you.',
          priority: 'high',
          data: {
            moodTrend: moodTrend.trend,
            riskLevel: moodTrend.riskLevel,
            suggestedActions: ['Review your coping strategies', 'Reach out to a support person', 'Practice self-care'],
          },
          sent: false,
          timestamp: Date.now(),
        });
      }
    }

    // Send encouragement for improving trends
    if (preferences.encouragementMessages.enabled && moodTrend.trend === 'improving') {
      const shouldSendEncouragement = Math.random() < 0.3; // 30% chance to avoid spam
      if (shouldSendEncouragement) {
        await sendSmartNotification({
          id: `encouragement-${Date.now()}`,
          type: 'encouragement',
          title: 'Great Progress!',
          body: 'Your mood has been improving. Keep up the great work with your self-care!',
          priority: 'low',
          sent: false,
          timestamp: Date.now(),
        });
      }
    }
  };

  const sendSmartNotification = async (notification: SmartNotification) => {
    if (permissionStatus !== 'granted') return;

    try {
      await Notifications.scheduleNotificationAsync({
        identifier: notification.id,
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            type: notification.type,
            priority: notification.priority,
            ...notification.data,
          },
        },
        trigger: { seconds: 1 } as any, // Send immediately
      });

      // Update analytics
      const updatedAnalytics = {
        ...analytics,
        totalSent: analytics.totalSent + 1,
        typeBreakdown: {
          ...analytics.typeBreakdown,
          [notification.type]: {
            sent: (analytics.typeBreakdown[notification.type]?.sent || 0) + 1,
            opened: analytics.typeBreakdown[notification.type]?.opened || 0,
          },
        },
      };

      setAnalytics(updatedAnalytics);
      await AsyncStorage.setItem(NOTIFICATION_ANALYTICS_KEY, JSON.stringify(updatedAnalytics));

      // Add to history
      const updatedHistory = [{ ...notification, sent: true }, ...notificationHistory].slice(0, 100);
      setNotificationHistory(updatedHistory);
      await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(updatedHistory));

    } catch (error) {
      console.error('Error sending smart notification:', error);
    }
  };

  const trackNotificationOpened = async (notificationId: string) => {
    const notification = notificationHistory.find(n => n.id === notificationId);
    if (!notification) return;

    const updatedAnalytics = {
      ...analytics,
      totalOpened: analytics.totalOpened + 1,
      openRate: ((analytics.totalOpened + 1) / analytics.totalSent) * 100,
      typeBreakdown: {
        ...analytics.typeBreakdown,
        [notification.type]: {
          sent: analytics.typeBreakdown[notification.type]?.sent || 0,
          opened: (analytics.typeBreakdown[notification.type]?.opened || 0) + 1,
        },
      },
    };

    setAnalytics(updatedAnalytics);
    await AsyncStorage.setItem(NOTIFICATION_ANALYTICS_KEY, JSON.stringify(updatedAnalytics));
  };

  const testNotification = async () => {
    await sendSmartNotification({
      id: `test-${Date.now()}`,
      type: 'encouragement',
      title: 'Test Notification',
      body: 'This is a test notification to verify the system is working.',
      priority: 'normal',
      sent: false,
      timestamp: Date.now(),
    });
  };

  return {
    preferences,
    notificationHistory,
    analytics,
    isLoading,
    permissionStatus,
    updatePreferences,
    testNotification,
    sendSmartNotification,
  };
});
