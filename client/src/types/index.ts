export type Park = {
    park_id: number;
    owner_id: number;
    name: string;
    county: string;
    is_active: boolean;
};

export type Trail = {
    trail_id: number;
    park_id: number;
    name: string;
    is_active: boolean;
    is_open: boolean;
};

export type IssueStatus = 'open' | 'in_progress' | 'resolved';

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
    [key: string]: string | number | boolean | undefined; // For any other properties
}

export type Issue = {
    issue_id: number;
    park_id: number;
    trail_id: number;
    is_public: boolean;
    status: IssueStatus;
    description: string;
    created_at: string; // ISO date string
    reporter_email?: string;
    issue_type: string;
    urgency: number; // 1-5 scale
    issue_image?: string;
    imageMetadata?: ImageMetadata;
    lon?: number;
    lat?: number;
    notify_reporter: boolean;
    resolved_at?: string; // ISO date string
};

export type UserRole = 'owner' | 'steward' | 'volunteer';

export type User = {
    user_id: number;
    name: string;
    is_hubspot_user: boolean;
    picture?: string;
    email: string;
    created_at: string;
    is_active: boolean;
    role?: UserRole;
};

export type StewardParkAssignment = {
    assignment_id: number;
    user_id: number; // Steward
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
    resolved_by: number; // user_id
    resolve_imageMetadata?: ImageMetadata;
};

export interface ParkInterface {
    park_id: number;
    name: string;
    county: string;
    owner_id: number;
    is_active: boolean;
  }
  
  export interface TrailInterface {
    trail_id: number;
    park_id: number;
    name: string;
    description: string;
    length: number;
    difficulty: 'easy' | 'moderate' | 'difficult';
    is_active: boolean;
  }
  
  export interface IssueInterface {
    issue_id: number;
    trail_id: number;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    severity: 'low' | 'medium' | 'high' | 'critical';
    reported_by: string;
    reported_at: string;
    is_public: boolean;
  }