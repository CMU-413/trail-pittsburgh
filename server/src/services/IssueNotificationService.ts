import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { logger } from '@/utils/logger';

type IssueWithRelations = Prisma.IssueGetPayload<{
    include: {
        park: true,
    }
}>;

type UnsubscribeTokenPayload = {
    issueId: number;
    email: string;
    type: 'issue-notification-unsubscribe';
};

export class IssueNotificationService {
    private static readonly senderDisplayName = '[TrailPGH] Trail Pittsburgh Issue Tracker';
    private readonly apiKey?: string;
    private readonly domain?: string;
    private readonly fromEmail?: string;
    private readonly replyToEmail?: string;
    private readonly baseUrl: string;
    private readonly unsubscribeSecret?: string;
    private readonly clientBaseUrl: string;
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
        this.clientBaseUrl = process.env.CLIENT_URL ?? 'http://localhost:5173';
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
            subject: 'Trail issue report received',
            text: this.buildCreatedEmailText(issue),
            html: this.buildCreatedEmailHtml(issue),
        });
    }

    public async sendIssueInProgressUpdate(issue: IssueWithRelations) {
        if (!this.shouldNotify(issue)) {
            return;
        }

        await this.sendEmail({
            to: issue.reporterEmail,
            subject: 'Your trail issue is in progress',
            text: this.buildStatusUpdateEmailText(issue, 'in progress'),
            html: this.buildStatusUpdateEmailHtml(issue, 'in progress'),
        });
    }

    public async sendIssueResolvedUpdate(issue: IssueWithRelations) {
        if (!this.shouldNotify(issue)) {
            return;
        }

        await this.sendEmail({
            to: issue.reporterEmail,
            subject: 'Your trail issue has been resolved',
            text: this.buildStatusUpdateEmailText(issue, 'resolved'),
            html: this.buildStatusUpdateEmailHtml(issue, 'resolved'),
        });
    }

    private shouldNotify(issue: Pick<IssueWithRelations, 'notifyReporter' | 'reporterEmail'>) {
        return Boolean(issue.notifyReporter && issue.reporterEmail);
    }

    private buildIssueSummary(issue: IssueWithRelations) {
        const parkName = issue.park?.name ?? 'Unknown park';

        return [
            `Park: ${parkName}`,
            `Type: ${issue.issueType}`,
            `Safety Risk: ${issue.safetyRisk}`,
            issue.description ? `Description: ${issue.description}` : undefined
        ].filter(Boolean).join('\n');
    }

    private buildIssueSummaryHtml(issue: IssueWithRelations) {
        const parkName = this.escapeHtml(issue.park?.name ?? 'Unknown park');
        const issueType = this.escapeHtml(issue.issueType);
        const safetyRisk = this.escapeHtml(issue.safetyRisk);
        const description = issue.description
            ? `<li><strong>Description:</strong> ${this.escapeHtml(issue.description)}</li>`
            : '';

        return [
            '<ul>',
            `<li><strong>Park:</strong> ${parkName}</li>`,
            `<li><strong>Type:</strong> ${issueType}</li>`,
            `<li><strong>Safety Risk:</strong> ${safetyRisk}</li>`,
            description,
            '</ul>'
        ].join('');
    }

    private buildCreatedEmailText(issue: IssueWithRelations) {
        return [
            'Thanks for reporting a trail issue.',
            '',
            'We received your report:',
            this.buildIssueSummary(issue),
            '',
            `Track or edit your report here: ${this.buildIssueCardUrl(issue.issueId)}`,
            '',
            `If you no longer want updates for this issue, unsubscribe here: ${this.buildUnsubscribeUrl(issue.issueId, issue.reporterEmail)}`,
            '',
            'You will receive additional updates as the issue status changes.'
        ].join('\n');
    }

    private buildCreatedEmailHtml(issue: IssueWithRelations) {
        return [
            '<p>Thanks for reporting a trail issue.</p>',
            '<p>We received your report:</p>',
            this.buildIssueSummaryHtml(issue),
            `<p><a href="${this.escapeHtml(this.buildIssueCardUrl(issue.issueId))}">Track or edit your report</a></p>`,
            `<p>If you no longer want updates for this issue, <a href="${this.escapeHtml(this.buildUnsubscribeUrl(issue.issueId, issue.reporterEmail))}">unsubscribe here</a>.</p>`,
            '<p>You will receive additional updates as the issue status changes.</p>'
        ].join('');
    }

    private buildStatusUpdateEmailText(issue: IssueWithRelations, statusLabel: 'in progress' | 'resolved' ) {
        return [
            `Your reported issue is now ${statusLabel}.`,
            '',
            this.buildIssueSummary(issue),
            '',
            `Track or edit your report here: ${this.buildIssueCardUrl(issue.issueId)}`,
            '',
            `If you no longer want updates for this issue, unsubscribe here: ${this.buildUnsubscribeUrl(issue.issueId, issue.reporterEmail)}`
        ].join('\n');
    }

    private buildStatusUpdateEmailHtml(issue: IssueWithRelations, statusLabel: 'in progress' | 'resolved' ) {
        return [
            `<p>Your reported issue is now ${this.escapeHtml(statusLabel)}.</p>`,
            this.buildIssueSummaryHtml(issue),
            `<p><a href="${this.escapeHtml(this.buildIssueCardUrl(issue.issueId))}">Track or edit your report</a></p>`,
            `<p>If you no longer want updates for this issue, <a href="${this.escapeHtml(this.buildUnsubscribeUrl(issue.issueId, issue.reporterEmail))}">unsubscribe here</a>.</p>`
        ].join('');
    }

    private buildIssueCardUrl(issueId: number) {
        return `${this.clientBaseUrl}/issues/card/${issueId}`;
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
        html?: string;
    }) {
        if (!this.apiKey || !this.domain) {
            logger.warn('MAILGUN_API_KEY or MAILGUN_DOMAIN missing. Skipping issue notification email.');
            return;
        }

        const senderEmail = this.resolveSenderEmail();
        const from = `${IssueNotificationService.senderDisplayName} <${senderEmail}>`;
        const body = new URLSearchParams({
            from,
            to: email.to,
            subject: email.subject,
            text: email.text
        });

        if (email.html) {
            body.append('html', email.html);
        }

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

    private resolveSenderEmail() {
        const fromEmail = this.fromEmail?.trim();

        if (!fromEmail) {
            return `postmaster@${this.domain}`;
        }

        const emailMatch = fromEmail.match(/<([^>]+)>/);
        if (emailMatch?.[1]) {
            return emailMatch[1].trim();
        }

        return fromEmail;
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
