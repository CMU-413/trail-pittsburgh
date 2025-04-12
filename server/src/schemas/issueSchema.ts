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
        isPublic: z.boolean().default(true),
        status: z.string().default('Open'),

        reporter_email: z.string().optional(),
        notify_reporter: z.boolean().default(false),
        description: z.string().optional(),
        issue_image: z.string().optional(),
    })
});

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
