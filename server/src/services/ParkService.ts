import { ParkRepository } from '@/repositories';
import { ParkData } from '@/utils/types';

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

    public async createPark(parkData: ParkData) {
        return this.parkRepository.createPark(parkData);
    }

    public async updatePark(parkId: number, parkData: Partial<ParkData>) {
        const existingPark = await this.parkRepository.getPark(parkId);
        if (!existingPark) {
            return null;
        }

        return this.parkRepository.updatePark(parkId, parkData);
    }

    public async deletePark(parkId: number) {
        const existingPark = await this.parkRepository.getPark(parkId);
        if (!existingPark) {
            return false;
        }

        return this.parkRepository.deletePark(parkId);
    }

    public async getTrailsByPark(parkId: number) {
        return this.parkRepository.getTrailsByPark(parkId);
    }
}
