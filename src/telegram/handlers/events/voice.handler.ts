import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseEventHandler } from './base-event.handler';
import { EventType } from './event.interface';

@Injectable()
export class VoiceEventHandler extends BaseEventHandler {
  getEventType(): string {
    return EventType.VOICE;
  }

  async handle(ctx: Context, error?: Error): Promise<void> {
    try {
      this.logger.log(`Received voice message from user: ${ctx.from?.id}`);
      
      await ctx.reply(
        '🎙️ Message vocal reçu !\n\n' +
        '📝 Pour l\'instant, je ne peux traiter que les messages texte pour les conversations MCP.\n' +
        '💬 Veuillez renvoyer votre message sous forme de texte.'
      );
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}