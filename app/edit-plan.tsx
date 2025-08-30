import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  AlertCircle, 
  Heart, 
  Users, 
  MapPin, 
  Shield,
  Plus,
  X,
  Save
} from 'lucide-react-native';
import { useSafetyPlan } from '@/providers/SafetyPlanProvider';
import { SafetyPlan, Contact } from '@/types/SafetyPlan';

export default function EditPlanScreen() {
  const { safetyPlan, updateSafetyPlan } = useSafetyPlan();
  const [editedPlan, setEditedPlan] = useState<SafetyPlan>(safetyPlan);
  const { section } = useLocalSearchParams<{ section?: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<{ [key: string]: View | null }>({});

  // Sync editedPlan with safetyPlan when safetyPlan changes
  useEffect(() => {
    setEditedPlan(safetyPlan);
  }, [safetyPlan]);

  // Auto-scroll to focused section
  useEffect(() => {
    if (section && sectionRefs.current[section]) {
      setTimeout(() => {
        sectionRefs.current[section]?.measureLayout(
          scrollViewRef.current?.getInnerViewNode() as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
          },
          () => {}
        );
      }, 100);
    }
  }, [section]);

  const handleSave = () => {
    updateSafetyPlan(editedPlan);
    Alert.alert('Success', 'Your safety plan has been saved', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const addItem = (field: keyof SafetyPlan, value: string) => {
    if (value.trim()) {
      setEditedPlan(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const removeItem = (field: keyof SafetyPlan, index: number) => {
    setEditedPlan(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addContact = (name: string, phone: string) => {
    if (name.trim()) {
      const newContact: Contact = { name: name.trim(), phone: phone.trim() };
      setEditedPlan(prev => ({
        ...prev,
        supportContacts: [...prev.supportContacts, newContact]
      }));
    }
  };

  const removeContact = (index: number) => {
    setEditedPlan(prev => ({
      ...prev,
      supportContacts: prev.supportContacts.filter((_, i) => i !== index)
    }));
  };

  const renderContent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Create a personalized safety plan for when you&apos;re in crisis
        </Text>
      </View>

      <Section
        ref={(ref) => { sectionRefs.current['warning-signs'] = ref; }}
        title="Warning Signs"
        subtitle="What thoughts, feelings, or behaviors tell you a crisis may be developing?"
        icon={AlertCircle}
        color="#EF4444"
        items={editedPlan.warningSigns}
        onAdd={(value) => addItem('warningSigns', value)}
        onRemove={(index) => removeItem('warningSigns', index)}
        placeholder="e.g., Feeling hopeless, isolating myself"
        isHighlighted={section === 'warning-signs'}
      />

      <Section
        ref={(ref) => { sectionRefs.current['coping-strategies'] = ref; }}
        title="Coping Strategies"
        subtitle="What can you do on your own to help yourself not act on thoughts of suicide?"
        icon={Shield}
        color="#10B981"
        items={editedPlan.copingStrategies}
        onAdd={(value) => addItem('copingStrategies', value)}
        onRemove={(index) => removeItem('copingStrategies', index)}
        placeholder="e.g., Take a walk, listen to music"
        isHighlighted={section === 'coping-strategies'}
      />

      <ContactSection
        ref={(ref) => { sectionRefs.current['support-contacts'] = ref; }}
        title="Support Contacts"
        subtitle="Who can you reach out to for support?"
        icon={Users}
        color="#3B82F6"
        contacts={editedPlan.supportContacts}
        onAdd={addContact}
        onRemove={removeContact}
        isHighlighted={section === 'support-contacts'}
      />

      <Section
        ref={(ref) => { sectionRefs.current['safe-places'] = ref; }}
        title="Safe Places"
        subtitle="Where can you go to feel safe and distract yourself?"
        icon={MapPin}
        color="#F59E0B"
        items={editedPlan.safePlaces}
        onAdd={(value) => addItem('safePlaces', value)}
        onRemove={(index) => removeItem('safePlaces', index)}
        placeholder="e.g., Library, friend's house, park"
        isHighlighted={section === 'safe-places'}
      />

      <Section
        ref={(ref) => { sectionRefs.current['reasons-for-living'] = ref; }}
        title="Reasons for Living"
        subtitle="What are your reasons for living? What gives you hope?"
        icon={Heart}
        color="#EC4899"
        items={editedPlan.reasonsForLiving}
        onAdd={(value) => addItem('reasonsForLiving', value)}
        onRemove={(index) => removeItem('reasonsForLiving', index)}
        placeholder="e.g., My family, my goals, my pet"
        isHighlighted={section === 'reasons-for-living'}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
        <Save size={20} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>Save Safety Plan</Text>
      </TouchableOpacity>
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          paddingBottom: '100px',
          maxWidth: '800px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

interface SectionProps {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  isHighlighted?: boolean;
}

const Section = React.forwardRef<View, SectionProps>(({ title, subtitle, icon: Icon, color, items, onAdd, onRemove, placeholder, isHighlighted }, ref) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <View ref={ref} style={[styles.section, isHighlighted && styles.highlightedSection]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.itemText}>{item}</Text>
          <TouchableOpacity onPress={() => onRemove(index)}>
            <X size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline
          blurOnSubmit={false}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: color }]} 
          onPress={handleAdd}
          activeOpacity={0.7}
        >
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

Section.displayName = 'Section';

interface ContactSectionProps {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  contacts: Contact[];
  onAdd: (name: string, phone: string) => void;
  onRemove: (index: number) => void;
  isHighlighted?: boolean;
}

const ContactSection = React.forwardRef<View, ContactSectionProps>(({ title, subtitle, icon: Icon, color, contacts, onAdd, onRemove, isHighlighted }, ref) => {
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  const handleAdd = () => {
    if (nameInput.trim()) {
      onAdd(nameInput, phoneInput);
      setNameInput('');
      setPhoneInput('');
    }
  };

  const handleNameKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handlePhoneKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <View ref={ref} style={[styles.section, isHighlighted && styles.highlightedSection]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {contacts.map((contact, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.contactInfo}>
            <Text style={styles.itemText}>{contact.name}</Text>
            {contact.phone && <Text style={styles.phoneText}>{contact.phone}</Text>}
          </View>
          <TouchableOpacity onPress={() => onRemove(index)}>
            <X size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.contactInputs}>
        <TextInput
          style={[styles.input, styles.nameInput]}
          value={nameInput}
          onChangeText={setNameInput}
          onKeyPress={handleNameKeyPress}
          onSubmitEditing={handleAdd}
          placeholder="Name"
          placeholderTextColor="#9CA3AF"
          blurOnSubmit={false}
        />
        <TextInput
          style={[styles.input, styles.phoneInputField]}
          value={phoneInput}
          onChangeText={setPhoneInput}
          onKeyPress={handlePhoneKeyPress}
          onSubmitEditing={handleAdd}
          placeholder="Phone (optional)"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: color }]} 
          onPress={handleAdd}
          activeOpacity={0.7}
        >
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

ContactSection.displayName = 'ContactSection';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  contactInfo: {
    flex: 1,
  },
  phoneText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  contactInputs: {
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  nameInput: {
    marginBottom: 0,
  },
  phoneInputField: {
    marginBottom: 8,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#6B46C1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  highlightedSection: {
    borderWidth: 2,
    borderColor: '#6B46C1',
    shadowColor: '#6B46C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
