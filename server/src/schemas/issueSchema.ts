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

export const getIssueMapPinsSchema = z.object({
    query: z.object({
    // required, because map requests need bounds (range of lat and lng)
        bbox: z.string().min(1),
        issueTypes:z
            .union([z.nativeEnum(IssueTypeEnum), z.array(z.nativeEnum(IssueTypeEnum))])
 		.transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]))
  		.default([]),
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
        urgency: z.nativeEnum(IssueUrgencyEnum).optional(),
        issueType: z.nativeEnum(IssueTypeEnum).optional(),
        parkId: z.coerce.number().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
    }).refine((data) => {
        // At least one field must be provided
        return data.description !== undefined ||
               data.urgency !== undefined ||
               data.issueType !== undefined ||
               data.parkId !== undefined ||
			   data.latitude !== undefined ||
			   data.longitude !== undefined;
    }, {
        message: 'At least one field must be provided for update'
    })
});

export type UpdateIssueInput = z.output<typeof updateIssueSchema>['body'];
