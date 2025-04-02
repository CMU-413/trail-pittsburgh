import express from 'express';

import { ParkController } from '@/controllers';
import { errorHandlerWrapper } from '@/middlewares';
import { ParkRepository } from '@/repositories';
import { ParkService } from '@/services';

const parkRepository = new ParkRepository();
const parkService = new ParkService(parkRepository);
const parkController = new ParkController(parkService);

const router = express.Router();

router.get('/:id', errorHandlerWrapper(parkController.getPark));
router.get('/', errorHandlerWrapper(parkController.getAllParks));
router.post('/', errorHandlerWrapper(parkController.createPark));
router.put('/:id', errorHandlerWrapper(parkController.updatePark));
router.delete('/:id', errorHandlerWrapper(parkController.deletePark));

router.get('/:id/trails', (req, res, next) => {
    console.log('Route hit: GET /parks/:id/trails, params:', req.params);
    next();
  }, errorHandlerWrapper(parkController.getTrailsByPark));

export { router as parkRouter };
