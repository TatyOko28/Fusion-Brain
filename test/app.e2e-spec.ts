import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(503)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('details');
        });
    });
  });

  describe('Images', () => {
    it('/images (POST)', () => {
      return request(app.getHttpServer())
        .post('/images')
        .send({
          prompt: 'A beautiful sunset',
          style: 'anime',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });

    it('/images/:id/status (GET)', async () => {
      // Créer d'abord une image
      const createResponse = await request(app.getHttpServer())
        .post('/images')
        .send({
          prompt: 'Test image',
          style: 'anime',
        });

      const imageId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/images/${imageId}/status`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(['pending', 'completed', 'failed']).toContain(res.body.status);
        });
    });

    it('/images (GET)', () => {
      return request(app.getHttpServer())
        .get('/images')
        .query({ page: 1, limit: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });
});
