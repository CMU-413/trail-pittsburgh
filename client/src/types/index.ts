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
    RESOLVED = 'RESOLVED'
}

export enum IssueTypeEnum {
    OBSTRUCTION = 'OBSTRUCTION',
    STANDINGWATER = 'STANDINGWATER',
    OTHER = 'OTHER'
}

// Need to remove
export enum IssueUrgencyEnum {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export enum IssueRiskEnum {
    NO_RISK = 'NO_RISK',
    MINOR_RISK = 'MINOR_RISK',
    SERIOUS_RISK = 'SERIOUS_RISK'
}

export enum IssuePassibleEnum {
    YES = 'YES',
    NO = 'NO'
}

export enum UserRoleEnum {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_SUPERADMIN = 'ROLE_SUPERADMIN'
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
    isImagePublic?: boolean;
    status: IssueStatusEnum;
    description?: string;
    issueType: IssueTypeEnum;
    urgency: IssueUrgencyEnum;
    passible: boolean;
    safetyRisk: IssueRiskEnum;
    image?: Image;
    imageMetadata?: ImageMetadata;
    longitude: number;
    latitude: number;
    notifyReporter: boolean;
    reporterEmail: string;
    createdAt: string;
    resolvedAt?: string;

	park?: {
    	name: string;
  	};
};  

export type Image = {
    key: string;
    url: string;
    metadata: object;
    contentType?: string;
    errorMessage?: string;
};

export type IssueParams = Omit<Issue, 'resolvedAt' | 'image' | 'issueId'> & {
    image?: File;
    reporterEmail?: string;
};

export type User = {
    id: string;
    email: string;
    name?: string;
    picture?: string;
    role?: UserRoleEnum;
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
