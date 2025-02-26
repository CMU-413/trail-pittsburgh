import { IssueRepository } from '@/repositories';

export class IssueService {

    private readonly issueRepository: IssueRepository;

    constructor(issueRepository: IssueRepository) {
        this.issueRepository = issueRepository;
    }
    
    public async getIssue(issueId: number) {
        return this.issueRepository.getIssue(issueId);
    }
}
