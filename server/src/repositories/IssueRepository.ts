import { prisma } from '@/prisma/prismaClient';
import { CreateIssueDbInput } from '@/types/issueTypes';

export class IssueRepository {
    public async getIssue(issueId: number) {
        try {
            return await prisma.issue.findUnique({
                where: { issueId: issueId },
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
            await prisma.issue.delete({ where: { issueId: issueId } });
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
            where: { parkId: parkId },
            include: {
                park: true,
                trail: true
            }
        });
    }

    public async getIssuesByTrail(trailId: number) {
        return prisma.issue.findMany({
            where: { trailId: trailId },
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
        try {
            const normalizedStatus = status.trim().toLowerCase();
            return await prisma.issue.update({
                where: { issueId: issueId },
                data: {
                    status: normalizedStatus,
                    resolvedAt: normalizedStatus === 'resolved' ? new Date() : null
                },
                include: {
                    park: true,
                    trail: true
                }
            });
        } catch (error) {
            if (isNotFoundError(error)) {return null;}
            console.error('Error updating issue status:', error);
            throw error;
        }
    }
}

function isNotFoundError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {return false;}

    const prismaError = error as { code?: string };
    return prismaError.code === 'P2025' || prismaError.code === 'P2016';
}
