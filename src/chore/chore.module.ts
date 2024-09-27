import { Module } from '@nestjs/common';
import { ChoreController } from './controller/chore.controller';
import { ChoreService } from './service/chore.service';
import { ChoreRepository } from './repo/chore.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Chore, ChoreSchema } from './model/chore.schema';

@Module({
  controllers: [ChoreController],
  providers: [ChoreService, ChoreRepository],
  imports: [
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get<string>('MONGODB_URI'),
          user: config.get<string>('DATABASE_USER'),
          pass: config.get<string>('DATABASE_PASS'),
          dbName: config.get<string>('DATABASE_NAME'),
        };
      },
    }),
    MongooseModule.forFeature([{ name: Chore.name, schema: ChoreSchema }]),
  ],
})
export class ChoreModule {}
