import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';


@Injectable()
export class StartCommandHandler extends BaseCommandHandler {
  public readonly metadata: CommandMetadata = {
    name: 'start',
    description: 'Démarre le bot et affiche le message de bienvenue'
  };

  async execute(ctx: Context): Promise<void> {
    try {
      if (!this.canExecute(ctx)) {
        return;
      }

      this.logger.log(`New user started the bot: ${ctx.from?.id}`);
const MESSAGE = `👋 Bonjour ${ctx.from?.first_name || ''}, je suis Chat Guevarra !

Je suis là pour t'aider à faire un sondage, parce que c'est toujours compliqué.
💡Pour commencer, dit moi le titre de ton sondage, et liste moi les options une par une, je mets tout en forme.

Tu peux peux :
- 📝 M'écrire ici
- 🔈 M'envoyer un message vocal

Je me souviens de la conversation pendant 18h, donc tu peux demander des modifications 😁.` 
      await ctx.reply(MESSAGE);
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}