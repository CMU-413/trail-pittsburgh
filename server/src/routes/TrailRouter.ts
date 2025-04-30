// src/routes/trail.routes.ts
import express from 'express';

import { TrailController } from '@/controllers';
import {
    requireAdmin, requireSuperAdmin, authenticateToken, validateRequest 
} from '@/middlewares/index';
import { TrailRepository } from '@/repositories';
import {
    createTrailSchema,
    deleteTrailSchema,
    getTrailSchema,
    getTrailsFromParkSchema,
    updateTrailSchema
} from '@/schemas/trailSchema';
import { TrailService } from '@/services';

const trailRepository = new TrailRepository();
const trailService = new TrailService(trailRepository);
const trailController = new TrailController(trailService);

const router = express.Router();

// Public Routes
router.get('/', trailController.getAllTrails); // Get all trails
router.get('/park/:parkId', validateRequest(getTrailsFromParkSchema), trailController.getTrailsByPark); // Get trails from a park

// User Routes
// None for now

// Admin Routes
router.get('/:trailId', 
    authenticateToken, 
    validateRequest(getTrailSchema), 
    requireAdmin,
    trailController.getTrail); // Get a specific trail

router.post(
    '/',
    authenticateToken,
    validateRequest(createTrailSchema),
    requireAdmin,
    trailController.createTrail
); // Create a new trail

router.put(
    '/:trailId',
    authenticateToken,
    validateRequest(updateTrailSchema),
    requireAdmin,
    trailController.updateTrail
); // Update a trail

// Super Admin Routes
router.delete(
    '/:trailId',
    authenticateToken,
    validateRequest(deleteTrailSchema),
    requireSuperAdmin,
    trailController.deleteTrail
); // Delete a trail

export { router as trailRouter };
