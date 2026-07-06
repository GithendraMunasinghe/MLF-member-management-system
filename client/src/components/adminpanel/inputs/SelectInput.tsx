import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  options: (string | Option)[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  hideLabel?: boolean;
  size?: "default" | "sm";
  compact?: boolean;
}

export default function SelectInput({
  label,
  options,
  value = "",
  onChange,
  disabled = false,
  hideLabel = false,
  size = "default",
  compact = false,
}: Props) {
  const selectSizeClass =
    size === "sm"
      ? "px-3 py-2 text-sm"
      : "p-3";

  return (
    <div className={`flex flex-col ${compact ? "gap-0 mt-1" : "gap-1"}`}>
      {!hideLabel && (
        <label className="text-sm text-gray-500 font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          className={`
            w-full
            ${selectSizeClass}
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
          `}
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