interface Props {
  label: string;
  value?: any;
  onChange: (value: string) => void;
  type?: string;
}

export default function EditableRow({
  label,
  value,
  onChange,
  type = "text",
}: Props) {
  return (
    <div className="border-b border-gray-100 py-3">
      <label className="text-xs text-gray-400">{label}</label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}