import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseEventHandler } from './base-event.handler';
import { EventType } from './event.interface';

@Injectable()
export class UnsupportedMediaEventHandler extends BaseEventHandler {
  private readonly mediaTypeMessages = {
    [EventType.PHOTO]: '📷 Photo reçue',
    [EventType.AUDIO]: '🎵 Fichier audio reçu',
    [EventType.DOCUMENT]: '📄 Document reçu',
    [EventType.VIDEO]: '🎥 Vidéo reçue',
    [EventType.VIDEO_NOTE]: '📹 Message vidéo court reçu',
    [EventType.STICKER]: '🎭 Sticker reçu',
    [EventType.ANIMATION]: '🎞️ GIF animé reçu',
    [EventType.CONTACT]: '👤 Contact partagé reçu',
    [EventType.LOCATION]: '📍 Géolocalisation reçue',
    [EventType.VENUE]: '🏢 Lieu reçu',
    [EventType.POLL]: '📊 Sondage reçu',
    [EventType.DICE]: '🎲 Dé lancé'
  };

  // Ce handler peut gérer plusieurs types
  getEventType(): string {
    return 'unsupported_media';
  }

  async handle(ctx: Context, error?: Error): Promise<void> {
    try {
      // Détecter le type de média à partir du contexte
      const mediaType = this.detectMediaType(ctx);
      
      this.logger.log(`Received unsupported media type: ${mediaType} from user: ${ctx.from?.id}`);
      
      await ctx.reply(
        `${this.mediaTypeMessages[mediaType as keyof typeof this.mediaTypeMessages] || 'Contenu reçu'} !\n\n` +
        '❌ Ce type de contenu n\'est pas encore supporté.\n\n' +
        '💬 Pour interagir avec le bot, veuillez utiliser :\n' +
        '• Messages texte 📝\n' +
        '• Messages vocaux 🎙️ (bientôt supportés)\n\n' +
        '⚡ L\'intégration MCP complète arrive bientôt !'
      );
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }

  private detectMediaType(ctx: Context): string {
    const message = ctx.message as any;
    if (!message) return 'unknown';
    
    if (message.photo) return EventType.PHOTO;
    if (message.audio) return EventType.AUDIO;
    if (message.document) return EventType.DOCUMENT;
    if (message.video) return EventType.VIDEO;
    if (message.video_note) return EventType.VIDEO_NOTE;
    if (message.sticker) return EventType.STICKER;
    if (message.animation) return EventType.ANIMATION;
    if (message.contact) return EventType.CONTACT;
    if (message.location) return EventType.LOCATION;
    if (message.venue) return EventType.VENUE;
    if (message.poll) return EventType.POLL;
    if (message.dice) return EventType.DICE;
    
    return 'unknown';
  }
}