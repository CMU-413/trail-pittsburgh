import {
    IssueUrgencyEnum, IssueStatusEnum, IssueTypeEnum 
} from '@prisma/client';
import express from 'express';

import { IssueService } from '@/services/IssueService';
import { logger } from '@/utils/logger';

export class IssueController {

    private readonly issueService: IssueService;

    constructor(issueService: IssueService) {
        this.issueService = issueService;
        this.getIssue = this.getIssue.bind(this);
        this.getAllIssues = this.getAllIssues.bind(this);
        this.createIssue = this.createIssue.bind(this);
        this.updateIssueStatus = this.updateIssueStatus.bind(this);
        this.deleteIssue = this.deleteIssue.bind(this);
        this.getIssuesByPark = this.getIssuesByPark.bind(this);
        this.getIssuesByTrail = this.getIssuesByTrail.bind(this);
        this.getIssuesByUrgency = this.getIssuesByUrgency.bind(this);
        this.updateIssue = this.updateIssue.bind(this);
        this.getMapPins = this.getMapPins.bind(this);
    }

    public async createIssue(req: express.Request, res: express.Response) {
        try {
            const { issue, signedUrl } = await this.issueService.createIssue(req.body);
    
            res.status(201).json({ issue, signedUrl });
        } catch (error) {
            logger.error(`Error creating issue`, error);
            res.status(500).json({ message: 'Failed to create issue' });
        }
    }

    public async getIssue(req: express.Request, res: express.Response) {
        const issueId = Number(req.params.issueId);

        try {
            const issue = await this.issueService.getIssue(issueId);
            
            if (!issue) {
                res.status(404).json({ message: 'Issue not found' });
                return;
            }

            res.json({ issue });
        } catch (error) {
            logger.error(`Error fetching issue ${issueId}`, error);
            res.status(500).json({ message: 'Failed to retrieve issue' });
        }
    }

    public async getAllIssues(req: express.Request, res: express.Response) {
        try {
            const issues = await this.issueService.getAllIssues();
            res.json({ issues });
        } catch (error) {
            logger.error(`Error fetching all issues`, error);
            res.status(500).json({ message: 'Failed to retrieve issues' });
        }
    }

    public async getIssuesByPark(req: express.Request, res: express.Response) {
        try {
            const parkId = Number(req.params.parkId);
            const issues = await this.issueService.getIssuesByPark(parkId);
            res.json({ issues });
        } catch (error) {
            logger.error(`Error getting issues by park ${req.params.parkId}:`, error);
            res.status(500).json({ message: 'Failed to retrieve issues for this park' });
        }
    }

    public async getIssuesByTrail(req: express.Request, res: express.Response) {
        try {
            const trailId = Number(req.params.trailId);
            const issues = await this.issueService.getIssuesByTrail(trailId);
            res.json({ issues });
        } catch (error) {
            logger.error(`Error getting issues by trail ${req.params.trailId}`, error);
            res.status(500).json({ message: 'Failed to retrieve issues for this trail' });
        }
    }

    public async getIssuesByUrgency(req: express.Request, res: express.Response) {
        try {
            const urgency = req.params.urgency as IssueUrgencyEnum;
            const issues = await this.issueService.getIssuesByUrgency(urgency);
            res.json({ issues });
        } catch (error) {
            logger.error(`Error getting issues by urgency ${req.params.urgency}:`, error);
            res.status(500).json({ message: 'Failed to retrieve issues by urgency' });
        }
    }

    public async getMapPins(req: express.Request, res: express.Response) {
        try {
            const { bbox, issueTypes } = req.query as unknown as{
				bbox: string;
				issueTypes: IssueTypeEnum[];
			};

            // Parse bbox: "minLat,minLng,maxLat,maxLng"
            const parts = bbox.split(',').map((s) => Number(s.trim()));
            if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
                res.status(400).json({ message: 'Invalid bbox format. Expected: minLat,minLng,maxLat,maxLng' });
                return;
            }
			
            // Store parsed values in corresponding variables
            const [minLat, minLng, maxLat, maxLng] = parts;

            // Basic bounds checks
            const inLatRange = (x: number) => x >= -90 && x <= 90;
            const inLngRange = (x: number) => x >= -180 && x <= 180;
            if (!inLatRange(minLat) || !inLatRange(maxLat) 
				|| !inLngRange(minLng) || !inLngRange(maxLng)) {
                res.status(400).json({ message: 'bbox values out of range' });
                return;
            }
            if (minLat > maxLat || minLng > maxLng) {
                res.status(400).json({ message: 'bbox min values must be <= max values' });
                return;
            }
			
            const pins = await this.issueService.getMapPins(
                minLat, 
                minLng, 
                maxLat, 
                maxLng,
                issueTypes,
                IssueStatusEnum.OPEN
            );

		    res.json({ pins });
        } catch (error) {
            logger.error(`Error getting map pins`, error);
            res.status(500).json({ message: 'Failed to retrieve map pins' });
        }
    }

    public async deleteIssue(req: express.Request, res: express.Response) {
        const issueId = Number(req.params.issueId);

        try {
            const deleted = await this.issueService.deleteIssue(issueId);

            if (!deleted) {
                res.status(404).json({ message: 'Issue not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            logger.error(`Error deleting issue ${issueId}`, error);
            res.status(500).json({ message: 'Failed to delete issue' });
        }
    }

    public async updateIssueStatus(req: express.Request, res: express.Response) {
        const issueId = Number(req.params.issueId);

        try {
            const status = req.body.status as IssueStatusEnum;
            const issue = await this.issueService.updateIssueStatus(issueId, status);

            if (!issue) {
                res.status(404).json({ message: 'Issue not found' });
                return;
            }

            res.json({ issue });
        } catch (error) {
            logger.error(`Error updating issue ${issueId}`, error);
            res.status(500).json({ message: 'Failed to update issue status' });
        }
    }

    public async updateIssue(req: express.Request, res: express.Response) {
        const issueId = Number(req.params.issueId);
        
        try {
            const { description, urgency, issueType, parkId, trailId } = req.body;
            const issue = await this.issueService.updateIssue(issueId, {
                description,
                urgency,
                issueType,
                parkId,
                trailId
            });
            
            if (!issue) {
                res.status(404).json({ message: 'Issue not found' });
                return;
            }
            
            res.json({ issue });
        } catch (error) {
            logger.error(`Error updating issue ${issueId}`, error);
            res.status(500).json({ message: 'Failed to update issue' });
        }
    }
}
