import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { ConfirmClearCommandHandler } from './memory-confirm-clear.handler';

/**
 * Handler pour la commande /clear_memory - Demande de confirmation pour effacer l'historique
 */
@Injectable()
export class ClearMemoryCommandHandler extends BaseCommandHandler {

    constructor(private readonly confirmClearCommandHandler: ConfirmClearCommandHandler) {
        super();
    }
    
  public readonly metadata: CommandMetadata = {
    name: 'memory_clear',
    description: 'Demande de confirmation pour effacer votre historique de conversation',
  };

  async execute(ctx: Context): Promise<void> {
    try {
      // Récupère les informations de l'utilisateur
      const userId = ctx.from?.id?.toString();
      const chatId = ctx.chat?.id?.toString();

      if (!userId || !chatId) {
        await ctx.reply('❌ Impossible de récupérer vos informations d\'utilisateur.');
        return;
      }

      // Message de demande de confirmation
      const confirmationMessage = `⚠️ **Confirmation d'Effacement de Mémoire**

🗑️ **Action demandée:** Effacement de votre historique de conversation

📋 **Ce qui sera effacé:**
• 💬 Tous vos messages précédents
• 🧠 Le contexte conversationnel
• 📊 Les données de mémoire de travail
• 🔍 L'historique des recherches sémantiques

⚠️ **Attention:** Cette action est **IRRÉVERSIBLE**. Une fois confirmée, vous ne pourrez plus récupérer vos conversations précédentes.

🔄 **Pour confirmer l'effacement, tapez:** \`/${this.confirmClearCommandHandler.metadata.name}\`

❌ **Pour annuler, ignorez simplement ce message ou utilisez une autre commande.**`;

      await ctx.reply(confirmationMessage, { parse_mode: 'Markdown' });

      this.logger.log(`Clear memory confirmation requested by user ${userId} in chat ${chatId}`);

    } catch (error) {
      this.logger.error('Error in clear memory command:', error);
      await ctx.reply('❌ Erreur lors de la demande d\'effacement de mémoire.');
    }
  }
}