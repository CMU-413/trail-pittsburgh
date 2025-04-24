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
        imageType: z.enum(['image/jpeg', 'image/png', 'image/heic']).optional(),
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

export const updateIssueSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    }),
    body: z.object({
        description: z.string().optional(),
        urgency: z.number().min(1).max(5).optional(),
        issueType: z.string().optional(),
    }).refine(data => {
        // At least one field must be provided
        return data.description !== undefined || 
               data.urgency !== undefined || 
               data.issueType !== undefined;
    }, {
        message: "At least one field must be provided for update"
    })
});

export type UpdateIssueInput = z.output<typeof updateIssueSchema>['body'];
