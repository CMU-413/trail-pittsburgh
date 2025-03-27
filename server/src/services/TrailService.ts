import { TrailRepository } from '@/repositories';

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

    public async createTrail(trailName: string, location?: string) {
        return this.trailRepository.createTrail(trailName, location);
    }

    public async deleteTrail(trailId: number) {
        return this.trailRepository.deleteTrail(trailId);
    }
}
