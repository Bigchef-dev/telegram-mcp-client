import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { MastraModule } from '../mastra/mastra.module';
import {
  CommandRegistry,
  EventRegistry,
  StartCommandHandler,
  HelpCommandHandler,
  PingCommandHandler,
  MistralCommandHandler,
  MemoryCommandHandler,
  TextEventHandler,
  VoiceEventHandler,
  UnsupportedMediaEventHandler,
  ErrorEventHandler
} from './handlers';

@Module({
  imports: [MastraModule],
  providers: [
    TelegramService,
    CommandRegistry,
    EventRegistry,
    StartCommandHandler,
    HelpCommandHandler,
    PingCommandHandler,
    MistralCommandHandler,
    MemoryCommandHandler,
    TextEventHandler,
    VoiceEventHandler,
    UnsupportedMediaEventHandler,
    ErrorEventHandler
  ],
  exports: [TelegramService],
})
export class TelegramModule {}