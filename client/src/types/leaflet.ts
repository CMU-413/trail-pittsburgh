// src/types/leaflet.ts

export interface LeafletMap {
    setView: (center: [number, number], zoom: number) => LeafletMap;
    on: (event: string, handler: (e: LeafletMouseEvent) => void) => LeafletMap;
    remove: () => void;
}

export interface LeafletMouseEvent {
    latlng: { latitude: number; lng: number };
}

export interface LeafletMarkerDragEvent {
    target: {
        getLatLng: () => { latitude: number; lng: number };
    };
}

export interface LeafletMarker {
    addTo: (map: LeafletMap) => LeafletMarker;
    on: (event: string, handler: (e: LeafletMarkerDragEvent) => void) => LeafletMarker;
    remove: () => void;
}

export interface LeafletCircle {
    addTo: (map: LeafletMap) => LeafletCircle;
    remove: () => void;
}

export interface LeafletTileLayer {
    addTo: (map: LeafletMap) => LeafletTileLayer;
}

export interface LeafletStatic {
    map: (container: HTMLElement) => LeafletMap;
    tileLayer: (url: string, options: Record<string, unknown>) => LeafletTileLayer;
    marker: (latlng: [number, number], options: Record<string, unknown>) => LeafletMarker;
    circle: (latlng: [number, number], options: Record<string, unknown>) => LeafletCircle;
}

// Extend the Window interface to include Leaflet
declare global {
    interface Window {
        L: LeafletStatic;
    }
}
