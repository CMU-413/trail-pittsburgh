import express from 'express';

import { TrailService } from '@/services';
import { logger } from '@/utils/logger';

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
            logger.error(`Error fetching all trails`, error);
            res.status(500).json({ message: 'Failed to retrieve trails' });
        }
    }

    public async getTrail(req: express.Request, res: express.Response) {
        const trailId = Number(req.params.trailId);

        try {
            const trail = await this.trailService.getTrail(trailId);
            
            if (!trail) {
                res.status(404).json({ message: 'Trail not found' });
                return;
            }
            res.json({ trail });
        } catch (error) {
            logger.error(`Error fetching trail ${trailId}`, error);
            res.status(500).json({ message: 'Failed to retrieve trail' });
        }
    }

    public async createTrail(req: express.Request, res: express.Response) {
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
        const trailId = Number(req.params.trailId);

        try {
            const { name, isOpen, isActive } = req.body;

            const updatedTrail = await this.trailService.updateTrail(trailId, {
                name,
                isOpen,
                isActive
            });
            
            if (!updatedTrail) {
                res.status(404).json({ message: 'Trail not found.' });
                return;
            }
            
            res.status(200).json({ trail:updatedTrail });
        } catch (error) {
            logger.error(`Error updating trail ${trailId}`, error);
            res.status(500).json({ message: 'Failed to update trail' });
        }
    }

    public async deleteTrail(req: express.Request, res: express.Response) {
        const trailId = Number(req.params.trailId);

        try {
            const deleted = await this.trailService.deleteTrail(trailId);
            
            if (!deleted) {
                res.status(404).json({ message: 'Trail not found' });
                return;
            }
            
            res.status(204).send();
        } catch (error) {
            logger.error(`Error deleting trail ${trailId}`, error);
            res.status(500).json({ message: 'Failed to delete trail' });
        }
    }

    public async getTrailsByPark(req: express.Request, res: express.Response) {
        const parkId = Number(req.params.parkId);

        try {
            const trails = await this.trailService.getTrailsByPark(parkId);

            res.json({ trails });
        } catch (error) {
            logger.error(`Error fetching trails by park ${parkId}`, error);
            // Type checking for the error
            let errorMessage = 'Server error fetching trails';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            res.status(500).json({ message: errorMessage });
        }
    }
}
