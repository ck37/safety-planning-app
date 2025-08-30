import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  AlertCircle, 
  Heart, 
  Users, 
  MapPin, 
  Sparkles,
  Shield,
  Edit3,
  Phone
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafetyPlan } from '@/providers/SafetyPlanProvider';
import * as Linking from 'expo-linking';

export default function HomeScreen() {
  const { safetyPlan } = useSafetyPlan();

  const handleEmergencyCall = () => {
    if (Platform.OS !== 'web') {
      Linking.openURL('tel:988');
    } else {
      alert('988 Suicide & Crisis Lifeline\nCall or text 988 for immediate support');
    }
  };

  const sections = [
    {
      id: 'warning-signs',
      title: 'Warning Signs',
      icon: AlertCircle,
      color: '#EF4444',
      bgColor: '#FEE2E2',
      items: safetyPlan.warningSigns,
      emptyText: 'Add warning signs to recognize'
    },
    {
      id: 'coping-strategies',
      title: 'Coping Strategies',
      icon: Shield,
      color: '#10B981',
      bgColor: '#D1FAE5',
      items: safetyPlan.copingStrategies,
      emptyText: 'Add coping strategies'
    },
    {
      id: 'support-contacts',
      title: 'Support Contacts',
      icon: Users,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      items: safetyPlan.supportContacts.map(c => `${c.name}${c.phone ? ` - ${c.phone}` : ''}`),
      emptyText: 'Add people who can help'
    },
    {
      id: 'safe-places',
      title: 'Safe Places',
      icon: MapPin,
      color: '#F59E0B',
      bgColor: '#FED7AA',
      items: safetyPlan.safePlaces,
      emptyText: 'Add safe places to go'
    },
    {
      id: 'reasons-for-living',
      title: 'Reasons for Living',
      icon: Heart,
      color: '#EC4899',
      bgColor: '#FCE7F3',
      items: safetyPlan.reasonsForLiving,
      emptyText: 'Add your reasons for living'
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6B46C1', '#9333EA']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>You Matter</Text>
          <Text style={styles.headerSubtitle}>Your safety plan is here when you need it</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
          activeOpacity={0.8}
        >
          <Phone size={20} color="#FFFFFF" />
          <Text style={styles.emergencyButtonText}>Crisis Hotline: 988</Text>
        </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push('/edit-plan')}
        activeOpacity={0.7}
      >
        <Edit3 size={18} color="#6B46C1" />
        <Text style={styles.editButtonText}>Edit Plan</Text>
      </TouchableOpacity>

      <View style={styles.sections}>
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <View key={section.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: section.bgColor }]}>
                  <Icon size={20} color={section.color} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              
              {section.items.length > 0 ? (
                <View style={styles.itemsList}>
                  {section.items.map((item, index) => (
                    <View key={index} style={styles.item}>
                      <Sparkles size={12} color="#9CA3AF" />
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>{section.emptyText}</Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Remember: This too shall pass</Text>
        <Text style={styles.footerSubtext}>You've survived 100% of your worst days</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
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
  emergencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: -20,
    marginBottom: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: '#6B46C1',
    fontSize: 14,
    fontWeight: '600',
  },
  sections: {
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemsList: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});