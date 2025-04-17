import { prisma } from '@/prisma/prismaClient';
import { CreateIssueDbInput } from '@/types/issueTypes';

export class IssueRepository {
    public async getIssue(issueId: number) {
        try {
            return await prisma.issue.findUnique({
                where: { issue_id: issueId },
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
                    park_id: data.park_id,
                    trail_id: data.trail_id,
                    issue_type: data.issue_type,
                    urgency: data.urgency,
                    description: data.description ?? "",
                    is_public: data.is_public ?? true,
                    status: data.status,
                    notify_reporter: data.notify_reporter ?? true,
                    reporter_email: data.reporter_email,
                    issue_image: data.issueImageKey,
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
            await prisma.issue.delete({ where: { issue_id: issueId } });
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
        try {
            const normalizedStatus = status.trim().toLowerCase();
            return await prisma.issue.update({
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
