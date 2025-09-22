import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { MastraService } from '../../../mastra';
import { UserMemoryService } from '@/memory/user-memory.service';

/**
 * Handler pour la commande /reset_memory - Réinitialisation complète de la mémoire
 */
@Injectable()
export class ResetMemoryCommandHandler extends BaseCommandHandler {

  public readonly metadata: CommandMetadata = {
    name: 'memory_reset',
    description: 'Réinitialisation complète de votre mémoire de conversation (action immédiate)',
  };

  constructor(private readonly userMemory: UserMemoryService) {
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

      // Message d'information sur l'action
      await ctx.reply('🔄 **Réinitialisation en cours...** Veuillez patienter.', { parse_mode: 'Markdown' });

      // Effectuer la réinitialisation complète
      const resetResult = await this.userMemory.clearUserMemory(userId);

      if (resetResult) {
        // Récupérer les statistiques après reset pour confirmer
        const statsAfterReset = this.userMemory.getUserMemoryStats(userId);

        const successMessage = `✅ **Réinitialisation Complète Réussie**`;

        await ctx.reply(successMessage, { parse_mode: 'Markdown' });

        this.logger.log(`Memory completely reset for user ${userId} in chat ${chatId}`);

      } else {
        // Échec de la réinitialisation
        const errorMessage = `❌ **Échec de la Réinitialisation**

🔥 **Problème critique:** Impossible de réinitialiser votre mémoire de conversation.

🔍 **Diagnostics suggérés:**
• 💾 Vérification des permissions fichiers
• 🔒 Libération des verrous système
• ⚙️ Redémarrage du service de mémoire

🛠️ **Actions de récupération:**
• 🔄 Redémarrez le bot si vous êtes administrateur
• 📞 Contactez le support technique
• 💾 Sauvegardez vos données importantes

⚠️ **État incertain:** Utilisez \`/memory-stats\` pour vérifier l'état actuel.`;

        await ctx.reply(errorMessage, { parse_mode: 'Markdown' });

        this.logger.error(`Failed to reset memory for user ${userId} in chat ${chatId}`);
      }

    } catch (error) {
      this.logger.error('Error in reset memory command:', error);
      
      const systemErrorMessage = `❌ **Erreur Système Critique**

🔥 **Problème:** Erreur inattendue lors de la réinitialisation complète.

🚨 **Impact possible:**
• 💾 État de mémoire potentiellement corrompu
• 🔧 Instances de service désynchronisées
• ⚡ Fonctionnalités de mémoire compromises

🛠️ **Actions immédiates:**
• 📊 Vérifiez l'état avec \`/memory-stats\`
• 🔄 Essayez \`/memory-clear\` + \`/memory-confirm-clear\` comme alternative
• 📞 Signalez cette erreur critique à l'administrateur

💡 **Code d'erreur:** RESET_MEMORY_CRITICAL_FAILURE`;

      await ctx.reply(systemErrorMessage, { parse_mode: 'Markdown' });
    }
  }
}