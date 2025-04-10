import express from 'express';

import { prisma } from '@/prisma/prismaClient'; // Adjust the import path as needed
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
        res.json(parks);
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
        const parkId = Number(req.params.id);

        const { name, county, owner_id: _, is_active } = req.body;

        if (!name || !county) {
            return res.status(400).json({ message: 'Name and county are required' });
        }

        const updatedPark = await this.parkService.updatePark(parkId, {
            name,
            county,
            is_active
        });

        if (!updatedPark) {
            return res.status(404).json({ message: 'Park not found.' });
        }

        res.status(200).json(updatedPark);
    }

    public async deletePark(req: express.Request, res: express.Response) {
        const parkId = Number(req.params.id);
        const deleted = await this.parkService.deletePark(parkId);

        if (!deleted) {
            return res.status(404).json({ message: 'Park not found.' });
        }

        res.status(204).send();
    }

    // public async getTrailsByPark(req: express.Request, res: express.Response) {
    //     const parkId = Number(req.params.parkId);
    //     const trails = await this.parkService.getTrailsByPark(parkId);
    //     res.json(trails);
    // }
    // public async getTrailsByPark(req: express.Request, res: express.Response) {
    //     try {
    //       const parkId = Number(req.params.id);
    //       console.log('Getting trails for park ID:', parkId);
          
    //       // Return an empty array for now, just to test
    //       return res.json([]);
    //     } catch (error) {
    //       console.error('Error in getTrailsByPark:', error);
    //       return res.status(500).json({ message: 'Server error fetching trails' });
    //     }
    // }
    public async getTrailsByPark(req: express.Request, res: express.Response) {
        try {
            const parkId = Number(req.params.id);
          
            // Try a direct Prisma query
            const trails = await prisma.trail.findMany({
                where: {
                    park_id: parkId
                }
            });
          
            return res.json(trails);
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

