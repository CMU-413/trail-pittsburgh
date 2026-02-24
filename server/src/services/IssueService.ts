import {
    IssueUrgencyEnum, IssueTypeEnum, IssueStatusEnum
} from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { GCSBucket, SignedUrl } from '@/lib/GCSBucket';
import { IssueRepository } from '@/repositories';
import { CreateIssueInput } from '@/schemas/issueSchema';
import { IssueNotificationService } from '@/services/IssueNotificationService';
import { logger } from '@/utils/logger';

export class IssueService {
    private readonly issueRepository: IssueRepository;
    private readonly issueImageBucket: GCSBucket;
    private readonly issueNotificationService: IssueNotificationService;

    constructor(
        issueRepository: IssueRepository,
        imagesBucket: GCSBucket,
        issueNotificationService: IssueNotificationService
    ) {
        this.issueRepository = issueRepository;
        this.issueImageBucket = imagesBucket;
        this.issueNotificationService = issueNotificationService;
    }

    private async getIssueImage(imageKey: string) {

        try {
            const signedUrl = await this.issueImageBucket.getDownloadUrl(imageKey);

            const {
                contentType,
                metadata
            } = await this.issueImageBucket.getImageMetadata(imageKey);

            return {
                ...signedUrl,
                contentType,
                metadata: metadata ?? {}
            };

        } catch (error) {
            logger.error(`Could not find issue image with key ${imageKey}`);
            logger.error(error);
            
            return {
                errorMessage: 'Error: Unable to load image'
            };
        }
    }

    public async getIssue(issueId: number) {
        const issue = await this.issueRepository.getIssue(issueId);
        if (!issue) {
            return null;
        }

        const { issueImage } = issue;

        return {
            ...issue,
            ...(issueImage && { image: await this.getIssueImage(issueImage) })
        };
    }

    public async getAllIssues() {
        return this.issueRepository.getAllIssues();
    }

    public async createIssue(data: CreateIssueInput) {
        const { imageMetadata } = data;
        let key: string | undefined;
        let signedUrl: SignedUrl | undefined;

        if (imageMetadata) {
            // Generate image key
            const ext = imageMetadata.contentType.split('/')[1];
            key = `${uuid()}.${ext}`;

            signedUrl = await this.issueImageBucket.getUploadUrl(key, imageMetadata);
        }

        const newIssueInput = {
            issueImageKey: key,
            ...data
        };

        const issue = await this.issueRepository.createIssue(newIssueInput);

        await this.issueNotificationService.sendIssueCreatedConfirmation(issue);

        return {
            issue,
            signedUrl,
        };
    }

    public async deleteIssue(issueId: number) {
        return this.issueRepository.deleteIssue(issueId);
    }

    public async getIssuesByPark(parkId: number) {
        return this.issueRepository.getIssuesByPark(parkId);
    }

    public async getIssuesByTrail(trailId: number) {
        return this.issueRepository.getIssuesByTrail(trailId);
    }

    public async getIssuesByUrgency(urgencyLevel: IssueUrgencyEnum) {
        return this.issueRepository.getIssuesByUrgency(urgencyLevel);
    }

    public async updateIssueStatus(issueId: number, status: IssueStatusEnum) {
        const existingIssue = await this.issueRepository.getIssue(issueId);

        if (!existingIssue) {
            return null;
        }

        const issue = await this.issueRepository.updateIssueStatus(issueId, status);
        if (!issue) {
            return null;
        }

        const statusChanged = existingIssue.status !== status;

        if (statusChanged && status === IssueStatusEnum.IN_PROGRESS) {
            await this.issueNotificationService.sendIssueInProgressUpdate(issue);
        }

        if (statusChanged && status === IssueStatusEnum.RESOLVED) {
            await this.issueNotificationService.sendIssueResolvedUpdate(issue);
        }

        const { issueImage } = issue;

        return {
            ...issue,
            ...(issueImage && { image: await this.getIssueImage(issueImage) })
        };
    }

    public async unsubscribeReporter(issueId: number, token: string) {
        const payload = this.issueNotificationService.verifyUnsubscribeToken(token);

        if (!payload || payload.issueId !== issueId) {
            return 'invalid-token' as const;
        }

        const issue = await this.issueRepository.getIssue(issueId);
        if (!issue) {
            return 'issue-not-found' as const;
        }

        if (issue.reporterEmail.toLowerCase() !== payload.email.toLowerCase()) {
            return 'invalid-token' as const;
        }

        if (!issue.notifyReporter) {
            return 'already-unsubscribed' as const;
        }

        const updated = 
            await this.issueRepository.disableReporterNotifications(issueId, issue.reporterEmail);
        return updated ? 'unsubscribed' as const : 'invalid-token' as const;
    }

    public async updateIssue(issueId: number, data: {
        description?: string;
        urgency?: IssueUrgencyEnum;
        issueType?: IssueTypeEnum;
        parkId?: number;
        trailId?: number;
    }) {
        const issue = await this.issueRepository.updateIssue(issueId, data);

        if (!issue) {
            return null;
        }

        const { issueImage } = issue;

        return {
            ...issue,
            ...(issueImage && { image: await this.getIssueImage(issueImage) })
        };
    }
}
