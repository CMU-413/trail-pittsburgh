import React from 'react';

type EditDropdownOption = {
    value: string;
    label: string;
};

type IssueDropdownProps = {
    label?: string;
    triggerLabel: string;
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (value: string) => void;
    selectedValues: string[];
    options: EditDropdownOption[];
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    widthClass?: string;
    menuAlign?: 'left' | 'right';
    menuWidthClass?: string;
    triggerClassName?: string;
    menuClassName?: string;
    renderOptionLabel?: (option: EditDropdownOption) => React.ReactNode;
    footer?: React.ReactNode;
};

export const IssueDropdown: React.FC<IssueDropdownProps> = ({
    label,
    triggerLabel,
    isOpen,
    onToggle,
    onSelect,
    selectedValues,
    options,
    dropdownRef,
    widthClass = 'w-[220px]',
    menuAlign = 'left',
    menuWidthClass = 'w-full',
    triggerClassName,
    menuClassName,
    renderOptionLabel,
    footer,
}) => {
    const menuPositionClass = menuAlign === 'right' ? 'right-0' : 'left-0';
    const optionLabelRenderer = renderOptionLabel ?? ((option: EditDropdownOption) => <span>{option.label}</span>);

    return (
        <div ref={dropdownRef} className={`relative ${widthClass}`}>
            {label && (
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {label}
                </label>
            )}

            <button
                type="button"
                className={triggerClassName ?? 'w-full bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm inline-flex items-center justify-between gap-2'}
                onClick={onToggle}
            >
                <span>{triggerLabel}</span>
                <span className="text-black text-xl leading-none">▾</span>
            </button>

            {isOpen && (
                <div
                    className={menuClassName ?? [
                        'absolute mt-2 max-h-56 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-30',
                        menuPositionClass,
                        menuWidthClass,
                    ].join(' ')}
                >
                    {options.map((option) => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onSelect(option.value)}
                                className={[
                                    'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md text-left',
                                    isSelected ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                                ].join(' ')}
                            >
                                <span className="flex items-center gap-2">
                                    {optionLabelRenderer(option)}
                                </span>
                                <span className="text-xs text-gray-700" aria-hidden="true">
                                    {isSelected ? '✓' : ''}
                                </span>
                            </button>
                        );
                    })}

                    {footer}
                </div>
            )}
        </div>
    );
};

type IssueDetailEditDropdownProps = {
    label: string;
    valueLabel: string;
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (value: string) => void;
    selectedValue: string;
    options: EditDropdownOption[];
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    widthClass?: string;
};

export const IssueDetailEditDropdown: React.FC<IssueDetailEditDropdownProps> = ({
    label,
    valueLabel,
    isOpen,
    onToggle,
    onSelect,
    selectedValue,
    options,
    dropdownRef,
    widthClass = 'w-[220px]',
}) => {
    return (
        <IssueDropdown
            label={label}
            triggerLabel={valueLabel}
            isOpen={isOpen}
            onToggle={onToggle}
            onSelect={onSelect}
            selectedValues={[selectedValue]}
            options={options}
            dropdownRef={dropdownRef}
            widthClass={widthClass}
            menuAlign="left"
            menuWidthClass="w-full"
        />
    );
};
