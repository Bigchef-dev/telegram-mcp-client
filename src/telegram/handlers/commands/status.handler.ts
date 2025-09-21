import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';

@Injectable()
export class StatusCommandHandler extends BaseCommandHandler {
  protected metadata: CommandMetadata = {
    name: 'status',
    description: 'Vérifie le statut du bot'
  };

  async execute(ctx: Context): Promise<void> {
    try {
      if (!this.canExecute(ctx)) {
        return;
      }

      await ctx.reply('✅ Bot is running and ready to serve!');
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}