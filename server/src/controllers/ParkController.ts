import express from 'express';

import { ParkService } from '@/services';

export class ParkController {

    private readonly parkService: ParkService;

    constructor(parkService: ParkService) {
        this.parkService = parkService;

        this.getPark = this.getPark.bind(this);
        this.getAllParks = this.getAllParks.bind(this);
        this.createPark = this.createPark.bind(this);
        this.deletePark = this.deletePark.bind(this);
    }

    public async getPark(req: express.Request, res: express.Response) {
        const park = await this.parkService.getPark(Number(req.params.id));
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

    public async deletePark(req: express.Request, res: express.Response) {
        const deleted =
            await this.parkService.deletePark(Number(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Park not found.' });
        }
        return res.status(204).send();
    }
}

