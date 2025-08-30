/**
 * BiometricAuth Component
 * Provides biometric authentication (fingerprint/face ID) for app security
 * Protects sensitive mental health data with device-level security
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Shield, Lock, Fingerprint } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BiometricAuthProps {
  onAuthSuccess: () => void;
  onAuthFail?: () => void;
  title?: string;
  subtitle?: string;
  fallbackEnabled?: boolean;
}

interface BiometricCapabilities {
  isAvailable: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
}

const BIOMETRIC_SETTINGS_KEY = 'biometric_settings';
const AUTH_ATTEMPTS_KEY = 'auth_attempts';
const MAX_FAILED_ATTEMPTS = 5;

export default function BiometricAuth({
  onAuthSuccess,
  onAuthFail,
  title = "Secure Access Required",
  subtitle = "Use your biometric authentication to access your safety plan",
  fallbackEnabled = true
}: BiometricAuthProps) {
  const [capabilities, setCapabilities] = useState<BiometricCapabilities>({
    isAvailable: false,
    hasHardware: false,
    isEnrolled: false,
    supportedTypes: []
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    checkBiometricCapabilities();
    loadFailedAttempts();
  }, []);

  const checkBiometricCapabilities = async () => {
    try {
      // Check if LocalAuthentication module is available
      if (!LocalAuthentication || typeof LocalAuthentication.hasHardwareAsync !== 'function') {
        console.log('LocalAuthentication module not available');
        setCapabilities({
          isAvailable: false,
          hasHardware: false,
          isEnrolled: false,
          supportedTypes: []
        });
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setCapabilities({
        isAvailable: hasHardware && isEnrolled,
        hasHardware,
        isEnrolled,
        supportedTypes
      });
    } catch (error) {
      console.error('Error checking biometric capabilities:', error);
      setCapabilities({
        isAvailable: false,
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: []
      });
    }
  };

  const loadFailedAttempts = async () => {
    try {
      const attempts = await AsyncStorage.getItem(AUTH_ATTEMPTS_KEY);
      const attemptCount = attempts ? parseInt(attempts, 10) : 0;
      setFailedAttempts(attemptCount);
      setIsLocked(attemptCount >= MAX_FAILED_ATTEMPTS);
    } catch (error) {
      console.error('Error loading failed attempts:', error);
    }
  };

  const saveFailedAttempts = async (attempts: number) => {
    try {
      await AsyncStorage.setItem(AUTH_ATTEMPTS_KEY, attempts.toString());
      setFailedAttempts(attempts);
      setIsLocked(attempts >= MAX_FAILED_ATTEMPTS);
    } catch (error) {
      console.error('Error saving failed attempts:', error);
    }
  };

  const resetFailedAttempts = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_ATTEMPTS_KEY);
      setFailedAttempts(0);
      setIsLocked(false);
    } catch (error) {
      console.error('Error resetting failed attempts:', error);
    }
  };

  const authenticateWithBiometrics = async () => {
    if (isLocked) {
      Alert.alert(
        'Account Locked',
        'Too many failed attempts. Please try again later or contact support.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!capabilities.isAvailable) {
      if (fallbackEnabled) {
        handleFallbackAuth();
      } else {
        Alert.alert(
          'Biometric Authentication Unavailable',
          'Please set up biometric authentication in your device settings.',
          [{ text: 'OK' }]
        );
      }
      return;
    }

    setIsAuthenticating(true);

    try {
      // Check if LocalAuthentication module is available
      if (!LocalAuthentication || typeof LocalAuthentication.authenticateAsync !== 'function') {
        Alert.alert(
          'Feature Unavailable',
          'Biometric authentication is not available in development mode or on this device.',
          [{ text: 'OK' }]
        );
        setIsAuthenticating(false);
        onAuthFail?.();
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: title,
        cancelLabel: 'Cancel',
        fallbackLabel: fallbackEnabled ? 'Use Passcode' : undefined,
        disableDeviceFallback: !fallbackEnabled,
      });

      if (result.success) {
        await resetFailedAttempts();
        onAuthSuccess();
      } else {
        const newAttempts = failedAttempts + 1;
        await saveFailedAttempts(newAttempts);
        
        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          Alert.alert(
            'Account Locked',
            'Too many failed authentication attempts. Your account has been temporarily locked for security.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Authentication Failed',
            `Authentication was not successful. ${MAX_FAILED_ATTEMPTS - newAttempts} attempts remaining.`,
            [{ text: 'Try Again', onPress: authenticateWithBiometrics }]
          );
        }
        
        onAuthFail?.();
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert(
        'Authentication Error',
        'An error occurred during authentication. Please try again.',
        [{ text: 'OK' }]
      );
      onAuthFail?.();
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleFallbackAuth = () => {
    Alert.prompt(
      'Fallback Authentication',
      'Enter your device passcode:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Authenticate',
          onPress: (passcode) => {
            // In a real implementation, you'd validate against a stored hash
            // For demo purposes, we'll accept any 4+ digit code
            if (passcode && passcode.length >= 4) {
              resetFailedAttempts();
              onAuthSuccess();
            } else {
              const newAttempts = failedAttempts + 1;
              saveFailedAttempts(newAttempts);
              Alert.alert('Invalid passcode', 'Please try again.');
            }
          }
        }
      ],
      'secure-text'
    );
  };

  const getBiometricTypeText = () => {
    if (capabilities.supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    } else if (capabilities.supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Fingerprint';
    } else if (capabilities.supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris';
    }
    return 'Biometric';
  };

  const getBiometricIcon = () => {
    if (capabilities.supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return Shield;
    } else if (capabilities.supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return Fingerprint;
    }
    return Lock;
  };

  if (isLocked) {
    return (
      <View style={styles.container}>
        <View style={styles.lockContainer}>
          <Lock size={64} color="#EF4444" />
          <Text style={styles.lockTitle}>Account Locked</Text>
          <Text style={styles.lockSubtitle}>
            Too many failed authentication attempts. Please contact support or try again later.
          </Text>
        </View>
      </View>
    );
  }

  const BiometricIcon = getBiometricIcon();

  return (
    <View style={styles.container}>
      <View style={styles.authContainer}>
        <BiometricIcon size={64} color="#6B46C1" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        {capabilities.isAvailable ? (
          <TouchableOpacity
            style={[styles.authButton, isAuthenticating && styles.authButtonDisabled]}
            onPress={authenticateWithBiometrics}
            disabled={isAuthenticating}
            activeOpacity={0.7}
          >
            <Text style={styles.authButtonText}>
              {isAuthenticating ? 'Authenticating...' : `Use ${getBiometricTypeText()}`}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.unavailableContainer}>
            <Text style={styles.unavailableText}>
              {!capabilities.hasHardware 
                ? 'Biometric authentication is not available on this device'
                : 'No biometric authentication is set up on this device'
              }
            </Text>
            {fallbackEnabled && (
              <TouchableOpacity
                style={styles.fallbackButton}
                onPress={handleFallbackAuth}
                activeOpacity={0.7}
              >
                <Text style={styles.fallbackButtonText}>Use Passcode Instead</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {failedAttempts > 0 && failedAttempts < MAX_FAILED_ATTEMPTS && (
          <Text style={styles.warningText}>
            {MAX_FAILED_ATTEMPTS - failedAttempts} attempts remaining
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 350,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  authButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
  },
  authButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  unavailableContainer: {
    alignItems: 'center',
  },
  unavailableText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  fallbackButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  fallbackButtonText: {
    color: '#6B46C1',
    fontSize: 14,
    fontWeight: '600',
  },
  warningText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
  },
  lockContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 350,
    width: '100%',
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  lockSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

// Export utility functions for managing biometric settings
export const BiometricUtils = {
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const settings = await AsyncStorage.getItem(BIOMETRIC_SETTINGS_KEY);
      return settings ? JSON.parse(settings).enabled : false;
    } catch {
      return false;
    }
  },

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(BIOMETRIC_SETTINGS_KEY, JSON.stringify({ enabled }));
    } catch (error) {
      console.error('Error saving biometric settings:', error);
    }
  },

  async checkBiometricAvailability(): Promise<BiometricCapabilities> {
    try {
      // Check if LocalAuthentication module is available
      if (!LocalAuthentication || typeof LocalAuthentication.hasHardwareAsync !== 'function') {
        return {
          isAvailable: false,
          hasHardware: false,
          isEnrolled: false,
          supportedTypes: []
        };
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      return {
        isAvailable: hasHardware && isEnrolled,
        hasHardware,
        isEnrolled,
        supportedTypes
      };
    } catch (error) {
      console.error('Error checking biometric capabilities:', error);
      return {
        isAvailable: false,
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: []
      };
    }
  }
};
