import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';

@Injectable()
export class HelpCommandHandler extends BaseCommandHandler {
  protected metadata: CommandMetadata = {
    name: 'help',
    description: 'Affiche la liste des commandes disponibles'
  };

  async execute(ctx: Context): Promise<void> {
    try {
      if (!this.canExecute(ctx)) {
        return;
      }

      const helpMessage = 
        'Available commands:\n' +
        '/start - Start the bot\n' +
        '/help - Show this help message\n' +
        '/status - Check bot status\n' +
        '/ping - Check if bot is responsive';

      await ctx.reply(helpMessage);
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}