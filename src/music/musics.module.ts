import { Module } from '@nestjs/common';

import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';

@Module({
  controllers: [MusicsController],
  providers: [MusicsService],
  exports: [MusicsService],
})
export class MusicsModule {}
