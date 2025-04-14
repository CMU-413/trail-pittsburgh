// src/pages/parks/ParkDetailPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Link, useParams, useNavigate
} from 'react-router-dom';
import {
    Park, Trail, Issue
} from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { TrailCard } from '../../components/trails/TrailCard';
import { IssueList } from '../../components/issues/IssueList';
import {
    parkApi, trailApi, issueApi
} from '../../services/api';

export const ParkDetailPage: React.FC = () => {
    const { parkId } = useParams<{ parkId: string }>();
    const navigate = useNavigate();
    
    const [park, setPark] = useState<Park | null>(null);
    const [trails, setTrails] = useState<Trail[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showInactiveTrails, setShowInactiveTrails] = useState(false);

    useEffect(() => {
        const fetchParkData = async () => {
            if (!parkId) {
                setError('Invalid park ID');
                setIsLoading(false);
                return;
            }
            
            try {
                const id = parseInt(parkId, 10);
                
                // Fetch park details
                const parkData = await parkApi.getPark(id);
                
                if (!parkData) {
                    setError('Park not found');
                    setIsLoading(false);
                    return;
                }
                
                setPark(parkData);
                
                // Fetch trails for this park
                try {
                    const trailsData = await trailApi.getTrailsByPark(id);
                    setTrails(trailsData);
                } catch (trailErr) {
                    // eslint-disable-next-line no-console
                    console.error('Error fetching trails:', trailErr);
                }
                
                // Fetch issues for this park
                const issuesData = await issueApi.getIssuesByPark(id);
                // Filter to only show public issues or open issues
                const filteredIssues = issuesData.filter((issue) => issue.is_public);
                setIssues(filteredIssues);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching park details:', err);
                setError('Failed to load park details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchParkData();
    }, [parkId]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error || !park) {
        return (
            <div>
                <PageHeader title="Park Details" />
                <EmptyState
                    title={error || 'Park not found'}
                    description="The park you're looking for doesn't exist or couldn't be loaded."
                    action={
                        <Button variant="primary" onClick={() => navigate('/parks')}>
                            Back to Parks
                        </Button>
                    }
                />
            </div>
        );
    }

    // Filter active and inactive trails
    const activeTrails = trails.filter((trail) => trail.is_active);
    const inactiveTrails = trails.filter((trail) => !trail.is_active);

    // Determine which trails to display
    const displayTrails = showInactiveTrails ? trails : activeTrails;

    // Sort trails: active trails first (sorted by name), then inactive trails (sorted by name)
    const sortedTrails = [...displayTrails].sort((a, b) => {
        // Active trails first
        if (a.is_active && !b.is_active) {return -1;}
        if (!a.is_active && b.is_active) {return 1;}

        // Then sort by name
        return a.name.localeCompare(b.name);
    });

    // Count open issues
    const openIssuesCount = issues.filter((issue) => issue.status === 'open').length;

    return (
        <div>
            <PageHeader
                title={park.name}
                subtitle={`${park.county} County`}
                action={
                    <div className="flex space-x-3">
                        <Link to={`/parks/${park.park_id}/edit`}>
                            <Button variant="secondary">Edit Park</Button>
                        </Link>
                        <Link to={`/parks/${park.park_id}/trails/create`}>
                            <Button variant="primary">Add Trail</Button>
                        </Link>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Park Information</h3>
                        {park.is_active ? (
                            <Badge variant="success">Active</Badge>
                        ) : (
                            <Badge variant="secondary">Inactive</Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500">County</p>
                            <p className="mt-1 text-base text-gray-900">{park.county}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Trails</p>
                            <div className="flex items-end">
                                <p className="text-2xl font-semibold text-blue-600">{activeTrails.length}</p>
                                {inactiveTrails.length > 0 && (
                                    <p className="text-xs text-gray-500 ml-2 mb-1">
                                        (+{inactiveTrails.length} inactive)
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Open Issues</p>
                            <p className="mt-1 text-2xl font-semibold text-yellow-600">{openIssuesCount}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Trails</h2>
                    <div className="flex items-center space-x-4">
                        {inactiveTrails.length > 0 && (
                            <span
                                onClick={() => setShowInactiveTrails(!showInactiveTrails)}
                                className="text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
                            >
                                {showInactiveTrails ? 'Hide Inactive' : 'Show Inactive'}
                            </span>
                        )}
                        <Link to={`/parks/${park.park_id}/trails/create`} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                            Add Trail
                        </Link>
                    </div>
                </div>

                {inactiveTrails.length > 0 && showInactiveTrails && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-100 rounded-md p-3 flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-yellow-700">
                            Showing all trails, including {inactiveTrails.length} inactive {inactiveTrails.length === 1 ? 'trail' : 'trails'}
                        </p>
                    </div>
                )}

                {sortedTrails.length === 0 ? (
                    <EmptyState
                        title="No trails found"
                        description="This park doesn't have any trails yet."
                        action={
                            <Link to={`/parks/${park.park_id}/trails/create`}>
                                <Button variant="primary">Add First Trail</Button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedTrails.map((trail) => (
                            <TrailCard key={trail.trail_id} trail={trail} parkId={park.park_id} />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Issues</h2>
                    <Link to={`/issues/report?parkId=${park.park_id}`} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                        Report Issue
                    </Link>
                </div>

                <IssueList
                    issues={issues.slice(0, 6)}
                    showLocation={false}
                    emptyStateMessage="No issues found for this park"
                />
                
                {issues.length > 6 && (
                    <div className="mt-6 text-center">
                        <Link to={`/issues?parkId=${park.park_id}`}>
                            <Button variant="secondary">View All Issues</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
