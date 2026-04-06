export type EmailMessage = {
    to: string;
    subject: string;
    text: string;
    html?: string;
};

export interface EmailClient {
    canSendEmails(): boolean;
    send(email: EmailMessage): Promise<void>;
}
