import { Module } from '@nestjs/common';
import { UserMemoryService } from './user-memory.service';

@Module({
  providers: [UserMemoryService],
  exports: [UserMemoryService],
})
export class MemoryModule {}