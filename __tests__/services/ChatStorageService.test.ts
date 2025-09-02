import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatStorageService } from '../../services/ChatStorageService';
import { ChatMessage } from '../../types/Chat';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('ChatStorageService', () => {
  let chatStorageService: ChatStorageService;
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    chatStorageService = new ChatStorageService();
    jest.clearAllMocks();
  });

  const createMockMessage = (id: string, content: string, role: 'user' | 'ai'): ChatMessage => ({
    id,
    content,
    role,
    timestamp: new Date('2023-01-01T12:00:00Z'),
  });

  describe('saveMessages', () => {
    it('should save messages to AsyncStorage', async () => {
      const messages: ChatMessage[] = [
        createMockMessage('1', 'Hello', 'user'),
        createMockMessage('2', 'Hi there!', 'ai'),
      ];

      mockAsyncStorage.setItem.mockResolvedValue();

      await chatStorageService.saveMessages(messages);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'chat_history',
        expect.stringContaining('"messages"')
      );

      const savedData = JSON.parse(mockAsyncStorage.setItem.mock.calls[0][1]);
      expect(savedData.messages).toHaveLength(2);
      expect(savedData.messages[0].content).toBe('Hello');
      expect(savedData.messages[1].content).toBe('Hi there!');
      expect(savedData.lastUpdated).toBeDefined();
    });

    it('should handle save errors gracefully', async () => {
      const messages: ChatMessage[] = [createMockMessage('1', 'Test', 'user')];
      
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      await expect(chatStorageService.saveMessages(messages)).rejects.toThrow('Failed to save chat history');
    });

    it('should save empty messages array', async () => {
      mockAsyncStorage.setItem.mockResolvedValue();

      await chatStorageService.saveMessages([]);

      expect(mockAsyncStorage.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(mockAsyncStorage.setItem.mock.calls[0][1]);
      expect(savedData.messages).toHaveLength(0);
    });
  });

  describe('loadMessages', () => {
    it('should load messages from AsyncStorage', async () => {
      const mockMessages: ChatMessage[] = [
        createMockMessage('1', 'Hello', 'user'),
        createMockMessage('2', 'Hi there!', 'ai'),
      ];

      const mockStoredData = {
        messages: mockMessages,
        lastUpdated: new Date('2023-01-01T12:00:00Z'),
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockStoredData));

      const loadedMessages = await chatStorageService.loadMessages();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('chat_history');
      expect(loadedMessages).toHaveLength(2);
      expect(loadedMessages[0].content).toBe('Hello');
      expect(loadedMessages[1].content).toBe('Hi there!');
      expect(loadedMessages[0].timestamp).toBeInstanceOf(Date);
    });

    it('should return empty array when no data exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const loadedMessages = await chatStorageService.loadMessages();

      expect(loadedMessages).toEqual([]);
    });

    it('should handle load errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const loadedMessages = await chatStorageService.loadMessages();

      expect(loadedMessages).toEqual([]);
    });

    it('should handle corrupted data gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');

      const loadedMessages = await chatStorageService.loadMessages();

      expect(loadedMessages).toEqual([]);
    });

    it('should convert timestamp strings back to Date objects', async () => {
      const mockStoredData = {
        messages: [
          {
            id: '1',
            content: 'Test',
            role: 'user',
            timestamp: '2023-01-01T12:00:00Z',
          },
        ],
        lastUpdated: '2023-01-01T12:00:00Z',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockStoredData));

      const loadedMessages = await chatStorageService.loadMessages();

      expect(loadedMessages[0].timestamp).toBeInstanceOf(Date);
      expect(loadedMessages[0].timestamp.toISOString()).toBe('2023-01-01T12:00:00.000Z');
    });
  });

  describe('clearMessages', () => {
    it('should clear messages from AsyncStorage', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await chatStorageService.clearMessages();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('chat_history');
    });

    it('should handle clear errors gracefully', async () => {
      mockAsyncStorage.removeItem.mockRejectedValue(new Error('Storage error'));

      await expect(chatStorageService.clearMessages()).rejects.toThrow('Failed to clear chat history');
    });
  });

  describe('getMessageCount', () => {
    it('should return correct message count', async () => {
      const mockMessages: ChatMessage[] = [
        createMockMessage('1', 'Hello', 'user'),
        createMockMessage('2', 'Hi there!', 'ai'),
        createMockMessage('3', 'How are you?', 'user'),
      ];

      const mockStoredData = {
        messages: mockMessages,
        lastUpdated: new Date(),
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockStoredData));

      const count = await chatStorageService.getMessageCount();

      expect(count).toBe(3);
    });

    it('should return 0 when no messages exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const count = await chatStorageService.getMessageCount();

      expect(count).toBe(0);
    });

    it('should handle errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const count = await chatStorageService.getMessageCount();

      expect(count).toBe(0);
    });
  });

  describe('getLastMessageTime', () => {
    it('should return last message timestamp', async () => {
      const lastMessageTime = new Date('2023-01-01T15:30:00Z');
      const mockMessages: ChatMessage[] = [
        createMockMessage('1', 'Hello', 'user'),
        { ...createMockMessage('2', 'Latest message', 'ai'), timestamp: lastMessageTime },
      ];

      const mockStoredData = {
        messages: mockMessages,
        lastUpdated: new Date(),
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockStoredData));

      const result = await chatStorageService.getLastMessageTime();

      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe(lastMessageTime.toISOString());
    });

    it('should return null when no messages exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await chatStorageService.getLastMessageTime();

      expect(result).toBeNull();
    });

    it('should return null when messages array is empty', async () => {
      const mockStoredData = {
        messages: [],
        lastUpdated: new Date(),
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockStoredData));

      const result = await chatStorageService.getLastMessageTime();

      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await chatStorageService.getLastMessageTime();

      expect(result).toBeNull();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete save and load cycle', async () => {
      const originalMessages: ChatMessage[] = [
        createMockMessage('1', 'Hello', 'user'),
        createMockMessage('2', 'Hi there!', 'ai'),
      ];

      // Mock save
      mockAsyncStorage.setItem.mockResolvedValue();
      await chatStorageService.saveMessages(originalMessages);

      // Mock load with the saved data
      const savedCall = mockAsyncStorage.setItem.mock.calls[0];
      mockAsyncStorage.getItem.mockResolvedValue(savedCall[1]);

      const loadedMessages = await chatStorageService.loadMessages();

      expect(loadedMessages).toHaveLength(2);
      expect(loadedMessages[0].content).toBe('Hello');
      expect(loadedMessages[1].content).toBe('Hi there!');
    });

    it('should handle save, clear, and load cycle', async () => {
      const messages: ChatMessage[] = [createMockMessage('1', 'Test', 'user')];

      // Save messages
      mockAsyncStorage.setItem.mockResolvedValue();
      await chatStorageService.saveMessages(messages);

      // Clear messages
      mockAsyncStorage.removeItem.mockResolvedValue();
      await chatStorageService.clearMessages();

      // Load after clear (should return empty)
      mockAsyncStorage.getItem.mockResolvedValue(null);
      const loadedMessages = await chatStorageService.loadMessages();

      expect(loadedMessages).toEqual([]);
    });
  });
});
