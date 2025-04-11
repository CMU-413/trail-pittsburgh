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
    }

    public async getAllTrails(req: express.Request, res: express.Response) {
        try {
            const trails = await this.trailService.getAllTrails();
            res.json(trails);
        } catch (error) {
            console.error('Error fetching all trails:', error);
            res.status(500).json({ message: 'Failed to retrieve trails' });
        }
    }

    public async getTrail(req: express.Request, res: express.Response) {
        try {
            const trailId = Number(req.params.id);
            const trail = await this.trailService.getTrail(trailId);
            
            if (!trail) {
                return res.status(404).json({ message: 'Trail not found' });
            }
            
            res.json(trail);
        } catch (error) {
            console.error('Error fetching trail:', error);
            res.status(500).json({ message: 'Failed to retrieve trail' });
        }
    }

    public async createTrail(req: express.Request, res: express.Response) {
        try {
            console.log('Create trail request received:', req.body);
            const { name, park_id, is_active, is_open } = req.body;
            
            // Validate required fields
            if (!name || !park_id) {
                return res.status(400).json({ message: 'Name and park_id are required' });
            }
            
            const parkId = Number(park_id);
            const isActive = is_active !== undefined ? Boolean(is_active) : true;
            const isOpen = is_open !== undefined ? Boolean(is_open) : true;
            
            const trail = await this.trailService.createTrail({
                name,
                park_id: parkId,
                is_active: isActive,
                is_open: isOpen
            });            
            res.status(201).json(trail);
        } catch (error) {
            console.error('Error creating trail:', error);
            res.status(500).json({ message: 'Failed to create trail' });
        }
    }

    public async updateTrail(req: express.Request, res: express.Response) {
        try {
            const trailId = Number(req.params.id);
            const { is_open } = req.body;
            
            if (is_open === undefined) {
                return res.status(400).json({ message: 'is_open field is required' });
            }
            
            const isOpen = Boolean(is_open);
            const trail = await this.trailService.updateTrailStatus(trailId, isOpen);
            
            if (!trail) {
                return res.status(404).json({ message: 'Trail not found' });
            }
            
            res.json(trail);
        } catch (error) {
            console.error('Error updating trail:', error);
            res.status(500).json({ message: 'Failed to update trail' });
        }
    }

    public async deleteTrail(req: express.Request, res: express.Response) {
        try {
            const trailId = Number(req.params.id);
            const deleted = await this.trailService.deleteTrail(trailId);
            
            if (!deleted) {
                return res.status(404).json({ message: 'Trail not found' });
            }
            
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting trail:', error);
            res.status(500).json({ message: 'Failed to delete trail' });
        }
    }

    public async getTrailsByPark(req: express.Request, res: express.Response) {
        try {
            const parkId = Number(req.params.parkId);
            const trails = await this.trailService.getTrailsByPark(parkId);

            return res.json({ parkId, trails });
        } catch (error) {
            console.error('Error in getTrailsByPark:', error);

            // Type checking for the error
            let errorMessage = 'Server error fetching trails';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return res.status(500).json({ message: errorMessage });
        }
    }
}
