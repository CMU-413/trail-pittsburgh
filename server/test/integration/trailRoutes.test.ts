import request from 'supertest';

import { app } from '../../src/app';
import { prisma } from '../../src/prisma/prismaClient';

let testParkId: number;
let testPark: any;

const newTrail = { 
    name: 'Main Trail', 
    isActive: true,
    isOpen: true 
};

describe('Trail Routes', () => {
    beforeAll(async () => {
        // Create a test park for the trails
        testPark = await prisma.park.create({
            data: {
                name: 'Test Park',
                county: 'Test County'
            }
        });
        testParkId = testPark.parkId;
    });

    beforeEach(async () => {
        // Clean up any existing trails before each test
        await prisma.trail.deleteMany({
            where: { parkId: testParkId }
        });
    });

    it('should create a new trail', async () => {
        const response = await request(app)
            .post('/api/trails')
            .send({ ...newTrail, parkId: testParkId });

        expect(response.status).toBe(201);
        expect(response.body.trail).toHaveProperty('trailId');
        expect(response.body.trail.name).toEqual('Main Trail');
        expect(response.body.trail.isActive).toBe(true);
        expect(response.body.trail.isOpen).toBe(true);
    });

    it('should get all trails', async () => {
        const NUMBER_OF_TRAILS = 5;
        for (let i = 0; i < NUMBER_OF_TRAILS; i++) {
            await request(app)
                .post('/api/trails')
                .send({ ...newTrail, parkId: testParkId });
        }

        const response = await request(app)
            .get('/api/trails')
            .send();

        expect(response.status).toBe(200);
        expect(response.body.trails).toHaveLength(NUMBER_OF_TRAILS);
        expect(response.body.trails[0]).toHaveProperty('trailId');
        expect(response.body.trails[0].trailId).toBeDefined();
    });

    it('should get a trail', async () => {
        const createResponse = await request(app)
            .post('/api/trails')
            .send({ ...newTrail, parkId: testParkId });

        const id = createResponse.body.trail.trailId;

        const response = await request(app)
            .get(`/api/trails/${id}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.trail).toHaveProperty('trailId');
        expect(response.body.trail.name).toBe('Main Trail');
    });

    it('should update a trail - single field', async () => {
        const createResponse = await request(app)
            .post('/api/trails')
            .send({ ...newTrail, parkId: testParkId });

        const id = createResponse.body.trail.trailId;

        const updateResponse = await request(app)
            .put(`/api/trails/${id}`)
            .send({ name: 'Updated Trail Name' });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.trail.name).toBe('Updated Trail Name');
        expect(updateResponse.body.trail.isActive).toBe(true); // unchanged
        expect(updateResponse.body.trail.isOpen).toBe(true); // unchanged
    });

    it('should update a trail - multiple fields', async () => {
        const createResponse = await request(app)
            .post('/api/trails')
            .send({ ...newTrail, parkId: testParkId });

        const id = createResponse.body.trail.trailId;

        const updateResponse = await request(app)
            .put(`/api/trails/${id}`)
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
            .send({ ...newTrail, parkId: testParkId });

        const id = createResponse.body.trail.trailId;

        const deleteResponse = await request(app)
            .delete(`/api/trails/${id}`)
            .send();

        expect(deleteResponse.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/trails/${id}`)
            .send();

        expect(getResponse.status).toBe(404);
    });

    it('should get trails by park', async () => {
        // Create multiple trails in the same park
        const NUMBER_OF_TRAILS = 3;
        for (let i = 0; i < NUMBER_OF_TRAILS; i++) {
            await request(app)
                .post('/api/trails')
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
