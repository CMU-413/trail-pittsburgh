// src/pages/issues/IssueListPage.tsx
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

const PinLegend: React.FC<{ color: string }> = ({ color }) => (
    <span
        aria-hidden="true"
        className="inline-block relative"
        style={{ width: 12, height: 18 }}
    >
        {/* head */}
        <span
	  className="absolute left-1/2"
	  style={{
                top: 0,
                width: 10,
                height: 10,
                transform: 'translateX(-50%)',
                background: color,
                borderRadius: '50%',
	  }}
        />
        {/* inner dot */}
        <span
	  className="absolute left-1/2"
	  style={{
                top: 3,
                width: 3,
                height: 3,
                transform: 'translateX(-50%)',
                background: 'white',
                borderRadius: '50%',
                opacity: 0.95,
	  }}
        />
        {/* tail */}
        <span
	  className="absolute left-1/2"
	  style={{
                top: 9,
                width: 0,
                height: 0,
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: `8px solid ${color}`,
	  }}
        />
    </span>
);

const makePinIcon = (color: string) =>
    window.L.divIcon({
        className: '',
        html: `
	  <div style="position: relative; width: 22px; height: 34px;">
		<!-- head -->
		<div style="
		  position: absolute;
		  top: 0; left: 50%;
		  width: 18px; height: 18px;
		  transform: translateX(-50%);
		  background: ${color};
		  border-radius: 50%;
		  box-shadow: 0 2px 8px rgba(0,0,0,0.35);
		"></div>

		<!-- inner dot -->
		<div style="
		  position: absolute;
		  top: 6px; left: 50%;
		  width: 6px; height: 6px;
		  transform: translateX(-50%);
		  background: white;
		  border-radius: 50%;
		  opacity: 0.95;
		"></div>

		<!-- tail -->
		<div style="
		  position: absolute;
		  top: 16px; left: 50%;
		  transform: translateX(-50%);
		  width: 0; height: 0;
		  border-left: 7px solid transparent;
		  border-right: 7px solid transparent;
		  border-top: 16px solid ${color};
		"></div>
	  </div>
	`,
        iconSize: [22, 34],
        iconAnchor: [11, 34],
    });

const iconForType = (t: IssueTypeEnum) => {
    if (t === 'OBSTRUCTION') 
    {return makePinIcon('green');}
    if (t === 'FLOODING') 
    {return makePinIcon('blue');}
    return makePinIcon('black');
};

export const IssueListPage: React.FC = () => {
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
                    // console.log("Issue clicked:", id, pin);
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
            <PageHeader
                title="Trail Issues"
                subtitle="View and manage reported trail issues"
            />

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
                    <div className="relative w-full rounded-lg overflow-hidden border border-gray-300 shadow-md md:col-span-3">
                        {/* Controls toolbar */}
                        <div className="flex flex-wrap items-center gap-3 md:gap-6 p-3 bg-white">
                            {/* Park select */}
                            <select
                                value={selectedPark}
                                onChange={(e) => setSelectedPark(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                            >
                                <option value="">Select a Park</option>
                                {PARKS.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            {/* Filters */}
                            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer rounded-md border border-gray-300 px-3 py-2 select-none">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5"
                                        checked={selectedTypes.includes(IssueTypeEnum.OBSTRUCTION)}
                                        onChange={() => toggleType(IssueTypeEnum.OBSTRUCTION)}
                                    />
                                    <span className="flex items-center gap-2">
                                        <PinLegend color="green" />
								        Obstruction
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 text-sm cursor-pointer rounded-md border border-gray-300 px-3 py-2 select-none">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5"
                                        checked={selectedTypes.includes(IssueTypeEnum.FLOODING)}
                                        onChange={() => toggleType(IssueTypeEnum.FLOODING)}
                                    />
                                    <span className="flex items-center gap-2">
                                        <PinLegend color="blue" />
							            Standing Water/Mud
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 text-sm cursor-pointer rounded-md border border-gray-300 px-3 py-2 select-none">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5"
                                        checked={selectedTypes.includes(IssueTypeEnum.OTHER)}
                                        onChange={() => toggleType(IssueTypeEnum.OTHER)}
                                    />
                                    <span className="flex items-center gap-2">
                                        <PinLegend color="black" />
								        Other
                                    </span>
                                </label>
                            </div>

                            {/* Spacer pushes clear button to the right on wide screens */}
                            <div className="w-full md:w-auto" />

                            <button
                                className="text-sm underline text-gray-600 whitespace-nowrap md:ml-auto"
                                onClick={() => setSelectedTypes([])}
                                type="button"
                            >
							Clear filters
                            </button>
                        </div>

                        {/* Map */}
                        <div
                            ref={mapRef}
                            className="h-[520px] w-full bg-gray-100"
                            aria-label="Trail map showing issue location"
                        />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                                <LoadingSpinner />
                            </div>
                        )}
                    </div>

                    {isDetailOpen && selectedIssueId !== null && (
                        <IssueDetailCard issueId={selectedIssueId} onClose={closeIssueDetail} />
                    )}
                </>
            )}
        </div>
    );
};
