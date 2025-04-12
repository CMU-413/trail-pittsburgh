import { GetSignedUrlConfig, Bucket } from '@google-cloud/storage';

import { getStorage } from '@/config/storage';

type SignedUrl = {
    key: string;
    url: string;
    type: 'download' | 'upload';
}

export class GCSBucket {
    private readonly bucket: Bucket;

    // Expiration in seconds
    private static readonly UPLOAD_BUCKET_TIMEOUT: number = 10;
    private static readonly DOWNLOAD_BUCKET_TIMEOUT: number = 5 * 60;

    public constructor(bucketName: string) {
        const storage = getStorage();
        this.bucket = storage.bucket(bucketName);
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
            type: 'download',
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
            type: 'upload',
        };
    }
}
