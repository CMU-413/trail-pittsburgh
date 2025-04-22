// src/routes/park.routes.ts
import express from 'express';

import { ParkController } from '@/controllers';
import { authenticateToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { ParkRepository } from '@/repositories';
import {
    createParkSchema,
    deleteParkSchema,
    getParkSchema,
    updateParkSchema
} from '@/schemas/parkSchema';
import { ParkService } from '@/services';

const parkRepository = new ParkRepository();
const parkService = new ParkService(parkRepository);
const parkController = new ParkController(parkService);

const router = express.Router();

// Public Routes
router.get('/:parkId', validateRequest(getParkSchema), parkController.getPark); // Get a specific park
router.get('/', parkController.getAllParks); // Get all parks

// Protected Routes
router.post(
    '/',
    authenticateToken,
    validateRequest(createParkSchema),
    parkController.createPark
); // Create a new park

router.put(
    '/:parkId',
    authenticateToken,
    validateRequest(updateParkSchema),
    parkController.updatePark
); // Update a park

router.delete(
    '/:parkId',
    authenticateToken,
    validateRequest(deleteParkSchema),
    parkController.deletePark
); // Delete a park

export { router as parkRouter };
