// src/components/ui/Select.tsx
import React from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    options: SelectOption[];
    error?: string;
    fullWidth?: boolean;
    onChange?: (value: string) => void;
    helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    fullWidth = false,
    className = '',
    id,
    onChange,
    helperText,
    disabled,
    ...props
}) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const widthClass = fullWidth ? 'w-full' : '';

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className={`${widthClass} ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    className={`
                        appearance-none 
                        block w-full 
                        px-3 py-2 
                        border border-gray-300 
                        rounded-md 
                        shadow-sm 
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-blue-500 
                        focus:border-blue-500 
                        transition-all 
                        duration-200 
                        ease-in-out
                        text-sm
                        ${error
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300'
                        }
                        ${disabled
                            ? 'bg-gray-100 cursor-not-allowed text-gray-500'
                            : 'bg-white'
                        }
                    `}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-description` : undefined}
                    onChange={handleChange}
                    disabled={disabled}
                    {...props}
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="text-sm"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Custom dropdown icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {error ? (
                <p
                    className="mt-1.5 text-sm text-red-600"
                    id={`${selectId}-error`}
                >
                    {error}
                </p>
            ) : helperText ? (
                <p
                    className="mt-1.5 text-sm text-gray-500"
                    id={`${selectId}-description`}
                >
                    {helperText}
                </p>
            ) : null}
        </div>
    );
};