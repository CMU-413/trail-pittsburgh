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
    const openIssuesCount = isError ? 0 : allIssues.filter((issue) => issue.status === IssueStatusEnum.OPEN).length;
    const inprocessIssuesCount = isError ? 0 : allIssues.filter((issue) => issue.status === IssueStatusEnum.IN_PROGRESS).length;
    const resolvedIssuesCount = isError ? 0 : allIssues.filter((issue) => issue.status === IssueStatusEnum.RESOLVED).length;

    return (
        <Link to={`/parks/${park.parkId}`} className="block hover:no-underline">
            <Card 
                className="h-full transition-shadow hover:shadow-lg"
                footer={!isError && (

                    <div className="flex justify-between text-sm">
                        <span className="text-red-600 font-medium">
                            Open: {openIssuesCount}
                        </span>
                        <span className="text-yellow-600 font-medium">
                            In Progress: {inprocessIssuesCount}
                        </span>
                        <span className="text-green-600 font-medium">
                            Resolved: {resolvedIssuesCount}
                        </span>
                    </div>
                )}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{park.name}</h3>
                    {park.isActive ? (
                        <Badge variant="success">Active</Badge>
                    ) : (
                        <Badge variant="secondary">Inactive</Badge>
                    )}
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    <span className="font-medium">County:</span> {park.county}
                </p>
                <div className="text-sm text-blue-600 font-medium">
                    View details &rarr;
                </div>
            </Card>
        </Link>
    );
};
