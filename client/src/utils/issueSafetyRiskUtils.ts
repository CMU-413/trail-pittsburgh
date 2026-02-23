import { IssueRiskEnum } from '../types';

export const getSafetyRiskLabel = (level: IssueRiskEnum): string => {
    switch (level) {
    case IssueRiskEnum.NO_RISK: return 'No Risk';
    case IssueRiskEnum.MINOR_RISK: return 'Minor Risk';
    case IssueRiskEnum.SERIOUS_RISK: return 'Serious Risk/Immediate Danger';
    default: return 'No Risk';
    }
};

export const getSafetyRiskColor = (level: IssueRiskEnum): string => {
    switch (level) {
    case IssueRiskEnum.NO_RISK: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case IssueRiskEnum.MINOR_RISK: return 'bg-amber-100 text-amber-800 border-amber-200';
    case IssueRiskEnum.SERIOUS_RISK: return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
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
