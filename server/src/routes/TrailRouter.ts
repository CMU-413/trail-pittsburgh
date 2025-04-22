// src/routes/trail.routes.ts
import express from 'express';

import { TrailController } from '@/controllers';
import { authenticateToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
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

//Public Routes
router.get('/', trailController.getAllTrails); // Get all trails
router.get('/:trailId', validateRequest(getTrailSchema), trailController.getTrail); // Get a specific trail
router.get(
    '/park/:parkId', 
    validateRequest(getTrailsFromParkSchema), 
    trailController.getTrailsByPark
); // Get trails from a park

// Protected Routes
router.post(
    '/',
    authenticateToken,
    validateRequest(createTrailSchema),
    trailController.createTrail
); // Create a new trail

router.put(
    '/:trailId',
    authenticateToken,
    validateRequest(updateTrailSchema),
    trailController.updateTrail
); // Update a trail

router.delete(
    '/:trailId',
    authenticateToken,
    validateRequest(deleteTrailSchema),
    trailController.deleteTrail
); // Delete a trail

export { router as trailRouter };
