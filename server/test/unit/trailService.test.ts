import { TrailRepository } from '@/repositories';
import { TrailService } from '@/services';

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
            park_id: 1,
            name: 'Test Park',
            county: 'Allegheny',
            is_active: true,
            created_at: new Date()
        };

        mockIssues = [
            {
                issue_id: 101,
                park_id: 1,
                trail_id: 1,
                is_public: true,
                status: 'Open',
                description: 'First issue',
                issue_type: 'Erosion',
                urgency: 3,
                issue_image: null,
                notify_reporter: true,
                reporter_email: 'user1@example.com',
                longitude: null,
                latitude: null,
                created_at: new Date(),
                resolved_at: null
            },
            {
                issue_id: 102,
                park_id: 1,
                trail_id: 1,
                is_public: true,
                status: 'Open',
                description: 'Second issue',
                issue_type: 'Flooding',
                urgency: 4,
                issue_image: null,
                notify_reporter: true,
                reporter_email: 'user2@example.com',
                longitude: null,
                latitude: null,
                created_at: new Date(),
                resolved_at: null
            }
        ];

        mockTrails = [
            {
                trail_id: 1,
                park_id: 1,
                name: 'Trail One',
                is_active: true,
                is_open: true,
                created_at: new Date(),
                park: mockPark,
                issues: mockIssues
            },
            {
                trail_id: 2,
                park_id: 1,
                name: 'Trail Two',
                is_active: true,
                is_open: false,
                created_at: new Date(),
                park: mockPark,
                issues: mockIssues
            },
            {
                trail_id: 3,
                park_id: 1,
                name: 'Trail Three',
                is_active: false,
                is_open: true,
                created_at: new Date(),
                park: mockPark,
                issues: mockIssues
            }
        ];
    });

    test('should create a new trail with default values', async () => {
        trailRepositoryMock.createTrail.mockResolvedValue(mockTrails[0]);

        const trailInput = { name: 'Trail One', parkId: 1 };
        const result = await trailService.createTrail(trailInput);

        expect(trailRepositoryMock.createTrail).toHaveBeenCalledWith('Trail One', 1, true, true);
        expect(result).toEqual(mockTrails[0]);
    });

    test('should create a new trail with custom values', async () => {
        trailRepositoryMock.createTrail.mockResolvedValue(mockTrails[2]);

        const trailInput = { name: 'Trail Three', parkId: 1, isActive: false, isOpen: true };
        const result = await trailService.createTrail(trailInput);

        expect(trailRepositoryMock.createTrail).toHaveBeenCalledWith('Trail Three', 1, false, true);
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
        const updatedTrail = { ...mockTrails[0], is_open: false };
        trailRepositoryMock.updateTrailStatus.mockResolvedValue(updatedTrail);

        const result = await trailService.updateTrailStatus(1, false);

        expect(trailRepositoryMock.updateTrailStatus).toHaveBeenCalledWith(1, false);
        expect(result).toEqual(updatedTrail);
    });
});
