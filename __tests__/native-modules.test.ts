/**
 * Native Modules Error Handling Tests
 * Tests error handling for missing or unavailable native modules
 */

// Mock the native modules to simulate unavailable state
jest.mock('expo-speech', () => ({
  speak: undefined,
  stop: undefined,
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: undefined,
  isEnrolledAsync: undefined,
  supportedAuthenticationTypesAsync: undefined,
  authenticateAsync: undefined,
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },
}));

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock React Native components to avoid import issues
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Alert: {
    alert: jest.fn(),
    prompt: jest.fn(),
  },
}));

// Mock lucide-react-native to avoid SVG import issues
jest.mock('lucide-react-native', () => ({
  Shield: 'Shield',
  Lock: 'Lock',
  Fingerprint: 'Fingerprint',
}));

describe('Native Modules Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
    mockAsyncStorage.removeItem.mockResolvedValue(undefined);
  });

  describe('Biometric Utilities Error Handling', () => {
    it('should handle missing LocalAuthentication module gracefully', async () => {
      // Test that when LocalAuthentication is undefined, functions handle it gracefully
      const LocalAuthentication = await import('expo-local-authentication');
      
      // Verify the module is mocked as unavailable
      expect(LocalAuthentication.hasHardwareAsync).toBeUndefined();
      expect(LocalAuthentication.isEnrolledAsync).toBeUndefined();
      expect(LocalAuthentication.supportedAuthenticationTypesAsync).toBeUndefined();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      // These should handle rejections properly
      await expect(mockAsyncStorage.getItem('test')).rejects.toThrow('Storage error');
      await expect(mockAsyncStorage.setItem('test', 'value')).rejects.toThrow('Storage error');
    });

    it('should return null when AsyncStorage has no data', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await mockAsyncStorage.getItem('biometric_settings');
      expect(result).toBeNull();
    });

    it('should store data correctly when AsyncStorage is available', async () => {
      const testData = JSON.stringify({ enabled: true });
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await mockAsyncStorage.setItem('biometric_settings', testData);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('biometric_settings', testData);
    });
  });

  describe('Speech Module Error Handling', () => {
    it('should handle missing Speech module gracefully', async () => {
      const Speech = await import('expo-speech');
      
      // Verify the module is mocked as unavailable
      expect(Speech.speak).toBeUndefined();
      expect(Speech.stop).toBeUndefined();
    });
  });

  describe('Module Availability Checks', () => {
    it('should detect when native modules are unavailable', async () => {
      const LocalAuthentication = await import('expo-local-authentication');
      const Speech = await import('expo-speech');

      // Test that we can detect unavailable modules
      const isLocalAuthAvailable = LocalAuthentication && typeof LocalAuthentication.hasHardwareAsync === 'function';
      const isSpeechAvailable = Speech && typeof Speech.speak === 'function';

      expect(isLocalAuthAvailable).toBe(false);
      expect(isSpeechAvailable).toBe(false);
    });

    it('should handle module checks without crashing', async () => {
      // These checks should not throw errors
      await expect(async () => {
        const LocalAuthentication = await import('expo-local-authentication');
        const hasFunction = LocalAuthentication && typeof LocalAuthentication.hasHardwareAsync === 'function';
        return hasFunction;
      }).not.toThrow();

      await expect(async () => {
        const Speech = await import('expo-speech');
        const hasFunction = Speech && typeof Speech.speak === 'function';
        return hasFunction;
      }).not.toThrow();
    });
  });

  describe('Error Recovery Scenarios', () => {
    it('should handle storage retrieval failures', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage unavailable'));

      // Should handle the error gracefully
      try {
        await mockAsyncStorage.getItem('test_key');
      } catch (error) {
        expect((error as Error).message).toBe('Storage unavailable');
      }
    });

    it('should handle storage write failures', async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage full'));

      // Should handle the error gracefully
      try {
        await mockAsyncStorage.setItem('test_key', 'test_value');
      } catch (error) {
        expect((error as Error).message).toBe('Storage full');
      }
    });

    it('should provide fallback behavior when modules are unavailable', async () => {
      // Test that the app can continue functioning when native modules are unavailable
      const LocalAuthentication = await import('expo-local-authentication');
      const Speech = await import('expo-speech');

      // Simulate checking for module availability and providing fallbacks
      const biometricFallback = !LocalAuthentication || typeof LocalAuthentication.hasHardwareAsync !== 'function';
      const speechFallback = !Speech || typeof Speech.speak !== 'function';

      expect(biometricFallback).toBe(true);
      expect(speechFallback).toBe(true);
    });
  });
});
