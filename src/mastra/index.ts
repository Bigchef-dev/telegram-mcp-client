import { Mastra } from '@mastra/core';
import { MistralAgent } from './agents/mistral.agent';

// Configuration principale Mastra
export const mastra = new Mastra({
  // Configuration minimale pour commencer
});

// Services et utilitaires Mastra
export class MastraService {
  private mastra: Mastra;
  private mistralAgent: MistralAgent;

  constructor() {
    this.mastra = mastra;
    this.mistralAgent = new MistralAgent();
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
      // Utiliser l'agent Mistral pour traiter le message
      const mistralResponse = await this.mistralAgent.processUserMessage({
        message: input.message,
        userId: input.userId,
        chatId: input.chatId,
        context: {
          messageType: input.messageType,
          timestamp: new Date().toISOString(),
        },
      });

      return {
        response: `🤖 **Mistral AI Assistant**\n\n${mistralResponse.response}`,
        action: mistralResponse.shouldFollowUp ? 'typing' : 'reply',
        metadata: {
          processedAt: new Date().toISOString(),
          userId: input.userId,
          chatId: input.chatId,
          mastraVersion: '0.17.1',
          platform: 'telegram',
          mistralMetadata: mistralResponse.metadata,
          confidence: mistralResponse.confidence,
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

✨ Mastra est intégré avec agent Mistral !`,
        action: 'reply',
        metadata: {
          processedAt: new Date().toISOString(),
          userId: input.userId,
          chatId: input.chatId,
          mastraVersion: '0.17.1',
          platform: 'telegram',
          error: 'Mistral agent error',
        },
      };
    }
  }

  async getStatus(): Promise<{ status: string; timestamp: string; version: string; agents: string[] }> {
    return {
      status: 'Mastra service is running with Mistral AI',
      timestamp: new Date().toISOString(),
      version: '0.17.1',
      agents: ['MistralAgent'],
    };
  }

  /**
   * Test direct de l'agent Mistral
   */
  async testMistralAgent(message: string): Promise<any> {
    try {
      return await this.mistralAgent.processUserMessage({
        message,
        userId: 'test-user',
        chatId: 'test-chat',
        context: {
          messageType: 'text',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      return {
        error: 'Test failed',
        details: error.message,
      };
    }
  }
}