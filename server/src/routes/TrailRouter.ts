// src/routes/trail.routes.ts
import express from 'express';

import { TrailController } from '@/controllers';
import { errorHandlerWrapper } from '@/middlewares';
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

// Get all trails
router.get('/', errorHandlerWrapper(trailController.getAllTrails));

// Get a specific trail
router.get('/:trailId', validateRequest(getTrailSchema), errorHandlerWrapper(trailController.getTrail));

// Create a new trail
router.post('/', validateRequest(createTrailSchema), errorHandlerWrapper(trailController.createTrail));

// Update a trail
router.put('/:trailId', validateRequest(updateTrailSchema), errorHandlerWrapper(trailController.updateTrail));

// Delete a trail
router.delete('/:trailId', validateRequest(deleteTrailSchema), errorHandlerWrapper(trailController.deleteTrail));

// Get trails from park
router.get('/park/:parkId', validateRequest(getTrailsFromParkSchema), errorHandlerWrapper(trailController.getTrailsByPark));

export { router as trailRouter };
