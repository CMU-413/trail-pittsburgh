import { IssueUrgencyEnum } from '../types';

export const getUrgencyLabel = (level: IssueUrgencyEnum): string => {
    switch (level) {
    case IssueUrgencyEnum.VERY_LOW: return 'Very Low';
    case IssueUrgencyEnum.LOW: return 'Low';
    case IssueUrgencyEnum.MEDIUM: return 'Medium';
    case IssueUrgencyEnum.HIGH: return 'High';
    case IssueUrgencyEnum.VERY_HIGH: return 'Very High';
    default: return 'Medium';
    }
};

export const getUrgencyColor = (level: IssueUrgencyEnum): string => {
    switch (level) {
    case IssueUrgencyEnum.VERY_LOW: return 'bg-green-100 text-green-800 border-green-200';
    case IssueUrgencyEnum.LOW: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case IssueUrgencyEnum.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
    case IssueUrgencyEnum.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
    case IssueUrgencyEnum.VERY_HIGH: return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const getUrgencyLevelIndex = (level: IssueUrgencyEnum): number => {
    const urgencyLevels = [
        IssueUrgencyEnum.VERY_LOW,
        IssueUrgencyEnum.LOW,
        IssueUrgencyEnum.MEDIUM,
        IssueUrgencyEnum.HIGH,
        IssueUrgencyEnum.VERY_HIGH
    ];
    return urgencyLevels.indexOf(level);
};

export const getUrgencyIconSize = (level: IssueUrgencyEnum): number => {
    switch (level) {
    case IssueUrgencyEnum.VERY_LOW: return 3;
    case IssueUrgencyEnum.LOW: return 4;
    case IssueUrgencyEnum.MEDIUM: return 5;
    case IssueUrgencyEnum.HIGH: return 6;
    case IssueUrgencyEnum.VERY_HIGH: return 7;
    default: return 5;
    }
}; 