import React, {
    useState, useEffect, useRef 
} from 'react';
import {
    Issue, IssueStatusEnum, IssueTypeEnum, IssueUrgencyEnum, UserRoleEnum 
} from '../../types';
import {
    LeafletMap, LeafletMarker, LeafletMarkerDragEvent 
} from '../../types/leaflet';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { ImageMetadataDisplay } from '../../components/ui/ImageMetadataDisplay';
import { issueApi, parkApi } from '../../services/api';
import { issueTypeFrontendToEnum } from '../../utils/issueTypeUtils';
import { issueUrgencyEnumToFrontend, issueUrgencyFrontendToEnum } from '../../utils/issueUrgencyUtils';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../providers/AuthProvider';

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
    const [editedUrgency, setEditedUrgency] = useState<number>(1);
    const [editedIssueType, setEditedIssueType] = useState('');
    const [editedParkId, setEditedParkId] = useState<number>(0);
    const [editedLatitude, setEditedLatitude] = useState<number | null>(null);
    const [editedLongitude, setEditedLongitude] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<LeafletMap | null>(null);
    const markerRef = useRef<LeafletMarker>(null);
    const latestCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

    const { user } = useAuth();
    const canEditIssue = user?.role === UserRoleEnum.ROLE_USER ||
						 user?.role === UserRoleEnum.ROLE_ADMIN ||
						 user?.role === UserRoleEnum.ROLE_SUPERADMIN;
    const canViewImage = user?.role === UserRoleEnum.ROLE_ADMIN ||
						 user?.role === UserRoleEnum.ROLE_SUPERADMIN;

    const handleSaveChanges = async () => {
        if (!issue || !issueId)
        {return;}

        try {
            setIsSaving(true);

            const updateData: {
				description?: string;
				urgency?: IssueUrgencyEnum;
				issueType?: IssueTypeEnum;
				parkId?: number;
				latitude?: number;
				longitude?: number;
			} = {};
			
            // Only include fields that have changed
            if (editedDescription !== issue.description)
            {updateData.description = editedDescription;}
			
            const editedUrgencyEnum = issueUrgencyFrontendToEnum(editedUrgency);
            if (editedUrgencyEnum !== issue.urgency)
            {updateData.urgency = editedUrgencyEnum;}

            // Fix issue type comparison by converting both to the same format
            const editedIssueTypeEnum = issueTypeFrontendToEnum(editedIssueType);
            if (editedIssueTypeEnum !== issue.issueType)
            {updateData.issueType = editedIssueTypeEnum;}

            if (editedParkId !== issue.parkId)
            {updateData.parkId = editedParkId;}

            const latestLat = latestCoordsRef.current?.lat ?? editedLatitude;
            const latestLng = latestCoordsRef.current?.lng ?? editedLongitude;

            if (typeof latestLat === 'number' && latestLat !== issue.latitude)
            {updateData.latitude = latestLat;}
			
            if (typeof latestLng === 'number' && latestLng !== issue.longitude)
            {updateData.longitude = latestLng;}

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
                const res = await parkApi.getParks(); // or whatever your API name is
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
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to load');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [issueId]);

    useEffect(() => {
        if (!issue || !mapRef.current || typeof window.L === 'undefined')
        {return;}

        if (leafletMap.current) {
            leafletMap.current.remove();
            leafletMap.current = null;
            markerRef.current = null;
        }

        const latitude = issue?.latitude;
        const longitude = issue?.longitude;

        if (typeof latitude !== 'number' || typeof longitude !== 'number')
        {return;}

        leafletMap.current = window.L.map(mapRef.current!).setView([latitude,longitude], 15);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 22,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(leafletMap.current!);

        markerRef.current = window.L.marker([latitude, longitude], { draggable: isEditing }).addTo(leafletMap.current!);
        markerRef.current.on('drag', (e: LeafletMarkerDragEvent) => {
            const newPos = e.target.getLatLng();
            if (!newPos) 
            {return;}

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
        if (!issue) 
        {return;}
        const latitude = issue?.latitude;
        const longitude = issue?.longitude;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') 
		    {return;}
        await navigator.clipboard.writeText(`${latitude}, ${longitude}`);
    };

    const googleMapsUrl = (latitude: number, longitude: number) => 
        `https://www.google.com/maps?q=${latitude},${longitude}`;

    return (
        <div className="fixed inset-0 z-50">
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />

            {/* modal */}
            <div className="absolute inset-0 flex items-start justify-center p-3 md:p-6">
                <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] md:max-h-[85vh] flex flex-col">
                    {/* close */}
                    <Button
                        onClick={onClose}
                        size="sm"
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        aria-label="Close"
                        type="button"
                    >
						✕
                    </Button>

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
                            {/* header row */}
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                        {isEditing ? (
                                            <select
                                                className="border rounded-md px-2 py-1 text-sm font-semibold"
                                                value={editedIssueType}
                                                onChange={(e) => setEditedIssueType(e.target.value)}
                                            >
                                                <option value="obstruction">Obstruction</option>
                                                <option value="flooding">Flooding</option>
                                                <option value="other">Other</option>
                                            </select>
                                        ) : (
                                            <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                                {issue.issueType}
                                            </span>
                                        )}
	
                                        {/* #id */}
                                        <span className="text-base md:text-lg font-semibold text-gray-900">
											#{issue.issueId ?? issueId}
                                        </span>
	
                                        {/* {isEditing ? (
											<select
												className="border rounded px-2 py-1 text-base font-semibold"
												value={editedUrgency}
												onChange={(e) => setEditedUrgency(Number(e.target.value))}
											>
												{[1, 2, 3, 4, 5].map((level) => (
													<option key={level} value={level}>
														{level} - {['Low', 'Medium-Low', 'Medium', 'Medium-High', 'High'][level - 1]}
													</option>
												))}
											</select>
										) : (
											<span>- {issue.urgency}</span>
										)}{' '} */}

                                        {/* separator dot */}
  										<span 
                                            aria-hidden="true"
  											className="text-black text-lg md:text-xl font-extrabold leading-none"
                                        >
												•				
                                        </span>

                                        {isEditing ? (
                                            <select
                                                className="border rounded-md px-2 py-1 text-sm font-semibold"
                                                value={editedParkId}
                                                onChange={(e) => setEditedParkId(Number(e.target.value))}
                                            >
                                                {parks.map((p) => (
                                                    <option key={p.parkId} value={p.parkId}>{p.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-lg md:text-xl font-semibold text-gray-900 underline underline-offset-4">
                                                {issue.park?.name ?? ''}
                                            </span>		
                                        )}
                                    </div>

                                    <div className="mt-2 text-sm md:text-base text-gray-600">
										Reported {new Date(issue.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {/* Edit button - only shown when not editing and issue is not resolved */}
                                    {canEditIssue && !isEditing && issue.status !== IssueStatusEnum.RESOLVED && (
                                        <Button
                                            variant="primary"
                                            size="md"
                                            className="rounded-full px-4 py-2 font-semibold shadow-sm"
                                            onClick={() => {
                                                setIsEditing(true);
                                                // Reset fields to original values
                                                setEditedDescription(issue.description || '');
                                                setEditedUrgency(issueUrgencyEnumToFrontend(issue.urgency));
                                                setEditedIssueType(issue.issueType.toLowerCase());
                                                setEditedParkId(issue.parkId);
                                                setEditedLatitude(issue.latitude ?? null);
                                                setEditedLongitude(issue.longitude ?? null);
                                            }}
                                        >
											✎ Edit Issue
                                        </Button>
                                    )}
		
                                    {/* Cancel and Save buttons - only shown when editing */}
                                    {isEditing && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="md"
                                                className="rounded-full px-4 py-2 font-semibold shadow-sm"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    // Reset fields to original values
                                                    setEditedDescription(issue.description || '');
                                                    setEditedUrgency(issueUrgencyEnumToFrontend(issue.urgency));
                                                    setEditedIssueType(issue.issueType.toLowerCase());
                                                    setEditedParkId(issue.parkId);
                                                }}
                                                disabled={isSaving}
                                            >
												Cancel
                                            </Button>

                                            <Button
                                                variant="primary"
                                                size="md"
                                                className="rounded-full px-4 py-2 font-semibold shadow-sm"
                                                onClick={handleSaveChanges}
                                                isLoading={isSaving}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="text-xl font-bold">Description</div>
                                {isEditing ? (
                                    <textarea
                                        className="mt-2 w-full border rounded p-3 min-h-[100px]"
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        placeholder="Describe the issue..."
                                    />
                                ) : (
                                    <div className="mt-2 text-gray-700 whitespace-pre-wrap">
                                        {issue.description?.trim() ? issue.description : 'No description'}
                                    </div>
                                )}
                            </div>

                            {/* main grid */}
                            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* left: location */}
                                <div>
                                    <div className="text-xl font-bold">Location</div>

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
													Open in Google Maps
                                                </a>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* images */}
                                <div>
                                    <div className="text-xl font-bold">User Submitted Image</div>
                                    <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 h-[340px] flex items-center justify-center relative">
                                        {canViewImage && issue.image ? (
                                            <div className="text-gray-500">
                                                <img
                                                    src={issue.image.url}
                                                    alt={'Issue'}
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
