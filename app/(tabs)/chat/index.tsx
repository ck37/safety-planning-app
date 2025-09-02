import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Trash2, Bot, User } from 'lucide-react-native';
import { ChatMessage, ChatState } from '../../../types/Chat';
import { chatAIService } from '../../../services/ChatAIService';
import { chatStorageService } from '../../../services/ChatStorageService';

export default function ChatScreen() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: undefined,
  });
  const [inputText, setInputText] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatState.messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatState.messages]);

  const loadChatHistory = async () => {
    try {
      const messages = await chatStorageService.loadMessages();
      const count = await chatStorageService.getMessageCount();
      setChatState(prev => ({ ...prev, messages }));
      setMessageCount(count);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const generateMessageId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async () => {
    if (!inputText.trim() || chatState.isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      content: inputText.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately
    const updatedMessages = [...chatState.messages, userMessage];
    setChatState(prev => ({
      ...prev,
      messages: updatedMessages,
      isLoading: true,
      error: undefined,
    }));

    setInputText('');

    try {
      // Get AI response
      const aiResponse = await chatAIService.generateResponse(userMessage.content);

      const aiMessage: ChatMessage = {
        id: generateMessageId(),
        content: aiResponse.content,
        role: 'ai',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];

      setChatState(prev => ({
        ...prev,
        messages: finalMessages,
        isLoading: false,
        error: aiResponse.success ? undefined : aiResponse.error,
      }));

      // Save to storage
      await chatStorageService.saveMessages(finalMessages);
      setMessageCount(finalMessages.length);

    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to get AI response',
      }));
      console.error('Error sending message:', error);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await chatStorageService.clearMessages();
              chatAIService.clearContext();
              setChatState({
                messages: [],
                isLoading: false,
                error: undefined,
              });
              setMessageCount(0);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear chat history');
            }
          },
        },
      ]
    );
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    
    return (
      <View key={message.id} style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        <View style={styles.messageHeader}>
          <View style={styles.messageRole}>
            {isUser ? (
              <User size={16} color="#6B46C1" />
            ) : (
              <Bot size={16} color="#059669" />
            )}
            <Text style={[styles.roleText, isUser ? styles.userRoleText : styles.aiRoleText]}>
              {isUser ? 'You' : 'AI'}
            </Text>
          </View>
          <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
        </View>
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
          {message.content}
        </Text>
      </View>
    );
  };

  const aiStatus = chatAIService.getStatus();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Chat</Text>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton} testID="clear-button">
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            ⚠️ <Text style={styles.disclaimerBold}>Demo Only:</Text> This is a proof of concept chat interface with simple pre-programmed responses. It does not include LLM-based analysis or suicide prevention capabilities. For crisis support, please use the Crisis Help tab or contact emergency services.
          </Text>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {chatState.messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Bot size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>
                Hello! I'm here to chat with you. How are you feeling today?
              </Text>
            </View>
          ) : (
            chatState.messages.map(renderMessage)
          )}
          
          {chatState.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6B46C1" />
              <Text style={styles.loadingText}>AI is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Error Message */}
        {chatState.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{chatState.error}</Text>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
              editable={!chatState.isLoading}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || chatState.isLoading) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim() || chatState.isLoading}
              testID="send-button"
            >
              <Send size={20} color={(!inputText.trim() || chatState.isLoading) ? '#9CA3AF' : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
          
          {/* Status Bar */}
          <View style={styles.statusBar}>
            <Text style={styles.statusText}>
              AI: {aiStatus.ready ? 'Ready' : 'Not Ready'} • {messageCount} messages
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearButton: {
    padding: 8,
  },
  disclaimerContainer: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
    textAlign: 'left',
  },
  disclaimerBold: {
    fontWeight: '600',
    color: '#78350F',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageRole: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  userRoleText: {
    color: '#6B46C1',
  },
  aiRoleText: {
    color: '#059669',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    padding: 12,
    borderRadius: 16,
  },
  userMessageText: {
    backgroundColor: '#6B46C1',
    color: '#FFFFFF',
  },
  aiMessageText: {
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#6B46C1',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  statusBar: {
    paddingTop: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
