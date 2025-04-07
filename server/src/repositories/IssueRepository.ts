import { Prisma } from '@prisma/client';

import { isNotFoundError, prisma } from '@/prisma/prismaClient';

export class IssueRepository {
    public async getIssue(issueId: number) {
        return prisma.issue.findUnique({
            where: { issue_id: issueId },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async createIssue(
        parkId: number,
        trailId: number,
        type: string,
        urgency: number,
        description: string,
        isPublic: boolean = true,
        status: string = 'Open',
        notifyReporter: boolean = true,
        issueImage?: string,
        reportedAt?: string
        // reporterEmail?: string,
    ) {
        return prisma.issue.create({
            data: {
                park_id: parkId,
                trail_id: trailId,
                issue_type: type,
                urgency,
                description,
                is_public: isPublic,
                status,
                notify_reporter: notifyReporter,
                issue_image: issueImage,
                // reporter_email: reporterEmail, 
            },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getAllIssues() {
        return prisma.issue.findMany({
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async deleteIssue(issueId: number) {
        try {
            await prisma.issue.delete({ where: { issue_id: issueId } });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) { return false; }
            throw error;
        }
    }

    public async getIssuesByPark(parkId: number) {
        return prisma.issue.findMany({
            where: { park_id: parkId },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByTrail(trailId: number) {
        return prisma.issue.findMany({
            where: { trail_id: trailId },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByUrgency(urgencyLevel: number) {
        return prisma.issue.findMany({
            where: { urgency: urgencyLevel },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async updateIssueStatus(issueId: number, status: string) {
        const normalizedStatus = status.toLowerCase();
        return prisma.issue.update({
            where: { issue_id: issueId },
            data: {
                status: normalizedStatus,
                resolved_at: normalizedStatus === 'resolved' ? new Date() : null
            },
            include: {
                park: true,
                trail: true
            }
        });
    }
}
