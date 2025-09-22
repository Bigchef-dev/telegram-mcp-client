# Système de Mémoire Telegram Bot - Documentation

## 🧠 Vue d'ensemble

Le bot Telegram intègre maintenant un système de **mémoire persistante** utilisant Mastra Memory avec LibSQL pour stocker et récupérer les conversations utilisateur.

## 🏗️ Architecture

### Composants principaux

1. **Agent Mistral avec Mémoire Intégrée**
   - Utilise `@mastra/memory` avec `LibSQLStore`
   - Configuration automatique de la persistance
   - Thread unique par utilisateur/chat

2. **Commandes de Gestion**
   - `/memory` - Informations sur la mémoire
   - `/clear_memory` - Demande d'effacement
   - `/confirm_clear` - Confirmation d'effacement

3. **Base de Données**
   - Fichier SQLite : `telegram_bot_memory.db`
   - Stockage local automatique
   - Pas de configuration supplémentaire requise

## 🚀 Fonctionnalités

### Mémoire Conversationnelle
- **Historique** : 5 derniers messages conservés
- **Recherche sémantique** : 3 messages pertinents récupérés
- **Portée** : 10 derniers messages pour la recherche
- **Mémoire de travail** : Informations utilisateur persistantes

### Configuration Automatique
```typescript
memory: new Memory({
  storage: new LibSQLStore({ url: 'file:telegram_bot_memory.db' }),
  options: {
    lastMessages: 5,
    semanticRecall: { 
      topK: 3,
      messageRange: 10
    },
    workingMemory: { enabled: true }
  }
})
```

### Identifiants Uniques
- **Thread ID** : `${userId}-${chatId}`
- **Resource ID** : `${userId}`
- Isolation complète entre utilisateurs

## 📋 Commandes Disponibles

### `/memory`
Affiche les informations sur la mémoire de conversation :
- ID utilisateur et chat
- État de la mémoire
- Fonctionnalités activées
- Commandes disponibles

### `/clear_memory`
Demande de confirmation pour effacer l'historique :
- Message d'avertissement
- Instructions pour confirmer
- Impact expliqué

### `/confirm_clear`
Confirme et effectue l'effacement :
- Suppression de l'historique
- Réinitialisation du contexte
- Confirmation de l'action

## 🔧 Intégration Technique

### Dans l'Agent Mistral
```typescript
const result = await this.generate(
  input.message,
  {
    memory: {
      thread: `${input.userId}-${input.chatId}`,
      resource: input.userId,
    }
  }
);
```

### Métadonnées Enrichies
```typescript
metadata: {
  memoryEnabled: true,
  threadId: `${input.userId}-${input.chatId}`,
  confidence: mistralResponse.confidence,
  tokensUsed: result.usage?.totalTokens
}
```

## 📊 Avantages

### Pour les Utilisateurs
- **Continuité** : Le bot se souvient des conversations précédentes
- **Contextuel** : Réponses adaptées à l'historique
- **Contrôle** : Possibilité d'effacer la mémoire
- **Transparence** : Informations sur le stockage

### Pour les Développeurs
- **Automatique** : Pas de gestion manuelle de la persistance
- **Performant** : Recherche sémantique optimisée
- **Scalable** : Base SQLite pour production
- **Configurable** : Paramètres ajustables

## 🔒 Confidentialité

### Stockage Local
- Fichiers SQLite locaux uniquement
- Pas de cloud ou services externes
- Contrôle total sur les données

### Isolation Utilisateurs
- Thread séparés par utilisateur/chat
- Pas de fuite de données entre utilisateurs
- Effacement individuel possible

## 🧪 Tests Recommandés

### Test de Base
1. Envoyer un message au bot
2. Vérifier la réponse contextuelle
3. Envoyer un message de suivi
4. Confirmer la continuité

### Test de Persistance
1. Redémarrer le bot
2. Envoyer un message
3. Vérifier que l'historique est conservé

### Test de Gestion
1. Utiliser `/memory` pour voir l'état
2. Utiliser `/clear_memory` puis `/confirm_clear`
3. Vérifier l'effacement effectif

## 📁 Structure de Fichiers

```
src/
├── mastra/
│   ├── agents/
│   │   └── mistral.agent.ts      # Agent avec mémoire intégrée
│   └── index.ts                  # MastraService avec métadonnées
├── telegram/
│   └── handlers/
│       └── commands/
│           ├── memory.handler.ts           # /memory
│           ├── clear-memory.handler.ts     # /clear_memory
│           └── confirm-clear.handler.ts    # /confirm_clear
└── memory/                       # Types et interfaces (pour référence)
    ├── types/
    │   └── memory.types.ts
    └── interfaces/
        └── memory.interface.ts
```

## 🚀 Déploiement

### Variables d'Environnement
Aucune variable supplémentaire requise. La base de données est créée automatiquement.

### Fichiers Générés
- `telegram_bot_memory.db` - Base de données principale
- `telegram_bot_memory.db-shm` - Fichier de mémoire partagée
- `telegram_bot_memory.db-wal` - Write-Ahead Log

### Sauvegarde
Sauvegarder le fichier `telegram_bot_memory.db` pour conserver l'historique.

## 🔮 Évolutions Futures

### Fonctionnalités Avancées
- [ ] Export/Import de l'historique
- [ ] Statistiques utilisateur détaillées
- [ ] Compression automatique des anciens messages
- [ ] Mémoire premium avec plus de contexte

### Optimisations
- [ ] Cache en mémoire pour les accès fréquents
- [ ] Nettoyage automatique des vieilles données
- [ ] Monitoring de performance
- [ ] Métriques d'utilisation

Le système de mémoire est maintenant **opérationnel** et **prêt pour la production** ! 🎉