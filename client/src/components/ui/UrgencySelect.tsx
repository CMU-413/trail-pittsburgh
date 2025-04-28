// src/components/ui/UrgencySelect.tsx
import React from 'react';
import { IssueUrgencyEnum } from '../../types';
import {
    getUrgencyLabel, getUrgencyColor, getUrgencyIconSize 
} from '../../utils/issueUrgencyUtils';

interface UrgencySelectProps {
    value: IssueUrgencyEnum;
    onChange: (level: IssueUrgencyEnum) => void;
    label?: string;
    helperText?: string;
}

export const UrgencySelect: React.FC<UrgencySelectProps> = ({
    value,
    onChange,
    label = 'Urgency Level',
    helperText = 'Select the urgency level based on safety risk and trail usability impact'
}) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    {label}
                </label>
            )}
            <div className="grid grid-cols-5 gap-2">
                {([
                    IssueUrgencyEnum.VERY_LOW,
                    IssueUrgencyEnum.LOW, 
                    IssueUrgencyEnum.MEDIUM, 
                    IssueUrgencyEnum.HIGH, 
                    IssueUrgencyEnum.VERY_HIGH
                ]).map((level) => (
                    <button
                        key={level}
                        type="button"
                        onClick={() => onChange(level)}
                        className={`
                            py-3 px-1 rounded-lg text-center border transition-all
                            ${value === level
                        ? `${getUrgencyColor(level)} ring-2 ring-offset-2 ring-blue-500 font-medium`
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}
                        `}
                    >
                        <div className="text-xs">{getUrgencyLabel(level)}</div>
                        <div className="mt-1 flex justify-center">
                            {Array.from({ length: 1 }).map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-${getUrgencyIconSize(level)} h-${getUrgencyIconSize(level)}`}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            ))}
                        </div>
                    </button>
                ))}
            </div>
            {helperText && (
                <p className="mt-2 text-xs text-gray-500">{helperText}</p>
            )}
        </div>
    );
};
