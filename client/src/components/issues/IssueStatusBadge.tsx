// src/components/issues/IssueStatusBadge.tsx
import React from 'react';
import { IssueStatusEnum } from '../../types';
import { Badge } from '../ui/Badge';

interface IssueStatusBadgeProps {
    status: IssueStatusEnum;
    className?: string;
}

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({ status, className = '' }) => {
    const statusVariant = {
        [IssueStatusEnum.OPEN]: 'danger',
        [IssueStatusEnum.IN_PROGRESS]: 'warning',
        [IssueStatusEnum.RESOLVED]: 'success',
        [IssueStatusEnum.CLOSED]: 'secondary'
    } as const;

    const statusLabel = {
        [IssueStatusEnum.OPEN]: 'Open',
        [IssueStatusEnum.IN_PROGRESS]: 'In Progress',
        [IssueStatusEnum.RESOLVED]: 'Resolved',
        [IssueStatusEnum.CLOSED]: 'Closed'
    };

    return (
        <Badge variant={statusVariant[status]} className={className}>
            {statusLabel[status]}
        </Badge>
    );
};
