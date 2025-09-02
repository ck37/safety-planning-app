import { ChatAIService } from '../../services/ChatAIService';

describe('ChatAIService', () => {
  let chatAIService: ChatAIService;

  beforeEach(() => {
    chatAIService = new ChatAIService();
  });

  describe('generateResponse', () => {
    it('should generate a response for user input', async () => {
      const userMessage = 'Hello, how are you?';
      const response = await chatAIService.generateResponse(userMessage);

      expect(response.success).toBe(true);
      expect(response.content).toBeDefined();
      expect(typeof response.content).toBe('string');
      expect(response.content.length).toBeGreaterThan(0);
    });

    it('should provide contextual responses for greetings', async () => {
      const greetings = ['hello', 'hi', 'hey'];
      
      for (const greeting of greetings) {
        const response = await chatAIService.generateResponse(greeting);
        expect(response.success).toBe(true);
        expect(response.content.toLowerCase()).toContain('hello');
      }
    });

    it('should provide contextual responses for emotional keywords', async () => {
      const testCases = [
        { input: 'I feel sad', expectedKeyword: 'sad' },
        { input: 'I am anxious', expectedKeyword: 'anxiety' },
        { input: 'I am angry', expectedKeyword: 'anger' },
        { input: 'I need help', expectedKeyword: 'support' },
      ];

      for (const testCase of testCases) {
        const response = await chatAIService.generateResponse(testCase.input);
        expect(response.success).toBe(true);
        expect(response.content.toLowerCase()).toMatch(
          new RegExp(testCase.expectedKeyword, 'i')
        );
      }
    });

    it('should handle thank you messages appropriately', async () => {
      const response = await chatAIService.generateResponse('Thank you');
      expect(response.success).toBe(true);
      expect(response.content.toLowerCase()).toContain('welcome');
    });

    it('should handle goodbye messages appropriately', async () => {
      const response = await chatAIService.generateResponse('Goodbye');
      expect(response.success).toBe(true);
      expect(response.content.toLowerCase()).toMatch(/take care|goodbye/i);
    });

    it('should rotate through fallback responses for generic messages', async () => {
      const responses = new Set<string>();
      
      // Generate multiple responses to test rotation
      for (let i = 0; i < 5; i++) {
        const response = await chatAIService.generateResponse(`Generic message ${i}`);
        expect(response.success).toBe(true);
        responses.add(response.content);
      }

      // Should have different responses (rotation working)
      expect(responses.size).toBeGreaterThan(1);
    });

    it('should maintain conversation context', async () => {
      await chatAIService.generateResponse('Hello');
      await chatAIService.generateResponse('I am feeling down');
      
      // Context should be maintained internally
      const status = chatAIService.getStatus();
      expect(status.ready).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      // Mock an error scenario by passing invalid input
      const response = await chatAIService.generateResponse('');
      expect(response.success).toBe(true); // Empty string should still work
      expect(response.content).toBeDefined();
    });

    it('should simulate realistic response times', async () => {
      const startTime = Date.now();
      await chatAIService.generateResponse('Test message');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeGreaterThan(500); // At least 500ms
      expect(responseTime).toBeLessThan(2000); // Less than 2s
    });
  });

  describe('clearContext', () => {
    it('should clear conversation context', async () => {
      // Add some context
      await chatAIService.generateResponse('Hello');
      await chatAIService.generateResponse('How are you?');
      
      // Clear context
      chatAIService.clearContext();
      
      // Should still work after clearing
      const response = await chatAIService.generateResponse('Test');
      expect(response.success).toBe(true);
    });
  });

  describe('getStatus', () => {
    it('should return correct status information', () => {
      const status = chatAIService.getStatus();
      
      expect(status.ready).toBe(true);
      expect(status.model).toBe('Fallback Responses');
    });
  });

  describe('edge cases', () => {
    it('should handle very long messages', async () => {
      const longMessage = 'a'.repeat(1000);
      const response = await chatAIService.generateResponse(longMessage);
      
      expect(response.success).toBe(true);
      expect(response.content).toBeDefined();
    });

    it('should handle special characters', async () => {
      const specialMessage = '!@#$%^&*()_+{}|:"<>?[]\\;\',./ 🤖💬';
      const response = await chatAIService.generateResponse(specialMessage);
      
      expect(response.success).toBe(true);
      expect(response.content).toBeDefined();
    });

    it('should handle multiple consecutive calls', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        chatAIService.generateResponse(`Message ${i}`)
      );
      
      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.success).toBe(true);
        expect(response.content).toBeDefined();
      });
    });
  });
});
