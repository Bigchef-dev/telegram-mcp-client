/**
 * Configuration spécifique pour le système de mémoire
 */
export const memoryConfig = {
    // Historique des messages
    lastMessages: parseInt(process.env.MEMORY_LAST_MESSAGES || '8'),
    
    // Recherche sémantique
    semanticRecall: {
      enabled: process.env.MEMORY_SEMANTIC_RECALL === 'true' || false,
      topK: parseInt(process.env.MEMORY_SEMANTIC_TOP_K || '3'),
      messageRange: parseInt(process.env.MEMORY_SEMANTIC_RANGE || '10'),
      threshold: parseFloat(process.env.MEMORY_SEMANTIC_THRESHOLD || '0.7'),
    },

    // Mémoire de travail
    workingMemory: {
      enabled: process.env.MEMORY_WORKING_MEMORY === 'true' || true,
      maxSize: parseInt(process.env.MEMORY_WORKING_MAX_SIZE || '1000'),
      ttl: parseInt(process.env.MEMORY_WORKING_TTL || '57600000'), // 16h
    },

  // Configuration de performance
  performance: {
    cache: {
      enabled: process.env.MEMORY_CACHE_ENABLED === 'true' || true,
      maxInstances: parseInt(process.env.MEMORY_CACHE_MAX_INSTANCES || '100'),
      ttl: parseInt(process.env.MEMORY_CACHE_TTL || '1800000'), // 30 minutes
    },

    // Automated cleanup
    cleanup: {
      enabled: process.env.MEMORY_CLEANUP_ENABLED === 'true' || true,
      interval: parseInt(process.env.MEMORY_CLEANUP_INTERVAL || '3600000'), // 1 heure
      inactiveThreshold: parseInt(process.env.MEMORY_CLEANUP_INACTIVE_THRESHOLD || '86400000'), // 24h
    },

    // Optimisations
    optimization: {
      enableCompression: process.env.MEMORY_COMPRESSION === 'true' || false,
      enableIndexing: process.env.MEMORY_INDEXING === 'true' || true,
      batchSize: parseInt(process.env.MEMORY_BATCH_SIZE || '100'),
    },
    }
} as const;

export type MemoryConfig = typeof memoryConfig;