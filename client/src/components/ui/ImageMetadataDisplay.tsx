// src/components/ui/ImageMetadataDisplay.tsx
import React, { useState } from 'react';
import { ImageMetadata } from '../../types';

interface ImageMetadataDisplayProps {
    metadata: ImageMetadata;
    className?: string;
}

export const ImageMetadataDisplay: React.FC<ImageMetadataDisplayProps> = ({
    metadata,
    className = '',
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Validation for metadata
    const hasMetadata = metadata && typeof metadata === 'object' && Object.keys(metadata).length > 0;

    // Format the date if it exists
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    };

    // Define only the essential metadata fields for trail issues
    const essentialMetadataKeys = [
        'DateTimeOriginal'
    ];

    // Filter metadata to only include essential fields
    const filteredMetadata = Object.entries(metadata || {}).filter(([key]) =>
        essentialMetadataKeys.includes(key));

    // Get user-friendly names for metadata fields
    const getFriendlyName = (key: string): string => {
        const nameMap: Record<string, string> = {
            DateTimeOriginal: 'Date Taken',
        };
        return nameMap[key] || key;
    };

    // Format values appropriately
    const formatValue = (key: string, value: string | number | boolean | undefined): string => {
        // Handle undefined values
        if (value === undefined) {
            return '';
        }

        if (key === 'DateTimeOriginal' && typeof value === 'string') {
            return formatDate(value);
        }
        return String(value);
    };

    // Check if we have coordinates
    const hasCoordinates = metadata?.latitude !== undefined && metadata?.longitude !== undefined;

    // Get coordinates string
    const getCoordinatesString = () => {
        if (hasCoordinates) {
            const latitude = metadata.latitude!.toFixed(6);
            const longitude = metadata.longitude!.toFixed(6);
            return `${latitude},${longitude}`;
        }
        return '';
    };

    // If no relevant metadata is available at all, show a message
    if (!hasMetadata && !hasCoordinates) {
        return null;
    }

    // If no relevant metadata is available for display but component is rendered, show message
    if (filteredMetadata.length === 0 && !hasCoordinates) {
        return (
            <div className={`bg-gray-50 rounded-lg p-3 text-sm ${className}`}>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">No image metadata available</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-lg overflow-hidden transition-all duration-300 ${className}`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 text-sm border border-gray-200 rounded-lg transition-colors cursor-pointer"
            >
                <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-700">Image Metadata</span>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg p-4 text-sm shadow-sm">
                    <div className="space-y-3">
                        {filteredMetadata.length > 0 ? (
                            filteredMetadata.map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="text-gray-600 font-medium">{getFriendlyName(key)}:</span>
                                    <span className="text-gray-900 ml-4">{formatValue(key, value)}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No detailed photo information available</p>
                        )}

                        {hasCoordinates && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">Latitude:</span>
                                    <span className="text-gray-900 ml-4">{metadata.latitude!.toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">Longitude:</span>
                                    <span className="text-gray-900 ml-4">{metadata.longitude!.toFixed(6)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {hasCoordinates && (
                        <div className="mt-3">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${getCoordinatesString()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                View Location on Map
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
