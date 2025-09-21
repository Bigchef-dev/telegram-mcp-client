# Intégration Mastra dans le Telegram MCP Client

## Vue d'ensemble

Mastra a été intégré avec succès dans le projet Telegram MCP Client. Cette intégration permet d'utiliser les capacités de Mastra pour le traitement intelligent des messages Telegram et l'orchestration d'agents IA.

## Structure ajoutée

```
src/mastra/
├── index.ts                    # Configuration principale Mastra et MastraService
├── mastra.module.ts           # Module NestJS pour l'injection de dépendances
├── agents/                    # Dossier pour les agents IA (à développer)
│   └── index.ts
├── tools/                     # Dossier pour les outils personnalisés (à développer)
│   └── index.ts
└── workflows/                 # Dossier pour les workflows (à développer)
    ├── index.ts
    └── message-processing.workflow.ts
```

## Fonctionnalités implémentées

### 1. Service Mastra (`MastraService`)

Le service principal qui encapsule les fonctionnalités Mastra :

```typescript
class MastraService {
  async processMessage(input: {
    message: string;
    userId: string;
    chatId: string;
    messageType: 'text' | 'command' | 'voice' | 'photo';
  }): Promise<{
    response: string;
    action?: 'reply' | 'typing' | 'forward';
    metadata?: Record<string, any>;
  }>

  async getStatus(): Promise<{
    status: string;
    timestamp: string;
    version: string;
  }>
}
```

### 2. Intégration NestJS

- **Module Mastra** : `MastraModule` pour l'injection de dépendances
- **Injection dans TelegramModule** : Le service Mastra est disponible dans tous les handlers Telegram
- **Handler de message mis à jour** : `TextEventHandler` utilise maintenant Mastra pour traiter les messages

### 3. Nouvelle commande `/mastra`

Commande de test pour vérifier l'intégration :
- Affiche le statut du service Mastra
- Montre la version et les fonctionnalités disponibles
- Explique la structure du projet

## Utilisation

### Test de l'intégration

1. **Commande de test** :
   ```
   /mastra
   ```
   Affiche les informations sur l'intégration Mastra

2. **Test de traitement de message** :
   Envoyez n'importe quel message texte au bot. Il sera traité par Mastra et vous recevrez une réponse formatée avec les métadonnées.

### Réponses de Mastra

Quand vous envoyez un message texte, Mastra répond avec :
- Le message original
- L'ID utilisateur et chat
- Le type de message
- Métadonnées de traitement (timestamp, version, etc.)
- Informations sur les fonctionnalités futures

## Configuration

### Variables d'environnement

Aucune variable supplémentaire requise pour l'instant. Mastra utilise la configuration par défaut.

### Dépendances ajoutées

```json
{
  "@mastra/core": "^0.17.1",
  "zod": "^3.25.76"
}
```

## Développement futur

### 1. Agents IA

**Emplacement** : `src/mastra/agents/`

Créer des agents spécialisés pour :
- Réponse aux questions
- Analyse de contenu
- Génération de texte
- Traduction

**Exemple d'agent à implémenter** :
```typescript
// src/mastra/agents/telegram-assistant.agent.ts
export class TelegramAssistantAgent extends Agent {
  // Configuration avec model IA
  // Instructions spécialisées
  // Outils disponibles
}
```

### 2. Outils personnalisés

**Emplacement** : `src/mastra/tools/`

Outils possibles :
- Intégration APIs externes
- Traitement d'images
- Recherche web
- Base de données

**Exemple d'outil** :
```typescript
// src/mastra/tools/web-search.tool.ts
export class WebSearchTool extends Tool {
  // Recherche web via API
  // Formatage des résultats
}
```

### 3. Workflows

**Emplacement** : `src/mastra/workflows/`

Workflows pour :
- Traitement multi-étapes de messages
- Pipelines de données
- Orchestration d'agents

### 4. Configuration avancée

- **Variables d'environnement** pour configuration Mastra
- **Intégration base de données** pour persistance
- **APIs externes** (OpenAI, Anthropic, etc.)
- **Logging avancé** avec Mastra

## Debug et développement

### Configuration VS Code

Les configurations de debug existantes fonctionnent avec Mastra :
- Points d'arrêt dans `MastraService`
- Debug des handlers utilisant Mastra
- Inspection des réponses et métadonnées

### Tests

Ajouter des tests pour :
```typescript
// Tests unitaires pour MastraService
describe('MastraService', () => {
  it('should process text messages', async () => {
    // Test du traitement de message
  });
});
```

## Commandes disponibles

| Commande | Description | Mastra |
|----------|-------------|---------|
| `/start` | Accueil | ❌ |
| `/help` | Aide | ❌ |
| `/status` | Statut bot | ❌ |
| `/ping` | Test connectivité | ❌ |
| `/mastra` | **Test Mastra** | ✅ |
| Messages texte | **Traitement Mastra** | ✅ |

## Prochaines étapes recommandées

1. **Configurer un model IA** (OpenAI, Anthropic)
2. **Créer le premier agent** pour réponses intelligentes
3. **Ajouter des outils** pour fonctionnalités spécifiques
4. **Implémenter des workflows** pour cas d'usage complexes
5. **Ajouter la persistance** avec base de données

L'intégration Mastra est maintenant prête pour le développement de fonctionnalités IA avancées dans votre bot Telegram !