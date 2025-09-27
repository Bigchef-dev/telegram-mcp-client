import { MCPClient } from "@mastra/mcp";
import { Injectable } from "@nestjs/common";
 
@Injectable()
export class MCPTelegramClient extends MCPClient {
  constructor() {
    super({
      id: "telegram-mcp-client",
      servers: {
        telegram: {
          url: new URL("http://localhost:3001/mcp/"),
        },
      },
    });
  }
}