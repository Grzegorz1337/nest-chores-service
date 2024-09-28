import { randomUUID, UUID } from 'crypto';
import { ChoreDto } from '../model/chore.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChoreRepository } from '../repo/chore.repository';
import { Chore } from '../model/chore.schema';

@Injectable()
export class ChoreService {
  readonly MAX_CHORE_DURATION_IN_DAYS: number = 30;

  constructor(private readonly choreRepository: ChoreRepository) {}

  async getAllChores(): Promise<ChoreDto[]> {
    return await this.choreRepository.findAll();
  }

  async getActiveChores(): Promise<ChoreDto[]> {
    return await this.choreRepository.findActive();
  }

  async completeChore(choreId: UUID): Promise<ChoreDto> {
    const updatedChore: Chore = await this.choreRepository.findById(choreId);

    if (updatedChore.completed) {
      throw Error(
        'Chore ' + updatedChore.choreDescription + ' is already completed.',
      );
    }

    updatedChore.completed = true;
    if (await this.choreRepository.update(updatedChore)) {
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

    if (removedChore === null) {
      throw new HttpException('Unable to delete chore.', HttpStatus.NOT_FOUND, {
        cause: new Error('Selected chore does not exist.'),
      });
    }

    if (!this.choreRepository.delete(removedChore.id)) {
      throw new HttpException(
        'Unable to delete chore.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: new Error('Database remove operation failed.') },
      );
    }

    return removedChore;
  }
}
