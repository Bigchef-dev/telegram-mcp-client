import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

@Injectable()
export class TelegramReplyService {
  /**
   * Transforme le formatage Markdown (** vers *, puis * vers _)
   */
  private transformMarkdown(text: string): string {
    // D'abord transformer ** en *
    let transformedText = text.replace(/\*\*/g, '*');
    
    // Ensuite transformer les * restantes en _
    transformedText = transformedText.replace(/\*/g, '_');
    
    return transformedText;
  }

  /**
   * Fonction globale pour envoyer une réponse formatée après traitement par l'IA
   */
  public async sendFormattedReply(ctx: Context, text: string): Promise<void> {
    const formattedText = this.transformMarkdown(text);
    await ctx.reply(formattedText, { parse_mode: 'Markdown' });
  }

  /**
   * Envoie une réponse avec action de typing
   */
  async sendTypingReply(ctx: Context, text: string): Promise<void> {
    await ctx.sendChatAction('typing');
    await this.sendFormattedReply(ctx, text);
  }

  /**
   * Envoie une réponse d'erreur formatée
   */
  async sendErrorReply(ctx: Context, error: string): Promise<void> {
    const errorMessage = `❌ *Erreur:* ${error}`;
    await this.sendFormattedReply(ctx, errorMessage);
  }
}