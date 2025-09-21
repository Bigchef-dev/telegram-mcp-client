import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import {
  CommandRegistry,
  EventRegistry,
  StartCommandHandler,
  HelpCommandHandler,
  StatusCommandHandler,
  PingCommandHandler,
  MessageEventHandler,
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
    MessageEventHandler,
    ErrorEventHandler
  ],
  exports: [TelegramService],
})
export class TelegramModule {}