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

// Helper functions for using the status colors elsewhere in the app
export const getIssueStatusColor = (status: IssueStatus): string => {
    switch (status) {
        case 'open': return 'bg-red-500 text-white';
        case 'in_progress': return 'bg-yellow-500 text-white';
        case 'resolved': return 'bg-green-500 text-white';
        default: return 'bg-gray-500 text-white';
    }
};

export const getIssueStatusTextColor = (status: IssueStatus): string => {
    switch (status) {
        case 'open': return 'text-red-600';
        case 'in_progress': return 'text-yellow-600';
        case 'resolved': return 'text-green-600';
        default: return 'text-gray-600';
    }
};

export const getIssueStatusBgColor = (status: IssueStatus): string => {
    switch (status) {
        case 'open': return 'bg-red-500';
        case 'in_progress': return 'bg-yellow-500';
        case 'resolved': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
};

export const getIssueStatusDotColor = (status: IssueStatus): string => {
    switch (status) {
        case 'open': return 'bg-red-500';
        case 'in_progress': return 'bg-yellow-500';
        case 'resolved': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
};

export const getIssueStatusLightBgColor = (status: IssueStatus): string => {
    switch (status) {
        case 'open': return 'bg-red-100';
        case 'in_progress': return 'bg-yellow-100';
        case 'resolved': return 'bg-green-100';
        default: return 'bg-gray-100';
    }
};
