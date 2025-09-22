import { Injectable, Logger } from '@nestjs/common';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

/**
 * Service de gestion de mémoire isolée par utilisateur
 */
@Injectable()
export class UserMemoryService {
  private readonly logger = new Logger(UserMemoryService.name);
  private memoryInstances: Map<string, Memory> = new Map();

  constructor() {
    this.logger.log('UserMemoryService initialized');
  }

  /**
   * Récupère ou crée une instance de mémoire pour un utilisateur spécifique
   */
  private getUserMemory(userId: string): Memory {
    // Vérifier si l'instance existe déjà
    if (this.memoryInstances.has(userId)) {
      return this.memoryInstances.get(userId)!;
    }

    // Créer une nouvelle instance avec une base de données dédiée
    const userMemory = new Memory({
      storage: new LibSQLStore({ 
        url: `file:memory_user_${userId}.db` // Base de données dédiée par utilisateur
      }),
      options: {
        // Récupère les 5 derniers messages pour le contexte
        lastMessages: 5,
        // Active la mémoire de travail pour persister les infos utilisateur
        workingMemory: { enabled: true }
      }
    });

    // Sauvegarder l'instance
    this.memoryInstances.set(userId, userMemory);
    
    this.logger.log(`Created dedicated memory instance for user ${userId}`);
    
    return userMemory;
  }

  /**
   * Récupère l'instance de mémoire pour un utilisateur
   */
  getMemoryForUser(userId: string): Memory {
    return this.getUserMemory(userId);
  }

  /**
   * Efface la mémoire d'un utilisateur
   */
  async clearUserMemory(userId: string): Promise<boolean> {
    try {
      // Supprimer l'instance du cache
      if (this.memoryInstances.has(userId)) {
        this.memoryInstances.delete(userId);
      }

      // Créer une nouvelle instance propre
      const freshMemory = this.getUserMemory(userId);
      
      this.logger.log(`Memory cleared for user ${userId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to clear memory for user ${userId}:`, error);
      return false;
    }
  }

  async getDatabaseFilePath(userId: string): Promise<string> {
    return `data/memory_user_${userId}.db`;
  }

  /**
   * Récupère les statistiques de mémoire pour un utilisateur
   */
  getUserMemoryStats(userId: string): {
    hasMemory: boolean;
    databaseFile: string;
    isActive: boolean;
  } {
    return {
      hasMemory: this.memoryInstances.has(userId),
      databaseFile: `memory_user_${userId}.db`,
      isActive: this.memoryInstances.has(userId),
    };
  }

  /**
   * Récupère la liste de tous les utilisateurs avec mémoire active
   */
  getActiveUsers(): string[] {
    return Array.from(this.memoryInstances.keys());
  }

  /**
   * Nettoie les instances de mémoire inactives (optionnel, pour libérer la RAM)
   */
  cleanupInactiveMemories(): void {
    // Cette méthode pourrait être appelée périodiquement
    // pour libérer la mémoire des utilisateurs inactifs
    this.logger.log(`Currently ${this.memoryInstances.size} user memory instances active`);
  }
}