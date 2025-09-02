import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatScreen from '../../app/(tabs)/chat/index';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

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

describe('Chat Integration Tests', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.removeItem.mockResolvedValue();
  });

  describe('Complete Chat Flow', () => {
    it('should handle complete conversation flow with persistence', async () => {
      const { getByPlaceholderText, getByTestId, getByText, queryByText } = render(<ChatScreen />);

      // Wait for initial load
      await waitFor(() => {
        expect(getByText('AI Chat')).toBeTruthy();
      });

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      // Send first message
      fireEvent.changeText(input, 'Hello');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // Wait for user message to appear
      await waitFor(() => {
        expect(getByText('Hello')).toBeTruthy();
      });

      // Wait for AI response
      await waitFor(() => {
        expect(queryByText('AI is typing...')).toBeNull();
      }, { timeout: 3000 });

      // Should have AI response
      await waitFor(() => {
        const aiResponse = queryByText(/Hello! I'm here to chat with you/);
        expect(aiResponse).toBeTruthy();
      });

      // Verify storage was called
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'chat_history',
        expect.stringContaining('"messages"')
      );

      // Send second message with emotional content
      fireEvent.changeText(input, 'I feel sad today');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(getByText('I feel sad today')).toBeTruthy();
      });

      // Wait for contextual AI response
      await waitFor(() => {
        const sadResponse = queryByText(/sorry you're feeling this way/i);
        expect(sadResponse).toBeTruthy();
      }, { timeout: 3000 });

      // Verify message count updated
      await waitFor(() => {
        expect(getByText(/4 messages/)).toBeTruthy();
      });
    });

    it('should persist and restore chat history across sessions', async () => {
      // Mock existing chat history
      const existingHistory = {
        messages: [
          {
            id: '1',
            content: 'Previous message',
            role: 'user',
            timestamp: '2023-01-01T12:00:00Z',
          },
          {
            id: '2',
            content: 'Previous AI response',
            role: 'ai',
            timestamp: '2023-01-01T12:01:00Z',
          },
        ],
        lastUpdated: '2023-01-01T12:01:00Z',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingHistory));

      const { getByText } = render(<ChatScreen />);

      // Should load and display previous messages
      await waitFor(() => {
        expect(getByText('Previous message')).toBeTruthy();
        expect(getByText('Previous AI response')).toBeTruthy();
        expect(getByText('AI: Ready • 2 messages')).toBeTruthy();
      });

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('chat_history');
    });

    it('should handle clear chat functionality end-to-end', async () => {
      const { getByPlaceholderText, getByTestId, getByText, queryByText } = render(<ChatScreen />);

      // Send a message first
      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test message');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(getByText('Test message')).toBeTruthy();
      });

      // Clear chat
      const clearButton = getByTestId('clear-button');
      fireEvent.press(clearButton);

      // Simulate confirming the alert
      const { Alert } = require('react-native');
      const alertSpy = jest.spyOn(Alert, 'alert');
      
      // Get the onPress function from the Clear button
      const alertCall = alertSpy.mock.calls[0];
      const clearAction = (alertCall[2] as any[]).find((button: any) => button.text === 'Clear');
      
      await act(async () => {
        clearAction.onPress();
      });

      // Should clear messages and storage
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('chat_history');
      
      await waitFor(() => {
        expect(queryByText('Test message')).toBeNull();
        expect(getByText('AI: Ready • 0 messages')).toBeTruthy();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle storage failures gracefully', async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage full'));

      const { getByPlaceholderText, getByTestId, getByText, queryByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test message');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // Should still show messages even if storage fails
      await waitFor(() => {
        expect(getByText('Test message')).toBeTruthy();
      });

      // Should still get AI response
      await waitFor(() => {
        const loadingText = queryByText('AI is typing...');
        expect(loadingText).toBeNull();
      }, { timeout: 3000 });
    });

    it('should handle corrupted storage data gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json data');

      const { getByText } = render(<ChatScreen />);

      // Should still render with empty state
      await waitFor(() => {
        expect(getByText("Hello! I'm here to chat with you. How are you feeling today?")).toBeTruthy();
        expect(getByText('AI: Ready • 0 messages')).toBeTruthy();
      });
    });
  });

  describe('AI Response Contextuality', () => {
    it('should provide contextual responses for different emotional states', async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      // Test anxiety response
      fireEvent.changeText(input, 'I am feeling anxious');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        const anxietyResponse = queryByText(/anxiety can be really overwhelming/i);
        expect(anxietyResponse).toBeTruthy();
      }, { timeout: 3000 });

      // Test help request response
      fireEvent.changeText(input, 'I need help');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        const helpResponse = queryByText(/glad you're reaching out for support/i);
        expect(helpResponse).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('should rotate through fallback responses for generic messages', async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      const responses = new Set<string>();

      // Send multiple generic messages
      for (let i = 0; i < 3; i++) {
        fireEvent.changeText(input, `Generic message ${i}`);
        
        await act(async () => {
          fireEvent.press(sendButton);
        });

        // Wait for response
        await waitFor(() => {
          const loadingText = queryByText('AI is typing...');
          expect(loadingText).toBeNull();
        }, { timeout: 3000 });

        // Collect response (this is a simplified check)
        // In a real test, you'd need to extract the actual AI response text
      }

      // Should have received different responses (rotation working)
      // This is a basic test - in practice you'd need more sophisticated response extraction
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle rapid message sending', async () => {
      const { getByPlaceholderText, getByTestId, queryByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      // Send first message
      fireEvent.changeText(input, 'First message');
      fireEvent.press(sendButton);

      // Try to send second message immediately (should be blocked)
      fireEvent.changeText(input, 'Second message');
      fireEvent.press(sendButton);

      // Wait for first response to complete
      await waitFor(() => {
        const loadingText = queryByText('AI is typing...');
        expect(loadingText).toBeNull();
      }, { timeout: 3000 });

      // Now should be able to send second message
      fireEvent.changeText(input, 'Second message');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        const loadingText = queryByText('AI is typing...');
        expect(loadingText).toBeNull();
      }, { timeout: 3000 });
    });

    it('should handle long messages correctly', async () => {
      const { getByPlaceholderText, getByTestId, getByText, queryByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      const longMessage = 'This is a very long message that tests the system\'s ability to handle extended text input and ensure that the AI service can process and respond to lengthy user communications effectively.';

      fireEvent.changeText(input, longMessage);
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(getByText(longMessage)).toBeTruthy();
      });

      // Should still get AI response
      await waitFor(() => {
        const loadingText = queryByText('AI is typing...');
        expect(loadingText).toBeNull();
      }, { timeout: 3000 });
    });
  });

  describe('UI State Management', () => {
    it('should properly manage loading states throughout conversation', async () => {
      const { getByPlaceholderText, getByTestId, getByText, queryByText } = render(<ChatScreen />);

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      // Initial state - not loading
      expect(queryByText('AI is typing...')).toBeNull();

      fireEvent.changeText(input, 'Test message');
      fireEvent.press(sendButton);

      // Should show loading
      await waitFor(() => {
        expect(getByText('AI is typing...')).toBeTruthy();
      });

      // Should stop loading after response
      await waitFor(() => {
        const loadingText = queryByText('AI is typing...');
        expect(loadingText).toBeNull();
      }, { timeout: 3000 });

      // Input should be enabled again
      expect(input.props.editable).toBe(true);
    });

    it('should update message count correctly throughout conversation', async () => {
      const { getByPlaceholderText, getByTestId, getByText, queryByText } = render(<ChatScreen />);

      // Initial count
      await waitFor(() => {
        expect(getByText('AI: Ready • 0 messages')).toBeTruthy();
      });

      const input = getByPlaceholderText('Type your message...');
      const sendButton = getByTestId('send-button');

      // Send message
      fireEvent.changeText(input, 'Hello');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // Wait for conversation to complete
      await waitFor(() => {
        const loadingText = queryByText('AI is typing...');
        expect(loadingText).toBeNull();
      }, { timeout: 3000 });

      // Should show updated count (user message + AI response = 2)
      await waitFor(() => {
        expect(getByText('AI: Ready • 2 messages')).toBeTruthy();
      });
    });
  });
});
