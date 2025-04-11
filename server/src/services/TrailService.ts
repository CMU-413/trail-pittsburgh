import { TrailRepository } from '@/repositories';

interface TrailData {
    name: string;
    park_id: number;
    is_active?: boolean;
    is_open?: boolean;
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
        const {
            name,
            park_id,
            is_active = true,
            is_open = true
        } = trailData;

        return this.trailRepository.createTrail(name, park_id, is_active, is_open);
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
