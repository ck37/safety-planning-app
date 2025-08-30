import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useSmartNotifications } from '@/providers/SmartNotificationsProvider';
import { NotificationPreferences } from '@/types/SmartNotifications';

interface TimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
  label: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ time, onTimeChange, label }) => {
  const [hour, minute] = time.split(':').map(Number);
  
  const adjustTime = (hourDelta: number, minuteDelta: number) => {
    let newHour = hour + hourDelta;
    let newMinute = minute + minuteDelta;
    
    if (newMinute >= 60) {
      newMinute = 0;
      newHour += 1;
    } else if (newMinute < 0) {
      newMinute = 45;
      newHour -= 1;
    }
    
    if (newHour >= 24) newHour = 0;
    if (newHour < 0) newHour = 23;
    
    const timeString = `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
    onTimeChange(timeString);
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <View style={styles.timePickerRow}>
      <Text style={styles.timePickerLabel}>{label}</Text>
      <View style={styles.timePickerControls}>
        <TouchableOpacity
          onPress={() => adjustTime(-1, 0)}
          style={styles.timeButton}
        >
          <Text style={styles.timeButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.timeDisplay}>
          {formatTime(time)}
        </Text>
        <TouchableOpacity
          onPress={() => adjustTime(1, 0)}
          style={styles.timeButton}
        >
          <Text style={styles.timeButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const NotificationSettings: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    permissionStatus,
    testNotification,
    analytics,
    isLoading
  } = useSmartNotifications();

  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);

  const handlePreferenceChange = async (updates: Partial<NotificationPreferences>) => {
    const newPreferences = { ...localPreferences, ...updates };
    setLocalPreferences(newPreferences);
    await updatePreferences(updates);
  };

  const handleTestNotification = async () => {
    try {
      await testNotification();
      Alert.alert('Test Sent', 'A test notification has been sent!');
    } catch {
      Alert.alert('Error', 'Failed to send test notification. Please check your permissions.');
    }
  };

  const addMoodReminderTime = () => {
    const newTimes = [...localPreferences.moodReminders.times, '12:00'];
    handlePreferenceChange({
      moodReminders: {
        ...localPreferences.moodReminders,
        times: newTimes
      }
    });
  };

  const removeMoodReminderTime = (index: number) => {
    const newTimes = localPreferences.moodReminders.times.filter((_, i) => i !== index);
    handlePreferenceChange({
      moodReminders: {
        ...localPreferences.moodReminders,
        times: newTimes
      }
    });
  };

  const updateMoodReminderTime = (index: number, time: string) => {
    const newTimes = [...localPreferences.moodReminders.times];
    newTimes[index] = time;
    handlePreferenceChange({
      moodReminders: {
        ...localPreferences.moodReminders,
        times: newTimes
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading notification settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Smart Notifications</Text>
        
        {/* Permission Status */}
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Permission Status</Text>
          <Text style={[styles.permissionStatus, { color: permissionStatus === 'granted' ? '#10b981' : '#ef4444' }]}>
            {permissionStatus === 'granted' ? '✓ Notifications Enabled' : '✗ Notifications Disabled'}
          </Text>
          {permissionStatus !== 'granted' && (
            <Text style={styles.permissionHelp}>
              Please enable notifications in your device settings to receive smart reminders.
            </Text>
          )}
        </View>

        {/* Master Toggle */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Enable Smart Notifications</Text>
            <Text style={styles.settingDescription}>Turn on intelligent reminders and support messages</Text>
          </View>
          <Switch
            value={localPreferences.enabled}
            onValueChange={(value) => handlePreferenceChange({ enabled: value })}
            trackColor={{ false: '#d1d5db', true: '#10b981' }}
            thumbColor={localPreferences.enabled ? '#ffffff' : '#f3f4f6'}
          />
        </View>

        {localPreferences.enabled && (
          <>
            {/* Daily Check-in */}
            <View style={styles.settingSection}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Daily Check-in</Text>
                  <Text style={styles.settingDescription}>Daily reminder to track your mood</Text>
                </View>
                <Switch
                  value={localPreferences.dailyCheckIn.enabled}
                  onValueChange={(value) => 
                    handlePreferenceChange({
                      dailyCheckIn: { ...localPreferences.dailyCheckIn, enabled: value }
                    })
                  }
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor={localPreferences.dailyCheckIn.enabled ? '#ffffff' : '#f3f4f6'}
                />
              </View>
              {localPreferences.dailyCheckIn.enabled && (
                <TimePicker
                  time={localPreferences.dailyCheckIn.time}
                  onTimeChange={(time) =>
                    handlePreferenceChange({
                      dailyCheckIn: { ...localPreferences.dailyCheckIn, time }
                    })
                  }
                  label="Check-in Time"
                />
              )}
            </View>

            {/* Mood Reminders */}
            <View style={styles.settingSection}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Mood Reminders</Text>
                  <Text style={styles.settingDescription}>Regular reminders to check your mental health</Text>
                </View>
                <Switch
                  value={localPreferences.moodReminders.enabled}
                  onValueChange={(value) =>
                    handlePreferenceChange({
                      moodReminders: { ...localPreferences.moodReminders, enabled: value }
                    })
                  }
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor={localPreferences.moodReminders.enabled ? '#ffffff' : '#f3f4f6'}
                />
              </View>
              {localPreferences.moodReminders.enabled && (
                <View>
                  {localPreferences.moodReminders.times.map((time, index) => (
                    <View key={index} style={styles.reminderTimeRow}>
                      <TimePicker
                        time={time}
                        onTimeChange={(newTime) => updateMoodReminderTime(index, newTime)}
                        label={`Reminder ${index + 1}`}
                      />
                      {localPreferences.moodReminders.times.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeMoodReminderTime(index)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  {localPreferences.moodReminders.times.length < 4 && (
                    <TouchableOpacity
                      onPress={addMoodReminderTime}
                      style={styles.addButton}
                    >
                      <Text style={styles.addButtonText}>+ Add Another Time</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* Crisis Support */}
            <View style={styles.settingSection}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Crisis Support</Text>
                  <Text style={styles.settingDescription}>Proactive support during difficult times</Text>
                </View>
                <Switch
                  value={localPreferences.crisisSupport.enabled}
                  onValueChange={(value) =>
                    handlePreferenceChange({
                      crisisSupport: { ...localPreferences.crisisSupport, enabled: value }
                    })
                  }
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor={localPreferences.crisisSupport.enabled ? '#ffffff' : '#f3f4f6'}
                />
              </View>
              {localPreferences.crisisSupport.enabled && (
                <View style={styles.subSettingRow}>
                  <Text style={styles.subSettingLabel}>Proactive Reminders</Text>
                  <Switch
                    value={localPreferences.crisisSupport.proactiveReminders}
                    onValueChange={(value) =>
                      handlePreferenceChange({
                        crisisSupport: { ...localPreferences.crisisSupport, proactiveReminders: value }
                      })
                    }
                    trackColor={{ false: '#d1d5db', true: '#10b981' }}
                    thumbColor={localPreferences.crisisSupport.proactiveReminders ? '#ffffff' : '#f3f4f6'}
                  />
                </View>
              )}
            </View>

            {/* Safety Plan Reminders */}
            <View style={styles.settingSection}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Safety Plan Reviews</Text>
                  <Text style={styles.settingDescription}>Reminders to update your safety plan</Text>
                </View>
                <Switch
                  value={localPreferences.safetyPlanReminders.enabled}
                  onValueChange={(value) =>
                    handlePreferenceChange({
                      safetyPlanReminders: { ...localPreferences.safetyPlanReminders, enabled: value }
                    })
                  }
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor={localPreferences.safetyPlanReminders.enabled ? '#ffffff' : '#f3f4f6'}
                />
              </View>
              {localPreferences.safetyPlanReminders.enabled && (
                <View style={styles.frequencyContainer}>
                  <Text style={styles.frequencyLabel}>Review Frequency</Text>
                  <View style={styles.frequencyButtons}>
                    <TouchableOpacity
                      onPress={() =>
                        handlePreferenceChange({
                          safetyPlanReminders: { ...localPreferences.safetyPlanReminders, reviewFrequency: 'weekly' }
                        })
                      }
                      style={[
                        styles.frequencyButton,
                        localPreferences.safetyPlanReminders.reviewFrequency === 'weekly' && styles.frequencyButtonActive
                      ]}
                    >
                      <Text
                        style={[
                          styles.frequencyButtonText,
                          localPreferences.safetyPlanReminders.reviewFrequency === 'weekly' && styles.frequencyButtonTextActive
                        ]}
                      >
                        Weekly
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handlePreferenceChange({
                          safetyPlanReminders: { ...localPreferences.safetyPlanReminders, reviewFrequency: 'monthly' }
                        })
                      }
                      style={[
                        styles.frequencyButton,
                        localPreferences.safetyPlanReminders.reviewFrequency === 'monthly' && styles.frequencyButtonActive
                      ]}
                    >
                      <Text
                        style={[
                          styles.frequencyButtonText,
                          localPreferences.safetyPlanReminders.reviewFrequency === 'monthly' && styles.frequencyButtonTextActive
                        ]}
                      >
                        Monthly
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Encouragement Messages */}
            <View style={styles.settingSection}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Encouragement Messages</Text>
                  <Text style={styles.settingDescription}>Positive messages when you&apos;re doing well</Text>
                </View>
                <Switch
                  value={localPreferences.encouragementMessages.enabled}
                  onValueChange={(value) =>
                    handlePreferenceChange({
                      encouragementMessages: { ...localPreferences.encouragementMessages, enabled: value }
                    })
                  }
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor={localPreferences.encouragementMessages.enabled ? '#ffffff' : '#f3f4f6'}
                />
              </View>
            </View>

            {/* Analytics */}
            <View style={styles.settingSection}>
              <Text style={styles.analyticsTitle}>Notification Analytics</Text>
              <View style={styles.analyticsContainer}>
                <View style={styles.analyticsRow}>
                  <Text style={styles.analyticsLabel}>Total Sent</Text>
                  <Text style={styles.analyticsValue}>{analytics.totalSent}</Text>
                </View>
                <View style={styles.analyticsRow}>
                  <Text style={styles.analyticsLabel}>Total Opened</Text>
                  <Text style={styles.analyticsValue}>{analytics.totalOpened}</Text>
                </View>
                <View style={styles.analyticsRow}>
                  <Text style={styles.analyticsLabel}>Open Rate</Text>
                  <Text style={styles.analyticsValue}>{analytics.openRate.toFixed(1)}%</Text>
                </View>
              </View>
            </View>

            {/* Test Notification */}
            <View style={styles.testSection}>
              <TouchableOpacity
                onPress={handleTestNotification}
                style={[styles.testButton, permissionStatus !== 'granted' && styles.testButtonDisabled]}
                disabled={permissionStatus !== 'granted'}
              >
                <Text style={styles.testButtonText}>Send Test Notification</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6b7280',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  permissionContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  permissionStatus: {
    fontSize: 14,
  },
  permissionHelp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  subSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  subSettingLabel: {
    color: '#374151',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  timePickerLabel: {
    color: '#374151',
    fontWeight: '500',
  },
  timePickerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonText: {
    color: '#4b5563',
    fontWeight: 'bold',
  },
  timeDisplay: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  reminderTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  removeButton: {
    marginLeft: 8,
    backgroundColor: '#fecaca',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  frequencyContainer: {
    paddingVertical: 8,
  },
  frequencyLabel: {
    color: '#374151',
    marginBottom: 8,
  },
  frequencyButtons: {
    flexDirection: 'row',
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  frequencyButtonActive: {
    backgroundColor: '#3b82f6',
  },
  frequencyButtonText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#374151',
  },
  frequencyButtonTextActive: {
    color: '#ffffff',
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  analyticsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  analyticsLabel: {
    color: '#4b5563',
  },
  analyticsValue: {
    fontWeight: '600',
  },
  testSection: {
    paddingVertical: 24,
  },
  testButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  testButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  testButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default NotificationSettings;
