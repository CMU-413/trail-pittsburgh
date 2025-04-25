import {
    GetSignedUrlConfig, Bucket, Storage 
} from '@google-cloud/storage';

export type SignedUrl = {
    key: string;
    url: string;
}

export class GCSBucket {
    private bucket: Bucket;
    
    // Expiration in seconds
    private static readonly UPLOAD_BUCKET_TIMEOUT: number = 20;
    private static readonly DOWNLOAD_BUCKET_TIMEOUT: number = 5 * 60;

    public constructor(bucketName: string) {
        const storage = new Storage();
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
}
