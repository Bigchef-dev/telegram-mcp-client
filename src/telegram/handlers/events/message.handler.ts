import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseEventHandler } from './base-event.handler';
import { EventType } from './event.interface';
import { MessageProcessingWorkflow } from '@/mastra/workflows/message-processing.workflow';
import { LLMTelegramService } from '@/telegram/services/llm.telegram.service';

@Injectable()
export class TextEventHandler extends BaseEventHandler {
  constructor(
    private readonly llmTelegramService: LLMTelegramService,
    private readonly messageProcessingWorkflow: MessageProcessingWorkflow,
  ) {
    super();
  }

  getEventType(): string {
    return EventType.TEXT;
  }

  async handle(ctx: Context, error?: Error): Promise<void> {
    try {
      if(!('text' in ctx.message!)) {
        throw new Error('Message text missing');
      }
      const message = (ctx.message)?.text || '';
      const userId = ctx.from?.id?.toString() || '';
      const chatId = ctx.chat?.id?.toString() || '';
      
      if('forward_from' in ctx.message) {
        await this.messageProcessingWorkflow.addMessage(`L'utilisateur a transféré ce message : ${message}`, chatId, userId);
        await ctx.react('❤‍🔥');
      }


      this.logger.log(`Received text message from user ${userId}: ${message}`);
      const result = await this.llmTelegramService.process(ctx, message, userId, chatId);

      this.logger.log(`Mastra processed message: ${result}`);
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}