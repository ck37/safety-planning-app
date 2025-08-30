/**
 * Security Settings Screen
 * Allows users to configure biometric authentication and other security options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Fingerprint,
  Settings,
  Info
} from 'lucide-react-native';
import { BiometricUtils } from '@/components/BiometricAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEALTH_MODE_KEY = 'stealth_mode_enabled';
const AUTO_LOCK_KEY = 'auto_lock_timeout';

interface SecuritySettings {
  biometricEnabled: boolean;
  stealthModeEnabled: boolean;
  autoLockTimeout: number; // in minutes
}

export default function SecuritySettingsScreen() {
  const [settings, setSettings] = useState<SecuritySettings>({
    biometricEnabled: false,
    stealthModeEnabled: false,
    autoLockTimeout: 5,
  });
  const [biometricCapabilities, setBiometricCapabilities] = useState({
    isAvailable: false,
    hasHardware: false,
    isEnrolled: false,
    supportedTypes: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    checkBiometricCapabilities();
  }, []);

  const loadSettings = async () => {
    try {
      const [biometricEnabled, stealthMode, autoLock] = await Promise.all([
        BiometricUtils.isBiometricEnabled(),
        AsyncStorage.getItem(STEALTH_MODE_KEY),
        AsyncStorage.getItem(AUTO_LOCK_KEY),
      ]);

      setSettings({
        biometricEnabled,
        stealthModeEnabled: stealthMode === 'true',
        autoLockTimeout: autoLock ? parseInt(autoLock, 10) : 5,
      });
    } catch (error) {
      console.error('Error loading security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBiometricCapabilities = async () => {
    const capabilities = await BiometricUtils.checkBiometricAvailability();
    setBiometricCapabilities(capabilities);
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled && !biometricCapabilities.isAvailable) {
      Alert.alert(
        'Biometric Authentication Unavailable',
        !biometricCapabilities.hasHardware
          ? 'This device does not support biometric authentication.'
          : 'Please set up biometric authentication in your device settings first.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (enabled) {
      Alert.alert(
        'Enable Biometric Security',
        'This will require biometric authentication (fingerprint, face ID, etc.) to access your safety plan. This provides an extra layer of security for your sensitive mental health information.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: async () => {
              await BiometricUtils.setBiometricEnabled(true);
              setSettings(prev => ({ ...prev, biometricEnabled: true }));
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Disable Biometric Security',
        'Your safety plan will no longer require biometric authentication to access. Are you sure you want to disable this security feature?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await BiometricUtils.setBiometricEnabled(false);
              setSettings(prev => ({ ...prev, biometricEnabled: false }));
            }
          }
        ]
      );
    }
  };

  const handleStealthModeToggle = async (enabled: boolean) => {
    if (enabled) {
      Alert.alert(
        'Enable Stealth Mode',
        'This will disguise the app appearance for users in unsafe living situations. The app icon and name will appear as a generic utility app. This feature is designed to protect users who may face danger if their mental health support is discovered.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: async () => {
              await AsyncStorage.setItem(STEALTH_MODE_KEY, 'true');
              setSettings(prev => ({ ...prev, stealthModeEnabled: true }));
              Alert.alert(
                'Stealth Mode Enabled',
                'The app will appear disguised. To access security settings again, tap the app icon 5 times quickly.',
                [{ text: 'OK' }]
              );
            }
          }
        ]
      );
    } else {
      await AsyncStorage.setItem(STEALTH_MODE_KEY, 'false');
      setSettings(prev => ({ ...prev, stealthModeEnabled: false }));
    }
  };

  const handleAutoLockTimeoutChange = (timeout: number) => {
    Alert.alert(
      'Change Auto-Lock Timeout',
      `The app will automatically lock after ${timeout} minutes of inactivity. You'll need to authenticate again to access your safety plan.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            await AsyncStorage.setItem(AUTO_LOCK_KEY, timeout.toString());
            setSettings(prev => ({ ...prev, autoLockTimeout: timeout }));
          }
        }
      ]
    );
  };

  const getBiometricTypeText = () => {
    if (biometricCapabilities.supportedTypes.includes(1)) { // FINGERPRINT
      return 'Fingerprint';
    } else if (biometricCapabilities.supportedTypes.includes(2)) { // FACIAL_RECOGNITION
      return 'Face ID';
    } else if (biometricCapabilities.supportedTypes.includes(3)) { // IRIS
      return 'Iris';
    }
    return 'Biometric';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading security settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6B46C1', '#9333EA']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Settings</Text>
        <Text style={styles.headerSubtitle}>Protect your mental health data</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Biometric Authentication */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Fingerprint size={24} color="#6B46C1" />
            <Text style={styles.sectionTitle}>Biometric Authentication</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {getBiometricTypeText()} Lock
              </Text>
              <Text style={styles.settingDescription}>
                {biometricCapabilities.isAvailable
                  ? `Require ${getBiometricTypeText().toLowerCase()} to access your safety plan`
                  : 'Biometric authentication is not available on this device'
                }
              </Text>
            </View>
            <Switch
              value={settings.biometricEnabled}
              onValueChange={handleBiometricToggle}
              disabled={!biometricCapabilities.isAvailable}
              trackColor={{ false: '#E5E7EB', true: '#6B46C1' }}
              thumbColor={settings.biometricEnabled ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>

          {!biometricCapabilities.hasHardware && (
            <View style={styles.warningContainer}>
              <Info size={16} color="#F59E0B" />
              <Text style={styles.warningText}>
                This device does not support biometric authentication
              </Text>
            </View>
          )}

          {biometricCapabilities.hasHardware && !biometricCapabilities.isEnrolled && (
            <View style={styles.warningContainer}>
              <Info size={16} color="#F59E0B" />
              <Text style={styles.warningText}>
                Please set up {getBiometricTypeText().toLowerCase()} in your device settings first
              </Text>
            </View>
          )}
        </View>

        {/* Privacy & Stealth Mode */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={24} color="#6B46C1" />
            <Text style={styles.sectionTitle}>Privacy & Stealth</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Stealth Mode</Text>
              <Text style={styles.settingDescription}>
                Disguise app appearance for safety in unsafe environments
              </Text>
            </View>
            <Switch
              value={settings.stealthModeEnabled}
              onValueChange={handleStealthModeToggle}
              trackColor={{ false: '#E5E7EB', true: '#6B46C1' }}
              thumbColor={settings.stealthModeEnabled ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Auto-Lock Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={24} color="#6B46C1" />
            <Text style={styles.sectionTitle}>Auto-Lock</Text>
          </View>
          
          <Text style={styles.sectionDescription}>
            Automatically lock the app after a period of inactivity
          </Text>

          {[1, 5, 15, 30, 60].map((timeout) => (
            <TouchableOpacity
              key={timeout}
              style={[
                styles.timeoutOption,
                settings.autoLockTimeout === timeout && styles.timeoutOptionSelected
              ]}
              onPress={() => handleAutoLockTimeoutChange(timeout)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.timeoutOptionText,
                settings.autoLockTimeout === timeout && styles.timeoutOptionTextSelected
              ]}>
                {timeout === 1 ? '1 minute' : `${timeout} minutes`}
              </Text>
              {settings.autoLockTimeout === timeout && (
                <View style={styles.selectedIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Information */}
        <View style={styles.infoSection}>
          <Shield size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            Your mental health data is encrypted and stored securely on your device. 
            These security features provide additional protection for your sensitive information.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E9D5FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
  timeoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  timeoutOptionSelected: {
    backgroundColor: '#EDE9FE',
  },
  timeoutOptionText: {
    fontSize: 16,
    color: '#4B5563',
  },
  timeoutOptionTextSelected: {
    color: '#6B46C1',
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B46C1',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
});
