// src/components/ui/ImageUpload.tsx
import React, { useState } from 'react';

interface ImageUploadProps {
    label?: string;
    onChange: (file: File | null, previewUrl: string | null) => void;
    existingImageUrl?: string;
    error?: string;
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    label = 'Upload Image',
    onChange,
    existingImageUrl,
    error,
    className = ''
}) => {
    const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const filePreview = URL.createObjectURL(file);
            setPreview(filePreview);
            onChange(file, filePreview);
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
            const filePreview = URL.createObjectURL(file);
            setPreview(filePreview);
            onChange(file, filePreview);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onChange(null, null);
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
                    transition-colors cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {!preview ? (
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
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                            className="absolute -top-3 -right-3 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none"
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
