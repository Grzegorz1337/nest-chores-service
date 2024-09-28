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

  it('GET /chores', () => {
    return request(app.getHttpServer()).get('/chores').expect(200).expect([]);
  });

  it('GET /chores/active', () => {
    return request(app.getHttpServer())
      .get('/chores/active')
      .expect(200)
      .expect([]);
  });
});
