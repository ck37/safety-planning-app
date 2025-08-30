import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  Linking,
  Modal,
  ScrollView,
} from 'react-native';
import { Phone, AlertTriangle, X } from 'lucide-react-native';
import { useSafetyPlan } from '@/providers/SafetyPlanProvider';
import { useMoodTracking } from '@/providers/MoodTrackingProvider';

interface QuickCrisisButtonProps {
  size?: 'small' | 'large';
}

export default function QuickCrisisButton({ size = 'large' }: QuickCrisisButtonProps) {
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const { safetyPlan } = useSafetyPlan();
  const { getActiveAlerts } = useMoodTracking();

  const handleCrisisPress = () => {
    setShowCrisisModal(true);
  };

  const handleEmergencyCall = () => {
    if (Platform.OS !== 'web') {
      Linking.openURL('tel:988');
    } else {
      Alert.alert('Crisis Hotline', '988 Suicide & Crisis Lifeline\nCall or text 988 for immediate support');
    }
    setShowCrisisModal(false);
  };

  const handleContactSupport = (contact: { name: string; phone?: string }) => {
    if (contact.phone && Platform.OS !== 'web') {
      Linking.openURL(`tel:${contact.phone}`);
    } else {
      Alert.alert('Contact Support', `Reach out to ${contact.name}${contact.phone ? ` at ${contact.phone}` : ''}`);
    }
    setShowCrisisModal(false);
  };

  const activeAlerts = getActiveAlerts();
  const hasActiveAlerts = activeAlerts.length > 0;

  const buttonStyle = size === 'large' ? styles.largeCrisisButton : styles.smallCrisisButton;
  const textStyle = size === 'large' ? styles.largeCrisisButtonText : styles.smallCrisisButtonText;

  return (
    <>
      <TouchableOpacity
        style={[buttonStyle, hasActiveAlerts && styles.alertActive]}
        onPress={handleCrisisPress}
        activeOpacity={0.8}
      >
        <AlertTriangle size={size === 'large' ? 24 : 18} color="#FFFFFF" />
        <Text style={textStyle}>
          {size === 'large' ? 'Crisis Support' : 'Crisis'}
        </Text>
        {hasActiveAlerts && <View style={styles.alertBadge} />}
      </TouchableOpacity>

      <Modal
        visible={showCrisisModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCrisisModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Crisis Support</Text>
            <TouchableOpacity
              onPress={() => setShowCrisisModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Active Alerts */}
            {hasActiveAlerts && (
              <View style={styles.alertsSection}>
                <Text style={styles.sectionTitle}>Current Alerts</Text>
                {activeAlerts.map((alert) => {
                  let alertStyle;
                  switch (alert.level) {
                    case 'mild':
                      alertStyle = styles.alertMild;
                      break;
                    case 'moderate':
                      alertStyle = styles.alertModerate;
                      break;
                    case 'severe':
                      alertStyle = styles.alertSevere;
                      break;
                    default:
                      alertStyle = styles.alertMild;
                  }
                  return (
                    <View key={alert.id} style={[styles.alertCard, alertStyle]}>
                      <Text style={styles.alertLevel}>{alert.level.toUpperCase()} CONCERN</Text>
                      <Text style={styles.alertTrigger}>{alert.triggers.join(', ')}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Emergency Hotline */}
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={handleEmergencyCall}
              activeOpacity={0.8}
            >
              <Phone size={24} color="#FFFFFF" />
              <View style={styles.emergencyButtonContent}>
                <Text style={styles.emergencyButtonTitle}>Call Crisis Hotline</Text>
                <Text style={styles.emergencyButtonSubtitle}>988 - Available 24/7</Text>
              </View>
            </TouchableOpacity>

            {/* Quick Coping Strategies */}
            {safetyPlan.copingStrategies.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Coping Strategies</Text>
                {safetyPlan.copingStrategies.slice(0, 3).map((strategy, index) => (
                  <View key={index} style={styles.strategyItem}>
                    <Text style={styles.strategyText}>{strategy}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Support Contacts */}
            {safetyPlan.supportContacts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support Contacts</Text>
                {safetyPlan.supportContacts.slice(0, 3).map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.contactItem}
                    onPress={() => handleContactSupport(contact)}
                    activeOpacity={0.7}
                  >
                    <Phone size={16} color="#3B82F6" />
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      {contact.phone && <Text style={styles.contactPhone}>{contact.phone}</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Reasons for Living */}
            {safetyPlan.reasonsForLiving.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Remember Your Reasons</Text>
                {safetyPlan.reasonsForLiving.slice(0, 3).map((reason, index) => (
                  <View key={index} style={styles.reasonItem}>
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>You matter. This crisis will pass.</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  largeCrisisButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  smallCrisisButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  alertActive: {
    backgroundColor: '#B91C1C',
  },
  largeCrisisButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  smallCrisisButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  alertBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  alertsSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  alertCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  alertMild: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  alertModerate: {
    backgroundColor: '#FED7AA',
    borderLeftWidth: 4,
    borderLeftColor: '#EA580C',
  },
  alertSevere: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  alertLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7C2D12',
    marginBottom: 4,
  },
  alertTrigger: {
    fontSize: 14,
    color: '#92400E',
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
  },
  emergencyButtonContent: {
    flex: 1,
  },
  emergencyButtonTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emergencyButtonSubtitle: {
    color: '#FCA5A5',
    fontSize: 14,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  strategyItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  strategyText: {
    fontSize: 14,
    color: '#374151',
  },
  contactItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  contactPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  reasonItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#EC4899',
  },
  reasonText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
    textAlign: 'center',
  },
});
