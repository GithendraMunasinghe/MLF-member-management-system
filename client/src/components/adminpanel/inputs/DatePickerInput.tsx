"use client";

interface Props {
  label: string;
  value?: string;
  onChange?: (date: string) => void;
}

export default function DatePickerInput({
  label,
  value = "",
  onChange,
}: Props) {
  const formatInput = (input: string) => {
    const numbers = input.replace(/\D/g, "").slice(0, 8);

    if (numbers.length <= 4) return numbers;

    if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    }

    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6)}`;
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500 font-medium">{label}</label>

      <input
        type="text"
        placeholder="YYYY-MM-DD"
        maxLength={10}
        value={value}
        onChange={(e) => onChange?.(formatInput(e.target.value))}
        className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}