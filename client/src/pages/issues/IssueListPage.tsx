// src/pages/issues/IssueListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Issue, Park, Trail, IssueStatus } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { IssueList } from '../../components/issues/IssueList';
import { mockApi } from '../../services/mockData';

export const IssueListPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialParkId = queryParams.get('parkId') ? parseInt(queryParams.get('parkId')!, 10) : undefined;
    const initialTrailId = queryParams.get('trailId') ? parseInt(queryParams.get('trailId')!, 10) : undefined;
    const initialStatus = queryParams.get('status') as IssueStatus | undefined || undefined;

    const [issues, setIssues] = useState<Issue[]>([]);
    const [parks, setParks] = useState<Record<number, Park>>({});
    const [trails, setTrails] = useState<Record<number, Trail>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedParkId, setSelectedParkId] = useState<number | undefined>(initialParkId);
    const [selectedTrailId, setSelectedTrailId] = useState<number | undefined>(initialTrailId);
    const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'all'>(initialStatus || 'all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch parks for lookup and filtering
                const parksData = await mockApi.getParks();
                const parksMap: Record<number, Park> = {};
                parksData.forEach(park => {
                    parksMap[park.park_id] = park;
                });
                setParks(parksMap);

                // Fetch trails for lookup and filtering
                const trailsData = await mockApi.getTrails();
                const trailsMap: Record<number, Trail> = {};
                trailsData.forEach(trail => {
                    trailsMap[trail.trail_id] = trail;
                });
                setTrails(trailsMap);

                // Fetch issues based on filters
                let issuesData: Issue[] = [];

                if (selectedTrailId) {
                    // If trail is selected, fetch issues for that trail
                    issuesData = await mockApi.getIssuesByTrail(selectedTrailId);
                } else if (selectedParkId) {
                    // If only park is selected, fetch issues for that park
                    issuesData = await mockApi.getIssuesByPark(selectedParkId);
                } else {
                    // No filters, get all issues
                    issuesData = await mockApi.getIssues();
                }

                // Filter by public status (for non-admins)
                issuesData = issuesData.filter(issue => issue.is_public);

                // Apply status filter if selected
                if (selectedStatus !== 'all') {
                    issuesData = issuesData.filter(issue => issue.status === selectedStatus);
                }

                setIssues(issuesData);
            } catch (err) {
                console.error('Error fetching issues:', err);
                setError('Failed to load issues. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedParkId, selectedTrailId, selectedStatus]);

    // Handle filter changes
    const handleParkChange = (value: string) => {
        const parkId = value ? parseInt(value, 10) : undefined;
        setSelectedParkId(parkId);
        setSelectedTrailId(undefined); // Reset trail selection when park changes
    };

    const handleTrailChange = (value: string) => {
        const trailId = value ? parseInt(value, 10) : undefined;
        setSelectedTrailId(trailId);
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value as IssueStatus | 'all');
    };

    // Filter trails based on selected park
    const filteredTrails = Object.values(trails).filter(
        trail => !selectedParkId || trail.park_id === selectedParkId
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <PageHeader
                title="Trail Issues"
                subtitle="View and manage reported trail issues"
                action={
                    <Link to="/issues/report">
                        <Button variant="primary">Report Issue</Button>
                    </Link>
                }
            />

            <Card className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Issues</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        label="Park"
                        options={[
                            { value: '', label: 'All Parks' },
                            ...Object.values(parks)
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(park => ({ value: park.park_id.toString(), label: park.name }))
                        ]}
                        value={selectedParkId?.toString() || ''}
                        onChange={handleParkChange}
                    />

                    <Select
                        label="Trail"
                        options={[
                            { value: '', label: selectedParkId ? 'All Trails in Selected Park' : 'All Trails' },
                            ...filteredTrails
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(trail => ({ value: trail.trail_id.toString(), label: trail.name }))
                        ]}
                        value={selectedTrailId?.toString() || ''}
                        onChange={handleTrailChange}
                        disabled={filteredTrails.length === 0}
                    />

                    <Select
                        label="Status"
                        options={[
                            { value: 'all', label: 'All Statuses' },
                            { value: 'open', label: 'Open' },
                            { value: 'in_progress', label: 'In Progress' },
                            { value: 'resolved', label: 'Resolved' }
                        ]}
                        value={selectedStatus}
                        onChange={handleStatusChange}
                    />
                </div>
            </Card>

            {error ? (
                <EmptyState
                    title="Error loading issues"
                    description={error}
                    action={
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    }
                />
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {issues.length} {issues.length === 1 ? 'Issue' : 'Issues'} Found
                        </h2>
                    </div>

                    <IssueList
                        issues={issues}
                        parks={parks}
                        trails={trails}
                        emptyStateMessage="No issues match the selected filters"
                    />
                </div>
            )}
        </div>
    );
};
