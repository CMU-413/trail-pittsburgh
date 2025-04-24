import { TrailRepository } from '@/repositories';
import { TrailService } from '@/services';
import { Urgency, IssueStatus } from '@prisma/client';

jest.mock('@/repositories/TrailRepository');

describe('TrailService', () => {
    let trailService: TrailService;
    let trailRepositoryMock: jest.Mocked<TrailRepository>;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockPark: any;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockIssues: any[];
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockTrails: any[];

    beforeEach(() => {
        trailRepositoryMock = new TrailRepository() as jest.Mocked<TrailRepository>;
        trailService = new TrailService(trailRepositoryMock);

        mockPark = {
            parkId: 1,
            name: 'Test Park',
            county: 'Allegheny',
            isActive: true,
            createdAt: new Date()
        };

        mockIssues = [
            {
                issueId: 101,
                parkId: 1,
                trailId: 1,
                isPublic: true,
                status: IssueStatus.OPEN,
                description: 'First issue',
                issueType: 'Erosion',
                urgency: Urgency.MEDIUM,
                issueImage: null,
                notifyReporter: true,
                reporterEmail: 'user1@example.com',
                longitude: null,
                latitude: null,
                createdAt: new Date(),
                resolvedAt: null
            },
            {
                issueId: 102,
                parkId: 1,
                trailId: 1,
                isPublic: true,
                status: IssueStatus.OPEN,
                description: 'Second issue',
                issueType: 'Flooding',
                urgency: Urgency.HIGH,
                issueImage: null,
                notifyReporter: true,
                reporterEmail: 'user2@example.com',
                longitude: null,
                latitude: null,
                createdAt: new Date(),
                resolvedAt: null
            }
        ];

        mockTrails = [
            {
                trailId: 1,
                parkId: 1,
                name: 'Trail One',
                isActive: true,
                isOpen: true,
                createdAt: new Date(),
                park: mockPark,
                issues: mockIssues
            },
            {
                trailId: 2,
                parkId: 1,
                name: 'Trail Two',
                isActive: true,
                isOpen: false,
                createdAt: new Date(),
                park: mockPark,
                issues: mockIssues
            },
            {
                trailId: 3,
                parkId: 1,
                name: 'Trail Three',
                isActive: false,
                isOpen: true,
                createdAt: new Date(),
                park: mockPark,
                issues: mockIssues
            }
        ];
    });

    test('should create a new trail with default values', async () => {
        trailRepositoryMock.createTrail.mockResolvedValue(mockTrails[0]);

        const trailInput = { name: 'Trail One', parkId: 1 };
        const result = await trailService.createTrail(trailInput);

        expect(trailRepositoryMock.createTrail).toHaveBeenCalledWith({"name": "Trail One", "parkId": 1});
        expect(result).toEqual(mockTrails[0]);
    });

    test('should create a new trail with custom values', async () => {
        trailRepositoryMock.createTrail.mockResolvedValue(mockTrails[2]);

        const trailInput = { name: 'Trail Three', parkId: 1, isActive: false, isOpen: true };
        const result = await trailService.createTrail(trailInput);

        expect(trailRepositoryMock.createTrail).toHaveBeenCalledWith({
            isActive: false,
            isOpen: true,
            name: 'Trail Three',
            parkId: 1
        });
        expect(result).toEqual(mockTrails[2]);
    });

    test('should get a trail by ID', async () => {
        trailRepositoryMock.getTrail.mockResolvedValue(mockTrails[1]);

        const result = await trailService.getTrail(2);

        expect(trailRepositoryMock.getTrail).toHaveBeenCalledWith(2);
        expect(result).toEqual(mockTrails[1]);
    });

    test('should return null if trail is not found', async () => {
        trailRepositoryMock.getTrail.mockResolvedValue(null);

        const result = await trailService.getTrail(999);

        expect(trailRepositoryMock.getTrail).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
    });

    test('should get all trails', async () => {
        trailRepositoryMock.getAllTrails.mockResolvedValue(mockTrails);

        const result = await trailService.getAllTrails();

        expect(trailRepositoryMock.getAllTrails).toHaveBeenCalled();
        expect(result).toEqual(mockTrails);
    });

    test('should delete a trail', async () => {
        trailRepositoryMock.deleteTrail.mockResolvedValue(true);

        const result = await trailService.deleteTrail(1);

        expect(trailRepositoryMock.deleteTrail).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });

    test('should get trails by park ID', async () => {
        trailRepositoryMock.getTrailsByPark.mockResolvedValue(mockTrails);

        const result = await trailService.getTrailsByPark(1);

        expect(trailRepositoryMock.getTrailsByPark).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockTrails);
    });

    test('should update trail status', async () => {
        trailRepositoryMock.getTrail.mockResolvedValue(mockTrails[0]);
        
        const updatedTrail = { ...mockTrails[0], isOpen: false };
        trailRepositoryMock.updateTrail.mockResolvedValue(updatedTrail);

        const trailUpdateData = {
            isActive: false,
            isOpen: true,
            name: 'Trail Three',
        };
        
        const result = await trailService.updateTrail(1, trailUpdateData);

        expect(trailRepositoryMock.getTrail).toHaveBeenCalledWith(1);
        expect(trailRepositoryMock.updateTrail).toHaveBeenCalledWith(1, trailUpdateData);
        expect(result).toEqual(updatedTrail);
    });
});
