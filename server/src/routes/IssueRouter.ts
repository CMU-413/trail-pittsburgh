import express from 'express';

import { IssueController } from '@/controllers/';
import { errorHandlerWrapper } from '@/middlewares';
import { IssueRepository } from '@/repositories';
import { IssueService } from '@/services/IssueService';

const issueRepository = new IssueRepository();
const issueService = new IssueService(issueRepository);
const issueController = new IssueController(issueService);

const router = express.Router();

router.get('/:id', errorHandlerWrapper(issueController.getIssue));

export { router as issueRouter };
