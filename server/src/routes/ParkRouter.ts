// src/routes/park.routes.ts
import express from 'express';

import { ParkController } from '@/controllers';
import {
    requireAdmin, authenticateToken, validateRequest, requireSuperAdmin 
} from '@/middlewares/index';
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
router.get('/', 
    parkController.getAllParks); // Get all parks

// User Routes
// None for now

// Admin Routes
router.get('/:parkId', 
    authenticateToken, 
    validateRequest(getParkSchema), 
    requireAdmin, 
    parkController.getPark); // Get a specific park

router.post(
    '/',
    authenticateToken,
    validateRequest(createParkSchema),
    requireAdmin, 
    parkController.createPark
); // Create a new park

router.put(
    '/:parkId',
    authenticateToken,
    validateRequest(updateParkSchema),
    requireAdmin, 
    parkController.updatePark
); // Update a park

// Super Admin Routes

router.delete(
    '/:parkId',
    authenticateToken,
    validateRequest(deleteParkSchema),
    requireSuperAdmin,
    parkController.deletePark
); // Delete a park

export { router as parkRouter };
