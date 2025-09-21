# Telegram MCP Client - Documentation Claude

## Vue d'ensemble du projet

Ce projet est un **client Telegram pour les opérations Model Context Protocol (MCP)** construit avec **NestJS** et **TypeScript**. Il s'agit d'une application bot Telegram (pas de serveur HTTP) qui permettra d'interagir avec des serveurs MCP via Telegram.

## Architecture actuelle

### Structure des fichiers
```
telegram-mcp-client/
├── src/
│   ├── app.module.ts           # Module principal NestJS
│   ├── app.service.ts          # Service principal de l'application
│   ├── main.ts                 # Point d'entrée (createApplicationContext)
│   └── telegram/
│       ├── telegram.module.ts  # Module Telegram
│       ├── telegram.service.ts # Service bot Telegram avec Telegraf
│       ├── telegram.service.spec.ts # Tests unitaires
│       └── handlers/           # Architecture handlers
│           ├── commands/       # Handlers de commandes
│           │   ├── base/
│           │   │   ├── command.interface.ts      # Interface commandes
│           │   │   └── base-command.handler.ts   # Classe de base
│           │   ├── start.handler.ts    # Handler /start
│           │   ├── help.handler.ts     # Handler /help
│           │   ├── status.handler.ts   # Handler /status
│           │   └── ping.handler.ts     # Handler /ping
│           ├── events/         # Handlers d'événements
│           │   ├── event.interface.ts          # Interface événements
│           │   ├── base-event.handler.ts       # Classe de base
│           │   ├── message.handler.ts          # Handler messages
│           │   └── error.handler.ts            # Handler erreurs
│           ├── registry/       # Registres des handlers
│           │   ├── command.registry.ts         # Registre commandes
│           │   └── event.registry.ts           # Registre événements
│           └── index.ts        # Exports centralisés
├── test/
│   └── jest-e2e.json          # Configuration tests e2e
├── package.json                # Dépendances et scripts
├── tsconfig.json              # Configuration TypeScript
├── tsconfig.build.json        # Config TS pour le build
├── jest.config.js             # Configuration Jest
├── nest-cli.json              # Configuration NestJS CLI
├── .env.example               # Variables d'environnement exemple
├── .gitignore                 # Fichiers à ignorer
└── README.md                  # Documentation utilisateur
```

### Technologies utilisées

**Core Framework:**
- NestJS 11.1.6 (sans serveur HTTP, utilise createApplicationContext)
- TypeScript 5.9.2
- Node.js avec pnpm

**Bot Telegram:**
- Telegraf 4.16.3 (bibliothèque bot Telegram)
- @telegraf/types 9.0.0
- Architecture handlers modulaire pour les commandes et événements

**Logging actuel:**
- Logger NestJS natif (`@nestjs/common`)
- Utilisé dans TelegramService et AppService

**Outils de développement:**
- Jest + ts-jest pour les tests
- ESLint + Prettier (configurés mais packages pas encore installés)
- pnpm comme gestionnaire de paquets

## Architecture des Handlers Telegram (NOUVEAU)

### Principe de fonctionnement

L'architecture Telegram utilise maintenant un **système de handlers modulaire** :

- **Commandes** : Chaque commande (`/start`, `/help`, etc.) a son propre handler
- **Événements** : Les messages texte et erreurs sont gérés par des handlers dédiés
- **Registres** : Systèmes pour enregistrer et récupérer dynamiquement les handlers
- **Injection de dépendances** : Utilisation complète du système DI de NestJS

### Structure des handlers

```typescript
// Interface de base pour les commandes
interface ICommandHandler {
  getCommandName(): string;
  getDescription(): string;
  execute(ctx: Context): Promise<void>;
}

// Interface de base pour les événements
interface IEventHandler {
  getEventType(): string;
  handle(ctx: Context, error?: Error): Promise<void>;
}
```

### Exemple d'ajout d'une nouvelle commande

```typescript
@Injectable()
export class InfoCommandHandler extends BaseCommandHandler {
  protected metadata: CommandMetadata = {
    name: 'info',
    description: 'Affiche les informations du bot'
  };

  async execute(ctx: Context): Promise<void> {
    await ctx.reply('Bot MCP Telegram v1.0');
  }
}
```

## État actuel du logging

Le système de logging utilise actuellement le **Logger NestJS natif** :

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  
  // Utilisation :
  this.logger.log('message');
  this.logger.error('error', error);
}
```

**Emplacements du logging :**
- `src/telegram/telegram.service.ts` (service principal refactorisé)
- `src/telegram/handlers/` (tous les handlers utilisent le Logger NestJS)
- `src/app.service.ts` (ligne 1, 4, et utilisation)

## Configuration

### Variables d'environnement (.env.example)
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
NODE_ENV=development
LOG_LEVEL=debug
```

### Commandes bot Telegram implémentées
- `/start` - Accueil (StartCommandHandler)
- `/help` - Aide (HelpCommandHandler)
- `/status` - Statut du bot (StatusCommandHandler)
- `/ping` - Test de connectivité (PingCommandHandler)
- Gestion des messages texte génériques (MessageEventHandler)
- Gestion d'erreurs (ErrorEventHandler)

## Scripts disponibles

```json
{
  "build": "nest build",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage"
}
```

## Prochaines étapes identifiées

### Logging (demande actuelle)
- [ ] Remplacer Logger NestJS par Pino
- [ ] Installer : `pino`, `nestjs-pino`, `pino-pretty`
- [ ] Configurer Pino dans app.module.ts
- [ ] Migrer les services vers injection Pino

### Fonctionnalités futures
- [ ] Intégration MCP (Model Context Protocol)
- [ ] Commandes avancées MCP via Telegram
- [ ] Gestion des sessions utilisateur
- [ ] Base de données pour la persistance
- [ ] Tests d'intégration

## Notes techniques importantes

1. **Pas de serveur HTTP** : L'application utilise `NestFactory.createApplicationContext()` au lieu de `create()` car c'est un client bot, pas un serveur web.

2. **Gestion gracieuse** : L'application gère les signaux SIGINT/SIGTERM pour un arrêt propre du bot.

3. **Tests** : Structure de tests configurée avec Jest et ts-jest, tests unitaires basiques en place.

4. **Architecture modulaire** : Séparation claire entre le module principal et le module Telegram pour faciliter l'extension future.

5. **Handlers modulaires** : Chaque commande et événement Telegram est géré par un handler dédié, facilitant la maintenance et l'extension.

## Commandes utiles pour Claude

```bash
# Installation des dépendances
pnpm install

# Build du projet
pnpm build

# Tests
pnpm test

# Développement
pnpm start:dev

# Vérification des erreurs de compilation
pnpm build
```
