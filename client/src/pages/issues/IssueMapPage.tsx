// src/pages/issues/IssueMapPage.tsx
import React, {
    useState, useEffect, useRef, useCallback
} from 'react';

import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';

import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';

import { LeafletMap, LeafletMarker } from '../../types/leaflet';
import {
    IssueStatusEnum, IssueTypeEnum, 
    Park
} from '../../types';
import { 
    Link, useLocation, useNavigate
} from 'react-router-dom';
import { IssueFilterDropdown, PinLegend } from './IssueFilterDropdown';
import { iconForType, iconForCurrentLocation } from './issuePinIcons';
import { issueApi, parkApi } from '../../services/api';

type NearByIssueCard = {
	issueType: IssueTypeEnum;
	park: string;
	status: IssueStatusEnum;
	latitude: number;
	longitude: number;
	distance: number;
}

type LocationPreference = 'unknown' | 'allow' | 'deny';

const LOCATION_PREF_KEY = 'issue-map-location-preference';
const DEFAULT_PARK_NAME = 'Alameda Park';

const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

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

const googleMapsDirectionsUrl = (
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
): string => {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=walking`;
};

const formatMiles = (miles: number): string => `${miles.toFixed(1)} mi`;

const issueTypeLabel = (type: IssueTypeEnum): string =>
    type
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

export const IssueMapPage: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<LeafletMap | null>(null);
    const issueMarkersRef = useRef<LeafletMarker[]>([]);
    const parkDropdownRef = useRef<HTMLDivElement>(null);

    const [parks, setParks] = useState<Park[]>([]);
    const [selectedPark, setSelectedPark] = useState<string | null>(null);
    const [locationPreference, setLocationPreference] = useState<LocationPreference>('unknown');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [nearbyIssues, setNearbyIssues] = useState<NearByIssueCard[]>([]);
    const [isNearbyIssuesMinimized, setIsNearbyIssuesMinimized] = useState(true);
    const [isNearbyIssuesLoading, setIsNearbyIssuesLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
    const [isParkDropdownOpen, setIsParkDropdownOpen] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<IssueTypeEnum[]>([]);
    const selectedTypesRef = useRef<IssueTypeEnum[]>([]);
    const [isLoading, setIsLoading] = useState(true); const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const clearIssueMarkers = useCallback(() => {
        issueMarkersRef.current.forEach((m) => m.remove());
        issueMarkersRef.current = [];
    }, []);

    const openIssueDetail = useCallback((id: number) => {
        navigate(`/issues/card/${id}`, {
			 state: {
                backgroundLocation: {
                    pathname: location.pathname,
                    search: location.search,
                    hash: location.hash
                }
            }
        });
    }, [navigate, location]);

    const refreshPinsForView = useCallback(async () => {
        if (!leafletMap.current || typeof window.L === 'undefined') {return;}

        setIsLoading(true);
        setError(null);

        try {
            const bounds = leafletMap.current.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();

            clearIssueMarkers();

            const pins = await issueApi.getMapPins(sw.lat, sw.lng, ne.lat, ne.lng, selectedTypesRef.current);

            for (const pin of pins) {
                if (typeof pin.latitude !== 'number' || typeof pin.longitude !== 'number') {continue;}

                const marker = window.L
                    .marker([pin.latitude, pin.longitude], { icon: iconForType(pin.issueType) })
                    .addTo(leafletMap.current);

                marker.on('click', () => openIssueDetail(pin.issueId));
                issueMarkersRef.current.push(marker);
            }

            if (currentLocation) {
                const { latitude, longitude } = currentLocation;
                window.L.marker([latitude, longitude], { icon: iconForCurrentLocation() })
                    .addTo(leafletMap.current);
        	}
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error fetching issues:', err);
            setError('Failed to load issues. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [clearIssueMarkers, openIssueDetail, currentLocation]);

    const applyFallbackView = useCallback(() => {
        if (!leafletMap.current) {
            return;
        }

        const fallbackPark = parks.find((p) => p.name === DEFAULT_PARK_NAME);
		
        if (!fallbackPark) {
            leafletMap.current.setView([40.4406, -79.9959], 12); // Pittsburgh center as ultimate fallback
            return;
        }
		
        if (typeof fallbackPark.minLatitude === 'number' &&
			typeof fallbackPark.minLongitude === 'number' &&
			typeof fallbackPark.maxLatitude === 'number' &&
			typeof fallbackPark.maxLongitude === 'number'
        ) {
            const bounds: [[number, number], [number, number]] = [
                [fallbackPark.minLatitude, fallbackPark.minLongitude],
                [fallbackPark.maxLatitude, fallbackPark.maxLongitude]
            ];
            leafletMap.current.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
            setSelectedPark(fallbackPark.name);
	   }
    }, []);

    const centerMapOnCurrentLocation = useCallback((fromModal = false) => {
        if (!leafletMap.current || !navigator.geolocation) {
            setLocationError('Your browser blocks location access.');
            return;
        }
        setLocationError(null);

   		navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
                leafletMap.current?.setView([latitude, longitude], 14);
                setSelectedPark(null);
                setLocationPreference('allow');

                if (fromModal)
               		{setShowLocationModal(false);}
				
                refreshPinsForView();
            },
            (error) => {
                // eslint-disable-next-line no-console
                console.error('Geolocation error:', error);
                if (error.code === 1) {
                    setLocationError('Location access is blocked in your browser. Please enable location permission in your browser settings and try again.');
                } else if (error.code === 2) {
                    setLocationError('Your location could not be determined right now. Please try again.');
                } else if (error.code === 3) {
                    setLocationError('Location request timed out. Please try again.');
                } else {
                    setLocationError('Unable to access your location right now.');
                }

                applyFallbackView();
                refreshPinsForView();
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    }, [applyFallbackView, refreshPinsForView]);

    const handleAllowOnceLocation = useCallback(() => {
        sessionStorage.setItem(LOCATION_PREF_KEY, 'allow');
        centerMapOnCurrentLocation(true);
    }, [centerMapOnCurrentLocation]);

    const handleNotNowLocation = useCallback(() => {
        sessionStorage.setItem(LOCATION_PREF_KEY, 'deny');
        setLocationPreference('deny');
        setLocationError(null);
        setShowLocationModal(false);
    }, []);

    const handleAlwaysAllowLocation = useCallback(() => {
        localStorage.setItem(LOCATION_PREF_KEY, 'allow');
        centerMapOnCurrentLocation(true);
    }, [centerMapOnCurrentLocation]);

    const getNearbyIssues = useCallback(async (): Promise<NearByIssueCard[]>=> {
        if (!currentLocation)
        	{return [];}

        const deltaLat = 0.015;
        const deltaLng = 0.015;

        const minLat = currentLocation.latitude - deltaLat;
        const maxLat = currentLocation.latitude + deltaLat;
        const minLng = currentLocation.longitude - deltaLng;
        const maxLng = currentLocation.longitude + deltaLng;

        const pins = await issueApi.getMapPins(minLat, minLng, maxLat, maxLng, selectedTypesRef.current);
	    
        const nearbyIssues = await Promise.all(
            pins.map(async (pin) => {
                const res = await issueApi.getIssue(pin.issueId);
                return {
                    issueType: res.issueType,
                    park: res.park?.name ?? 'Unknown Park',
                    status: res.status,
                    latitude: pin.latitude,
                    longitude: pin.longitude,
                    distance: distanceInMiles(
                        currentLocation.latitude,
                        currentLocation.longitude,
                        pin.latitude,
                        pin.longitude
                    ),
                };
            })
        );

        nearbyIssues.sort((a, b) => a.distance - b.distance);
        return nearbyIssues;
    },[currentLocation]);

    const toggleType = (t: IssueTypeEnum) => {
        setSelectedTypes((prev) =>
            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
    };

    useEffect(() => {
        if (locationPreference === 'deny' && parks.length > 0) {
            const fallbackPark = parks.find((p) => p.name === DEFAULT_PARK_NAME);

            if (fallbackPark &&
				typeof fallbackPark.minLatitude === 'number' &&
				typeof fallbackPark.minLongitude === 'number' &&
				typeof fallbackPark.maxLatitude === 'number' &&
				typeof fallbackPark.maxLongitude === 'number') {
                setSelectedPark(fallbackPark.name);

                const bounds: [[number, number], [number, number]] = [
                    [fallbackPark.minLatitude, fallbackPark.minLongitude],
                    [fallbackPark.maxLatitude, fallbackPark.maxLongitude]
                ];

                leafletMap.current?.fitBounds(bounds, {
                    padding: [20, 20],
                    maxZoom: 15
                });
            }
        }
    }, [locationPreference, parks]);
		
    useEffect(() => { 
        const fetchParks = async () => {
            try {
                const parksData = await parkApi.getAllParks();
                setParks(parksData.filter((p) => p.isActive));
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching parks:', err);
                setError('Failed to load parks. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchParks();
    }, []);

    useEffect(() => {
        if (locationPreference === 'deny' && parks.length > 0) {
            const fallbackPark = parks.find((p) => p.name === DEFAULT_PARK_NAME);

            if (fallbackPark &&
				typeof fallbackPark.minLatitude === 'number' &&
				typeof fallbackPark.minLongitude === 'number' &&
				typeof fallbackPark.maxLatitude === 'number' &&
				typeof fallbackPark.maxLongitude === 'number') {
                setSelectedPark(fallbackPark.name);

                const bounds: [[number, number], [number, number]] = [
                    [fallbackPark.minLatitude, fallbackPark.minLongitude],
                    [fallbackPark.maxLatitude, fallbackPark.maxLongitude]
                ];

                leafletMap.current?.fitBounds(bounds, {
                    padding: [20, 20],
                    maxZoom: 15
                });
            }
        }
    }, [locationPreference, parks]);
		
    useEffect(() => { 
        const fetchParks = async () => {
            try {
                const parksData = await parkApi.getAllParks();
                setParks(parksData.filter((p) => p.isActive));
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching parks:', err);
                setError('Failed to load parks. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchParks();
    }, []);

    useEffect(() => {
        if (!mapRef.current || leafletMap.current)
        {return;}

        leafletMap.current = window.L.map(mapRef.current!).setView([40.4406, -79.9959], 12 );;
		
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 22,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(leafletMap.current!);
        leafletMap.current.on('moveend', refreshPinsForView);

        const savedPreference =
			(sessionStorage.getItem(LOCATION_PREF_KEY) ??
			localStorage.getItem(LOCATION_PREF_KEY)) as LocationPreference | null;
		
        if (savedPreference === 'allow') {
            setLocationPreference('allow');
            centerMapOnCurrentLocation();
        } else if (savedPreference === 'deny') {
            setLocationPreference('deny');
            applyFallbackView();
            refreshPinsForView();
        } else {
            setLocationPreference('unknown');
            setShowLocationModal(true);
            applyFallbackView();
            refreshPinsForView();
        }
	
        return () => {
            leafletMap.current?.remove();
            leafletMap.current = null;
        };
    }, []);
	
    useEffect(() => {
        if (!leafletMap.current || !selectedPark) 
        	{return;}

        const park = parks.find((p) => p.name === selectedPark);
        if (!park)
        {return;}

        if (typeof park.minLatitude === 'number' &&
			typeof park.minLongitude === 'number' &&
			typeof park.maxLatitude === 'number' &&
			typeof park.maxLongitude === 'number'
        ) {
            const bounds: [[number, number], [number, number]] = 
				[[park.minLatitude, park.minLongitude],
				    [park.maxLatitude, park.maxLongitude]
				];
            leafletMap.current.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
        }
    }, [selectedPark]);
     
    useEffect(() => {
        selectedTypesRef.current = selectedTypes;
        refreshPinsForView();
    }, [selectedTypes, refreshPinsForView]);

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
	
    const selectedParkName = selectedPark
        ? (parks.find((park) => park.name === selectedPark)?.name ?? 'Current Location')
        : 'Current Location';
    
    const shouldShowNearbyIssues = locationPreference === 'allow' && selectedPark === null;

    useEffect(() => {
        if (!shouldShowNearbyIssues || !currentLocation) {
            setNearbyIssues([]);
            return;
        }

        const loadNearbyIssues = async () => {
            try {
                setIsNearbyIssuesLoading(true);
                const issues = await getNearbyIssues();
                setNearbyIssues(issues);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error loading nearby issues:', err);
                setNearbyIssues([]);
            } finally {
                setIsNearbyIssuesLoading(false);
            }
        };

        loadNearbyIssues();
    }, [shouldShowNearbyIssues, currentLocation, getNearbyIssues]);

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
							
                            <label className="text-lg font-medium text-gray-900">Select a Park:</label>

                            <div ref={parkDropdownRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsParkDropdownOpen((open) => !open)}
                                    className="min-w-[270px] bg-white border border-gray-300 rounded-full px-4 py-2 text-md font-medium text-gray-900 shadow-sm flex items-center justify-between gap-2"
                                >
                                    <span>{selectedParkName}</span>
                                    <span className="text-black text-xl leading-none">▾</span>
                                </button>

                                {isParkDropdownOpen && (
                                    <div className="absolute left-0 mt-2 w-full min-w-[260px] bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-30">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsParkDropdownOpen(false);
                                                if (locationPreference !== 'deny') {
                                                    centerMapOnCurrentLocation(false);
                                                }
                                            }}
                                            className={[
                                                'w-full flex items-center justify-between px-3 py-2 text-md rounded-xl',
                                                selectedPark === null
                                                    ? 'bg-gray-100 text-gray-900 font-semibold'
                                                    : 'text-gray-700 hover:bg-gray-50',
                                            ].join(' ')}
                                        >
                                            <span className="flex-1 text-left">Current Location</span>
                                            <span className="text-md text-gray-900" aria-hidden="true">
                                                {selectedPark === null ? '✓' : ''}
                                            </span>
                                        </button>
                                        {parks.map((park) => (
                                            <button
                                                key={park.name}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPark(park.name);
                                                    setLocationError(null);
                                                    setIsParkDropdownOpen(false);
                                                }}
                                                className={[
                                                    'w-full flex items-center justify-between px-3 py-2 text-md rounded-xl',
                                                    selectedPark === park.name ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                                                ].join(' ')}
                                            >
                                                <span className="flex-1 text-left">{park.name}</span>
                                                <span className="text-md text-gray-900" aria-hidden="true">
                                                    {selectedPark === park.name ? '✓' : ''}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {locationError && !showLocationModal && (
                        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {locationError}
                        </div>
                    )}

                    <div className="relative w-full rounded-lg overflow-hidden border border-gray-300 shadow-md">
                        {/* Map */}
                        <div
                            ref={mapRef}
                            className="h-[520px] w-full bg-gray-100"
                            aria-label="Trail map showing issue location"
                        />

                        {shouldShowNearbyIssues && currentLocation && (
                            <div className="absolute left-3 bottom-3 z-20 w-[320px] max-w-[calc(100%-24px)] rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Nearby Issues</h3>

                                    <button
                                        type="button"
                                        onClick={() => setIsNearbyIssuesMinimized((prev) => !prev)}
                                        className="text-2xl leading-none text-gray-500 hover:text-gray-700"
                                        aria-label={isNearbyIssuesMinimized ? 'Expand nearby issues' : 'Minimize nearby issues'}
                                    >
                                        {isNearbyIssuesMinimized ? '+' : '−'}
                                    </button>
                                </div>

                                {!isNearbyIssuesMinimized && (
                                    <div className="max-h-[320px] overflow-y-auto">
                                        {isNearbyIssuesLoading ? (
                                            <div className="px-4 py-4 text-sm text-gray-500">
												Loading nearby issues...
                                            </div>
                                        ) : nearbyIssues.length === 0 ? (
                                            <div className="px-4 py-4 text-sm text-gray-500">
												No nearby issues found.
                                            </div>
                                        ) : (
                                            nearbyIssues.map((issue, index) => (
                                                <div
                                                    key={`${issue.park}-${issue.issueType}-${index}`}
                                                    className={[
                                                        'px-4 py-4',
                                                        index !== nearbyIssues.length - 1 ? 'border-b border-gray-200' : '',
                                                    ].join(' ')}
                                                >																								
                                                    <div className="flex items-start justify-between gap-4">

                                                        {/* LEFT SIDE */}
                                                        <div className="min-w-0">
                                                            <div className="text-base font-medium text-gray-900">
                                                                <PinLegend
                                                                    type={issue.issueType}
                                                                    label={issueTypeLabel(issue.issueType)}
                                                                />
                                                            </div>

                                                            <div className="mt-1 text-sm text-gray-600">
                                                                {issue.park} • {issue.status}
                                                            </div>
                                                        </div>

                                                        {/* RIGHT SIDE */}
                                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                                            <div className="text-sm text-gray-600">
                                                                {formatMiles(issue.distance)}
                                                            </div>

                                                            <a
                                                                href={googleMapsDirectionsUrl(
																currentLocation!.latitude,
																currentLocation!.longitude,
																issue.latitude,
																issue.longitude
                                                                )}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex items-center gap-1 rounded-xl bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                                                            >
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
																Directions
                                                            </a>
                                                        </div>

                                                    </div>
                                                </div>
                                            )))}
                                    </div>
                                )}
                            </div>
                        )}

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
                </>
            )}

            {showLocationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
							Trail Pittsburgh wants to access your current location
                        </h2>

                        {locationError && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {locationError}
                            </div>
                        )}

                        <div className="flex flex-col justify-center gap-3">
                            <Button variant="secondary" onClick={handleNotNowLocation}>
								Not Now
                            </Button>
                            <Button variant="secondary" onClick={handleAllowOnceLocation}>
								Allow Once
                            </Button>
                            <Button variant="primary" onClick={handleAlwaysAllowLocation}>
								Always Allow
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
