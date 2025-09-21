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
  MessageEventHandler,
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
    private readonly messageHandler: MessageEventHandler,
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
    this.eventRegistry.register(this.messageHandler);
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
    // Handler pour les messages texte (utilise les filter utils modernes)
    const messageHandler = this.eventRegistry.getHandler(EventType.TEXT);
    if (messageHandler) {
      this.bot.on(message('text'), async (ctx) => {
        // Éviter de traiter les commandes comme des messages
        // Avec le filtre message('text'), ctx.message est garanti d'avoir une propriété text
        if (!ctx.message.text.startsWith('/')) {
          await messageHandler.handle(ctx);
        }
      });
    }

    this.logger.log('Configured event handlers');
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