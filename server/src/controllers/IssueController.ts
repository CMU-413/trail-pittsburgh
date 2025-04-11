import express from 'express';

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

    // public async getIssue(req: express.Request, res: express.Response) {
    //     const issue = await this.issueService.getIssue(Number(req.params.id));
    //     res.json({ success: true, issue });
    // }
    public async getIssue(req: express.Request, res: express.Response) {
        try {
            const issueId = Number(req.params.id);
            const issue = await this.issueService.getIssue(issueId);
            
            if (!issue) {
                return res.status(404).json({ message: 'Issue not found' });
            }
            
            res.json(issue);
        } catch (error) {
            console.error('Error fetching issue:', error);
            res.status(500).json({ message: 'Failed to retrieve issue' });
        }
    }

    public async getAllIssues(req: express.Request, res: express.Response) {
        try {
            const issues = await this.issueService.getAllIssues();
            res.json(issues);
        } catch (error) {
            console.error('Error fetching all issues:', error);
            res.status(500).json({ message: 'Failed to retrieve issues' });
        }
    }

    public async createIssue(req: express.Request, res: express.Response) {
        try {
            const {
                park_id,
                trail_id,
                issue_type,
                urgency,
                description,
                is_public,
                status,
                notify_reporter,
                issue_image,
                reporter_email,
                longitude,
                latitude
            } = req.body;
    
            // Validate required fields
            if (!park_id || !trail_id || !issue_type || !urgency || !reporter_email) {
                return res.status(400).json({
                    message: 'Park ID, Trail ID, issue_type, urgency, and reporter_email are required'
                });
            }
    
            const issue = await this.issueService.createIssue({
                park_id: Number(park_id),
                trail_id: Number(trail_id),
                issue_type: String(issue_type),
                urgency: Number(urgency),
                reporter_email: String(reporter_email),
                description: description || undefined,
                is_public: is_public !== undefined ? Boolean(is_public) : true,
                status: status || 'Open',
                notify_reporter: notify_reporter !== undefined ? Boolean(notify_reporter) : true,
                issue_image: issue_image || undefined,
                longitude: longitude !== undefined ? Number(longitude) : undefined,
                latitude: latitude !== undefined ? Number(latitude) : undefined
            });
    
            res.status(201).json(issue);
        } catch (error) {
            console.error('Error creating issue:', error);
            res.status(500).json({ message: 'Failed to create issue' });
        }
    }
    
    public async updateIssueStatus(req: express.Request, res: express.Response) {
        try {
            const issueId = Number(req.params.id);
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: 'Status is required' });
            }

            const issue = await this.issueService.updateIssueStatus(issueId, status);

            if (!issue) {
                return res.status(404).json({ message: 'Issue not found' });
            }

            res.json(issue);
        } catch (error) {
            console.error('Error updating issue status:', error);
            res.status(500).json({ message: 'Failed to update issue status' });
        }
    }

    public async deleteIssue(req: express.Request, res: express.Response) {
        try {
            const issueId = Number(req.params.id);
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
            res.json(issues);
        } catch (error) {
            console.error('Error fetching issues by park:', error);
            res.status(500).json({ message: 'Failed to retrieve issues for this park' });
        }
    }

    public async getIssuesByTrail(req: express.Request, res: express.Response) {
        try {
            const trailId = Number(req.params.trailId);
            const issues = await this.issueService.getIssuesByTrail(trailId);
            res.json(issues);
        } catch (error) {
            console.error('Error fetching issues by trail:', error);
            res.status(500).json({ message: 'Failed to retrieve issues for this trail' });
        }
    }

    public async getIssuesByUrgency(req: express.Request, res: express.Response) {
        try {
            const urgency = Number(req.params.urgency);
            const issues = await this.issueService.getIssuesByUrgency(urgency);
            res.json(issues);
        } catch (error) {
            console.error('Error fetching issues by urgency:', error);
            res.status(500).json({ message: 'Failed to retrieve issues by urgency' });
        }
    }
}

