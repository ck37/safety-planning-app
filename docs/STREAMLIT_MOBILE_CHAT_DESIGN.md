# React Native Chat Integration Plan - Simple Local AI Chat

## Executive Summary

This document outlines the integration of basic chat functionality into the existing React Native suicide safety planning app. The chat will be implemented as a new tab in the bottom navigation bar, providing general conversation capabilities with local, offline AI models. The focus is on seamless integration with the current app architecture while maintaining simplicity and mobile optimization.

## Design Overview

### Core Principles
- **Native Integration**: Seamless integration with existing React Native app
- **Tab Navigation**: New "Chat" tab in the existing bottom navigation
- **Simplicity First**: Minimal viable chat interface
- **Local-Only AI**: Complete offline functionality with on-device models
- **No Safety Plan Features**: General conversation only (separate from safety planning)
- **Consistent UI**: Matches existing app design patterns and purple theme
- **Easy Testing**: Comprehensive but straightforward test coverage

### Technology Stack
- **Frontend**: React Native with TypeScript (existing stack)
- **Navigation**: Expo Router tabs (existing navigation system)
- **AI Backend**: React Native AI libraries (Transformers.js, ONNX Runtime)
- **Storage**: AsyncStorage for chat history (optional)
- **Icons**: Lucide React Native (existing icon system)
- **Styling**: Consistent with existing app theme (#6B46C1 purple)

## Architecture Design

### React Native Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                React Native App                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Expo Router Navigation                     │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │ │
│  │  │My Plan  │ │Crisis   │ │Resources│ │    Chat     │   │ │
│  │  │(Heart)  │ │(Phone)  │ │(Book)   │ │(MessageCircle)│ │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Chat Tab Component                       │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │ │
│  │  │   Message   │  │ Chat Input  │  │   AI Response   │ │ │
│  │  │   History   │  │   Field     │  │    Display      │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              React Native AI Service                    │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │ │
│  │  │Transformers │  │ ONNX Runtime│  │   Fallback      │ │ │
│  │  │    .js      │  │   Models    │  │   Responses     │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 AsyncStorage                            │ │
│  │           (Optional Chat History)                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Plan

### Phase 1: React Native Chat Tab Integration (1 week)

#### 1.1 Update Navigation Layout

```typescript
// app/(tabs)/_layout.tsx - Add Chat Tab to Existing Navigation
import { Tabs } from 'expo-router';
import { Heart, Phone, BookOpen, MessageCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6B46C1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: '#6B46C1',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'My Plan',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="crisis"
        options={{
          title: 'Crisis Help',
          tabBarIcon: ({ color, size }) => <Phone color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'Resources',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
```

#### 1.2 Create Chat Tab Structure

```typescript
// app/(tabs)/chat/_layout.tsx - Chat Tab Layout
import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'AI Chat',
          headerStyle: {
            backgroundColor: '#6B46C1',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}
```

#### 1.3 Main Chat Component

```typescript
// app/(tabs)/chat/index.tsx - Main Chat Interface
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Trash2, Bot, User } from 'lucide-react-native';
import { ChatAIService } from '../../../services/ChatAIService';
import { ChatMessage } from '../../../types/Chat';
import { styles } from './styles';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiService] = useState(() => new ChatAIService());
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Initialize AI service
    initializeAI();
  }, []);

  const initializeAI = async () => {
    try {
      await aiService.initialize();
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      Alert.alert('AI Error', 'Failed to initialize AI service. Using fallback responses.');
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await aiService.generateResponse(userMessage.content);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => setMessages([])
        },
      ]
    );
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        <View style={styles.messageHeader}>
          {isUser ? (
            <User size={16} color="#6B46C1" />
          ) : (
            <Bot size={16} color="#059669" />
          )}
          <Text style={styles.messageRole}>
            {isUser ? 'You' : 'AI'}
          </Text>
          <Text style={styles.messageTime}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.aiMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText
          ]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Bot size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>Start a conversation</Text>
              <Text style={styles.emptyStateText}>
                Type a message below to begin chatting with the AI assistant.
              </Text>
            </View>
          ) : (
            messages.map(renderMessage)
          )}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6B46C1" />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={clearChat}
            >
              <Trash2 size={16} color="#6B46C1" />
              <Text style={styles.controlButtonText}>Clear</Text>
            </TouchableOpacity>
            
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator,
                aiService.isReady() ? styles.statusReady : styles.statusNotReady
              ]} />
              <Text style={styles.statusText}>
                AI {aiService.isReady() ? 'Ready' : 'Loading'}
              </Text>
            </View>
            
            <View style={styles.messageCountContainer}>
              <Text style={styles.messageCountText}>
                {messages.length} messages
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

#### 1.4 Chat Styles

```typescript
// app/(tabs)/chat/styles.ts - Chat Component Styles
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minHeight: 300,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 8,
    color: '#374151',
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  messageBubble: {
    maxWidth: width * 0.8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: '#6B46C1',
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#374151',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#6B46C1',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  controlButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B46C1',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusReady: {
    backgroundColor: '#10B981',
  },
  statusNotReady: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  messageCountContainer: {
    paddingHorizontal: 8,
  },
  messageCountText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
```

#### 1.5 Chat Types

```typescript
// types/Chat.ts - Chat Type Definitions
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatAIConfig {
  maxResponseLength: number;
  responseTimeout: number;
  maxConversationLength: number;
  enableFallback: boolean;
}

export interface ChatAICapabilities {
  textGeneration: boolean;
  conversation: boolean;
  mobileOptimized: boolean;
  offlineCapable: boolean;
}

export interface ChatAIModelInfo {
  modelType: 'transformers' | 'onnx' | 'fallback';
  ready: boolean;
  capabilities: ChatAICapabilities;
  version?: string;
}
```

#### 1.6 React Native AI Service

```typescript
// services/ChatAIService.ts - React Native AI Service
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ChatAIService {
  private modelType: 'transformers' | 'onnx' | 'fallback' = 'fallback';
  private ready: boolean = false;
  private model: any = null;

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing Chat AI Service...');
      
      // Try to initialize Transformers.js first
      if (await this.initializeTransformers()) {
        this.modelType = 'transformers';
        this.ready = true;
        console.log('✅ Using Transformers.js model');
        return;
      }

      // Try ONNX Runtime
      if (await this.initializeONNX()) {
        this.modelType = 'onnx';
        this.ready = true;
        console.log('✅ Using ONNX Runtime model');
        return;
      }

      // Fallback to rule-based responses
      this.modelType = 'fallback';
      this.ready = true;
      console.log('✅ Using fallback responses');
      
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      this.modelType = 'fallback';
      this.ready = true;
    }
  }

  private async initializeTransformers(): Promise<boolean> {
    try {
      // This would use @xenova/transformers for React Native
      // For now, return false to use fallback
      return false;
    } catch (error) {
      console.error('Transformers initialization failed:', error);
      return false;
    }
  }

  private async initializeONNX(): Promise<boolean> {
    try {
      // This would use ONNX Runtime for React Native
      // For now, return false to use fallback
      return false;
    } catch (error) {
      console.error('ONNX initialization failed:', error);
      return false;
    }
  }

  async generateResponse(userInput: string): Promise<string> {
    if (!this.ready) {
      throw new Error('AI service is not ready');
    }

    switch (this.modelType) {
      case 'transformers':
        return this.generateTransformersResponse(userInput);
      case 'onnx':
        return this.generateONNXResponse(userInput);
      default:
        return this.generateFallbackResponse(userInput);
    }
  }

  private async generateTransformersResponse(userInput: string): Promise<string> {
    // Placeholder for Transformers.js implementation
    return this.generateFallbackResponse(userInput);
  }

  private async generateONNXResponse(userInput: string): Promise<string> {
    // Placeholder for ONNX Runtime implementation
    return this.generateFallbackResponse(userInput);
  }

  private generateFallbackResponse(userInput: string): string {
    const userLower = userInput.toLowerCase();

    // Greeting responses
    if (this.containsAny(userLower, ['hello', 'hi', 'hey', 'greetings'])) {
      const responses = [
        "Hello! How are you doing today?",
        "Hi there! What's on your mind?",
        "Hey! Nice to meet you. How can I help?",
        "Greetings! What would you like to chat about?"
      ];
      return this.randomChoice(responses);
    }

    // Question responses
    if (userInput.trim().endsWith('?')) {
      const responses = [
        "That's a great question! What do you think?",
        "I'm not sure, but I'd love to hear your thoughts on that.",
        "Interesting question! Can you tell me more about what you're thinking?",
        "That's something worth exploring. What's your perspective?"
      ];
      return this.randomChoice(responses);
    }

    // Emotional responses
    if (this.containsAny(userLower, ['sad', 'happy', 'excited', 'worried', 'angry'])) {
      const responses = [
        "I can understand that feeling. Would you like to talk about it?",
        "Thanks for sharing that with me. How are you handling it?",
        "It sounds like you're going through something. I'm here to listen.",
        "Emotions can be complex. What's been on your mind lately?"
      ];
      return this.randomChoice(responses);
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! Can you tell me more?",
      "I see. What else would you like to talk about?",
      "Thanks for sharing that. What's been on your mind?",
      "I'm here to chat with you. What would you like to discuss?",
      "That sounds important to you. Can you elaborate?",
      "I appreciate you telling me that. What else is happening?"
    ];

    return this.randomChoice(defaultResponses);
  }

  private containsAny(text: string, words: string[]): boolean {
    return words.some(word => text.includes(word));
  }

  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  isReady(): boolean {
    return this.ready;
  }

  getModelInfo(): any {
    return {
      modelType: this.modelType,
      ready: this.ready,
      capabilities: this.getCapabilities()
    };
  }

  private getCapabilities(): string[] {
    switch (this.modelType) {
      case 'transformers':
        return ['text_generation', 'conversation', 'mobile_optimized'];
      case 'onnx':
        return ['text_generation', 'conversation', 'quantized', 'mobile_optimized'];
      default:
        return ['rule_based', 'fallback_responses', 'always_available'];
    }
  }
}
```

### Phase 2: Enhanced Features (1 week)

#### 2.1 Chat History Persistence

```typescript
// services/ChatStorageService.ts - Chat History Management
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '../types/Chat';

const CHAT_HISTORY_KEY = 'chat_history';
const MAX_STORED_MESSAGES = 100;

export class ChatStorageService {
  static async saveMessages(messages: ChatMessage[]): Promise<void> {
    try {
      // Keep only the most recent messages
      const messagesToSave = messages.slice(-MAX_STORED_MESSAGES);
      const serializedMessages = JSON.stringify(messagesToSave);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, serializedMessages);
    } catch (error) {
      console.error('Failed to save chat messages:', error);
    }
  }

  static async loadMessages(): Promise<ChatMessage[]> {
    try {
      const serializedMessages = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (serializedMessages) {
        const messages = JSON.parse(serializedMessages);
        // Convert timestamp strings back to Date objects
        return messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      return [];
    }
  }

  static async clearMessages(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear chat messages:', error);
    }
  }
}
```

#### 2.2 Package Dependencies

```json
// package.json additions - Required dependencies
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.19.0",
    "lucide-react-native": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.72.0"
  }
}
```

### Phase 3: Testing Plan (1 week)

#### 3.1 React Native Component Tests

```typescript
// __tests__/chat/ChatScreen.test.tsx - Component Tests
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatScreen from '../../app/(tabs)/chat/index';
import { ChatAIService } from '../../services/ChatAIService';

// Mock the AI service
jest.mock('../../services/ChatAIService');

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<ChatScreen />);
    
    expect(getByText('Start a conversation')).toBeTruthy();
    expect(getByPlaceholderText('Type your message...')).toBeTruthy();
  });

  it('sends a message when send button is pressed', async () => {
    const mockGenerateResponse = jest.fn().mockResolvedValue('AI response');
    (ChatAIService as jest.Mock).mockImplementation(() => ({
      initialize: jest.fn(),
      generateResponse: mockGenerateResponse,
      isReady: jest.fn().mockReturnValue(true),
    }));

    const { getByPlaceholderText, getByRole } = render(<ChatScreen />);
    
    const input = getByPlaceholderText('Type your message...');
    const sendButton = getByRole('button', { name: /send/i });

    fireEvent.changeText(input, 'Hello AI');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(mockGenerateResponse).toHaveBeenCalledWith('Hello AI');
    });
  });

  it('displays user and AI messages', async () => {
    const mockGenerateResponse = jest.fn().mockResolvedValue('Hello human!');
    (ChatAIService as jest.Mock).mockImplementation(() => ({
      initialize: jest.fn(),
      generateResponse: mockGenerateResponse,
      isReady: jest.fn().mockReturnValue(true),
    }));

    const { getByPlaceholderText, getByRole, getByText } = render(<ChatScreen />);
    
    const input = getByPlaceholderText('Type your message...');
    const sendButton = getByRole('button', { name: /send/i });

    fireEvent.changeText(input, 'Hello AI');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(getByText('Hello AI')).toBeTruthy();
      expect(getByText('Hello human!')).toBeTruthy();
    });
  });

  it('clears chat when clear button is pressed', async () => {
    const { getByText } = render(<ChatScreen />);
    
    const clearButton = getByText('Clear');
    fireEvent.press(clearButton);

    // Should show confirmation alert
    // This would need to be tested with a proper alert mock
  });

  it('handles AI service errors gracefully', async () => {
    const mockGenerateResponse = jest.fn().mockRejectedValue(new Error('AI Error'));
    (ChatAIService as jest.Mock).mockImplementation(() => ({
      initialize: jest.fn(),
      generateResponse: mockGenerateResponse,
      isReady: jest.fn().mockReturnValue(true),
    }));

    const { getByPlaceholderText, getByRole, getByText } = render(<ChatScreen />);
    
    const input = getByPlaceholderText('Type your message...');
    const sendButton = getByRole('button', { name: /send/i });

    fireEvent.changeText(input, 'Hello AI');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(getByText('Sorry, I encountered an error. Please try again.')).toBeTruthy();
    });
  });
});
```

#### 3.2 AI Service Tests

```typescript
// __tests__/services/ChatAIService.test.ts - Service Tests
import { ChatAIService } from '../../services/ChatAIService';

describe('ChatAIService', () => {
  let aiService: ChatAIService;

  beforeEach(() => {
    aiService = new ChatAIService();
  });

  it('initializes correctly', async () => {
    await aiService.initialize();
    expect(aiService.isReady()).toBe(true);
  });

  it('generates responses for greetings', async () => {
    await aiService.initialize();
    
    const greetings = ['Hello', 'Hi', 'Hey', 'Greetings'];
    
    for (const greeting of greetings) {
      const response = await aiService.generateResponse(greeting);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    }
  });

  it('generates responses for questions', async () => {
    await aiService.initialize();
    
    const questions = ['How are you?', 'What can you do?', 'Can you help me?'];
    
    for (const question of questions) {
      const response = await aiService.generateResponse(question);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    }
  });

  it('handles emotional content appropriately', async () => {
    await aiService.initialize();
    
    const emotionalInputs = [
      'I am feeling sad',
      'I am really happy today',
      'I am worried about something'
    ];
    
    for (const input of emotionalInputs) {
      const response = await aiService.generateResponse(input);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    }
  });

  it('provides model information', async () => {
    await aiService.initialize();
    
    const modelInfo = aiService.getModelInfo();
    expect(modelInfo).toHaveProperty('modelType');
    expect(modelInfo).toHaveProperty('ready');
    expect(modelInfo).toHaveProperty('capabilities');
    expect(Array.isArray(modelInfo.capabilities)).toBe(true);
  });

  it('handles empty input gracefully', async () => {
    await aiService.initialize();
    
    const emptyInputs = ['', '   ', '\n', '\t'];
    
    for (const input of emptyInputs) {
      const response = await aiService.generateResponse(input);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    }
  });
});
```

#### 3.3 Integration Tests

```typescript
// __tests__/integration/ChatIntegration.test.tsx - Integration Tests
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ChatScreen from '../../app/(tabs)/chat/index';
import { ChatStorageService } from '../../services/ChatStorageService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Chat Integration', () => {
  const renderWithNavigation = (component: React.ReactElement) => {
    return render(
      <NavigationContainer>
        {component}
      </NavigationContainer>
    );
  };

  it('integrates with storage service', async () => {
    const mockSaveMessages = jest.spyOn(ChatStorageService, 'saveMessages');
    const mockLoadMessages = jest.spyOn(ChatStorageService, 'loadMessages')
      .mockResolvedValue([]);

    const { getByPlaceholderText, getByRole } = renderWithNavigation(<ChatScreen />);
    
    const input = getByPlaceholderText('Type your message...');
    const sendButton = getByRole('button', { name: /send/i });

    fireEvent.changeText(input, 'Test message');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(mockLoadMessages).toHaveBeenCalled();
    });
  });

  it('maintains chat state across component remounts', async () => {
    const testMessages = [
      {
        id: '1',
        content: 'Hello',
        role: 'user' as const,
        timestamp: new Date(),
      },
      {
        id: '2',
        content: 'Hi there!',
        role: 'assistant' as const,
        timestamp: new Date(),
      },
    ];

    jest.spyOn(ChatStorageService, 'loadMessages')
      .mockResolvedValue(testMessages);

    const { getByText, unmount, rerender } = renderWithNavigation(<ChatScreen />);

    await waitFor(() => {
      expect(getByText('Hello')).toBeTruthy();
      expect(getByText('Hi there!')).toBeTruthy();
    });

    unmount();
    rerender(
      <NavigationContainer>
        <ChatScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Hello')).toBeTruthy();
      expect(getByText('Hi there!')).toBeTruthy();
    });
  });
});
```

#### 3.4 Performance Tests

```typescript
// __tests__/performance/ChatPerformance.test.ts - Performance Tests
import { ChatAIService } from '../../services/ChatAIService';

describe('Chat Performance', () => {
  let aiService: ChatAIService;

  beforeEach(async () => {
    aiService = new ChatAIService();
    await aiService.initialize();
  });

  it('responds within acceptable time limits', async () => {
    const testMessages = [
      'Hello',
      'How are you?',
      'Tell me about yourself',
      'What can you do?',
      'Can you help me with something?'
    ];

    const responseTimes: number[] = [];

    for (const message of testMessages) {
      const startTime = Date.now();
      await aiService.generateResponse(message);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      responseTimes.push(responseTime);
      
      // Each response should be under 2 seconds for mobile
      expect(responseTime).toBeLessThan(2000);
    }

    // Average response time should be under 1 second
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    expect(avgResponseTime).toBeLessThan(1000);
  });

  it('handles concurrent requests efficiently', async () => {
    const promises = Array.from({ length: 5 }, (_, i) => 
      aiService.generateResponse(`Concurrent message ${i}`)
    );

    const startTime = Date.now();
    const responses = await Promise.all(promises);
    const endTime = Date.now();

    const totalTime = endTime - startTime;

    // All responses should be valid
    responses.forEach(response => {
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    // Total time should be reasonable (under 5 seconds)
    expect(totalTime).toBeLessThan(5000);
  });

  it('maintains performance with long conversation history', async () => {
    // Simulate a long conversation
    const messages = Array.from({ length: 50 }, (_, i) => `Message ${i}`);
    
    const responseTimes: number[] = [];

    for (const message of messages.slice(0, 10)) { // Test first 10 for performance
      const startTime = Date.now();
      await aiService.generateResponse(message);
      const endTime = Date.now();
      
      responseTimes.push(endTime - startTime);
    }

    // Performance should remain consistent
    const firstResponse = responseTimes[0];
    const lastResponse = responseTimes[responseTimes.length - 1];
    
    // Last response shouldn't be more than 2x slower than first
    expect(lastResponse).toBeLessThan(firstResponse * 2);
  });
});
```

## Deployment Strategy

### React Native Development
```bash
# Install dependencies
npm install @react-native-async-storage/async-storage lucide-react-native

# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### Testing
```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPattern=chat
npm test -- --testPathPattern=services
npm test -- --testPathPattern=integration

# Run with coverage
npm test -- --coverage
```

### Build and Deploy
```bash
# Build for production
npx expo build:ios
npx expo build:android

# Deploy to app stores
npx expo submit:ios
npx expo submit:android
```

## Summary

This updated plan transforms the original Streamlit-based approach into a fully integrated React Native solution that:

1. **Seamlessly integrates** with the existing app navigation by adding a new "Chat" tab
2. **Maintains consistency** with the current app's design patterns and purple theme
3. **Provides local AI capabilities** with fallback responses for reliability
4. **Includes comprehensive testing** for components, services, and integration
5. **Follows React Native best practices** for mobile development
6. **Supports offline functionality** with optional chat history persistence

The implementation prioritizes simplicity while providing a solid foundation for future AI model integration as React Native AI libraries mature.

### Phase 2: Testing Plan (1 week)

#### 2.1 Unit Tests

```python
# tests/test_mobile_ai_service.py
import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mobile_ai_service import MobileAIService

class TestMobileAIService:
    
    @pytest.fixture
    def ai_service(self):
        return MobileAIService()
    
    def test_initialization(self, ai_service):
        """Test AI service initializes correctly"""
        assert ai_service is not None
        assert ai_service.model_type in ["transformers", "onnx", "fallback"]
        assert ai_service.is_ready() == True
    
    def test_basic_response_generation(self, ai_service):
        """Test basic response generation"""
        response = ai_service.generate_response("Hello")
        assert isinstance(response, str)
        assert len(response) > 0
        assert len(response) < 200  # Mobile-appropriate length
    
    def test_greeting_responses(self, ai_service):
        """Test greeting handling"""
        greetings = ["Hello", "Hi", "Hey", "Greetings"]
        for greeting in greetings:
            response = ai_service.generate_response(greeting)
            assert isinstance(response, str)
            assert len(response) > 0
    
    def test_question_responses(self, ai_service):
        """Test question handling"""
        questions = ["How are you?", "What's the weather like?", "Can you help me?"]
        for question in questions:
            response = ai_service.generate_response(question)
            assert isinstance(response, str)
            assert len(response) > 0
    
    def test_emotional_responses(self, ai_service):
        """Test emotional content handling"""
        emotional_inputs = ["I'm feeling sad", "I'm really happy", "I'm worried about something"]
        for input_text in emotional_inputs:
            response = ai_service.generate_response(input_text)
            assert isinstance(response, str)
            assert len(response) > 0
    
    def test_empty_input_handling(self, ai_service):
        """Test handling of empty or invalid input"""
        empty_inputs = ["", "   ", "\n", "\t"]
        for empty_input in empty_inputs:
            response = ai_service.generate_response(empty_input)
            assert isinstance(response, str)
            assert len(response) > 0
    
    def test_long_input_handling(self, ai_service):
        """Test handling of very long input"""
        long_input = "This is a very long message. " * 50
        response = ai_service.generate_response(long_input)
        assert isinstance(response, str)
        assert len(response) > 0
        assert len(response) < 300  # Should still be reasonable length
    
    def test_model_info(self, ai_service):
        """Test model information retrieval"""
        info = ai_service.get_model_info()
        assert isinstance(info, dict)
        assert "model_type" in info
        assert "ready" in info
        assert "capabilities" in info
        assert isinstance(info["capabilities"], list)
    
    def test_response_consistency(self, ai_service):
        """Test that similar inputs get reasonable responses"""
        test_input = "Tell me about yourself"
        responses = []
        
        # Generate multiple responses
        for _ in range(5):
            response = ai_service.generate_response(test_input)
            responses.append(response)
        
        # All responses should be strings
        assert all(isinstance(r, str) for r in responses)
        # All responses should have content
        assert all(len(r) > 0 for r in responses)
```

#### 2.2 Integration Tests

```python
# tests/test_streamlit_integration.py
import pytest
import streamlit as st
from streamlit.testing.v1 import AppTest

def test_app_initialization():
    """Test that the Streamlit app initializes correctly"""
    app = AppTest.from_file("mobile_chat_app.py")
    app.run()
    
    # Check that the app loads without errors
    assert not app.exception
    
    # Check for key UI elements
    assert len(app.markdown) > 0  # Should have title and description
    assert len(app.text_input) > 0  # Should have input field
    assert len(app.button) > 0  # Should have send button

def test_message_flow():
    """Test the complete message flow"""
    app = AppTest.from_file("mobile_chat_app.py")
    app.run()
    
    # Simulate user input
    app.text_input[0].input("Hello").run()
    app.button[0].click().run()  # Click send button
    
    # Check that messages were added to session state
    assert "messages" in app.session_state
    assert len(app.session_state.messages) >= 1

def test_clear_functionality():
    """Test chat clearing functionality"""
    app = AppTest.from_file("mobile_chat_app.py")
    app.run()
    
    # Add some messages first
    app.text_input[0].input("Test message").run()
    app.button[0].click().run()
    
    # Find and click clear button
    clear_button = None
    for button in app.button:
        if "Clear" in str(button):
            clear_button = button
            break
    
    if clear_button:
        clear_button.click().run()
        # Messages should be cleared
        assert len(app.session_state.messages) == 0
```

#### 2.3 Mobile-Specific Tests

```python
# tests/test_mobile_features.py
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class TestMobileFeatures:
    
    @pytest.fixture
    def mobile_driver(self):
        """Setup mobile Chrome driver"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_experimental_option("mobileEmulation", {
            "deviceName": "iPhone 12"
        })
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.get("http://localhost:8501")  # Streamlit default port
        yield driver
        driver.quit()
    
    def test_mobile_responsive_design(self, mobile_driver):
        """Test that the app is mobile responsive"""
        # Check viewport
        viewport_width = mobile_driver.execute_script("return window.innerWidth")
        assert viewport_width <= 768  # Mobile breakpoint
        
        # Check that elements are visible and properly sized
        input_element = WebDriverWait(mobile_driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='text']"))
        )
        assert input_element.is_displayed()
        
        # Check button size (should be touch-friendly)
        buttons = mobile_driver.find_elements(By.TAG_NAME, "button")
        for button in buttons:
            if button.is_displayed():
                size = button.size
                assert size['height'] >= 44  # Minimum touch target size
    
    def test_touch_interactions(self, mobile_driver):
        """Test touch-friendly interactions"""
        # Find input field
        input_field = WebDriverWait(mobile_driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "input[type='text']"))
        )
        
        # Test typing
        input_field.click()
        input_field.send_keys("Test message")
        
        # Find and click send button
        send_button = mobile_driver.find_element(By.XPATH, "//button[contains(text(), 'Send')]")
        assert send_button.is_displayed()
        send_button.click()
        
        # Wait for response (basic check)
        WebDriverWait(mobile_driver, 15).until(
            lambda driver: len(driver.find_elements(By.CLASS_NAME, "chat-message")) > 0
        )
    
    def test_offline_capability(self, mobile_driver):
        """Test offline functionality"""
        # This would test PWA offline capabilities
        # For now, just check that the app loads
        assert "AI Chat" in mobile_driver.title
        
        # Check that AI service initializes
        # (This would be more comprehensive in a real implementation)
        assert mobile_driver.find_element(By.TAG_NAME, "body").is_displayed()
```

#### 2.4 Performance Tests

```python
# tests/test_performance.py
import pytest
import time
import psutil
import threading
from mobile_ai_service import MobileAIService

class TestPerformance:
    
    @pytest.fixture
    def ai_service(self):
        return MobileAIService()
    
    def test_response_time(self, ai_service):
        """Test AI response time is acceptable for mobile"""
        test_messages = [
            "Hello",
            "How are you?",
            "Tell me a joke",
            "What's the weather like?",
            "Can you help me with something?"
        ]
        
        response_times = []
        
        for message in test_messages:
            start_time = time.time()
            response = ai_service.generate_response(message)
            end_time = time.time()
            
            response_time = end_time - start_time
            response_times.append(response_time)
            
            # Each response should be under 5 seconds for mobile
            assert response_time < 5.0
            assert len(response) > 0
        
        # Average response time should be under 3 seconds
        avg_response_time = sum(response_times) / len(response_times)
        assert avg_response_time < 3.0
    
    def test_memory_usage(self, ai_service):
        """Test memory usage stays reasonable"""
        process = psutil.Process()
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        # Generate many responses
        for i in range(50):
            ai_service.generate_response(f"Test message {i}")
        
        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_increase = final_memory - initial_memory
        
        # Memory increase should be reasonable (less than 100MB)
        assert memory_increase < 100
    
    def test_concurrent_requests(self, ai_service):
        """Test handling multiple concurrent requests"""
        responses = []
        errors = []
        
        def generate_response(message):
            try:
                response = ai_service.generate_response(f"Concurrent test: {message}")
                responses.append(response)
            except Exception as e:
                errors.append(e)
        
        # Create multiple threads
        threads = []
        for i in range(10):
            thread = threading.Thread(target=generate_response, args=(f"message_{i}",))
            threads.append(thread)
        
        # Start all threads
        start_time = time.time()
        for thread in threads:
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        end_time = time.time()
        total_time = end_time - start_time
        
        # Check results
        assert len(errors) == 0  # No errors should occur
        assert len(responses) == 10  # All requests should complete
        assert total_time < 15  # Should complete within reasonable time
        
        # All responses should be valid
        for response in responses:
            assert isinstance(response, str)
            assert len(response) > 0
```

#### 2.5 Test Configuration

```python
# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    -v
    --tb=short
    --strict-markers
    --disable-warnings
markers =
    unit: Unit tests
    integration: Integration tests
    mobile: Mobile-specific tests
    performance: Performance tests
    slow: Slow running tests
```

```bash
# run_tests.sh - Test execution script
#!/bin/bash

echo "🧪 Running Mobile Chat Test Suite"

# Set test environment
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
export STREAMLIT_SERVER_HEADLESS=true

# Run different test categories
echo "📱 Running Unit Tests..."
pytest tests/test_mobile_ai_service.py -m unit -v

echo "🔗 Running Integration Tests..."
pytest tests/test_streamlit_integration.py -m integration -v

echo "📱 Running Mobile Tests..."
pytest tests/test_mobile_features.py -m mobile -v

echo "⚡ Running Performance Tests..."
pytest tests/test_performance.py -m performance -v

# Generate coverage report
echo "📊 Generating Coverage Report..."
pytest --cov=mobile_ai_service --cov=mobile_chat_app --cov-report=html

echo "✅ All tests completed!"
```

## Deployment Strategy

### Local Development
```bash
# Start the mobile chat app
streamlit run mobile_chat_app.py --server.port 8501 --server.address 0.0.0.0
```

### Mobile Testing
```bash
# Test on mobile device (same network)
# Access via: http://[your-ip]:8501
```

### PWA Deployment
```python
# pwa_config.py - Progressive
