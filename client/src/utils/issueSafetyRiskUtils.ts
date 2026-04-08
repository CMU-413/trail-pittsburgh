import { IssueRiskEnum } from '../types';

export const getSafetyRiskLabel = (level: IssueRiskEnum): string => {
    switch (level) {
    case IssueRiskEnum.NO_RISK: return 'No Risk';
    case IssueRiskEnum.MINOR_RISK: return 'Minor Risk';
    case IssueRiskEnum.SERIOUS_RISK: return 'Serious Risk / Immediate Danger';
    default: return 'No Risk';
    }
};

export const getSafetyRiskShortLabel = (level: IssueRiskEnum): string => {
    switch (level) {
    case IssueRiskEnum.NO_RISK:
        return 'No Risk';
    case IssueRiskEnum.MINOR_RISK:
        return 'Minor';
    case IssueRiskEnum.SERIOUS_RISK:
        return 'Serious';
    default:
        return 'No Risk';
    }
};

export const getReportedSafetyRiskBadgeLabel = (level: IssueRiskEnum): string => {
    return `Reported ${getSafetyRiskShortLabel(level)}`;
};

export const getSafetyRiskDescription = (level: IssueRiskEnum): string => {
    switch (level) {
    case IssueRiskEnum.NO_RISK:
        return 'Safe to pass through.';
    case IssueRiskEnum.MINOR_RISK:
        return 'Requires caution to avoid injury.';
    case IssueRiskEnum.SERIOUS_RISK:
        return 'Dangerous condition, risk of serious harm.';
    default:
        return 'Safe to pass through.';
    }
};

export const getStewardSafetyRiskDescription = (level: IssueRiskEnum): string => {
    switch (level) {
    case IssueRiskEnum.NO_RISK:
        return 'Reporter selected the lowest risk level available on the form, indicating they believed the issue was safe to pass through.';
    case IssueRiskEnum.MINOR_RISK:
        return 'Reporter selected the middle risk level available on the form, indicating they believed the issue required caution, but was not immediately dangerous.';
    case IssueRiskEnum.SERIOUS_RISK:
        return 'Reporter selected the highest risk level available on the form, indicating they believed the issue may need prompt attention.';
    default:
        return 'Reporter selected the lowest risk level available on the form.';
    }
};

export const getSafetyRiskBadgeColor = (level: IssueRiskEnum): string => {
    switch (level) {
    case IssueRiskEnum.NO_RISK:
        return 'bg-green-100 text-green-800 border border-green-200';
    case IssueRiskEnum.MINOR_RISK:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case IssueRiskEnum.SERIOUS_RISK:
        return 'bg-red-100 text-red-800 border border-red-200';
    default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
};

export const getPassabilityBadgeLabel = (isPassable: boolean): string => {
    return isPassable ? 'Passable' : 'Unpassable';
};

export const getPassabilityBadgeColor = (isPassable: boolean): string => {
    return isPassable
        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    : 'bg-red-100 text-red-800 border border-red-200';
};

export const getSafetyRiskLevelIndex = (level: IssueRiskEnum): number => {
    const safetyRiskLevels = [
        IssueRiskEnum.NO_RISK,
        IssueRiskEnum.MINOR_RISK,
        IssueRiskEnum.SERIOUS_RISK
    ];
    return safetyRiskLevels.indexOf(level);
};

export const getSafetyRiskIconSize = (level: IssueRiskEnum): number => {
    switch (level) {
    case IssueRiskEnum.NO_RISK: return 4;
    case IssueRiskEnum.MINOR_RISK: return 5;
    case IssueRiskEnum.SERIOUS_RISK: return 6;
    default: return 4;
    }
}; 

export const issueSafetyRiskFrontendToEnum = (risk: number): IssueRiskEnum => {
    switch (risk) {
    case 1:
        return IssueRiskEnum.NO_RISK;
    case 2:
        return IssueRiskEnum.MINOR_RISK;
    case 3:
        return IssueRiskEnum.SERIOUS_RISK;
    default:
        return IssueRiskEnum.NO_RISK;
    }
};

export const issueSafetyRiskEnumToFrontend = (risk: IssueRiskEnum): number => {
    switch (risk) {
    case IssueRiskEnum.NO_RISK:
        return 1;
    case IssueRiskEnum.MINOR_RISK:
        return 2;
    case IssueRiskEnum.SERIOUS_RISK:
        return 3;
    default:
        return 1;
    }
};
