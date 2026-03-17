import {
    IssueStatusEnum, IssueTypeEnum, Prisma
} from '@prisma/client';

import { isNotFoundError, prisma } from '@/prisma/prismaClient';
import { CreateIssueDbInput } from '@/schemas/issueSchema';

const issueInclude = {
    park: true,
    issueGroup: {
        select: {
            issueGroupId: true,
            primaryIssueId: true,
            status: true,
            issues: {
                select: {
                    issueId: true,
                }
            }
        }
    }
} as const;

type IssueWithGroup = Prisma.IssueGetPayload<{
    include: typeof issueInclude;
}>;

type IssueWithPark = Prisma.IssueGetPayload<{
    include: {
        park: true;
    };
}>;

type IssueGroupProjection = IssueWithGroup['issueGroup'];

type RepositoryIssue = Omit<IssueWithPark, 'issueGroupId'> & {
    issueGroupId?: number | null;
    issueGroup?: IssueGroupProjection;
};

type RepositoryIssueOrNull = RepositoryIssue | null;

export class IssueRepository {

    private buildIssueInclude() {
        return issueInclude;
    }

    private async ensureIssueGroup(
        tx: Prisma.TransactionClient,
        issueId: number,
        issueStatus: IssueStatusEnum,
        currentGroupId?: number | null
    ) {
        if (currentGroupId) {
            return currentGroupId;
        }

        const issueGroup = await tx.issueGroup.create({
            data: {
                status: issueStatus,
                primaryIssueId: issueId,
            }
        });

        await tx.issue.update({
            where: { issueId },
            data: {
                issueGroupId: issueGroup.issueGroupId,
            }
        });

        return issueGroup.issueGroupId;
    }

    public async getIssue(issueId: number): Promise<RepositoryIssueOrNull> {
        try {
            return await prisma.issue.findUnique({
                where: { issueId },
                include: this.buildIssueInclude()
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching issue:', error);
            throw error;
        }
    }

    public async createIssue(data: CreateIssueDbInput): Promise<RepositoryIssueOrNull> {
        try {
            return await prisma.$transaction(async (tx) => {
                const issueGroup = await tx.issueGroup.create({
                    data: {
                        status: data.status,
                        primaryIssueId: undefined,
                    }
                });

                const createdIssue = await tx.issue.create({
                    data: {
                        parkId: data.parkId,
                        issueGroupId: issueGroup.issueGroupId,
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
                    include: this.buildIssueInclude()
                });

                await tx.issueGroup.update({
                    where: { issueGroupId: issueGroup.issueGroupId },
                    data: {
                        primaryIssueId: createdIssue.issueId,
                    }
                });

                return tx.issue.findUnique({
                    where: {
                        issueId: createdIssue.issueId,
                    },
                    include: this.buildIssueInclude()
                });
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error creating issue:', error);
            throw error;
        }
    }

    public async getAllIssues(): Promise<RepositoryIssue[]> {
        return prisma.issue.findMany({
            include: this.buildIssueInclude()
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
                issueGroupId: true,
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

    public async getIssuesByPark(parkId: number): Promise<RepositoryIssue[]> {
        return prisma.issue.findMany({
            where: { parkId },
            include: this.buildIssueInclude()
        });
    }

    public async getIssuesByStatus(status: IssueStatusEnum): Promise<RepositoryIssue[]> {
        return prisma.issue.findMany({
            where: { status },
            include: this.buildIssueInclude()
        });
    }

    public async getIssuesByType(type: IssueTypeEnum): Promise<RepositoryIssue[]> {
        return prisma.issue.findMany({
            where: { issueType: type },
            include: this.buildIssueInclude()
        });
    }

    public async getIssuesByGroup(issueGroupId: number): Promise<RepositoryIssue[]> {
        return prisma.issue.findMany({
            where: { issueGroupId },
            include: this.buildIssueInclude(),
            orderBy: {
                issueId: 'asc',
            }
        });
    }

    public async updateIssueStatus(
        issueId: number,
        status: IssueStatusEnum
    ): Promise<RepositoryIssueOrNull> {
        try {
            return await prisma.$transaction(async (tx) => {
                const issue = await tx.issue.findUnique({
                    where: { issueId },
                    select: {
                        issueId: true,
                        issueGroupId: true,
                        status: true,
                    }
                });

                if (!issue) {
                    return null;
                }

                const issueGroupId = await this.ensureIssueGroup(
                    tx,
                    issue.issueId,
                    issue.status,
                    issue.issueGroupId
                );

                await tx.issueGroup.update({
                    where: { issueGroupId },
                    data: {
                        status,
                    }
                });

                await tx.issue.updateMany({
                    where: { issueGroupId },
                    data: {
                        status,
                        resolvedAt: status === IssueStatusEnum.RESOLVED ? new Date() : null,
                    }
                });

                return tx.issue.findUnique({
                    where: { issueId },
                    include: this.buildIssueInclude()
                });
            });
        } catch (error) {
            if (isNotFoundError(error)) {return null;}
            // eslint-disable-next-line no-console
            console.error('Error resolving issue:', error);
            throw error;
        }
    }

    public async setIssueGroupMembers(
        issueId: number,
        issueGroupMemberIds: number[]
    ): Promise<RepositoryIssueOrNull> {
        const uniqueMemberIds = Array
            .from(new Set(issueGroupMemberIds))
            .filter((id) => id !== issueId);

        const result = await prisma.$transaction(async (tx) => {
            const sourceIssue = await tx.issue.findUnique({
                where: { issueId },
                select: {
                    issueId: true,
                    issueGroupId: true,
                    status: true,
                }
            });

            if (!sourceIssue) {
                return null;
            }

            const sourceGroupId = await this.ensureIssueGroup(
                tx,
                sourceIssue.issueId,
                sourceIssue.status,
                sourceIssue.issueGroupId
            );

            const sourceGroup = await tx.issueGroup.findUnique({
                where: { issueGroupId: sourceGroupId },
                select: { status: true }
            });

            if (!sourceGroup) {
                return null;
            }

            const currentGroupedIssues = await tx.issue.findMany({
                where: { issueGroupId: sourceGroupId },
                select: { issueId: true }
            });

            const currentMemberIds = currentGroupedIssues
                .map((groupedIssue) => groupedIssue.issueId)
                .filter((id) => id !== issueId);

            const memberIdsToRemove = currentMemberIds
                .filter((id) => !uniqueMemberIds.includes(id));
            const memberIdsToAdd = uniqueMemberIds.filter((id) => !currentMemberIds.includes(id));

            const targetIssues = uniqueMemberIds.length > 0
                ? await tx.issue.findMany({
                    where: {
                        issueId: {
                            in: uniqueMemberIds,
                        }
                    },
                    select: {
                        issueId: true,
                    }
                })
                : [];

            if (targetIssues.length !== uniqueMemberIds.length) {
                return null;
            }

            for (const memberIssueId of memberIdsToRemove) {
                const memberIssue = await tx.issue.findUnique({
                    where: { issueId: memberIssueId },
                    select: {
                        issueId: true,
                        status: true,
                    }
                });

                if (!memberIssue) {
                    continue;
                }

                const newGroup = await tx.issueGroup.create({
                    data: {
                        primaryIssueId: memberIssue.issueId,
                        status: memberIssue.status,
                    }
                });

                await tx.issue.update({
                    where: { issueId: memberIssue.issueId },
                    data: {
                        issueGroupId: newGroup.issueGroupId,
                    }
                });
            }

            for (const memberIssueId of memberIdsToAdd) {
                const memberIssue = await tx.issue.findUnique({
                    where: { issueId: memberIssueId },
                    select: {
                        issueId: true,
                        issueGroupId: true,
                    }
                });

                if (!memberIssue) {
                    continue;
                }

                const previousGroupId = memberIssue.issueGroupId;

                await tx.issue.update({
                    where: { issueId: memberIssue.issueId },
                    data: {
                        issueGroupId: sourceGroupId,
                        status: sourceGroup.status,
                        resolvedAt:
                            sourceGroup.status === IssueStatusEnum.RESOLVED
                                ? new Date()
                                : null,
                    }
                });

                if (previousGroupId && previousGroupId !== sourceGroupId) {
                    const remainingIssuesInPreviousGroup = await tx.issue.findMany({
                        where: { issueGroupId: previousGroupId },
                        select: { issueId: true }
                    });

                    if (remainingIssuesInPreviousGroup.length === 0) {
                        await tx.issueGroup.deleteMany(
                            { where: { issueGroupId: previousGroupId } }
                        );
                    } else {
                        await tx.issueGroup.updateMany({
                            where: { issueGroupId: previousGroupId },
                            data: {
                                primaryIssueId: remainingIssuesInPreviousGroup[0].issueId
                            }
                        });
                    }
                }
            }

            await tx.issueGroup.update({
                where: { issueGroupId: sourceGroupId },
                data: {
                    primaryIssueId: issueId,
                }
            });

            return {
                issueGroupId: sourceGroupId,
            };
        });

        if (!result) {
            return null;
        }

        return this.getIssue(issueId);
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
    }>): Promise<RepositoryIssueOrNull> {
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
                include: this.buildIssueInclude()
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
