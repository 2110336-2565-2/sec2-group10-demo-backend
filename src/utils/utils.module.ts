import { Module } from '@nestjs/common';

import { UtilsService } from './utils.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
