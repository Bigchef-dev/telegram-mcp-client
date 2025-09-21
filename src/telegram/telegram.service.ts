import { Injectable, Logger } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN must be provided in environment variables');
    }

    this.bot = new Telegraf(token);
    this.setupHandlers();
  }

  private setupHandlers() {
    // Start command
    this.bot.start((ctx: Context) => {
      this.logger.log(`New user started the bot: ${ctx.from?.id}`);
      ctx.reply('Welcome to the Telegram MCP Client! 🤖\n\nI\'m ready to help you with Model Context Protocol operations.');
    });

    // Help command
    this.bot.help((ctx: Context) => {
      ctx.reply(
        'Available commands:\n' +
        '/start - Start the bot\n' +
        '/help - Show this help message\n' +
        '/status - Check bot status\n' +
        '/ping - Check if bot is responsive'
      );
    });

    // Status command
    this.bot.command('status', (ctx: Context) => {
      ctx.reply('✅ Bot is running and ready to serve!');
    });

    // Ping command
    this.bot.command('ping', (ctx: Context) => {
      ctx.reply('🏓 Pong!');
    });

    // Handle all text messages
    this.bot.on('text', (ctx: Context) => {
      this.logger.log(`Received message: ${ctx.message}`);
      ctx.reply('I received your message! MCP integration will be added soon.');
    });

    // Error handling
    this.bot.catch((err: any, ctx: Context) => {
      this.logger.error(`Error for ${ctx.updateType}:`, err);
    });
  }

  async launch(): Promise<void> {
    try {
      await this.bot.launch();
      this.logger.log('Telegram bot started successfully');
    } catch (error) {
      this.logger.error('Failed to start Telegram bot:', error);
      throw error;
    }
  }

  stop(reason?: string): void {
    this.logger.log(`Stopping bot${reason ? ` due to ${reason}` : ''}`);
    this.bot.stop(reason);
  }
}