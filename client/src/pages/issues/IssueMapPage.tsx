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
import { Link } from 'react-router-dom';
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
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<LeafletMap | null>(null);
    const issueMarkersRef = useRef<LeafletMarker[]>([]);

    const [selectedPark, setSelectedPark] = useState<string>('');
    const [selectedTypes, setSelectedTypes] = useState<IssueTypeEnum[]>([]);
    const selectedTypesRef = useRef<IssueTypeEnum[]>([]);
    const [isLoading, setIsLoading] = useState(true); const [error, setError] = useState<string | null>(null);
    const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const clearIssueMarkers = () => {
        issueMarkersRef.current.forEach((m) => m.remove());
        issueMarkersRef.current = [];
    };

    const openIssueDetail = (id: number) => {
        setSelectedIssueId(id);
        setIsDetailOpen(true);
    };

    const closeIssueDetail = () => {
        setIsDetailOpen(false);
        setSelectedIssueId(null);
    };

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

        const park = PARKS.find((p) => p.id === selectedPark);
        if (!park) {return;}

        const bounds: [[number, number], [number, number]] = [park.bounds.sw, park.bounds.ne];
        leafletMap.current.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
    }, [selectedPark]);

    useEffect(() => {
        selectedTypesRef.current = selectedTypes;
        refreshPinsForView();
    }, [selectedTypes]);
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
                            <label className="text-sm font-medium text-gray-700">Select Park:</label>
                            <select
                                value={selectedPark}
                                onChange={(e) => setSelectedPark(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                            >
                                <option value="">Current Location</option>
                                {PARKS.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
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
