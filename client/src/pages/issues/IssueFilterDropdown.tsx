import { useState, useRef, useEffect } from "react";
import { IssueTypeEnum } from "../../types";

const PinLegend: React.FC<{ color: string }> = ({ color }) => (
	<span
		aria-hidden="true"
		className="inline-block relative"
		style={{ width: 12, height: 18 }}
	>

		{/* head */}
		<span
		className="absolute left-1/2"
		style={{
					top: 0,
					width: 10,
					height: 10,
					transform: 'translateX(-50%)',
					background: color,
					borderRadius: '50%',
		}}
		/>

		{/* inner dot */}
		<span
		className="absolute left-1/2"
		style={{
					top: 3,
					width: 3,
					height: 3,
					transform: 'translateX(-50%)',
					background: 'white',
					borderRadius: '50%',
					opacity: 0.95,
		}}
		/>

		{/* tail */}
		<span
		className="absolute left-1/2"
		style={{
					top: 9,
					width: 0,
					height: 0,
					transform: 'translateX(-50%)',
					borderLeft: '4px solid transparent',
					borderRight: '4px solid transparent',
					borderTop: `8px solid ${color}`,
		}}
		/>
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
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
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
              <PinLegend color="green" />
              Obstruction
            </span>
          </label>

          <label className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTypes.includes(IssueTypeEnum.FLOODING)}
              onChange={() => toggleType(IssueTypeEnum.FLOODING)}
            />
            <span className="flex items-center gap-2">
              <PinLegend color="blue" />
              Standing Water/Mud
            </span>
          </label>

          <label className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTypes.includes(IssueTypeEnum.OTHER)}
              onChange={() => toggleType(IssueTypeEnum.OTHER)}
            />
            <span className="flex items-center gap-2">
              <PinLegend color="black" />
              Other
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