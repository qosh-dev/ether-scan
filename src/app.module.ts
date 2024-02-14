import { Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleBase } from '@nestjs/config';
import { ConfigService } from './config.service';
import { WatcherService } from './watcher.service';

@Module({
  imports: [ConfigModuleBase.forRoot({ isGlobal: true })],
  providers: [ConfigService, WatcherService],
})
export class AppModule {}
