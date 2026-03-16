// src/pages/issues/IssueDetailPage.tsx
import React, {
    useState, useEffect, useRef
} from 'react';
import { 
    Link, useParams, useNavigate
} from 'react-router-dom';
import { 
    Issue, Park, IssueStatusEnum
} from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { IssueStatusBadge } from '../../components/issues/IssueStatusBadge';
import { format } from 'date-fns';
import Location from '../../components/ui/Location';
import { IssueTimer } from '../../components/issues/IssueTimer';
import { ImageMetadataDisplay } from '../../components/ui/ImageMetadataDisplay';
import { 
    parkApi, issueApi
} from '../../services/api';
import { useAuth } from '../../providers/AuthProvider';
import { issueTypeFrontendToEnum } from '../../utils/issueTypeUtils';
import {
    IssueTypeEnum, UserRoleEnum
} from '../../types/index';
import { IssueDropdown } from './components/IssueDropdown';

export const IssueDetailPage: React.FC = () => {
    const { issueId } = useParams<{ issueId: string }>();
    const navigate = useNavigate();

    const [issue, setIssue] = useState<Issue | null>(null);
    const [park, setPark] = useState<Park | null>(null);
    const [parks, setParks] = useState<Park[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isResolving, setIsResolving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [editedIssueType, setEditedIssueType] = useState('');
    const [editedParkId, setEditedParkId] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedGroupIssueIds, setSelectedGroupIssueIds] = useState<string[]>([]);
    const [linkableIssues, setLinkableIssues] = useState<Issue[]>([]);
    const [isLinking, setIsLinking] = useState(false);
    const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

    const groupDropdownRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth();
    const canEditIssue = user !== null;
    const canManageIssueStatus = user?.role === UserRoleEnum.ROLE_ADMIN || user?.role === UserRoleEnum.ROLE_SUPERADMIN;
    const canResolveIssue = canManageIssueStatus;

    const formatDate = (dateString: string, formatStr: string = 'PPP p') => {
        try {
            if (!dateString) {
                return 'unknown time';
            }
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'unknown time';
            }
            
            return format(date, formatStr);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error formatting date:', err, dateString);
            return 'unknown time';
        }
    };

    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const distanceInMiles = (
        lat1: number,
        lng1: number,
        lat2: number,
        lng2: number
    ): number => {
        const earthRadiusMiles = 3958.8;
        const dLat = toRadians(lat2 - lat1);
        const dLng = toRadians(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusMiles * c;
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
                setEditedDescription(issueData.description || '');
                setEditedIssueType(issueData.issueType.toLowerCase());
                setEditedParkId(issueData.parkId);
                setSelectedGroupIssueIds(
                    (issueData.issueGroupMemberIds ?? [])
                        .filter((groupedIssueId) => groupedIssueId !== issueData.issueId)
                        .map((groupedIssueId) => String(groupedIssueId))
                );

                // Fetch related park
                const parkData = await parkApi.getPark(issueData.parkId);
                setPark(parkData || null);

                // Fetch all parks for dropdown
                const parksData = await parkApi.getParks();
                setParks(parksData.filter((p) => p.isActive));

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

    useEffect(() => {
        const fetchLinkableIssues = async () => {
            if (!issue || !canManageIssueStatus) {
                setLinkableIssues([]);
                return;
            }

            try {
                const allIssues = await issueApi.getAllIssues();
                const filteredIssues = allIssues.filter((candidate) => candidate.issueId !== issue.issueId);

                const sorted = [...filteredIssues].sort((left, right) => {
                    const leftDistance =
                        typeof issue.latitude === 'number' &&
                        typeof issue.longitude === 'number' &&
                        typeof left.latitude === 'number' &&
                        typeof left.longitude === 'number'
                            ? distanceInMiles(issue.latitude, issue.longitude, left.latitude, left.longitude)
                            : Number.POSITIVE_INFINITY;

                    const rightDistance =
                        typeof issue.latitude === 'number' &&
                        typeof issue.longitude === 'number' &&
                        typeof right.latitude === 'number' &&
                        typeof right.longitude === 'number'
                            ? distanceInMiles(issue.latitude, issue.longitude, right.latitude, right.longitude)
                            : Number.POSITIVE_INFINITY;

                    return leftDistance - rightDistance;
                });

                setLinkableIssues(sorted);
            } catch (fetchError) {
                // eslint-disable-next-line no-console
                console.error('Failed to fetch linkable issues', fetchError);
                setLinkableIssues([]);
            }
        };

        fetchLinkableIssues();
    }, [issue, canManageIssueStatus]);

    const handleResolveIssue = async () => {
        if (!issue || !issueId) {
            return;
        }

        try {
            setIsResolving(true);
            const id = parseInt(issueId, 10);

            const updatedIssue = await issueApi.updateIssueStatus(id, IssueStatusEnum.RESOLVED);
            
            if (updatedIssue) {
                setIssue(updatedIssue);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error resolving issue:', err);
        } finally {
            setIsResolving(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!issue || !issueId) {
            return;
        }
    
        try {
            setIsSaving(true);
            const id = parseInt(issueId, 10);
            
            const updateData: {
                description?: string;
                issueType?: IssueTypeEnum;
                parkId?: number;
            } = {};
            
            // Only include fields that have changed
            if (editedDescription !== issue.description) {
                updateData.description = editedDescription;
            }
            // Fix issue type comparison by converting both to the same format
            const editedIssueTypeEnum = issueTypeFrontendToEnum(editedIssueType);
            if (editedIssueTypeEnum !== issue.issueType) {
                updateData.issueType = editedIssueTypeEnum;
            }
            if (editedParkId !== issue.parkId) {
                updateData.parkId = editedParkId;
            }
    
            if (Object.keys(updateData).length > 0) {
                const updatedIssue = await issueApi.updateIssue(id, updateData);
                
                if (updatedIssue) {
                    setIssue(updatedIssue);
                    
                    // Update park data if they changed
                    if (updateData.parkId) {
                        const newPark = await parkApi.getPark(updateData.parkId);
                        setPark(newPark || null);
                    }
                    
                    setIsEditing(false);
                }
            } else {
                setIsEditing(false);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error updating issue:', err);
            alert('Failed to update issue. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSetInProgress = async () => {
        if (!issue || !issueId) {
            return;
        }

        try {
            const id = parseInt(issueId, 10);

            const updatedIssue = await issueApi.updateIssueStatus(id, IssueStatusEnum.IN_PROGRESS);

            if (updatedIssue) {
                setIssue(updatedIssue);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error setting issue to in progress:', err);
            alert('Failed to update issue status. Please try again.');
        }
    };

    const handleUpdateGroup = async () => {
        if (!issue || !issueId) {
            return;
        }

        try {
            setIsLinking(true);
            const id = parseInt(issueId, 10);
            const issueGroupMemberIds = selectedGroupIssueIds
                .map((value) => Number(value))
                .filter((value) => Number.isInteger(value) && value > 0 && value !== issue.issueId);

            const updatedIssue = await issueApi.setIssueGroup(id, issueGroupMemberIds);

            if (updatedIssue) {
                setIssue(updatedIssue);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error updating issue group:', err);
            alert('Failed to update issue group. Please try again.');
        } finally {
            setIsLinking(false);
        }
    };

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!groupDropdownRef.current) {
                return;
            }

            if (!groupDropdownRef.current.contains(e.target as Node)) {
                setIsGroupDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, []);
    
    const resetEditedFields = () => {
        setEditedDescription(issue?.description || '');
        setEditedIssueType(issue?.issueType.toLowerCase() || 'other');
        setEditedParkId(issue?.parkId || 0);
    };

    // Format issue type for display
    const formatIssueType = (type: string): string => {
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const selectedGroupLabel = selectedGroupIssueIds.length === 0
        ? 'No grouped issues'
        : `${selectedGroupIssueIds.length} selected`;

    const groupOptions = linkableIssues.map((candidateIssue) => {
        const distanceLabel =
            issue &&
            typeof issue.latitude === 'number' &&
            typeof issue.longitude === 'number' &&
            typeof candidateIssue.latitude === 'number' &&
            typeof candidateIssue.longitude === 'number'
                ? `${distanceInMiles(issue.latitude, issue.longitude, candidateIssue.latitude, candidateIssue.longitude).toFixed(1)} mi`
                : 'Distance unknown';

        const parkLabel = candidateIssue.park?.name ?? 'Unknown Park';
        const reportedDate = formatDate(candidateIssue.createdAt, 'MMM d, yyyy');

        return {
            value: String(candidateIssue.issueId),
            label: `#${candidateIssue.issueId} • ${parkLabel} • ${reportedDate} • ${distanceLabel}`,
        };
    });

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
        <div className="container max-w-6xl mx-auto px-4 py-8">
            <PageHeader
                title={`${formatIssueType(issue.issueType)}`}
                subtitle={`#${issue.issueId} • ${park ? `${park.name}` : 'Loading location...'}`}
            />

            {canManageIssueStatus && (
                <Card className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Issue Actions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Manage editing and work status for this issue.
                    </p>

                    <div className="space-y-3">
                        {canEditIssue && !isEditing && issue.status !== IssueStatusEnum.RESOLVED && (
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setIsEditing(true);
                                    resetEditedFields();
                                }}
                                className="w-full sm:w-auto"
                            >
                                Edit Issue
                            </Button>
                        )}

                        {isEditing && (
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setIsEditing(false);
                                        resetEditedFields();
                                    }}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSaveChanges}
                                    isLoading={isSaving}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}

                        {issue.status !== IssueStatusEnum.RESOLVED && canResolveIssue && !isEditing && (
                            <Button
                                variant="success"
                                onClick={handleResolveIssue}
                                isLoading={isResolving}
                                disabled={isResolving}
                                className="w-full sm:w-auto"
                            >
                                {isResolving ? 'Resolving...' : 'Resolve Issue'}
                            </Button>
                        )}

                        <p className="text-sm text-gray-600 pt-2">Work Status</p>

                        {issue.status === IssueStatusEnum.OPEN && (
                            <Button
                                variant="primary"
                                onClick={handleSetInProgress}
                                className="w-full sm:w-auto"
                            >
                                Start Working
                            </Button>
                        )}

                        {issue.status === IssueStatusEnum.RESOLVED && (
                            <Button
                                variant="secondary"
                                onClick={handleSetInProgress}
                                className="w-full sm:w-auto"
                            >
                                Unresolve (Set In Progress)
                            </Button>
                        )}

                        {issue.status === IssueStatusEnum.IN_PROGRESS && (
                            <p className="text-sm text-gray-700">This issue is already in progress.</p>
                        )}

                        <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600 mb-2">Duplicate Management</p>
                            <div className="space-y-2">
                                <IssueDropdown
                                    triggerLabel={selectedGroupLabel}
                                    isOpen={isGroupDropdownOpen}
                                    onToggle={() => setIsGroupDropdownOpen((isOpen) => !isOpen)}
                                    onSelect={(value) => {
                                        setSelectedGroupIssueIds((previous) => (
                                            previous.includes(value)
                                                ? previous.filter((selectedValue) => selectedValue !== value)
                                                : [...previous, value]
                                        ));
                                    }}
                                    selectedValues={selectedGroupIssueIds}
                                    options={groupOptions}
                                    dropdownRef={groupDropdownRef}
                                    widthClass="w-full sm:w-80"
                                    menuAlign="left"
                                    menuWidthClass="w-full"
                                    triggerClassName="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 inline-flex items-center justify-between"
                                    renderOptionLabel={(option) => (
                                        <span className="text-xs text-gray-700">{option.label}</span>
                                    )}
                                    footer={(
                                        <div className="flex justify-end px-3 pt-2 pb-1 mt-1 border-t border-gray-100">
                                            <button
                                                type="button"
                                                className="text-sm text-gray-700"
                                                onClick={() => setIsGroupDropdownOpen(false)}
                                            >
                                                Done
                                            </button>
                                        </div>
                                    )}
                                />
                                <Button
                                    variant="secondary"
                                    onClick={handleUpdateGroup}
                                    isLoading={isLinking}
                                    disabled={isLinking}
                                    className="w-full sm:w-auto"
                                >
                                    {isLinking ? 'Updating...' : 'Update Group'}
                                </Button>
                            </div>
                        </div>

                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2 overflow-hidden">
                    <div className="flex justify-between mb-6">
                        <div className="flex items-center">
                            <div>
                                {isEditing ? (
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                        Issue Type
                                        </label>
                                        <select
                                            value={editedIssueType}
                                            onChange={(e) => setEditedIssueType(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        >
                                            <option value="obstruction">Obstruction (tree down, etc.)</option>
                                            <option value="flooding">Standing Water/Mud</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {issue.issueType.charAt(0).toUpperCase() + issue.issueType.slice(1)}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                        Reported {formatDate(issue.createdAt)}
                                        </p>
                                        {issue.resolvedAt && (
                                            <p className="text-sm text-green-600">
                                            Resolved {formatDate(issue.resolvedAt)}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <IssueStatusBadge status={issue.status} />
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                        {isEditing ? (
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-32"
                                rows={4}
                            />
                        ) : (
                            <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
                        )}
                    </div>

                    {issue.image && (
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Issue Image</h4>
                            <div className="rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={issue.image.url}
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

                    {issue.longitude && issue.latitude && (
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>

                            {/* Location component can be kept or removed based on preference */}
                            <div className="mt-4">
                                <Location
                                    initialLat={issue.latitude}
                                    initialLon={issue.longitude}
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
                                        navigator.clipboard.writeText(`${issue.latitude}, ${issue.longitude}`);
                                    }}
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copy Coordinates
                                </Button>

                                {/* Open in Google Maps */}
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`}
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
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h3>

                        <div className="space-y-4">
                            <IssueTimer issue={issue} />

                            <div>
                                <p className="text-sm font-medium text-gray-500">Issue Group</p>
                                {issue.issueGroupMemberIds && issue.issueGroupMemberIds.filter((id) => id !== issue.issueId).length > 0 && (
                                    <div className="mt-2">
                                        <div className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900">
                                            <span>Grouped with Issue </span>
                                            <span className="ml-1">
                                                {issue.issueGroupMemberIds
                                                    .filter((id) => id !== issue.issueId)
                                                    .map((groupedIssueId, index, issueGroupMemberIds) => (
                                                        <span key={groupedIssueId}>
                                                            <Link
                                                                to={`/issues/card/${groupedIssueId}`}
                                                                className="text-blue-600 hover:text-blue-500"
                                                            >
                                                                {groupedIssueId}
                                                            </Link>
                                                            {index < issueGroupMemberIds.length - 1 ? ', ' : ''}
                                                        </span>
                                                    ))}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Location</p>
                                <div className="mt-1">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Park
                                                </label>
                                                <select
                                                    value={editedParkId}
                                                    onChange={(e) => setEditedParkId(Number(e.target.value))}
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                >
                                                    <option value="">Select a park</option>
                                                    {parks.map((p) => (
                                                        <option key={p.parkId} value={p.parkId}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {park && (
                                                <Link
                                                    to={`/parks/${park.parkId}`}
                                                    className="text-blue-600 hover:text-blue-500 block"
                                                >
                                                    {park.name}
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Visibility</p>
                                <div className="flex items-center mt-1">
                                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d={issue.isPublic
                                                ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                                : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'}
                                        />
                                    </svg>
                                    <p className="text-sm">
                                        {issue.isPublic ? 'Public' : 'Private'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Notification</p>
                                <div className="flex items-center mt-1">
                                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d={issue.notifyReporter
                                                ? 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                                                : 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'}
                                        />
                                    </svg>
                                    <p className="text-sm">
                                        {issue.notifyReporter ? 'Reporter will be notified when resolved' : 'No notification requested'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
