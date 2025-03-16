import { GetSignedUrlConfig, Bucket } from '@google-cloud/storage';

import { getStorage } from '@/config/storage';

export class GCSBucket {
    private readonly bucket: Bucket;

    private constructor(bucket: Bucket) {
        this.bucket = bucket;
    }

    public static async of(bucketName: string): Promise<GCSBucket> {
        const storage = await getStorage();
        const bucket = storage.bucket(bucketName);
        return new GCSBucket(bucket);
    }

    async getSignedUrl(key: string, expiresInSeconds = 60 * 30) {
        const file = this.bucket.file(key);
        const options: GetSignedUrlConfig = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + expiresInSeconds * 1000,
        };

        const [res] = await file.getSignedUrl(options);
        return res;
    }

    async uploadImage(image: File, key: string) {
        const imageData = await image.arrayBuffer();
        const uint8Array = new Uint8Array(imageData);
        const file = this.bucket.file(key);

        await file.save(uint8Array, {
            resumable: false,
        });
    }
}
