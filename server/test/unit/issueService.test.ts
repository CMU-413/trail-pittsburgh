import { GCSBucket, SignedUrl } from '@/lib/GCSBucket';
import { IssueRepository } from '@/repositories';
import { CreateIssueInput } from '@/schemas/issueSchema';
import { IssueService } from '@/services';
import { IssueNotificationService } from '@/services/IssueNotificationService';
import { IssueStatusEnum, IssueTypeEnum, IssueRiskEnum } from '@prisma/client';

jest.mock('@/repositories/IssueRepository');
jest.mock('@/lib/GCSBucket');

describe('IssueService', () => {
    let issueService: IssueService;
    let issueRepositoryMock: jest.Mocked<IssueRepository>;
    let issueImageBucketMock: jest.Mocked<GCSBucket>;
    let issueNotificationServiceMock: jest.Mocked<IssueNotificationService>;

    const uploadUrl: SignedUrl = {
        url: 'test.jpg',
        key: 'unique',
    };

    const baseIssue = {
        issueId: 1,
        parkId: 1,
        trailId: 1,
        issueType: IssueTypeEnum.FLOODING,
        safetyRisk: IssueRiskEnum.NO_RISK,
        description: 'Trail is flooded',
        isPublic: true,
        isImagePublic: false,
        status: IssueStatusEnum.OPEN,
        notifyReporter: true,
        reporterEmail: 'reporter@example.com',
        longitude: -79.9901,
        latitude: 40.4406,
        createdAt: new Date(),
        resolvedAt: null,
        issueImage: null,
        park: { parkId: 1, name: 'Test Park', county: 'Allegheny', isActive: true, createdAt: new Date() },
        trail: { trailId: 1, parkId: 1, name: 'Test Trail', isActive: true, isOpen: true, createdAt: new Date() }
    };

    beforeEach(() => {
        issueRepositoryMock = new IssueRepository() as jest.Mocked<IssueRepository>;
        issueImageBucketMock = {
            getUploadUrl: jest.fn().mockReturnValue(uploadUrl),
            getDownloadUrl: jest.fn().mockReturnValue(uploadUrl),
        } as unknown as jest.Mocked<GCSBucket>;

        issueNotificationServiceMock = {
            sendIssueCreatedConfirmation: jest.fn(),
            sendIssueInProgressUpdate: jest.fn(),
            sendIssueResolvedUpdate: jest.fn(),
            verifyUnsubscribeToken: jest.fn(),
        } as unknown as jest.Mocked<IssueNotificationService>;

        issueService = new IssueService(
            issueRepositoryMock,
            issueImageBucketMock,
            issueNotificationServiceMock
        );
    });

    test('should create a new issue with required fields', async () => {
        issueRepositoryMock.createIssue.mockResolvedValue(baseIssue);
        issueImageBucketMock.getUploadUrl.mockResolvedValue(uploadUrl);

        const input: CreateIssueInput = {
            parkId: 1,
            trailId: 1,
            issueType: IssueTypeEnum.FLOODING,
            safetyRisk: IssueRiskEnum.NO_RISK,
            reporterEmail: 'reporter@example.com',
            description: 'Trail is flooded',
            latitude: 40.4406,
            longitude: -79.9901,
            isPublic: true,
            isImagePublic: false,
            status: IssueStatusEnum.OPEN,
            notifyReporter: true,
            imageMetadata: {
                contentType: 'image/jpeg'
            },
        };

        const result = await issueService.createIssue(input);

        expect(issueRepositoryMock.createIssue).toHaveBeenCalled();
        expect(result).toEqual({ signedUrl:uploadUrl, issue: baseIssue });
    });

    test('should create a new issue with all optional fields', async () => {
        const fullIssue = {
            ...baseIssue,
            isPublic: false,
            isImagePublic: false,
            status: IssueStatusEnum.IN_PROGRESS,
            notifyReporter: false,
            longitude: -80.001,
            latitude: 40.441
        };

        issueRepositoryMock.createIssue.mockResolvedValue(fullIssue);

        const input = {
            parkId: 1,
            trailId: 1,
            issueType: IssueTypeEnum.FLOODING,
            safetyRisk: IssueRiskEnum.NO_RISK,
            description: 'Very flooded trail',
            isPublic: false,
            isImagePublic: false,
            status: IssueStatusEnum.IN_PROGRESS,
            notifyReporter: false,
            reporterEmail: 'reporter@example.com',
            longitude: -80.001,
            latitude: 40.441
        };

        const result = await issueService.createIssue(input);

        expect(issueRepositoryMock.createIssue).toHaveBeenCalledWith(input);
        expect(result).toEqual({ issue: fullIssue });
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

    test('should update issue status', async () => {
        const updated = { ...baseIssue, status: IssueStatusEnum.RESOLVED, resolvedAt: new Date() };
        issueRepositoryMock.getIssue.mockResolvedValue(baseIssue);
        issueRepositoryMock.updateIssueStatus.mockResolvedValue(updated);

        const result = await issueService.updateIssueStatus(1, IssueStatusEnum.RESOLVED);

        expect(issueRepositoryMock.updateIssueStatus).toHaveBeenCalledWith(1, IssueStatusEnum.RESOLVED);
        expect(result).toEqual(updated);
    });
});
