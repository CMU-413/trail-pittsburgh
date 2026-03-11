import {
    IssueStatusEnum, IssueTypeEnum, Prisma
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
                    issueType: data.issueType,
                    description: data.description,
                    safetyRisk: data.safetyRisk,
                    passible: data.passible,
                    isPublic: data.isPublic ?? true,
                    isImagePublic: data.isImagePublic ?? false,
                    status: data.status,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    notifyReporter: data.notifyReporter ?? true,
                    reporterEmail: data.reporterEmail ?? '',
                    issueImage: data.issueImageKey,
                },
                include: {
                    park: true,
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
            }
        });
    }

    public async getMapPins(minLat: number, 
        minLng: number, 
        maxLat: number, 
        maxLng: number,
        issueTypes: IssueTypeEnum[],
        statuses: IssueStatusEnum[]) {
        const whereClause : Prisma.IssueWhereInput = {
            status: { in: statuses },
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
            }
        });
    }

    public async getIssuesByStatus(status: IssueStatusEnum) {
        return prisma.issue.findMany({
            where: { status },
            include: {
                park: true,
            }
        });
    }

    public async getIssuesByType(type: IssueTypeEnum) {
        return prisma.issue.findMany({
            where: { issueType: type },
            include: {
                park: true,
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
                },
                include: {
                    park: true,
                }
            });
        } catch (error) {
            if (isNotFoundError(error)) {return null;}
            // eslint-disable-next-line no-console
            console.error('Error resolving issue:', error);
            throw error;
        }
    }

    public async disableReporterNotifications(issueId: number, reporterEmail: string) {
        try {
            const result = await prisma.issue.updateMany({
                where: {
                    issueId,
                    reporterEmail
                },
                data: {
                    notifyReporter: false
                }
            });

            return result.count > 0;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error unsubscribing reporter notifications:', error);
            throw error;
        }
    }

    public async updateIssue(issueId: number, data: Partial<{
        description?: string;
        issueType?: IssueTypeEnum;
		isImagePublic?: boolean;
		parkId?: number;
		latitude?: number;
		longitude?: number;
    }>) {
        try {
            return await prisma.issue.update({
                where: { issueId: issueId },
                data: {
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.issueType !== undefined && { issueType: data.issueType }),
                    ...(data.isImagePublic !== undefined && { isImagePublic: data.isImagePublic }),
                    ...(data.parkId !== undefined && { parkId: data.parkId }),
                    ...(data.latitude !== undefined && { latitude: data.latitude }),
                    ...(data.longitude !== undefined && { longitude: data.longitude }),
                },
                include: {
                    park: true,
                }
            });
        } catch (error) {
            if (isNotFoundError(error)) {
                // eslint-disable-next-line no-console
                console.error('Issue not found');
                return null;
            }
            throw error;
        }
    }
}
