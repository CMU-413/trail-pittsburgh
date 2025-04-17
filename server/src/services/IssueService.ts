import { v4 as uuid } from 'uuid';

import { GCSBucket, SignedUrl } from '@/lib/GCSBucket';
import { IssueRepository } from '@/repositories';
import {
    CreateIssueInput
} from '@/schemas/issueSchema';
import { IssueRecord } from '@/types/issueTypes';

export class IssueService {
    private readonly issueRepository: IssueRepository;
    private readonly issueImageBucket: GCSBucket;

    constructor(issueRepository: IssueRepository, imagesBucket: GCSBucket) {
        this.issueRepository = issueRepository;
        this.issueImageBucket = imagesBucket;
    }

    private async buildIssueWithUrl(issue: IssueRecord) {
        const { issue_image, ...rest } = issue;
        const image = issue_image ?
            await this.issueImageBucket.getDownloadUrl(issue_image) :
            undefined;
        return {
            image,
            ...rest
        };
    }

    public async getIssue(issueId: number) {
        const issue = await this.issueRepository.getIssue(issueId);
        if (!issue) {
            return null;
        }

        return this.buildIssueWithUrl(issue);
    }

    public async getAllIssues() {
        return this.issueRepository.getAllIssues();
    }

    public async createIssue(data: CreateIssueInput) {
        const { image_type } = data;
        let key: string | undefined;
        let signedUrl: SignedUrl | undefined;

        if (image_type) {
            // Generate image key
            const ext = image_type.split('/')[1];
            key = `${uuid()}.${ext}`;

            signedUrl = await this.issueImageBucket.getUploadUrl(key, image_type);
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

    public async getIssuesByUrgency(urgencyLevel: number) {
        return this.issueRepository.getIssuesByUrgency(urgencyLevel);
    }

    public async updateIssueStatus(issueId: number, status: string) {
        console.log("I went thru service.");
        return this.issueRepository.updateIssueStatus(issueId, status);
    }
}
