import { TrailRepository } from '@/repositories';
import { TrailService } from '@/services';

jest.mock('@/repositories/TrailRepository');

describe('TrailService', () => {
    let trailService: TrailService;
    let trailRepositoryMock: jest.Mocked<TrailRepository>;

    beforeEach(() => {
        trailRepositoryMock = new TrailRepository() as jest.Mocked<TrailRepository>;
        trailService = new TrailService(trailRepositoryMock);
    });

    test('should create a new trail', async () => {
        const mockTrail = {
            trail_id: 1,
            trail_name: 'Test Trail',
            location: 'Pittsburgh, PA'
        };
        trailRepositoryMock.createTrail.mockResolvedValue(mockTrail);

        const result = await trailService.createTrail('Test Trail', 'Pittsburgh, PA');

        expect(trailRepositoryMock.createTrail).toHaveBeenCalledWith('Test Trail', 'Pittsburgh, PA');
        expect(result).toEqual(mockTrail);
    });

    test('should get a trail by ID', async () => {
        const mockTrail = {
            trail_id: 1,
            trail_name: 'Test Trail',
            location: 'Pittsburgh, PA'
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
                trail_name: 'Test Trail 1',
                location: 'Pittsburgh, PA'
            },
            {
                trail_id: 2,
                trail_name: 'Test Trail 2',
                location: 'Pittsburgh, PA'
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
});
