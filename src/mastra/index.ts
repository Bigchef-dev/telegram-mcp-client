import { Mastra } from '@mastra/core';
import { PollAgent } from './agents/poll.agent';
import { UserMemoryService } from '../memory/user-memory.service';

// Configuration principale Mastra
export const mastra = new Mastra({
  // Configuration minimale pour commencer
});

// Services et utilitaires Mastra
export class MastraService {
    private pollAgentWithMemory: PollAgent;
  private userMemoryService: UserMemoryService;

  constructor() {
    this.userMemoryService = new UserMemoryService();
    this.pollAgentWithMemory = new PollAgent(this.userMemoryService);
  }

  async processMessage(input: {
    message: string;
    userId: string;
    chatId: string;
    messageType: 'text' | 'command' | 'voice' | 'photo';
  }): Promise<{
    response: string;
    action?: 'reply' | 'typing' | 'forward';
    metadata?: Record<string, any>;
  }> {
    try {
      // Utiliser l'agent Mistral avec mémoire isolée pour traiter le message
      const mistralResponse = await this.pollAgentWithMemory.processUserMessage({
        message: input.message,
        userId: input.userId,
        chatId: input.chatId,
        context: {
          messageType: input.messageType,
          timestamp: new Date().toISOString(),
        },
      });

      return {
        response: mistralResponse.response,
        metadata: {
          processedAt: new Date().toISOString(),
          userId: input.userId,
          chatId: input.chatId
        },
      };
    } catch (error) {
      console.error('Erreur lors du traitement avec Mistral:', error);
      
      // Fallback vers la réponse simple en cas d'erreur
      return {
        response: `🤖 **Message traité par Mastra (Fallback)**

📝 **Message original:** ${input.message}
👤 **Utilisateur:** ${input.userId}
💬 **Chat:** ${input.chatId}
🔍 **Type:** ${input.messageType}

⚠️ L'agent Mistral a rencontré un problème, réponse de fallback activée.

✨ Mastra est intégré avec agent Mistral et mémoire persistante !`,
        action: 'reply',
        metadata: {
          processedAt: new Date().toISOString(),
          userId: input.userId,
          chatId: input.chatId,
          mastraVersion: '0.17.1',
          platform: 'telegram',
          error: 'Mistral agent error',
          memoryEnabled: true,
        },
      };
    }
  }

  /**
   * Test de l'agent Mistral avec mémoire isolée
   */
  async testMistralAgentWithMemory(message: string, userId: string = 'test-user'): Promise<any> {
    try {
      return await this.pollAgentWithMemory.processUserMessage({
        message,
        userId,
        chatId: 'test-chat',
        context: {
          messageType: 'text',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      return {
        error: 'Memory test failed',
        details: error.message,
      };
    }
  }
}