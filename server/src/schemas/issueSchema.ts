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
        parkId: z.number(),
        trailId: z.number(),
        issueType: z.string(),
        urgency: z.number(),
        isPublic: z.boolean().default(false),
        status: z.string().default('Open'),
        latitude: z.number().optional(),
        longitude: z.number().optional(),

        reporterEmail: z.string(),
        notifyReporter: z.boolean().default(false),
        description: z.string().optional(),
        imageMetadata: z.object({
            contentType: z.enum(['image/jpeg', 'image/png', 'image/heic']),
            headers: z.object({
                'x-goog-meta-capturedAt': z.string(),
                'x-goog-meta-latitude': z.string(),
                'x-goog-meta-longitude': z.string(),
            }).optional()
        }).optional(),
    })
});

export type CreateIssueInput = z.output<typeof createIssueSchema>['body'];

export const updateIssueStatusSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    }),
    body: z.object({
        status: z.string(),
    })
});

export const deleteIssueSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    })
});

export const resolveIssueSchema = {
    params: z.object({
        issueId: z.coerce.number(),
    }),
    body: z.object({
        resolved_by: z.number(),
        resolution_notes: z.string().optional(),
        image_type: z.string().optional(), // For uploaded images
    }),
};
