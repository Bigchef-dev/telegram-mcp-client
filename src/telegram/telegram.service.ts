import { Injectable, Logger } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
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
  ErrorEventHandler,
  EventType
} from './handlers';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf;

  constructor(
    private readonly commandRegistry: CommandRegistry,
    private readonly eventRegistry: EventRegistry,
    private readonly startHandler: StartCommandHandler,
    private readonly helpHandler: HelpCommandHandler,
    private readonly statusHandler: StatusCommandHandler,
    private readonly pingHandler: PingCommandHandler,
    private readonly textHandler: TextEventHandler,
    private readonly voiceHandler: VoiceEventHandler,
    private readonly unsupportedMediaHandler: UnsupportedMediaEventHandler,
    private readonly errorHandler: ErrorEventHandler
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN must be provided in environment variables');
    }

    this.bot = new Telegraf(token);
    
    this.initializeHandlers();
    this.setupHandlers();
  }

  /**
   * Initialise tous les handlers
   */
  private initializeHandlers(): void {
    // Enregistrement des handlers de commandes
    this.commandRegistry.register(this.startHandler);
    this.commandRegistry.register(this.helpHandler);
    this.commandRegistry.register(this.statusHandler);
    this.commandRegistry.register(this.pingHandler);

    // Enregistrement des handlers d'événements
    this.eventRegistry.register(this.textHandler);
    this.eventRegistry.register(this.voiceHandler);
    this.eventRegistry.register(this.unsupportedMediaHandler);
    this.eventRegistry.register(this.errorHandler);

    this.logger.log('All handlers initialized successfully');
  }

  private setupHandlers() {
    // Configuration des commandes via le registre
    this.setupCommandHandlers();
    
    // Configuration des événements via le registre
    this.setupEventHandlers();
    
    // Gestion globale des erreurs
    this.bot.catch(async (err: any, ctx: Context) => {
      const errorHandler = this.eventRegistry.getHandler(EventType.ERROR);
      if (errorHandler) {
        await errorHandler.handle(ctx, err);
      }
    });
  }

  /**
   * Configure tous les handlers de commandes
   */
  private setupCommandHandlers(): void {
    // Récupération de toutes les commandes enregistrées
    const commands = this.commandRegistry.getAllHandlers();
    
    commands.forEach((handler, commandName) => {
      // Commande /start
      if (commandName === 'start') {
        this.bot.start(async (ctx: Context) => {
          await handler.execute(ctx);
        });
      }
      // Commande /help  
      else if (commandName === 'help') {
        this.bot.help(async (ctx: Context) => {
          await handler.execute(ctx);
        });
      }
      // Autres commandes
      else {
        this.bot.command(commandName, async (ctx: Context) => {
          await handler.execute(ctx);
        });
      }
    });

    this.logger.log(`Configured ${commands.size} command handlers`);
  }

  /**
   * Configure tous les handlers d'événements
   */
  private setupEventHandlers(): void {
    // Handler pour les messages texte (conversation acceptée)
    const textHandler = this.eventRegistry.getHandler(EventType.TEXT);
    if (textHandler) {
      this.bot.on(message('text'), async (ctx) => {
        // Éviter de traiter les commandes comme des messages
        if (!ctx.message.text.startsWith('/')) {
          await textHandler.handle(ctx);
        }
      });
    }

    // Handler pour les messages vocaux (conversation acceptée - futur)
    const voiceHandler = this.eventRegistry.getHandler(EventType.VOICE);
    if (voiceHandler) {
      this.bot.on(message('voice'), async (ctx) => {
        await voiceHandler.handle(ctx);
      });
    }

    // Handlers pour tous les types de médias non supportés
    const unsupportedHandler = this.eventRegistry.getHandler('unsupported_media');
    if (unsupportedHandler) {
      // Photos
      this.bot.on(message('photo'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Audio
      this.bot.on(message('audio'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Documents
      this.bot.on(message('document'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Vidéos
      this.bot.on(message('video'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Messages vidéo courts
      this.bot.on(message('video_note'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Stickers
      this.bot.on(message('sticker'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // GIF animés
      this.bot.on(message('animation'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Contacts
      this.bot.on(message('contact'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Géolocalisation
      this.bot.on(message('location'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Lieux
      this.bot.on(message('venue'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Sondages
      this.bot.on(message('poll'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });

      // Dés
      this.bot.on(message('dice'), async (ctx) => {
        await unsupportedHandler.handle(ctx);
      });
    }

    this.logger.log('Configured event handlers for all message types');
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