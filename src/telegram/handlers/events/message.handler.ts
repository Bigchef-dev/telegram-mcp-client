import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { BaseEventHandler } from './base-event.handler';
import { EventType } from './event.interface';

@Injectable()
export class MessageEventHandler extends BaseEventHandler {
  getEventType(): string {
    return EventType.TEXT;
  }

  async handle(ctx: Context, error?: Error): Promise<void> {
    try {
      this.logger.log(`Received message: ${ctx.message}`);
      
      await ctx.reply('I received your message! MCP integration will be added soon.');
    } catch (error) {
      await this.handleError(ctx, error as Error);
    }
  }
}