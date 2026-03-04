// src/pages/issues/IssueMapPage.tsx
import React, {
    useState, useEffect, useRef
} from 'react';

import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';

import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';

import { LeafletMap, LeafletMarker } from '../../types/leaflet';
import { PARKS } from '../parks/ParkInfo';
import {
    IssueStatusEnum, IssueTypeEnum, IssueUrgencyEnum 
} from '../../types';
import { IssueDetailCard } from './IssueDetailCard';
import { 
    Link, useNavigate, useParams 
} from 'react-router-dom';
import { IssueFilterDropdown } from './IssueFilterDropdown';
import obstuctionPin from '../../assets/obstructionPin.png';
import waterPin from '../../assets/waterPin.png';
import otherPin from '../../assets/otherPin.png';

type IssuePin = {
	issueId: number;
	latitude: number;
	longitude: number;
	issueType: IssueTypeEnum;
	urgency: IssueUrgencyEnum;
	status: IssueStatusEnum ;
	createdAt: string;
}

const fetchPinsByBbox = async (
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    types: IssueTypeEnum[] = []
): Promise<IssuePin[]> => {
    const bbox = `${minLat},${minLng},${maxLat},${maxLng}`;
    const params = new URLSearchParams({ bbox });
    for (const t of types) 
    {params.append('issueTypes', t);}
    params.append('statuses', IssueStatusEnum.OPEN);
    params.append('statuses', IssueStatusEnum.IN_PROGRESS);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/issues/map?${params.toString()}`);
    if (!res.ok) 
    {return [];}
    const data = await res.json();
    return Array.isArray(data?.pins) ? data.pins : [];
};

const makePinIcon = (url: string) =>
    window.L.icon({
        iconUrl: url,
        iconSize: [22, 34],      
        iconAnchor: [11, 34],
        popupAnchor: [0, -34],
    });

export const iconForType = (t: IssueTypeEnum) => {
    if (t === 'OBSTRUCTION') 
    	{return makePinIcon(obstuctionPin);}
    if (t === 'FLOODING') 
    	{return makePinIcon(waterPin);}
    return makePinIcon(otherPin);
};

export const IssueMapPage: React.FC = () => {
    const DEFAULT_PARK_ID = 'alameda-park';
    const CURRENT_LOCATION_OPTION = 'current-location';

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<LeafletMap | null>(null);
    const issueMarkersRef = useRef<LeafletMarker[]>([]);
    const parkDropdownRef = useRef<HTMLDivElement>(null);

    const [selectedPark, setSelectedPark] = useState<string>(DEFAULT_PARK_ID);
    const [isParkDropdownOpen, setIsParkDropdownOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [canUseCurrentLocation, setCanUseCurrentLocation] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<IssueTypeEnum[]>([]);
    const selectedTypesRef = useRef<IssueTypeEnum[]>([]);
    const [isLoading, setIsLoading] = useState(true); const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { issueId } = useParams<{ issueId?: string }>();

    const clearIssueMarkers = () => {
        issueMarkersRef.current.forEach((m) => m.remove());
        issueMarkersRef.current = [];
    };

    const openIssueDetail = (id: number) => {
        navigate(`/issues/card/${id}`);
    };

    const closeIssueDetail = () => {
        navigate('/issues');
    };

    const selectedIssueId = issueId ? Number(issueId) : null;
    const isDetailOpen = typeof selectedIssueId === 'number' && Number.isInteger(selectedIssueId) && selectedIssueId > 0;

    const refreshPinsForView = async () => {
        if (!leafletMap.current || typeof window.L === 'undefined') {return;}

        setIsLoading(true);
        setError(null);

        try {
            const bounds = leafletMap.current.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();

            clearIssueMarkers();

            const pins = await fetchPinsByBbox(sw.lat, sw.lng, ne.lat, ne.lng, selectedTypesRef.current);

            for (const pin of pins) {
                if (typeof pin.latitude !== 'number' || typeof pin.longitude !== 'number') {continue;}

                const marker = window.L
                    .marker([pin.latitude, pin.longitude], { icon: iconForType(pin.issueType) })
                    .addTo(leafletMap.current);

                marker.on('click', () => {
                    const id = pin.issueId;
                    openIssueDetail(id);
                });
                issueMarkersRef.current.push(marker);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error fetching issues:', err);
            setError('Failed to load issues. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
	
    const toggleType = (t: IssueTypeEnum) => {
        setSelectedTypes((prev) =>
            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
    };
     
    useEffect(() => {
        const init = () => {
            if (!mapRef.current || leafletMap.current) 
            {return;} 
            leafletMap.current = window.L.map(mapRef.current!).setView([40.4406, -79.9959], 12 );
            refreshPinsForView();
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 22,
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(leafletMap.current!);
            leafletMap.current.on('moveend', refreshPinsForView);
        };
	
        if (typeof window.L === 'undefined') {
            // CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(cssLink);
	
            // JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.onload = init;
            document.body.appendChild(script);
        } else {
            init();
        }
	
        return () => {
            leafletMap.current?.remove();
            leafletMap.current = null;
        };
    }, []);
	
    useEffect(() => {
        if (!leafletMap.current || !selectedPark) 
        {return;}

        if (selectedPark === CURRENT_LOCATION_OPTION && currentLocation) {
            leafletMap.current.setView([currentLocation.lat, currentLocation.lng], 14);
            return;
        }

        const park = PARKS.find((p) => p.id === selectedPark);
        if (!park) {return;}

        const bounds: [[number, number], [number, number]] = [park.bounds.sw, park.bounds.ne];
        leafletMap.current.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
    }, [selectedPark, currentLocation]);
     
    useEffect(() => {
        selectedTypesRef.current = selectedTypes;
        refreshPinsForView();
    }, [selectedTypes]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!parkDropdownRef.current) {
                return;
            }
            if (!parkDropdownRef.current.contains(event.target as Node)) {
                setIsParkDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setCanUseCurrentLocation(false);
            setSelectedPark(DEFAULT_PARK_ID);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setCanUseCurrentLocation(true);
                setSelectedPark(CURRENT_LOCATION_OPTION);
            },
            () => {
                setCanUseCurrentLocation(false);
                setSelectedPark(DEFAULT_PARK_ID);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    }, []);

    useEffect(() => {
        if (!issueId) {
            return;
        }
        const parsedId = Number(issueId);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            navigate('/issues', { replace: true });
        }
    }, [issueId, navigate]);

    const selectedParkName = selectedPark
        === CURRENT_LOCATION_OPTION
        ? 'Current Location'
        : (PARKS.find((park) => park.id === selectedPark)?.name ?? 'Alameda Park');

    return (
        <div>
            <div className="flex items-start justify-between gap-4">
                <PageHeader
                    title="Trail Issues"
                    subtitle="View and manage reported trail issues"
                />

                <Link to="/issues/report" className="shrink-0">
                    <Button variant="primary">Report Issue</Button>
                </Link>
            </div>

            {error ? (
                <EmptyState
                    title="Error loading issues"
                    description={error}
                    action={
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    }
                />
            ) : (
                <>
                    <div className="flex items-center justify-between gap-4 mb-3">
                        {/* Park selection - dropdown menu */}
                        <div className="flex items-center gap-3">
                            <label className="text-lg font-medium text-gray-900">Focus Map On</label>

                            <div ref={parkDropdownRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsParkDropdownOpen((open) => !open)}
                                    className="min-w-[220px] bg-white border border-gray-300 rounded-full px-4 py-2 text-md font-medium text-gray-900 shadow-sm flex items-center justify-between gap-2"
                                >
                                    <span>{selectedParkName}</span>
                                    <span className="text-black text-xl leading-none">▾</span>
                                </button>

                                {isParkDropdownOpen && (
                                    <div className="absolute left-0 mt-2 w-full min-w-[260px] bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-30">
                                        {canUseCurrentLocation && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPark(CURRENT_LOCATION_OPTION);
                                                    setIsParkDropdownOpen(false);
                                                }}
                                                className={[
                                                    'w-full flex items-center justify-between px-3 py-2 text-md rounded-xl',
                                                    selectedPark === CURRENT_LOCATION_OPTION ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                                                ].join(' ')}
                                            >
                                                <span>Current Location</span>
                                                <span className="text-md text-gray-900" aria-hidden="true">
                                                    {selectedPark === CURRENT_LOCATION_OPTION ? '✓' : ''}
                                                </span>
                                            </button>
                                        )}

                                        {PARKS.map((park) => (
                                            <button
                                                key={park.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPark(park.id);
                                                    setIsParkDropdownOpen(false);
                                                }}
                                                className={[
                                                    'w-full flex items-center justify-between px-3 py-2 text-md rounded-xl',
                                                    selectedPark === park.id ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                                                ].join(' ')}
                                            >
                                                <span>{park.name}</span>
                                                <span className="text-md text-gray-900" aria-hidden="true">
                                                    {selectedPark === park.id ? '✓' : ''}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full rounded-lg overflow-hidden border border-gray-300 shadow-md">
                        {/* Map */}
                        <div
                            ref={mapRef}
                            className="h-[520px] w-full bg-gray-100"
                            aria-label="Trail map showing issue location"
                        />

                        {/* Loading overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-30">
                                <LoadingSpinner />
                            </div>
                        )}

                        {/* Filters dropdown - multiselect */}
                        <div className="absolute top-3 right-3 z-20">
                            <IssueFilterDropdown
                                selectedTypes={selectedTypes}
                                toggleType={toggleType}
                                clear={() => setSelectedTypes([])}
                            />
                        </div>
                    </div>

                    {isDetailOpen && selectedIssueId !== null && (
                        <IssueDetailCard 
                            issueId={selectedIssueId} 
                            onClose={closeIssueDetail} 
                            onUpdated={refreshPinsForView}
                        />
                    )}
                </>
            )}
        </div>
    );
};
