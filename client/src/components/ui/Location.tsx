// src/components/ui/Location.tsx
import React, {
    useState, useEffect, useRef, useCallback
} from 'react';
import { Button } from './Button';
import { Alert } from './Alert';
import {
    LeafletMap,
    LeafletMarker,
    LeafletCircle,
    LeafletMouseEvent,
    LeafletMarkerDragEvent
} from '../../types/leaflet';

interface LocationProps {
    onLocationSelected?: (lat: number, lon: number) => void;
    initialLat?: number;
    initialLon?: number;
    readOnly?: boolean;
    className?: string;
    variant?: 'card' | 'plain';
}

const Location: React.FC<LocationProps> = ({
    onLocationSelected,
    initialLat,
    initialLon,
    readOnly = false, // Default to editing mode
    className = '',
    variant = 'card' // Default to card appearance
}) => {
    const [lat, setLat] = useState<number | null>(initialLat || null);
    const [lon, setLon] = useState<number | null>(initialLon || null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<LeafletMap | null>(null);
    const marker = useRef<LeafletMarker | null>(null);
    const accuracyCircle = useRef<LeafletCircle | null>(null);

    // Define updateMarker with useCallback
    const updateMarker = useCallback((latitude: number, longitude: number, accuracy?: number | null) => {
        if (!leafletMap.current) { return; }

        // Remove existing marker if it exists
        if (marker.current) {
            marker.current.remove();
        }

        // Create a marker - make it draggable only if not in readOnly mode
        marker.current = window.L.marker([latitude, longitude], {
            draggable: !readOnly // Allow dragging only if not readOnly
        }).addTo(leafletMap.current);

        // Update marker position when dragged (only if not readOnly)
        if (!readOnly) {
            marker.current.on('dragend', (e: LeafletMarkerDragEvent) => {
                const newPos = e.target.getLatLng();
                setLat(newPos.lat);
                setLon(newPos.lng);
                if (onLocationSelected) {
                    onLocationSelected(newPos.lat, newPos.lng);
                }
            });
        }

        // Add or update accuracy circle
        if (accuracy && accuracy > 0) {
            if (accuracyCircle.current) {
                accuracyCircle.current.remove();
            }
            accuracyCircle.current = window.L.circle([latitude, longitude], {
                radius: accuracy,
                fillColor: '#3b82f6',
                fillOpacity: 0.15,
                color: '#3b82f6',
                opacity: 0.4,
                weight: 1
            }).addTo(leafletMap.current);
        }
    }, [readOnly, onLocationSelected]);

    // Initialize map when Leaflet is loaded and coordinates are available
    const initializeMap = useCallback(() => {
        if ((!lat || !lon) && !(readOnly && initialLat && initialLon)) { return; }
        if (!mapRef.current || leafletMap.current) { return; }

        // Use initialLat/Lon if in readOnly mode and we don't have lat/lon yet
        const latitude = lat || (readOnly ? initialLat : null);
        const longitude = lon || (readOnly ? initialLon : null);

        if (!latitude || !longitude) { return; }

        // Create the map
        leafletMap.current = window.L.map(mapRef.current).setView([latitude, longitude], 16);

        // Add base map underneath
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 22,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(leafletMap.current);

        // Click handler for the map (only if not readOnly)
        if (!readOnly) {
            leafletMap.current.on('click', (e: LeafletMouseEvent) => {
                const { lat: newLat, lng: newLon } = e.latlng;
                updateMarker(newLat, newLon);
                setLat(newLat);
                setLon(newLon);
                if (onLocationSelected) {
                    onLocationSelected(newLat, newLon);
                }
            });
        }

        // Add initial marker
        updateMarker(latitude, longitude, locationAccuracy);
    }, [lat, lon, readOnly, initialLat, initialLon, locationAccuracy, onLocationSelected, updateMarker]);

    // Load Leaflet scripts when location is shared or when in readOnly mode with initial coordinates
    useEffect(() => {
        // Initialize map immediately if we have coordinates and in readOnly mode
        // or if coordinates were obtained from user location sharing
        if ((!lat || !lon) && !(readOnly && initialLat && initialLon)) { return; }

        if (typeof window.L === 'undefined') {
            const loadLeaflet = async () => {
                // Load Leaflet CSS
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(cssLink);

                // Load Leaflet JS
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.async = true;

                script.onload = () => {
                    initializeMap();
                };

                document.body.appendChild(script);
            };

            loadLeaflet();
        } else {
            initializeMap();
        }
    }, [lat, lon, readOnly, initialLat, initialLon, initializeMap]);

    // Update marker position when lat/lon changes
    useEffect(() => {
        if (!leafletMap.current) { return; }

        const latitude = lat || (readOnly ? initialLat : null);
        const longitude = lon || (readOnly ? initialLon : null);

        if (latitude && longitude) {
            updateMarker(latitude, longitude, locationAccuracy);
        }
    }, [lat, lon, locationAccuracy, readOnly, initialLat, initialLon, updateMarker]);

    // Clean up map on unmount
    useEffect(() => {
        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }
        };
    }, []);

    // Request user's location
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLon(position.coords.longitude);
                setLocationAccuracy(position.coords.accuracy);
                if (onLocationSelected) {
                    onLocationSelected(position.coords.latitude, position.coords.longitude);
                }
                setLoading(false);
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';

                switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access was denied. To report an accurate location, please allow location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable. Please try again later.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'The request to get your location timed out. Please try again.';
                    break;
                default:
                    errorMessage = `An unknown error occurred: ${error.message}`;
                }

                setError(errorMessage);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // Set latitude and longitude from initial values if in readOnly mode
    useEffect(() => {
        if (readOnly && initialLat && initialLon && !lat && !lon) {
            setLat(initialLat);
            setLon(initialLon);
        }
    }, [readOnly, initialLat, initialLon, lat, lon]);

    // Prepare content based on state and props
    const contentJSX = (
        <>
            {!readOnly && (
                <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Location</h3>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-600">
                                Providing the exact location helps us find and fix the issue more quickly. Your location data will only be used for this issue report.
                            </p>

                            <Button
                                variant="primary"
                                size="md"
                                onClick={getCurrentLocation}
                                isLoading={loading}
                                className="self-start mt-2 mb-2 px-4"
                            >
                                {lat && lon ? 'Update My Location' : 'Share My Location'}
                            </Button>
                        </div>

                        {error && (
                            <Alert variant="danger" onDismiss={() => setError(null)}>
                                {error}
                            </Alert>
                        )}
                    </div>
                </>
            )}

            {/* Only show map after coordinates are shared or if in readOnly mode with coords */}
            {((lat && lon) || (readOnly && initialLat && initialLon)) && (
                <>
                    {/* Map container */}
                    <div className="rounded-lg overflow-hidden border border-gray-300 shadow-md">
                        <div
                            ref={mapRef}
                            className="h-64 w-full bg-gray-100"
                            aria-label="Trail map showing issue location"
                        ></div>
                    </div>

                    {/* Coordinates display */}
                    <div className="flex flex-col space-y-2 mt-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm text-gray-700 break-words">
                                Coordinates: <span className="font-medium">{(lat || initialLat)?.toFixed(6)}, {(lon || initialLon)?.toFixed(6)}</span>
                            </p>
                        </div>
                        {locationAccuracy && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full self-start sm:self-auto inline-block">
                                Accuracy: ±{Math.round(locationAccuracy)}m
                            </span>
                        )}
                    </div>

                    {!readOnly && (
                        <p className="text-xs text-gray-500 mt-1">
                            Click anywhere on the map to adjust the location, or drag the marker to fine-tune the position.
                        </p>
                    )}
                </>
            )}

            {!readOnly && !lat && !lon && !loading && !error && (
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                    Click "Share My Location" to mark the location of the trail issue on the map.
                </div>
            )}
        </>
    );

    // Render based on variant
    if (variant === 'card') {
        return (
            <div className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 ${className}`}>
                {contentJSX}
            </div>
        );
    } else {
        // Plain variant - no card styling, just the content
        return (
            <div className={className}>
                {contentJSX}
            </div>
        );
    }
};

export default Location;
