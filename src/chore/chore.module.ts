import { Module } from '@nestjs/common';
import { ChoreController } from './controller/chore.controller';
import { ChoreService } from './service/chore.service';

@Module({
  controllers: [ChoreController],
  providers: [ChoreService],
})
export class ChoreModule {}
