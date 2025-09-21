import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseEventHandler } from './base-event.handler';
import { EventType } from './event.interface';

@Injectable()
export class ErrorEventHandler extends BaseEventHandler {
  getEventType(): string {
    return EventType.ERROR;
  }

  async handle(ctx: Context, error?: Error): Promise<void> {
    try {
      this.logger.error(`Error for ${ctx.updateType}:`, error);
      
      // Optionnel : notifier l'utilisateur en cas d'erreur
      if (ctx.chat) {
        await ctx.reply('❌ Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
    } catch (handlingError) {
      // Éviter les boucles d'erreur
      this.logger.error('Error while handling error:', handlingError);
    }
  }
}