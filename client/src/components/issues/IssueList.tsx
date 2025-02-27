// src/components/issues/IssueList.tsx
import React from 'react';
import { Issue, Park, Trail } from '../../types';
import { IssueCard } from './IssueCard';
import { EmptyState } from '../layout/EmptyState';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

interface IssueListProps {
    issues: Issue[];
    parks?: Record<number, Park>;
    trails?: Record<number, Trail>;
    showLocation?: boolean;
    emptyStateMessage?: string;
}

export const IssueList: React.FC<IssueListProps> = ({
    issues,
    parks = {},
    trails = {},
    showLocation = true,
    emptyStateMessage = 'No issues found'
}) => {
    if (issues.length === 0) {
        return (
            <EmptyState
                title={emptyStateMessage}
                description="Issues will appear here once they are reported."
                action={
                    <Link to="/issues/report">
                        <Button variant="primary">Report an Issue</Button>
                    </Link>
                }
                icon={
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                }
            />
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map(issue => (
                <IssueCard
                    key={issue.issue_id}
                    issue={issue}
                    park={parks[issue.park_id]}
                    trail={trails[issue.trail_id]}
                    showLocation={showLocation}
                />
            ))}
        </div>
    );
};
