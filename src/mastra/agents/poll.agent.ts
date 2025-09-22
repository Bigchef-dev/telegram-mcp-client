import { Agent } from '@mastra/core';
import { mistral } from '@ai-sdk/mistral';
import { z } from 'zod';
import { UserMemoryService } from '../../memory/user-memory.service';
import { POLL_PROMPT } from './poll.prompt';

/**
 * Poll Agent avec mémoire isolée par utilisateur
 */
export class PollAgent extends Agent {
  private static MODEL_NAME = 'mistral-small-latest';

  constructor(private userMemoryService: UserMemoryService) {
    super({
      name: 'poll-telegram-assistant',
      description: 'Assistant Telegram pour sondages et enquêtes avec mémoire isolée par utilisateur',
      instructions:  POLL_PROMPT,

      model: mistral(PollAgent.MODEL_NAME),
      tools: {},
    });
  }

  // Schéma pour les entrées de l'agent
  inputSchema = z.object({
    message: z.string().describe('Le message de l\'utilisateur Telegram'),
    userId: z.string().describe('L\'ID de l\'utilisateur Telegram'),
    chatId: z.string().describe('L\'ID du chat Telegram'),
    context: z.object({
      messageType: z.enum(['text', 'command', 'voice', 'photo']).describe('Le type de message'),
      userName: z.string().optional().describe('Le nom d\'utilisateur'),
      timestamp: z.string().describe('Timestamp du message'),
    }).describe('Contexte du message'),
  });

  // Schéma pour les sorties de l'agent
  outputSchema = z.object({
    response: z.string().describe('La réponse générée par l\'agent'),
    confidence: z.number().min(0).max(1).describe('Niveau de confiance de la réponse'),
    metadata: z.object({
      model: z.string().describe('Modèle utilisé'),
      tokensUsed: z.number().optional().describe('Nombre de tokens utilisés'),
      processingTime: z.number().describe('Temps de traitement en ms'),
      memoryUsed: z.boolean().describe('Si la mémoire utilisateur a été utilisée'),
    }),
  });

  /**
   * Traite un message utilisateur avec l'agent Poll et mémoire isolée
   */
  async processUserMessage(input: z.infer<typeof this.inputSchema>): Promise<z.infer<typeof this.outputSchema>> {
    const startTime = Date.now();

    try {
      // Récupérer la mémoire dédiée à cet utilisateur
      const userMemory = this.userMemoryService.getMemoryForUser(input.userId);

      // Créer un agent temporaire avec la mémoire de l'utilisateur
      const userAgent = new Agent({
        name: 'poll-user-agent',
        description: 'Assistant Telegram pour faire des sondages',
        instructions: this.instructions,
        model: mistral(PollAgent.MODEL_NAME),
        memory: userMemory,
        tools: {},
      });

      // Utilise l'agent temporaire avec la mémoire de l'utilisateur
      const result = await userAgent.generateVNext(
        input.message,
        {
          // Configuration de la mémoire pour cette conversation
          memory: {
            thread: `${input.userId}-${input.chatId}`, // ID unique du thread de conversation
            resource: input.userId, // Ressource utilisateur pour la mémoire de travail
          }
        }
      );
      
      const processingTime = Date.now() - startTime;
         
      return {
        response: result.text || 'Désolé, je n\'ai pas pu générer de réponse.',
        confidence: 0.85,
        metadata: {
          model: PollAgent.MODEL_NAME,
          tokensUsed: result.usage?.totalTokens,
          processingTime,
          memoryUsed: true,
        },
      };
    } catch (error) {
      console.error('Erreur lors du traitement avec Poll Agent et mémoire:', error);
      
      return {
        response: 'Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre question ?',
        confidence: 0,
        metadata: {
          model: PollAgent.MODEL_NAME,
          processingTime: Date.now() - startTime,
          memoryUsed: false,
        },
      };
    }
  }

  /**
   * Efface la mémoire d'un utilisateur
   */
  async clearUserMemory(userId: string): Promise<boolean> {
    return await this.userMemoryService.clearUserMemory(userId);
  }

  /**
   * Récupère les statistiques de mémoire d'un utilisateur
   */
  getUserMemoryStats(userId: string) {
    return this.userMemoryService.getUserMemoryStats(userId);
  }
}