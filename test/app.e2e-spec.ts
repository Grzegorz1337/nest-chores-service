import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ChoresController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /chores', async () => {
    await request(app.getHttpServer()).get('/chores').expect(200).expect([]);
  });

  it('GET /chores/active', async () => {
    await request(app.getHttpServer())
      .get('/chores/active')
      .expect(200)
      .expect([]);
  });

  it('POST /chores', async () => {
    const newChore = {
      chorePlace: 'Backyard',
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
  });

  afterAll(async () => {
    await app.close();
  });
});
