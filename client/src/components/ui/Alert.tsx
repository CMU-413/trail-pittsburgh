// src/components/ui/Alert.tsx
import React from 'react';

type AlertVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info';

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    className?: string;
    onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
    variant = 'primary',
    title,
    children,
    className = '',
    onDismiss
}) => {
    const variantClasses = {
        primary: 'bg-blue-50 text-blue-700 border-blue-400',
        success: 'bg-green-50 text-green-700 border-green-400',
        danger: 'bg-red-50 text-red-700 border-red-400',
        warning: 'bg-yellow-50 text-yellow-700 border-yellow-400',
        info: 'bg-cyan-50 text-cyan-700 border-cyan-400'
    };
    
    return (
        <div className={`rounded-md p-4 border-l-4 ${variantClasses[variant]} ${className}`} role="alert">
            <div className="flex">
                <div className="flex-grow">
                    {title && <h3 className="text-sm font-medium">{title}</h3>}
                    <div className="text-sm">{children}</div>
                </div>
                {onDismiss && (
                    <button
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        onClick={onDismiss}
                    >
                        <span className="sr-only">Dismiss</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};