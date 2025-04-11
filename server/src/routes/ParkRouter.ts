import express from 'express';

import { ParkController } from '@/controllers';
import { errorHandlerWrapper } from '@/middlewares';
import { validateRequest } from '@/middlewares/validateRequest';
import { ParkRepository } from '@/repositories';
import {
    createParkSchema,
    deleteParkSchema,
    getAllParksSchema,
    getParkSchema,
    updateParkSchema
} from '@/schemas/parkSchema';
import { ParkService } from '@/services';

const parkRepository = new ParkRepository();
const parkService = new ParkService(parkRepository);
const parkController = new ParkController(parkService);

const router = express.Router();

router.get('/:parkId', validateRequest(getParkSchema), errorHandlerWrapper(parkController.getPark));
router.get('/', validateRequest(getAllParksSchema), errorHandlerWrapper(parkController.getAllParks));
router.post('/', validateRequest(createParkSchema), errorHandlerWrapper(parkController.createPark));
router.put('/:parkId', validateRequest(updateParkSchema), errorHandlerWrapper(parkController.updatePark));
router.delete('/:parkId', validateRequest(deleteParkSchema), errorHandlerWrapper(parkController.deletePark));

router.get('/:id/trails', (req, res, next) => {
    console.log('Route hit: GET /parks/:id/trails, params:', req.params);
    next();
}, errorHandlerWrapper(parkController.getTrailsByPark));

export { router as parkRouter };
