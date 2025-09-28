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
  // Messages texte et vocaux (acceptés pour conversation)
  TEXT = 'text',
  VOICE = 'voice',
  
  // Messages multimédia (non supportés pour conversation)
  PHOTO = 'photo',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  VIDEO = 'video',
  VIDEO_NOTE = 'video_note',
  STICKER = 'sticker',
  ANIMATION = 'animation',
  CONTACT = 'contact',
  LOCATION = 'location',
  VENUE = 'venue',
  POLL = 'poll',
  DICE = 'dice',
  
  // Événements système
  ERROR = 'error'
}

/**
 * Types de messages acceptés pour la conversation MCP
 */
export const CONVERSATION_TYPES = [EventType.TEXT, EventType.VOICE, EventType.POLL] as const;

/**
 * Types de messages non supportés pour la conversation
 */
export const UNSUPPORTED_MEDIA_TYPES = [
  EventType.PHOTO,
  EventType.AUDIO,
  EventType.DOCUMENT,
  EventType.VIDEO,
  EventType.VIDEO_NOTE,
  EventType.STICKER,
  EventType.ANIMATION,
  EventType.CONTACT,
  EventType.LOCATION,
  EventType.VENUE,
  EventType.DICE
] as const;