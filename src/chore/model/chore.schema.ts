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
  @Prop({
    type: Object,
    required: true,
    get: (data: any) => new Person(data.name, data.surname),
    set: (person: Person) => ({ name: person.name, surname: person.surname }),
  })
  orderedBy: Person;
  @Prop({
    type: Object,
    required: true,
    get: (data: any) => new Person(data.name, data.surname),
    set: (person: Person) => ({ name: person.name, surname: person.surname }),
  })
  orderedFor: Person;
  @Prop()
  completed: boolean;
}

export const ChoreSchema = SchemaFactory.createForClass(Chore);
