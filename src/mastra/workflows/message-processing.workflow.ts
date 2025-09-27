// Workflows Mastra
// TODO: Implémenter les workflows pour le traitement des messages

import { Injectable } from "@nestjs/common";
import { PollAgent } from "../agents";

@Injectable()
export class MessageProcessingWorkflow {
  name = 'message-processing';
  description = 'Workflow pour traiter les messages Telegram avec Mastra';


  constructor(private readonly pollAgent: PollAgent) {}
  async execute(input: {
    message: string;
    userId: string;
    chatId: string;
  }) {
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