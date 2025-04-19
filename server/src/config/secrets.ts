import * as process from 'node:process';

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// Initialize the client with application default credentials
const client = new SecretManagerServiceClient();

export async function getServiceAccountKey() {
    const projectId = process.env.PROJECT_ID;
    const secretName = process.env.SERVICE_ACCOUNT_KEY;

    if (!projectId || !secretName) {
        throw new Error('No project ID or service account key name found in environment variables');
    }

    try {
        const [version] = await client.accessSecretVersion({
            name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
        });

        if (!version.payload?.data) {
            throw new Error('No data found in secret version');
        }

        return JSON.parse(version.payload.data.toString());
    } catch (error) {
        console.error('Error accessing secret:', error);
        throw error;
    }
}
