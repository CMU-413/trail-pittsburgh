import { logger } from '@/utils/logger';

import { EmailClient, EmailMessage } from './EmailClient';

export class MailgunEmailClient implements EmailClient {
    private static readonly senderDisplayName = '[TrailPGH] Trail Pittsburgh Issue Tracker';
    private readonly apiKey?: string;
    private readonly domain?: string;
    private readonly fromEmail?: string;
    private readonly replyToEmail?: string;
    private readonly baseUrl: string;

    constructor() {
        this.apiKey = process.env.MAILGUN_API_KEY;
        this.domain = process.env.MAILGUN_DOMAIN;
        this.fromEmail = process.env.MAILGUN_FROM_EMAIL;
        this.replyToEmail = process.env.MAILGUN_REPLY_TO;
        this.baseUrl = process.env.MAILGUN_BASE_URL ?? 'https://api.mailgun.net';
    }

    public canSendEmails() {
        return Boolean(this.apiKey && this.domain);
    }

    public async send(email: EmailMessage) {
        if (!this.apiKey || !this.domain) {
            logger.warn('MAILGUN_API_KEY or MAILGUN_DOMAIN missing. Skipping issue notification email.');
            return;
        }

        const senderEmail = this.resolveSenderEmail();
        const from = `${MailgunEmailClient.senderDisplayName} <${senderEmail}>`;
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
}
