import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  options: (string | Option)[];
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export default function SelectInput({
  label,
  options,
  onChange,
  disabled = false,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500 font-medium">
        {label}
      </label>

      {/* Wrapper */}
      <div className="relative">

        <select
          className="
            w-full
            p-3
            pr-10
            border
            rounded-lg
            appearance-none
            focus:ring-2
            focus:ring-blue-500
            outline-none
            disabled:bg-gray-100
            disabled:cursor-not-allowed
            bg-white
          "
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
        >
          <option value="">Select {label}</option>

          {options.map((opt, i) => {
            if (typeof opt === "string") {
              return (
                <option key={i} value={opt}>
                  {opt}
                </option>
              );
            }

            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>

        {/* Custom Arrow */}
        <ChevronDown
          size={18}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-gray-400
            pointer-events-none
          "
        />

      </div>
    </div>
  );
}