import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/prisma/prismaClient';
import { UserRoleEnum } from '@prisma/client';
import { AuthRequest } from '../../src/middlewares/auth';
import { Response, NextFunction } from 'express';

let testParkId: number;
let testPark: any;

const newTrail = { 
    name: 'Main Trail', 
    isActive: true,
    isOpen: true 
};

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

describe('Trail Routes', () => {

    afterAll(async () => {
        await prisma.$executeRaw`ROLLBACK`;
        await prisma.$disconnect();
    });

    beforeAll(async () => {
        await prisma.$executeRaw`BEGIN`;
        
        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.trail.deleteMany();
        await prisma.park.deleteMany();
        
        testPark = await prisma.park.create({
            data: {
                name: 'Test Park',
                county: 'Test County'
            }
        });
        testParkId = testPark.parkId;
    });

    beforeEach(async () => {
        // Clean up all trails before each test, not just for the test park
        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.trail.deleteMany();
    });

    it('should create a new trail', async () => {
        const response = await request(app)
            .post('/api/trails')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ ...newTrail, parkId: testParkId });

        expect(response.status).toBe(201);
        expect(response.body.trail).toHaveProperty('trailId');
        expect(response.body.trail.name).toEqual('Main Trail');
        expect(response.body.trail.isActive).toBe(true);
        expect(response.body.trail.isOpen).toBe(true);
    });

    it('should get all trails', async () => {
        const beforeResponse = await request(app)
            .get('/api/trails')
            .send();
        
        const initialTrailCount = beforeResponse.body.trails.length;
        
        const NUMBER_OF_TRAILS = 5;
        for (let i = 0; i < NUMBER_OF_TRAILS; i++) {
            await request(app)
                .post('/api/trails')
                .set('Authorization', 'Bearer TEST_TOKEN')
                .send({ ...newTrail, parkId: testParkId });
        }
    
        const afterResponse = await request(app)
            .get('/api/trails')
            .send();
    
        expect(afterResponse.status).toBe(200);
        expect(afterResponse.body.trails.length).toBe(initialTrailCount + NUMBER_OF_TRAILS);
        expect(afterResponse.body.trails[0]).toHaveProperty('trailId');
        expect(afterResponse.body.trails[0].trailId).toBeDefined();
    });

    it('should get a trail', async () => {
        const createResponse = await request(app)
            .post('/api/trails')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ ...newTrail, parkId: testParkId });

        const id = createResponse.body.trail.trailId;

        const response = await request(app)
            .get(`/api/trails/${id}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(response.status).toBe(200);
        expect(response.body.trail).toHaveProperty('trailId');
        expect(response.body.trail.name).toBe('Main Trail');
    });

    it('should update a trail - single field', async () => {
        const createResponse = await request(app)
            .post('/api/trails')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ ...newTrail, parkId: testParkId });

        const id = createResponse.body.trail.trailId;

        const updateResponse = await request(app)
            .put(`/api/trails/${id}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ name: 'Updated Trail Name' });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.trail.name).toBe('Updated Trail Name');
        expect(updateResponse.body.trail.isActive).toBe(true); // unchanged
        expect(updateResponse.body.trail.isOpen).toBe(true); // unchanged
    });

    it('should update a trail - multiple fields', async () => {
        const createResponse = await request(app)
            .post('/api/trails')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ ...newTrail, parkId: testParkId });

        const id = createResponse.body.trail.trailId;

        const updateResponse = await request(app)
            .put(`/api/trails/${id}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ 
                name: 'Updated Trail Name',
                isActive: false,
                isOpen: false
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.trail.name).toBe('Updated Trail Name');
        expect(updateResponse.body.trail.isActive).toBe(false);
        expect(updateResponse.body.trail.isOpen).toBe(false);
    });

    it('should delete a trail', async () => {
        const createResponse = await request(app)
            .post('/api/trails')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ ...newTrail, parkId: testParkId });

        const id = createResponse.body.trail.trailId;

        const deleteResponse = await request(app)
            .delete(`/api/trails/${id}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(deleteResponse.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/trails/${id}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(getResponse.status).toBe(404);
    });

    it('should get trails by park', async () => {
        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.trail.deleteMany();
        
        const NUMBER_OF_TRAILS = 3;
        for (let i = 0; i < NUMBER_OF_TRAILS; i++) {
            await request(app)
                .post('/api/trails')
                .set('Authorization', 'Bearer TEST_TOKEN')
                .send({ ...newTrail, parkId: testParkId });
        }

        const response = await request(app)
            .get(`/api/trails/park/${testParkId}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.trails).toHaveLength(NUMBER_OF_TRAILS);
        expect(response.body.trails[0]).toHaveProperty('trailId');
        expect(response.body.trails[0].parkId).toBe(testParkId);
        expect(response.body.trails[0].park).toBeDefined();
        expect(response.body.trails[0].park.parkId).toBe(testParkId);
        expect(response.body.trails[0].park.name).toBe('Test Park');
    });
});
