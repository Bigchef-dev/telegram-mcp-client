import { Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../events/event.interface';

/**
 * Registre pour les handlers d'événements
 */
@Injectable()
export class EventRegistry {
  private readonly logger = new Logger(EventRegistry.name);
  private readonly handlers = new Map<string, IEventHandler>();

  /**
   * Enregistre un handler d'événement
   */
  register(handler: IEventHandler): void {
    const eventType = handler.getEventType();
    
    if (this.handlers.has(eventType)) {
      this.logger.warn(`Event handler for ${eventType} is already registered, overriding...`);
    }

    this.handlers.set(eventType, handler);
    this.logger.log(`Registered event handler: ${eventType}`);
  }

  /**
   * Récupère un handler par type d'événement
   */
  getHandler(eventType: string): IEventHandler | undefined {
    return this.handlers.get(eventType);
  }

  /**
   * Récupère tous les handlers enregistrés
   */
  getAllHandlers(): Map<string, IEventHandler> {
    return new Map(this.handlers);
  }

  /**
   * Vérifie si un handler existe pour un type d'événement
   */
  hasHandler(eventType: string): boolean {
    return this.handlers.has(eventType);
  }

  /**
   * Supprime un handler d'événement
   */
  unregister(eventType: string): boolean {
    const result = this.handlers.delete(eventType);
    if (result) {
      this.logger.log(`Unregistered event handler: ${eventType}`);
    }
    return result;
  }
}