import { Inject, Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseEventHandler } from './base-event.handler';
import { EventType } from './event.interface';
import { VoiceProcessingWorkflow } from '@/mastra/workflows/voice-processing.workflow';
import { TelegramReplyService } from '@/telegram/services/telegram-reply.service';

@Injectable()
export class VoiceEventHandler extends BaseEventHandler {
  getEventType(): string {
    return EventType.VOICE;
  }

    constructor(
      private readonly voiceProcessingWorkflow: VoiceProcessingWorkflow,
      private readonly telegramReplyService: TelegramReplyService,
    ) {
      super();
    }
  

  async handle(ctx: Context, error?: Error): Promise<void> {
    try {
      this.logger.log(`Received voice message from user: ${ctx.from?.id}`);
      if (!ctx.message || !('voice' in ctx.message)) {
        this.logger.warn('No voice message found in the context.');
        return;
      }
      const voice = ctx.message?.voice;
      if (!voice || !voice.file_id) {
        this.logger.warn('Voice message does not contain a valid file_id.');
        return;
      }
      const file = await ctx.telegram.getFileLink(voice.file_id);
      const response = await fetch(file.href);
      const buffer = Buffer.from(await response.arrayBuffer());

      const result = await this.voiceProcessingWorkflow.execute({
        voiceFileId: voice.file_id,
        mediaType: voice.mime_type,
        audio: buffer,
        userId: ctx.from?.id?.toString() || 'unknown',
        chatId: ctx.chat?.id?.toString() || 'unknown',
      })
      this.telegramReplyService.sendFormattedReply(ctx, result.text);
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}