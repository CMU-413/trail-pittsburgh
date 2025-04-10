import { IssueRepository } from '@/repositories';

interface IssueData {
    park_id: number;
    trail_id: number;
    issue_type: string;
    urgency: number;
    reporter_email: string;
    description?: string;
    is_public?: boolean;
    status?: string;
    notify_reporter?: boolean;
    issue_image?: string;
    longitude?: number;
    latitude?: number;
}

export class IssueService {
    private readonly issueRepository: IssueRepository;

    constructor(issueRepository: IssueRepository) {
        this.issueRepository = issueRepository;
    }

    public async getIssue(issueId: number) {
        return this.issueRepository.getIssue(issueId);
    }

    public async getAllIssues() {
        return this.issueRepository.getAllIssues();
    }

    public async createIssue(data: IssueData) {
        return this.issueRepository.createIssue(data);
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
        return this.issueRepository.updateIssueStatus(issueId, status);
    }
}