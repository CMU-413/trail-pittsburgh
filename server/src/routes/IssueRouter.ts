import express from 'express';

import { IssueController } from '@/controllers/';
import { GCSBucket } from '@/lib/GCSBucket';
import { authenticateToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { IssueRepository } from '@/repositories';
import {
    createIssueSchema,
    deleteIssueSchema,
    getIssuesByParkSchema,
    getIssuesByTrailSchema,
    getIssuesByUrgencySchema,
    getIssueSchema,
    updateIssueStatusSchema,
    updateIssueSchema
} from '@/schemas/issueSchema';
import { IssueService } from '@/services/IssueService';

const issueRepository = new IssueRepository();
const issueImageBucket = new GCSBucket(process.env.TRAIL_ISSUE_IMAGE_BUCKET!);
const issueService = new IssueService(issueRepository, issueImageBucket);
const issueController = new IssueController(issueService);

const router = express.Router();

// Public Routes
router.get('/', issueController.getAllIssues); // Get all issues
router.get('/park/:parkId', validateRequest(getIssuesByParkSchema), issueController.getIssuesByPark); // Get issues by park
router.get('/trail/:trailId', validateRequest(getIssuesByTrailSchema), issueController.getIssuesByTrail); // Get issues by trail
router.get('/urgency/:urgency', validateRequest(getIssuesByUrgencySchema), issueController.getIssuesByUrgency); // Get issues by urgency
router.get('/:issueId', validateRequest(getIssueSchema), issueController.getIssue); // Get a specific issue

// Protected Routes
router.post(
    '/',
    authenticateToken,
    validateRequest(createIssueSchema),
    issueController.createIssue
); // Create a new issue

router.put(
    '/:issueId/status',
    authenticateToken,
    validateRequest(updateIssueStatusSchema),
    issueController.updateIssueStatus
); // Update issue status

router.delete(
    '/:issueId',
    authenticateToken,
    validateRequest(deleteIssueSchema),
    issueController.deleteIssue
); // Delete an issue

router.put(
    '/:issueId',
    authenticateToken,
    validateRequest(updateIssueSchema),
    issueController.updateIssue
); // Update an issue

export { router as issueRouter };
