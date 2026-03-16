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
import { IssueDetailEditDropdown, IssueDropdown } from './components/IssueDropdown';
import { IssueDetailEditHeader } from './components/IssueDetailEditHeader';

export const IssueDetailCard: React.FC<{
    issueId: number;
    onClose: () => void;
    onUpdated?: () => void;
}> = ({ issueId, onClose, onUpdated }) => {
    const [issue, setIssue] = useState<Issue | null>(null);
    const [parks, setParks] = useState<{ parkId: number; name: string }[]>([]);
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
    const [isIssueTypeDropdownOpen, setIsIssueTypeDropdownOpen] = useState(false);
    const [isParkDropdownOpen, setIsParkDropdownOpen] = useState(false);
    const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
    const [isUpdatingPhotoVisibility, setIsUpdatingPhotoVisibility] = useState(false);
    const [selectedGroupIssueIds, setSelectedGroupIssueIds] = useState<string[]>([]);
    const [linkableIssues, setLinkableIssues] = useState<Issue[]>([]);
    const [isLinking, setIsLinking] = useState(false);

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<LeafletMap | null>(null);
    const markerRef = useRef<LeafletMarker>(null);
    const latestCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
    const issueTypeDropdownRef = useRef<HTMLDivElement>(null);
    const parkDropdownRef = useRef<HTMLDivElement>(null);
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

    const handleUpdateGroup = async () => {
        if (!issue || !issueId) {
            return;
        }

        try {
            setIsLinking(true);
            const issueGroupMemberIds = selectedGroupIssueIds
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
            alert('Failed to update issue group. Please try again.');
        } finally {
            setIsLinking(false);
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
                const filteredIssues = allIssues.filter((candidate) => candidate.issueId !== issue.issueId);

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
            if (issueTypeDropdownRef.current && !issueTypeDropdownRef.current.contains(target)) {
                setIsIssueTypeDropdownOpen(false);
            }
            if (parkDropdownRef.current && !parkDropdownRef.current.contains(target)) {
                setIsParkDropdownOpen(false);
            }
            if (groupDropdownRef.current && !groupDropdownRef.current.contains(target)) {
                setIsGroupDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, []);

    useEffect(() => {
        if (!isEditing) {
            setIsIssueTypeDropdownOpen(false);
            setIsParkDropdownOpen(false);
        }
    }, [isEditing]);

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
    const issueTypeLabel =
        editedIssueType === 'obstruction' ? 'Obstruction'
            : editedIssueType === 'flooding' ? 'Flooding'
                : 'Other';
    const selectedParkLabel = parks.find((p) => p.parkId === editedParkId)?.name ?? 'Select Park';
    const selectedGroupLabel = selectedGroupIssueIds.length === 0
        ? 'No grouped issues'
        : `${selectedGroupIssueIds.length} selected`;

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
                    {loading ? (
                        <div className="p-10">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="p-10">
                            <div className="text-red-600">{error}</div>
                        </div>
                    ) : !issue ? null : (
                        <div className="p-4 md:p-8 overflow-y-auto">
                            {isEditing && (
                                <IssueDetailEditHeader
                                    issueDisplayId={issue.issueId ?? issueId}
                                    createdAt={issue.createdAt}
                                    isSaving={isSaving}
                                    onSave={handleSaveChanges}
                                    onCancel={cancelEditing}
                                />
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
                                <div>
                                    <div className={isEditing ? 'rounded-lg border border-slate-200 bg-white p-3 md:p-4' : ''}>
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                {/* LEFT SIDE */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {isEditing ? (
                                                        <IssueDetailEditDropdown
														    label="Issue Type"
                                                            valueLabel={issueTypeLabel}
                                                            isOpen={isIssueTypeDropdownOpen}
                                                            onToggle={() => setIsIssueTypeDropdownOpen((open) => !open)}
                                                            onSelect={(value) => {
                                                                setEditedIssueType(value);
                                                                setIsIssueTypeDropdownOpen(false);
                                                            }}
                                                            selectedValue={editedIssueType}
                                                            options={[
                                                                { value: 'obstruction', label: 'Obstruction' },
                                                                { value: 'flooding', label: 'Flooding' },
                                                                { value: 'other', label: 'Other' },
                                                            ]}
                                                            dropdownRef={issueTypeDropdownRef}
                                                            widthClass="w-[220px]"
                                                        />
                                                    ) : (
                                                        <>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                                                    {issue.issueType}
                                                                </span>
                                                                <span className="text-lg md:text-xl font-semibold text-gray-600">
																	#{issue.issueId}
                                                                </span>
                                                            </div>
                                            {/* <div className="flex flex-wrap items-center gap-2">
                                                {isEditing ? (
                                                    <IssueDetailEditDropdown
                                                        label="Issue Type"
                                                        valueLabel={issueTypeLabel}
                                                        isOpen={isIssueTypeDropdownOpen}
                                                        onToggle={() => setIsIssueTypeDropdownOpen((open) => !open)}
                                                        onSelect={(value) => {
                                                            setEditedIssueType(value);
                                                            setIsIssueTypeDropdownOpen(false);
                                                        }}
                                                        selectedValue={editedIssueType}
                                                        options={[
                                                            { value: 'obstruction', label: 'Obstruction' },
                                                            { value: 'flooding', label: 'Flooding' },
                                                            { value: 'other', label: 'Other' },
                                                        ]}
                                                        dropdownRef={issueTypeDropdownRef}
                                                        widthClass="w-[220px]"
                                                    />
                                                ) : (
                                                    <>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                                                {issue.issueType}
                                                            </span>
                                                            <span className="text-lg md:text-xl font-semibold text-gray-600">
                                                                #{issue.issueId}
                                                            </span>
                                                        </div> */}

                                                            <span className={[
                                                                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                                                                getIssueStatusColor(issue.status),
                                                            ].join(' ')}>
                                                                {issue.status.replace('_', ' ')}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* RIGHT SIDE (NEW) */}
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {!isEditing && canEditIssue && issue?.status !== IssueStatusEnum.RESOLVED && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className="inline-flex items-center gap-2 whitespace-nowrap h-9 px-3 rounded-md text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 text-black"
                                                            onClick={startEditing}
                                                            aria-label="Edit issue"
                                                            type="button"
                                                        >
															✎ Edit
                                                        </Button>
                                                    )}

                                                    <Button
                                                        onClick={onClose}
                                                        variant="secondary"
                                                        size="md"
                                                    >
														✕
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <IssueDetailEditDropdown
                                                            label="Park"
                                                            valueLabel={selectedParkLabel}
                                                            isOpen={isParkDropdownOpen}
                                                            onToggle={() => setIsParkDropdownOpen((open) => !open)}
                                                            onSelect={(value) => {
                                                                setEditedParkId(Number(value));
                                                                setIsParkDropdownOpen(false);
                                                            }}
                                                            selectedValue={String(editedParkId)}
                                                            options={parks.map((p) => ({ value: String(p.parkId), label: p.name }))}
                                                            dropdownRef={parkDropdownRef}
                                                            widthClass="w-[300px]"
                                                        />
                                                    ) : (
                                                        <span className="text-lg md:text-xl font-semibold text-gray-900">
                                                            {issue.park?.name ?? ''}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1 text-sm md:text-base text-slate-600">
                                                    {issue.status === IssueStatusEnum.RESOLVED && issue.resolvedAt
                                                        ? `Resolved on ${new Date(issue.resolvedAt).toLocaleString()}`
                                                        : `Reported on ${new Date(issue.createdAt).toLocaleString()}`}
                                                </div>

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

                                {canManageIssueStatus && (
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
                                                    <div className="text-sm font-medium text-gray-700">Duplicate Management</div>
                                                    <div className="mt-2 space-y-2">
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

                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={handleUpdateGroup}
                                                            isLoading={isLinking}
                                                            disabled={isLinking}
                                                        >
                                                            {isLinking ? 'Updating...' : 'Update Group'}
                                                        </Button>
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

                            <div
                                className={[
                                    'mt-10 grid gap-10',
                                    canViewImage ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1',
                                ].join(' ')}
                            >
                                <div>
                                    <div className="text-xl font-bold">Location</div>

                                    {isEditing && (
                                        <div className="mt-1 text-sm text-gray-600">
                                            Drag the map pin to update the location coordinates.
                                        </div>
                                    )}

                                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                                        <div ref={mapRef} className="h-[260px] w-full" />
                                    </div>

                                    {typeof issue.latitude === 'number' && typeof issue.longitude === 'number' && (
                                        <>
                                            <div className="mt-4 flex items-center gap-2 text-gray-700">
                                                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>

                                                <span>
                                                    {isEditing
                                                        ? `${editedLatitude ?? ''}, ${editedLongitude ?? ''}`
                                                        : `${issue.latitude}, ${issue.longitude}`}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex gap-3">
                                                <Button
                                                    size="sm"
                                                    onClick={copyCoords}
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                    </svg>
                                                    Copy Coordinates
                                                </Button>

                                                <a
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    href={googleMapsUrl(issue.latitude, issue.longitude)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    <span className="leading-tight text-center">
                                                        Open in <span className="block md:inline">Google Maps</span>
                                                    </span>
                                                </a>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {canViewImage ? (
                                    <div>
                                        <div className="text-xl font-bold">User Submitted Image</div>
                                        <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 h-[340px] flex items-center justify-center relative">
                                            {issue.image ? (
                                                <div className="text-gray-500">
                                                    <img
                                                        src={issue.image.url}
                                                        alt="Issue"
                                                        className="max-h-[340px] w-full object-contain"
                                                    />
                                                    {issue.imageMetadata && (
                                                        <ImageMetadataDisplay
                                                            metadata={issue.imageMetadata}
                                                            className="mt-3"
                                                        />
                                                    )}
                                                </div>
                                            ) : 'No image ◡̈'}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
