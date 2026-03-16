import {
    IssueStatusEnum, IssueTypeEnum 
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
        this.updateIssue = this.updateIssue.bind(this);
        this.unsubscribeReporterNotifications = this.unsubscribeReporterNotifications.bind(this);
        this.getMapPins = this.getMapPins.bind(this);
        this.getGroupedIssues = this.getGroupedIssues.bind(this);
        this.setIssueGroup = this.setIssueGroup.bind(this);
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

    public async getMapPins(req: express.Request, res: express.Response) {
        try {
            const { bbox, issueTypes, statuses } = req.query as unknown as{
				bbox: string;
				issueTypes: IssueTypeEnum[];
                statuses: IssueStatusEnum[];
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
                statuses
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

    public async getGroupedIssues(req: express.Request, res: express.Response) {
        const issueId = Number(req.params.issueId);

        try {
            const issues = await this.issueService.getGroupedIssues(issueId);

            if (!issues) {
                res.status(404).json({ message: 'Issue not found' });
                return;
            }

            res.json({ issues });
        } catch (error) {
            logger.error(`Error loading grouped issues for ${issueId}`, error);
            res.status(500).json({ message: 'Failed to retrieve grouped issues' });
        }
    }

    public async setIssueGroup(req: express.Request, res: express.Response) {
        const issueId = Number(req.params.issueId);

        try {
            const issue = await this.issueService.setIssueGroup(issueId, req.body);

            if (!issue) {
                res.status(404).json({ message: 'Issue not found or invalid group members' });
                return;
            }

            res.json({ issue });
        } catch (error) {
            logger.error(`Error setting issue group for ${issueId}`, error);
            res.status(500).json({ message: 'Failed to update issue group' });
        }
    }

    public async updateIssue(req: express.Request, res: express.Response) {
        const issueId = Number(req.params.issueId);
        
        try {
            const { 
                description, issueType, isImagePublic, parkId, latitude, longitude 
            } = req.body;
            const issue = await this.issueService.updateIssue(issueId, {
                description,
                issueType,
                isImagePublic,
                parkId,
                latitude,
                longitude
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

    public async unsubscribeReporterNotifications(req: express.Request, res: express.Response) {
        const issueId = Number(req.params.issueId);
        const token = String(req.query.token ?? '');

        try {
            const result = await this.issueService.unsubscribeReporter(issueId, token);

            if (result === 'issue-not-found') {
                this.respondForUnsubscribe(req, res, {
                    statusCode: 404,
                    title: 'Issue Not Found',
                    message: 'We could not find that issue. The unsubscribe link may be invalid.',
                    jsonMessage: 'Issue not found'
                });
                return;
            }

            if (result === 'invalid-token') {
                this.respondForUnsubscribe(req, res, {
                    statusCode: 400,
                    title: 'Invalid Link',
                    message: 'This unsubscribe link is invalid or has expired.',
                    jsonMessage: 'Invalid or expired unsubscribe token'
                });
                return;
            }

            if (result === 'already-unsubscribed') {
                this.respondForUnsubscribe(req, res, {
                    statusCode: 200,
                    title: 'Already Unsubscribed',
                    message: 'Email notifications for this issue were already turned off.',
                    jsonMessage: 'Notifications are already unsubscribed for this issue'
                });
                return;
            }

            this.respondForUnsubscribe(req, res, {
                statusCode: 200,
                title: 'Unsubscribe Successful',
                message: 'You are unsubscribed from future email updates for this issue.',
                jsonMessage: 'You have been unsubscribed from issue updates'
            });
        } catch (error) {
            logger.error(`Error unsubscribing issue ${issueId}`, error);
            this.respondForUnsubscribe(req, res, {
                statusCode: 500,
                title: 'Unsubscribe Failed',
                message: 'Something went wrong while processing your unsubscribe request.',
                jsonMessage: 'Failed to unsubscribe from notifications'
            });
        }
    }

    private respondForUnsubscribe(
        req: express.Request,
        res: express.Response,
        content: {
            statusCode: number;
            title: string;
            message: string;
            jsonMessage: string;
        }
    ) {
        if (req.accepts('html')) {
            res.status(content.statusCode).type('html').send(this.buildUnsubscribeHtml(content.title, content.message));
            return;
        }

        res.status(content.statusCode).json({ message: content.jsonMessage });
    }

    private buildUnsubscribeHtml(title: string, message: string) {
        const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173';
        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${this.escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      color: #1f2937;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1rem;
    }
    .card {
      width: 100%;
      max-width: 560px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
      padding: 1.5rem;
    }
    h1 {
      margin: 0 0 0.75rem;
      font-size: 1.375rem;
    }
    p {
      margin: 0;
      line-height: 1.55;
      font-size: 1rem;
    }
        .actions {
            margin-top: 1rem;
        }
        .button {
            display: inline-block;
            background: #1d4ed8;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            padding: 0.625rem 0.9rem;
            font-weight: 600;
        }
        .button:hover {
            background: #1e40af;
        }
  </style>
</head>
<body>
  <main class="card">
    <h1>${this.escapeHtml(title)}</h1>
    <p>${this.escapeHtml(message)}</p>
        <div class="actions">
            <a class="button" href="${this.escapeHtml(clientUrl)}">Back to Trail Pittsburgh</a>
        </div>
  </main>
</body>
</html>`;
    }

    private escapeHtml(value: string) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
