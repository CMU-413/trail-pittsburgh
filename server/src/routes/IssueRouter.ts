import express from 'express';

import { IssueController } from '@/controllers/';
import { errorHandlerWrapper } from '@/middlewares';
import { IssueRepository } from '@/repositories';
import { IssueService } from '@/services/IssueService';

const issueRepository = new IssueRepository();
const issueService = new IssueService(issueRepository);
const issueController = new IssueController(issueService);

const router = express.Router();

router.get('/', errorHandlerWrapper(issueController.getAllIssues));
router.get('/park/:parkId', errorHandlerWrapper(issueController.getIssuesByPark));
router.get('/trail/:trailId', errorHandlerWrapper(issueController.getIssuesByTrail));
router.get('/urgency/:urgency', errorHandlerWrapper(issueController.getIssuesByUrgency));
router.get('/:id', errorHandlerWrapper(issueController.getIssue));
router.post('/', errorHandlerWrapper(issueController.createIssue));
router.put('/:id/status', errorHandlerWrapper(issueController.updateIssueStatus));
router.delete('/:id', errorHandlerWrapper(issueController.deleteIssue));

export { router as issueRouter };
