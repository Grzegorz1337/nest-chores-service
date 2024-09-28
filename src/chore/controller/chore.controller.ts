import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseInterceptors,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ChoreService } from '../service/chore.service';
import { ChoreDto } from '../model/chore.dto';
import { UUID } from 'crypto';
import { RestInterceptor } from '../interceptor/rest.interceptor';

@Controller('/chores')
@UseInterceptors(RestInterceptor)
export class ChoreController {
  constructor(private choreService: ChoreService) {}

  @Get()
  async getAllChores(): Promise<ChoreDto[]> {
    return await this.choreService.getAllChores();
  }

  @Get('/:id')
  async getChoreById(@Param('id') id: UUID): Promise<ChoreDto> {
    return await this.choreService.getChoreById(id);
  }

  @Get('/active')
  async getActiveChores(): Promise<ChoreDto[]> {
    return await this.choreService.getActiveChores();
  }

  @Post()
  async createChore(@Body() newChore: ChoreDto): Promise<ChoreDto> {
    return await this.choreService.createChore(newChore);
  }

  @Patch('/:id')
  async completeChore(@Param('id') choreId: UUID): Promise<ChoreDto> {
    return await this.choreService.completeChore(choreId);
  }

  @Delete('/:id')
  async deleteChore(@Param('id') choreId: UUID): Promise<ChoreDto> {
    return await this.choreService.deleteChoreById(choreId);
  }
}
