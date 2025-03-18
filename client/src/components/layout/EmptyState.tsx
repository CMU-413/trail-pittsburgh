// src/components/layout/EmptyState.tsx
import React from 'react';

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    action,
    icon
}) => {
    return (
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
            {icon && <div className="flex justify-center mb-4">{icon}</div>}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
};
