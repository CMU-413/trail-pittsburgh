// src/pages/issues/IssueDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Issue, Park, Trail, User, IssueResolutionUpdate } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { IssueStatusBadge, getIssueStatusBgColor } from '../../components/issues/IssueStatusBadge';
import { IssueResolutionForm } from '../../components/issues/IssueResolutionForm';
import { mockApi } from '../../services/mockData';
import { format } from 'date-fns';

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
                const issueData = await mockApi.getIssue(id);

                if (!issueData) {
                    setError('Issue not found');
                    setIsLoading(false);
                    return;
                }

                setIssue(issueData);

                // Fetch related park
                const parkData = await mockApi.getPark(issueData.park_id);
                setPark(parkData || null);

                // Fetch related trail
                const trailData = await mockApi.getTrail(issueData.trail_id);
                setTrail(trailData || null);

                // Fetch resolution info if resolved
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
                console.error('Error fetching issue details:', err);
                setError('Failed to load issue details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssueData();
    }, [issueId]);

    const handleResolveIssue = async (issueId: number, notes: string, image?: string) => {
        try {
            const { issue: updatedIssue, resolution: newResolution } = await mockApi.resolveIssue(
                issueId,
                currentUser.user_id,
                image
            );

            setIssue(updatedIssue);
            setResolution(newResolution);

            const user = await mockApi.getUser(currentUser.user_id);
            setResolvedBy(user || null);
        } catch (err) {
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
                            <div className={`${getIssueStatusBgColor(issue.status)} rounded-lg p-3 mr-4`}>
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {issue.issue_type.charAt(0).toUpperCase() + issue.issue_type.slice(1)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Reported {format(new Date(issue.reported_at), 'PPP p')}
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
                                    className="w-full h-auto max-h-96 object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {issue.lon && issue.lat && (
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                            <p className="text-gray-700">
                                Coordinates: {issue.lat.toFixed(6)}, {issue.lon.toFixed(6)}
                            </p>
                            {/* In a real app, you might display a map here */}
                            <div className="mt-2 h-48 rounded-lg bg-gray-100 flex items-center justify-center">
                                <p className="text-gray-500">Map would be displayed here</p>
                            </div>
                        </div>
                    )}

                    {resolution && (
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <div className="flex justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Resolution</h4>
                                <span className="text-sm text-gray-500">
                                    {format(new Date(resolution.resolved_at), 'PPP p')}
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
                                                className={`w-5 h-5 ${i < issue.urgency ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">
                                        {issue.urgency} of 5
                                    </span>
                                </div>
                            </div>

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
                                                ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"}
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
                                                ? "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"}
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
