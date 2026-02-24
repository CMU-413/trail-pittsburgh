import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { logger } from '@/utils/logger';

type IssueWithRelations = Prisma.IssueGetPayload<{
    include: {
        park: true,
        trail: true
    }
}>;

type UnsubscribeTokenPayload = {
    issueId: number;
    email: string;
    type: 'issue-notification-unsubscribe';
};

export class IssueNotificationService {
    private readonly apiKey?: string;
    private readonly domain?: string;
    private readonly fromEmail?: string;
    private readonly replyToEmail?: string;
    private readonly baseUrl: string;
    private readonly unsubscribeSecret?: string;
    private readonly serverBaseUrl: string;

    constructor() {
        this.apiKey = process.env.MAILGUN_API_KEY;
        this.domain = process.env.MAILGUN_DOMAIN;
        this.fromEmail = process.env.MAILGUN_FROM_EMAIL;
        this.replyToEmail = process.env.MAILGUN_REPLY_TO;
        this.baseUrl = process.env.MAILGUN_BASE_URL ?? 'https://api.mailgun.net';
        this.unsubscribeSecret =
            process.env.ISSUE_NOTIFICATION_UNSUBSCRIBE_SECRET ??
            process.env.JWT_SECRET;
        this.serverBaseUrl = process.env.SERVER_URL ?? 'http://localhost:3000';
    }

    public canSendEmails() {
        return Boolean(this.apiKey && this.domain);
    }

    public createUnsubscribeToken(issueId: number, email: string) {
        if (!this.unsubscribeSecret) {
            return null;
        }

        return jwt.sign(
            {
                issueId,
                email,
                type: 'issue-notification-unsubscribe'
            } satisfies UnsubscribeTokenPayload,
            this.unsubscribeSecret,
            { expiresIn: '180d' }
        );
    }

    public verifyUnsubscribeToken(token: string): UnsubscribeTokenPayload | null {
        if (!this.unsubscribeSecret) {
            return null;
        }

        try {
            const decoded = 
                jwt.verify(token, this.unsubscribeSecret) as Partial<UnsubscribeTokenPayload>;

            if (
                decoded.type !== 'issue-notification-unsubscribe'
                || typeof decoded.issueId !== 'number'
                || typeof decoded.email !== 'string'
            ) {
                return null;
            }

            return {
                issueId: decoded.issueId,
                email: decoded.email,
                type: decoded.type
            };
        } catch {
            return null;
        }
    }

    public async sendIssueCreatedConfirmation(issue: IssueWithRelations) {
        if (!this.shouldNotify(issue)) {
            return;
        }

        await this.sendEmail({
            to: issue.reporterEmail,
            subject: `Issue #${issue.issueId} created`,
            text: this.buildCreatedEmailText(issue),
        });
    }

    public async sendIssueInProgressUpdate(issue: IssueWithRelations) {
        if (!this.shouldNotify(issue)) {
            return;
        }

        await this.sendEmail({
            to: issue.reporterEmail,
            subject: `Issue #${issue.issueId} is in progress`,
            text: this.buildStatusUpdateEmailText(issue, 'in progress'),
        });
    }

    public async sendIssueResolvedUpdate(issue: IssueWithRelations) {
        if (!this.shouldNotify(issue)) {
            return;
        }

        await this.sendEmail({
            to: issue.reporterEmail,
            subject: `Issue #${issue.issueId} has been resolved`,
            text: this.buildStatusUpdateEmailText(issue, 'resolved'),
        });
    }

    private shouldNotify(issue: Pick<IssueWithRelations, 'notifyReporter' | 'reporterEmail'>) {
        return Boolean(issue.notifyReporter && issue.reporterEmail);
    }

    private buildIssueSummary(issue: IssueWithRelations) {
        const parkName = issue.park?.name ?? 'Unknown park';
        const trailName = issue.trail?.name ?? 'Unknown trail';

        return [
            `Issue ID: ${issue.issueId}`,
            `Park: ${parkName}`,
            `Trail: ${trailName}`,
            `Type: ${issue.issueType}`,
            `Urgency: ${issue.urgency}`,
            issue.description ? `Description: ${issue.description}` : undefined
        ].filter(Boolean).join('\n');
    }

    private buildCreatedEmailText(issue: IssueWithRelations) {
        return [
            'Thanks for reporting a trail issue.',
            '',
            'We received your report:',
            this.buildIssueSummary(issue),
            '',
            'You will receive additional updates as the issue status changes.'
        ].join('\n');
    }

    private buildStatusUpdateEmailText(issue: IssueWithRelations, statusLabel: 'in progress' | 'resolved' ) {
        return [
            `Your reported issue is now ${statusLabel}.`,
            '',
            this.buildIssueSummary(issue),
            '',
            `If you no longer want updates for this issue, unsubscribe here: ${this.buildUnsubscribeUrl(issue.issueId, issue.reporterEmail)}`
        ].join('\n');
    }

    private buildUnsubscribeUrl(issueId: number, email: string) {
        const token = this.createUnsubscribeToken(issueId, email);

        if (!token) {
            return `${this.serverBaseUrl}/api/issues/${issueId}/unsubscribe`;
        }

        return `${this.serverBaseUrl}/api/issues/${issueId}/unsubscribe?token=${encodeURIComponent(token)}`;
    }

    private async sendEmail(email: {
        to: string;
        subject: string;
        text: string;
    }) {
        if (!this.apiKey || !this.domain) {
            logger.warn('MAILGUN_API_KEY or MAILGUN_DOMAIN missing. Skipping issue notification email.');
            return;
        }

        const from = this.fromEmail ?? `Trail Pittsburgh <postmaster@${this.domain}>`;
        const body = new URLSearchParams({
            from,
            to: email.to,
            subject: email.subject,
            text: email.text
        });

        if (this.replyToEmail) {
            body.append('h:Reply-To', this.replyToEmail);
        }

        try {
            const response = await fetch(`${this.baseUrl}/v3/${this.domain}/messages`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body.toString()
            });

            if (!response.ok) {
                const responseBody = await response.text();
                logger.error(`Mailgun send failed with status ${response.status}: ${responseBody}`);
            }
        } catch (error) {
            logger.error('Failed to send Mailgun notification email', error);
        }
    }
}
