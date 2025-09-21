import { Injectable, Logger } from '@nestjs/common';
import { ICommandHandler } from '../commands/base/command.interface';

/**
 * Registre pour les handlers de commandes
 */
@Injectable()
export class CommandRegistry {
  private readonly logger = new Logger(CommandRegistry.name);
  private readonly handlers = new Map<string, ICommandHandler>();

  /**
   * Enregistre un handler de commande
   */
  register(handler: ICommandHandler): void {
    const commandName = handler.getCommandName();
    
    if (this.handlers.has(commandName)) {
      this.logger.warn(`Command ${commandName} is already registered, overriding...`);
    }

    this.handlers.set(commandName, handler);
    this.logger.log(`Registered command handler: ${commandName}`);
  }

  /**
   * Récupère un handler par nom de commande
   */
  getHandler(commandName: string): ICommandHandler | undefined {
    return this.handlers.get(commandName);
  }

  /**
   * Récupère tous les handlers enregistrés
   */
  getAllHandlers(): Map<string, ICommandHandler> {
    return new Map(this.handlers);
  }

  /**
   * Récupère la liste des commandes disponibles
   */
  getAvailableCommands(): Array<{ name: string; description: string }> {
    return Array.from(this.handlers.values()).map(handler => ({
      name: handler.getCommandName(),
      description: handler.getDescription()
    }));
  }

  /**
   * Vérifie si une commande existe
   */
  hasCommand(commandName: string): boolean {
    return this.handlers.has(commandName);
  }

  /**
   * Supprime un handler
   */
  unregister(commandName: string): boolean {
    const result = this.handlers.delete(commandName);
    if (result) {
      this.logger.log(`Unregistered command handler: ${commandName}`);
    }
    return result;
  }
}