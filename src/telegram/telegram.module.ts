import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
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
  UnsupportedMediaEventHandler,
  ErrorEventHandler
} from './handlers';
import { VoiceProcessingWorkflow } from '@/mastra/workflows/voice-processing.workflow';
import { MastraModule } from '@/mastra/mastra.module';

@Module({
  imports: [MemoryModule, MastraModule],
  providers: [
    TelegramService,
    CommandRegistry,
    EventRegistry,
    StartCommandHandler,
    HelpCommandHandler,
    PingCommandHandler,
    MemoryCommandHandler,
    MemoryStatsCommandHandler,
    TextEventHandler,
    VoiceEventHandler,
    UnsupportedMediaEventHandler,
    ErrorEventHandler,
    VoiceProcessingWorkflow,
  ],
  exports: [TelegramService],
})
export class TelegramModule {}