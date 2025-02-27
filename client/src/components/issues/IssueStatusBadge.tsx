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
        open: 'danger',
        in_progress: 'warning',
        resolved: 'success'
    } as const;

    const statusLabel = {
        open: 'Open',
        in_progress: 'In Progress',
        resolved: 'Resolved'
    };

    return (
        <Badge variant={statusVariant[status]} className={className}>
            {statusLabel[status]}
        </Badge>
    );
};
