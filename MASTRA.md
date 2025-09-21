### MastraAI Typescript: Une mini-documentation

Cette documentation a pour but de fournir un aperçu des fonctionnalités clés du framework **MastraAI** en TypeScript, en se concentrant sur les points que vous avez soulevés : l'utilisation de fournisseurs personnalisés (comme Mistral), le support de la multimodalité et l'intégration de serveurs externes via le protocole MCP.

-----

### 1\. Fournisseurs Personnalisés et Modèles Multimodaux

MastraAI utilise le **Vercel AI SDK** comme couche d'abstraction pour interagir avec les modèles d'IA. Cette approche modulaire facilite l'intégration de n'importe quel LLM compatible.

#### **Comment intégrer un modèle comme Mistral ?**

Il existe plusieurs méthodes pour utiliser un modèle Mistral avec MastraAI :

1.  **Utiliser un fournisseur compatible OpenAI :** Si votre service MistralAI expose une API compatible avec celle d'OpenAI, vous pouvez utiliser le fournisseur `@ai-sdk/mistral`. C'est la méthode la plus simple pour connecter des services externes.

2.  **Créer un fournisseur personnalisé :** Pour un contrôle total, vous pouvez créer votre propre fournisseur en utilisant l'interface `customProvider` du Vercel AI SDK. Cela vous permet d'utiliser n'importe quel SDK (comme le client officiel de MistralAI) et de l'envelopper dans un objet compatible avec MastraAI.

3.  **Support de la Multimodalité :** MastraAI prend en charge la multimodalité, c'est-à-dire la capacité d'un agent à traiter plusieurs types de données, comme du texte et des images. La documentation officielle fournit un exemple clair de la façon dont un agent peut gérer une image passée comme `URL` ou `Base64` dans un `prompt`.

<!-- end list -->

```typescript
import { createAgent, createTool } from '@mastra-ai/core';
import { generate } from '@ai-sdk/openai';

const myAgent = createAgent({
  tools: [
    // Vos outils personnalisés ici
  ],
  model: generate({
    model: 'gpt-4o-mini', // Ou votre modèle multimodal compatible
    // Autres paramètres
  }),
});

async function runMultimodalAgent() {
  const result = await myAgent.run('Décris cette image et dis-moi ce qui est écrit.', {
    image: 'https://example.com/image.jpg', // URL de l'image
  });
  console.log(result);
}
```

-----

### 2\. Appel de serveurs externes (MCP)

Le **Mastra Control Plane (MCP)** est un protocole de communication multi-agents qui permet à des agents MastraAI d'interagir avec des serveurs externes. C'est la solution native pour décharger des tâches vers des microservices ou des agents dédiés.

#### **Configuration d'un client et d'un serveur MCP**

Le framework fournit un **`MCPClient`** pour vos agents et un **`MCPServer`** pour le service distant.

1.  **Côté Client (votre agent) :** Vous configurez un `MCPClient` en spécifiant l'adresse du serveur externe.

    ```typescript
    import { createAgent, createTool, createToolClient } from '@mastra-ai/core';
    import { MCPClient } from '@mastra-ai/mcp';

    const mcpClient = new MCPClient({
      serverUrl: 'http://localhost:3000', // URL de votre serveur MCP
    });

    const myAgent = createAgent({
      tools: [
        createToolClient({
          toolId: 'tool-server', // ID du serveur distant
          client: mcpClient,
        }),
      ],
      // Autres configurations...
    });
    ```