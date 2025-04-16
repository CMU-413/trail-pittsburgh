import { GetSignedUrlConfig, Bucket } from '@google-cloud/storage';

import { getStorage } from '@/config/storage';

export type SignedUrl = {
    key: string;
    url: string;
    type: 'download' | 'upload';
}

export class GCSBucket {
    private bucket?: Bucket;
    private readonly bucketName: string;

    // Expiration in seconds
    private static readonly UPLOAD_BUCKET_TIMEOUT: number = 20;
    private static readonly DOWNLOAD_BUCKET_TIMEOUT: number = 5 * 60;

    public constructor(bucketName: string) {
        this.bucketName = bucketName;
    }

    private async getBucket() {
        if (!this.bucket) {
            const storage = getStorage();
            this.bucket = storage.bucket(this.bucketName);
        }
        return this.bucket;
    }

    async getDownloadUrl(key: string): Promise<SignedUrl> {
        const bucket =  await this.getBucket();
        const file = bucket.file(key);
        const options: GetSignedUrlConfig = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + GCSBucket.DOWNLOAD_BUCKET_TIMEOUT * 1000,
        };

        const [url] = await file.getSignedUrl(options);

        return {
            key,
            url,
            type: 'download',
        };
    }

    async getUploadUrl(key: string, contentType: string): Promise<SignedUrl> {
        const bucket =  await this.getBucket();
        const file = bucket.file(key);
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
            type: 'upload',
        };
    }
}
