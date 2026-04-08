// src/components/issues/IssueStatusBadge.tsx
import React from 'react';
import { IssueStatusEnum } from '../../types';
import { Badge } from '../ui/Badge';
import { getIssueStatusLabel, getIssueStatusTooltip } from '../../utils/issueStatusUtils';

interface IssueStatusBadgeProps {
    status: IssueStatusEnum;
    className?: string;
}

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({ status, className = '' }) => {
    const statusVariant = {
        [IssueStatusEnum.UNRESOLVED]: 'danger',
        [IssueStatusEnum.IN_PROGRESS]: 'warning',
        [IssueStatusEnum.RESOLVED]: 'success'
    } as const;

    return (
        <Badge
            variant={statusVariant[status]}
            className={className}
            title={getIssueStatusTooltip(status)}
        >
            {getIssueStatusLabel(status)}
        </Badge>
    );
};
