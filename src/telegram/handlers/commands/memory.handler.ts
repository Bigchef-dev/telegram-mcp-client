import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { memoryConfig } from '@/config';
import { MemoryStatsCommandHandler } from './memory-stats.handler';

/**
 * Handler pour la commande /memory - Affiche des informations sur la mémoire de conversation
 */
@Injectable()
export class MemoryCommandHandler extends BaseCommandHandler {

  constructor() {
    super();
  }

  public readonly metadata: CommandMetadata = {
    name: 'memory',
    description: 'Affiche des informations sur la mémoire de conversation',
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

      // Message d'information sur la mémoire
      const memoryInfo = `🧠 **Mémoire de Conversation**

🆔 **Utilisateur:** ${userId}
💬 **Chat:** ${chatId}

📊 **Fonctionnalités:**
• ✅ Mémoire persistante activée
• 🔍 Recherche sémantique (${memoryConfig.semanticRecall.topK} messages pertinents)
• 📝 Historique des ${memoryConfig.lastMessages} derniers messages

ℹ️ **Note:** Votre bot se souvient de vos conversations pour vous offrir des réponses plus pertinentes et contextuelles.

🔒 **Confidentialité:** Vos données sont stockées localement et ne sont pas partagées.`;

      await ctx.reply(memoryInfo, { parse_mode: 'Markdown' });

      this.logger.log(`Memory info displayed for user ${userId} in chat ${chatId}`);

    } catch (error) {
      this.logger.error('Error in memory command:', error);
      await ctx.reply('❌ Erreur lors de l\'affichage des informations de mémoire.');
    }
  }
}