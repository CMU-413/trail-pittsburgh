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
        const parkId = Number(req.params.id);
        const park = await this.parkService.getPark(parkId);

        if (!park) {
            res.status(404).json({ message: 'Park not found.' });
        }

        return res.status(200).json({ data: park });
    }

    public async getAllParks(req: express.Request, res: express.Response) {
        const parks = await this.parkService.getAllParks();
        res.json({ data: parks });
    }

    public async createPark(req: express.Request, res: express.Response) {
        console.log('Create park request received:', req.body);
        const { name, county, owner_id, is_active } = req.body;

        // Validate required fields
        if (!name || !county) {
            return res.status(400).json({ message: 'Name and county are required' });
        }

        // Create park with all required properties
        const parkData = {
            name,
            county,
            owner_id: owner_id || null,
            is_active: is_active !== undefined ? is_active : true
        };

        const park = await this.parkService.createPark(parkData);
        return res.status(201).json({ data: park });
    }

    public async updatePark(req: express.Request, res: express.Response) {
        const parkId = Number(req.params.parkId);

        const { name, county, is_active } = req.body;

        // TODO fix
        if (!name || !county) {
            res.status(400).json({ message: 'Name and county are required' });
            return;
        }

        const updatedPark = await this.parkService.updatePark(parkId, {
            name,
            county,
            is_active
        });

        if (!updatedPark) {
            return res.status(404).json({ message: 'Park not found.' });
        }

        res.status(200).json({ data: updatedPark });
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

