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
                const filteredIssues = issuesData.filter((issue) => issue.isPublic);
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
    
    // Count open issues
    const openIssuesCount = issues.filter((issue) => issue.status === 'open').length;
    
    return (
        <div>
            <PageHeader 
                title={park.name}
                subtitle={`${park.county} County`}
                action={
                    <div className="flex space-x-3">
                        <Link to={`/parks/${park.parkId}/edit`}>
                            <Button variant="secondary">Edit Park</Button>
                        </Link>
                        <Link to={`/parks/${park.parkId}/trails/create`}>
                            <Button variant="primary">Add Trail</Button>
                        </Link>
                    </div>
                }
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Park Information</h3>
                        {park.isActive ? (
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
                        <div>
                            <p className="text-sm font-medium text-gray-500">Owner ID</p>
                            <p className="mt-1 text-base text-gray-900">{park.ownerId}</p>
                        </div>
                    </div>
                </Card>
                
                <Card>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Trails</p>
                            <p className="mt-1 text-2xl font-semibold text-blue-600">{trails.length}</p>
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
                    <Link to={`/parks/${park.parkId}/trails/create`} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                        Add Trail
                    </Link>
                </div>
                
                {trails.length === 0 ? (
                    <EmptyState
                        title="No trails found"
                        description="This park doesn't have any trails yet."
                        action={
                            <Link to={`/parks/${park.parkId}/trails/create`}>
                                <Button variant="primary">Add First Trail</Button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trails.map((trail) => (
                            <TrailCard key={trail.trailId} trail={trail} parkId={park.parkId} />
                        ))}
                    </div>
                )}
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Issues</h2>
                    <Link to={`/issues/report?parkId=${park.parkId}`} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
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
                        <Link to={`/issues?parkId=${park.parkId}`}>
                            <Button variant="secondary">View All Issues</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
