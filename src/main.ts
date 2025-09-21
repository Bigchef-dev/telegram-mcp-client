import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const telegramService = app.get(TelegramService);
  await telegramService.launch();
  
  console.log('Telegram MCP Client is running...');
  
  // Handle graceful shutdown
  process.once('SIGINT', () => telegramService.stop('SIGINT'));
  process.once('SIGTERM', () => telegramService.stop('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});