// Workflows Mastra
// TODO: Implémenter les workflows pour le traitement des messages

import { Injectable } from "@nestjs/common";
import { PollAgent } from "../agents";

@Injectable()
export class MessageProcessingWorkflow {
  name = 'message-processing';
  description = 'Workflow pour traiter les messages Telegram avec Mastra';

  constructor(private readonly pollAgent: PollAgent) {}

  async addMessage(message: string, chatId: string, userId: string) {
    await this.pollAgent.addContextToMemory(chatId, message, userId);
  }

  async execute(input: {
    message: string;
    userId: string;
    chatId: string;
  }) : ReturnType<typeof this.pollAgent.processUserMessage> {
    return this.pollAgent.processUserMessage({
      message: input.message,
      userId: input.userId,
      chatId: input.chatId,
      context: {
        messageType: 'text',
        timestamp: new Date().toISOString(),
      }
    }); 
  }
}