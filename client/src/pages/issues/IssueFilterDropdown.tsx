import {
    useState, useRef, useEffect 
} from 'react';
import { IssueTypeEnum } from '../../types';
import obstructionPin from '../../assets/obstructionPin.png';
import waterPin from '../../assets/waterPin.png';
import otherPin from '../../assets/otherPin.png';
import { IssueDropdown } from './components/IssueDropdown';

const iconForType = (t: IssueTypeEnum) => {
    if (t === 'OBSTRUCTION') 
    {return obstructionPin;}
    if (t === 'WATER') 
    {return waterPin;}
    return otherPin;
};
export const PinLegend: React.FC<{ type: IssueTypeEnum; label: string }> = ({ type, label }) => (
    <span className="flex items-center gap-2">
        <img
            src={iconForType(type)}
            alt=""
            aria-hidden="true"
            className="shrink-0"
            style={{ width: 15, height: 20 }}
        />
        {label}
    </span>
);

export const IssueFilterDropdown: React.FC<{
  selectedTypes: IssueTypeEnum[];
  toggleType: (t: IssueTypeEnum) => void;
  clear: () => void;
}> = ({ selectedTypes, toggleType, clear }) => {
    const [open, setOpen] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!boxRef.current) {return;}
            if (!boxRef.current.contains(e.target as Node)) {setOpen(false);}
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, []);

    const label =
    selectedTypes.length === 0 ? 'All Issues' : `${selectedTypes.length} selected`;

    const options = [
        { value: IssueTypeEnum.OBSTRUCTION, label: 'Obstruction' },
        { value: IssueTypeEnum.WATER, label: 'Standing Water/Mud' },
        { value: IssueTypeEnum.OTHER, label: 'Other' },
    ];

    const selectedTypeValues = selectedTypes.map((type) => String(type));

    return (
        <IssueDropdown
            triggerLabel={label}
            isOpen={open}
            onToggle={() => setOpen((v) => !v)}
            onSelect={(value) => toggleType(value as IssueTypeEnum)}
            selectedValues={selectedTypeValues}
            options={options}
            dropdownRef={boxRef}
            widthClass="w-auto"
            menuAlign="right"
            menuWidthClass="w-56"
            triggerClassName="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold shadow-sm flex items-center gap-0.75"
            renderOptionLabel={(option) => <PinLegend type={option.value as IssueTypeEnum} label={option.label} />}
            footer={(
                <div className="flex justify-between items-center px-3 pt-2 pb-1 mt-1 border-t border-gray-100">
                    <button
                        type="button"
                        className="text-sm underline text-gray-600"
                        onClick={() => {
                            clear();
                            setOpen(false);
                        }}
                    >
                        Clear filters
                    </button>

                    <button
                        type="button"
                        className="text-sm text-gray-700"
                        onClick={() => setOpen(false)}
                    >
                        Done
                    </button>
                </div>
            )}
        />
    );
};
