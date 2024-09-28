import { Module } from '@nestjs/common';
import { ChoreModule } from './chore/chore.module';
@Module({
  imports: [ChoreModule],
})
export class AppModule {}
