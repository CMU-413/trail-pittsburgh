import { Prisma } from '@prisma/client';

import { prisma } from '@/prisma/prismaClient';

export class IssueRepository {
    public async getIssue(issueId: number) {
        return prisma.issues.findUnique({
            where: { id: issueId },
        });
    }

    public async createIssue(parkId: number, trailId: number, 
        type: string, urgency: number, description: string) {
        return prisma.issues.create({
            data: { park_id: parkId, 
                trail_id: trailId, 
                type, 
                urgency, 
                description },
        });
    }

    public async getAllIssues() {
        return prisma.issues.findMany();
    }

    public async deleteIssue(issueId: number) {
        try {
            await prisma.issues.delete({ where: { id: issueId } });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) {return false;}
            throw error;
        }
    }

    public async getIssuesByPark(parkId: number) {
        return prisma.issues.findMany({
            where: { park_id: parkId },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByTrail(trailId: number) {
        return prisma.issues.findMany({
            where: { trail_id: trailId },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByUrgency(urgencyLevel: number) {
        return prisma.issues.findMany({
            where: { urgency: urgencyLevel },
            include: {
                park: true,
                trail: true
            }
        });
    }
}

function isNotFoundError(error: unknown) {
    return (error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2025' || error.code === 'P2016'));
}
