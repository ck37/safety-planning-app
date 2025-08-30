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
  Image,
  Platform,
} from 'react-native';
import { TrendingUp, TrendingDown, Minus, X, Plus, Camera, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMoodTracking } from '@/providers/MoodTrackingProvider';
import { useSafetyPlan } from '@/providers/SafetyPlanProvider';

export default function MoodTracker() {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState(5);
  const [notes, setNotes] = useState('');
  const [selectedWarningSigns, setSelectedWarningSigns] = useState<string[]>([]);
  const [selectedCopingStrategies, setSelectedCopingStrategies] = useState<string[]>([]);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const { addMoodEntry, getMoodTrend, moodEntries } = useMoodTracking();
  const { safetyPlan } = useSafetyPlan();

  const moodTrend = getMoodTrend();
  const todayEntry = moodEntries.find(entry => entry.date === new Date().toISOString().split('T')[0]);

  // Initialize form with today's entry data when modal opens
  const initializeFormData = () => {
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setNotes(todayEntry.notes || '');
      setSelectedWarningSigns(todayEntry.warningSignsPresent);
      setSelectedCopingStrategies(todayEntry.copingStrategiesUsed);
      setPhotoUri(todayEntry.photoUri || null);
    } else {
      // Reset to defaults for new entry
      setSelectedMood(5);
      setNotes('');
      setSelectedWarningSigns([]);
      setSelectedCopingStrategies([]);
      setPhotoUri(null);
    }
  };

  const handleSubmitMood = async () => {
    await addMoodEntry(selectedMood, notes, selectedWarningSigns, selectedCopingStrategies, photoUri || undefined);
    setShowMoodModal(false);
    setSelectedMood(5);
    setNotes('');
    setSelectedWarningSigns([]);
    setSelectedCopingStrategies([]);
    setPhotoUri(null);
    Alert.alert('Mood Logged', 'Your mood has been recorded. Thank you for checking in.');
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library permission is needed to select photos.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Reduced quality to prevent memory issues
        base64: false, // Explicitly disable base64 to save memory
        exif: false, // Disable EXIF data to save memory
      });

      if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        'Camera Error', 
        'Unable to access camera. Please check your camera permissions and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const selectPhoto = async () => {
    try {
      const hasPermission = await requestMediaLibraryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Reduced quality to prevent memory issues
        base64: false, // Explicitly disable base64 to save memory
        exif: false, // Disable EXIF data to save memory
      });

      if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Photo library error:', error);
      Alert.alert(
        'Photo Library Error', 
        'Unable to access photo library. Please check your photo permissions and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Web-specific photo upload handler
  const selectPhotoWeb = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select an image smaller than 5MB.');
          return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
          Alert.alert('Invalid File Type', 'Please select an image file.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          setPhotoUri(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removePhoto = () => {
    setPhotoUri(null);
  };

  const showPhotoOptions = () => {
    if (Platform.OS === 'web') {
      // On web, directly open file picker since camera access is limited
      selectPhotoWeb();
    } else {
      // On mobile, show options for camera or photo library
      Alert.alert(
        'Add Photo',
        'Choose how you would like to add a photo to your mood entry',
        [
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Library', onPress: selectPhoto },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
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
              <View style={styles.moodInfo}>
                <Text style={styles.moodLabel}>Today&apos;s mood</Text>
                {todayEntry.notes && (
                  <Text style={styles.moodNotes} numberOfLines={2}>
                    {todayEntry.notes}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => {
                initializeFormData();
                setShowMoodModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={() => {
              initializeFormData();
              setShowMoodModal(true);
            }}
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
        <div style={styles.modalWrapper as any}>
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

            {/* Photo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add a photo (optional)</Text>
              <Text style={styles.sectionSubtitle}>Capture a moment that represents your mood</Text>
              
              {photoUri ? (
                <View style={styles.photoContainer}>
                  <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={removePhoto}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color="#DC2626" />
                    <Text style={styles.removePhotoText}>Remove Photo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={showPhotoOptions}
                  activeOpacity={0.7}
                >
                  <Camera size={20} color="#6B46C1" />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
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
        </div>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
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
  moodInfo: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  moodNotes: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
    fontStyle: 'italic',
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
  photoContainer: {
    alignItems: 'center',
    gap: 12,
  },
  photoPreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  addPhotoButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6B46C1',
    borderStyle: 'dashed',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addPhotoText: {
    color: '#6B46C1',
    fontSize: 16,
    fontWeight: '500',
  },
  removePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removePhotoText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
});
