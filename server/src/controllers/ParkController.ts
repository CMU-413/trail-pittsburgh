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

        res.json({ data: park });
    }

    public async getAllParks(req: express.Request, res: express.Response) {
        const parks = await this.parkService.getAllParks();
        res.json({ data: parks });
    }

    public async createPark(req: express.Request, res: express.Response) {
        const park = await this.parkService.createPark(req.body.parkName);
        res.status(201).json({ data:park });
    }

    public async updatePark(req: express.Request, res: express.Response) {
        const parkId = Number(req.params.parkId);
        const { isActive } = req.body;
        const updatedPark =
            await this.parkService.updatePark(parkId, { isActive });

        if (!updatedPark) {
            return res.status(404).json({ message: 'Park not found.' });
        }

        res.status(200).json({ data: updatedPark });
    }

    public async deletePark(req: express.Request, res: express.Response) {
        const parkId = Number(req.params.parkId);
        const deleted =
            await this.parkService.deletePark(parkId);

        if (!deleted) {
            return res.status(404).json({ message: 'Park not found.' });
        }

        res.status(204).send();
    }
}

