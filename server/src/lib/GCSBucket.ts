import {
    GetSignedUrlConfig, Bucket, Storage
} from '@google-cloud/storage';

export function createBucket(bucketName: string): Bucket {

    if (process.env.NODE_ENV === 'test') {
        // In test mode, just return a mock bucket or do nothing.
        // Note: Integration tests should not test bucket behavior.
        return {} as Bucket;
    }

    let storage;
    if (process.env.NODE_ENV === 'production') {
        storage = new Storage();
    } else {
        const keyFilename = process.env.GCS_SERVICE_ACCOUNT_KEY_FILENAME;
        if (!keyFilename) {
            throw new Error('Service account key required to access google cloud storage');
        }
        storage = new Storage({ keyFilename });
    }
    return storage.bucket(bucketName);
}

export type SignedUrl = {
    key: string;
    url: string;
}

export class GCSBucket {
    private bucket: Bucket;
    
    // Expiration in seconds
    private static readonly UPLOAD_BUCKET_TIMEOUT: number = 20;
    private static readonly DOWNLOAD_BUCKET_TIMEOUT: number = 5 * 60;

    public constructor(bucket: Bucket) {
        this.bucket = bucket;
    }

    async getDownloadUrl(key: string): Promise<SignedUrl> {
        const file = this.bucket.file(key);
        const options: GetSignedUrlConfig = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + GCSBucket.DOWNLOAD_BUCKET_TIMEOUT * 1000,
        };

        const [url] = await file.getSignedUrl(options);

        return {
            key,
            url,
        };
    }

    async getUploadUrl(key: string, contentType: string): Promise<SignedUrl> {
        const file = this.bucket.file(key);
        const options: GetSignedUrlConfig = {
            version: 'v4',
            action: 'write',
            expires: Date.now() + GCSBucket.UPLOAD_BUCKET_TIMEOUT * 1000,
            contentType
        };

        const [url] = await file.getSignedUrl(options);

        return {
            key,
            url,
        };
    }

    async getImageMetadata(key: string) {
        const file = this.bucket.file(key);
        const [fileMetadata] = await file.getMetadata();
        const { contentType, metadata } = fileMetadata;

        return {
            contentType,
            metadata
        };

    }
}
