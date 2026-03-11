// src/pages/parks/ParkListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Issue, Park } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { ParkCard } from '../../components/parks/ParkCard';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { parkApi, issueApi } from '../../services/api';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { getIssueStatusDotColor } from '../../utils/issueStatusUtils';

export const ParkListPage: React.FC = () => {
    const [parks, setParks] = useState<Park[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showInactive, setShowInactive] = useState(false);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [recentIssuesOpen, setRecentIssuesOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch issues
                const issuesData = await issueApi.getAllIssues();
                const filteredIssues = issuesData.filter((issue) => issue.isPublic);
                setIssues(filteredIssues);

                // Fetch parks and trails for display
                const parksData = await parkApi.getParks();
                setParks(parksData);

            } catch (err) {
                // eslint-disable-next-line no-console
                setError('Failed to load parks. Please try again later.');
                console.error('Error fetching dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div>
                <PageHeader title="Dashboard" />
                <EmptyState
                    title="Error loading parks"
                    description={error}
                    action={
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    }
                />
            </div>
        );
    }

    // Filter active and inactive parks
    const activeParks = parks.filter((park) => park.isActive);
    const inactiveParks = parks.filter((park) => !park.isActive);

    // Determine which parks to display
    const displayParks = showInactive ? parks : activeParks;

    // Sort parks: active parks first (sorted by name), then inactive parks (sorted by name)
    const sortedParks = [...displayParks].sort((a, b) => {
        // Active parks first
        if (a.isActive && !b.isActive) {return -1;}
        if (!a.isActive && b.isActive) {return 1;}

        // Then sort by name
        return a.name.localeCompare(b.name);
    });

    if (sortedParks.length === 0) {
        return (
            <div>
                <PageHeader
                    title="Dashboard"
                    action={
                        <Link to="/parks/create">
                            <Button variant="primary">Add Park</Button>
                        </Link>
                    }
                />
                <EmptyState
                    title={showInactive ? 'No inactive parks found' : 'No parks found'}
                    description={showInactive
                        ? 'There are no inactive parks in the system.'
                        : 'Get started by creating your first park.'}
                    action={
                        <Link to="/parks/create">
                            <Button variant="primary">Add Park</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    // Get the most recent issues
    const recentIssues = [...issues].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);

    return (
        <div>
            <PageHeader
                title="Dashboard"
                subtitle={`Showing ${sortedParks.length} ${showInactive ? '' : 'active'} parks`}
                action={
                    <div className="flex items-center space-x-3">
                        {inactiveParks.length > 0 && (
                            <Button
                                variant="secondary"
                                onClick={() => setShowInactive(!showInactive)}
                            >
                                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
                            </Button>
                        )}
                        <Link to="/parks/create">
                            <Button variant="primary">Add Park</Button>
                        </Link>
                    </div>
                }
            />
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card 
                            title="Recent Issues"
                            headerAction={
                                <button
                                    onClick={() => setRecentIssuesOpen(!recentIssuesOpen)}
                                    className="text-gray-400 hover:text-gray-600 text-4xl"
                                >
                                    {recentIssuesOpen ? '▾' : '▸'}
                                </button>
                            }
                        >
                            {recentIssuesOpen && (
                                <div className="divide-y divide-gray-200">
                                    {recentIssues.map((issue) => (
                                        <div key={issue.issueId} className="flex items-start py-4 first:pt-0 last:pb-0">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <Link to={`/issues/${issue.issueId}`} className="font-medium text-blue-600 hover:text-blue-500 truncate">
                                                        {issue.issueType.charAt(0).toUpperCase() + issue.issueType.slice(1)}
                                                    </Link>
                                                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                                                        {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getIssueStatusDotColor(issue.status)}`}></span>
                                                    {parks[issue.parkId]?.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>

                {inactiveParks.length > 0 && showInactive && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-100 rounded-md p-3 flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-yellow-700">
                            Showing all parks, including {inactiveParks.length} inactive {inactiveParks.length === 1 ? 'park' : 'parks'}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedParks.map((park) => {
                        const parkIssues = issues.filter((issue) => issue.parkId === park.parkId);
                        
                        return (
                            <ParkCard 
                                key={park.parkId} 
                                park={park} 
                                allIssues={parkIssues} 
                            />
                        );})
                    }
                </div>
            </div>
        </div>
    );
};
