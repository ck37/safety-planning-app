# Smart Notifications Feature Documentation

## Overview

The Smart Notifications feature provides intelligent, context-aware reminders and support messages to help users maintain their mental health routine and receive timely support during difficult periods. This feature integrates seamlessly with the existing mood tracking and safety plan systems to deliver personalized notifications based on user behavior patterns.

## Features

### 🔔 Notification Types

1. **Daily Check-in Reminders**
   - Customizable time for daily mood tracking reminders
   - Default: 7:00 PM
   - Helps maintain consistent mental health monitoring

2. **Mood Reminders**
   - Multiple configurable reminder times throughout the day
   - Default: 10:00 AM and 6:00 PM
   - Frequency options: daily, twice-daily, weekly

3. **Crisis Support Notifications**
   - Proactive messages during declining mood periods
   - Triggered by mood pattern analysis
   - Provides gentle reminders about available tools and support

4. **Safety Plan Review Reminders**
   - Weekly or monthly reminders to review and update safety plan
   - Ensures safety plan remains current and relevant

5. **Encouragement Messages**
   - Positive reinforcement during improving mood trends
   - Celebrates progress and maintains motivation

6. **Pattern Alert Notifications**
   - Smart alerts based on mood trend analysis
   - Identifies concerning patterns and suggests interventions

### 🧠 Smart Triggers

The system automatically analyzes user data to determine when to send notifications:

- **Inactivity Detection**: Sends reminders if user hasn't logged mood for 2+ days
- **Declining Mood Patterns**: Triggers support messages when mood trends downward
- **Risk Level Assessment**: Adjusts notification frequency based on current risk level
- **Improving Trends**: Sends encouragement when mood is improving

### ⚙️ User Preferences

Users have full control over their notification experience:

- **Master Toggle**: Enable/disable all smart notifications
- **Individual Controls**: Toggle each notification type independently
- **Time Customization**: Set preferred times for reminders
- **Frequency Settings**: Choose how often to receive different types of notifications
- **Crisis Support Options**: Control proactive reminder behavior

### 📊 Analytics & Insights

The system tracks notification effectiveness:

- **Delivery Metrics**: Total notifications sent and opened
- **Open Rates**: Percentage of notifications that users interact with
- **Type Breakdown**: Performance metrics by notification type
- **Effectiveness Scoring**: Overall engagement measurement

## Technical Implementation

### Architecture

```
SmartNotificationsProvider
├── Notification Scheduling
├── Smart Trigger Analysis
├── User Preference Management
├── Analytics Tracking
└── Integration with Mood Tracking
```

### Key Components

1. **SmartNotificationsProvider** (`providers/SmartNotificationsProvider.tsx`)
   - Main context provider for notification functionality
   - Handles scheduling, triggering, and analytics
   - Integrates with existing mood tracking system

2. **NotificationSettings** (`components/NotificationSettings.tsx`)
   - User interface for configuring notification preferences
   - Time picker components for scheduling
   - Analytics display and test functionality

3. **Type Definitions** (`types/SmartNotifications.ts`)
   - TypeScript interfaces for all notification-related data structures
   - Ensures type safety across the application

### Data Storage

All notification data is stored locally using AsyncStorage:

- **Preferences**: `notification_preferences`
- **History**: `notification_history` (last 100 notifications)
- **Analytics**: `notification_analytics`

### Integration Points

- **Mood Tracking Provider**: Monitors mood entries and trends for smart triggers
- **Security Settings**: Accessible through the security settings screen
- **App Layout**: Integrated at the root level for global availability

## Usage Guide

### For Users

1. **Access Settings**
   - Navigate to Security Settings → Smart Notifications
   - Or directly access via the notification settings screen

2. **Configure Preferences**
   - Toggle notification types on/off
   - Set preferred reminder times
   - Adjust frequency settings
   - Enable/disable crisis support features

3. **Test Functionality**
   - Use the "Send Test Notification" button to verify setup
   - Check notification permissions in device settings if needed

### For Developers

1. **Using the Provider**
   ```tsx
   import { useSmartNotifications } from '@/providers/SmartNotificationsProvider';
   
   const { preferences, updatePreferences, testNotification } = useSmartNotifications();
   ```

2. **Sending Custom Notifications**
   ```tsx
   await sendSmartNotification({
     id: `custom-${Date.now()}`,
     type: 'encouragement',
     title: 'Great Job!',
     body: 'You\'re making progress!',
     priority: 'normal',
     sent: false,
     timestamp: Date.now(),
   });
   ```

3. **Accessing Analytics**
   ```tsx
   const { analytics } = useSmartNotifications();
   console.log(`Open rate: ${analytics.openRate}%`);
   ```

## Configuration Options

### Default Settings

```typescript
const DEFAULT_PREFERENCES = {
  enabled: true,
  dailyCheckIn: {
    enabled: true,
    time: '19:00'
  },
  moodReminders: {
    enabled: true,
    frequency: 'daily',
    times: ['10:00', '18:00']
  },
  crisisSupport: {
    enabled: true,
    proactiveReminders: true
  },
  safetyPlanReminders: {
    enabled: true,
    reviewFrequency: 'weekly'
  },
  encouragementMessages: {
    enabled: true,
    frequency: 'daily'
  }
};
```

### Smart Trigger Thresholds

- **Inactivity Threshold**: 2 days without mood entry
- **Declining Mood**: Trend analysis over last 7 entries
- **Risk Level Assessment**: Based on average mood and warning signs
- **Encouragement Probability**: 30% chance to avoid notification fatigue

## Privacy & Security

- **Local Storage**: All data stored locally on device
- **No External Tracking**: Analytics remain private to the user
- **Permission-Based**: Requires explicit notification permissions
- **User Control**: Complete control over notification preferences

## Testing

The feature includes comprehensive tests covering:

- Notification type definitions
- Preference structure validation
- Smart trigger logic
- Time calculation functions
- Analytics calculations

Run tests with:
```bash
npm test smart-notifications.test.ts
```

## Troubleshooting

### Common Issues

1. **Notifications Not Appearing**
   - Check device notification permissions
   - Verify app is not in Do Not Disturb mode
   - Ensure notifications are enabled in app settings

2. **Smart Triggers Not Working**
   - Verify mood tracking data exists
   - Check that crisis support is enabled
   - Ensure sufficient mood entries for pattern analysis

3. **Time Settings Not Saving**
   - Check AsyncStorage permissions
   - Verify app has proper storage access
   - Try clearing app cache if issues persist

### Debug Information

Enable debug logging by setting:
```typescript
console.log('Smart Notifications Debug:', {
  preferences,
  permissionStatus,
  moodTrend,
  lastTriggerCheck: Date.now()
});
```

## Future Enhancements

Potential improvements identified for future releases:

1. **Machine Learning Integration**
   - More sophisticated pattern recognition
   - Personalized timing optimization
   - Predictive crisis intervention

2. **Advanced Scheduling**
   - Timezone-aware notifications
   - Calendar integration
   - Context-aware timing (work hours, sleep schedule)

3. **Enhanced Analytics**
   - Effectiveness correlation with mood improvements
   - A/B testing for message optimization
   - Long-term outcome tracking

4. **Integration Expansions**
   - Wearable device support
   - Healthcare provider dashboards
   - Emergency contact automation

## Support

For technical support or feature requests related to Smart Notifications:

1. Check the troubleshooting section above
2. Review the test suite for expected behavior
3. Consult the type definitions for data structure requirements
4. Refer to the existing mood tracking integration for patterns

## Changelog

### Version 1.0.0 (Initial Release)
- ✅ Basic notification scheduling
- ✅ Smart trigger system
- ✅ User preference management
- ✅ Analytics tracking
- ✅ Integration with mood tracking
- ✅ Comprehensive settings UI
- ✅ Test coverage
- ✅ Documentation

---

*This documentation covers the complete Smart Notifications feature implementation. For questions or contributions, please refer to the main project documentation.*
