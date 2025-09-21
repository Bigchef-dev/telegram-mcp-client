import { Module } from '@nestjs/common';
import { MastraService } from '../mastra';

@Module({
  providers: [
    {
      provide: 'MASTRA_SERVICE',
      useFactory: () => {
        return new MastraService();
      },
    },
  ],
  exports: ['MASTRA_SERVICE'],
})
export class MastraModule {}