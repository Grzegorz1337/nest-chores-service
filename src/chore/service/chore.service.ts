import { randomUUID, UUID } from 'crypto';
import { ChoreDto } from '../model/chore.dto';
import { Injectable } from '@nestjs/common';
import { ChoreRepository } from './chore.repository';
import { Chore } from '../model/chore.schema';

@Injectable()
export class ChoreService {
  readonly MAX_CHORE_DURATION_IN_DAYS: number = 30;

  constructor(private readonly choreRepository: ChoreRepository) {}

  getAllChores(): Promise<ChoreDto[]> {
    return this.choreRepository.findAll();
  }

  getActiveChores(): Promise<ChoreDto[]> {
    return this.choreRepository.findActive();
  }

  async completeChore(choreId: UUID): Promise<ChoreDto> {
    const updatedChore: Chore = await this.choreRepository.findById(choreId);

    if (updatedChore.completed) {
      throw Error(
        'Chore ' + updatedChore.choreDescription + ' is already completed.',
      );
    }

    updatedChore.completed = true;
    if (this.choreRepository.update(updatedChore)) {
      return updatedChore;
    }

    throw Error('Unable to complete chore');
  }

  async createChore(newChore: ChoreDto): Promise<ChoreDto> {
    newChore.id = randomUUID();
    newChore.creationDate = new Date();
    newChore.expirationDate = new Date();
    newChore.expirationDate.setDate(
      new Date().getDate() + this.MAX_CHORE_DURATION_IN_DAYS,
    );
    newChore.completed = false;

    return await this.choreRepository.save(newChore);
  }

  async deleteChoreById(choreId: UUID): Promise<ChoreDto> {
    const removedChore: ChoreDto = await this.choreRepository.findById(choreId);

    if (!this.choreRepository.delete(removedChore.id)) {
      throw Error('There was an error while trying to delete chore ' + choreId);
    }

    return removedChore;
  }
}
