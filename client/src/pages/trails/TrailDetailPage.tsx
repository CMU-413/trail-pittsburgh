// src/pages/trails/TrailDetailPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Link, useParams, useNavigate 
} from 'react-router-dom';
import {
    Trail, Park, Issue 
} from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { IssueList } from '../../components/issues/IssueList';
import {
    parkApi, trailApi, issueApi
} from '../../services/api';

export const TrailDetailPage: React.FC = () => {
    const { parkId, trailId } = useParams<{ parkId: string; trailId: string }>();
    const navigate = useNavigate();
    
    const [trail, setTrail] = useState<Trail | null>(null);
    const [park, setPark] = useState<Park | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchTrailData = async () => {
            if (!parkId || !trailId) {
                setError('Invalid park or trail ID');
                setIsLoading(false);
                return;
            }
            
            try {
                const parkIdNum = parseInt(parkId, 10);
                const trailIdNum = parseInt(trailId, 10);
                
                // Fetch park details
                const parkData = await parkApi.getPark(parkIdNum);
                
                if (!parkData) {
                    setError('Park not found');
                    setIsLoading(false);
                    return;
                }
                
                setPark(parkData);
                
                // Fetch trail details
                const trailData = await trailApi.getTrail(trailIdNum);
                
                if (!trailData || trailData.parkId !== parkIdNum) {
                    setError('Trail not found in this park');
                    setIsLoading(false);
                    return;
                }
                
                setTrail(trailData);
                
                // Fetch issues for this trail
                const issuesData = await issueApi.getIssuesByTrail(trailIdNum);
                // Filter to only show public issues
                const filteredIssues = issuesData.filter((issue) => issue.isPublic);
                setIssues(filteredIssues);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching trail details:', err);
                setError('Failed to load trail details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchTrailData();
    }, [parkId, trailId]);
    
    const handleToggleTrailStatus = async () => {
        if (!trail) {return;}
        
        try {
            const updatedTrail = await trailApi.updateTrail({
                ...trail,
                isOpen: !trail.isOpen,
            });
            
            setTrail(updatedTrail);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error updating trail status:', err);
        }
    };
    
    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    if (error || !trail || !park) {
        return (
            <div>
                <PageHeader title="Trail Details" />
                <EmptyState
                    title={error || 'Trail not found'}
                    description="The trail you're looking for doesn't exist or couldn't be loaded."
                    action={
                        <Button variant="primary" onClick={() => navigate(`/parks/${parkId}`)}>
                            Back to Park
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
                title={trail.name}
                subtitle={`${park.name}, ${park.county} County`}
                action={
                    <div className="flex space-x-3">
                        <Button 
                            variant={trail.isOpen ? 'warning' : 'success'}
                            onClick={handleToggleTrailStatus}
                        >
                            {trail.isOpen ? 'Mark as Closed' : 'Mark as Open'}
                        </Button>
                        <Link to={`/parks/${park.parkId}/trails/${trail.trailId}/edit`}>
                            <Button variant="secondary">Edit Trail</Button>
                        </Link>
                        <Link to={`/issues/report?parkId=${park.parkId}&trailId=${trail.trailId}`}>
                            <Button variant="primary">Report Issue</Button>
                        </Link>
                    </div>
                }
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Trail Information</h3>
                        <div className="flex space-x-2">
                            {trail.isActive ? (
                                <Badge variant="success">Active</Badge>
                            ) : (
                                <Badge variant="secondary">Inactive</Badge>
                            )}
                            {trail.isOpen ? (
                                <Badge variant="info">Open</Badge>
                            ) : (
                                <Badge variant="warning">Closed</Badge>
                            )}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Park</p>
                            <Link to={`/parks/${park.parkId}`} className="mt-1 text-base text-blue-600 hover:text-blue-500">
                                {park.name}
                            </Link>
                        </div>
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
                            <p className="text-sm font-medium text-gray-500">Open Issues</p>
                            <p className="mt-1 text-2xl font-semibold text-yellow-600">{openIssuesCount}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Issues</p>
                            <p className="mt-1 text-2xl font-semibold text-blue-600">{issues.length}</p>
                        </div>
                    </div>
                </Card>
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Trail Issues</h2>
                    <Link to={`/issues/report?parkId=${park.parkId}&trailId=${trail.trailId}`} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                        Report Issue
                    </Link>
                </div>
                
                <IssueList 
                    issues={issues} 
                    showLocation={false}
                    emptyStateMessage="No issues found for this trail"
                />
            </div>
        </div>
    );
};
