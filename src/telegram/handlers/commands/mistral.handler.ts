import { Injectable, Inject } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseCommandHandler } from './base/base-command.handler';
import { CommandMetadata } from './base/command.interface';
import { MastraService } from '../../../mastra';

@Injectable()
export class MistralCommandHandler extends BaseCommandHandler {
  public readonly metadata: CommandMetadata = {
    name: 'mistral',
    description: 'Teste l\'agent Mistral AI directement',
  };

  constructor(
    @Inject('MASTRA_SERVICE')
    private readonly mastraService: MastraService,
  ) {
    super();
  }

  async execute(ctx: Context): Promise<void> {
    try {
      this.logger.log('Executing /mistral command');

      // Test direct de l'agent Mistral
      const testResult = await this.mastraService.testMistralAgentWithMemory('Bonjour, pouvez-vous me présenter Mistral AI ?');
      
      const message = `🚀 **Test Agent Mistral AI**

✅ **Agent:** ${testResult.error ? '❌ Erreur' : '✅ Fonctionnel'}
🤖 **Modèle:** mistral-large-latest
📊 **Confiance:** ${testResult.confidence ? (testResult.confidence * 100).toFixed(1) + '%' : 'N/A'}
⚡ **Temps:** ${testResult.metadata?.processingTime || 'N/A'}ms

📝 **Réponse de test:**
${testResult.response || testResult.error || 'Erreur inconnue'}

💡 **Instructions:**
Envoyez n'importe quel message texte pour interagir avec l'agent Mistral !

🔧 **Fonctionnalités:**
• Conversation naturelle en français
• Réponses contextuelles
• Adaptation au ton de l'utilisateur
• Gestion des erreurs avec fallback`;

      await ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      this.logger.error('Error in /mistral command', error);
      await ctx.reply('❌ Erreur lors du test de l\'agent Mistral');
    }
  }
}