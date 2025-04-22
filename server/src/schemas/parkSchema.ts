import { z } from 'zod';

export const getParkSchema = z.object({
    params: z.object({
        parkId: z.coerce.number(),
    })
});

export const createParkSchema = z.object({
    body: z.object({
        name: z.string(),
        county: z.string(),
        isActive: z.boolean().optional()
    })
});

export const updateParkSchema = z.object({
    params: z.object({
        parkId: z.coerce.number(),
    }),
    body: z.object({
        isActive: z.boolean().optional(),
        county: z.string().optional(),
        name: z.string().optional(),
    })
});

export const deleteParkSchema = z.object({
    params: z.object({
        parkId: z.coerce.number(),
    })
});
