import { IssueRepository } from '@/repositories';
import { IssueService } from '@/services';

jest.mock('@/repositories/IssueRepository');

describe('IssueService', () => {
    let issueService: IssueService;
    let issueRepositoryMock: jest.Mocked<IssueRepository>;

    beforeEach(() => {
        // eslint-disable-next-line
        issueRepositoryMock = new IssueRepository() as jest.Mocked<IssueRepository>;
        issueService = new IssueService(issueRepositoryMock);
    });

    test('should create a new issue', async () => {
        const mockIssue = {
            id: 1,
            park_id: 1,
            trail_id: 1,
            type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            createdAt: new Date()
        };
        issueRepositoryMock.createIssue.mockResolvedValue(mockIssue);

        const result = await issueService.createIssue(1, 1, 'Flooding', 3, 'Test issue description');

        expect(issueRepositoryMock.createIssue).toHaveBeenCalledWith(1, 1, 'Flooding', 3, 'Test issue description');
        expect(result).toEqual(mockIssue);
    });

    test('should get an issue by ID', async () => {
        const mockIssue = {
            id: 1,
            park_id: 1,
            trail_id: 1,
            type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            createdAt: new Date()
        };
        issueRepositoryMock.getIssue.mockResolvedValue(mockIssue);

        const result = await issueService.getIssue(1);

        expect(issueRepositoryMock.getIssue).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockIssue);
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
        const mockIssues = [{
            id: 1,
            park_id: 1,
            trail_id: 1,
            type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            createdAt: new Date(),
            park: { park_id: 1, park_name: 'Test Park', is_active: true, created_at: new Date() },
            trail: { trail_id: 1, trail_name: 'Test Trail', location: 'Test Location' }
        }];
        issueRepositoryMock.getIssuesByPark.mockResolvedValue(mockIssues);

        const result = await issueService.getIssuesByPark(1);

        expect(issueRepositoryMock.getIssuesByPark).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockIssues);
    });

    test('should get issues by trail ID', async () => {
        const mockIssues = [{
            id: 1,
            park_id: 1,
            trail_id: 1,
            type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            createdAt: new Date(),
            park: { park_id: 1, park_name: 'Test Park', is_active: true, created_at: new Date() },
            trail: { trail_id: 1, trail_name: 'Test Trail', location: 'Test Location' }
        }];
        issueRepositoryMock.getIssuesByTrail.mockResolvedValue(mockIssues);

        const result = await issueService.getIssuesByTrail(1);

        expect(issueRepositoryMock.getIssuesByTrail).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockIssues);
    });

    test('should get issues by urgency level', async () => {
        const mockIssues = [{
            id: 1,
            park_id: 1,
            trail_id: 1,
            type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            createdAt: new Date(),
            park: { park_id: 1, park_name: 'Test Park', is_active: true, created_at: new Date() },
            trail: { trail_id: 1, trail_name: 'Test Trail', location: 'Test Location' }
        }];
        issueRepositoryMock.getIssuesByUrgency.mockResolvedValue(mockIssues);

        const result = await issueService.getIssuesByUrgency(3);

        expect(issueRepositoryMock.getIssuesByUrgency).toHaveBeenCalledWith(3);
        expect(result).toEqual(mockIssues);
    });
});
