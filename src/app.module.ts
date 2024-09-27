import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChoreModule } from './chore/chore.module';
import { ScheduleModule } from './schedule/schedule.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ChoreModule, ScheduleModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
