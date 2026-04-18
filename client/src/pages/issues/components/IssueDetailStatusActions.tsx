import React from 'react';
import { IssueStatusEnum } from '../../../types';
import { Button } from '../../../components/ui/Button';

type IssueDetailStatusActionsProps = {
    canManageIssueStatus: boolean;
    isEditing: boolean;
    issueStatus: IssueStatusEnum;
    isResolving: boolean;
    onResolveIssue: () => void;
    onSetInProgress: () => void;
};

export const IssueDetailStatusActions: React.FC<IssueDetailStatusActionsProps> = ({
    canManageIssueStatus,
    isEditing,
    issueStatus,
    isResolving,
    onResolveIssue,
    onSetInProgress,
}) => {
    return (
        <div className="flex w-full flex-wrap gap-2 md:w-auto md:shrink-0 md:justify-end">
            {canManageIssueStatus && !isEditing && issueStatus !== IssueStatusEnum.RESOLVED && (
                <Button
                    variant="success"
                    size="md"
                    className="rounded-full px-4 py-2 font-semibold shadow-sm"
                    onClick={onResolveIssue}
                    isLoading={isResolving}
                    disabled={isResolving}
                >
                    {isResolving ? 'Resolving...' : 'Resolve Issue'}
                </Button>
            )}

            {canManageIssueStatus && !isEditing && (issueStatus === IssueStatusEnum.UNRESOLVED || issueStatus === IssueStatusEnum.RESOLVED) && (
                <Button
                    variant={issueStatus === IssueStatusEnum.RESOLVED ? 'secondary' : 'primary'}
                    size="md"
                    className="rounded-full px-4 py-2 font-semibold shadow-sm"
                    onClick={onSetInProgress}
                >
                    {issueStatus === IssueStatusEnum.RESOLVED ? 'Unresolve (Set In Progress)' : 'Start Working'}
                </Button>
            )}
        </div>
    );
};
