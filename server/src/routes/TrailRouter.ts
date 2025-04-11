// src/routes/trail.routes.ts
import express from 'express';

import { TrailController } from '@/controllers';
import { errorHandlerWrapper } from '@/middlewares';
import { TrailRepository } from '@/repositories';
import { TrailService } from '@/services';

const trailRepository = new TrailRepository();
const trailService = new TrailService(trailRepository);
const trailController = new TrailController(trailService);

const router = express.Router();

// Get all trails
router.get('/', errorHandlerWrapper(trailController.getAllTrails));

// Get a specific trail
router.get('/:id', errorHandlerWrapper(trailController.getTrail));

// Create a new trail
router.post('/', errorHandlerWrapper(trailController.createTrail));

// Update a trail
router.put('/:id', errorHandlerWrapper(trailController.updateTrail));

// Delete a trail
router.delete('/:id', errorHandlerWrapper(trailController.deleteTrail));

export { router as trailRouter };
