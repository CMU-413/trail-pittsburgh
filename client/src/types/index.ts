// types/index.ts

export type ApiResponse<T> = {
    data: T;
};

export type Park = {
    parkId: number;
    ownerId?: number; // Not in schema, but retained if relevant in frontend
    name: string;
    county: string;
    isActive: boolean;
    createdAt: string;
};
  
export type Trail = {
    trailId: number;
    parkId: number;
    name: string;
    isActive: boolean;
    isOpen: boolean;
    createdAt: string;
};
  
export type IssueStatus = 'open' | 'in_progress' | 'resolved'; // match backend usage (consider moving to Prisma enum)
  
export interface ImageMetadata {
    DateTimeOriginal?: string;
    Make?: string;
    Model?: string;
    latitude?: number;
    longitude?: number;
    Orientation?: number;
    ExposureTime?: number;
    FNumber?: number;
    ISO?: number;
    LensModel?: string;
    Software?: string;
    GPSLatitude?: number;
    GPSLongitude?: number;
    [key: string]: string | number | boolean | undefined;
}
  
export type Issue = {
    issueId: number;
    parkId: number;
    trailId: number;
    isPublic: boolean;
    status: IssueStatus;
    description?: string;
    issueType: string;
    urgency: number; // 1-5 scale
    image?: SignedUrl;
    imageMetadata?: ImageMetadata;
    lon?: number;
    lat?: number;
    notifyReporter: boolean;
    reporterEmail: string;
    createdAt: string;
    resolvedAt?: string;
};  

export type SignedUrl = {
    key: string;
    url: string;
    type: 'download' | 'upload';
};

export type IssueParams = Omit<Issue, 'resolvedAt' | 'image' | 'issueId'> & {
    image?: File;
    reporterEmail?: string;
};

export type UserRole = 'owner' | 'steward' | 'volunteer';

export type User = {
    id: string;
    email: string;
    name?: string;
    picture?: string;
};
  
export type StewardParkAssignment = {
    assignment_id: number;
    userId: number;
    parkId: number;
    assigned_date: string;
    isActive: boolean;
};
  
export type IssueResolutionUpdate = {
    res_id: number;
    issueId: number;
    resolve_image?: string;
    resolve_notes?: string;
    resolvedAt: string;
    resolved_by: number;
    resolve_imageMetadata?: ImageMetadata;
};
  
export type Notification = {
    notification_id: number;
    issueId: number;
    recipientEmail: string;
    content: string;
    sentAt?: string;
    createdAt: string;
};
