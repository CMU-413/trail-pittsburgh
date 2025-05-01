import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/prisma/prismaClient';
import { UserRoleEnum } from '@prisma/client';
import { AuthRequest } from '../../src/middlewares/auth';
import { Response, NextFunction } from 'express';

const newPark = { name: 'Central Park', county: 'Test County' };

jest.mock('../../src/middlewares/index', () => ({
  ...jest.requireActual('../../src/middlewares/index'),
  authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => {
    req.user = {
      userId: 1,
      role: UserRoleEnum.ROLE_SUPERADMIN,
      email: 'test@example.com'
    };
    next();
  },
  requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => next(),
  requireSuperAdmin: (req: AuthRequest, res: Response, next: NextFunction) => next()
}));

describe('Park Routes', () => {
    
    beforeAll(async () => {
        await prisma.$executeRaw`BEGIN`;
        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.trail.deleteMany();
        await prisma.park.deleteMany();
    });

    afterEach(async () => {
        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.trail.deleteMany();
        await prisma.park.deleteMany();
    });

    afterAll(async () => {
        await prisma.$executeRaw`ROLLBACK`;
        await prisma.$disconnect();
    });

    it('should create a new park', async () => {
        const response = await request(app)
            .post('/api/parks')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send(newPark);

        expect(response.status).toBe(201);
        expect(response.body.park).toHaveProperty('parkId');
        expect(response.body.park.name).toEqual('Central Park');
    });

    it('should get all parks', async () => {
        const NUMBER_OF_PARKS = 5;
        for (let i = 0; i < NUMBER_OF_PARKS; i++) {
            await request(app)
                .post('/api/parks')
                .set('Authorization', 'Bearer TEST_TOKEN')
                .send(newPark);
        }

        const response = await request(app)
            .get('/api/parks')
            .send();

        expect(response.status).toBe(200);
        expect(response.body.parks).toHaveLength(NUMBER_OF_PARKS);
        expect(response.body.parks[0]).toHaveProperty('parkId');
    });

    it('should get a park', async () => {
        const createResponse = await request(app)
            .post('/api/parks')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send(newPark);

        const id = createResponse.body.park.parkId;

        const response = await request(app)
            .get(`/api/parks/${id}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(response.status).toBe(200);
        expect(response.body.park).toHaveProperty('parkId');
        expect(response.body.park.name).toBe('Central Park');
    });

    it('should delete a park', async () => {
        const createResponse = await request(app)
            .post('/api/parks')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send(newPark);

        const id = createResponse.body.park.parkId;

        const deleteResponse = await request(app)
            .delete(`/api/parks/${id}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(deleteResponse.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/parks/${id}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(getResponse.status).toBe(404);
    });
});
