import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { TrendingUp, TrendingDown, Minus, X, Plus } from 'lucide-react-native';
import { useMoodTracking } from '@/providers/MoodTrackingProvider';
import { useSafetyPlan } from '@/providers/SafetyPlanProvider';

export default function MoodTracker() {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState(5);
  const [notes, setNotes] = useState('');
  const [selectedWarningSigns, setSelectedWarningSigns] = useState<string[]>([]);
  const [selectedCopingStrategies, setSelectedCopingStrategies] = useState<string[]>([]);

  const { addMoodEntry, getMoodTrend, moodEntries } = useMoodTracking();
  const { safetyPlan } = useSafetyPlan();

  const moodTrend = getMoodTrend();
  const todayEntry = moodEntries.find(entry => entry.date === new Date().toISOString().split('T')[0]);

  const handleSubmitMood = async () => {
    await addMoodEntry(selectedMood, notes, selectedWarningSigns, selectedCopingStrategies);
    setShowMoodModal(false);
    setSelectedMood(5);
    setNotes('');
    setSelectedWarningSigns([]);
    setSelectedCopingStrategies([]);
    Alert.alert('Mood Logged', 'Your mood has been recorded. Thank you for checking in.');
  };

  const toggleWarningSign = (sign: string) => {
    setSelectedWarningSigns(prev => 
      prev.includes(sign) 
        ? prev.filter(s => s !== sign)
        : [...prev, sign]
    );
  };

  const toggleCopingStrategy = (strategy: string) => {
    setSelectedCopingStrategies(prev => 
      prev.includes(strategy) 
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return '#DC2626';
    if (mood <= 5) return '#F59E0B';
    if (mood <= 7) return '#10B981';
    return '#059669';
  };

  const getTrendIcon = () => {
    switch (moodTrend.trend) {
      case 'improving':
        return <TrendingUp size={16} color="#10B981" />;
      case 'declining':
        return <TrendingDown size={16} color="#DC2626" />;
      default:
        return <Minus size={16} color="#6B7280" />;
    }
  };

  const getRiskLevelColor = () => {
    switch (moodTrend.riskLevel) {
      case 'high':
        return '#DC2626';
      case 'moderate':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
          {moodEntries.length > 0 && (
            <View style={styles.trendContainer}>
              {getTrendIcon()}
              <Text style={[styles.trendText, { color: getRiskLevelColor() }]}>
                {moodTrend.trend}
              </Text>
            </View>
          )}
        </View>

        {todayEntry ? (
          <View style={styles.todayMoodContainer}>
            <View style={styles.moodDisplay}>
              <View style={[styles.moodCircle, { backgroundColor: getMoodColor(todayEntry.mood) }]}>
                <Text style={styles.moodNumber}>{todayEntry.mood}</Text>
              </View>
              <Text style={styles.moodLabel}>Today&apos;s mood</Text>
            </View>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => setShowMoodModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={() => setShowMoodModal(true)}
            activeOpacity={0.7}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.checkInButtonText}>Check In</Text>
          </TouchableOpacity>
        )}

        {moodTrend.patternInsights.length > 0 && (
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Insights</Text>
            {moodTrend.patternInsights.slice(0, 2).map((insight, index) => (
              <Text key={index} style={styles.insightText}>• {insight}</Text>
            ))}
          </View>
        )}
      </View>

      <Modal
        visible={showMoodModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMoodModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Mood Check-In</Text>
            <TouchableOpacity
              onPress={() => setShowMoodModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Mood Scale */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How are you feeling right now?</Text>
              <Text style={styles.sectionSubtitle}>1 = Very Low, 10 = Excellent</Text>
              
              <View style={styles.moodScale}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.moodOption,
                      { backgroundColor: getMoodColor(mood) },
                      selectedMood === mood && styles.selectedMoodOption
                    ]}
                    onPress={() => setSelectedMood(mood)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.moodOptionText}>{mood}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Warning Signs */}
            {safetyPlan.warningSigns.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Any warning signs present?</Text>
                <View style={styles.optionsGrid}>
                  {safetyPlan.warningSigns.map((sign, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionChip,
                        selectedWarningSigns.includes(sign) && styles.selectedChip
                      ]}
                      onPress={() => toggleWarningSign(sign)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionChipText,
                        selectedWarningSigns.includes(sign) && styles.selectedChipText
                      ]}>
                        {sign}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Coping Strategies */}
            {safetyPlan.copingStrategies.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Coping strategies you&apos;ve used today?</Text>
                <View style={styles.optionsGrid}>
                  {safetyPlan.copingStrategies.map((strategy, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionChip,
                        selectedCopingStrategies.includes(strategy) && styles.selectedChip
                      ]}
                      onPress={() => toggleCopingStrategy(strategy)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionChipText,
                        selectedCopingStrategies.includes(strategy) && styles.selectedChipText
                      ]}>
                        {strategy}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional notes (optional)</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="How was your day? What's on your mind?"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitMood}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Log Mood</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  todayMoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moodCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  moodLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  updateButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  checkInButton: {
    backgroundColor: '#6B46C1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  checkInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  insightsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  moodScale: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMoodOption: {
    borderWidth: 3,
    borderColor: '#1F2937',
  },
  moodOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedChip: {
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1',
  },
  optionChipText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
