// src/utils/issueStatusUtils.ts
import { IssueStatus } from '../types';

export const getIssueStatusColor = (status: IssueStatus): string => {
    switch (status) {
    case 'OPEN': return 'bg-red-500 text-white';
    case 'IN_PROGRESS': return 'bg-yellow-500 text-white';
    case 'RESOLVED': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
    }
};

export const getIssueStatusTextColor = (status: IssueStatus): string => {
    switch (status) {
    case 'OPEN': return 'text-red-600';
    case 'IN_PROGRESS': return 'text-yellow-600';
    case 'RESOLVED': return 'text-green-600';
    default: return 'text-gray-600';
    }
};

export const getIssueStatusDotColor = (status: IssueStatus): string => {
    switch (status) {
    case 'OPEN': return 'bg-red-500';
    case 'IN_PROGRESS': return 'bg-yellow-500';
    case 'RESOLVED': return 'bg-green-500';
    default: return 'bg-gray-500';
    }
};

export const getIssueStatusLightBgColor = (status: IssueStatus): string => {
    switch (status) {
    case 'OPEN': return 'bg-red-100';
    case 'IN_PROGRESS': return 'bg-yellow-100';
    case 'RESOLVED': return 'bg-green-100';
    default: return 'bg-gray-100';
    }
};
