import { Injectable, Inject } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseEventHandler } from './base-event.handler';
import { EventType } from './event.interface';
import { MastraService } from '../../../mastra';

@Injectable()
export class TextEventHandler extends BaseEventHandler {
  constructor(
    @Inject('MASTRA_SERVICE')
    private readonly mastraService: MastraService,
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
      
      // Traitement du message avec Mastra
      const result = await this.mastraService.processMessage({
        message,
        userId,
        chatId,
        messageType: 'text',
      });

      this.logger.log(`Mastra processed message: ${JSON.stringify(result.metadata)}`);
      
      // Envoi de la réponse
      await ctx.reply(result.response);
      
      // Action supplémentaire si nécessaire
      if (result.action === 'typing') {
        await ctx.sendChatAction('typing');
      }
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}