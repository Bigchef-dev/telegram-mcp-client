import { Context } from 'telegraf';

/**
 * Interface pour les handlers d'événements Telegram
 */
export interface IEventHandler {
  /**
   * Type d'événement géré
   */
  getEventType(): string;

  /**
   * Gère l'événement
   * @param ctx Context Telegraf
   * @param error Erreur optionnelle pour les handlers d'erreur
   */
  handle(ctx: Context, error?: Error): Promise<void>;
}

/**
 * Types d'événements supportés
 */
export enum EventType {
  TEXT = 'text',
  PHOTO = 'photo',
  DOCUMENT = 'document',
  CALLBACK_QUERY = 'callback_query',
  ERROR = 'error'
}