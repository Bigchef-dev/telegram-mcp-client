import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';

@Injectable()
export class StartCommandHandler extends BaseCommandHandler {
  protected metadata: CommandMetadata = {
    name: 'start',
    description: 'Démarre le bot et affiche le message de bienvenue'
  };

  async execute(ctx: Context): Promise<void> {
    try {
      if (!this.canExecute(ctx)) {
        return;
      }

      this.logger.log(`New user started the bot: ${ctx.from?.id}`);
      
      await ctx.reply(
        'Welcome to the Telegram MCP Client! 🤖\n\n' +
        'I\'m ready to help you with Model Context Protocol operations.'
      );
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}