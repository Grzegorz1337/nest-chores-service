import * as mongoose from 'mongoose';
import { UUID } from 'crypto';
import { ChorePlace } from './chore-place.enum';
import { Person } from './person';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export class ChoreDto {
  id: UUID;
  creationDate: Date;
  expirationDate: Date;
  chorePlace: ChorePlace;
  choreDescription: string;
  orderedBy: Person;
  orderedFor: Person;
  completed: boolean;
}

export type ChoreDocument = HydratedDocument<Chore>;

@Schema()
export class Chore {
  @Prop()
  id: UUID;
  @Prop()
  creationDate: Date;
  @Prop()
  expirationDate: Date;
  @Prop()
  chorePlace: ChorePlace;
  @Prop()
  choreDescription: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Person' })
  orderedBy: Person;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Person' })
  orderedFor: Person;
  @Prop()
  completed: boolean;
}

export const CatSchema = SchemaFactory.createForClass(Chore);
