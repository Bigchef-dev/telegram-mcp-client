/**
 * Configuration principale de l'application
 */
export const appConfig = {
  // Configuration de l'environnement
  environment: process.env.NODE_ENV || 'development',
  
  // Configuration du logging
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
} as const;

export type AppConfig = typeof appConfig;