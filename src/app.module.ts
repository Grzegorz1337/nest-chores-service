import { Module } from '@nestjs/common';
import { ChoreModule } from './chore/chore.module';
import { ScheduleModule } from './schedule/schedule.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ChoreModule, ScheduleModule, HealthModule],
})
export class AppModule {}
