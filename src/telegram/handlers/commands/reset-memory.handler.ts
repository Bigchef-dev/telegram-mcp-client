import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { MastraService } from '../../../mastra';

/**
 * Handler pour la commande /reset_memory - Réinitialisation complète de la mémoire
 */
@Injectable()
export class ResetMemoryCommandHandler extends BaseCommandHandler {

  protected metadata: CommandMetadata = {
    name: 'memory-reset',
    description: 'Réinitialisation complète de votre mémoire de conversation (action immédiate)',
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

      // Message d'information sur l'action
      await ctx.reply('🔄 **Réinitialisation en cours...** Veuillez patienter.', { parse_mode: 'Markdown' });

      // Effectuer la réinitialisation complète
      const resetResult = await this.mastraService.clearUserMemory(userId);

      if (resetResult) {
        // Récupérer les statistiques après reset pour confirmer
        const statsAfterReset = this.mastraService.getUserMemoryStats(userId);

        const successMessage = `✅ **Réinitialisation Complète Réussie**

🔄 **Action effectuée:** Réinitialisation complète de votre mémoire de conversation.

📋 **Opérations réalisées:**
• 🗑️ Effacement de l'historique complet
• 🔧 Reconfiguration des paramètres de mémoire
• 💾 Création d'une nouvelle base de données
• ⚡ Réinitialisation des instances en mémoire

📊 **État post-réinitialisation:**
• 🆔 Thread ID: \`${userId}-${chatId}\`
• 💾 Fichier DB: \`${statsAfterReset.databaseFile}\`
• 🔋 Mémoire active: ${statsAfterReset.isActive ? '✅ Oui' : '❌ Non'}
• 💡 Mémoire configurée: ${statsAfterReset.hasMemory ? '✅ Oui' : '❌ Non'}

🚀 **Prêt pour:**
• 💬 Nouvelles conversations sans historique
• 🧠 Apprentissage contextuel from scratch
• 🔍 Recherches sémantiques sur nouvelles données
• 📊 Accumulation de nouveaux patterns

💡 **Différences avec /memory-clear:**
• ⚡ **Action immédiate** (pas de confirmation)
• 🔧 **Reconfiguration complète** des instances
• 💾 **Nettoyage forcé** des caches système
• 🛠️ **Résolution** des problèmes de corruption

🔍 **Commandes utiles:**
• \`/memory-stats\` - Vérifier le nouvel état
• \`/memory\` - Informations générales`;

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