import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/prisma/prismaClient';
import { IssueStatusEnum, IssueTypeEnum, UserRoleEnum, IssueRiskEnum } from '@prisma/client';
import { AuthRequest } from '../../src/middlewares/auth';
import { Response, NextFunction } from 'express';

/// <reference types="jest" />

let parkId: number;
let secondParkId: number;
let createdIssueId: number | undefined;
let secondIssueId: number | undefined;
let crossParkIssueId: number | undefined;
let imagePublicIssueId: number | undefined;

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

describe('Issue API End-to-End', () => {

    afterAll(async () => {
        await prisma.$executeRaw`ROLLBACK`;

        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.issueGroup.deleteMany();
        await prisma.park.deleteMany();
        await prisma.$disconnect();
    });

    beforeAll(async () => {
        await prisma.$executeRaw`BEGIN`;

        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.issueGroup.deleteMany();
        await prisma.park.deleteMany();

        const createdPark = await prisma.park.create({
            data: { name: 'Test Park', county: 'Allegheny' }
        });
        parkId = createdPark.parkId;

        const secondPark = await prisma.park.create({
            data: { name: 'Second Test Park', county: 'Allegheny' }
        });
        secondParkId = secondPark.parkId;
    });

    it('POST /api/issues -> should create an issue and return 201 with issue', async () => {
        const payload = {
            parkId,
            issueType: 'OBSTRUCTION' as IssueTypeEnum,
            safetyRisk: 'NO_RISK' as IssueRiskEnum,
            reporterEmail: 'sample1@example.com',
            status: 'OPEN' as IssueStatusEnum,
            notifyReporter: true,
            isPublic: true,
            description: 'Flooding trail again'
        };
    
        const res = await request(app)
            .post('/api/issues')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send(payload);
        
        expect(res.status).toBe(201);
        expect(res.body.issue).toMatchObject({
            parkId: payload.parkId,
            issueType: payload.issueType,
            reporterEmail: payload.reporterEmail,
        });

        createdIssueId = res.body.issue.issueId; 
    });

    it('GET /api/issues/:issueId -> should return the created issue', async () => {
        const res = await request(app)
            .get(`/api/issues/${createdIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(res.status).toBe(200);
        expect(res.body.issue.issueId).toBe(createdIssueId);
        expect(createdIssueId).toBeDefined();
    });

    it('POST /api/issues -> should create a second issue for group tests', async () => {
        const payload = {
            parkId,
            issueType: 'FLOODING' as IssueTypeEnum,
            safetyRisk: 'MINOR_RISK' as IssueRiskEnum,
            reporterEmail: 'sample2@example.com',
            status: 'OPEN' as IssueStatusEnum,
            notifyReporter: true,
            isPublic: true,
            description: 'A related flooding report'
        };

        const res = await request(app)
            .post('/api/issues')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send(payload);

        expect(res.status).toBe(201);
        secondIssueId = res.body.issue.issueId;
        expect(secondIssueId).toBeDefined();
    });

    it('POST /api/issues -> should create a cross-park issue for group validation', async () => {
        const payload = {
            parkId: secondParkId,
            issueType: 'OTHER' as IssueTypeEnum,
            safetyRisk: 'NO_RISK' as IssueRiskEnum,
            reporterEmail: 'sample-cross-park@example.com',
            status: 'OPEN' as IssueStatusEnum,
            notifyReporter: true,
            isPublic: true,
            description: 'Issue in a different park'
        };

        const res = await request(app)
            .post('/api/issues')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send(payload);

        expect(res.status).toBe(201);
        crossParkIssueId = res.body.issue.issueId;
        expect(crossParkIssueId).toBeDefined();
    });

    it('PUT /api/issues/:issueId/group -> should set issue group membership', async () => {
        const res = await request(app)
            .put(`/api/issues/${createdIssueId}/group`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({
                issueGroupMemberIds: [secondIssueId],
            });

        expect(res.status).toBe(200);
        expect(res.body.issue.issueGroupMemberIds).toEqual(expect.arrayContaining([createdIssueId, secondIssueId]));
    });

    it('PUT /api/issues/:issueId/status -> should update status for all grouped issues', async () => {
        const res = await request(app)
            .put(`/api/issues/${createdIssueId}/status`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ status: 'IN_PROGRESS' as IssueStatusEnum });

        expect(res.status).toBe(200);
        expect(res.body.issue.status).toBe('IN_PROGRESS');

        const groupedIssueRes = await request(app)
            .get(`/api/issues/${secondIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(groupedIssueRes.status).toBe(200);
        expect(groupedIssueRes.body.issue.status).toBe('IN_PROGRESS');
    });

    it('PUT /api/issues/:issueId/group -> should return 404 for invalid group member ids', async () => {
        const res = await request(app)
            .put(`/api/issues/${createdIssueId}/group`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({
                issueGroupMemberIds: [999999],
            });

        expect(res.status).toBe(404);
    });

    it('PUT /api/issues/:issueId/group -> should reject grouping issues from a different park', async () => {
        const res = await request(app)
            .put(`/api/issues/${createdIssueId}/group`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({
                issueGroupMemberIds: [crossParkIssueId],
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Duplicate issues can only be grouped within the same park.');
    });

    it('PUT /api/issues/:issueId/group -> should ungroup and stop status propagation', async () => {
        const ungroupRes = await request(app)
            .put(`/api/issues/${createdIssueId}/group`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ issueGroupMemberIds: [] });

        expect(ungroupRes.status).toBe(200);
        expect(ungroupRes.body.issue.issueGroupMemberIds).toEqual([createdIssueId]);

        const reopenRes = await request(app)
            .put(`/api/issues/${createdIssueId}/status`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ status: 'OPEN' as IssueStatusEnum });

        expect(reopenRes.status).toBe(200);
        expect(reopenRes.body.issue.status).toBe('OPEN');

        const secondIssueRes = await request(app)
            .get(`/api/issues/${secondIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(secondIssueRes.status).toBe(200);
        expect(secondIssueRes.body.issue.status).toBe('IN_PROGRESS');
    });

    it('PUT /api/issues/:issueId/group -> should regroup issues again', async () => {
        const res = await request(app)
            .put(`/api/issues/${createdIssueId}/group`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({
                issueGroupMemberIds: [secondIssueId],
            });

        expect(res.status).toBe(200);
        expect(res.body.issue.issueGroupMemberIds).toEqual(
            expect.arrayContaining([createdIssueId, secondIssueId])
        );
    });

    it('POST/GET /api/issues -> should persist isImagePublic flag', async () => {
        const payload = {
            parkId,
            issueType: 'OTHER' as IssueTypeEnum,
            safetyRisk: 'NO_RISK' as IssueRiskEnum,
            reporterEmail: 'sample3@example.com',
            status: 'OPEN' as IssueStatusEnum,
            notifyReporter: true,
            isPublic: true,
            isImagePublic: true,
            description: 'Image visibility test issue'
        };

        const createRes = await request(app)
            .post('/api/issues')
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send(payload);

        expect(createRes.status).toBe(201);
        expect(createRes.body.issue.isImagePublic).toBe(true);

        imagePublicIssueId = createRes.body.issue.issueId;

        const getRes = await request(app)
            .get(`/api/issues/${imagePublicIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(getRes.status).toBe(200);
        expect(getRes.body.issue.isImagePublic).toBe(true);
    });

    it('DELETE /api/issues/:issueId -> should delete image visibility test issue', async () => {
        const res = await request(app)
            .delete(`/api/issues/${imagePublicIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(res.status).toBe(204);
    });

    it('PUT /api/issues/:issueId/status -> should update status to "resolved"', async () => {
        const res = await request(app)
            .put(`/api/issues/${createdIssueId}/status`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ status: 'RESOLVED' as IssueStatusEnum });
        
        expect(res.status).toBe(200);
        expect(res.body.issue.status).toBe('RESOLVED');

        const groupedIssueRes = await request(app)
            .get(`/api/issues/${secondIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect(groupedIssueRes.status).toBe(200);
        expect(groupedIssueRes.body.issue.status).toBe('RESOLVED');
    });

    it('DELETE /api/issues/:issueId -> should delete the issue', async () => {
        const res = await request(app)
            .delete(`/api/issues/${createdIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN');

        expect(res.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/issues/${createdIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send();

        expect([404, 500]).toContain(getResponse.status); 
    });

    it('DELETE /api/issues/:issueId -> should delete second issue', async () => {
        const res = await request(app)
            .delete(`/api/issues/${secondIssueId}`)
            .set('Authorization', 'Bearer TEST_TOKEN');

        expect(res.status).toBe(204);
    });
});
