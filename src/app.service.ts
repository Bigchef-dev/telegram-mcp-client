import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {
    this.logger.log('Telegram MCP Client service initialized');
  }

  getAppInfo(): string {
    return 'Telegram MCP Client - A bot for Model Context Protocol operations';
  }
}