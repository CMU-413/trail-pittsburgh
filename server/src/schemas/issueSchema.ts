import {
    Prisma , IssueStatusEnum, IssueTypeEnum, IssueUrgencyEnum 
} from '@prisma/client';
import { z } from 'zod';

export const getIssuesByParkSchema = z.object({
    params: z.object({
        parkId: z.coerce.number(),
    })
});

export const getIssuesByTrailSchema = z.object({
    params: z.object({
        trailId: z.coerce.number(),
    })
});

export const getIssuesByUrgencySchema = z.object({
    params: z.object({
        urgency: z.nativeEnum(IssueUrgencyEnum),
    })
});

export const getIssueSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    })
});

export const updateIssueStatusSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    }),
    body: z.object({
        status: z.nativeEnum(IssueStatusEnum),
    })
});

export const deleteIssueSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    })
});

export const resolveIssueSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    }),
    body: z.object({
        resolved_by: z.coerce.number(),
        resolution_notes: z.string().optional(),
        image_type: z.string().optional(),
    })
});

export const createIssueSchema = z.object({
    body: z.object({
        parkId: z.coerce.number(),
        trailId: z.coerce.number(),
        issueType: z.nativeEnum(IssueTypeEnum),
        urgency: z.nativeEnum(IssueUrgencyEnum),
        isPublic: z.boolean().default(false),
        status: z.nativeEnum(IssueStatusEnum).default(IssueStatusEnum.OPEN),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        reporterEmail: z.string().email().optional(),
        notifyReporter: z.boolean().default(false),
        description: z.string().max(150).optional(),
        imageType: z.enum(['image/jpeg', 'image/png', 'image/heic']).optional(),
    })
});

export type CreateIssueInput = z.output<typeof createIssueSchema>['body'];

export type CreateIssueDbInput = CreateIssueInput & {
    issueImageKey?: string;
};

export type IssueRecord = Prisma.IssueGetPayload<object>;

export const updateIssueSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    }),
    body: z.object({
        description: z.string().optional(),
        urgency: z.number().min(1).max(5).optional(),
        issueType: z.string().optional(),
    }).refine((data) => {
        // At least one field must be provided
        return data.description !== undefined || 
               data.urgency !== undefined || 
               data.issueType !== undefined;
    }, {
        message: 'At least one field must be provided for update'
    })
});

export type UpdateIssueInput = z.output<typeof updateIssueSchema>['body'];
