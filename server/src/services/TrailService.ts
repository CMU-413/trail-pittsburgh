import { TrailRepository } from '@/repositories';

interface TrailData {
    name: string;
    parkId: number;
    isActive?: boolean;
    isOpen?: boolean;
}

export class TrailService {
    private readonly trailRepository: TrailRepository;

    constructor(trailRepository: TrailRepository) {
        this.trailRepository = trailRepository;
    }

    public async getTrail(trailId: number) {
        return this.trailRepository.getTrail(trailId);
    }

    public async getAllTrails() {
        return this.trailRepository.getAllTrails();
    }

    public async createTrail(trailData: TrailData) {
        console.log('Service TrailData', trailData);
        const {
            name,
            parkId,
            isActive = true,
            isOpen = true
        } = trailData;

        return this.trailRepository.createTrail(name, parkId, isActive, isOpen);
    }

    public async deleteTrail(trailId: number) {
        return this.trailRepository.deleteTrail(trailId);
    }

    public async getTrailsByPark(parkId: number) {
        return this.trailRepository.getTrailsByPark(parkId);
    }

    public async updateTrailStatus(trailId: number, isOpen: boolean) {
        return this.trailRepository.updateTrailStatus(trailId, isOpen);
    }
}
