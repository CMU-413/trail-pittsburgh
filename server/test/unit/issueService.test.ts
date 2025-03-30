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

    test('should create a new issue with default values', async () => {
        const mockIssue = {
            issue_id: 1,
            park_id: 1,
            trail_id: 1,
            issue_type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            is_public: true,
            status: 'Open',
            notify_reporter: true,
            created_at: new Date(),
            resolved_at: null,
            issue_image: null,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            trail: { trail_id: 1, park_id: 1, name: 'Test Trail', is_active: true, is_open: true }
        };
        issueRepositoryMock.createIssue.mockResolvedValue(mockIssue);

        const result = await issueService.createIssue(1, 1, 'Flooding', 3, 'Test issue description');

        expect(issueRepositoryMock.createIssue).toHaveBeenCalledWith(
            1, 1, 'Flooding', 3, 'Test issue description', true, 'Open', true, undefined
        );
        expect(result).toEqual(mockIssue);
    });

    test('should create a new issue with custom values', async () => {
        const mockIssue = {
            issue_id: 1,
            park_id: 1,
            trail_id: 1,
            issue_type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            is_public: false,
            status: 'In Progress',
            notify_reporter: false,
            issue_image: 'test-image.jpg',
            created_at: new Date(),
            resolved_at: null,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            trail: { trail_id: 1, park_id: 1, name: 'Test Trail', is_active: true, is_open: true }
        };
        issueRepositoryMock.createIssue.mockResolvedValue(mockIssue);

        const result = await issueService.createIssue(
            1, 1, 'Flooding', 3, 'Test issue description',
            false, 'In Progress', false, 'test-image.jpg'
        );

        expect(issueRepositoryMock.createIssue).toHaveBeenCalledWith(
            1, 1, 'Flooding', 3, 'Test issue description',
            false, 'In Progress', false, 'test-image.jpg'
        );
        expect(result).toEqual(mockIssue);
    });

    test('should get an issue by ID', async () => {
        const mockIssue = {
            issue_id: 1,
            park_id: 1,
            trail_id: 1,
            issue_type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            is_public: true,
            status: 'Open',
            notify_reporter: true,
            created_at: new Date(),
            resolved_at: null,
            issue_image: null,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            trail: { trail_id: 1, park_id: 1, name: 'Test Trail', is_active: true, is_open: true }
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
            issue_id: 1,
            park_id: 1,
            trail_id: 1,
            issue_type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            is_public: true,
            status: 'Open',
            notify_reporter: true,
            created_at: new Date(),
            resolved_at: null,
            issue_image: null,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            trail: { trail_id: 1, park_id: 1, name: 'Test Trail', is_active: true, is_open: true }
        }];
        issueRepositoryMock.getIssuesByPark.mockResolvedValue(mockIssues);

        const result = await issueService.getIssuesByPark(1);

        expect(issueRepositoryMock.getIssuesByPark).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockIssues);
    });

    test('should get issues by trail ID', async () => {
        const mockIssues = [{
            issue_id: 1,
            park_id: 1,
            trail_id: 1,
            issue_type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            is_public: true,
            status: 'Open',
            notify_reporter: true,
            created_at: new Date(),
            resolved_at: null,
            issue_image: null,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            trail: { trail_id: 1, park_id: 1, name: 'Test Trail', is_active: true, is_open: true }
        }];
        issueRepositoryMock.getIssuesByTrail.mockResolvedValue(mockIssues);

        const result = await issueService.getIssuesByTrail(1);

        expect(issueRepositoryMock.getIssuesByTrail).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockIssues);
    });

    test('should get issues by urgency level', async () => {
        const mockIssues = [{
            issue_id: 1,
            park_id: 1,
            trail_id: 1,
            issue_type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            is_public: true,
            status: 'Open',
            notify_reporter: true,
            created_at: new Date(),
            resolved_at: null,
            issue_image: null,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            trail: { trail_id: 1, park_id: 1, name: 'Test Trail', is_active: true, is_open: true }
        }];
        issueRepositoryMock.getIssuesByUrgency.mockResolvedValue(mockIssues);

        const result = await issueService.getIssuesByUrgency(3);

        expect(issueRepositoryMock.getIssuesByUrgency).toHaveBeenCalledWith(3);
        expect(result).toEqual(mockIssues);
    });

    test('should update issue status', async () => {
        const mockUpdatedIssue = {
            issue_id: 1,
            park_id: 1,
            trail_id: 1,
            issue_type: 'Flooding',
            urgency: 3,
            description: 'Test issue description',
            is_public: true,
            status: 'Resolved',
            notify_reporter: true,
            created_at: new Date(),
            resolved_at: new Date(),
            issue_image: null,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            trail: { trail_id: 1, park_id: 1, name: 'Test Trail', is_active: true, is_open: true }
        };
        issueRepositoryMock.updateIssueStatus.mockResolvedValue(mockUpdatedIssue);

        const result = await issueService.updateIssueStatus(1, 'Resolved');

        expect(issueRepositoryMock.updateIssueStatus).toHaveBeenCalledWith(1, 'Resolved');
        expect(result).toEqual(mockUpdatedIssue);
    });
});
