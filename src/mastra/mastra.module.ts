import { Module } from '@nestjs/common';
import { MemoryModule } from '../memory/memory.module';

import workflows from './workflows';
import agents from './agents';
import { MCPTelegramClient } from './mcp.client';

@Module({
  imports: [MemoryModule],
  providers: [
    MCPTelegramClient,
    ...workflows,
    ...agents
  ],
  exports: [
        ...workflows
  ],
})
export class MastraModule {}