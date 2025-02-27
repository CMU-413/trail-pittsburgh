// src/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    fullWidth = false,
    className = '',
    id,
    leadingIcon,
    trailingIcon,
    ...props
}) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
        <div className={`${widthClass} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            
            <div className="relative rounded-md shadow-sm">
                {leadingIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{leadingIcon}</span>
                    </div>
                )}
                
                <input
                    id={inputId}
                    className={`block w-full rounded-md focus:outline-none transition-colors duration-200 ease-in-out sm:text-sm
                    ${leadingIcon ? 'pl-10' : 'pl-3'}
                    ${trailingIcon ? 'pr-10' : 'pr-3'}
                    py-2
                    ${error 
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
                    {...props}
                />
                
                {trailingIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{trailingIcon}</span>
                    </div>
                )}
                
                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
            
            {error ? (
                <p className="mt-2 text-sm text-red-600" id={`${inputId}-error`}>
                    {error}
                </p>
            ) : helperText ? (
                <p className="mt-2 text-sm text-gray-500" id={`${inputId}-description`}>
                    {helperText}
                </p>
            ) : null}
        </div>
    );
};
