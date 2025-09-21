import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { MastraModule } from './mastra/mastra.module';

@Module({
  imports: [TelegramModule, MastraModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}