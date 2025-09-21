import { Context } from 'telegraf';

/**
 * Interface pour les handlers de commandes Telegram
 */
export interface ICommandHandler {
  /**
   * Nom de la commande (sans le /)
   */
  getCommandName(): string;

  /**
   * Description de la commande pour l'aide
   */
  getDescription(): string;

  /**
   * Exécute la commande
   * @param ctx Context Telegraf
   */
  execute(ctx: Context): Promise<void>;
}

/**
 * Métadonnées d'une commande
 */
export interface CommandMetadata {
  name: string;
  description: string;
  aliases?: string[];
  adminOnly?: boolean;
}