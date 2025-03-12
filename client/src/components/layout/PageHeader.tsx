// src/components/layout/PageHeader.tsx
import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
    return (
        <div className="pb-5 border-b border-gray-200 mb-6 sm:flex sm:items-center sm:justify-between">
            <div>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1 text-sm text-gray-500">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div className="mt-3 sm:mt-0">{action}</div>}
        </div>
    );
};
