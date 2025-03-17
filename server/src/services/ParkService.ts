import { ParkRepository } from '@/repositories';

export class ParkService {

    private readonly parkRepository: ParkRepository;

    constructor(parkRepository: ParkRepository) {
        this.parkRepository = parkRepository;
    }

    public async getPark(parkId: number) {
        return this.parkRepository.getPark(parkId);
    }

    public async getAllParks() {
        return this.parkRepository.getAllParks();
    }

    public async createPark(parkName: string) {
        return this.parkRepository.createPark(parkName);
    }

    public async updatePark(
        parkId: number, { isActive }: { isActive: boolean }
    ) {
        return this.parkRepository.setParkStatus(parkId, isActive);
    }

    public async deletePark(parkId: number) {
        return this.parkRepository.deletePark(parkId);
    }
}
