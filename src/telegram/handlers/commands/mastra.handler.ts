import { Injectable, Inject } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { MastraService } from '../../../mastra';

@Injectable()
export class MastraCommandHandler extends BaseCommandHandler {
  protected metadata: CommandMetadata = {
    name: 'mastra',
    description: 'Teste l\'intégration Mastra',
  };

  constructor(
    @Inject('MASTRA_SERVICE')
    private readonly mastraService: MastraService,
  ) {
    super();
  }

  async execute(ctx: Context): Promise<void> {
    try {
      this.logger.log('Executing /mastra command');

      // Test du service Mastra
      const status = await this.mastraService.getStatus();
      
      const message = `🚀 **Test Mastra v${status.version}**

✅ **Statut:** ${status.status}
⏰ **Timestamp:** ${status.timestamp}

🔧 **Fonctionnalités disponibles:**
• Traitement de messages avec IA
• Workflows personnalisés  
• Outils et agents configurables
• Intégration avec Model Context Protocol

📱 **Test:** Envoyez un message texte pour voir Mastra en action !

🛠️ **Structure créée:**
\`\`\`
src/mastra/
├── index.ts          # Configuration principale
├── mastra.module.ts   # Module NestJS
├── agents/            # Agents IA (à développer)
├── tools/             # Outils personnalisés (à développer)
└── workflows/         # Workflows (à développer)
\`\`\``;

      await ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      this.logger.error('Error in /mastra command', error);
      await ctx.reply('❌ Erreur lors du test Mastra');
    }
  }
}