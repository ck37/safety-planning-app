import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ChatScreen from '../../app/(tabs)/chat/index';
import { chatAIService } from '../../services/ChatAIService';
import { chatStorageService } from '../../services/ChatStorageService';

// Mock the services
jest.mock('../../services/ChatAIService');
jest.mock('../../services/ChatStorageService');

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Send: () => 'Send',
  Trash2: () => 'Trash2',
  Bot: () => 'Bot',
  User: () => 'User',
}));

describe('ChatScreen', () => {
  const mockChatAIService = chatAIService as jest.Mocked<typeof chatAIService>;
  const mockChatStorageService = chatStorageService as jest.Mocked<typeof chatStorageService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockChatStorageService.loadMessages.mockResolvedValue([]);
    mockChatStorageService.getMessageCount.mockResolvedValue(0);
    mockChatStorageService.saveMessages.mockResolvedValue();
    mockChatStorageService.clearMessages.mockResolvedValue();
    
    mockChatAIService.generateResponse.mockResolvedValue({
      content: 'Test AI response',
      success: true,
    });
    mockChatAIService.getStatus.mockReturnValue({
      ready: true,
      model: 'Fallback Responses',
    });
    mockChatAIService.clearContext.mockImplementation(() => {});
  });

  describe('Initial Render', () => {
    it('should render chat screen with empty state', async () => {
      const { getByText, getByPlaceholderText } = render(<ChatScreen />);

      await waitFor(() => {
        expect(getByText('AI Chat')).toBeTruthy();
        expect(getByText("Hello! I'm here to chat with you. How are you feeling today?")).toBeTruthy();
        expect(getByPlaceholderText('Type your message...')).toBeTruthy();
        expect(getByText('AI: Ready • 0 messages')).toBeTruthy();
      });
    });

    it('should load existing chat history on mount', async () => {
      const mockMessages = [
        {
          id: '1',
          content: 'Hello',
          role: 'user' as const,
          timestamp: new Date('2023-01-01T12:00:00Z'),
        },
        {
          id: '2',
          content: 'Hi there!',
          role: 'ai' as const,
          timestamp: new Date('2023-01-01T12:01:00Z'),
        },
      ];

      mockChatStorageService.loadMessages.mockResolvedValue(mockMessages);
      mockChatStorageService.getMessageCount.mockResolvedValue(2);

      const { getByText } = render(<ChatScreen />);

      await waitFor(() => {
        expect(getByText('Hello')).toBeTruthy();
        expect(getByText('Hi there!')).toBeTruthy();
        expect(getByText('AI: Ready • 2 messages')).toBeTruthy();
      });
    });
  });

  describe('Message Sending', () => {
    it('should send a message and receive AI response', async () => {
      const { getByPlaceholderText, getByTestId, getByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button') || getByText('Send');

      // Type a message
      fireEvent.changeText(input, 'Hello AI');
      
      // Send the message
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(getByText('Hello AI')).toBeTruthy();
        expect(getByText('Test AI response')).toBeTruthy();
      });

      expect(mockChatAIService.generateResponse).toHaveBeenCalledWith('Hello AI');
      expect(mockChatStorageService.saveMessages).toHaveBeenCalled();
    });

    it('should not send empty messages', async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button') || queryByText('Send');

      // Try to send empty message
      fireEvent.changeText(input, '');
      if (sendButton) {
        fireEvent.press(sendButton);
      }

      expect(mockChatAIService.generateResponse).not.toHaveBeenCalled();
    });

    it('should not send messages while loading', async () => {
      const { getByPlaceholderText, getByTestId } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      // Start first message
      fireEvent.changeText(input, 'First message');
      fireEvent.press(sendButton);

      // Try to send second message while first is processing
      fireEvent.changeText(input, 'Second message');
      fireEvent.press(sendButton);

      // Should only be called once
      expect(mockChatAIService.generateResponse).toHaveBeenCalledTimes(1);
    });

    it('should clear input after sending message', async () => {
      const { getByPlaceholderText, getByTestId } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test message');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      expect(input.props.value).toBe('');
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator while AI is responding', async () => {
      // Make AI service take longer to respond
      mockChatAIService.generateResponse.mockImplementation(
        () => new Promise(resolve => 
          setTimeout(() => resolve({ content: 'Response', success: true }), 100)
        )
      );

      const { getByPlaceholderText, getByTestId, getByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test message');
      fireEvent.press(sendButton);

      // Should show loading state
      await waitFor(() => {
        expect(getByText('AI is typing...')).toBeTruthy();
      });
    });

    it('should disable input while loading', async () => {
      mockChatAIService.generateResponse.mockImplementation(
        () => new Promise(resolve => 
          setTimeout(() => resolve({ content: 'Response', success: true }), 100)
        )
      );

      const { getByPlaceholderText, getByTestId } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test message');
      fireEvent.press(sendButton);

      // Input should be disabled
      expect(input.props.editable).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should display error when AI service fails', async () => {
      mockChatAIService.generateResponse.mockResolvedValue({
        content: 'Error response',
        success: false,
        error: 'AI service error',
      });

      const { getByPlaceholderText, getByTestId, getByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test message');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(getByText('AI service error')).toBeTruthy();
      });
    });

    it('should handle storage errors gracefully', async () => {
      mockChatStorageService.saveMessages.mockRejectedValue(new Error('Storage error'));

      const { getByPlaceholderText, getByTestId } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test message');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // Should still show the messages even if storage fails
      await waitFor(() => {
        expect(mockChatAIService.generateResponse).toHaveBeenCalled();
      });
    });
  });

  describe('Clear Chat Functionality', () => {
    it('should show confirmation dialog when clearing chat', async () => {
      const { getByTestId } = render(<ChatScreen />);

      const clearButton = getByTestId('clear-button');
      fireEvent.press(clearButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Clear Chat',
        'Are you sure you want to clear all messages? This action cannot be undone.',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Clear' }),
        ])
      );
    });

    it('should clear messages when confirmed', async () => {
      const { getByTestId } = render(<ChatScreen />);

      const clearButton = getByTestId('clear-button');
      fireEvent.press(clearButton);

      // Simulate user confirming the alert
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const confirmButton = alertCall[2].find((button: any) => button.text === 'Clear');
      
      await act(async () => {
        confirmButton.onPress();
      });

      expect(mockChatStorageService.clearMessages).toHaveBeenCalled();
      expect(mockChatAIService.clearContext).toHaveBeenCalled();
    });
  });

  describe('Message Display', () => {
    it('should display messages with correct styling for user and AI', async () => {
      const mockMessages = [
        {
          id: '1',
          content: 'User message',
          role: 'user' as const,
          timestamp: new Date('2023-01-01T12:00:00Z'),
        },
        {
          id: '2',
          content: 'AI message',
          role: 'ai' as const,
          timestamp: new Date('2023-01-01T12:01:00Z'),
        },
      ];

      mockChatStorageService.loadMessages.mockResolvedValue(mockMessages);

      const { getByText } = render(<ChatScreen />);

      await waitFor(() => {
        expect(getByText('User message')).toBeTruthy();
        expect(getByText('AI message')).toBeTruthy();
        expect(getByText('You')).toBeTruthy();
        expect(getByText('AI')).toBeTruthy();
      });
    });

    it('should format timestamps correctly', async () => {
      const mockMessages = [
        {
          id: '1',
          content: 'Test message',
          role: 'user' as const,
          timestamp: new Date('2023-01-01T12:30:00Z'),
        },
      ];

      mockChatStorageService.loadMessages.mockResolvedValue(mockMessages);

      const { getByText } = render(<ChatScreen />);

      await waitFor(() => {
        // Should show formatted time (format may vary by locale)
        expect(getByText(/\d{1,2}:\d{2}/)).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', async () => {
      const { getByPlaceholderText, getByText } = render(<ChatScreen />);

      expect(getByPlaceholderText('Type your message...')).toBeTruthy();
      expect(getByText('AI Chat')).toBeTruthy();
    });
  });

  describe('Status Display', () => {
    it('should show AI status and message count', async () => {
      mockChatStorageService.getMessageCount.mockResolvedValue(5);

      const { getByText } = render(<ChatScreen />);

      await waitFor(() => {
        expect(getByText('AI: Ready • 5 messages')).toBeTruthy();
      });
    });

    it('should update message count after sending messages', async () => {
      const { getByPlaceholderText, getByTestId, getByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test message');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        // Should show updated count (2 messages: user + AI response)
        expect(getByText(/2 messages/)).toBeTruthy();
      });
    });
  });
});
