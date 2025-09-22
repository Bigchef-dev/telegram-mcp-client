import { Injectable, Logger } from '@nestjs/common';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { memoryConfig } from '@/config';
/**
 * User-isolated memory management service
 */
@Injectable()
export class UserMemoryService {
  private readonly logger = new Logger(UserMemoryService.name);
  private memoryInstances: Map<string, Memory> = new Map();

  constructor() {
    this.logger.log('UserMemoryService initialized');
  }

  /**
   * Retrieves or creates a memory instance for a specific user
   */
  private getUserMemory(userId: string): Memory {
    // Check if instance already exists
    if (this.memoryInstances.has(userId)) {
      return this.memoryInstances.get(userId)!;
    }

    // New instance
    const userMemory = new Memory({
      storage: new LibSQLStore({ 
        url: this.getDatabaseFilePath(userId) 
      }),
      options: {
        lastMessages: memoryConfig.lastMessages,
        workingMemory: { enabled: memoryConfig.workingMemory.enabled }
      }
    });

    // Save the instance
    this.memoryInstances.set(userId, userMemory);
    
    this.logger.log(`Created dedicated memory instance for user ${userId}`);
    
    return userMemory;
  }

  /**
   * Retrieves the memory instance for a user
   */
  getMemoryForUser(userId: string): Memory {
    return this.getUserMemory(userId);
  }

  /**
   * Clears a user's memory
   */
  async clearUserMemory(userId: string): Promise<boolean> {
    try {
      // Supprimer l'instance du cache
      if (this.memoryInstances.has(userId)) {
        this.memoryInstances.delete(userId);
      }

      // Créer une nouvelle instance propre
      this.getUserMemory(userId);
      
      this.logger.log(`Memory cleared for user ${userId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to clear memory for user ${userId}:`, error);
      return false;
    }
  }

  getDatabaseFilePath(userId: string): string {
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
      databaseFile: this.getDatabaseFilePath(userId),
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