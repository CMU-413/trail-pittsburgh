// src/routes/park.routes.ts
import express from 'express';

import { ParkController } from '@/controllers';
import { errorHandlerWrapper } from '@/middlewares';
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
router.get('/:parkId', validateRequest(getParkSchema), errorHandlerWrapper(parkController.getPark)); // Get a specific park
router.get('/', errorHandlerWrapper(parkController.getAllParks)); // Get all parks

// Protected Routes
router.post(
    '/',
    authenticateToken,
    validateRequest(createParkSchema),
    errorHandlerWrapper(parkController.createPark)
); // Create a new park

router.put(
    '/:parkId',
    authenticateToken,
    validateRequest(updateParkSchema),
    errorHandlerWrapper(parkController.updatePark)
); // Update a park

router.delete(
    '/:parkId',
    authenticateToken,
    validateRequest(deleteParkSchema),
    errorHandlerWrapper(parkController.deletePark)
); // Delete a park

export { router as parkRouter };
