// src/components/issues/IssueCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Issue, Park, Trail } from '../../types';
import { getUrgencyLevelIndex } from '../../utils/issueUrgencyUtils';
import { Card } from '../ui/Card';
import { IssueStatusBadge } from './IssueStatusBadge';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface IssueCardProps {
    issue: Issue;
    park?: Park;
    trail?: Trail;
    showLocation?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({
    issue,
    park,
    trail,
    showLocation = true
}) => {
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
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <Link to={`/issues/${issue.issueId}`} className="block hover:no-underline group">
            <Card className="h-full transition-all duration-300 group-hover:shadow-lg border border-gray-100 group-hover:border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {formatIssueType(issue.issueType)}
                            </h3>
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
                            {park?.name || 'Unknown Park'}{trail ? ` / ${trail.name}` : ''}
                        </p>
                    </div>
                )}

                <p className="text-gray-700 mb-4 line-clamp-2">
                    {issue.description}
                </p>

                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-500 mr-2">Urgency:</span>
                        <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => {
                                const currentLevel = getUrgencyLevelIndex(issue.urgency);
                                return (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i <= currentLevel ? 'text-red-500' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M10.865 2.23a1 1 0 00-1.73 0L1.322 16.23A1 1 0 002.152 18h15.696a1 1 0 00.83-1.77L10.865 2.23zM10 14a1 1 0 110 2 1 1 0 010-2zm-.75-7.5a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0V6.5z" />
                                    </svg>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-sm text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                        View details &rarr;
                    </div>
                </div>
            </Card>
        </Link>
    );
};
