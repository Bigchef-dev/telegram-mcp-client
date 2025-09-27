import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseEventHandler } from './base-event.handler';
import { EventType } from './event.interface';
import { MessageProcessingWorkflow } from '@/mastra/workflows/message-processing.workflow';

@Injectable()
export class TextEventHandler extends BaseEventHandler {
  constructor(
    private readonly messageProcessingWorkflow: MessageProcessingWorkflow,
  ) {
    super();
  }

  getEventType(): string {
    return EventType.TEXT;
  }

  async handle(ctx: Context, error?: Error): Promise<void> {
    try {
      const message = (ctx.message as any)?.text || '';
      const userId = ctx.from?.id?.toString() || '';
      const chatId = ctx.chat?.id?.toString() || '';

      this.logger.log(`Received text message from user ${userId}: ${message}`);

      const result = await this.messageProcessingWorkflow.execute({
        message,
        userId,
        chatId,
      });

      this.logger.log(`Mastra processed message: ${result}`);
      
      // Envoi de la réponse
      await ctx.reply(result.text, { parse_mode: 'Markdown' });
      
      // Action supplémentaire si nécessaire
      if (result.action === 'typing') {
        await ctx.sendChatAction('typing');
      }
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}