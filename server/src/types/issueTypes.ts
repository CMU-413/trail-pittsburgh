import { Prisma } from '@prisma/client';

import { CreateIssueInput } from '@/schemas/issueSchema';

export type CreateIssueDbInput = CreateIssueInput & {
    issueImageKey?: string;
}

export type IssueRecord = Prisma.IssueGetPayload<object>;

export interface IssueResolutionRecord {
    resolution_id: number;
    issue_id: number;
    resolved_at: Date;
    resolved_by: number;
    resolution_notes?: string;
    resolution_image?: string; // store the GCS key
}
  
export interface ResolveIssueInput {
    issueId: number;
    resolved_by: number;
    resolution_notes?: string;
    image_type?: string;
}
  
export interface ResolveIssueDbInput {
    issueId: number;
    resolved_by: number;
    resolution_notes?: string;
    resolutionImageKey?: string;
}