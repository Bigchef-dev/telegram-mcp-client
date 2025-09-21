import { Injectable, Logger } from '@nestjs/common';
import { Context } from 'telegraf';
import { ICommandHandler, CommandMetadata } from './command.interface';

/**
 * Classe de base abstraite pour tous les handlers de commandes
 */
@Injectable()
export abstract class BaseCommandHandler implements ICommandHandler {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Métadonnées de la commande
   */
  protected abstract metadata: CommandMetadata;

  /**
   * Retourne le nom de la commande
   */
  getCommandName(): string {
    return this.metadata.name;
  }

  /**
   * Retourne la description de la commande
   */
  getDescription(): string {
    return this.metadata.description;
  }

  /**
   * Retourne les métadonnées complètes
   */
  getMetadata(): CommandMetadata {
    return this.metadata;
  }

  /**
   * Vérifie si l'utilisateur peut exécuter cette commande
   */
  protected canExecute(ctx: Context): boolean {
    // Pour l'instant, toutes les commandes sont accessibles
    // Peut être étendu pour gérer les permissions admin
    return true;
  }

  /**
   * Gère les erreurs de commande
   */
  protected async handleError(ctx: Context, error: Error): Promise<void> {
    this.logger.error(`Error in command ${this.getCommandName()}:`, error);
    await ctx.reply('❌ Une erreur est survenue lors de l\'exécution de la commande.');
  }

  /**
   * Méthode abstraite à implémenter pour chaque commande
   */
  abstract execute(ctx: Context): Promise<void>;
}