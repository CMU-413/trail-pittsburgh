import { IssueTypeEnum } from '../types';

export const issueTypeFrontendToEnum = (type: string): IssueTypeEnum => {
    switch (type) {
    case 'obstruction':
        return IssueTypeEnum.OBSTRUCTION;
    case 'erosion':
        return IssueTypeEnum.EROSION;
    case 'flooding':
        return IssueTypeEnum.FLOODING;
    case 'signage':
        return IssueTypeEnum.SIGNAGE;
    case 'vandalism':
        return IssueTypeEnum.VANDALISM;
    case 'other':
        return IssueTypeEnum.OTHER;
    default:
        return IssueTypeEnum.OTHER;
    }
};
