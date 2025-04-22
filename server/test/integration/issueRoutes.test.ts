jest.mock('@/config/storage', () => ({
    getStorage: () => ({
      bucket: () => ({
        file: () => ({
          getSignedUrl: async () => ['https://fake-signed-url.com/upload'],
        }),
      }),
    }),
  }));
  

import request from 'supertest';

import { app } from '@/app';
import { prisma } from '@/prisma/prismaClient';


/// <reference types="jest" />

describe('Issue API End-to-End', () => {
    let createdIssueId: number | undefined;
    let parkId: number;
    let trailId: number;

    beforeAll(async () => {
        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.trail.deleteMany();
        await prisma.park.deleteMany();

        const createdPark = await prisma.park.create({
            data: { name: 'Test Park', county: 'Allegheny'}
        });
        parkId = createdPark.parkId;

        const createdTrail = await prisma.trail.create({
            data: { name: 'Test Trail', parkId: parkId, isActive: true, isOpen: true}
        });
        trailId = createdTrail.trailId;
        
    });

    // afterEach(async () => {
    //     await prisma.notification.deleteMany();
    //     await prisma.issue.deleteMany();
    //     await prisma.trail.deleteMany();
    //     await prisma.park.deleteMany();
    // });

    afterAll(async () => {
        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.trail.deleteMany();
        await prisma.park.deleteMany();
        await prisma.$disconnect();
    });
    
    it('POST /api/issues -> should create an issue and return 201 with issue + signedUrl', async () => {
        const payload = {
            parkId,
            trailId,
            issueType: 'Flooding',
            urgency: 3,
            reporterEmail: 'sample1@eaxmple.com',
            status: 'Open',
            notifyReporter: true,
            isPublic: true,
            description: 'Flooding trail again',
            imageType: 'image/jpeg'
            
        };

        const res = await request(app)
            .post('/api/issues')
            .set('Authorization', 'Bearer TEST_TOKEN') //attempt to bypass auth
            .send(payload);
        
        expect(res.status).toBe(201);
        expect(res.body.issue).toMatchObject({
            parkId: payload.parkId,
            issueType: payload.issueType,
            reporterEmail: payload.reporterEmail,
        });
        expect(res.body.signedUrl).toBeDefined();
        
        createdIssueId = res.body.issue.issueId;
        
    });


    it ('GET /api/issues/:issueId -> should return the created issue', async () => {
        const res = await request(app).get(`/api/issues/${createdIssueId}`);
        expect(res.status).toBe(200);
        expect(res.body.issue.issueId).toBe(createdIssueId);
        expect(createdIssueId).toBeDefined();
    });

    it ('PUT /api/issues/:issueId/status -> should update status to "resolved"', async () => {
        const res = await request(app)
            .put(`/api/issues/${createdIssueId}/status`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ status: 'resolved' });
        
            expect(res.status).toBe(200);
            expect(res.body.issue.status).toBe('resolved');
    });

    it('DELETE /api/issues/:issueId -> should delete the issue', async () => {
        const res = await request(app)
            .delete(`/api/issues/${createdIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN');
        
        expect(res.status).toBe(204)
    });

});


