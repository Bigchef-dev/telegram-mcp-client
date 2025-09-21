# Agent Mistral AI - Documentation

## Vue d'ensemble

L'agent Mistral AI a été intégré avec succès dans le projet Telegram MCP Client. Cet agent utilise le modèle `mistral-large-latest` via le Vercel AI SDK pour fournir des réponses intelligentes et contextuelles aux utilisateurs de Telegram.

## Architecture

### Structure de fichiers
```
src/mastra/
├── agents/
│   ├── index.ts              # Export de l'agent Mistral
│   └── mistral.agent.ts      # Agent Mistral principal
├── index.ts                  # MastraService avec intégration Mistral
└── mastra.module.ts          # Module NestJS

src/telegram/handlers/commands/
└── mistral.handler.ts        # Commande /mistral pour tests
```

## Fonctionnalités implémentées

### 1. Classe MistralAgent

**Fichier :** `src/mastra/agents/mistral.agent.ts`

```typescript
export class MistralAgent extends Agent {
  // Configuration avec mistral-large-latest
  // Instructions en français
  // Schémas de validation avec Zod
  // Traitement intelligent des messages
}
```

**Caractéristiques :**
- ✅ **Modèle :** `mistral-large-latest` via Vercel AI SDK
- ✅ **Langue :** Français de préférence
- ✅ **Validation :** Schémas Zod pour entrées/sorties
- ✅ **Gestion d'erreurs :** Fallback automatique
- ✅ **Métadonnées :** Tracking des performances

### 2. Intégration dans MastraService

**Fonctionnalités :**
- Traitement automatique des messages texte via Mistral
- Fallback en cas d'erreur de l'agent
- Métadonnées enrichies avec informations Mistral
- Test direct de l'agent

### 3. Commande /mistral

**Utilisation :**
```
/mistral
```

**Fonctionnalités :**
- Test direct de l'agent Mistral
- Affichage des métriques (confiance, temps de traitement)
- Instructions d'utilisation
- Statut de l'agent

## Configuration

### Variables d'environnement

Ajoutez dans votre fichier `.env` :
```bash
# Mistral AI Configuration
MISTRAL_API_KEY=your_mistral_api_key_here
```

**Note :** Pour l'instant, l'agent fonctionne en mode simulation. Pour activer l'API Mistral réelle, vous devez :
1. Obtenir une clé API sur [console.mistral.ai](https://console.mistral.ai)
2. Configurer la variable d'environnement
3. Modifier l'agent pour utiliser l'API réelle

### Dépendances installées

```json
{
  "@ai-sdk/mistral": "latest",
  "@mastra/core": "^0.17.1",
  "zod": "^3.25.76"
}
```

## Utilisation

### 1. Messages texte automatiques

Tous les messages texte envoyés au bot sont automatiquement traités par l'agent Mistral :

**Exemple :**
```
Utilisateur: "Bonjour, comment allez-vous ?"
Bot: 🤖 Mistral AI Assistant

Bonjour ! Je suis un assistant alimenté par Mistral AI...
```

### 2. Test direct avec /mistral

```
/mistral
```

Retourne :
- Statut de l'agent
- Test avec message prédéfini
- Métriques de performance
- Instructions d'utilisation

### 3. Réponses enrichies

L'agent fournit :
- **Réponses contextuelles** adaptées au message
- **Métadonnées** (confiance, temps de traitement)
- **Actions suggérées** (typing, follow-up)
- **Gestion d'erreurs** avec fallback

## Schémas de données

### Entrée (Input Schema)
```typescript
{
  message: string;           // Message utilisateur
  userId: string;            // ID Telegram
  chatId: string;            // ID du chat
  context: {
    messageType: 'text' | 'command' | 'voice' | 'photo';
    userName?: string;       // Nom d'utilisateur
    timestamp: string;       // ISO timestamp
  }
}
```

### Sortie (Output Schema)
```typescript
{
  response: string;          // Réponse générée
  confidence: number;        // 0-1, niveau de confiance
  shouldFollowUp: boolean;   // Si une question de suivi est appropriée
  metadata: {
    model: string;           // 'mistral-large-latest'
    tokensUsed?: number;     // Tokens API (si disponible)
    processingTime: number;  // Temps en millisecondes
  }
}
```

## Mode simulation actuel

**Important :** L'agent fonctionne actuellement en **mode simulation** pour permettre les tests sans clé API.

### Fonctionnalités simulées :
- ✅ Réponses variées et contextuelles
- ✅ Délai réaliste (500-1500ms)
- ✅ Métadonnées de performance
- ✅ Gestion d'erreurs
- ✅ Détection de questions de suivi

### Pour activer l'API réelle :

1. **Modifier `generateResponse()` dans `mistral.agent.ts` :**
```typescript
private async generateResponse(prompt: string, input: any): Promise<string> {
  // Remplacer la simulation par un appel réel :
  const result = await this.agent.run(prompt);
  return result.text;
}
```

2. **Configurer la clé API :**
```typescript
model: mistral('mistral-large-latest', {
  apiKey: process.env.MISTRAL_API_KEY,
}),
```

## Commandes disponibles

| Commande | Description | Agent |
|----------|-------------|-------|
| `/start` | Accueil | ❌ |
| `/help` | Aide | ❌ |
| `/status` | Statut bot | ❌ |
| `/ping` | Test connectivité | ❌ |
| `/mastra` | Test Mastra | ✅ |
| `/mistral` | **Test agent Mistral** | ✅ |
| Messages texte | **Traitement Mistral** | ✅ |

## Debug et développement

### Points d'arrêt utiles

- `MistralAgent.processUserMessage()` - Traitement principal
- `MastraService.processMessage()` - Intégration service
- `MistralCommandHandler.execute()` - Commande de test

### Logs disponibles

```typescript
// Dans MastraService
console.error('Erreur lors du traitement avec Mistral:', error);

// Dans les handlers Telegram
this.logger.log('Mastra processed message:', metadata);
```

### Tests recommandés

1. **Test de base :** `/mistral`
2. **Messages variés :** Courts, longs, questions, affirmations
3. **Gestion d'erreurs :** Simulation de pannes
4. **Performance :** Messages simultanés

## Prochaines étapes

### Développement immédiat
- [ ] Activation de l'API Mistral réelle
- [ ] Configuration via variables d'environnement
- [ ] Métriques d'utilisation détaillées
- [ ] Cache des réponses pour performance

### Fonctionnalités avancées
- [ ] Support multimodal (images, voix)
- [ ] Mémoire de conversation
- [ ] Personnalisation par utilisateur
- [ ] Intégration avec des outils externes

### Monitoring et optimisation
- [ ] Logs structurés avec Pino
- [ ] Métriques de performance
- [ ] Alertes sur erreurs
- [ ] Dashboard de monitoring

L'agent Mistral AI est maintenant prêt pour une utilisation en développement et peut être facilement configuré pour la production avec une vraie clé API !