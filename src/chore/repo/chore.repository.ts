import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chore, ChoreDocument } from '../model/chore.schema';
import { Model } from 'mongoose';
import { UUID } from 'crypto';
import { ChoreDto } from '../model/chore.dto';

@Injectable()
export class ChoreRepository {
  constructor(
    @InjectModel(Chore.name) private choreModel: Model<ChoreDocument>,
  ) {}

  async findAll(): Promise<Chore[]> {
    return this.choreModel.find().exec();
  }

  async findActive(): Promise<Chore[]> {
    return this.choreModel.find({
      completed: false,
      expirationDate: { $lte: new Date() },
    });
  }

  async findById(requestedId: UUID): Promise<Chore> {
    return await this.choreModel.findOne({ id: requestedId });
  }

  async update(updatedChore: ChoreDto): Promise<boolean> {
    const result = await this.choreModel.updateOne(
      { id: updatedChore.id },
      { $set: { completed: updatedChore.completed } },
    );
    return result.modifiedCount > 0;
  }

  async save(newChore: ChoreDto): Promise<Chore> {
    return new this.choreModel(newChore).save();
  }

  async delete(choreId: UUID): Promise<boolean> {
    return (await this.choreModel.deleteOne({ id: choreId })).acknowledged;
  }
}
