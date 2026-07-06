interface Props {
  label: string;
  value?: any;
}

export default function DetailRow({ label, value }: Props) {
  return (
    <div className="border-b border-gray-100 py-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value || "-"}</p>
    </div>
  );
}