import { Agent } from '@mastra/core';
import { mistral } from '@ai-sdk/mistral';
import { z } from 'zod';
import { UserMemoryService } from '../../memory/user-memory.service';
import { POLL_PROMPT } from './poll.prompt';
import { Injectable } from '@nestjs/common';
import { MCPTelegramClient } from '../mcp.client';
import { Memory } from '@mastra/memory';

/**
 * Poll Agent avec mémoire isolée par utilisateur
 */
@Injectable()
export class PollAgent  {
  private static MODEL_NAME = 'mistral-small-latest';
  private agent: Agent;
  private memory: Memory;

  constructor(private userMemoryService: UserMemoryService, private mcpClient: MCPTelegramClient) {
    this.createAgent();
  }

  async createAgent() {
    this.memory = this.userMemoryService.getMemory('poll-telegram-assistant');
    this.agent = new Agent({
      name: 'poll-telegram-assistant',
      description: 'Assistant Telegram pour sondages et enquêtes avec mémoire isolée par utilisateur',
      instructions: POLL_PROMPT,
      memory: this.memory,
      model: mistral(PollAgent.MODEL_NAME),
      tools: await this.mcpClient.getTools(),
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
  async processUserMessage(input: z.infer<typeof this.inputSchema>) : Promise<any> {  
    const { message, userId, chatId } = input;
    
    try {
      
    const result = await this.agent.generateVNext(
      [
        { role: 'system', content: `chat_id: ${chatId}` },
        { role: 'user', content: message }
      ],
      {
        // Configuration de la mémoire pour cette conversation
        memory: {
          thread: `${chatId}`, // ID unique du thread de conversation
          resource: userId, // Ressource utilisateur pour la mémoire de travail
        },
        maxSteps: 5, // Limite les interactions outils pour éviter les séquences complexes
      }
    );
    return result;
    } catch (error) {
      await this.memory.deleteThread(chatId);
      throw error;
    }
  }
}