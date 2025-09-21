import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';

@Injectable()
export class PingCommandHandler extends BaseCommandHandler {
  protected metadata: CommandMetadata = {
    name: 'ping',
    description: 'Teste la réactivité du bot'
  };

  async execute(ctx: Context): Promise<void> {
    try {
      if (!this.canExecute(ctx)) {
        return;
      }

      await ctx.reply('🏓 Pong!');
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}