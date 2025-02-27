// src/components/issues/IssueCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Issue, Park, Trail 
} from '../../types';
import { Card } from '../ui/Card';
import { IssueStatusBadge } from './IssueStatusBadge';
import { getIssueStatusBgColor } from '../../utils/issueStatusUtils';
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
    const reportedDate = new Date(issue.reported_at);
    const formattedDate = formatDistanceToNow(reportedDate, { addSuffix: true });

    return (
        <Link to={`/issues/${issue.issue_id}`} className="block hover:no-underline group">
            <Card className="h-full transition-all duration-300 group-hover:shadow-lg border border-gray-100 group-hover:border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        {/* Issue type icon with status-based color */}
                        <div className={`w-10 h-10 rounded-lg ${getIssueStatusBgColor(issue.status)} flex items-center justify-center mr-3`}>
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {issue.issue_type.charAt(0).toUpperCase() + issue.issue_type.slice(1)}
                            </h3>
                            <p className="text-sm text-gray-500">Reported {formattedDate}</p>
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
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < issue.urgency ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
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
