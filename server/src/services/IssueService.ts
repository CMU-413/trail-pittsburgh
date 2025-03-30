import { IssueRepository } from '@/repositories';

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

    public async createIssue(
        parkId: number,
        trailId: number,
        type: string,
        urgency: number,
        description: string,
        isPublic: boolean = true,
        status: string = 'Open',
        notifyReporter: boolean = true,
        issueImage?: string
    ) {
        return this.issueRepository.createIssue(
            parkId,
            trailId,
            type,
            urgency,
            description,
            isPublic,
            status,
            notifyReporter,
            issueImage
        );
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
