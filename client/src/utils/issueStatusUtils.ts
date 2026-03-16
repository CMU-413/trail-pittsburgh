// src/utils/issueStatusUtils.ts
import { IssueStatusEnum } from '../types';

export const getIssueStatusColor = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.OPEN: return 'bg-red-500 text-white';
    case IssueStatusEnum.IN_PROGRESS: return 'bg-yellow-500 text-white';
    case IssueStatusEnum.RESOLVED: return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
    }
};

export const getIssueStatusTextColor = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.OPEN: return 'text-red-600';
    case IssueStatusEnum.IN_PROGRESS: return 'text-yellow-600';
    case IssueStatusEnum.RESOLVED: return 'text-green-600';
    default: return 'text-gray-600';
    }
};

export const getIssueStatusDotColor = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.OPEN: return 'bg-red-500';
    case IssueStatusEnum.IN_PROGRESS: return 'bg-yellow-500';
    case IssueStatusEnum.RESOLVED: return 'bg-green-500';
    default: return 'bg-gray-500';
    }
};

export const getIssueStatusLightBgColor = (status: IssueStatusEnum): string => {
    switch (status) {
    case IssueStatusEnum.OPEN: return 'bg-red-100';
    case IssueStatusEnum.IN_PROGRESS: return 'bg-yellow-100';
    case IssueStatusEnum.RESOLVED: return 'bg-green-100';
    default: return 'bg-gray-100';
    }
};
