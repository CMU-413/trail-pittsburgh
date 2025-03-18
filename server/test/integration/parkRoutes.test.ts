import request from 'supertest';

import { app } from '@/app';
import { prisma } from '@/prisma/prismaClient'; // Your Express app

describe('Park Routes', () => {
    beforeAll(async () => {
        await prisma.parks.deleteMany();
    });

    afterEach(async () => {
        await prisma.parks.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new park', async () => {
        const newPark = { parkName: 'Central Park' };

        const response = await request(app)
            .post('/api/parks')
            .send(newPark);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('park_id');
        expect(response.body.data.park_name).toEqual('Central Park');

    });

    it('should get all parks', async () => {
        const newPark = { parkName: 'Central Park' };

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
        expect(response.body.data).toHaveLength(NUMBER_OF_PARKS);
        expect(response.body.data[0]).toHaveProperty('park_id');
    });

    it('should get a park', async () => {
        const newPark = { parkName: 'Central Park' };

        const createResponse = await request(app)
            .post('/api/parks')
            .send(newPark);

        const id = Number(createResponse.body.data.park_id);

        const response = await request(app)
            .get(`/api/parks/${id}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('park_id');
        expect(response.body.data.park_name).toBe('Central Park');
    });

    it('should delete a park', async () => {
        const newPark = { parkName: 'Central Park' };

        const createResponse = await request(app)
            .post('/api/parks')
            .send(newPark);

        const id: number = createResponse.body.data.park_id;

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
