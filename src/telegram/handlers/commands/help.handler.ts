import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { CommandRegistry } from '../registry/command.registry';

@Injectable()
export class HelpCommandHandler extends BaseCommandHandler {
  public readonly metadata: CommandMetadata = {
    name: 'help',
    description: 'Affiche la liste des commandes disponibles'
  };

  constructor(private readonly commandRegistry: CommandRegistry) {
    super();
  }

  async execute(ctx: Context): Promise<void> {
    try {
      if (!this.canExecute(ctx)) {
        return;
      }

      // Récupérer dynamiquement toutes les commandes disponibles
      const availableCommands = this.commandRegistry.getAvailableCommands();
      
      // Construire le message d'aide dynamiquement
      let helpMessage = 'Available commands:\n';
      
      for (const command of availableCommands) {
        helpMessage += `/${command.name} - ${command.description}\n`;
      }

      await ctx.reply(helpMessage);
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}