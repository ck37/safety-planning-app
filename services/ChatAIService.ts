import { ChatAIResponse } from '../types/Chat';

export class ChatAIService {
  private fallbackResponses: string[] = [
    "I'm here to listen. What's on your mind today?",
    "That sounds important to you. Can you tell me more about how you're feeling?",
    "I understand. It's okay to take things one step at a time.",
    "Thank you for sharing that with me. How are you coping with everything?",
    "It sounds like you're going through a lot. Remember that it's okay to ask for help.",
    "I hear you. Sometimes talking through our thoughts can be really helpful.",
    "That must be difficult for you. What usually helps you feel better?",
    "I'm glad you're reaching out. How can I best support you right now?",
    "It's important to acknowledge your feelings. What would make today a little easier?",
    "I appreciate you opening up. Remember that you're not alone in this.",
    "That's a lot to process. Have you been able to use any of your coping strategies?",
    "I can sense this is weighing on you. What brings you comfort during tough times?",
    "Thank you for trusting me with this. How are you taking care of yourself today?",
    "It's brave of you to share these feelings. What support do you have around you?",
    "I'm here with you. Sometimes just talking can help us see things more clearly."
  ];

  private conversationContext: string[] = [];
  private responseIndex: number = 0;

  async generateResponse(userMessage: string): Promise<ChatAIResponse> {
    try {
      // Add user message to context for more relevant responses
      this.conversationContext.push(userMessage.toLowerCase());
      
      // Keep context manageable (last 5 messages)
      if (this.conversationContext.length > 5) {
        this.conversationContext.shift();
      }

      // Simulate AI processing delay (reduced for faster tests)
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

      const response = this.selectContextualResponse(userMessage);

      return {
        content: response,
        success: true
      };
    } catch (error) {
      return {
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private selectContextualResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses based on keywords
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to chat with you. How are you feeling today?";
    }
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
      return "I'm sorry you're feeling this way. It's okay to feel sad sometimes. What usually helps you when you're feeling down?";
    }
    
    if (message.includes('anxious') || message.includes('worried') || message.includes('stress')) {
      return "Anxiety can be really overwhelming. Have you tried any breathing exercises or other coping strategies that help you feel more grounded?";
    }
    
    if (message.includes('angry') || message.includes('frustrated') || message.includes('mad')) {
      return "It sounds like you're dealing with some difficult emotions. Anger is a normal feeling. What's been causing these feelings for you?";
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I'm glad you're reaching out for support. That takes courage. What kind of help are you looking for today?";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome. I'm here whenever you need someone to talk to. How else can I support you?";
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return "Take care of yourself. Remember, I'm always here if you need to talk. You're doing great by reaching out.";
    }
    
    // Default to rotating through fallback responses
    const response = this.fallbackResponses[this.responseIndex];
    this.responseIndex = (this.responseIndex + 1) % this.fallbackResponses.length;
    
    return response;
  }

  clearContext(): void {
    this.conversationContext = [];
    this.responseIndex = 0;
  }

  getStatus(): { ready: boolean; model: string } {
    return {
      ready: true,
      model: 'Fallback Responses'
    };
  }
}

export const chatAIService = new ChatAIService();
