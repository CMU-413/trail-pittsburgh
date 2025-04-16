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
        urgency: z.coerce.number(),
    })
});

export const getIssueSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    })
});

export const createIssueSchema = z.object({
    body: z.object({
        park_id: z.number(),
        trail_id: z.number(),
        issue_type: z.string(),
        urgency: z.number(),
        is_public: z.boolean().default(false),
        status: z.string().default('Open'),

        reporter_email: z.string(),
        notify_reporter: z.boolean().default(false),
        description: z.string().optional(),
        image_type: z.enum(['image/jpeg', 'image/png', 'image/heic']).optional(),
    })
});

export type CreateIssueInput = z.output<typeof createIssueSchema>['body'];

export const updateIssueStatusSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    })
});

export const deleteIssueSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    })
});
