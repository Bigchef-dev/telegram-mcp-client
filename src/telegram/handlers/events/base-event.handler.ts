import { Injectable, Logger } from '@nestjs/common';
import { Context } from 'telegraf';
import { IEventHandler } from './event.interface';

/**
 * Classe de base abstraite pour tous les handlers d'événements
 */
@Injectable()
export abstract class BaseEventHandler implements IEventHandler {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Type d'événement géré par ce handler
   */
  abstract getEventType(): string;

  /**
   * Gère les erreurs d'événement
   */
  protected async handleError(ctx: Context, error: Error): Promise<void> {
    this.logger.error(`Error in event handler ${this.getEventType()}:`, error);
    ctx.reply('Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer plus tard.');
  }

  /**
   * Méthode abstraite à implémenter pour chaque type d'événement
   */
  abstract handle(ctx: Context, error?: Error): Promise<void>;
}