import express from 'express';

import { IssueService } from '@/services/IssueService';

export class IssueController {

    private readonly issueService: IssueService;

    constructor(issueService: IssueService) {
        this.issueService = issueService;

        this.getIssue = this.getIssue.bind(this);
    }

    public async getIssue(req: express.Request, res: express.Response) {
        const issue = await this.issueService.getIssue(Number(req.params.id));
        res.json({ success: true, issue });
    }
}

