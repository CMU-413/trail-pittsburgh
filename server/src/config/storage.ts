import { Storage } from '@google-cloud/storage';

import { getServiceAccountKey } from '@/config/secrets';

let storageInstance: Storage | null = null;

export async function initStorage(): Promise<void> {
    const key = await getServiceAccountKey();
    storageInstance = new Storage({ credentials: key });
}

export function getStorage() {
    if (!storageInstance) {
        throw new Error('No storage instance found');
    }
    return storageInstance;
}
