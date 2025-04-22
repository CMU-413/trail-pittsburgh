import express from 'express';

import { ParkService } from '@/services';

export class ParkController {

    private readonly parkService: ParkService;

    constructor(parkService: ParkService) {
        this.parkService = parkService;

        this.getPark = this.getPark.bind(this);
        this.getAllParks = this.getAllParks.bind(this);
        this.createPark = this.createPark.bind(this);
        this.updatePark = this.updatePark.bind(this);
        this.deletePark = this.deletePark.bind(this);
    }

    public async getPark(req: express.Request, res: express.Response) {
        const parkId = Number(req.params.parkId);
        const park = await this.parkService.getPark(parkId);

        if (!park) {
            res.status(404).json({ message: 'Park not found.' });
        }

        return res.status(200).json({ park });
    }

    public async getAllParks(req: express.Request, res: express.Response) {
        const parks = await this.parkService.getAllParks();
        res.json({ parks });
    }

    public async createPark(req: express.Request, res: express.Response) {
        console.log('Create park request received:', req.body);
        const { name, county, ownerId, isActive } = req.body;

        // Validate required fields
        if (!name || !county) {
            return res.status(400).json({ message: 'Name and county are required' });
        }

        // Create park with all required properties
        const parkData = {
            name,
            county,
            ownerId: ownerId || null,
            isActive: isActive !== undefined ? isActive : true
        };

        const park = await this.parkService.createPark(parkData);
        return res.status(201).json({ park });
    }

    public async updatePark(req: express.Request, res: express.Response) {
        const parkId = Number(req.params.parkId);

        const { name, county, isActive } = req.body;

        const updatedPark = await this.parkService.updatePark(parkId, {
            name,
            county,
            isActive
        });

        if (!updatedPark) {
            return res.status(404).json({ message: 'Park not found.' });
        }

        res.status(200).json({ park:updatedPark });
    }

    public async deletePark(req: express.Request, res: express.Response) {
        const parkId = Number(req.params.id);
        const deleted = await this.parkService.deletePark(parkId);

        if (!deleted) {
            return res.status(404).json({ message: 'Park not found.' });
        }

        res.status(204).send();
    }
}

