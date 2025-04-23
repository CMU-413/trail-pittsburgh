import { z } from 'zod';
import { IssueStatus, IssueType, Urgency, Prisma } from '@prisma/client';

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
        urgency: z.nativeEnum(Urgency),
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
        status: z.nativeEnum(IssueStatus),
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
        issueType: z.nativeEnum(IssueType),
        urgency: z.nativeEnum(Urgency),
        isPublic: z.boolean().default(false),
        status: z.nativeEnum(IssueStatus).default(IssueStatus.OPEN),
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
