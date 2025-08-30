import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-gray-700 font-medium">{label}</Text>
      <View className="flex-row items-center space-x-2">
        <TouchableOpacity
          onPress={() => adjustTime(-1, 0)}
          className="bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
        >
          <Text className="text-gray-600 font-bold">-</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold min-w-[80px] text-center">
          {formatTime(time)}
        </Text>
        <TouchableOpacity
          onPress={() => adjustTime(1, 0)}
          className="bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
        >
          <Text className="text-gray-600 font-bold">+</Text>
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
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading notification settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Smart Notifications</Text>
        
        {/* Permission Status */}
        <View className="mb-6 p-4 bg-gray-50 rounded-lg">
          <Text className="text-sm font-medium text-gray-700 mb-2">Permission Status</Text>
          <Text className={`text-sm ${permissionStatus === 'granted' ? 'text-green-600' : 'text-red-600'}`}>
            {permissionStatus === 'granted' ? '✓ Notifications Enabled' : '✗ Notifications Disabled'}
          </Text>
          {permissionStatus !== 'granted' && (
            <Text className="text-xs text-gray-500 mt-1">
              Please enable notifications in your device settings to receive smart reminders.
            </Text>
          )}
        </View>

        {/* Master Toggle */}
        <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">Enable Smart Notifications</Text>
            <Text className="text-sm text-gray-500">Turn on intelligent reminders and support messages</Text>
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
            <View className="py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">Daily Check-in</Text>
                  <Text className="text-sm text-gray-500">Daily reminder to track your mood</Text>
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
            <View className="py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">Mood Reminders</Text>
                  <Text className="text-sm text-gray-500">Regular reminders to check your mental health</Text>
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
                    <View key={index} className="flex-row items-center justify-between py-2">
                      <TimePicker
                        time={time}
                        onTimeChange={(newTime) => updateMoodReminderTime(index, newTime)}
                        label={`Reminder ${index + 1}`}
                      />
                      {localPreferences.moodReminders.times.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeMoodReminderTime(index)}
                          className="ml-2 bg-red-100 rounded-full w-8 h-8 items-center justify-center"
                        >
                          <Text className="text-red-600 font-bold">×</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  {localPreferences.moodReminders.times.length < 4 && (
                    <TouchableOpacity
                      onPress={addMoodReminderTime}
                      className="mt-2 bg-blue-100 rounded-lg py-2 px-4 items-center"
                    >
                      <Text className="text-blue-600 font-medium">+ Add Another Time</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* Crisis Support */}
            <View className="py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">Crisis Support</Text>
                  <Text className="text-sm text-gray-500">Proactive support during difficult times</Text>
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
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-gray-700">Proactive Reminders</Text>
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
            <View className="py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">Safety Plan Reviews</Text>
                  <Text className="text-sm text-gray-500">Reminders to update your safety plan</Text>
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
                <View className="py-2">
                  <Text className="text-gray-700 mb-2">Review Frequency</Text>
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={() =>
                        handlePreferenceChange({
                          safetyPlanReminders: { ...localPreferences.safetyPlanReminders, reviewFrequency: 'weekly' }
                        })
                      }
                      className={`flex-1 py-2 px-4 rounded-lg ${
                        localPreferences.safetyPlanReminders.reviewFrequency === 'weekly'
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-medium ${
                          localPreferences.safetyPlanReminders.reviewFrequency === 'weekly'
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
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
                      className={`flex-1 py-2 px-4 rounded-lg ${
                        localPreferences.safetyPlanReminders.reviewFrequency === 'monthly'
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-medium ${
                          localPreferences.safetyPlanReminders.reviewFrequency === 'monthly'
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        Monthly
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Encouragement Messages */}
            <View className="py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">Encouragement Messages</Text>
                  <Text className="text-sm text-gray-500">Positive messages when you&apos;re doing well</Text>
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
            <View className="py-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Notification Analytics</Text>
              <View className="bg-gray-50 rounded-lg p-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Total Sent</Text>
                  <Text className="font-semibold">{analytics.totalSent}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Total Opened</Text>
                  <Text className="font-semibold">{analytics.totalOpened}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Open Rate</Text>
                  <Text className="font-semibold">{analytics.openRate.toFixed(1)}%</Text>
                </View>
              </View>
            </View>

            {/* Test Notification */}
            <View className="py-6">
              <TouchableOpacity
                onPress={handleTestNotification}
                className="bg-blue-500 rounded-lg py-3 px-6 items-center"
                disabled={permissionStatus !== 'granted'}
              >
                <Text className="text-white font-semibold text-lg">Send Test Notification</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default NotificationSettings;
