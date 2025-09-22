import { Module } from '@nestjs/common';
import { MastraService } from '../mastra';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [MemoryModule],
  providers: [
    MastraService,
    {
      provide: 'MASTRA_SERVICE',
      useFactory: () => {
        return new MastraService();
      },
    },
  ],
  exports: [MastraService, 'MASTRA_SERVICE'],
})
export class MastraModule {}