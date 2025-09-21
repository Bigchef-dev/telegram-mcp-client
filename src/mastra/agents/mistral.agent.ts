import { Agent } from '@mastra/core';
import { mistral } from '@ai-sdk/mistral';
import { z } from 'zod';

/**
 * Agent Mistral pour le traitement de messages Telegram
 * Utilise le modèle Mistral AI via le Vercel AI SDK
 */
export class MistralAgent extends Agent {
  constructor() {
    super({
      name: 'mistral-telegram-assistant',
      description: 'Assistant Telegram alimenté par Mistral AI pour répondre aux questions et traiter les messages',
      instructions: `Tu es un assistant Telegram intelligent alimenté par Mistral AI.

Tes rôles principaux :
- Répondre aux questions des utilisateurs de manière claire et précise
- Aider avec des tâches variées (rédaction, explication, conseil)
- Maintenir une conversation naturelle et engageante
- Être poli, utile et informatif

Instructions spéciales :
- Réponds en français de préférence
- Garde tes réponses concises mais complètes
- Si tu ne sais pas quelque chose, dis-le honnêtement
- Adapte ton ton à celui de l'utilisateur
- Évite les réponses trop longues dans Telegram`,

      model: mistral('mistral-medium-latest'),
      tools: {}, // Pas d'outils pour cette version simple
    });
  }

  // Schéma pour les entrées de l'agent
  inputSchema = z.object({
    message: z.string().describe('Le message de l\'utilisateur Telegram'),
    userId: z.string().describe('L\'ID de l\'utilisateur Telegram'),
    chatId: z.string().describe('L\'ID du chat Telegram'),
    context: z.object({
      messageType: z.enum(['text', 'command', 'voice', 'photo']).describe('Le type de message'),
      userName: z.string().optional().describe('Le nom d\'utilisateur'),
      timestamp: z.string().describe('Timestamp du message'),
    }).describe('Contexte du message'),
  });

  // Schéma pour les sorties de l'agent
  outputSchema = z.object({
    response: z.string().describe('La réponse générée par Mistral'),
    confidence: z.number().min(0).max(1).describe('Niveau de confiance de la réponse'),
    shouldFollowUp: z.boolean().describe('Si une question de suivi serait appropriée'),
    metadata: z.object({
      model: z.string().describe('Modèle utilisé'),
      tokensUsed: z.number().optional().describe('Nombre de tokens utilisés'),
      processingTime: z.number().describe('Temps de traitement en ms'),
    }),
  });

  /**
   * Traite un message utilisateur avec Mistral
   */
  async processUserMessage(input: z.infer<typeof this.inputSchema>): Promise<z.infer<typeof this.outputSchema>> {
    const startTime = Date.now();

    try {
      const prompt = this.buildPrompt(input);
      
      // Simulation d'une réponse (à remplacer par l'appel réel à Mistral)
      const response = await this.generateResponse(prompt, input);
      
      const processingTime = Date.now() - startTime;
      
      return {
        response,
        confidence: 0.85, // À calculer basé sur la réponse réelle
        shouldFollowUp: this.shouldAskFollowUp(input.message),
        metadata: {
          model: 'mistral-large-latest',
          processingTime,
        },
      };
    } catch (error) {
      console.error('Erreur lors du traitement avec Mistral:', error);
      
      return {
        response: 'Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre question ?',
        confidence: 0,
        shouldFollowUp: false,
        metadata: {
          model: 'mistral-large-latest',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Construit le prompt pour Mistral
   */
  private buildPrompt(input: z.infer<typeof this.inputSchema>): string {
    return `Message de l'utilisateur ${input.userId} : "${input.message}"

Context:
- Type de message: ${input.context.messageType}
- Nom d'utilisateur: ${input.context.userName || 'Inconnu'}
- Timestamp: ${input.context.timestamp}

Réponds de manière naturelle et utile en français.`;
  }

  /**
   * Génère une réponse en utilisant la vraie API Mistral
   */
  private async generateResponse(prompt: string, input: z.infer<typeof this.inputSchema>): Promise<string> {
    try {
      // Utiliser la méthode generate() intégrée de Mastra qui appelle l'API Mistral
      const result = await this.generateVNext([
        {
          role: 'system',
          content: prompt,
        },
        {
            role: 'user',
            content: input.message,
        }
      ]);

      // Extraire le texte de la réponse
      const response = result.text || 'Désolé, je n\'ai pas pu générer de réponse.';
      
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API Mistral:', error);
      
      // Fallback en cas d'erreur API
      return `Désolé, je rencontre une difficulté technique avec l'API Mistral. Votre message était : "${input.message}". Pouvez-vous réessayer ?`;
    }
  }

  /**
   * Détermine si une question de suivi serait appropriée
   */
  private shouldAskFollowUp(message: string): boolean {
    const shortMessage = message.length < 20;
    const isQuestion = message.includes('?');
    const isGreeting = /^(salut|bonjour|hello|hi|hey)/i.test(message);
    
    return !isGreeting && (shortMessage || !isQuestion);
  }
}