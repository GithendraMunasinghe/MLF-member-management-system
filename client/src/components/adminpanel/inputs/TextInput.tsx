interface Props {
  label: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
}

export default function TextInput({
  label,
  placeholder,
  type = "text",
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500 font-medium">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder || label}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}