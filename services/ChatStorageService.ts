import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, ChatHistory } from '../types/Chat';

const CHAT_HISTORY_KEY = 'chat_history';

export class ChatStorageService {
  async saveMessages(messages: ChatMessage[]): Promise<void> {
    try {
      const chatHistory: ChatHistory = {
        messages,
        lastUpdated: new Date()
      };
      
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Failed to save chat messages:', error);
      throw new Error('Failed to save chat history');
    }
  }

  async loadMessages(): Promise<ChatMessage[]> {
    try {
      const storedData = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      
      if (!storedData) {
        return [];
      }

      const chatHistory: ChatHistory = JSON.parse(storedData);
      
      // Convert timestamp strings back to Date objects
      const messages = chatHistory.messages.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp)
      }));

      return messages;
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      return [];
    }
  }

  async clearMessages(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear chat messages:', error);
      throw new Error('Failed to clear chat history');
    }
  }

  async getMessageCount(): Promise<number> {
    try {
      const messages = await this.loadMessages();
      return messages.length;
    } catch (error) {
      console.error('Failed to get message count:', error);
      return 0;
    }
  }

  async getLastMessageTime(): Promise<Date | null> {
    try {
      const messages = await this.loadMessages();
      if (messages.length === 0) {
        return null;
      }
      
      return messages[messages.length - 1].timestamp;
    } catch (error) {
      console.error('Failed to get last message time:', error);
      return null;
    }
  }
}

export const chatStorageService = new ChatStorageService();
