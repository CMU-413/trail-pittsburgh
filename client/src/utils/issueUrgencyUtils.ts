import { IssueUrgencyEnum } from '../types';

export const getUrgencyLabel = (level: IssueUrgencyEnum): string => {
    switch (level) {
    case IssueUrgencyEnum.LOW: return 'Low';
    case IssueUrgencyEnum.MEDIUM: return 'Medium';
    case IssueUrgencyEnum.HIGH: return 'High';
    default: return 'Low';
    }
};

export const getUrgencyColor = (level: IssueUrgencyEnum): string => {
    switch (level) {
    case IssueUrgencyEnum.LOW: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case IssueUrgencyEnum.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
    case IssueUrgencyEnum.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const getUrgencyLevelIndex = (level: IssueUrgencyEnum): number => {
    const urgencyLevels = [
        IssueUrgencyEnum.LOW,
        IssueUrgencyEnum.MEDIUM,
        IssueUrgencyEnum.HIGH
    ];
    return urgencyLevels.indexOf(level);
};

export const getUrgencyIconSize = (level: IssueUrgencyEnum): number => {
    switch (level) {
    case IssueUrgencyEnum.LOW: return 4;
    case IssueUrgencyEnum.MEDIUM: return 5;
    case IssueUrgencyEnum.HIGH: return 6;
    default: return 4;
    }
}; 

export const issueUrgencyFrontendToEnum = (urgency: number): IssueUrgencyEnum => {
    switch (urgency) {
    case 1:
        return IssueUrgencyEnum.LOW;
    case 2:
        return IssueUrgencyEnum.MEDIUM;
    case 3:
        return IssueUrgencyEnum.HIGH;
    default:
        return IssueUrgencyEnum.LOW;
    }
};

export const issueUrgencyEnumToFrontend = (urgency: IssueUrgencyEnum): number => {
    switch (urgency) {
    case IssueUrgencyEnum.LOW:
        return 1;
    case IssueUrgencyEnum.MEDIUM:
        return 2;
    case IssueUrgencyEnum.HIGH:
        return 3;
    default:
        return 1;
    }
};
