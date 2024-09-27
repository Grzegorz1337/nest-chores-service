import { randomUUID } from 'crypto';
import { ChoreDto } from '../model/chore.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChoreService {
  readonly MAX_CHORE_DURATION_IN_DAYS: number = 30;

  getAllChores(): ChoreDto[] {
    throw new Error('Method not implemented.');
  }

  getActiveChores(): ChoreDto[] {
    throw new Error('Method not implemented');
  }

  completeChore(choreId: UUID): ChoreDto {
    let updatedChore = new ChoreDto();
    updatedChore.id = choreId;

    // TODO: Add query
  }

  createChore(newChore: ChoreDto) {
    newChore.id = randomUUID();
    newChore.creationDate = new Date();
    newChore.expirationDate = new Date();
    newChore.expirationDate.setDate(
      new Date().getDate() + this.MAX_CHORE_DURATION_IN_DAYS,
    );
    newChore.completed = false;

    // TODO: Save in repo

    return newChore;
  }
}
