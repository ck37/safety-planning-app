import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { 
  Brain, 
  Heart, 
  Users, 
  BookOpen,
  Headphones,
  Activity,
  ExternalLink
} from 'lucide-react-native';

interface Resource {
  title: string;
  description: string;
  icon: any;
  color: string;
  link?: string;
  tips?: string[];
}

export default function ResourcesScreen() {
  const resources: Resource[] = [
    {
      title: 'Breathing Exercises',
      description: 'Simple techniques to calm your mind and body',
      icon: Activity,
      color: '#3B82F6',
      tips: [
        '4-7-8 Breathing: Inhale for 4, hold for 7, exhale for 8',
        'Box Breathing: Inhale 4, hold 4, exhale 4, hold 4',
        'Belly Breathing: Place hand on stomach, breathe deeply',
      ],
    },
    {
      title: 'Grounding Techniques',
      description: 'Stay present when feeling overwhelmed',
      icon: Brain,
      color: '#8B5CF6',
      tips: [
        '5-4-3-2-1: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
        'Hold an ice cube or splash cold water on your face',
        'Focus on your feet touching the ground',
      ],
    },
    {
      title: 'Self-Care Ideas',
      description: 'Activities to nurture your wellbeing',
      icon: Heart,
      color: '#EC4899',
      tips: [
        'Take a warm bath or shower',
        'Listen to calming music',
        'Go for a walk in nature',
        'Practice gentle stretching or yoga',
        'Write in a journal',
      ],
    },
    {
      title: 'Mindfulness Apps',
      description: 'Guided meditation and relaxation',
      icon: Headphones,
      color: '#10B981',
      link: 'https://www.headspace.com',
      tips: [
        'Headspace: Guided meditation',
        'Calm: Sleep stories and meditation',
        'Insight Timer: Free meditation library',
      ],
    },
    {
      title: 'Support Groups',
      description: 'Connect with others who understand',
      icon: Users,
      color: '#F59E0B',
      link: 'https://www.nami.org/support-education/support-groups',
      tips: [
        'NAMI support groups',
        'DBSA (Depression and Bipolar Support)',
        'Online forums and communities',
      ],
    },
    {
      title: 'Educational Resources',
      description: 'Learn more about mental health',
      icon: BookOpen,
      color: '#06B6D4',
      link: 'https://www.nimh.nih.gov',
      tips: [
        'NIMH: National Institute of Mental Health',
        'Mental Health America resources',
        'Psychology Today articles',
      ],
    },
  ];

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <div style={styles.contentWrapper as any}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wellness Resources</Text>
          <Text style={styles.headerSubtitle}>
            Tools and techniques to support your mental health journey
          </Text>
        </View>

      {resources.map((resource, index) => {
        const Icon = resource.icon;
        return (
          <View key={index} style={styles.resourceCard}>
            <View style={styles.resourceHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${resource.color}15` }]}>
                <Icon size={24} color={resource.color} />
              </View>
              <View style={styles.resourceTitleContainer}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
            </View>

            {resource.tips && (
              <View style={styles.tipsContainer}>
                {resource.tips.map((tip, tipIndex) => (
                  <View key={tipIndex} style={styles.tipItem}>
                    <View style={[styles.tipBullet, { backgroundColor: resource.color }]} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            {resource.link && (
              <TouchableOpacity
                style={[styles.linkButton, { backgroundColor: `${resource.color}10` }]}
                onPress={() => handleLink(resource.link!)}
                activeOpacity={0.7}
              >
                <Text style={[styles.linkButtonText, { color: resource.color }]}>
                  Learn More
                </Text>
                <ExternalLink size={14} color={resource.color} />
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Remember</Text>
        <Text style={styles.footerText}>
          Healing is not linear. Be patient and kind with yourself.
        </Text>
        </View>
      </ScrollView>
    </div>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#ECFDF5',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
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
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceTitleContainer: {
    flex: 1,
  },
  resourceTitle: {
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
  tipsContainer: {
    gap: 8,
    marginTop: 4,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#F3F4F6',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
