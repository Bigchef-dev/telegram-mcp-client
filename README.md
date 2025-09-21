# Telegram MCP Client

Un client Telegram pour les opérations Model Context Protocol (MCP) construit avec NestJS.

## Prérequis

- Node.js (version 18 ou supérieure)
- pnpm
- Un bot Telegram (token obtenu via @BotFather)

## Installation

1. Clonez le repository :
```bash
git clone <repository-url>
cd telegram-mcp-client
```

2. Installez les dépendances :
```bash
pnpm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```

4. Éditez le fichier `.env` et ajoutez votre token de bot Telegram :
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

## Utilisation

### Développement
```bash
pnpm start:dev
```

### Production
```bash
pnpm build
pnpm start:prod
```

### Tests
```bash
pnpm test
pnpm test:watch
pnpm test:cov
```

## Fonctionnalités

- 🤖 Bot Telegram intégré
- 📱 Gestion des commandes de base (/start, /help, /status, /ping)
- 🔧 Structure modulaire avec NestJS
- 📝 Logging complet
- 🛡️ Gestion d'erreurs robuste
- 🔄 Arrêt gracieux

## Commandes du Bot

- `/start` - Démarre le bot
- `/help` - Affiche l'aide
- `/status` - Vérifie le statut du bot
- `/ping` - Test de connectivité

## Structure du Projet

```
src/
├── app.module.ts       # Module principal de l'application
├── app.service.ts      # Service principal
├── main.ts            # Point d'entrée de l'application
└── telegram/          # Module Telegram
    ├── telegram.module.ts
    └── telegram.service.ts
```

## Configuration

Le bot utilise les variables d'environnement suivantes :

- `TELEGRAM_BOT_TOKEN` - Token du bot Telegram (requis)
- `NODE_ENV` - Environnement d'exécution
- `LOG_LEVEL` - Niveau de logging

## Développement Futur

- [ ] Intégration MCP (Model Context Protocol)
- [ ] Commandes avancées pour les opérations MCP
- [ ] Interface utilisateur conversationnelle
- [ ] Gestion des sessions utilisateur
- [ ] Base de données pour la persistance

## Licence

MIT
