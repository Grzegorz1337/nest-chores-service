import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as typeorm from 'typeorm';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChorePlace } from '../src/chore/model/chore-place.enum';
import { Chore } from '../src/chore/model/chore.schema';
import { randomUUID } from 'crypto';

describe('ChoresController (e2e)', () => {
  let app: INestApplication;
  let choreRepository: typeorm.Repository<Chore>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    choreRepository = moduleFixture.get<typeorm.Repository<Chore>>(
      getRepositoryToken(Chore),
    );

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('GET /chores', () => {
    it('Returns chore list when there are chores present', async () => {
      const chore = {
        id: randomUUID(),
        creationDate: Date.now(),
        expirationDate: Date.now(),
        chorePlace: ChorePlace.KITCHEN,
        choreDescription: 'Clean counter',
        orderedBy: { name: 'Iga', surname: 'Lukiewska' },
        orderedFor: { name: 'Kamil', surname: 'Grzeczkowski' },
        completed: false,
      };
      await choreRepository.save(chore);
      await request(app.getHttpServer())
        .get('/chores')
        .expect(200)
        .expect([chore]);
    });

    it('Returns 404 when no chore is in database', async () => {
      await request(app.getHttpServer()).get('/chores').expect(404);
    });
  });

  describe('GET /chores/choreId', () => {
    it('Returns a chore when id is valid', async () => {
      const chore = {
        id: randomUUID(),
        creationDate: Date.now(),
        expirationDate: Date.now(),
        chorePlace: ChorePlace.KITCHEN,
        choreDescription: 'Clean counter',
        orderedBy: { name: 'Iga', surname: 'Lukiewska' },
        orderedFor: { name: 'Kamil', surname: 'Grzeczkowski' },
        completed: false,
      };
      await choreRepository.save(chore);
      await request(app.getHttpServer())
        .get(`/chores/${chore.id}`)
        .expect(200)
        .expect(chore);
    });

    it('Returns 404 when no chore was found', async () => {
      await request(app.getHttpServer()).get('/chores/1-2-3-4').expect(404);
    });
  });

  describe('GET /chores/active', () => {
    it('Returns list of active chores if any is present', async () => {
      const chore = {
        id: randomUUID(),
        creationDate: Date.now(),
        expirationDate: Date.now(),
        chorePlace: ChorePlace.KITCHEN,
        choreDescription: 'Clean counter',
        orderedBy: { name: 'Iga', surname: 'Lukiewska' },
        orderedFor: { name: 'Kamil', surname: 'Grzeczkowski' },
        completed: false,
      };
      await choreRepository.save(chore);
      await request(app.getHttpServer())
        .get('/chores/active')
        .expect(200)
        .expect([chore]);
    });

    it('Returns 4-4 when there are no active chores todo', async () => {
      await request(app.getHttpServer()).get('/chores/active').expect(404);
    });
  });

  it('POST /chores', async () => {
    const newChore = {
      chorePlace: ChorePlace.YARD,
      choreDescription: 'Bring some logs for fireplace',
      orderedBy: {
        name: 'Iga',
        surename: 'Lukiewska',
      },
      orderedFor: {
        name: 'Kamil',
        surename: 'Grzeczkowski',
      },
    };

    await request(app.getHttpServer())
      .post('/chores')
      .send(newChore)
      .expect(201)
      .expect(({ body }) => {
        expect(body.chorePlace).toEqual(newChore.chorePlace);
        expect(body.choreDescription).toEqual(newChore.choreDescription);
        expect(body.orderedBy).toBeDefined();
        expect(body.orderedFor).toBeDefined();
        expect(body.completed).toEqual(false);
        expect(body.id).toBeDefined();
        expect(body.creationDate).toBeDefined();
        expect(body.expirationDate).toBeDefined();
      });
    expect(
      await choreRepository.existsBy({
        choreDescription: 'Bring some logs for fireplace',
      }),
    ).toBeTruthy();
  });

  it('PATCH /chores/choreId', async () => {
    const chore = {
      id: randomUUID(),
      creationDate: Date.now(),
      expirationDate: Date.now(),
      chorePlace: ChorePlace.KITCHEN,
      choreDescription: 'Clean counter',
      orderedBy: { name: 'Iga', surname: 'Lukiewska' },
      orderedFor: { name: 'Kamil', surname: 'Grzeczkowski' },
      completed: false,
    };
    await choreRepository.save(chore);
    await request(app.getHttpServer()).patch(`/chores/${chore.id}`).expect(200);
    const updatedChore = await choreRepository.findOneBy({ id: chore.id });
    expect(updatedChore.completed).toBe(true);
  });

  it('DELETE /chores/choreId', async () => {
    const chore = {
      id: randomUUID(),
      creationDate: Date.now(),
      expirationDate: Date.now(),
      chorePlace: ChorePlace.KITCHEN,
      choreDescription: 'Clean counter',
      orderedBy: { name: 'Iga', surname: 'Lukiewska' },
      orderedFor: { name: 'Kamil', surname: 'Grzeczkowski' },
      completed: false,
    };
    await choreRepository.save(chore);
    await request(app.getHttpServer())
      .delete(`/chores/${chore.id}`)
      .expect(200)
      .expect([]);
    expect(await choreRepository.existsBy({ id: chore.id })).toBeFalsy();
  });

  afterEach(async () => {
    await choreRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });
});
