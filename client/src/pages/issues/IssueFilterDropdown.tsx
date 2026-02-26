import {
    useState, useRef, useEffect 
} from 'react';
import { IssueTypeEnum } from '../../types';
import obstructionPin from '../../assets/obstructionPin.png';
import waterPin from '../../assets/waterPin.png';
import otherPin from '../../assets/otherPin.png';

const iconForType = (t: IssueTypeEnum) => {
    if (t === 'OBSTRUCTION') 
    {return obstructionPin;}
    if (t === 'FLOODING') 
    {return waterPin;}
    return otherPin;
};
const PinLegend: React.FC<{ type: IssueTypeEnum; label: string }> = ({ type, label }) => (
    <span className="flex items-center gap-2">
        <img
            src={iconForType(type)}
            alt=""
            aria-hidden="true"
            className="shrink-0"
            style={{ width: 12, height: 18 }}
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
    selectedTypes.length === 0 ? 'All issues' : `${selectedTypes.length} selected`;

    return (
        <div ref={boxRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm shadow-sm flex items-center gap-2"
            >
                {label}
                <span className="text-gray-500">▾</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                    <label className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedTypes.includes(IssueTypeEnum.OBSTRUCTION)}
                            onChange={() => toggleType(IssueTypeEnum.OBSTRUCTION)}
                        />
                        <span className="flex items-center gap-2">
                            <PinLegend type={IssueTypeEnum.OBSTRUCTION} label="Obstruction" />
                        </span>
                    </label>

                    <label className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedTypes.includes(IssueTypeEnum.FLOODING)}
                            onChange={() => toggleType(IssueTypeEnum.FLOODING)}
                        />
                        <span className="flex items-center gap-2">
                            <PinLegend type={IssueTypeEnum.FLOODING} label="Standing Water/Mud" />
                        </span>
                    </label>

                    <label className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedTypes.includes(IssueTypeEnum.OTHER)}
                            onChange={() => toggleType(IssueTypeEnum.OTHER)}
                        />
                        <span className="flex items-center gap-2">
                            <PinLegend type={IssueTypeEnum.OTHER} label="Other" />
                        </span>
                    </label>

                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                        <button
                            type="button"
                            className="text-sm underline text-gray-600 px-2"
                            onClick={() => {
                                clear();
                                setOpen(false);
                            }}
                        >
              Clear filters
                        </button>

                        <button
                            type="button"
                            className="text-sm text-gray-700 px-2"
                            onClick={() => setOpen(false)}
                        >
              Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
