import { IssuePassibleEnum } from '../types';

export const getPassibleLabel = (level: IssuePassibleEnum): string => {
    switch (level) {
    case IssuePassibleEnum.YES: return 'Yes';
    case IssuePassibleEnum.NO: return 'No';
    default: return 'No';
    }
};

export const getPassibleColor = (level: IssuePassibleEnum): string => {
    switch (level) {
    case IssuePassibleEnum.YES: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case IssuePassibleEnum.NO: return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
};

export const getPassibleLevelIndex = (level: IssuePassibleEnum): number => {
    const passibleLevels = [
        IssuePassibleEnum.YES,
        IssuePassibleEnum.NO,
    ];
    return passibleLevels.indexOf(level);
};

export const getPassibleIconSize = (level: IssuePassibleEnum): number => {
    switch (level) {
    case IssuePassibleEnum.YES: return 4;
    case IssuePassibleEnum.NO: return 5;
    default: return 4;
    }
}; 

export const issuePassibleFrontendToEnum = (passible: number): IssuePassibleEnum => {
    switch (passible) {
    case 1:
        return IssuePassibleEnum.YES;
    case 2:
        return IssuePassibleEnum.NO;
    default:
        return IssuePassibleEnum.YES;
    }
};

export const issuePassibleEnumToFrontend = (passible: IssuePassibleEnum): number => {
    switch (passible) {
    case IssuePassibleEnum.YES:
        return 1;
    case IssuePassibleEnum.NO:
        return 2;
    default:
        return 1;
    }
};
