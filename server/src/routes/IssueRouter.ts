// src/routes/issue.routes.ts
import express from 'express';

import { IssueController } from '@/controllers/';
import { GCSBucket } from '@/lib/GCSBucket';
import { errorHandlerWrapper } from '@/middlewares';
import { validateRequest } from '@/middlewares/validateRequest';
import { IssueRepository } from '@/repositories';
import {
    createIssueSchema,
    deleteIssueSchema,
    getIssuesByParkSchema,
    getIssuesByTrailSchema,
    getIssuesByUrgencySchema,
    getIssueSchema,
    updateIssueStatusSchema
} from '@/schemas/issueSchema';
import { IssueService } from '@/services/IssueService';
import { authenticateToken } from '@/middlewares/auth';

const issueRepository = new IssueRepository();
const issueImageBucket = new GCSBucket(process.env.TRAIL_IMAGE_BUCKET!);
const issueService = new IssueService(issueRepository, issueImageBucket);
const issueController = new IssueController(issueService);

const router = express.Router();

// Public Routes
router.get('/', errorHandlerWrapper(issueController.getAllIssues)); // Get all issues
router.get('/park/:parkId', validateRequest(getIssuesByParkSchema), errorHandlerWrapper(issueController.getIssuesByPark)); // Get issues by park
router.get('/trail/:trailId', validateRequest(getIssuesByTrailSchema), errorHandlerWrapper(issueController.getIssuesByTrail)); // Get issues by trail
router.get('/urgency/:urgency', validateRequest(getIssuesByUrgencySchema), errorHandlerWrapper(issueController.getIssuesByUrgency)); // Get issues by urgency
router.get('/:issueId', validateRequest(getIssueSchema), errorHandlerWrapper(issueController.getIssue)); // Get a specific issue

// Protected Routes
router.post(
    '/',
    authenticateToken,
    validateRequest(createIssueSchema),
    errorHandlerWrapper(issueController.createIssue)
); // Create a new issue

router.put(
    '/:issueId/status',
    authenticateToken,
    validateRequest(updateIssueStatusSchema),
    errorHandlerWrapper(issueController.updateIssueStatus)
); // Update issue status

router.delete(
    '/:issueId',
    authenticateToken,
    validateRequest(deleteIssueSchema),
    errorHandlerWrapper(issueController.deleteIssue)
); // Delete an issue

export { router as issueRouter };
