import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramReplyService } from './services/telegram-reply.service';
import { MemoryModule } from '../memory/memory.module';
import {
  CommandRegistry,
  EventRegistry,
  StartCommandHandler,
  HelpCommandHandler,
  PingCommandHandler,
  MemoryCommandHandler,
  MemoryStatsCommandHandler,
  TextEventHandler,
  VoiceEventHandler,
  PollEventHandler,
  UnsupportedMediaEventHandler,
  ErrorEventHandler
} from './handlers';
import { VoiceProcessingWorkflow } from '@/mastra/workflows/voice-processing.workflow';
import { MastraModule } from '@/mastra/mastra.module';

@Module({
  imports: [MemoryModule, MastraModule],
  providers: [
    TelegramService,
    TelegramReplyService,
    CommandRegistry,
    EventRegistry,
    StartCommandHandler,
    HelpCommandHandler, 
    PingCommandHandler,
    MemoryCommandHandler,
    MemoryStatsCommandHandler,
    TextEventHandler,
    VoiceEventHandler,
    PollEventHandler,
    UnsupportedMediaEventHandler,
    ErrorEventHandler,
    VoiceProcessingWorkflow,
  ],
  exports: [TelegramService],
})
export class TelegramModule {}