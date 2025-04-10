import { IssueRepository } from '@/repositories';
import { IssueService } from '@/services';

jest.mock('@/repositories/IssueRepository');

describe('IssueService', () => {
    let issueService: IssueService;
    let issueRepositoryMock: jest.Mocked<IssueRepository>;

    const baseIssue = {
        issue_id: 1,
        park_id: 1,
        trail_id: 1,
        issue_type: 'Flooding',
        urgency: 3,
        description: 'Trail is flooded',
        is_public: true,
        status: 'Open',
        notify_reporter: true,
        reporter_email: 'reporter@example.com',
        longitude: -79.9901,
        latitude: 40.4406,
        created_at: new Date(),
        resolved_at: null,
        issue_image: null,
        park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true, created_at: new Date() },
        trail: { trail_id: 1, park_id: 1, name: 'Test Trail', is_active: true, is_open: true, created_at: new Date() }
    };

    beforeEach(() => {
        issueRepositoryMock = new IssueRepository() as jest.Mocked<IssueRepository>;
        issueService = new IssueService(issueRepositoryMock);
    });

    test('should create a new issue with required fields', async () => {
        issueRepositoryMock.createIssue.mockResolvedValue(baseIssue);

        const input = {
            park_id: 1,
            trail_id: 1,
            issue_type: 'Flooding',
            urgency: 3,
            reporter_email: 'reporter@example.com'
        };

        const result = await issueService.createIssue(input);

        expect(issueRepositoryMock.createIssue).toHaveBeenCalledWith(input);
        expect(result).toEqual(baseIssue);
    });

    test('should create a new issue with all optional fields', async () => {
        const fullIssue = {
            ...baseIssue,
            is_public: false,
            status: 'In Progress',
            notify_reporter: false,
            issue_image: 'flooded-trail.jpg',
            longitude: -80.001,
            latitude: 40.441
        };

        issueRepositoryMock.createIssue.mockResolvedValue(fullIssue);

        const input = {
            park_id: 1,
            trail_id: 1,
            issue_type: 'Flooding',
            urgency: 3,
            description: 'Very flooded trail',
            is_public: false,
            status: 'In Progress',
            notify_reporter: false,
            issue_image: 'flooded-trail.jpg',
            reporter_email: 'reporter@example.com',
            longitude: -80.001,
            latitude: 40.441
        };

        const result = await issueService.createIssue(input);

        expect(issueRepositoryMock.createIssue).toHaveBeenCalledWith(input);
        expect(result).toEqual(fullIssue);
    });

    test('should get an issue by ID', async () => {
        issueRepositoryMock.getIssue.mockResolvedValue(baseIssue);

        const result = await issueService.getIssue(1);

        expect(issueRepositoryMock.getIssue).toHaveBeenCalledWith(1);
        expect(result).toEqual(baseIssue);
    });

    test('should return null if issue is not found', async () => {
        issueRepositoryMock.getIssue.mockResolvedValue(null);

        const result = await issueService.getIssue(999);

        expect(issueRepositoryMock.getIssue).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
    });

    test('should delete an issue', async () => {
        issueRepositoryMock.deleteIssue.mockResolvedValue(true);

        const result = await issueService.deleteIssue(1);

        expect(issueRepositoryMock.deleteIssue).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });

    test('should get issues by park ID', async () => {
        const issues = [baseIssue];
        issueRepositoryMock.getIssuesByPark.mockResolvedValue(issues);

        const result = await issueService.getIssuesByPark(1);

        expect(issueRepositoryMock.getIssuesByPark).toHaveBeenCalledWith(1);
        expect(result).toEqual(issues);
    });

    test('should get issues by trail ID', async () => {
        const issues = [baseIssue];
        issueRepositoryMock.getIssuesByTrail.mockResolvedValue(issues);

        const result = await issueService.getIssuesByTrail(1);

        expect(issueRepositoryMock.getIssuesByTrail).toHaveBeenCalledWith(1);
        expect(result).toEqual(issues);
    });

    test('should get issues by urgency level', async () => {
        const issues = [baseIssue];
        issueRepositoryMock.getIssuesByUrgency.mockResolvedValue(issues);

        const result = await issueService.getIssuesByUrgency(3);

        expect(issueRepositoryMock.getIssuesByUrgency).toHaveBeenCalledWith(3);
        expect(result).toEqual(issues);
    });

    test('should update issue status', async () => {
        const updated = { ...baseIssue, status: 'resolved', resolved_at: new Date() };
        issueRepositoryMock.updateIssueStatus.mockResolvedValue(updated);

        const result = await issueService.updateIssueStatus(1, 'resolved');

        expect(issueRepositoryMock.updateIssueStatus).toHaveBeenCalledWith(1, 'resolved');
        expect(result).toEqual(updated);
    });
});
