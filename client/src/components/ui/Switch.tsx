// src/components/ui/Switch.tsx
import React from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`${className}`}>
            <button
                type="button"
                className={`
          relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
          transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        `}
                role="switch"
                aria-checked={checked}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
            >
                <span className="sr-only">Toggle</span>
                <span
                    aria-hidden="true"
                    className={`
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
            transition ease-in-out duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
                />
            </button>
        </div>
    );
};
