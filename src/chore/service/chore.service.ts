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
    const results: ChoreDto[] = await this.choreRepository.findAll();

    if (results.length === 0) {
      throw new HttpException('No entity found', HttpStatus.NOT_FOUND);
    }

    return results;
  }

  async getChoreById(id: UUID): Promise<ChoreDto> {
    const result: Chore = await this.choreRepository.findById(id);

    if (result === null || result === undefined) {
      throw new HttpException('No entity found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async getActiveChores(): Promise<ChoreDto[]> {
    const results: ChoreDto[] = await this.choreRepository.findActive();

    if (results.length === 0) {
      throw new HttpException('No entity found', HttpStatus.NOT_FOUND);
    }

    return results;
  }

  async completeChore(choreId: UUID): Promise<ChoreDto> {
    const updatedChore: Chore = await this.choreRepository.findById(choreId);

    if (updatedChore.completed) {
      throw new HttpException('Cannot complete chore', HttpStatus.BAD_REQUEST);
    }

    updatedChore.completed = true;
    const valueUpdated: boolean =
      await this.choreRepository.update(updatedChore);

    if (!valueUpdated) {
      // TODO: Add error handling for repo write denial
      throw new HttpException(
        'Cannot complete chore, fix repo update',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
    return updatedChore;
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

    // TODO: Same as above make it more pleasant to look
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
