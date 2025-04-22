import express from 'express';

import { TrailService } from '@/services';

export class TrailController {
    private readonly trailService: TrailService;

    constructor(trailService: TrailService) {
        this.trailService = trailService;

        this.getAllTrails = this.getAllTrails.bind(this);
        this.getTrail = this.getTrail.bind(this);
        this.createTrail = this.createTrail.bind(this);
        this.updateTrail = this.updateTrail.bind(this);
        this.deleteTrail = this.deleteTrail.bind(this);
        this.getTrailsByPark = this.getTrailsByPark.bind(this);
    }

    public async getAllTrails(req: express.Request, res: express.Response) {
        try {
            const trails = await this.trailService.getAllTrails();
            res.status(200).json({ trails });
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve trails' });
        }
    }

    public async getTrail(req: express.Request, res: express.Response) {
        try {
            const trailId = Number(req.params.trailId);
            const trail = await this.trailService.getTrail(trailId);
            
            if (!trail) {
                res.status(404).json({ message: 'Trail not found' });
                return;
            }
            res.json({ trail });
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve trail' });
        }
    }

    public async createTrail(req: express.Request, res: express.Response) {
        console.log('createTrail', req.body);
        try {
            const { name, parkId, isActive, isOpen } = req.body;

            const trail = await this.trailService.createTrail({
                name,
                parkId: parkId,
                isActive: isActive,
                isOpen: isOpen
            });

            res.status(201).json({ trail });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create trail' });
        }
    }

    public async updateTrail(req: express.Request, res: express.Response) {
        try {
            const trailId = Number(req.params.trailId);
            const { isOpen } = req.body;

            const trail = await this.trailService.updateTrailStatus(trailId, isOpen);
            
            if (!trail) {
                res.status(404).json({ message: 'Trail not found' });
                return;
            }
            
            res.json({ trail });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to update trail' });
        }
    }

    public async deleteTrail(req: express.Request, res: express.Response) {
        try {
            const trailId = Number(req.params.trailId);
            const deleted = await this.trailService.deleteTrail(trailId);
            
            if (!deleted) {
                res.status(404).json({ message: 'Trail not found' });
                return;
            }
            
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete trail' });
        }
    }

    public async getTrailsByPark(req: express.Request, res: express.Response) {
        try {
            const parkId = Number(req.params.parkId);
            const trails = await this.trailService.getTrailsByPark(parkId);

            return res.json({ trails });
        } catch (error) {
            // Type checking for the error
            let errorMessage = 'Server error fetching trails';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return res.status(500).json({ message: errorMessage });
        }
    }
}
