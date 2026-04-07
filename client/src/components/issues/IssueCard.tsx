// src/components/issues/IssueCard.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Issue, Park } from '../../types';
import { Card } from '../ui/Card';
import { IssueStatusBadge } from './IssueStatusBadge';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface IssueCardProps {
    issue: Issue;
    park?: Park;
    showLocation?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({
    issue,
    park,
    showLocation = true
}) => {
    const groupedCount = issue.issueGroupMemberIds?.length ?? 0;
    const location = useLocation();

    // Format date for better display
    const getFormattedDate = () => {
        try {
            if (!issue.createdAt) {
                return 'unknown time';
            }
            const reportedDate = new Date(issue.createdAt);
            if (isNaN(reportedDate.getTime())) {
                return 'unknown time';
            }
            return formatDistanceToNow(reportedDate, { addSuffix: true });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error formatting date:', error, issue.createdAt);
            return 'unknown time';
        }
    };

    const formatIssueType = (type: string): string => {
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    };

    return (
        <Link 
            to={`/issues/card/${issue.issueId}`} 
            state={{ 
                backgroundLocation: {
                    pathname: location.pathname,
                    search: location.search,
                    hash: location.hash
                } 
            }}
            className="block hover:no-underline group">
            <Card className="h-full transition-all duration-300 group-hover:shadow-lg border border-gray-100 group-hover:border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {formatIssueType(issue.issueType)} 
                                    <span className="text-sm text-gray-500 font-normal ml-1">
                                        #{issue.issueId}
                                    </span>
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500">Reported {getFormattedDate()}</p>
                        </div>
                    </div>
                    <IssueStatusBadge status={issue.status} />
                </div>

                {showLocation && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {park?.name || 'Unknown Park'}
                        </p>
                    </div>
                )}

                <p className="text-gray-700 mb-4 line-clamp-2">
                    {issue.description}
                </p>

                {groupedCount > 1 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {groupedCount > 1 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                Grouped ({groupedCount})
                            </span>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="text-sm text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                        View details &rarr;
                    </div>
                </div>
            </Card>
        </Link>
    );
};
