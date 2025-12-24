import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseEventHandler } from './base-event.handler';
import { EventType } from './event.interface';
import { MessageProcessingWorkflow } from '@/mastra/workflows/message-processing.workflow';
import { TelegramReplyService } from '../../services/telegram-reply.service';
import { Poll, PollOption } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class PollEventHandler extends BaseEventHandler {
  constructor(
    private readonly messageProcessingWorkflow: MessageProcessingWorkflow,
    private readonly telegramReplyService: TelegramReplyService,
  ) {
    super();
  }

  getEventType(): string {
    return EventType.POLL;
  }

  /**
   * Convertit un poll Telegram en texte descriptif
   */
  private pollToText(poll: Poll): string {
    if (!poll) return 'Sondage non disponible';

    const question = poll.question || 'Question non disponible';
    const options = poll.options || [];
    const isAnonymous = poll.is_anonymous ? 'anonyme' : 'public';
    const allowsMultiple = poll.allows_multiple_answers ? 'à choix multiples' : 'à choix unique';
    const type = poll.type === 'quiz' ? 'quiz' : 'sondage';

    let pollText = `📊 *${type.toUpperCase()} ${isAnonymous} ${allowsMultiple}*\n\n`;
    pollText += `*Question :* ${question}\n\n`;
    pollText += `*Options :*\n`;

    options.forEach((option: PollOption, index: number) => {
      pollText += `${index + 1}. ${option.text}\n`;
    });

    pollText += `\n*Total des votes :* ${poll.total_voter_count}`;

    if (poll.type === 'quiz' && poll.correct_option_id !== undefined) {
      const correctOption = options[poll.correct_option_id];
      if (correctOption) {
        pollText += `\n✅ *Bonne réponse :* ${correctOption.text}`;
      }
    }

    if (poll.explanation) {
      pollText += `\n\n*Explication :* ${poll.explanation}`;
    }

    return pollText;
  }

  async handle(ctx: Context, error?: Error): Promise<void> {
    try {
      const poll = (ctx.message as any)?.poll;
      const userId = ctx.from?.id?.toString() || '';
      const chatId = ctx.chat?.id?.toString() || '';

      if (!poll) {
        this.logger.warn('Poll message received but poll data is missing');
        await this.telegramReplyService.sendErrorReply(ctx, 'Données du sondage non disponibles');
        return;
      }

      // Conversion du poll en texte
      const pollText = this.pollToText(poll);
      
      this.logger.log(`Received poll from user ${userId}: ${poll.question}`);

      // Traitement par le workflow MCP avec le texte du poll
      const message = `L'utilisateur a partagé ce sondage : ${pollText}`;
      
      const result = await this.messageProcessingWorkflow.addMessage(message, chatId, userId);
      await ctx.react('❤‍🔥');
      
      this.logger.log(`Mastra processed poll message: ${result}`);
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}