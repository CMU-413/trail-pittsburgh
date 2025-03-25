import { ParkRepository } from '@/repositories';
import { ParkService } from '@/services';

jest.mock('@/repositories/ParkRepository');

describe('ParkService', () => {
    let parkService: ParkService;
    let parkRepositoryMock: jest.Mocked<ParkRepository>;
    const mockPark = {
        park_id: 1,
        name: 'Test Park',
        county: "mockC",
        is_active: true,
        created_at: new Date()
    };

    beforeEach(() => {
        parkRepositoryMock =
            new ParkRepository() as jest.Mocked<ParkRepository>;
        parkService = new ParkService(parkRepositoryMock);
    });

    test('should create a new park', async () => {
        parkRepositoryMock.createPark.mockResolvedValue(mockPark);

        const result = await parkService.createPark('Test Park');

        expect(parkRepositoryMock.createPark).toHaveBeenCalledWith('Test Park');
        expect(result).toEqual(mockPark);
    });

    test('should get a park by ID', async () => {
        
        parkRepositoryMock.getPark.mockResolvedValue(mockPark);

        const result = await parkService.getPark(1);

        expect(parkRepositoryMock.getPark).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockPark);
    });

    test('should return null if park is not found', async () => {
        parkRepositoryMock.getPark.mockResolvedValue(null);

        const result = await parkService.getPark(999);

        expect(parkRepositoryMock.getPark).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
    });

    test('should delete a park', async () => {
        parkRepositoryMock.deletePark.mockResolvedValue(true);

        const result = await parkService.deletePark(1);

        expect(parkRepositoryMock.deletePark).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });
});
