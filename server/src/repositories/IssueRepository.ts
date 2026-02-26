import {
    IssueStatusEnum, IssueTypeEnum, IssueUrgencyEnum, 
    Prisma
} from '@prisma/client';

import { isNotFoundError, prisma } from '@/prisma/prismaClient';
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
            // eslint-disable-next-line no-console
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
                    reporterEmail: data.reporterEmail ?? '',
                    issueImage: data.issueImageKey,
                },
                include: {
                    park: true,
                    trail: true
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console
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

    public async getMapPins(minLat: number, 
        minLng: number, 
        maxLat: number, 
        maxLng: number,
        issueTypes: IssueTypeEnum[],
        status: IssueStatusEnum) {
        const whereClause : Prisma.IssueWhereInput = {
            status,
            latitude: { not: null, gte: minLat, lte: maxLat },
            longitude: { not: null, gte: minLng, lte: maxLng },
        };

        if (issueTypes && issueTypes.length > 0) {
  			whereClause.issueType = { in: issueTypes };
        }

        return prisma.issue.findMany({
            where: whereClause,
            select: {
                issueId: true,
                latitude: true,
                longitude: true,
                issueType: true,
                urgency: true,
                status: true,
                createdAt: true,
            },
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
            // eslint-disable-next-line no-console
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

    public async getIssuesByStatus(status: IssueStatusEnum) {
        return prisma.issue.findMany({
            where: { status },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByType(type: IssueTypeEnum) {
        return prisma.issue.findMany({
            where: { issueType: type },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByUrgency(urgencyLevel: IssueUrgencyEnum) {
        return prisma.issue.findMany({
            where: { urgency: urgencyLevel },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async updateIssueStatus(issueId: number, status: IssueStatusEnum) {
        try {
            return await prisma.issue.update({
                where: { issueId },
                data: {
                    status: status,
                    resolvedAt: new Date()
                }
            });
        } catch (error) {
            if (isNotFoundError(error)) {return null;}
            // eslint-disable-next-line no-console
            console.error('Error resolving issue:', error);
            throw error;
        }
    }

    public async updateIssue(issueId: number, data: Partial<{
        description?: string;
        urgency?: IssueUrgencyEnum;
        issueType?: IssueTypeEnum;
		parkId?: number;
		latitude?: number;
		longitude?: number;
    }>) {
        try {
            return await prisma.issue.update({
                where: { issueId: issueId },
                data: {
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.urgency !== undefined && { urgency: data.urgency }),
                    ...(data.issueType !== undefined && { issueType: data.issueType }),
                    ...(data.parkId !== undefined && { parkId: data.parkId }),
                    ...(data.latitude !== undefined && { latitude: data.latitude }),
                    ...(data.longitude !== undefined && { longitude: data.longitude }),
                },
                include: {
                    park: true,
                    trail: true
                }
            });
        } catch (error) {
            if (isNotFoundError(error)) {
                return null;
            }
            throw error;
        }
    }
}
