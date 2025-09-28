/**
 * Configuration principale de l'application
 */
import { config } from 'dotenv';
config();

export const appConfig = {
  // Configuration de l'environnement
  environment: process.env.NODE_ENV || 'development',
  

  mcp: {
    telegramUrl: process.env.MCP_SERVER_URL,
  },
  // Configuration du logging
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
} as const;

export type AppConfig = typeof appConfig;