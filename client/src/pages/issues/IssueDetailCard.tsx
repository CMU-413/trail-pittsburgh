import React, {
    useState, useEffect, useRef
} from 'react';
import { Link } from 'react-router-dom';
import {
    Issue, IssueStatusEnum, IssueTypeEnum, UserRoleEnum
} from '../../types';
import {
    LeafletMap, LeafletMarker, LeafletMarkerDragEvent
} from '../../types/leaflet';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { ImageMetadataDisplay } from '../../components/ui/ImageMetadataDisplay';
import { issueApi, parkApi } from '../../services/api';
import { issueTypeFrontendToEnum } from '../../utils/issueTypeUtils';
import { getIssueStatusColor } from '../../utils/issueStatusUtils';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../providers/AuthProvider';
import { iconForType } from './issuePinIcons';
import { IssueDropdown } from './components/IssueDropdown';
import { IssueDetailEditHeader } from './components/IssueDetailEditHeader';

export const IssueDetailCard: React.FC<{
    issueId: number;
    onClose: () => void;
    onUpdated?: () => void;
}> = ({ issueId, onClose, onUpdated }) => {
    const [issue, setIssue] = useState<Issue | null>(null);
    const [, setParks] = useState<{ parkId: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [editedIssueType, setEditedIssueType] = useState('');
    const [editedParkId, setEditedParkId] = useState<number>(0);
    const [editedLatitude, setEditedLatitude] = useState<number | null>(null);
    const [editedLongitude, setEditedLongitude] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
    const [isUpdatingPhotoVisibility, setIsUpdatingPhotoVisibility] = useState(false);
    const [selectedGroupIssueIds, setSelectedGroupIssueIds] = useState<string[]>([]);
    const [linkableIssues, setLinkableIssues] = useState<Issue[]>([]);

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<LeafletMap | null>(null);
    const markerRef = useRef<LeafletMarker>(null);
    const latestCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
    const groupDropdownRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth();
    const canEditIssue = user?.role === UserRoleEnum.ROLE_ADMIN ||
        user?.role === UserRoleEnum.ROLE_SUPERADMIN || user?.email === issue?.ownerEmail;
    const canManageIssueStatus = user?.role === UserRoleEnum.ROLE_ADMIN ||
        user?.role === UserRoleEnum.ROLE_SUPERADMIN;
    const isImagePublic = issue?.isImagePublic ?? issue?.isPublic ?? false;
    const canViewImage =
        user?.role === UserRoleEnum.ROLE_ADMIN ||
        user?.role === UserRoleEnum.ROLE_SUPERADMIN ||
        isImagePublic || 
        user?.email === issue?.ownerEmail;

    const handleResolveIssue = async () => {
        if (!issue || !issueId) {return;}

        try {
            setIsResolving(true);
            const updatedIssue = await issueApi.updateIssueStatus(issueId, IssueStatusEnum.RESOLVED);

            if (updatedIssue) {
                setIssue(updatedIssue);
                onUpdated?.();
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error resolving issue:', err);
            alert('Failed to update issue status. Please try again.');
        } finally {
            setIsResolving(false);
        }
    };

    const handleSetInProgress = async () => {
        if (!issue || !issueId) {return;}

        try {
            const updatedIssue = await issueApi.updateIssueStatus(issueId, IssueStatusEnum.IN_PROGRESS);

            if (updatedIssue) {
                setIssue(updatedIssue);
                onUpdated?.();
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error setting issue to in progress:', err);
            alert('Failed to update issue status. Please try again.');
        }
    };

    const handleUpdateGroup = async (newSelectedIds: string[]) => {
        if (!issue || !issueId) {
            return;
        }

        try {
            const issueGroupMemberIds = newSelectedIds
                .map((value) => Number(value))
                .filter((value) => Number.isInteger(value) && value > 0 && value !== issue.issueId);

            const updatedIssue = await issueApi.setIssueGroup(issueId, issueGroupMemberIds);

            if (updatedIssue) {
                setIssue(updatedIssue);
                onUpdated?.();
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error updating issue group:', err);
            alert(err instanceof Error ? err.message : 'Failed to update issue group. Please try again.');
        }
    };

    const handleSaveChanges = async () => {
        if (!issue || !issueId) {return;}

        try {
            setIsSaving(true);

            const updateData: {
                description?: string;
                issueType?: IssueTypeEnum;
                parkId?: number;
                latitude?: number;
                longitude?: number;
            } = {};

            if (editedDescription !== (issue.description ?? '')) {
                updateData.description = editedDescription;
            }

            const editedIssueTypeEnum = issueTypeFrontendToEnum(editedIssueType);
            if (editedIssueTypeEnum !== issue.issueType) {
                updateData.issueType = editedIssueTypeEnum;
            }

            if (editedParkId !== issue.parkId) {
                updateData.parkId = editedParkId;
            }

            const latestLat = latestCoordsRef.current?.lat ?? editedLatitude;
            const latestLng = latestCoordsRef.current?.lng ?? editedLongitude;

            if (typeof latestLat === 'number' && latestLat !== issue.latitude) {
                updateData.latitude = latestLat;
            }

            if (typeof latestLng === 'number' && latestLng !== issue.longitude) {
                updateData.longitude = latestLng;
            }

            if (Object.keys(updateData).length > 0) {
                const updatedIssue = await issueApi.updateIssue(issueId, updateData);
                if (updatedIssue) {
                    setIssue(updatedIssue);
                    setIsEditing(false);
                    onUpdated?.();
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

    useEffect(() => {
        const loadParks = async () => {
            try {
                const res = await parkApi.getAllParks();
                if (res) {setParks(res);}
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Error loading parks:', e);
            }
        };
        loadParks();
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await issueApi.getIssue(issueId);
                if (!res) {
                    setError('Issue not found');
                    setLoading(false);
                    return;
                }
                setIssue(res);
                const groupedIds = (res.issueGroupMemberIds ?? [])
                    .filter((groupedIssueId) => groupedIssueId !== res.issueId)
                    .map((groupedIssueId) => String(groupedIssueId));
                setSelectedGroupIssueIds(groupedIds);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to load');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [issueId]);

    useEffect(() => {
        const loadLinkableIssues = async () => {
            if (!issue || !canManageIssueStatus) {
                setLinkableIssues([]);
                return;
            }

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

            try {
                const allIssues = await issueApi.getAllIssues();
                const filteredIssues = allIssues.filter((candidate) => (
                    candidate.issueId !== issue.issueId && candidate.parkId === issue.parkId
                ));

                const sortedIssues = [...filteredIssues].sort((left, right) => {
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

                setLinkableIssues(sortedIssues);
            } catch (loadError) {
                // eslint-disable-next-line no-console
                console.error('Failed to load linkable issues:', loadError);
                setLinkableIssues([]);
            }
        };

        loadLinkableIssues();
    }, [issue, canManageIssueStatus]);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            const target = e.target as Node;
            if (groupDropdownRef.current && !groupDropdownRef.current.contains(target)) {
                setIsGroupDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, []);

    useEffect(() => {
        if (!issue) {
            return;
        }

        const groupedIds = (issue.issueGroupMemberIds ?? [])
            .filter((groupedIssueId) => groupedIssueId !== issue.issueId)
            .map((groupedIssueId) => String(groupedIssueId));

        setSelectedGroupIssueIds(groupedIds);
    }, [issue]);

    useEffect(() => {
        if (!issue || !mapRef.current || typeof window.L === 'undefined') {return;}

        if (leafletMap.current) {
            leafletMap.current.remove();
            leafletMap.current = null;
            markerRef.current = null;
        }

        const latitude = issue?.latitude;
        const longitude = issue?.longitude;

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {return;}

        leafletMap.current = window.L.map(mapRef.current!).setView([latitude, longitude], 15);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 22,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(leafletMap.current!);

        markerRef.current = window.L
            .marker([latitude, longitude], { draggable: isEditing, icon: iconForType(issue.issueType) })
            .addTo(leafletMap.current!);

        markerRef.current.on('drag', (e: LeafletMarkerDragEvent) => {
            const newPos = e.target.getLatLng();
            if (!newPos) {return;}

            latestCoordsRef.current = { lat: newPos.lat, lng: newPos.lng };
            setEditedLatitude(newPos.lat);
            setEditedLongitude(newPos.lng);
        });

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
                markerRef.current = null;
            }
        };
    }, [issue, isEditing]);

    const copyCoords = async () => {
        if (!issue) {return;}
        const latitude = issue?.latitude;
        const longitude = issue?.longitude;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {return;}
        await navigator.clipboard.writeText(`${latitude}, ${longitude}`);
    };

    const googleMapsUrl = (latitude: number, longitude: number) =>
        `https://www.google.com/maps?q=${latitude},${longitude}`;

    const initializeEditedFields = (sourceIssue: Issue) => {
        setEditedDescription(sourceIssue.description ?? '');
        setEditedIssueType(sourceIssue.issueType.toLowerCase());
        setEditedParkId(sourceIssue.parkId);
        setEditedLatitude(sourceIssue.latitude ?? null);
        setEditedLongitude(sourceIssue.longitude ?? null);
        latestCoordsRef.current = null;
    };

    const handleTogglePhotoPublic = async () => {
        if (!issue || !canManageIssueStatus || !issue.image) {
            return;
        }

        try {
            setIsUpdatingPhotoVisibility(true);
            const updatedIssue = await issueApi.updateIssue(issue.issueId, {
                isImagePublic: !isImagePublic,
            });
            setIssue(updatedIssue);
            onUpdated?.();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error updating photo visibility:', err);
            alert('Failed to update photo visibility. Please try again.');
        } finally {
            setIsUpdatingPhotoVisibility(false);
        }
    };

    const startEditing = () => {
        if (!issue) {
            return;
        }
        initializeEditedFields(issue);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        if (!issue) {
            return;
        }
        initializeEditedFields(issue);
        setIsEditing(false);
    };

    const editTextareaClass = 'mt-2 w-full border border-gray-300 rounded-2xl p-3 min-h-[110px] text-sm text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300';
    const selectedGroupLabel = selectedGroupIssueIds.length === 0
        ? 'No grouped issues'
        : `${selectedGroupIssueIds.length} selected`;
    const hasPhotoVisibilityControl = Boolean(issue?.image);
    const shouldShowStewardControls = canManageIssueStatus && (!isEditing || hasPhotoVisibilityControl);
    const groupedIssueIds = (issue?.issueGroupMemberIds ?? []).filter((id) => id !== issue?.issueId);

    const groupOptions = linkableIssues.map((candidateIssue) => {
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

        const distanceLabel =
            issue &&
            typeof issue.latitude === 'number' &&
            typeof issue.longitude === 'number' &&
            typeof candidateIssue.latitude === 'number' &&
            typeof candidateIssue.longitude === 'number'
                ? `${distanceInMiles(issue.latitude, issue.longitude, candidateIssue.latitude, candidateIssue.longitude).toFixed(1)} mi away`
                : 'Distance unknown';

        const parkLabel = candidateIssue.park?.name ?? 'Unknown Park';
        const reportedDate = new Date(candidateIssue.createdAt).toLocaleDateString();

        return {
            value: String(candidateIssue.issueId),
            label: `#${candidateIssue.issueId} • ${parkLabel} • ${reportedDate} • ${distanceLabel}`,
        };
    });

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />

            <div className="absolute inset-0 flex items-start justify-center p-3 md:p-6" onClick={onClose}>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={[
                        'relative w-full bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] md:max-h-[85vh] flex flex-col',
                        canViewImage ? 'max-w-6xl' : 'max-w-3xl',
                    ].join(' ')}
                >
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-2 z-20">
                        <Button
                            onClick={onClose}
                            variant="secondary"
                            size="sm"
                            className="text-xl text-gray-500 hover:text-gray-800 bg-transparent hover:bg-transparent shadow-none"
                            aria-label="Close"
                            type="button"
                        >
                            ✕
                        </Button>
                    </div>

                    {loading ? (
                        <div className="p-10">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="p-10">
                            <div className="text-red-600">{error}</div>
                        </div>
                    ) : !issue ? null : (
                        <div className="relative p-4 md:p-8 pr-4 md:pr-16 overflow-y-auto">
                            {!isEditing && canEditIssue && issue?.status !== IssueStatusEnum.RESOLVED && (
                                <div className="absolute top-3 right-14 md:top-8 md:right-16 z-10">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="inline-flex items-center justify-center gap-1 whitespace-nowrap h-8 px-2 text-xs rounded-md font-medium bg-gray-50 hover:bg-gray-100 text-black w-auto md:h-9 md:px-3 md:text-sm"
                                        onClick={startEditing}
                                        aria-label="Edit issue"
                                        type="button"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            )}

                            {isEditing && (
                                <IssueDetailEditHeader
                                    issueDisplayId={issue.issueId ?? issueId}
                                    createdAt={issue.createdAt}
                                    isSaving={isSaving}
                                    onSave={handleSaveChanges}
                                    onCancel={cancelEditing}
                                />
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] items-start gap-6">
                                <div>
                                    <div className={isEditing ? 'p-3 md:p-4' : ''}>
                                        <div>
                                            <div className="flex flex-col gap-2">

                                                {/* TITLE + STATUS */}
                                                <div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl md:text-3xl font-extrabold">
                                                            {issue.issueType}
                                                        </span>
                                                        <span className="text-gray-500 font-semibold">
                                                #{issue.issueId}
                                                        </span>
                                                    </div>

                                                    <span className={[
                                                        'inline-flex mt-1 items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                                                        getIssueStatusColor(issue.status),
                                                    ].join(' ')}>
                                                        {issue.status.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                {/* PARK */}
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {issue.park?.name}
                                                </div>

                                                {/* DATE */}
                                                <div className="text-sm text-gray-600">
                                                    {issue.status === IssueStatusEnum.RESOLVED && issue.resolvedAt
                                                        ? `Resolved on ${new Date(issue.resolvedAt).toLocaleString()}`
                                                        : `Reported on ${new Date(issue.createdAt).toLocaleString()}`}
                                                </div>

                                                {/* GROUP */}
                                                {canManageIssueStatus && groupedIssueIds.length > 0 && (
                                                    <div className="inline-flex w-fit items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                                                        <span>Grouped with Issue </span>
                                                        <span className="ml-1">
                                                            {groupedIssueIds.map((id, i, arr) => (
                                                                <span key={id}>
                                                                    <Link to={`/issues/card/${id}`} className="text-blue-600">
                                                                        {id}
                                                                    </Link>
                                                                    {i < arr.length - 1 ? ', ' : ''}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    </div>
                                                )}

                                            </div>

                                            <div className="mt-6">
                                                <div className="text-xl font-bold">Description</div>
                                                {isEditing ? (
                                                    <textarea
                                                        className={editTextareaClass}
                                                        value={editedDescription}
                                                        onChange={(e) => setEditedDescription(e.target.value)}
                                                        placeholder="Describe the issue..."
                                                    />
                                                ) : (
                                                    <div className="mt-2 text-gray-700 whitespace-pre-wrap">
                                                        {issue.description?.trim() || 'No description'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {shouldShowStewardControls && (
                                        <div className="lg:pt-18">
                                            <div className="mt-6 text-xl font-bold mb-3">Steward Controls</div>
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                {!isEditing && (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-700">Status</div>
                                                    </div>
                                                )}

                                                {!isEditing && issue.status === IssueStatusEnum.OPEN && (
                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={handleSetInProgress}
                                                        >
                                                        Start Working
                                                        </Button>

                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={handleResolveIssue}
                                                            isLoading={isResolving}
                                                            disabled={isResolving}
                                                        >
                                                            {isResolving ? 'Resolving...' : 'Resolve Issue'}
                                                        </Button>
                                                    </div>
                                                )}

                                                {!isEditing && issue.status === IssueStatusEnum.IN_PROGRESS && (
                                                    <div className="mt-3">
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={handleResolveIssue}
                                                            isLoading={isResolving}
                                                            disabled={isResolving}
                                                        >
                                                            {isResolving ? 'Resolving...' : 'Resolve Issue'}
                                                        </Button>
                                                    </div>
                                                )}

                                                {!isEditing && issue.status === IssueStatusEnum.RESOLVED && (
                                                    <div className="mt-3">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={handleSetInProgress}
                                                        >
                                                        Unresolve (Set In Progress)
                                                        </Button>
                                                    </div>
                                                )}

                                                {!isEditing && issue.status === IssueStatusEnum.IN_PROGRESS && (
                                                    <p className="mt-3 text-sm text-gray-700">This issue is already in progress.</p>
                                                )}

                                                {!isEditing && (
                                                    <div className="mt-4 border-t border-gray-100 pt-4">
                                                        <div className="text-sm font-medium text-gray-700">Mark as a Duplicate</div>
                                                        <div className="mt-2 text-sm text-gray-600">Duplicate issues can be grouped together with other issues reported in the same park. Updates made to any issue in a group will be reflected in all related issues.</div>

                                                        <div className="mt-2 space-y-2">
                                                            <IssueDropdown
                                                                triggerLabel={selectedGroupLabel}
                                                                isOpen={isGroupDropdownOpen}
                                                                onToggle={() => setIsGroupDropdownOpen((isOpen) => !isOpen)}
                                                                onSelect={(value) => {
                                                                    setSelectedGroupIssueIds((previous) => {
                                                                        const next = previous.includes(value)
                                                                            ? previous.filter((selectedValue) => selectedValue !== value)
                                                                            : [...previous, value];
                                                                        handleUpdateGroup(next);
                                                                        return next;
                                                                    });
                                                                }}
                                                                selectedValues={selectedGroupIssueIds}
                                                                options={groupOptions}
                                                                dropdownRef={groupDropdownRef}
                                                                widthClass="w-full"
                                                                menuAlign="left"
                                                                menuWidthClass="w-full"
                                                                triggerClassName="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 inline-flex items-center justify-between"
                                                                renderOptionLabel={(option) => (
                                                                    <span className="text-sm text-gray-700">{option.label}</span>
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
                                                        </div>
                                                    </div>
                                                )}

                                                {issue.image && (
                                                    <div className={isEditing ? '' : 'mt-4'}>
                                                        <div className="text-sm font-medium text-gray-700">Photo Visibility</div>
                                                        <div className="mt-2 text-sm text-gray-600">
                                                            {isImagePublic ? 'Photo is currently visible to all users.' : 'Photo is currently visible only to stewards/admins.'}
                                                        </div>
                                                        <div className="mt-2">
                                                            <Button
                                                                variant={isImagePublic ? 'secondary' : 'primary'}
                                                                size="sm"
                                                                onClick={handleTogglePhotoPublic}
                                                                isLoading={isUpdatingPhotoVisibility}
                                                                disabled={isUpdatingPhotoVisibility}
                                                            >
                                                                {isImagePublic ? 'Revoke Public Photo Approval' : 'Approve for Public View'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-8">

                                    {/* LOCATION */}
                                    <div>
                                        <div className="text-xl font-bold">Location</div>

                                        {isEditing && (
                                            <div className="mt-1 text-sm text-gray-600">
                                    Drag the map pin to update the location coordinates.
                                            </div>
                                        )}

                                        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                                            <div ref={mapRef} className="h-[320px] w-full" />
                                        </div>

                                        {typeof issue.latitude === 'number' && typeof issue.longitude === 'number' && (
                                            <>
                                                <div className="mt-4 text-gray-700 text-sm">
                                                    {issue.latitude}, {issue.longitude}
                                                </div>

                                                <div className="mt-3 flex gap-2 flex-wrap">
                                                    <Button size="sm" onClick={copyCoords}>
                                        Copy Coordinates
                                                    </Button>

                                                    <a
                                                        href={googleMapsUrl(issue.latitude, issue.longitude)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                        ↗ Open in Google Maps
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {canViewImage && (
                                        <div>
                                            <div className="text-xl font-bold">User Submitted Image</div>

                                            <div className="mt-4 rounded-lg border border-slate-200 overflow-hidden bg-gray-50 h-[300px] flex items-center justify-center">
                                                {issue.image ? (
                                                    <img
                                                        src={issue.image.url}
                                                        alt="Issue"
                                                        className="h-full w-full object-contain"
                                                    />
                                                ) : 'No image ◡̈'}
                                            </div>

                                            {issue.image && issue.imageMetadata && (
                                                <ImageMetadataDisplay
                                                    metadata={issue.imageMetadata}
                                                    className="mt-3"
                                                />
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
