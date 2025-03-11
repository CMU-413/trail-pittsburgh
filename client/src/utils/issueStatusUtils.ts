// src/utils/issueStatusUtils.ts
import { IssueStatus } from '../types';

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
