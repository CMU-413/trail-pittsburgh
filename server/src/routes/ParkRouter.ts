import express from 'express';

import { ParkController } from '@/controllers';
import { errorHandlerWrapper } from '@/middlewares';
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

router.get('/:parkId', validateRequest(getParkSchema), errorHandlerWrapper(parkController.getPark));
router.get('/', errorHandlerWrapper(parkController.getAllParks));
router.post('/', validateRequest(createParkSchema), errorHandlerWrapper(parkController.createPark));
router.put('/:parkId', validateRequest(updateParkSchema), errorHandlerWrapper(parkController.updatePark));
router.delete('/:parkId', validateRequest(deleteParkSchema), errorHandlerWrapper(parkController.deletePark));

export { router as parkRouter };
