interface Props {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (value: string) => void;
}

export default function TextInput({
  label,
  placeholder,
  type = "text",
  value = "",
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500 font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}