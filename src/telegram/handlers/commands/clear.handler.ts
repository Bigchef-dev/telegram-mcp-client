import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { UserMemoryService } from '@/memory/user-memory.service';

@Injectable()
export class ClearCommandHandler extends BaseCommandHandler {
  constructor(private readonly userMemoryService: UserMemoryService) {
    super();
  }

  public readonly metadata: CommandMetadata = {
    name: 'clear',
    description: 'Efface votre historique de conversation'
  };

  async execute(ctx: Context): Promise<void> {
    try {
      if (!this.canExecute(ctx)) {
        return;
      }

      const userId = ctx.from?.id?.toString() || '';
      const chatId = ctx.chat?.id?.toString() || '';

      this.logger.log(`Clearing memory for user ${userId} in chat ${chatId}`);

      // Récupérer la mémoire et supprimer le thread
      const memory = this.userMemoryService.getMemory('poll-telegram-assistant');
      await memory.deleteThread(chatId);

      await ctx.reply(
        '✅ Votre historique de conversation a été effacé. On repart de zéro !'
      );
    } catch (error) {
      this.logger.error(`Error clearing memory: ${error}`);
      await ctx.reply(
        '❌ Erreur lors de l\'effacement de l\'historique'
      );
    }
  }
}
