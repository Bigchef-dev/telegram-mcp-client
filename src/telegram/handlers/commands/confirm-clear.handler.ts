import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { MastraService } from '../../../mastra';

/**
 * Handler pour la commande /confirm_clear - Confirme et effectue l'effacement de mémoire
 */
@Injectable()
export class ConfirmClearCommandHandler extends BaseCommandHandler {

  protected metadata: CommandMetadata = {
    name: 'memory-confirm-clear',
    description: 'Confirme et effectue l\'effacement de votre historique de conversation',
  };

  constructor(private readonly mastraService: MastraService) {
    super();
  }

  async execute(ctx: Context): Promise<void> {
    try {
      // Récupère les informations de l'utilisateur
      const userId = ctx.from?.id?.toString();
      const chatId = ctx.chat?.id?.toString();

      if (!userId || !chatId) {
        await ctx.reply('❌ Impossible de récupérer vos informations d\'utilisateur.');
        return;
      }

      // Tenter d'effacer la mémoire via MastraService
      const clearResult = await this.mastraService.clearUserMemory(userId);

      if (clearResult) {
        // Succès de l'effacement
        const successMessage = `✅ **Mémoire Effacée avec Succès**

🗑️ **Action réalisée:** Votre historique de conversation a été entièrement effacé.

📋 **Ce qui a été supprimé:**
• 💬 Tous les messages précédents
• 🧠 Le contexte conversationnel
• 📊 Les données de mémoire de travail
• 🔍 L'historique des recherches sémantiques

🔄 **État actuel:**
• 🆕 Nouvelle session de conversation initialisée
• 💾 Base de données utilisateur réinitialisée
• ⚡ Mémoire prête pour de nouvelles interactions

🚀 **Vous pouvez maintenant:**
• 💬 Commencer une nouvelle conversation
• 🔍 Le bot n'aura plus accès aux anciens messages
• 📊 Utiliser \`/memory-stats\` pour vérifier l'état

💡 **Note:** Cette action était irréversible et a été effectuée avec succès.`;

        await ctx.reply(successMessage, { parse_mode: 'Markdown' });

        this.logger.log(`Memory successfully cleared for user ${userId} in chat ${chatId}`);

      } else {
        // Échec de l'effacement
        const errorMessage = `❌ **Erreur lors de l'Effacement**

🔧 **Problème:** Impossible d'effacer votre mémoire de conversation.

🔍 **Causes possibles:**
• 💾 Problème d'accès à la base de données
• 🔒 Verrou sur le fichier de mémoire
• ⚙️ Erreur de configuration système

🛠️ **Solutions suggérées:**
• 🔄 Réessayez dans quelques instants
• 🔧 Utilisez \`/reset_memory\` pour une réinitialisation forcée
• 📞 Contactez l'administrateur si le problème persiste

📊 **Vérification:** Utilisez \`/memory-stats\` pour voir l'état actuel de votre mémoire.`;

        await ctx.reply(errorMessage, { parse_mode: 'Markdown' });

        this.logger.error(`Failed to clear memory for user ${userId} in chat ${chatId}`);
      }

    } catch (error) {
      this.logger.error('Error in confirm clear command:', error);
      
      const systemErrorMessage = `❌ **Erreur Système**

🔥 **Problème technique:** Une erreur inattendue s'est produite lors de l'effacement.

🔧 **Recommandations:**
• 🔄 Réessayez la commande \`/clear_memory\` puis \`/confirm_clear\`
• 📊 Vérifiez l'état avec \`/memory-stats\`
• 📞 Signalez ce problème à l'administrateur

💡 **Code d'erreur:** CONFIRM_CLEAR_FAILED`;

      await ctx.reply(systemErrorMessage, { parse_mode: 'Markdown' });
    }
  }
}