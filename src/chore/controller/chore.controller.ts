import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ChoreService } from '../service/chore.service';
import { ChoreDto } from '../model/chore.dto';
import { UUID } from 'crypto';
import { RestInterceptor } from 'src/logging/interceptor/rest.interceptor';

@Controller('/chores')
@UseInterceptors(RestInterceptor)
export class ChoreController {
  constructor(private choreService: ChoreService) {}

  @Get()
  async getAllChores(): Promise<ChoreDto[]> {
    return this.choreService.getAllChores();
  }

  @Get('/active')
  async getActiveChores(): Promise<ChoreDto[]> {
    return this.choreService.getActiveChores();
  }

  @Post()
  async createChore(@Body() newChore: ChoreDto): Promise<ChoreDto> {
    return this.choreService.createChore(newChore);
  }

  @Patch()
  async completeChore(@Query() choreId: UUID): Promise<ChoreDto> {
    return this.choreService.completeChore(choreId);
  }
}
