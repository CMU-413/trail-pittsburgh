import {
    IssueUrgencyEnum, IssueTypeEnum, IssueStatusEnum
} from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { GCSBucket, SignedUrl } from '@/lib/GCSBucket';
import { IssueRepository } from '@/repositories';
import { CreateIssueInput } from '@/schemas/issueSchema';

export class IssueService {
    private readonly issueRepository: IssueRepository;
    private readonly issueImageBucket: GCSBucket;

    constructor(issueRepository: IssueRepository, imagesBucket: GCSBucket) {
        this.issueRepository = issueRepository;
        this.issueImageBucket = imagesBucket;
    }

    private async getIssueImage(imageKey: string) {

        const signedUrl = await this.issueImageBucket.getDownloadUrl(imageKey);

        const { contentType, metadata } = await this.issueImageBucket.getImageMetadata(imageKey);

        return {
            ...signedUrl,
            contentType,
            metadata: metadata ?? {}
        };
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
        const issue = await this.issueRepository.updateIssueStatus(issueId, status);
        if (!issue) {
            return null;
        }

        const { issueImage } = issue;

        return {
            ...issue,
            ...(issueImage && { image: await this.getIssueImage(issueImage) })
        };
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
