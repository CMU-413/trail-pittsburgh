import { z } from 'zod';

export const getTrailSchema = z.object({
    params: z.object({
        trailId: z.coerce.number(),
    })
});

export const createTrailSchema = z.object({
    body: z.object({
        name: z.string(),
        parkId: z.number(),
        isActive: z.boolean().optional(),
        isOpen: z.boolean().optional(),
    })
});

export const updateTrailSchema = z.object({
    params: z.object({
        trailId: z.coerce.number(),
    }),
    body: z.object({
        name: z.string().optional(),
        isOpen: z.boolean().optional(),
        isActive: z.boolean().optional(),
    })
});

export const deleteTrailSchema = z.object({
    params: z.object({
        trailId: z.coerce.number(),
    }),
});

export const getTrailsFromParkSchema = z.object({
    params: z.object({
        parkId: z.coerce.number(),
    }),
});

export type CreateTrail = z.infer<typeof createTrailSchema>['body'];
export type UpdateTrail = z.infer<typeof updateTrailSchema>['body'];