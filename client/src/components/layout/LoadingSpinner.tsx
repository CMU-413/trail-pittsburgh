// src/components/layout/LoadingSpinner.tsx
import React from 'react';
import { Spinner } from '../ui/Spinner';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
};
