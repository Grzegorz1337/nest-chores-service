import { UUID } from 'crypto';
import { ChorePlace } from './chore-place.enum';
import { Person } from './person';

export class ChoreDto {
  id: UUID;
  creationDate: Date;
  expirationDate: Date;
  chorePlace: ChorePlace;
  choreDescription: string;
  orderedBy: Person;
  orderedFor: Person;
  completed: boolean;

  constructor() {}
}
