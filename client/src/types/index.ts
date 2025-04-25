// types/index.ts

export type ApiResponse<T> = {
    data: T;
};

export type Park = {
    parkId: number;
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

export enum IssueStatusEnum {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export enum IssueTypeEnum {
    OBSTRUCTION = 'OBSTRUCTION',
    EROSION = 'EROSION',
    FLOODING = 'FLOODING',
    SIGNAGE = 'SIGNAGE',
    VANDALISM = 'VANDALISM',
    OTHER = 'OTHER'
}

export enum IssueUrgencyEnum {
    VERY_LOW = 'VERY_LOW',
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    VERY_HIGH = 'VERY_HIGH'
}

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
    status: IssueStatusEnum;
    description?: string;
    issueType: IssueTypeEnum;
    urgency: IssueUrgencyEnum;
    image?: SignedUrl;
    imageMetadata?: ImageMetadata;
    longitude?: number;
    latitude?: number;
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
    role?: string;
    permission?: 'owner' | 'steward' | 'volunteer';
    profileImage?: string;
    username?: string;
    userId?: number;
    isActive?: boolean;
    createdAt?: string;
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
