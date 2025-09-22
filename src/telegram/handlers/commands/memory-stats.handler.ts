import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { MastraService } from '../../../mastra';

/**
 * Handler pour la commande /memory_stats - Affiche des statistiques détaillées sur la mémoire
 */
@Injectable()
export class MemoryStatsCommandHandler extends BaseCommandHandler {

  protected metadata: CommandMetadata = {
    name: 'memory-stats',
    description: 'Affiche des statistiques détaillées sur votre mémoire de conversation',
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

      // Récupère les statistiques de mémoire via MastraService
      const memoryStats = this.mastraService.getUserMemoryStats(userId);
      const activeUsers = this.mastraService.getActiveUsersWithMemory();

      // Formate les statistiques
      const statsMessage = `📊 **Statistiques de Mémoire Détaillées**

👤 **Votre Profil:**
• 🆔 ID Utilisateur: \`${userId}\`
• 💬 Chat ID: \`${chatId}\`
• 🧵 Thread ID: \`${userId}-${chatId}\`

💾 **Stockage:**
• 📁 Fichier DB: \`${memoryStats?.databaseFile || 'N/A'}\`
• � Mémoire active: ${memoryStats?.isActive ? '✅ Oui' : '❌ Non'}
• � Mémoire configurée: ${memoryStats?.hasMemory ? '✅ Oui' : '❌ Non'}

🌍 **Statistiques Globales:**
• 👥 Utilisateurs actifs: ${activeUsers.length}
• 🗄️ Système: Mastra Memory avec LibSQL
• ⚡ Statut: ${memoryStats?.isActive ? 'Opérationnel' : 'Initialisation'}

🔧 **Configuration:**
• 📝 Historique conservé: 5 derniers messages
• 🔍 Recherche sémantique: Activée
• 📊 Portée de recherche: 10 derniers messages
• 💾 Mémoire de travail: Activée

📈 **Fonctionnalités:**
• 🧠 Contexte conversationnel persistant
• 🔍 Recherche sémantique intelligente
• 💾 Stockage local sécurisé
• 🔄 Isolation complète par utilisateur

ℹ️ **Actions disponibles:**
• \`/memory\` - Informations générales
• \`/memory-clear\` - Effacer l'historique
• \`/memory-reset\` - Réinitialisation complète`;

      await ctx.reply(statsMessage, { parse_mode: 'Markdown' });

      this.logger.log(`Memory stats displayed for user ${userId} in chat ${chatId}`);

    } catch (error) {
      this.logger.error('Error in memory stats command:', error);
      await ctx.reply('❌ Erreur lors de l\'affichage des statistiques de mémoire.');
    }
  }
}