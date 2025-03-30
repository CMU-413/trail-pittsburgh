import { TrailRepository } from '@/repositories';
import { TrailService } from '@/services';

jest.mock('@/repositories/TrailRepository');

describe('TrailService', () => {
    let trailService: TrailService;
    let trailRepositoryMock: jest.Mocked<TrailRepository>;

    beforeEach(() => {
        // eslint-disable-next-line
        trailRepositoryMock = new TrailRepository() as jest.Mocked<TrailRepository>;
        trailService = new TrailService(trailRepositoryMock);
    });

    test('should create a new trail with default values', async () => {
        const mockTrail = {
            trail_id: 1,
            park_id: 1,
            name: 'Test Trail',
            is_active: true,
            is_open: true,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            issues: []
        };
        trailRepositoryMock.createTrail.mockResolvedValue(mockTrail);

        const result = await trailService.createTrail('Test Trail', 1);

        expect(trailRepositoryMock.createTrail).toHaveBeenCalledWith('Test Trail', 1, true, true);
        expect(result).toEqual(mockTrail);
    });

    test('should create a new trail with custom values', async () => {
        const mockTrail = {
            trail_id: 1,
            park_id: 1,
            name: 'Test Trail',
            is_active: false,
            is_open: false,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            issues: []
        };
        trailRepositoryMock.createTrail.mockResolvedValue(mockTrail);

        const result = await trailService.createTrail('Test Trail', 1, false, false);

        expect(trailRepositoryMock.createTrail).toHaveBeenCalledWith('Test Trail', 1, false, false);
        expect(result).toEqual(mockTrail);
    });

    test('should get a trail by ID', async () => {
        const mockTrail = {
            trail_id: 1,
            park_id: 1,
            name: 'Test Trail',
            is_active: true,
            is_open: true,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            issues: []
        };
        trailRepositoryMock.getTrail.mockResolvedValue(mockTrail);

        const result = await trailService.getTrail(1);

        expect(trailRepositoryMock.getTrail).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockTrail);
    });

    test('should return null if trail is not found', async () => {
        trailRepositoryMock.getTrail.mockResolvedValue(null);

        const result = await trailService.getTrail(999);

        expect(trailRepositoryMock.getTrail).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
    });

    test('should get all trails', async () => {
        const mockTrails = [
            {
                trail_id: 1,
                park_id: 1,
                name: 'Test Trail 1',
                is_active: true,
                is_open: true,
                park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
                issues: []
            },
            {
                trail_id: 2,
                park_id: 1,
                name: 'Test Trail 2',
                is_active: true,
                is_open: true,
                park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
                issues: []
            }
        ];
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
        const mockTrails = [
            {
                trail_id: 1,
                park_id: 1,
                name: 'Test Trail 1',
                is_active: true,
                is_open: true,
                park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
                issues: []
            },
            {
                trail_id: 2,
                park_id: 1,
                name: 'Test Trail 2',
                is_active: true,
                is_open: true,
                park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
                issues: []
            }
        ];
        trailRepositoryMock.getTrailsByPark.mockResolvedValue(mockTrails);

        const result = await trailService.getTrailsByPark(1);

        expect(trailRepositoryMock.getTrailsByPark).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockTrails);
    });

    test('should update trail status', async () => {
        const mockUpdatedTrail = {
            trail_id: 1,
            park_id: 1,
            name: 'Test Trail',
            is_active: true,
            is_open: false,
            park: { park_id: 1, name: 'Test Park', county: 'Allegheny', is_active: true },
            issues: []
        };
        trailRepositoryMock.updateTrailStatus.mockResolvedValue(mockUpdatedTrail);

        const result = await trailService.updateTrailStatus(1, false);

        expect(trailRepositoryMock.updateTrailStatus).toHaveBeenCalledWith(1, false);
        expect(result).toEqual(mockUpdatedTrail);
    });
});
