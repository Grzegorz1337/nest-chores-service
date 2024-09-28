import { UUID } from 'crypto';
import { ChorePlace } from './chore-place.enum';
import { Person } from './person';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
