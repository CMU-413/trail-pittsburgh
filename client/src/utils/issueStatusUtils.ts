// src/utils/issueStatusUtils.ts
import { IssueStatusEnum } from '../types';

export const getIssueStatusColor = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.UNRESOLVED: return 'bg-red-100 text-red-700';
    case IssueStatusEnum.IN_PROGRESS: return 'bg-yellow-500 text-white';
    case IssueStatusEnum.RESOLVED: return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
    }
};

export const getIssueStatusTextColor = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.UNRESOLVED: return 'text-red-600';
    case IssueStatusEnum.IN_PROGRESS: return 'text-yellow-600';
    case IssueStatusEnum.RESOLVED: return 'text-green-600';
    default: return 'text-gray-600';
    }
};

export const getIssueStatusDotColor = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.UNRESOLVED: return 'bg-red-400';
    case IssueStatusEnum.IN_PROGRESS: return 'bg-yellow-500';
    case IssueStatusEnum.RESOLVED: return 'bg-green-500';
    default: return 'bg-gray-500';
    }
};

export const getIssueStatusLightBgColor = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.UNRESOLVED: return 'bg-red-100';
    case IssueStatusEnum.IN_PROGRESS: return 'bg-yellow-100';
    case IssueStatusEnum.RESOLVED: return 'bg-green-100';
    default: return 'bg-gray-100';
    }
};

export const getIssueStatusLabel = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.UNRESOLVED: return 'Unresolved';
    case IssueStatusEnum.IN_PROGRESS: return 'In Progress';
    case IssueStatusEnum.RESOLVED: return 'Resolved';
    default: return 'Unknown';
    }
};

export const getIssueStatusTooltip = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.UNRESOLVED:
        return 'This issue has been reported and may still affect the trail.';
    case IssueStatusEnum.IN_PROGRESS:
        return 'Work is currently being done to fix this issue.';
    case IssueStatusEnum.RESOLVED:
        return 'This issue has been fixed and should no longer impact the trail.';
    default:
        return 'Issue status is unknown.';
    }
};
