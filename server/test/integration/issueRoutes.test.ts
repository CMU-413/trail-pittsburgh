import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/prisma/prismaClient';
import { IssueStatusEnum, IssueTypeEnum, IssueUrgencyEnum, UserRoleEnum } from '@prisma/client';
import { AuthRequest } from '../../src/middlewares/auth';
import { Response, NextFunction } from 'express';

/// <reference types="jest" />

let parkId: number;
let trailId: number;
let createdIssueId: number | undefined;

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
        await prisma.trail.deleteMany();
        await prisma.park.deleteMany();
        await prisma.$disconnect();
    });

    beforeAll(async () => {
        await prisma.$executeRaw`BEGIN`;

        await prisma.notification.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.trail.deleteMany();
        await prisma.park.deleteMany();

        const createdPark = await prisma.park.create({
            data: { name: 'Test Park', county: 'Allegheny' }
        });
        parkId = createdPark.parkId;

        const createdTrail = await prisma.trail.create({
            data: { name: 'Test Trail', parkId: parkId, isActive: true, isOpen: true }
        });
        trailId = createdTrail.trailId;
    });

    it('POST /api/issues -> should create an issue and return 201 with issue', async () => {
        const payload = {
            parkId,
            trailId,
            issueType: 'OBSTRUCTION' as IssueTypeEnum,
            urgency: 'MEDIUM' as IssueUrgencyEnum,
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

    it('PUT /api/issues/:issueId/status -> should update status to "resolved"', async () => {
        const res = await request(app)
            .put(`/api/issues/${createdIssueId}/status`)
            .set('Authorization', 'Bearer TEST_TOKEN')
            .send({ status: 'RESOLVED' as IssueStatusEnum });
        
        expect(res.status).toBe(200);
        expect(res.body.issue.status).toBe('RESOLVED');
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
});
