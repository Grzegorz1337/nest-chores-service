import { Module } from '@nestjs/common';
import { ChoreController } from './controller/chore.controller';
import { ChoreService } from './service/chore.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ChoreController],
  providers: [ChoreService],
  imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
})
export class ChoreModule {}
