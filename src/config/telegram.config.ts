import { config } from 'dotenv';
config();

/**
 * Configuration spécifique pour le service Telegram
 */
export const telegramConfig = {
  // Configuration du bot
  bot: {
    token: process.env.TELEGRAM_BOT_TOKEN
 },

  // Configuration des messages
  messages: {
    maxLength: 4096,
  }
} as const;

export type TelegramConfig = typeof telegramConfig;