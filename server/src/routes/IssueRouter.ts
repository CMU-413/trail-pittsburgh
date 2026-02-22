import express from 'express';

import { IssueController } from '@/controllers/';
import { createBucket, GCSBucket } from '@/lib/GCSBucket';
import {
    requireAdmin, requireSuperAdmin, authenticateToken, validateRequest 
} from '@/middlewares/index';
import { IssueRepository } from '@/repositories';
import {
    createIssueSchema,
    deleteIssueSchema,
    getIssuesByParkSchema,
    getIssuesByTrailSchema,
    getIssuesByUrgencySchema,
    getIssueSchema,
	getIssueMapPinsSchema,
    updateIssueStatusSchema,
    updateIssueSchema
} from '@/schemas/issueSchema';
import { IssueService } from '@/services/IssueService';

const issueRepository = new IssueRepository();
const bucket = createBucket(process.env.TRAIL_ISSUE_IMAGE_BUCKET!);
const issueImageBucket = new GCSBucket(bucket);
const issueService = new IssueService(issueRepository, issueImageBucket);
const issueController = new IssueController(issueService);

const router = express.Router();

// Public Routes
router.post(
    '/',
    authenticateToken,
    validateRequest(createIssueSchema),
    issueController.createIssue
); // Create a new issue

// User Routes
// None for now

// Admin Routes
router.get('/', 
    authenticateToken,
    requireAdmin,
    issueController.getAllIssues); // Get all issues

router.get('/park/:parkId', 
    authenticateToken,
    validateRequest(getIssuesByParkSchema), 
    requireAdmin,
    issueController.getIssuesByPark); // Get issues by park

router.get('/trail/:trailId', 
    authenticateToken,
    validateRequest(getIssuesByTrailSchema), 
    requireAdmin,
    issueController.getIssuesByTrail); // Get issues by trail

router.get('/urgency/:urgency', 
    authenticateToken,
    validateRequest(getIssuesByUrgencySchema), 
    requireAdmin,
    issueController.getIssuesByUrgency); // Get issues by urgency

router.get('/map', 
	validateRequest(getIssueMapPinsSchema),
	issueController.getMapPins);

router.get('/:issueId', 
    authenticateToken,
    validateRequest(getIssueSchema), 
    requireAdmin,
    issueController.getIssue); // Get a specific issue

router.put(
    '/:issueId/status',
    authenticateToken,
    validateRequest(updateIssueStatusSchema),
    requireAdmin,
    issueController.updateIssueStatus
); // Update issue status (resolve issue)

router.put(
    '/:issueId',
    authenticateToken,
    validateRequest(updateIssueSchema),
    requireAdmin,
    issueController.updateIssue
); // Update an issue

// Super Admin Routes
router.delete(
    '/:issueId',
    authenticateToken,
    validateRequest(deleteIssueSchema),
    requireSuperAdmin,
    issueController.deleteIssue
); // Delete an issue

export { router as issueRouter };
