import { IssueTypeEnum } from '../types';

export const issueTypeFrontendToEnum = (type: string): IssueTypeEnum => {
    switch (type) {
    case 'obstruction':
        return IssueTypeEnum.OBSTRUCTION;
    case 'flooding':
        return IssueTypeEnum.FLOODING;
    case 'other':
        return IssueTypeEnum.OTHER;
    default:
        return IssueTypeEnum.OTHER;
    }
};
