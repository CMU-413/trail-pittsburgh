import { TrailRepository } from '@/repositories';
import { TrailData } from '@/utils/types';

export class TrailService {
    private readonly trailRepository: TrailRepository;

    constructor(trailRepository: TrailRepository) {
        this.trailRepository = trailRepository;
    }

    public async getTrail(trailId: number) {
        return await this.trailRepository.getTrail(trailId);
    }

    public async getAllTrails() {
        return this.trailRepository.getAllTrails();
    }

    public async createTrail(trailData: TrailData) {
        return this.trailRepository.createTrail(trailData);
    }

    public async deleteTrail(trailId: number) {
        return this.trailRepository.deleteTrail(trailId);
    }

    public async updateTrail(trailId: number, trailData: Partial<TrailData>) {
        const existingTrail = await this.trailRepository.getTrail(trailId);
        if (!existingTrail) {
            return null;
        }

        return this.trailRepository.updateTrail(trailId, trailData);
    }

    public async getTrailsByPark(parkId: number) {
        return this.trailRepository.getTrailsByPark(parkId);
    }
}
