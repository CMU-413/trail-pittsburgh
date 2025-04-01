// src/pages/issues/IssueDetailPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Link, useParams, useNavigate 
} from 'react-router-dom';
import {
    Issue, Park, Trail, User, IssueResolutionUpdate 
} from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { IssueStatusBadge } from '../../components/issues/IssueStatusBadge';
import { IssueResolutionForm } from '../../components/issues/IssueResolutionForm';
import { mockApi } from '../../services/mockData';
import { format } from 'date-fns';
import Location from '../../components/ui/Location';
import { IssueTimer } from '../../components/issues/IssueTimer';
import { ImageMetadataDisplay } from '../../components/ui/ImageMetadataDisplay';
import { 
    parkApi, trailApi, issueApi
} from '../../services/api';

export const IssueDetailPage: React.FC = () => {
    const { issueId } = useParams<{ issueId: string }>();
    const navigate = useNavigate();

    const [issue, setIssue] = useState<Issue | null>(null);
    const [park, setPark] = useState<Park | null>(null);
    const [trail, setTrail] = useState<Trail | null>(null);
    const [resolution, setResolution] = useState<IssueResolutionUpdate | null>(null);
    const [resolvedBy, setResolvedBy] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock current user - in a real app, this would come from auth context
    const currentUser = {
        user_id: 1,
        name: 'John Smith',
        role: 'steward'
    };

    const formatDate = (dateString: string, formatStr: string = 'PPP p') => {
        try {
            if (!dateString) {
                return 'unknown time'
            };
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'unknown time';
            
            return format(date, formatStr);
        } catch (err) {
            console.error('Error formatting date:', err, dateString);
            return 'unknown time';
        }
    };

    useEffect(() => {
        const fetchIssueData = async () => {
            if (!issueId) {
                setError('Invalid issue ID');
                setIsLoading(false);
                return;
            }

            try {
                const id = parseInt(issueId, 10);

                // Fetch issue details
                const issueData = await issueApi.getIssue(id);

                if (!issueData) {
                    setError('Issue not found');
                    setIsLoading(false);
                    return;
                }

                setIssue(issueData);

                // Fetch related park
                const parkData = await parkApi.getPark(issueData.park_id);
                setPark(parkData || null);

                // Fetch related trail
                const trailData = await trailApi.getTrail(issueData.trail_id);
                setTrail(trailData || null);

                // Fetch resolution info if resolved
                // we still need to use mock API since this endpoint hasn't been 
                // implemented in the real API yet
                if (issueData.status === 'resolved') {
                    const resolutions = await mockApi.getResolutionUpdatesByIssue(id);
                    if (resolutions.length > 0) {
                        const latestResolution = resolutions[resolutions.length - 1];
                        setResolution(latestResolution);

                        // Fetch user who resolved the issue
                        const user = await mockApi.getUser(latestResolution.resolved_by);
                        setResolvedBy(user || null);
                    }
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching issue details:', err);
                setError('Failed to load issue details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssueData();
    }, [issueId]);

    const handleResolveIssue = async (issueId: number, image?: string, notes?: string,) => {
        try {
            const { issue: updatedIssue, resolution: newResolution } = await mockApi.resolveIssue(
                issueId,
                currentUser.user_id,
                image,
                notes
            );

            setIssue(updatedIssue);
            setResolution(newResolution);

            const user = await mockApi.getUser(currentUser.user_id);
            setResolvedBy(user || null);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error resolving issue:', err);
            throw err;
        }
    };

    const canResolveIssue = currentUser.role === 'steward' || currentUser.role === 'owner';

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error || !issue) {
        return (
            <div>
                <PageHeader title="Issue Details" />
                <EmptyState
                    title={error || 'Issue not found'}
                    description="The issue you're looking for doesn't exist or couldn't be loaded."
                    action={
                        <Button variant="primary" onClick={() => navigate('/issues')}>
                            Back to Issues
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={`${issue.issue_type.charAt(0).toUpperCase() + issue.issue_type.slice(1)} Issue`}
                subtitle={park && trail ? `${park.name} • ${trail.name}` : 'Loading location...'}
                action={
                    issue.status !== 'resolved' && canResolveIssue ? (
                        <Button
                            variant="success"
                            onClick={() => document.getElementById('resolution-form')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Resolve Issue
                        </Button>
                    ) : null
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2 overflow-hidden">
                    <div className="flex justify-between mb-6">
                        <div className="flex items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {issue.issue_type.charAt(0).toUpperCase() + issue.issue_type.slice(1)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Reported {formatDate(issue.created_at)}
                                </p>
                            </div>
                        </div>
                        <IssueStatusBadge status={issue.status} />
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                        <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
                    </div>

                    {issue.issue_image && (
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Issue Image</h4>
                            <div className="rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={issue.issue_image}
                                    alt="Issue"
                                    className="w-full h-auto max-h-96 object-contain"
                                />
                            </div>

                            {/* Only render the metadata component if there's metadata available */}
                            {issue.imageMetadata && (
                                <ImageMetadataDisplay
                                    metadata={issue.imageMetadata}
                                    className="mt-3"
                                />
                            )}
                        </div>
                    )}

                    {issue.lon && issue.lat && (
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>

                            {/* Location component can be kept or removed based on preference */}
                            <div className="mt-4">
                                <Location
                                    initialLat={issue.lat}
                                    initialLon={issue.lon}
                                    readOnly={true}
                                    variant="plain"
                                />
                            </div>

                            {/* Location actions - Added mt-4 for padding above buttons */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {/* Coordinates button */}
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${issue.lat}, ${issue.lon}`);
                                    }}
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copy Coordinates
                                </Button>

                                {/* Open in Google Maps */}
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${issue.lat},${issue.lon}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                    )}

                    {resolution && (
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <div className="flex justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Resolution</h4>
                                <span className="text-sm text-gray-500">
                                    {formatDate(resolution.resolved_at)}
                                </span>
                            </div>

                            {resolvedBy && (
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 mr-3">
                                        {resolvedBy.picture ? (
                                            <img
                                                src={resolvedBy.picture}
                                                alt={resolvedBy.name}
                                                className="h-8 w-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">
                                                {resolvedBy.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Resolved by {resolvedBy.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {resolvedBy.role && resolvedBy.role.charAt(0).toUpperCase() + resolvedBy.role.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {resolution.resolve_image && (
                                <div className="mb-4">
                                    <h5 className="text-sm font-medium text-gray-500 mb-2">Resolution Image</h5>
                                    <div className="rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={resolution.resolve_image}
                                            alt="Resolution"
                                            className="w-full h-auto max-h-96 object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Urgency</p>
                                <div className="flex items-center mt-1">
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < issue.urgency ? 'text-red-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M10.865 2.23a1 1 0 00-1.73 0L1.322 16.23A1 1 0 002.152 18h15.696a1 1 0 00.83-1.77L10.865 2.23zM10 14a1 1 0 110 2 1 1 0 010-2zm-.75-7.5a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0V6.5z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">
                                        {issue.urgency} of 5
                                    </span>
                                </div>
                            </div>

                            <IssueTimer issue={issue} />

                            <div>
                                <p className="text-sm font-medium text-gray-500">Location</p>
                                <div className="mt-1">
                                    {park && (
                                        <Link
                                            to={`/parks/${park.park_id}`}
                                            className="text-blue-600 hover:text-blue-500 block"
                                        >
                                            {park.name}
                                        </Link>
                                    )}

                                    {trail && (
                                        <Link
                                            to={`/parks/${park?.park_id}/trails/${trail.trail_id}`}
                                            className="text-blue-600 hover:text-blue-500 block mt-1"
                                        >
                                            {trail.name}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Visibility</p>
                                <div className="flex items-center mt-1">
                                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d={issue.is_public
                                                ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                                : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'}
                                        />
                                    </svg>
                                    <p className="text-sm">
                                        {issue.is_public ? 'Public' : 'Private'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Notification</p>
                                <div className="flex items-center mt-1">
                                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d={issue.notify_reporter
                                                ? 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                                                : 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'}
                                        />
                                    </svg>
                                    <p className="text-sm">
                                        {issue.notify_reporter ? 'Reporter will be notified when resolved' : 'No notification requested'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {issue.status !== 'resolved' && canResolveIssue && (
                        <IssueResolutionForm
                            issue={issue}
                            onResolve={handleResolveIssue}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
