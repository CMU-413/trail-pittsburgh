// src/components/parks/ParkCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Issue, IssueStatusEnum, Park
} from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ParkCardProps {
    park: Park;
    allIssues?: Issue[];
}

export const ParkCard: React.FC<ParkCardProps> = ({ park, allIssues }) => {
    const isError = !allIssues;
    
    // Default counts to 0 if there's an error/no issues
    const unresolvedIssuesCount = isError ? 0 : allIssues.filter((issue) => issue.status === IssueStatusEnum.UNRESOLVED).length;
    const inprocessIssuesCount = isError ? 0 : allIssues.filter((issue) => issue.status === IssueStatusEnum.IN_PROGRESS).length;
    const resolvedIssuesCount = isError ? 0 : allIssues.filter((issue) => issue.status === IssueStatusEnum.RESOLVED).length;

    return (
        <Link to={`/parks/${park.parkId}`} className="block hover:no-underline">
            <Card 
                className="h-full transition-shadow hover:shadow-lg"
                footer={!isError && (

                    <div className="flex justify-between text-sm gap-2">
                        <span className="rounded-md bg-red-100 px-2 py-1 text-red-700 font-medium">
                            Unresolved: {unresolvedIssuesCount}
                        </span>
                        <span className="rounded-md bg-yellow-100 px-2 py-1 text-yellow-800 font-medium">
                            In Progress: {inprocessIssuesCount}
                        </span>
                        <span className="rounded-md bg-green-100 px-2 py-1 text-green-800 font-medium">
                            Resolved: {resolvedIssuesCount}
                        </span>
                    </div>
                )}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{park.name}</h3>
                    <div className="flex items-center gap-2">
                        {!park.isActive && (
                            <Badge variant="secondary">Inactive</Badge>
                        )}
                        <span className="text-sm text-blue-600 font-medium">
                            View details &rarr;
                        </span>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    {park.county} County
                </p>
            </Card>
        </Link>
    );
};
