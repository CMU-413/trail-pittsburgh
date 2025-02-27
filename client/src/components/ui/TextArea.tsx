// src/components/ui/TextArea.tsx
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
    label,
    error,
    helperText,
    fullWidth = false,
    className = '',
    id,
    rows = 4,
    ...props
}) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
        <div className={`${widthClass} ${className}`}>
            {label && (
                <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative rounded-md shadow-sm">
                <textarea
                    id={textareaId}
                    rows={rows}
                    className={`block w-full rounded-md py-2 px-3 transition-colors duration-200 ease-in-out sm:text-sm
                    ${error 
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-description` : undefined}
                    {...props}
                />
            </div>
            
            {error ? (
                <p className="mt-2 text-sm text-red-600" id={`${textareaId}-error`}>
                    {error}
                </p>
            ) : helperText ? (
                <p className="mt-2 text-sm text-gray-500" id={`${textareaId}-description`}>
                    {helperText}
                </p>
            ) : null}
        </div>
    );
};
