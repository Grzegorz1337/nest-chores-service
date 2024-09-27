import { Controller, Get, Patch, Post, Body, Query } from '@nestjs/common';
import { ChoreService } from '../service/chore.service';
import { ChoreDto } from '../model/chore.dto';
import { UUID } from 'crypto';

@Controller('/chores')
export class ChoreController {
  constructor(private choreService: ChoreService) {}

  @Get()
  getAllChores(): ChoreDto[] {
    return this.choreService.getAllChores();
  }

  @Get('/active')
  getActiveChores(): ChoreDto[] {
    return this.choreService.getActiveChores();
  }

  @Post()
  createChore(@Body() newChore: ChoreDto): ChoreDto {
    return this.choreService.createChore(newChore);
  }

  @Patch()
  completeChore(@Query() choreId: UUID): ChoreDto {
    return this.choreService.completeChore(choreId);
  }
}
