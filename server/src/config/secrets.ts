import * as process from 'node:process';

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getServiceAccountKey() {
    const projectId = process.env.PROJECT_ID;
    const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

    if (!projectId || !serviceAccountKey) {
        throw new Error('No project ID or service account key found');
    }

    const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${serviceAccountKey}/versions/latest`,
    });

    return JSON.parse(version.payload?.data?.toString() || '{}');
}
