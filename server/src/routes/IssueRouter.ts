import express from 'express';

import { IssueController } from '@/controllers/';
import { errorHandlerWrapper } from '@/middlewares';
import { validateRequest } from '@/middlewares/validateRequest';
import { IssueRepository } from '@/repositories';
import {
    createIssueSchema, deleteIssueSchema,
    getIssuesByParkSchema,
    getIssuesByTrailSchema,
    getIssuesByUrgencySchema,
    getIssueSchema, updateIssueStatusSchema
} from '@/schemas/issueSchema';
import { IssueService } from '@/services/IssueService';

const issueRepository = new IssueRepository();
const issueService = new IssueService(issueRepository);
const issueController = new IssueController(issueService);

const router = express.Router();

router.get('/', errorHandlerWrapper(issueController.getAllIssues));
router.get('/park/:parkId', validateRequest(getIssuesByParkSchema), errorHandlerWrapper(issueController.getIssuesByPark));
router.get('/trail/:trailId', validateRequest(getIssuesByTrailSchema), errorHandlerWrapper(issueController.getIssuesByTrail));
router.get('/urgency/:urgency', validateRequest(getIssuesByUrgencySchema), errorHandlerWrapper(issueController.getIssuesByUrgency));
router.get('/:issueId', validateRequest(getIssueSchema), errorHandlerWrapper(issueController.getIssue));
router.post('/', validateRequest(createIssueSchema), errorHandlerWrapper(issueController.createIssue));
router.put('/:issueId/status', validateRequest(updateIssueStatusSchema), errorHandlerWrapper(issueController.updateIssueStatus));
router.delete('/:id', validateRequest(deleteIssueSchema), errorHandlerWrapper(issueController.deleteIssue));

export { router as issueRouter };
