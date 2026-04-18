import {
    Prisma , IssueStatusEnum, IssueTypeEnum, IssueRiskEnum
} from '@prisma/client';
import { z } from 'zod';

export const getIssuesByParkSchema = z.object({
    params: z.object({
        parkId: z.coerce.number(),
    }),
    query: z.object({
        statuses: z
            .union([
                z.literal('NONE'),
                z.nativeEnum(IssueStatusEnum),
                z.array(z.nativeEnum(IssueStatusEnum)),
            ])
            .transform((v) => {
                if (v === 'NONE') {return [];}
                return Array.isArray(v) ? v : [v];
            }),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
});

export const getIssuesQuerySchema = z.object({
    query: z.object({
        reporterEmail: z.string().email().optional(),
        ownerEmail: z.string().email().optional()
    })
});

export const getIssueSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    })
});

export const setIssueGroupSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    }),
    body: z.object({
        issueGroupMemberIds: z.array(z.coerce.number()).default([]),
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
        statuses: z
            .union([z.nativeEnum(IssueStatusEnum), z.array(z.nativeEnum(IssueStatusEnum))])
            .transform((v) => (
                v === undefined ? [
                    IssueStatusEnum.UNRESOLVED, IssueStatusEnum.IN_PROGRESS
                ] : Array.isArray(v) ? v : [v]))
            .default([IssueStatusEnum.UNRESOLVED, IssueStatusEnum.IN_PROGRESS]),
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

export const unsubscribeIssueNotificationsSchema = z.object({
    params: z.object({
        issueId: z.coerce.number(),
    }),
    query: z.object({
        token: z.string().min(1),
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
        issueType: z.nativeEnum(IssueTypeEnum),
        safetyRisk: z.nativeEnum(IssueRiskEnum),
        passible: z.boolean().default(false),
        isPublic: z.boolean().default(false),
        isImagePublic: z.boolean().default(false),
        status: z.nativeEnum(IssueStatusEnum).default(IssueStatusEnum.UNRESOLVED),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        reporterEmail: z.string().email().optional(),
        ownerEmail: z.string().email().optional(),
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
        safetyRisk: z.nativeEnum(IssueRiskEnum).optional(),
        issueType: z.nativeEnum(IssueTypeEnum).optional(),
        isImagePublic: z.boolean().optional(),
        parkId: z.coerce.number().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
    }).refine((data) => {
        // At least one field must be provided
        return data.description !== undefined ||
               data.safetyRisk !== undefined ||
               data.issueType !== undefined ||
               data.isImagePublic !== undefined ||
               data.parkId !== undefined ||
			   data.latitude !== undefined ||
			   data.longitude !== undefined;
    }, {
        message: 'At least one field must be provided for update'
    })
});

export type UpdateIssueInput = z.output<typeof updateIssueSchema>['body'];

export type SetIssueGroupInput = z.output<typeof setIssueGroupSchema>['body'];
