import request from 'supertest';

import { app } from '../../src/app';
import { prisma } from '../../src/prisma/prismaClient';

const newPark = { name: 'Central Park', county: 'Test County' };

describe('Park Routes', () => {
    
    beforeAll(async () => {
        await prisma.$executeRaw`BEGIN`;
        // Delete in correct order to handle foreign key constraints
        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.trail.deleteMany();
        await prisma.park.deleteMany();
    });

    afterEach(async () => {
        // Delete in correct order to handle foreign key constraints
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
            .send(newPark);

        const id = createResponse.body.park.parkId;

        const response = await request(app)
            .get(`/api/parks/${id}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.park).toHaveProperty('parkId');
        expect(response.body.park.name).toBe('Central Park');
    });

    it('should delete a park', async () => {
        const createResponse = await request(app)
            .post('/api/parks')
            .send(newPark);

        const id = createResponse.body.park.parkId;

        const deleteResponse = await request(app)
            .delete(`/api/parks/${id}`)
            .send();

        expect(deleteResponse.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/parks/${id}`)
            .send();

        expect(getResponse.status).toBe(404);
    });
});
