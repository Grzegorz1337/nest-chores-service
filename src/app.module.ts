import { Module } from '@nestjs/common';
import { ChoreModule } from './chore/chore.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [ChoreModule, ScheduleModule],
})
export class AppModule {}
