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

router.get('/:id', validateRequest(getParkSchema), errorHandlerWrapper(parkController.getPark));
router.get('/', validateRequest(getAllParksSchema), errorHandlerWrapper(parkController.getAllParks));
router.post('/', validateRequest(createParkSchema), errorHandlerWrapper(parkController.createPark));
router.put('/:id', validateRequest(updateParkSchema), errorHandlerWrapper(parkController.updatePark));
router.delete('/:id', validateRequest(deleteParkSchema), errorHandlerWrapper(parkController.deletePark));

export { router as parkRouter };
