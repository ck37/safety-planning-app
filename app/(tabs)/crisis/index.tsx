import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { Phone, MessageCircle, Globe, Heart } from 'lucide-react-native';

interface CrisisResource {
  name: string;
  description: string;
  phone?: string;
  text?: string;
  website?: string;
  icon: any;
  color: string;
}

export default function CrisisScreen() {
  const resources: CrisisResource[] = [
    {
      name: '988 Suicide & Crisis Lifeline',
      description: '24/7 crisis support for anyone in emotional distress',
      phone: '988',
      text: '988',
      website: 'https://988lifeline.org',
      icon: Phone,
      color: '#DC2626',
    },
    {
      name: 'Crisis Text Line',
      description: 'Text HOME to 741741 for 24/7 crisis support',
      text: '741741',
      website: 'https://www.crisistextline.org',
      icon: MessageCircle,
      color: '#2563EB',
    },
    {
      name: 'Trevor Project',
      description: 'LGBTQ+ youth crisis support',
      phone: '1-866-488-7386',
      text: '678-678',
      website: 'https://www.thetrevorproject.org',
      icon: Heart,
      color: '#8B5CF6',
    },
    {
      name: 'Veterans Crisis Line',
      description: 'Support for veterans and their families',
      phone: '1-800-273-8255',
      text: '838255',
      website: 'https://www.veteranscrisisline.net',
      icon: Phone,
      color: '#059669',
    },
  ];

  const handleCall = (number: string) => {
    if (Platform.OS !== 'web') {
      Linking.openURL(`tel:${number}`);
    } else {
      alert(`Please call: ${number}`);
    }
  };

  const handleText = (number: string, keyword?: string) => {
    if (Platform.OS !== 'web') {
      const message = keyword ? `sms:${number}&body=${keyword}` : `sms:${number}`;
      Linking.openURL(message);
    } else {
      alert(`Text ${keyword || ''} to ${number}`);
    }
  };

  const handleWebsite = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.urgentCard}>
        <Text style={styles.urgentTitle}>Need Help Now?</Text>
        <Text style={styles.urgentText}>
          You're not alone. Reach out to any of these resources for immediate support.
        </Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => handleCall('988')}
          activeOpacity={0.8}
        >
          <Phone size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Call 988 Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Crisis Resources</Text>
      
      {resources.map((resource, index) => {
        const Icon = resource.icon;
        return (
          <View key={index} style={styles.resourceCard}>
            <View style={styles.resourceHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${resource.color}15` }]}>
                <Icon size={24} color={resource.color} />
              </View>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              {resource.phone && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${resource.color}10` }]}
                  onPress={() => handleCall(resource.phone!)}
                  activeOpacity={0.7}
                >
                  <Phone size={16} color={resource.color} />
                  <Text style={[styles.actionButtonText, { color: resource.color }]}>Call</Text>
                </TouchableOpacity>
              )}
              
              {resource.text && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${resource.color}10` }]}
                  onPress={() => handleText(resource.text!, resource.name === 'Crisis Text Line' ? 'HOME' : undefined)}
                  activeOpacity={0.7}
                >
                  <MessageCircle size={16} color={resource.color} />
                  <Text style={[styles.actionButtonText, { color: resource.color }]}>Text</Text>
                </TouchableOpacity>
              )}
              
              {resource.website && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${resource.color}10` }]}
                  onPress={() => handleWebsite(resource.website!)}
                  activeOpacity={0.7}
                >
                  <Globe size={16} color={resource.color} />
                  <Text style={[styles.actionButtonText, { color: resource.color }]}>Web</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Remember: Asking for help is a sign of strength</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  urgentCard: {
    backgroundColor: '#FEE2E2',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  urgentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 8,
  },
  urgentText: {
    fontSize: 14,
    color: '#7F1D1D',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});