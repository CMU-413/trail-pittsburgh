// src/components/ui/ImageUpload.tsx
import React, { useState, useRef } from 'react';
import heic2any from 'heic2any';
import exifr from 'exifr';
import { ImageMetadata } from '../../types';

interface ImageUploadProps {
    label?: string;
    onChange: (file: File | null, previewUrl: string | null, metadata?: ImageMetadata) => void;
    existingImageUrl?: string;
    existingMetadata?: ImageMetadata;
    error?: string;
    className?: string;
    acceptedFormats?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    label = 'Upload Image',
    onChange,
    existingImageUrl,
    existingMetadata,
    error,
    className = '',
    acceptedFormats = 'image/jpeg,image/png,image/gif,image/heic,image/heif'
}) => {
    const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [/* metadata - unused but kept for future use */, setMetadata] = useState<ImageMetadata | undefined>(existingMetadata);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        setIsProcessing(true);
        try {
            let processedFile = file;
            let extractedMetadata: ImageMetadata = {};

            // Try to extract metadata from original file first (before any conversion)
            try {
                // Specify the return type of exifr.parse
                const originalMetadata = await exifr.parse(file, {
                    gps: true,
                    tiff: true,
                    exif: true,
                    translateKeys: true,
                    translateValues: true,
                    reviveValues: true
                }) as ImageMetadata;

                if (originalMetadata) {
                    // Keep original GPS coordinates as they are
                    extractedMetadata = originalMetadata;
                }
            } catch (metadataError) {
                // eslint-disable-next-line no-console
                console.error('Error extracting initial metadata:', metadataError);
            }

            // Handle HEIC/HEIF conversion
            if (file.type === 'image/heic' || file.type === 'image/heif' ||
                file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
                try {
                    // Convert HEIC to JPEG Blob
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: 0.8
                    }) as Blob;

                    // Create a new File from the converted Blob
                    processedFile = new File(
                        [convertedBlob],
                        file.name.replace(/\.(heic|heif)$/i, '.jpg'),
                        { type: 'image/jpeg' }
                    );

                    // If no metadata was extracted from original, try from converted
                    if (Object.keys(extractedMetadata).length === 0) {
                        try {
                            const convertedMetadata = await exifr.parse(processedFile) as ImageMetadata;

                            if (convertedMetadata) {
                                // Keep the original metadata as is
                                extractedMetadata = convertedMetadata;
                            }
                        } catch (err) {
                            // eslint-disable-next-line no-console
                            console.error('Error extracting metadata from converted file:', err);
                        }
                    }
                } catch (conversionError) {
                    // eslint-disable-next-line no-console
                    console.error('Error converting HEIC/HEIF image:', conversionError);
                }
            }

            // Create preview URL
            const filePreview = URL.createObjectURL(processedFile);
            setPreview(filePreview);
            setMetadata(extractedMetadata);

            onChange(processedFile, filePreview, extractedMetadata);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error processing image:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            processFile(file);
        }
    };

    const removeImage = () => {
        setPreview(null);
        setMetadata(undefined);
        onChange(null, null, undefined);

        // Reset the file input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={`${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md 
            ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
            ${error ? 'border-red-300' : ''}
            ${isProcessing ? 'opacity-70' : ''}
            transition-colors cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isProcessing ? (
                    <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Processing image...</p>
                    </div>
                ) : !preview ? (
                    <div className="space-y-1 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                                <span>Upload a file</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept={acceptedFormats}
                                    onChange={handleFileChange}
                                    ref={inputRef}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF, HEIC up to 10MB</p>
                    </div>
                ) : (
                    <div className="relative w-full">
                        <img
                            src={preview}
                            alt="Preview"
                            className="mx-auto max-h-64 rounded-md"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-3 -right-3 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none hover:cursor-pointer"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="sr-only">Remove image</span>
                        </button>
                    </div>
                )}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};
