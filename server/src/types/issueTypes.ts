import { Prisma } from '@prisma/client';

import { CreateIssueInput } from '@/schemas/issueSchema';

export type CreateIssueDbInput = CreateIssueInput & {
    // issueImageKey?: string;
    issueImage?: string;
}

export type IssueRecord = Prisma.IssueGetPayload<object>;
