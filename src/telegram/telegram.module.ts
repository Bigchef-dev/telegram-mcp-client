import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import {
  CommandRegistry,
  EventRegistry,
  StartCommandHandler,
  HelpCommandHandler,
  StatusCommandHandler,
  PingCommandHandler,
  TextEventHandler,
  VoiceEventHandler,
  UnsupportedMediaEventHandler,
  ErrorEventHandler
} from './handlers';

@Module({
  providers: [
    TelegramService,
    CommandRegistry,
    EventRegistry,
    StartCommandHandler,
    HelpCommandHandler,
    StatusCommandHandler,
    PingCommandHandler,
    TextEventHandler,
    VoiceEventHandler,
    UnsupportedMediaEventHandler,
    ErrorEventHandler
  ],
  exports: [TelegramService],
})
export class TelegramModule {}