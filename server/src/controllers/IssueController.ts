import express from 'express';

import { createIssueSchema } from '@/schemas/issueSchema';
import { IssueService } from '@/services/IssueService';

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
        try {
            const issueId = Number(req.params.issueId);
            const issue = await this.issueService.getIssue(issueId);
            
            if (!issue) {
                return res.status(404).json({ message: 'Issue not found' });
            }
            
            res.json({ issue });
        } catch (error) {
            console.error('Error fetching issue:', error);
            res.status(500).json({ message: 'Failed to retrieve issue' });
        }
    }

    public async getAllIssues(req: express.Request, res: express.Response) {
        try {
            const issues = await this.issueService.getAllIssues();
            res.json({ issues });
        } catch (error) {
            console.error('Error fetching all issues:', error);
            res.status(500).json({ message: 'Failed to retrieve issues' });
        }
    }

    public async createIssue(req: express.Request, res: express.Response) {
        try {
            //try to enforce the zod format coming from issueSchema file
            const parsed = createIssueSchema.parse(req);
            const { issue, signedUrl } = await this.issueService.createIssue(parsed.body);
            // const { issue, signedUrl } = await this.issueService.createIssue(req.body);
    
            res.status(201).json({ issue, signedUrl });
        } catch (error) {
            console.error('Create Issue Error:', error);
            res.status(500).json({ message: 'Failed to create issue' });
        }
    }
    
    public async updateIssueStatus(req: express.Request, res: express.Response) {
        try {
            const issueId = Number(req.params.issueId);
            // const issueId = Number(req.params.id);
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: 'Status is required' });
            }

            const issue = await this.issueService.updateIssueStatus(issueId, status);

            if (!issue) {
                return res.status(404).json({ message: 'Issue not found' });
            }

            res.json({ issue });
        } catch (error) {
            console.error('Error updating issue status:', error);
            res.status(500).json({ message: 'Failed to update issue status' });
        }
    }

    public async deleteIssue(req: express.Request, res: express.Response) {
        try {
            // const issueId = Number(req.params.id);
            const issueId = Number(req.params.issueId);
            const deleted = await this.issueService.deleteIssue(issueId);

            if (!deleted) {
                return res.status(404).json({ message: 'Issue not found' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting issue:', error);
            res.status(500).json({ message: 'Failed to delete issue' });
        }
    }

    public async getIssuesByPark(req: express.Request, res: express.Response) {
        try {
            const parkId = Number(req.params.parkId);
            const issues = await this.issueService.getIssuesByPark(parkId);
            res.json({ issues });
        } catch (error) {
            console.error('Error fetching issues by park:', error);
            res.status(500).json({ message: 'Failed to retrieve issues for this park' });
        }
    }

    public async getIssuesByTrail(req: express.Request, res: express.Response) {
        try {
            const trailId = Number(req.params.trailId);
            const issues = await this.issueService.getIssuesByTrail(trailId);
            res.json({ issues });
        } catch (error) {
            console.error('Error fetching issues by trail:', error);
            res.status(500).json({ message: 'Failed to retrieve issues for this trail' });
        }
    }

    public async getIssuesByUrgency(req: express.Request, res: express.Response) {
        try {
            const urgency = Number(req.params.urgency);
            const issues = await this.issueService.getIssuesByUrgency(urgency);
            res.json({ issues });
        } catch (error) {
            console.error('Error fetching issues by urgency:', error);
            res.status(500).json({ message: 'Failed to retrieve issues by urgency' });
        }
    }
}

