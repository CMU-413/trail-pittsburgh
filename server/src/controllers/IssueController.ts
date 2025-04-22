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

    public async createIssue(req: express.Request, res: express.Response) {
        try {
            const { issue, signedUrl } = await this.issueService.createIssue(req.body);
    
            res.status(201).json({ issue, signedUrl });
        } catch (error) {
            logger.error(`Error creating issue`, error);
            res.status(500).json({ message: 'Failed to create issue' });
        }
    }
    
    public async updateIssueStatus(req: express.Request, res: express.Response) {
        const issueId = Number(req.params.issueId);

        try {
            const { status } = req.body;

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
            const urgency = Number(req.params.urgency);
            const issues = await this.issueService.getIssuesByUrgency(urgency);
            res.json({ issues });
        } catch (error) {
            logger.error(`Error getting issues by urgency ${req.params.urgency}:`, error);
            res.status(500).json({ message: 'Failed to retrieve issues by urgency' });
        }
    }
}

