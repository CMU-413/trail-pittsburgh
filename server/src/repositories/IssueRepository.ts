import { isNotFoundError, prisma } from '@/prisma/prismaClient';
import { IssueStatus, IssueType, Urgency } from '@prisma/client';
import { CreateIssueDbInput } from '@/schemas/issueSchema';

export class IssueRepository {
    public async getIssue(issueId: number) {
        try {
            return await prisma.issue.findUnique({
                where: { issueId },
                include: {
                    park: true,
                    trail: true
                }
            });
        } catch (error) {
            console.error('Error fetching issue:', error);
            throw error;
        }
    }

    public async createIssue(data: CreateIssueDbInput) {
        try {
            return await prisma.issue.create({
                data: {
                    parkId: data.parkId,
                    trailId: data.trailId,
                    issueType: data.issueType,
                    urgency: data.urgency,
                    description: data.description,
                    isPublic: data.isPublic ?? true,
                    status: data.status,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    notifyReporter: data.notifyReporter ?? true,
                    reporterEmail: data.reporterEmail,
                    issueImage: data.issueImageKey,
                },
                include: {
                    park: true,
                    trail: true
                }
            });
        } catch (error) {
            console.error('Error creating issue:', error);
            throw error;
        }
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
            await prisma.issue.delete({ where: { issueId } });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) {
                return false;
            }
            console.error('Error deleting issue:', error);
            throw error;
        }
    }

    public async getIssuesByPark(parkId: number) {
        return prisma.issue.findMany({
            where: { parkId },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByTrail(trailId: number) {
        return prisma.issue.findMany({
            where: { trailId },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByStatus(status: IssueStatus) {
        return prisma.issue.findMany({
            where: { status },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByType(type: IssueType) {
        return prisma.issue.findMany({
            where: { issueType: type },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByUrgency(urgencyLevel: Urgency) {
        return prisma.issue.findMany({
            where: { urgency: urgencyLevel },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async updateIssueStatus(issueId: number, status: IssueStatus) {
        try {
            return await prisma.issue.update({
                where: { issueId },
                data: {
                    status: status,
                    resolvedAt: new Date()
                }
            });
        } catch (error) {
            if (isNotFoundError(error)) return null;
            console.error('Error resolving issue:', error);
            throw error;
        }
    }
}
