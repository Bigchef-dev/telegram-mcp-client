import { Agent, GenerateTextResult, MastraMessageV2 } from '@mastra/core';
import { mistral } from '@ai-sdk/mistral';
import { z } from 'zod';
import { UserMemoryService } from '../../memory/user-memory.service';
import { POLL_PROMPT } from './poll.prompt';
import { MCPTelegramClient } from '../mcp.client';
import { Memory } from '@mastra/memory';
import { Injectable } from '@nestjs/common';
import { generateId } from 'ai';

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

  async addContextToMemory(chatId: string, message: string, userId?: string) {
    // Add new message
    
    const messageToSave : MastraMessageV2 = {
            id: generateId(),
            type: 'text',
            role: 'assistant', // PATCH: On peux que mettre assistant ⚠️ Peut causer des soucis (https://www.answeroverflow.com/m/1429847467607986188). Faire un autre stockage pour solution optimale
            createdAt: new Date(),
            content: {
              format: 2,
              parts: [{text: message, type: 'text'}],
            },
            threadId: chatId,
            resourceId: userId,
          }

    const memory = await this.agent.getMemory()
    // Add message to stack of the thread


    await memory.saveMessages({
      messages: [messageToSave],
      format: "v2" // Cela indique à Mastra comment traiter le tableau
        });
    }

  /**
   * Traite un message utilisateur avec l'agent Poll et mémoire isolée
   */
  async processUserMessage(input: z.infer<typeof this.inputSchema>) : ReturnType<typeof this.agent.generateVNext> {  
    const { message, userId, chatId } = input;
    
    try {

      const result = await this.agent.generateVNext(
      [
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
      console.log(error);
      await this.memory.deleteThread(chatId);
      throw error;
    }
  }
}