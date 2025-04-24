// src/components/issues/IssueStatusBadge.tsx
import React from 'react';
import { IssueStatus } from '../../types';
import { Badge } from '../ui/Badge';

interface IssueStatusBadgeProps {
    status: IssueStatus;
    className?: string;
}

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({ status, className = '' }) => {
    // Updated color mapping to match the dashboard
    const statusVariant = {
        OPEN: 'danger',
        IN_PROGRESS: 'warning',
        RESOLVED: 'success'
    } as const;

    const statusLabel = {
        OPEN: 'Open',
        IN_PROGRESS: 'In Progress',
        RESOLVED: 'Resolved'
    };

    return (
        <Badge variant={statusVariant[status]} className={className}>
            {statusLabel[status]}
        </Badge>
    );
};
