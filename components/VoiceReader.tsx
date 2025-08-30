import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useSafetyPlan } from '@/providers/SafetyPlanProvider';

interface VoiceReaderProps {
  size?: 'small' | 'large';
}

export default function VoiceReader({ size = 'small' }: VoiceReaderProps) {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { safetyPlan } = useSafetyPlan();

  useEffect(() => {
    return () => {
      // Cleanup: stop speech when component unmounts
      try {
        if (Speech && typeof Speech.stop === 'function') {
          Speech.stop();
        }
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, []);

  const generateSafetyPlanText = () => {
    let text = "Here is your safety plan. ";

    if (safetyPlan.warningSigns.length > 0) {
      text += "Your warning signs are: " + safetyPlan.warningSigns.join(", ") + ". ";
    }

    if (safetyPlan.copingStrategies.length > 0) {
      text += "Your coping strategies include: " + safetyPlan.copingStrategies.join(", ") + ". ";
    }

    if (safetyPlan.supportContacts.length > 0) {
      text += "Your support contacts are: ";
      safetyPlan.supportContacts.forEach((contact, index) => {
        text += contact.name;
        if (contact.phone) {
          text += " at " + contact.phone.split('').join(' ');
        }
        if (index < safetyPlan.supportContacts.length - 1) {
          text += ", ";
        }
      });
      text += ". ";
    }

    if (safetyPlan.safePlaces.length > 0) {
      text += "Your safe places are: " + safetyPlan.safePlaces.join(", ") + ". ";
    }

    if (safetyPlan.reasonsForLiving.length > 0) {
      text += "Your reasons for living include: " + safetyPlan.reasonsForLiving.join(", ") + ". ";
    }

    text += "Remember, you matter and this crisis will pass. Help is available.";

    return text;
  };

  const handleStartReading = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Voice Feature', 'Voice reading is not available on web. Please use a mobile device for this feature.');
      return;
    }

    try {
      // Check if Speech module is available
      if (!Speech || typeof Speech.speak !== 'function') {
        Alert.alert('Feature Unavailable', 'Voice reading is not available on this device or in development mode.');
        return;
      }

      const text = generateSafetyPlanText();
      
      if (!text.trim()) {
        Alert.alert('No Content', 'Please add content to your safety plan first.');
        return;
      }

      setIsReading(true);
      setIsPaused(false);

      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8, // Slightly slower for clarity during crisis
        onDone: () => {
          setIsReading(false);
          setIsPaused(false);
        },
        onStopped: () => {
          setIsReading(false);
          setIsPaused(false);
        },
        onError: (error: any) => {
          console.error('Speech error:', error);
          setIsReading(false);
          setIsPaused(false);
          Alert.alert('Error', 'Unable to read safety plan aloud. Please try again.');
        },
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsReading(false);
      setIsPaused(false);
      Alert.alert('Error', 'Voice reading is not available on this device.');
    }
  };

  const handlePauseResume = async () => {
    try {
      if (!Speech || typeof Speech.stop !== 'function') {
        return;
      }

      if (isPaused) {
        // Resume is not directly supported by expo-speech, so we restart
        await handleStartReading();
      } else {
        await Speech.stop();
        setIsPaused(true);
      }
    } catch (error) {
      console.error('Pause/Resume error:', error);
    }
  };

  const handleStop = async () => {
    try {
      if (!Speech || typeof Speech.stop !== 'function') {
        setIsReading(false);
        setIsPaused(false);
        return;
      }

      await Speech.stop();
      setIsReading(false);
      setIsPaused(false);
    } catch (error) {
      console.error('Stop error:', error);
      setIsReading(false);
      setIsPaused(false);
    }
  };

  const buttonStyle = size === 'large' ? styles.largeButton : styles.smallButton;
  const iconSize = size === 'large' ? 24 : 18;

  if (isReading) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[buttonStyle, styles.pauseButton]}
          onPress={handlePauseResume}
          activeOpacity={0.7}
        >
          {isPaused ? (
            <Play size={iconSize} color="#FFFFFF" />
          ) : (
            <Pause size={iconSize} color="#FFFFFF" />
          )}
          {size === 'large' && (
            <Text style={styles.buttonText}>
              {isPaused ? 'Resume' : 'Pause'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[buttonStyle, styles.stopButton]}
          onPress={handleStop}
          activeOpacity={0.7}
        >
          <VolumeX size={iconSize} color="#FFFFFF" />
          {size === 'large' && (
            <Text style={styles.buttonText}>Stop</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[buttonStyle, styles.readButton]}
      onPress={handleStartReading}
      activeOpacity={0.7}
    >
      <Volume2 size={iconSize} color="#FFFFFF" />
      {size === 'large' && (
        <Text style={styles.buttonText}>Read Aloud</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  largeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  smallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readButton: {
    backgroundColor: '#10B981',
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
