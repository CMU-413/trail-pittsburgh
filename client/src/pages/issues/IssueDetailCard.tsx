import React, {
    useState, useEffect, useRef 
} from 'react';
import { Issue } from '../../types';
import { LeafletMap, LeafletMarker } from '../../types/leaflet';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { ImageMetadataDisplay } from '../../components/ui/ImageMetadataDisplay';
import { issueApi } from '../../services/api';

export const IssueDetailCard: React.FC<{ issueId: number; onClose: () => void }> = ({ issueId, onClose }) => {
    const [issue, setIssue] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<LeafletMap | null>(null);

    const markerRef = useRef<LeafletMarker>(null);

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

        markerRef.current = window.L.marker([latitude, longitude], { draggable: false }).addTo(leafletMap.current!);
	    
        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
                markerRef.current = null;
            }
        };
    }, [issue]);

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
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        aria-label="Close"
                        type="button"
                    >
				    ✕
                    </button>

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
                                    <div className="text-3xl font-extrabold tracking-tight">
                                        {issue.issueType}{' '}
                                        <span className="text-gray-700 font-semibold">
								#{issue.issueId ?? issueId}
                                        </span>
                                        {' '}
                                        <span className="text-gray-800 font-semibold block md:inline">
								• {issue.park?.name ?? ''}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-gray-600">
								Reported {new Date(issue.createdAt).toLocaleString()}
                                    </div>
                                </div>
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
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
									⚲
                                                </span>
                                                <span>
									Coordinates: {issue.latitude}, {issue.longitude}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={copyCoords}
                                                    className="px-4 py-2 rounded-md bg-orange-600 text-white font-medium hover:bg-orange-700"
                                                >
									Copy Coordinates
                                                </button>

                                                <a
                                                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 font-medium hover:bg-gray-50"
                                                    href={googleMapsUrl(issue.latitude, issue.longitude)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
									Open in Google Maps
                                                </a>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* images */}
                                <div>
                                    <div className="text-xl font-bold">Image</div>
                                    <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 h-[340px] flex items-center justify-center relative">
                                        {issue.image ? (
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
