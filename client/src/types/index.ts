// types/index.ts

export type ApiResponse<T> = {
    data: T;
};

export type Park = {
    park_id: number;
    owner_id?: number; // Not in schema, but retained if relevant in frontend
    name: string;
    county: string;
    is_active: boolean;
    created_at: string;
};
  
export type Trail = {
    trail_id: number;
    park_id: number;
    name: string;
    is_active: boolean;
    is_open: boolean;
    created_at: string;
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
    issue_id: number;
    park_id: number;
    trail_id: number;
    is_public: boolean;
    status: IssueStatus;
    description?: string;
    issue_type: string;
    urgency: number; // 1-5 scale
    image?: SignedUrl;
    imageMetadata?: ImageMetadata;
    lon?: number;
    lat?: number;
    notify_reporter: boolean;
    reporter_email: string;
    created_at: string;
    resolved_at?: string;
};  

export type SignedUrl = {
    key: string;
    url: string;
    type: 'download' | 'upload';
};

export type IssueParams = Omit<Issue, 'resolved_at' | 'image' | 'issue_id'> & {
    image?: File;
    reporter_email?: string;
};

export type UserRole = 'owner' | 'steward' | 'volunteer';

export type User = {
    user_id: number;
    username: string;
    email: string;
    profile_image: string;
    is_admin: boolean;
    permission: string;
    is_active: boolean;
    created_at: string;
};
  
export type StewardParkAssignment = {
    assignment_id: number;
    user_id: number;
    park_id: number;
    assigned_date: string;
    is_active: boolean;
};
  
export type IssueResolutionUpdate = {
    res_id: number;
    issue_id: number;
    resolve_image?: string;
    resolve_notes?: string;
    resolved_at: string;
    resolved_by: number;
    resolve_imageMetadata?: ImageMetadata;
};
  
export type Notification = {
    notification_id: number;
    issue_id: number;
    recipient_email: string;
    content: string;
    sent_at?: string;
    created_at: string;
};
